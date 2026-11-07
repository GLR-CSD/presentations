/**
 * Flowchart & Diagram Builder (Fase 7B): generator + verliesvrije parser voor
 * het `.glr-diagram` component (HTML + inline SVG).
 *
 * Puur ESM zonder DOM, zodat het in de Studio, in Node-tests en in de MCP-server
 * draait. De geometrie hangt uitsluitend af van `layout` en het aantal
 * knooppunten (nooit van de tekst): tekst typen wijzigt dus alleen tekst-bytes
 * en een animatie kiezen alleen één attribuut.
 *
 * Harde invariant (zie scripts/test-parsers.js):
 *
 *     writeDiagramNode(src, node, parseDiagramNode(src, node)) === src
 *
 * Pijl-labels (`edgeLabel`) horen bij de INKOMENDE pijl van een knooppunt.
 */
import * as T from './html-tree.js';

const K = T.elementChildren;
const pad2 = (n) => String(n).padStart(2, '0');

/* ------------------------------------------------------------- constanten --- */

export const DIAGRAM_LAYOUTS = [
  ['linear-h', 'Horizontale Proces-Flow'],
  ['linear-v', 'Verticale Stappen-Flow'],
  ['decision', 'Beslisboom (If / Else)'],
  ['tree', 'Boomstructuur (Hiërarchie)'],
  ['cycle', 'Cyclus / Loop'],
];
export const FLOW_ANIMS = [
  ['none', 'Statische pijlen'],
  ['stream', 'Pulserende datastroom'],
  ['packets', 'Reizende datapakketjes'],
  ['ping-pong', 'Request ↔ Response ping-pong'],
];
export const NODE_VARIANTS = [
  ['default', 'Standaard'],
  ['accent', 'GLR Groen Accent'],
  ['decision', 'Beslissing'],
  ['code', 'Code-stijl'],
];
/** Maximaal aantal knooppunten dat de UI toestaat (renderen werkt voor elk aantal). */
export const LAYOUT_LIMITS = { 'linear-h': 5, 'linear-v': 5, decision: 5, tree: 6, cycle: 5 };

const LAYOUT_IDS = DIAGRAM_LAYOUTS.map((l) => l[0]);
const ANIM_IDS = FLOW_ANIMS.map((l) => l[0]);
const VARIANT_IDS = NODE_VARIANTS.map((l) => l[0]);

/* ------------------------------------------------------------- normaliseren --- */

const oneLine = (v) => String(v == null ? '' : v).replace(/\s*\r?\n\s*/g, ' ');

export function normalizeNode(n = {}) {
  return {
    k: oneLine(n.k),
    title: oneLine(n.title),
    text: oneLine(n.text),
    variant: VARIANT_IDS.includes(n.variant) ? n.variant : 'default',
    edgeLabel: oneLine(n.edgeLabel),
    fragment: !!n.fragment,
  };
}

export function normalizeDiagram(s = {}) {
  return {
    layout: LAYOUT_IDS.includes(s.layout) ? s.layout : 'linear-h',
    flowAnim: ANIM_IDS.includes(s.flowAnim) ? s.flowAnim : 'none',
    drawAnim: !!s.drawAnim,
    classes: (s.classes || []).filter((c) => c && c !== 'glr-diagram'),
    nodes: (s.nodes || []).map(normalizeNode),
  };
}

/** Heeft knooppunt `i` een inkomende pijl in deze layout? */
export function hasIncoming(layout, i) {
  return layout === 'cycle' ? true : i > 0;
}

/* ---------------------------------------------------------------- geometrie --- */

const fmt = (n) => { const r = Math.round(n * 10) / 10; return String(Object.is(r, -0) ? 0 : r); };
const fmt3 = (n) => String(Math.round(n * 1000) / 1000);
const box = (x, y, w, h) => ({ x, y, w, h });
const HEAD = 16;
const HEAD_W = 9;

function headD([tx, ty], dir) {
  const L = HEAD;
  const W = HEAD_W;
  const pts = {
    r: [[tx, ty], [tx - L, ty - W], [tx - L, ty + W]],
    l: [[tx, ty], [tx + L, ty - W], [tx + L, ty + W]],
    d: [[tx, ty], [tx - W, ty - L], [tx + W, ty - L]],
    u: [[tx, ty], [tx - W, ty + L], [tx + W, ty + L]],
  }[dir];
  return `${pts.map(([x, y], i) => `${i ? 'L' : 'M'}${fmt(x)} ${fmt(y)}`).join(' ')} Z`;
}

const back = ([x, y], dir, d) => ({ r: [x - d, y], l: [x + d, y], d: [x, y - d], u: [x, y + d] }[dir]);

/** Polylijn naar het pijlpunt-grondvlak; de pijlpunt zelf is een los driehoekje. */
function polyEdge(from, to, pts, dir, anchor) {
  const tip = pts[pts.length - 1];
  const trimmed = [...pts.slice(0, -1), back(tip, dir, HEAD - 2)];
  const d = trimmed.map(([x, y], i) => {
    if (i === 0) return `M${fmt(x)} ${fmt(y)}`;
    const [px, py] = trimmed[i - 1];
    if (y === py) return `H${fmt(x)}`;
    if (x === px) return `V${fmt(y)}`;
    return `L${fmt(x)} ${fmt(y)}`;
  }).join(' ');
  return { from, to, d, head: headD(tip, dir), anchor };
}

function rowBoxes(n, y, h) {
  const gap = n <= 3 ? 110 : n === 4 ? 90 : n === 5 ? 70 : 60;
  const w = Math.min(320, (1000 - (n - 1) * gap) / Math.max(1, n));
  const x0 = (1000 - (n * w + (n - 1) * gap)) / 2;
  return Array.from({ length: n }, (_, i) => box(x0 + i * (w + gap), y, w, h));
}

const GEOMETRY = {
  'linear-h'(n) {
    const boxes = rowBoxes(n, 75, 150);
    const edges = [];
    for (let i = 0; i < n - 1; i += 1) {
      const a = boxes[i];
      const b = boxes[i + 1];
      const cy = a.y + a.h / 2;
      edges.push(polyEdge(i, i + 1, [[a.x + a.w, cy], [b.x, cy]], 'r', [(a.x + a.w + b.x) / 2, cy]));
    }
    return { W: 1000, H: 300, boxes, edges };
  },

  'linear-v'(n) {
    const boxes = Array.from({ length: n }, (_, i) => box(80, i * 128, 400, 80));
    const edges = [];
    for (let i = 0; i < n - 1; i += 1) {
      const a = boxes[i];
      const b = boxes[i + 1];
      edges.push(polyEdge(i, i + 1, [[280, a.y + a.h], [280, b.y]], 'd', [280, (a.y + a.h + b.y) / 2]));
    }
    return { W: 560, H: Math.max(80, n * 80 + Math.max(0, n - 1) * 48), boxes, edges };
  },

  decision(n) {
    const m = Math.max(0, n - 2);
    const blockH = m * 100 + Math.max(0, m - 1) * 36;
    const H = Math.max(260, blockH + 40);
    const cy = H / 2;
    const boxes = [];
    if (n > 0) boxes.push(box(0, cy - 55, 230, 110));
    if (n > 1) boxes.push(box(345, cy - 55, 230, 110));
    for (let j = 0; j < m; j += 1) boxes.push(box(760, cy - blockH / 2 + j * 136, 240, 100));
    const edges = [];
    if (n > 1) edges.push(polyEdge(0, 1, [[230, cy], [345, cy]], 'r', [287.5, cy]));
    for (let j = 0; j < m; j += 1) {
      const oy = boxes[2 + j].y + 50;
      edges.push(polyEdge(1, 2 + j, [[575, cy], [640, cy], [640, oy], [760, oy]], 'r', [700, oy]));
    }
    return { W: 1000, H, boxes, edges };
  },

  tree(n) {
    const c = Math.max(0, n - 1);
    const boxes = [];
    if (n > 0) boxes.push(box(350, 0, 300, 110));
    const cw = c <= 3 ? 260 : c === 4 ? 210 : 170;
    const g = (1000 - c * cw) / (c + 1);
    for (let j = 0; j < c; j += 1) boxes.push(box(g + j * (cw + g), 220, cw, 110));
    const edges = [];
    for (let j = 0; j < c; j += 1) {
      const cx = boxes[1 + j].x + cw / 2;
      edges.push(polyEdge(0, 1 + j, [[500, 110], [500, 165], [cx, 165], [cx, 220]], 'd', [cx, 192]));
    }
    return { W: 1000, H: c > 0 ? 330 : 110, boxes, edges };
  },

  cycle(n) {
    const boxes = rowBoxes(n, 40, 140);
    const edges = [];
    for (let i = 0; i < n - 1; i += 1) {
      const a = boxes[i];
      const b = boxes[i + 1];
      edges.push(polyEdge(i, i + 1, [[a.x + a.w, 110], [b.x, 110]], 'r', [(a.x + a.w + b.x) / 2, 110]));
    }
    if (n > 0) {
      const first = boxes[0];
      const last = boxes[n - 1];
      const sx = last.x + last.w / 2 + (n === 1 ? 70 : 0);
      const ex = first.x + first.w / 2 - (n === 1 ? 70 : 0);
      const bottom = 180;
      edges.push({
        from: n - 1,
        to: 0,
        d: `M${fmt(sx)} ${bottom} C${fmt(sx)} 300 ${fmt(ex)} 300 ${fmt(ex)} ${bottom + HEAD - 2}`,
        head: headD([ex, bottom], 'u'),
        anchor: [(sx + ex) / 2, bottom + 0.75 * 120],
      });
    }
    return { W: 1000, H: 320, boxes, edges };
  },
};

/* ------------------------------------------------------------------ render --- */

/**
 * Deterministische `<div class="glr-diagram">`-HTML. Geen lege regels (die zouden
 * een markdown-htmlblok afbreken) en geen id's/markers (veilig bij meerdere slides).
 */
export function renderDiagramHtml(state, { indent = '' } = {}) {
  const s = normalizeDiagram(state);
  const n = s.nodes.length;
  const g = GEOMETRY[s.layout](n);
  const pct = (v, total) => fmt((v / total) * 100);
  const lines = [];
  const cls = ['glr-diagram', ...s.classes].map(T.escapeAttr).join(' ');
  lines.push(`<div class="${cls}" data-diagram-layout="${s.layout}" data-flow-anim="${s.flowAnim}"${s.drawAnim ? ' data-draw-anim="true"' : ''} style="--glr-dia-ar:${fmt3(g.W / g.H)};--glr-dia-w:${g.W}">`);
  lines.push(`  <svg class="glr-dedges" viewBox="0 0 ${g.W} ${g.H}" aria-hidden="true" focusable="false">`);
  for (const e of g.edges) {
    lines.push(`    <path class="glr-dedge" data-from="${e.from}" data-to="${e.to}" style="--i:${e.to}" pathLength="1" d="${e.d}"></path>`);
    lines.push(`    <path class="glr-dhead" data-to="${e.to}" style="--i:${e.to}" d="${e.head}"></path>`);
  }
  lines.push('  </svg>');
  s.nodes.forEach((nd, i) => {
    const b = g.boxes[i];
    const nodeCls = ['glr-dnode', nd.variant !== 'default' && `glr-dnode--${nd.variant}`, nd.fragment && 'fragment'].filter(Boolean).join(' ');
    const parts = [];
    if (nd.k !== '') parts.push(`<span class="k">${T.escapeText(nd.k)}</span>`);
    if (nd.title !== '') parts.push(`<h3>${T.escapeText(nd.title)}</h3>`);
    if (nd.text !== '') parts.push(`<p>${T.escapeText(nd.text)}</p>`);
    if (nd.edgeLabel !== '') {
      const incoming = g.edges.find((e) => e.to === i);
      if (incoming) {
        const [ax, ay] = incoming.anchor;
        parts.push(`<span class="glr-dedge-label" style="left:${fmt(((ax - b.x) / b.w) * 100)}%;top:${fmt(((ay - b.y) / b.h) * 100)}%">${T.escapeText(nd.edgeLabel)}</span>`);
      } else {
        parts.push(`<span class="glr-dedge-label" hidden style="left:50%;top:-12%">${T.escapeText(nd.edgeLabel)}</span>`);
      }
    }
    lines.push(`  <div class="${nodeCls}" data-i="${i}" style="--i:${i};left:${pct(b.x, g.W)}%;top:${pct(b.y, g.H)}%;width:${pct(b.w, g.W)}%;height:${pct(b.h, g.H)}%">${parts.join('')}</div>`);
  });
  lines.push('</div>');
  return lines.map((l, i) => (i ? indent + l : l)).join('\n');
}

/* ------------------------------------------------------------ lezen/schrijven --- */

const isDnode = (c) => T.hasClass(c, 'glr-dnode');
const childTag = (el, tag) => K(el).find((c) => c.tag === tag);
const childCls = (el, cls) => K(el).find((c) => T.hasClass(c, cls));

/** Leest een `.glr-diagram`-element verliesvrij naar een state-object. */
export function parseDiagramNode(src, node) {
  const text = (el) => (el ? T.rawTextOf(src, el) : '');
  return normalizeDiagram({
    layout: T.getAttr(node, 'data-diagram-layout'),
    flowAnim: T.getAttr(node, 'data-flow-anim'),
    drawAnim: T.getAttr(node, 'data-draw-anim') === 'true',
    classes: T.classesOf(node),
    nodes: K(node).filter(isDnode).map((el) => ({
      k: text(childCls(el, 'k')),
      title: text(childTag(el, 'h3')),
      text: text(childTag(el, 'p')),
      variant: ['accent', 'decision', 'code'].find((v) => T.hasClass(el, `glr-dnode--${v}`)) || 'default',
      edgeLabel: text(childCls(el, 'glr-dedge-label')),
      fragment: T.hasClass(el, 'fragment'),
    })),
  });
}

/** Schrijft `newState` terug; is er niets veranderd, dan blijft `src` byte-identiek. */
export function writeDiagramNode(src, node, newState) {
  const cur = parseDiagramNode(src, node);
  const next = normalizeDiagram(newState);
  if (JSON.stringify(cur) === JSON.stringify(next)) return src;
  return T.replaceNode(src, node, renderDiagramHtml(next, { indent: T.indentOf(src, node) ?? '' }));
}

/* --------------------------------------------------------------- bewerkingen --- */

const DEFAULT_TITLE = { 'linear-h': 'Nieuwe stap', 'linear-v': 'Nieuwe stap', decision: 'Nieuwe uitkomst', tree: 'Nieuw kind', cycle: 'Nieuwe stap' };

/** Pure state → state bewerkingen (onveranderlijk). */
export const diagramOps = {
  add(s) {
    if (s.nodes.length >= LAYOUT_LIMITS[s.layout]) return s;
    const node = normalizeNode({ k: pad2(s.nodes.length + 1), title: DEFAULT_TITLE[s.layout], text: 'Korte toelichting.' });
    return { ...s, nodes: [...s.nodes, node] };
  },
  remove(s, i) {
    if (s.nodes.length <= 1 || !s.nodes[i]) return s;
    return { ...s, nodes: s.nodes.filter((_, j) => j !== i) };
  },
  move(s, i, dir) {
    const j = i + dir;
    if (!s.nodes[i] || !s.nodes[j]) return s;
    const nodes = [...s.nodes];
    [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
    return { ...s, nodes };
  },
  patch(s, i, patch) {
    if (!s.nodes[i]) return s;
    return { ...s, nodes: s.nodes.map((n, j) => (j === i ? { ...n, ...patch } : n)) };
  },
};

/** Rol-naam van knooppunt `i` voor titels in het Properties Panel. */
export function roleLabel(layout, i) {
  if (layout === 'decision') return i === 0 ? 'Start' : i === 1 ? 'Beslissing' : `Uitkomst ${i - 1}`;
  if (layout === 'tree') return i === 0 ? 'Hoofd' : `Kind ${i}`;
  return `Stap ${i + 1}`;
}

/* ------------------------------------------------------------------ presets --- */

const nd = (k, title, text, extra = {}) => ({ k, title, text, ...extra });

export const DIAGRAM_PRESETS = [
  {
    label: 'Proces-flow (Client → API → Database)', icon: 'git-branch',
    state: {
      layout: 'linear-h', flowAnim: 'ping-pong', drawAnim: false,
      nodes: [
        nd('01', 'Client', 'Browser of app', { variant: 'accent' }),
        nd('02', 'API', 'Verwerkt het verzoek', { edgeLabel: 'Request' }),
        nd('03', 'Database', 'Slaat gegevens op', { variant: 'code', edgeLabel: 'Query' }),
      ],
    },
  },
  {
    label: 'Stappenplan (verticaal)', icon: 'git-branch',
    state: {
      layout: 'linear-v', flowAnim: 'stream', drawAnim: false,
      nodes: [nd('01', 'Plan', 'Bedenk wat je gaat maken'), nd('02', 'Bouw', 'Werk het uit', { variant: 'accent' }), nd('03', 'Test', 'Controleer het resultaat')],
    },
  },
  {
    label: 'Beslisboom (If / Else)', icon: 'git-branch',
    state: {
      layout: 'decision', flowAnim: 'none', drawAnim: false,
      nodes: [
        nd('Start', 'Gebruiker logt in', 'Vult e-mail en wachtwoord in'),
        nd('Conditie', 'Wachtwoord correct?', '', { variant: 'decision' }),
        nd('If', 'Toegang', 'Naar het dashboard', { variant: 'accent', edgeLabel: 'Ja / True' }),
        nd('Else', 'Foutmelding', 'Probeer opnieuw', { edgeLabel: 'Nee / False' }),
      ],
    },
  },
  {
    label: 'Boomstructuur (DOM-tree)', icon: 'network',
    state: {
      layout: 'tree', flowAnim: 'none', drawAnim: false,
      nodes: [nd('Root', '<html>', 'Het hoofd-element', { variant: 'code' }), nd('Kind', '<head>', 'Metadata'), nd('Kind', '<body>', 'Zichtbare inhoud')],
    },
  },
  {
    label: 'Cyclus (Scrum-sprint)', icon: 'git-branch',
    state: {
      layout: 'cycle', flowAnim: 'stream', drawAnim: false,
      nodes: [nd('01', 'Plan', 'Sprint planning', { variant: 'accent', edgeLabel: 'Herhaal' }), nd('02', 'Bouw', 'Dagelijks werken'), nd('03', 'Review', 'Demo aan de klant'), nd('04', 'Retro', 'Wat kan beter?')],
    },
  },
];

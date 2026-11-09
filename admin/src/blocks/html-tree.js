/**
 * Bron-behoudende HTML-boom.
 *
 * Parseert een HTML-fragment naar een boom waarvan elke node zijn exacte
 * byte-offsets in de bron kent. Alle edit-primitieven geven een NIEUWE string
 * terug die uitsluitend via splices op de bron ontstaat; wat niet gewijzigd
 * wordt, blijft dus byte-identiek (entities, quotes, whitespace, `<br/>` …).
 *
 * Geen DOM nodig: werkt in de browser én in Node (scripts/test-parsers.js).
 *
 * Paden: een pad is een lijst element-indexen (alleen elementen, geen tekst).
 * `[0, 2]` = derde element-kind van het eerste root-element.
 */

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style']);

export const INLINE_TAGS = new Set(['a', 'b', 'strong', 'i', 'em', 'u', 'code', 'br', 'span', 'mark', 'small', 'sub', 'sup', 'kbd', 's', 'abbr']);

/* ------------------------------------------------------------------ parse --- */

/**
 * @typedef {object} El
 * @property {'el'} type
 * @property {string} tag        lowercase tagnaam
 * @property {number} start      index van `<`
 * @property {number} openEnd    index NA het `>` van de open-tag
 * @property {number} closeStart index van `</` (== openEnd bij void/self-closing)
 * @property {number} end        index NA de sluit-tag
 * @property {Array} attrs
 * @property {El|object} parent
 * @property {Array} children    elementen + tekst + comments (in volgorde)
 * @property {boolean} voidEl
 */

export function parse(src) {
  const root = { type: 'root', tag: '#root', start: 0, openEnd: 0, closeStart: src.length, end: src.length, attrs: [], children: [], parent: null };
  const stack = [root];
  let i = 0;
  const top = () => stack[stack.length - 1];
  const pushText = (a, b) => {
    if (b > a) top().children.push({ type: 'text', start: a, end: b, parent: top() });
  };

  while (i < src.length) {
    const lt = src.indexOf('<', i);
    if (lt === -1) { pushText(i, src.length); break; }
    pushText(i, lt);

    if (src.startsWith('<!--', lt)) {
      const e = src.indexOf('-->', lt + 4);
      const end = e === -1 ? src.length : e + 3;
      top().children.push({ type: 'comment', start: lt, end, parent: top() });
      i = end;
      continue;
    }
    if (src[lt + 1] === '/') {
      const gt = src.indexOf('>', lt);
      const end = gt === -1 ? src.length : gt + 1;
      const name = src.slice(lt + 2, gt === -1 ? src.length : gt).trim().toLowerCase();
      // zoek de bijpassende open-tag op de stack (tolerant bij ontbrekende sluittags)
      let k = stack.length - 1;
      while (k > 0 && stack[k].tag !== name) k -= 1;
      if (k > 0) {
        while (stack.length - 1 > k) {
          const lost = stack.pop();
          lost.closeStart = lost.end = lt;
        }
        const el = stack.pop();
        el.closeStart = lt;
        el.end = end;
      }
      i = end;
      continue;
    }
    const m = /^<([a-zA-Z][^\s/>]*)/.exec(src.slice(lt, lt + 80));
    if (!m) { pushText(lt, lt + 1); i = lt + 1; continue; }

    const tag = m[1].toLowerCase();
    let p = lt + m[0].length;
    const attrs = [];
    let selfClose = false;
    while (p < src.length) {
      while (p < src.length && /\s/.test(src[p])) p += 1;
      if (src[p] === '>') { p += 1; break; }
      if (src[p] === '/' && src[p + 1] === '>') { selfClose = true; p += 2; break; }
      if (src[p] === '/') { p += 1; continue; }
      const nm = /^[^\s=/>]+/.exec(src.slice(p, p + 200));
      if (!nm) { p += 1; continue; }
      const a = { name: nm[0], lname: nm[0].toLowerCase(), start: p, end: p + nm[0].length, value: null, vStart: -1, vEnd: -1, quote: '' };
      p += nm[0].length;
      let q = p;
      while (q < src.length && /\s/.test(src[q])) q += 1;
      if (src[q] === '=') {
        q += 1;
        while (q < src.length && /\s/.test(src[q])) q += 1;
        const c = src[q];
        if (c === '"' || c === "'") {
          const close = src.indexOf(c, q + 1);
          const ce = close === -1 ? src.length : close;
          a.quote = c; a.vStart = q + 1; a.vEnd = ce; a.value = src.slice(q + 1, ce);
          a.end = Math.min(ce + 1, src.length);
          p = a.end;
        } else {
          const um = /^[^\s>]+/.exec(src.slice(q, q + 500)) || [''];
          a.vStart = q; a.vEnd = q + um[0].length; a.value = um[0]; a.end = a.vEnd; p = a.end;
        }
      }
      attrs.push(a);
    }
    const el = { type: 'el', tag, start: lt, openEnd: p, closeStart: p, end: p, attrs, children: [], parent: top(), voidEl: VOID.has(tag) || selfClose };
    top().children.push(el);
    i = p;
    if (el.voidEl) continue;
    if (RAW.has(tag)) {
      const re = new RegExp(`</${tag}\\s*>`, 'i');
      const rest = src.slice(p);
      const mm = re.exec(rest);
      if (mm) { el.closeStart = p + mm.index; el.end = el.closeStart + mm[0].length; i = el.end; }
      else { el.closeStart = el.end = src.length; i = src.length; }
      continue;
    }
    stack.push(el);
  }
  while (stack.length > 1) { const lost = stack.pop(); lost.closeStart = lost.end = src.length; }
  root.src = src;
  return root;
}

/* ------------------------------------------------------------------ lookup --- */

export const elementChildren = (node) => node.children.filter((c) => c.type === 'el');

export function nodeAt(root, path) {
  let node = root;
  for (const idx of path) {
    node = elementChildren(node)[idx];
    if (!node) return null;
  }
  return node;
}

export function pathOf(node) {
  const path = [];
  let n = node;
  while (n && n.parent) {
    path.unshift(elementChildren(n.parent).indexOf(n));
    n = n.parent;
  }
  return path;
}

export function walk(root, fn, path = []) {
  elementChildren(root).forEach((el, i) => {
    const p = [...path, i];
    if (fn(el, p) === false) return;
    walk(el, fn, p);
  });
}

export const getAttr = (node, name) => {
  const a = node.attrs.find((x) => x.lname === name);
  return a ? (a.value == null ? '' : a.value) : null;
};
export const hasAttr = (node, name) => node.attrs.some((x) => x.lname === name);
export const classesOf = (node) => (getAttr(node, 'class') || '').split(/\s+/).filter(Boolean);
export const hasClass = (node, cls) => classesOf(node).includes(cls);

/** Eerste (diepe) kind-element met deze klasse. */
export function findByClass(node, cls, deep = true) {
  for (const c of elementChildren(node)) {
    if (hasClass(c, cls)) return c;
    if (deep) { const r = findByClass(c, cls, true); if (r) return r; }
  }
  return null;
}

/* ----------------------------------------------------------------- entities --- */

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·', hellip: '…', ndash: '–', mdash: '—', rarr: '→', larr: '←', times: '×', laquo: '«', raquo: '»', euro: '€', copy: '©' };
export function decodeEntities(s) {
  return String(s).replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, g) => {
    if (g[0] === '#') {
      const code = g[1] === 'x' || g[1] === 'X' ? parseInt(g.slice(2), 16) : parseInt(g.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return NAMED[g] != null ? NAMED[g] : m;
  });
}
export const escapeText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/* -------------------------------------------------------------------- text --- */

export const innerHtml = (src, node) => src.slice(node.openEnd, node.closeStart);

/** Zichtbare platte tekst van een node (tags weg, entities gedecodeerd, <br> = spatie). */
export function textOf(src, node) {
  const raw = innerHtml(src, node).replace(/<!--[\s\S]*?-->/g, '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '');
  return decodeEntities(raw).replace(/\s+/g, ' ').trim();
}

/** Alleen directe tekst (zonder kinderen), niet ge-trimd: voor leaf-elementen. */
export const rawTextOf = (src, node) => decodeEntities(innerHtml(src, node));

export const isLeaf = (node) => !node.children.some((c) => c.type === 'el');

/** Bevat deze node enkel tekst + inline-elementen (kan als één tekstveld)? */
export function isTextish(node) {
  if (node.voidEl) return false;
  return node.children.every((c) => c.type !== 'el' || (INLINE_TAGS.has(c.tag) && isTextish(c) || c.tag === 'br'));
}

/* ----------------------------------------------------------------- splices --- */

const splice = (src, a, b, str) => src.slice(0, a) + str + src.slice(b);

/** Vervangt de tekst van een leaf-element; ongewijzigde tekst blijft byte-identiek. */
export function setText(src, node, text) {
  if (rawTextOf(src, node) === text) return src;
  return splice(src, node.openEnd, node.closeStart, escapeText(text));
}

export function setInnerHtml(src, node, html) {
  if (innerHtml(src, node) === html) return src;
  return splice(src, node.openEnd, node.closeStart, html);
}

/* -------------------------------------------------------------- attributes --- */

export function setAttr(src, node, name, value) {
  const a = node.attrs.find((x) => x.lname === name);
  const v = escapeAttr(value);
  if (a) {
    if (a.value === value || a.value === v) return src;
    if (a.vStart === -1) return splice(src, a.end, a.end, `="${v}"`);
    if (a.quote === '') return splice(src, a.start, a.end, `${a.name}="${v}"`);
    return splice(src, a.vStart, a.vEnd, a.quote === "'" ? v.replace(/'/g, '&#39;') : v);
  }
  // nieuw attribuut: vóór `>` / `/>`
  let at = node.openEnd - 1;
  if (src[at - 1] === '/') at -= 1;
  while (at > node.start && /\s/.test(src[at - 1])) at -= 1;
  return splice(src, at, at, ` ${name}="${v}"`);
}

export function removeAttr(src, node, name) {
  const a = node.attrs.find((x) => x.lname === name);
  if (!a) return src;
  let s = a.start;
  while (s > node.start && /\s/.test(src[s - 1])) s -= 1;
  return splice(src, s, a.end, '');
}

/** Zet een klasse aan/uit; bestaande volgorde blijft behouden. */
export function setClass(src, node, cls, on) {
  const list = classesOf(node);
  const has = list.includes(cls);
  if (on === has) return src;
  const next = on ? [...list, cls] : list.filter((c) => c !== cls);
  if (!next.length) return removeAttr(src, node, 'class');
  return setAttr(src, node, 'class', next.join(' '));
}

/** Vervangt een set klassen (`remove`) door één (`add`); de nieuwe klasse komt op de plek van de eerste oude. */
export function swapClass(src, node, remove, add) {
  const list = classesOf(node);
  const next = [];
  let placed = !add;
  for (const c of list) {
    if (remove.includes(c)) {
      if (!placed) { next.push(add); placed = true; }
    } else if (c !== add) next.push(c);
  }
  if (!placed && !next.includes(add)) next.push(add);
  if (next.join(' ') === list.join(' ')) return src;
  if (!next.length) return removeAttr(src, node, 'class');
  return setAttr(src, node, 'class', next.join(' '));
}

export const toggleFragmentHtml = (src, node, on) => setClass(src, node, 'fragment', on);

/* ------------------------------------------------------------ inline style --- */

const styleDecls = (style) => String(style || '').split(';').map((d) => d.trim()).filter(Boolean)
  .map((d) => { const i = d.indexOf(':'); return i < 0 ? [d, ''] : [d.slice(0, i).trim(), d.slice(i + 1).trim()]; });

/** Waarde van één CSS-declaratie in het style-attribuut (of null). */
export function getStyleProp(node, name) {
  const hit = styleDecls(getAttr(node, 'style')).find(([k]) => k === name);
  return hit ? hit[1] : null;
}

/** Zet/verwijdert één declaratie; overige declaraties blijven ongemoeid. Leeg style-attribuut wordt verwijderd. */
export function setStyleProp(src, node, name, value) {
  const decls = styleDecls(getAttr(node, 'style'));
  const idx = decls.findIndex(([k]) => k === name);
  const cur = idx >= 0 ? decls[idx][1] : null;
  if ((value == null || value === '') ? cur === null : cur === value) return src;
  if (value == null || value === '') decls.splice(idx, 1);
  else if (idx >= 0) decls[idx][1] = value;
  else decls.push([name, value]);
  if (!decls.length) return removeAttr(src, node, 'style');
  return setAttr(src, node, 'style', decls.map(([k, v]) => `${k}:${v}`).join(';'));
}

/* --------------------------------------------------------- structure edits --- */

/** Inspringing (spaties/tabs) vóór een node als die als eerste op zijn regel staat; anders null. */
function indentOf(src, node) {
  const nl = src.lastIndexOf('\n', node.start - 1);
  const lead = src.slice(nl + 1, node.start);
  return nl !== -1 && /^[ \t]*$/.test(lead) ? lead : null;
}

export function removeNode(src, node) {
  const indent = indentOf(src, node);
  if (indent !== null) {
    // verwijder ook de regel-inspringing + voorafgaande newline
    return splice(src, node.start - indent.length - 1, node.end, '');
  }
  return splice(src, node.start, node.end, '');
}

/** Voegt `html` in als sibling direct NA node, met dezelfde inspringing. */
export function insertAfter(src, node, html) {
  const indent = indentOf(src, node);
  const ins = indent !== null ? `\n${indent}${html}` : html;
  return splice(src, node.end, node.end, ins);
}

/** Voegt `html` in als sibling direct VOOR node, met dezelfde inspringing. */
export function insertBefore(src, node, html) {
  const indent = indentOf(src, node);
  return splice(src, node.start, node.start, indent !== null ? `${html}\n${indent}` : html);
}

export function duplicateNode(src, node) {
  return insertAfter(src, node, src.slice(node.start, node.end));
}

/** Voegt `html` toe als laatste kind van node. */
export function appendChild(src, node, html) {
  const kids = elementChildren(node);
  if (kids.length) return insertAfter(src, kids[kids.length - 1], html);
  return splice(src, node.closeStart, node.closeStart, html);
}

export function prependChild(src, node, html) {
  const kids = elementChildren(node);
  if (kids.length) {
    const first = kids[0];
    const indent = indentOf(src, first);
    const ins = indent !== null ? `${html}\n${indent}` : html;
    return splice(src, first.start, first.start, ins);
  }
  return splice(src, node.openEnd, node.openEnd, html);
}

/** Wisselt een element-node met zijn vorige (dir=-1) of volgende (dir=+1) sibling. */
export function moveNode(src, node, dir) {
  const sibs = elementChildren(node.parent);
  const i = sibs.indexOf(node);
  const j = i + dir;
  if (i === -1 || j < 0 || j >= sibs.length) return src;
  const a = sibs[Math.min(i, j)];
  const b = sibs[Math.max(i, j)];
  return src.slice(0, a.start) + src.slice(b.start, b.end) + src.slice(a.end, b.start) + src.slice(a.start, a.end) + src.slice(b.end);
}

export const nodeHtml = (src, node) => src.slice(node.start, node.end);

/* -------------------------------------------------------------- annotatie --- */

/**
 * Zet `data-bi` (blokindex) + `data-bp` (pad) op elke element-open-tag.
 * Alleen voor de preview-weergave; nooit in opgeslagen bestanden.
 */
export function annotate(src, blockIndex) {
  const root = parse(src);
  const inserts = [];
  walk(root, (el, path) => {
    inserts.push([el.start + 1 + el.tag.length, ` data-bi="${blockIndex}" data-bp="${path.join('.')}"`]);
    if (RAW.has(el.tag)) return false;
    return true;
  });
  let out = src;
  for (const [pos, str] of inserts.sort((a, b) => b[0] - a[0])) out = splice(out, pos, pos, str);
  return out;
}

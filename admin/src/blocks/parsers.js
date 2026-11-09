/**
 * Twee-weg parsers: GLR-HTML ⇄ formulier (voor het Properties Panel).
 *
 * Elk component beschrijft zijn formulier als een lijst velden. Elk veld heeft
 * een `apply(src, node, waarde) → nieuwe src` die uitsluitend via de
 * bron-behoudende boom (html-tree.js) splicet. Daardoor is de invariant:
 *
 *     apply(src, node, huidigeWaarde) === src      (zie scripts/test-parsers.js)
 *
 * `node` is altijd het component-root-element, vers geparsed uit `src`; kinderen
 * worden binnen `apply` opnieuw opgezocht (geen verouderde offsets).
 *
 * Veldtypes: text, textarea, rich, select, toggle, color, hues, image, code,
 * chips, section, repeater. De UI staat in ui/form-kit.js.
 */
import * as T from './html-tree.js';

const K = T.elementChildren;
const has = T.hasClass;
const hasAny = (n, list) => list.some((c) => has(n, c));

/** Herparse en zoek dezelfde node terug (na een eerdere edit in dezelfde apply). */
const fresh = (src, node) => T.nodeAt(T.parse(src), T.pathOf(node));
const byTag = (node, tag) => {
  for (const c of K(node)) {
    if (c.tag === tag) return c;
    const r = byTag(c, tag);
    if (r) return r;
  }
  return null;
};
const cl = (cls) => (n) => (has(n, cls) ? n : T.findByClass(n, cls));
const tg = (tag) => (n) => (n.tag === tag ? n : byTag(n, tag));
const pad2 = (n) => String(n).padStart(2, '0');
const esc = T.escapeText;

/* ----------------------------------------------------------- veld-bouwers --- */

/** Tekstveld (leaf → text, gemengd inline → rich). `opts.create(src,node,v)` maakt het element aan als het ontbreekt. */
function tf(label, locate, opts = {}) {
  return (src, node) => {
    const el = locate(node);
    if (!el && !opts.always) return null;
    const rich = el ? !T.isLeaf(el) : !!opts.rich;
    return {
      kind: opts.multiline && !rich ? 'textarea' : (rich ? 'rich' : 'text'),
      label,
      badge: opts.badge || (el ? badgeOf(el) : ''),
      placeholder: opts.placeholder || '',
      value: el ? (rich ? T.innerHtml(src, el) : T.rawTextOf(src, el)) : '',
      apply: (s, n, v) => {
        const e = locate(n);
        if (e) {
          if (opts.removeWhenEmpty && v === '') return T.removeNode(s, e);
          return T.isLeaf(e) && !rich ? T.setText(s, e, v) : T.setInnerHtml(s, e, v);
        }
        return v !== '' && opts.create ? opts.create(s, n, v) : s;
      },
    };
  };
}

/** Schakelaar voor een klasse op het (via locate gevonden) element. */
function clsToggle(label, locate, cls) {
  return (src, node) => {
    const el = locate(node);
    if (!el) return null;
    return { kind: 'toggle', label, badge: `.${cls}`, value: has(el, cls), apply: (s, n, v) => { const e = locate(n); return e ? T.setClass(s, e, cls, !!v) : s; } };
  };
}

/** Dropdown die één klasse uit een set kiest. */
function clsSelect(label, locate, options) {
  const all = options.map((o) => o[0]).filter(Boolean);
  return (src, node) => {
    const el = locate(node);
    if (!el) return null;
    const cur = all.find((c) => has(el, c)) || '';
    return {
      kind: 'select', label, value: cur, options,
      apply: (s, n, v) => { const e = locate(n); return e && (v || '') !== cur ? T.swapClass(s, e, all, v || '') : s; },
    };
  };
}

const run = (builders, src, node) => builders.map((b) => b(src, node)).filter(Boolean);

function badgeOf(el) {
  const c = T.classesOf(el).find((x) => x !== 'fragment');
  return c ? `${el.tag} · .${c}` : el.tag;
}

/* ---------------------------------------------------------------- items --- */

const CARD_CLS = ['glr-card', 'card'];
const isCard = (n) => hasAny(n, CARD_CLS);

/** Placeholder-tekst voor een nieuw (gekloond) item. */
function blank(el) {
  if (has(el, 'k')) return 'Label';
  if (has(el, 'n')) return '00';
  if (has(el, 'hex')) return '#CCCCCC';
  if (has(el, 'q')) return 'Naam';
  if (/^h\d$/.test(el.tag)) return 'Titel';
  return 'Tekst';
}

/** Dupliceert `item` en zet alle tekstbladeren van de kopie op een placeholder. */
function cloneBlank(src, item, { keepFragment = true } = {}) {
  let out = T.duplicateNode(src, item);
  let copy = T.nodeAt(T.parse(out), T.pathOf(item).slice(0, -1).concat(K(item.parent).indexOf(item) + 1));
  const leaves = [];
  T.walk(copy, (el) => { if (T.isLeaf(el) && !el.voidEl && T.rawTextOf(out, el).trim() !== '' && !['svg', 'circle', 'path'].includes(el.tag)) leaves.push(T.pathOf(el)); return true; });
  for (const p of leaves.reverse()) {
    const el = T.nodeAt(T.parse(out), p);
    out = T.setText(out, el, blank(el));
  }
  if (!keepFragment) {
    copy = T.nodeAt(T.parse(out), T.pathOf(item).slice(0, -1).concat(K(item.parent).indexOf(item) + 1));
    out = T.setClass(out, copy, 'fragment', false);
  }
  return out;
}

/** Bouwt een repeater-veld. */
function repeater({ label, addLabel, itemsOf, itemTitle, itemFields, addDefault }) {
  return (src, node) => {
    const items = itemsOf(node);
    return {
      kind: 'repeater', label, addLabel,
      items: items.map((it, i) => ({
        title: itemTitle(src, it, i),
        fields: itemFields(src, it, i),
        path: T.pathOf(it),
      })),
      add: (s, n) => {
        const list = itemsOf(n);
        if (list.length) return cloneBlank(s, list[list.length - 1]);
        return addDefault ? addDefault(s, n) : s;
      },
      remove: (s, n, i) => { const it = itemsOf(n)[i]; return it ? T.removeNode(s, it) : s; },
      move: (s, n, i, dir) => { const it = itemsOf(n)[i]; return it ? T.moveNode(s, it, dir) : s; },
    };
  };
}

/** Veld dat een item-veld bindt aan item `i` van de lijst. */
function itemField(itemsOf, i, builder) {
  // builder(src, itemNode) → veld; apply wordt omgebogen naar vers item i.
  return (src, root) => {
    const it = itemsOf(root)[i];
    if (!it) return null;
    const f = builder(src, it);
    if (!f) return null;
    const inner = f.apply;
    return { ...f, apply: (s, n, v) => { const cur = itemsOf(n)[i]; return cur ? inner(s, cur, v) : s; } };
  };
}

/** Maakt item-velden voor repeater: elke builder werkt op het item zelf. */
function bindItem(itemsOf, i, builders) {
  return builders.map((b) => itemField(itemsOf, i, b));
}

/** Zorgt dat `container` een kind `<tag class>` heeft; maakt het anders aan. */
function createChild(tag, cls, { first = false } = {}) {
  return (s, container, v) => {
    const html = `<${tag}${cls ? ` class="${cls}"` : ''}>${esc(v)}</${tag}>`;
    return first ? T.prependChild(s, container, html) : T.appendChild(s, container, html);
  };
}

/* ======================================================= componenten ===== */

const COMPONENTS = [];
const def = (c) => COMPONENTS.push(c);

/* 1. Footer */
def({
  id: 'footer', label: 'Footer', icon: 'footer', structured: true,
  match: (src, n) => has(n, 'footer'),
  form: (src, n) => run([
    tf('Voettekst links', (x) => K(x).find((c) => !has(c, 'num')), { badge: 'span' }),
    tf('Paginanummer / rechts (.num)', cl('num'), { badge: '.num' }),
  ], src, n),
});

/* 2. Definitiebox */
def({
  id: 'defbox', label: 'Definitiebox', icon: 'book', structured: true,
  match: (src, n) => has(n, 'defbox'),
  form: (src, n) => run([
    tf('Label / Categorie (.k)', cl('k'), { badge: '.k', always: true, create: createChild('span', 'k', { first: true }) }),
    tf('Titel (optioneel)', tg('h3'), { always: true, removeWhenEmpty: true, create: (s, node, v) => { const k = cl('k')(node); const h = `<h3>${esc(v)}</h3>`; return k ? T.insertAfter(s, k, h) : T.prependChild(s, node, h); } }),
    tf('Definitie / Uitleg (p)', tg('p'), { always: true, create: createChild('p', '') }),
    clsToggle('Compact formaat (.defbox--sm)', (x) => x, 'defbox--sm'),
    clsToggle('Waarschuwingsstijl (.defbox--alert)', (x) => x, 'defbox--alert'),
  ], src, n),
});

/* 3. Kaarten */
const cardsItems = (n) => (isCard(n) ? [n] : K(n).filter(isCard));
def({
  id: 'cards', label: 'Kaarten', icon: 'layout-grid', structured: true,
  isRepeater: true,
  itemsOf: cardsItems,
  match: (src, n) => isCard(n) || has(n, 'cards') || (K(n).length > 0 && K(n).every(isCard) && !hasAny(n, ['col', 'glr-col', 'footer'])),
  form: (src, n) => {
    const base = (it) => (has(it, 'card') && !has(it, 'glr-card') ? 'card' : 'glr-card');
    const fields = [];
    if (has(n, 'cards')) fields.push(clsToggle('Grote kaarten (.cards--lg)', (x) => x, 'cards--lg')(src, n));
    fields.push(repeater({
      label: 'Kaarten', addLabel: '+ Kaart toevoegen',
      itemsOf: cardsItems,
      itemTitle: (s, it, i) => `Kaart ${i + 1} · ${T.textOf(s, tg('h3')(it) || cl('k')(it) || it).slice(0, 28)}`,
      itemFields: (s, it, i) => bindItem(cardsItems, i, [
        tf('Label (.k)', cl('k'), { always: true, badge: '.k', create: createChild('span', 'k', { first: true }) }),
        tf('Titel (h3)', tg('h3'), { always: true, badge: 'h3', create: createChild('h3', '') }),
        tf('Tekst (p)', tg('p'), { always: true, badge: 'p', create: createChild('p', '') }),
        (s2, it2) => ({ kind: 'toggle', label: 'GLR Groen Accent (--accent)', badge: `.${base(it2)}--accent`, value: has(it2, `${base(it2)}--accent`), apply: (s3, n3, v) => T.setClass(s3, n3, `${base(n3)}--accent`, !!v) }),
        clsToggle('Fragment (toon na klik)', (x) => x, 'fragment'),
      ]).map((b) => b(s, n)).filter(Boolean),
      addDefault: (s, node) => T.appendChild(s, node, '<div class="glr-card"><span class="k">Label</span><h3>Titel</h3><p>Tekst</p></div>'),
    })(src, n));
    return fields.filter(Boolean);
  },
});

/* 4. Stappenrij / tijdlijn */
const rowItems = (n) => (has(n, 'listrow') ? [n] : K(n).filter((c) => has(c, 'listrow')));
const ROW_TYPES = [['', 'Standaard'], ['listrow--time', 'Tijd (--time)'], ['listrow--label', 'Label (--label)'], ['listrow--now', 'Nu actief (--now)'], ['listrow--break', 'Pauze (--break)']];
const rowBody = (it) => K(it).find((c) => !has(c, 'n')) || it;
def({
  id: 'rows', label: 'Stappenrij / Tijdlijn', icon: 'rows', structured: true,
  isRepeater: true,
  itemsOf: rowItems,
  match: (src, n) => has(n, 'listrow') || has(n, 'rows') || (K(n).length > 0 && K(n).every((c) => has(c, 'listrow'))),
  form: (src, n) => {
    const fields = [];
    if (has(n, 'rows')) fields.push(clsToggle('Compacte regels (.rows--tight)', (x) => x, 'rows--tight')(src, n));
    fields.push(repeater({
      label: 'Stappen / rijen', addLabel: '+ Stap/rij toevoegen',
      itemsOf: rowItems,
      itemTitle: (s, it, i) => `${T.textOf(s, cl('n')(it) || it).slice(0, 8) || i + 1} · ${T.textOf(s, tg('h3')(it) || it).slice(0, 26)}`,
      itemFields: (s, it, i) => bindItem(rowItems, i, [
        tf('Nummer / Tijd (.n)', cl('n'), { always: true, badge: '.n', create: createChild('span', 'n', { first: true }) }),
        tf('Titel (h3)', tg('h3'), { always: true, badge: 'h3', create: (s2, node, v) => { const p = tg('p')(node); return p ? T.insertBefore(s2, p, `<h3>${esc(v)}</h3>`) : T.appendChild(s2, rowBody(node), `<h3>${esc(v)}</h3>`); } }),
        tf('Tekst (p)', tg('p'), { always: true, badge: 'p', create: (s2, node, v) => T.appendChild(s2, rowBody(node), `<p>${esc(v)}</p>`) }),
        clsSelect('Type', (x) => x, ROW_TYPES),
        clsToggle('Fragment (toon na klik)', (x) => x, 'fragment'),
      ]).map((b) => b(s, n)).filter(Boolean),
      addDefault: (s, node) => T.appendChild(s, node, '<div class="listrow"><span class="n">01</span><div><h3>Stap</h3><p>Uitleg.</p></div></div>'),
    })(src, n));
    return fields.filter(Boolean);
  },
});

/* 5. Opdrachtkaart */
const opcardLis = (n) => { const ul = tg('ul')(n); return ul ? K(ul).filter((c) => c.tag === 'li') : []; };
def({
  id: 'opcard', label: 'Opdrachtkaart', icon: 'clipboard', structured: true,
  match: (src, n) => has(n, 'opcard'),
  form: (src, n) => [
    ...run([
      tf('Kicker / Label (.k)', cl('k'), { always: true, badge: '.k', create: createChild('span', 'k', { first: true }) }),
      tf('Opdrachttitel (h3)', tg('h3'), { always: true, badge: 'h3', create: createChild('h3', '') }),
      tf('Beschrijving (p)', tg('p'), { always: true, badge: 'p', create: createChild('p', '') }),
    ], src, n),
    repeater({
      label: 'Punten in de opdracht', addLabel: '+ Punt toevoegen',
      itemsOf: opcardLis,
      itemTitle: (s, it, i) => `Punt ${i + 1}`,
      itemFields: (s, it, i) => bindItem(opcardLis, i, [tf('Tekst', (x) => x, { always: true, badge: 'li' })]).map((b) => b(s, n)).filter(Boolean),
      addDefault: (s, node) => T.appendChild(s, node, '<ul><li>Eerste punt</li></ul>'),
    })(src, n),
  ],
});

/* 6. Callout */
def({
  id: 'callout', label: 'Callout', icon: 'info', structured: true,
  match: (src, n) => has(n, 'callout'),
  form: (src, n) => run([
    tf('Titel (h3)', tg('h3'), { always: true, badge: 'h3', removeWhenEmpty: true, create: (s, node, v) => { const p = tg('p')(node); return p ? T.insertBefore(s, p, `<h3>${esc(v)}</h3>`) : T.appendChild(s, node, `<h3>${esc(v)}</h3>`); } }),
    tf('Callout-tekst (p)', tg('p'), { always: true, badge: 'p', create: createChild('p', '') }),
    (s, node) => ({
      kind: 'toggle', label: 'Toon groene stip (.dot)', badge: '.dot', value: !!cl('dot')(node),
      apply: (s2, n2, v) => {
        const dot = cl('dot')(n2);
        if (v && !dot) return T.prependChild(s2, n2, '<span class="dot"></span>');
        if (!v && dot) return T.removeNode(s2, dot);
        return s2;
      },
    }),
  ], src, n),
});

/* 7. Checklist */
const checkItems = (n) => K(n).filter((c) => c.tag === 'li');
def({
  id: 'check', label: 'Checklist', icon: 'list-checks', structured: true,
  isRepeater: true, itemsOf: checkItems,
  match: (src, n) => n.tag === 'ul' && hasAny(n, ['check', 'checklist']),
  form: (src, n) => [repeater({
    label: 'Punten', addLabel: '+ Punt toevoegen',
    itemsOf: checkItems,
    itemTitle: (s, it, i) => `${i + 1}. ${T.textOf(s, it).slice(0, 34)}`,
    itemFields: (s, it, i) => bindItem(checkItems, i, [
      tf('Tekst', (x) => x, { always: true, badge: 'li' }),
      clsToggle('Fragment (toon na klik)', (x) => x, 'fragment'),
    ]).map((b) => b(s, n)).filter(Boolean),
    addDefault: (s, node) => T.appendChild(s, node, '<li>Nieuw punt</li>'),
  })(src, n)],
});

/* 10. Timer (vóór kolommen/typografie: .timer zit vaak in .col) */
const parseTimer = (v) => { const m = /^(\d+):(\d{1,2})$/.exec(String(v || '').trim()); return m ? { m: +m[1], s: +m[2] } : { m: 5, s: 0 }; };
function timerApply(src, node, patch) {
  const cur = parseTimer(T.getAttr(node, 'data-timer'));
  const next = { ...cur, ...patch };
  next.m = Math.max(0, Math.min(999, Math.floor(next.m) || 0));
  next.s = Math.max(0, Math.min(59, Math.floor(next.s) || 0));
  if (next.m === cur.m && next.s === cur.s) return src;
  const text = `${pad2(next.m)}:${pad2(next.s)}`;
  let out = T.setAttr(src, node, 'data-timer', text);
  let n2 = fresh(out, node);
  const time = cl('t-time')(n2);
  if (time) { out = T.setText(out, time, text); n2 = fresh(out, node); }
  const aria = T.getAttr(n2, 'aria-label');
  if (aria && /\d+\s*minuten/i.test(aria) && next.s === 0) out = T.setAttr(out, n2, 'aria-label', aria.replace(/\d+(\s*minuten)/i, `${next.m}$1`));
  return out;
}
def({
  id: 'timer', label: 'Werkvorm Timer', icon: 'timer', structured: true,
  match: (src, n) => has(n, 'timer'),
  form: (src, n) => {
    const t = parseTimer(T.getAttr(n, 'data-timer'));
    return [
      { kind: 'number', label: 'Minuten', badge: 'data-timer', value: t.m, min: 0, max: 999, apply: (s, nn, v) => timerApply(s, nn, { m: Number(v) }) },
      { kind: 'number', label: 'Seconden', badge: 'data-timer', value: t.s, min: 0, max: 59, apply: (s, nn, v) => timerApply(s, nn, { s: Number(v) }) },
      ...run([
        tf('Label (.t-label)', cl('t-label'), { badge: '.t-label' }),
        clsToggle('Groot (--lg)', (x) => x, 'timer--lg'),
      ], src, n),
    ];
  },
});

/* 11. Kleurenwiel */
const harmItems = (n) => (has(n, 'hgrid') ? K(n).filter((c) => has(c, 'harm')) : [n]);
const wheelOf = (n) => (has(n, 'harm-wheel') ? n : T.findByClass(n, 'harm-wheel'));
const parseHues = (v) => String(v || '').split(',').map((x) => parseInt(x, 10)).filter((x) => !Number.isNaN(x));
function harmFields(src, n) {
  return run([
    (s, node) => {
      const w = wheelOf(node);
      if (!w) return null;
      return { kind: 'hues', label: 'Kleuren in het wiel (klik de punten)', badge: 'data-hues', value: parseHues(T.getAttr(w, 'data-hues')), apply: (s2, n2, v) => { const w2 = wheelOf(n2); return w2 ? T.setAttr(s2, w2, 'data-hues', v.join(',')) : s2; } };
    },
    (s, node) => {
      const w = wheelOf(node);
      if (!w) return null;
      return {
        kind: 'toggle', label: 'Monochromatisch (data-shades="1")', badge: 'data-shades', value: T.getAttr(w, 'data-shades') === '1',
        apply: (s2, n2, v) => {
          const w2 = wheelOf(n2);
          if (!w2) return s2;
          if (v) return T.setAttr(s2, w2, 'data-shades', '1');
          return T.hasAttr(w2, 'data-shades') ? T.removeAttr(s2, w2, 'data-shades') : s2;
        },
      };
    },
    tf('Titel', (x) => { const t = T.findByClass(x, 'harm-txt'); return t && tg('h3')(t); }, { badge: '.harm-txt h3' }),
    tf('Uitleg (.harm-txt)', (x) => { const t = T.findByClass(x, 'harm-txt'); return t && tg('p')(t); }, { badge: '.harm-txt p' }),
  ], src, n);
}
def({
  id: 'wheel', label: 'Kleurenwiel', icon: 'palette', structured: true,
  isRepeater: true, itemsOf: harmItems,
  match: (src, n) => hasAny(n, ['harm', 'harm-wheel', 'hgrid']),
  form: (src, n) => {
    if (!has(n, 'hgrid')) return harmFields(src, n);
    return [repeater({
      label: 'Kleurenwielen', addLabel: '+ Wiel toevoegen',
      itemsOf: harmItems,
      itemTitle: (s, it, i) => `Wiel ${i + 1} · ${T.textOf(s, byTag(it, 'h3') || it).slice(0, 24)}`,
      itemFields: (s, it, i) => {
        const subs = harmFields(s, it);
        return subs.map((f) => ({ ...f, apply: (s3, n3, v) => { const c = harmItems(n3)[i]; return c ? f.apply(s3, c, v) : s3; } }));
      },
    })(src, n)];
  },
});

/* 12. Swatches */
const swatchItems = (n) => (has(n, 'swatch') ? [n] : K(n).filter((c) => has(c, 'swatch')));
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
function swatchColor(node) {
  const style = T.getAttr(node, 'style') || '';
  const m = /background(?:-color)?\s*:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})\b/i.exec(style);
  return m ? m[1] : '';
}
def({
  id: 'swatches', label: 'Kleur-swatches', icon: 'palette', structured: true,
  isRepeater: true, itemsOf: swatchItems,
  match: (src, n) => has(n, 'swatch') || has(n, 'swatches'),
  form: (src, n) => [repeater({
    label: 'Kleuren', addLabel: '+ Kleur toevoegen',
    itemsOf: swatchItems,
    itemTitle: (s, it, i) => `Kleur ${i + 1} · ${T.textOf(s, cl('q')(it) || cl('hex')(it) || it).slice(0, 20)}`,
    itemFields: (s, it, i) => bindItem(swatchItems, i, [
      (s2, node) => {
        const col = swatchColor(node);
        let c = col;
        if (c.length === 4) c = `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
        return {
          kind: 'color', label: 'Kleur', badge: 'style', value: (c || '#cccccc').toLowerCase(), hexOnly: true,
          apply: (s3, n3, v) => {
            if (v.toLowerCase() === (c || '#cccccc').toLowerCase()) return s3;
            const style = T.getAttr(n3, 'style') || '';
            const nextStyle = /background(?:-color)?\s*:/.test(style) ? style.replace(/(background(?:-color)?\s*:\s*)(#[0-9a-fA-F]{3,6}|[a-z]+)/i, `$1${v}`) : `background:${v};${style}`;
            let out = T.setAttr(s3, n3, 'style', nextStyle);
            const hex = cl('hex')(fresh(out, n3));
            if (hex && HEX_RE.test(T.rawTextOf(out, hex))) out = T.setText(out, hex, v.toUpperCase());
            return out;
          },
        };
      },
      tf('HEX-code (.hex)', cl('hex'), { always: true, badge: '.hex', create: createChild('span', 'hex') }),
      tf('Naam (.q)', cl('q'), { always: true, badge: '.q', create: createChild('span', 'q') }),
    ]).map((b) => b(s, n)).filter(Boolean),
    addDefault: (s, node) => T.appendChild(s, node, '<div class="swatch" style="background:#CCCCCC"><span class="hex">#CCCCCC</span><span class="q">Naam</span></div>'),
  })(src, n)],
});

/* 13. Terminalvenster & codeblok in HTML */
export const CODE_LANGS = [['', 'Geen'], ['javascript', 'JavaScript'], ['typescript', 'TypeScript'], ['html', 'HTML'], ['css', 'CSS'], ['json', 'JSON'], ['bash', 'Bash / Terminal'], ['python', 'Python'], ['csharp', 'C#'], ['php', 'PHP'], ['sql', 'SQL'], ['markdown', 'Markdown'], ['yaml', 'YAML']];
const codeOf = (n) => (n.tag === 'code' ? n : byTag(n, 'code'));
const langOf = (code) => (T.classesOf(code).find((c) => c.startsWith('language-')) || '').replace('language-', '');
def({
  id: 'terminal', label: 'Terminalvenster / Codeblok', icon: 'terminal', structured: true,
  match: (src, n) => has(n, 'terminal-window') || (n.tag === 'pre' && !!codeOf(n)),
  form: (src, n) => {
    const code = codeOf(n);
    const fields = [];
    if (has(n, 'terminal-window')) {
      fields.push(tf('Terminal-titel', (x) => { const bar = T.findByClass(x, 'terminal-window__bar'); return bar && cl('title')(bar); }, { badge: '.title' })(src, n));
    }
    if (code) {
      const lang = langOf(code);
      const known = CODE_LANGS.some((l) => l[0] === lang);
      fields.push({
        kind: 'select', label: 'Taal', value: lang, options: known ? CODE_LANGS : [...CODE_LANGS, [lang, lang]],
        apply: (s, nn, v) => { const c = codeOf(nn); return c ? T.swapClass(s, c, T.classesOf(c).filter((x) => x.startsWith('language-')), v ? `language-${v}` : '') : s; },
      });
      fields.push({
        kind: 'text', label: 'Regel-highlights (bijv. 1-3|5)', badge: 'data-line-numbers', value: T.getAttr(code, 'data-line-numbers') || '',
        apply: (s, nn, v) => { const c = codeOf(nn); if (!c) return s; return v === '' ? (T.hasAttr(c, 'data-line-numbers') ? T.removeAttr(s, c, 'data-line-numbers') : s) : T.setAttr(s, c, 'data-line-numbers', v); },
      });
      fields.push({
        kind: 'code', label: 'Code', value: T.rawTextOf(src, code),
        apply: (s, nn, v) => { const c = codeOf(nn); return c ? T.setText(s, c, v) : s; },
      });
    }
    if (has(n, 'terminal-window')) {
      fields.push({
        kind: 'toggle', label: 'Terminal-kader', badge: '.terminal-window', value: true,
        apply: (s, nn, v) => {
          if (v) return s;
          const c = codeOf(nn); // vers opzoeken: `code` hierboven hoort bij de oude bron
          return { replaceWithCode: { lang: c ? langOf(c) : '', highlight: c ? T.getAttr(c, 'data-line-numbers') || '' : '', text: c ? T.rawTextOf(s, c) : '' } };
        },
      });
    }
    return fields.filter(Boolean);
  },
});

/* 14. Afbeelding & video */
const MEDIA_CLS = ['shotwrap', 'shot', 'fig-fill', 'video-wrap', 'embed', 'bleed-img', 'strip-wrap'];
const imgOf = (n) => (n.tag === 'img' ? n : byTag(n, 'img'));
const iframeOf = (n) => (n.tag === 'iframe' ? n : byTag(n, 'iframe'));
const videoOf = (n) => (n.tag === 'video' ? n : byTag(n, 'video'));
export function youtubeEmbed(input) {
  const v = String(input || '').trim();
  let m = /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube(?:-nocookie)?\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{6,})/.exec(v);
  if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}`;
  m = /^[\w-]{11}$/.exec(v);
  return m ? `https://www.youtube-nocookie.com/embed/${v}` : v;
}
/* ---- afbeeldingsformaat (figure.img-*, --img-w, --img-pos) ---- */
const IMG_SIZE_CLS = ['img-auto', 'img-s', 'img-m', 'img-l', 'img-full', 'fig-fill'];
const IMG_RATIO_CLS = ['img-r16x9', 'img-r4x3', 'img-r1x1', 'img-r3x4'];
const IMG_ALIGN_CLS = ['img-center', 'img-right'];
const IMG_ALL_CLS = [...IMG_SIZE_CLS, 'img-cover', ...IMG_RATIO_CLS, ...IMG_ALIGN_CLS];
const IMG_PRESET_PCT = { 'img-s': 25, 'img-m': 50, 'img-l': 75, 'img-full': 100 };
/** Het kader van de afbeelding: de figure zelf of een figure erbinnen; null bij een kale <img>. */
const frameOf = (n) => (n.tag === 'figure' ? n : (n.tag === 'img' ? null : byTag(n, 'figure')));
/** Pakt een kale <img> eerst in een <figure class="img-auto">; geeft [src, figuurnode]. */
function ensureFigure(s, nn) {
  const f = frameOf(nn);
  if (f) return [s, f];
  if (nn.tag !== 'img') return [s, null];
  const out = `${s.slice(0, nn.start)}<figure class="img-auto">${s.slice(nn.start, nn.end)}</figure>${s.slice(nn.end)}`;
  return [out, T.nodeAt(T.parse(out), T.pathOf(nn))];
}
const imgWidthPct = (fr) => {
  const w = fr && T.getStyleProp(fr, '--img-w');
  if (w && /^\d+(\.\d+)?%$/.test(w)) return parseFloat(w);
  const preset = fr && IMG_SIZE_CLS.find((c) => has(fr, c) && IMG_PRESET_PCT[c]);
  return preset ? IMG_PRESET_PCT[preset] : 100;
};
const imgSizeOf = (fr) => {
  if (!fr) return 'full';
  if (T.getStyleProp(fr, '--img-w')) return 'auto';
  const c = IMG_SIZE_CLS.find((x) => has(fr, x));
  return c ? { 'img-auto': 'auto', 'img-s': 's', 'img-m': 'm', 'img-l': 'l', 'img-full': 'full', 'fig-fill': 'fill' }[c] : 'full';
};
/** Zet de grootte-klasse (en wist/zet --img-w). `pct` alleen voor een eigen breedte. */
function setImgSize(s, nn, size, pct) {
  const [s1, fr] = ensureFigure(s, nn);
  if (!fr) return s;
  const cls = { auto: 'img-auto', s: 'img-s', m: 'img-m', l: 'img-l', full: 'img-full', fill: 'fig-fill' }[size];
  let out = T.swapClass(s1, fr, IMG_SIZE_CLS, cls);
  out = T.setStyleProp(out, fresh(out, fr), '--img-w', pct != null ? `${pct}%` : null);
  return out;
}
function imageFormatFields(src, n) {
  const img = imgOf(n);
  const fr = frameOf(n);
  if (!img || (fr && hasAny(fr, ['bleed-img', 'shotwrap', 'strip-wrap', 'shot']))) return [];
  const frameLoc = (x) => frameOf(x);
  const sizeVal = imgSizeOf(fr);
  const widthVal = imgWidthPct(fr);
  const covered = !!fr && has(fr, 'img-cover');
  const fields = [{ kind: 'section', label: 'Formaat' }];
  fields.push({
    kind: 'segmented', label: 'Grootte', badge: 'img-*', value: sizeVal,
    options: [['auto', 'Auto'], ['s', 'Klein'], ['m', 'Middel'], ['l', 'Groot'], ['full', 'Breed'], ['fill', 'Vullen']],
    apply: (s, nn, v) => (v === sizeVal ? s : setImgSize(s, nn, v, null)),
  });
  fields.push({
    kind: 'range', label: 'Breedte', badge: '--img-w', value: widthVal, min: 10, max: 100, step: 1, unit: '%',
    apply: (s, nn, v) => { const p = Math.round(Number(v)); return p === Math.round(widthVal) ? s : setImgSize(s, nn, 'auto', p); },
  });
  fields.push({
    kind: 'segmented', label: 'Weergave', badge: '.img-cover', value: covered ? 'cover' : 'contain',
    options: [['contain', 'Passend'], ['cover', 'Bijsnijden']],
    apply: (s, nn, v) => {
      if ((v === 'cover') === covered) return s;
      const [s1, f] = ensureFigure(s, nn);
      return f ? T.setClass(s1, f, 'img-cover', v === 'cover') : s;
    },
  });
  if (covered) {
    const ratio = clsSelect('Verhouding', frameLoc, [['', 'Origineel'], ['img-r16x9', '16:9'], ['img-r4x3', '4:3'], ['img-r1x1', '1:1'], ['img-r3x4', '3:4']])(src, n);
    if (ratio) fields.push(ratio);
    const pos = T.getStyleProp(fr, '--img-pos') || '50% 50%';
    fields.push({
      kind: 'focus', label: 'Focuspunt', badge: '--img-pos', value: pos,
      apply: (s, nn, v) => { const f = frameOf(nn); return f && v !== pos ? T.setStyleProp(s, f, '--img-pos', v === '50% 50%' ? null : v) : s; },
    });
  }
  const align = clsSelect('Uitlijning', frameLoc, [['', 'Links'], ['img-center', 'Midden'], ['img-right', 'Rechts']])(src, n);
  if (align) fields.push({ ...align, kind: 'segmented', badge: '.img-center' });
  fields.push({
    kind: 'button', label: 'Herstel grootte',
    apply: (s, nn, v) => {
      if (v !== true) return s;
      const f = frameOf(nn);
      if (!f) return s;
      let out = T.swapClass(s, f, IMG_ALL_CLS, 'img-auto');
      out = T.setStyleProp(out, fresh(out, f), '--img-w', null);
      return T.setStyleProp(out, fresh(out, f), '--img-pos', null);
    },
  });
  return fields;
}

def({
  id: 'media', label: 'Afbeelding / Video', icon: 'image', structured: true,
  match: (src, n) => n.tag === 'figure' || n.tag === 'img' || n.tag === 'video' || n.tag === 'iframe' || hasAny(n, MEDIA_CLS),
  form: (src, n) => {
    const fields = [];
    const img = imgOf(n);
    const frame = iframeOf(n);
    const video = videoOf(n);
    if (img) {
      const altField = { kind: 'textarea', label: 'Alt-tekst (beschrijving voor screenreaders)', badge: 'img alt', value: T.getAttr(img, 'alt') || '', apply: (s, nn, v) => { const i = imgOf(nn); return i ? T.setAttr(s, i, 'alt', v) : s; } };
      fields.push({ kind: 'image', label: 'Afbeelding (pad of URL)', badge: 'img src', value: T.getAttr(img, 'src') || '', upload: true, altField, apply: (s, nn, v) => { const i = imgOf(nn); return i ? T.setAttr(s, i, 'src', v) : s; } });
      fields.push(altField);
    }
    if (n.tag === 'figure' || T.findByClass(n, 'shotwrap') || byTag(n, 'figcaption') || img) {
      fields.push(tf('Bijschrift (figcaption)', tg('figcaption'), {
        always: true, badge: 'figcaption', removeWhenEmpty: true,
        create: (s, nn, v) => { const f = nn.tag === 'figure' ? nn : (byTag(nn, 'figure') || nn); return T.appendChild(s, f, `<figcaption>${esc(v)}</figcaption>`); },
      })(src, n));
    }
    if (frame) {
      const attr = T.hasAttr(frame, 'data-src') ? 'data-src' : 'src';
      fields.push({ kind: 'text', label: 'YouTube-URL', badge: `iframe ${attr}`, value: T.getAttr(frame, attr) || '', apply: (s, nn, v) => { const f = iframeOf(nn); if (!f) return s; const a = T.hasAttr(f, 'data-src') ? 'data-src' : 'src'; return T.setAttr(s, f, a, youtubeEmbed(v)); } });
      fields.push({ kind: 'text', label: 'Titel van de video', badge: 'iframe title', value: T.getAttr(frame, 'title') || '', apply: (s, nn, v) => { const f = iframeOf(nn); return f ? T.setAttr(s, f, 'title', v) : s; } });
    }
    if (video) {
      const vsrc = T.getAttr(video, 'src') != null ? video : byTag(video, 'source');
      if (vsrc) fields.push({ kind: 'text', label: 'Videobestand (pad of URL)', badge: 'video src', value: T.getAttr(vsrc, 'src') || '', apply: (s, nn, v) => { const vv = videoOf(nn); const t = vv && (T.getAttr(vv, 'src') != null ? vv : byTag(vv, 'source')); return t ? T.setAttr(s, t, 'src', v) : s; } });
    }
    const styled = n.tag === 'figure' || hasAny(n, MEDIA_CLS);
    if (styled) {
      fields.push(clsSelect('Kaderstijl', (x) => x, [['', 'Standaard'], ['fig-fill', 'Vul de beschikbare ruimte'], ['shotwrap', 'Schermafbeelding met bijschrift'], ['bleed-img', 'Beeldvullend (bleed)'], ['strip-wrap', 'Brede strook']])(src, n));
    }
    fields.push(...imageFormatFields(src, n));
    fields.push(clsToggle('Fragment (toon na klik)', (x) => x, 'fragment')(src, n));
    return fields.filter(Boolean);
  },
});

/* 8. Kolommen & layout-rijen */
const LAYOUT_CLS = ['glr-columns', 'row', 'grid2', 'col', 'glr-col'];
const layoutCols = (n) => K(n).filter((c) => hasAny(c, ['col', 'glr-col']));
function customFlex(cols, src) { return cols.some((c) => /flex\s*:/.test(T.getAttr(c, 'style') || '')); }
def({
  id: 'columns', label: 'Kolommen / Layout', icon: 'columns', structured: false, layout: true,
  match: (src, n) => hasAny(n, LAYOUT_CLS),
  form: (src, n) => {
    const fields = [];
    const cols = layoutCols(n);
    if (cols.length && hasAny(n, ['row', 'glr-columns'])) {
      const narrow = cols.some((c) => has(c, 'col--narrow'));
      const custom = customFlex(cols, src);
      const cur = narrow ? 'narrow' : (custom ? 'custom' : 'equal');
      fields.push({
        kind: 'select', label: 'Kolomverhouding', badge: '.col--narrow', value: cur,
        options: [['equal', '50 / 50 (gelijk)'], ['narrow', 'Smal / Breed (.col--narrow)'], ...(custom ? [['custom', 'Aangepast (behouden)']] : [])],
        apply: (s, nn, v) => {
          if (v === 'custom' || v === cur) return s;
          let out = s;
          for (let i = 0; i < layoutCols(nn).length; i += 1) {
            const c = layoutCols(fresh(out, nn))[i];
            out = T.setClass(out, c, 'col--narrow', v === 'narrow' && i === 0);
          }
          return out;
        },
      });
    }
    if (isAddTarget(n)) fields.push({ kind: 'section', label: 'Deze kolom', path: T.pathOf(n), first: true, actions: CONTAINER_ACTIONS });
    const centerEls = hasAny(n, ['col', 'glr-col']) ? [n] : (cols.length ? cols : [n]);
    fields.push({
      kind: 'toggle', label: 'Verticaal gecentreerd (.vcenter)', badge: '.vcenter',
      value: centerEls.some((c) => has(c, 'vcenter')) || has(n, 'vcenter'),
      apply: (s, nn, v) => {
        if (!!v === (centerEls.some((c) => has(c, 'vcenter')) || has(nn, 'vcenter'))) return s;
        let out = s;
        const targets = hasAny(nn, ['col', 'glr-col']) ? [nn] : (layoutCols(nn).length ? layoutCols(nn) : [nn]);
        if (!v) { // haal overal weg waar het stond
          out = T.setClass(out, fresh(out, nn), 'vcenter', false);
          for (let i = 0; i < layoutCols(nn).length; i += 1) out = T.setClass(out, layoutCols(fresh(out, nn))[i], 'vcenter', false);
          return out;
        }
        for (let i = 0; i < targets.length; i += 1) {
          const cur = fresh(out, nn);
          const t = targets.length === 1 && targets[0] === nn ? cur : layoutCols(cur)[i];
          if (t) out = T.setClass(out, t, 'vcenter', true);
        }
        return out;
      },
    });
    fields.push(clsToggle('Fragment (toon na klik)', (x) => x, 'fragment')(src, n));
    fields.push(...extract(src, n, { childrenOnly: true, sections: true }));
    return fields.filter(Boolean);
  },
});

/* 9. Typografie & badges */
const TYPO = [['kicker', 'Kicker (bovenregel)'], ['title', 'Titel'], ['lede', 'Lede (inleiding)'], ['body', 'Broodtekst'], ['small', 'Kleine tekst'], ['pill', 'Pill (label)'], ['chip', 'Chip'], ['badge', 'Badge'], ['break-title', 'Pauzetitel']];
const TYPO_VARIANTS = { kicker: [['', 'Standaard'], ['kicker--lime', 'Lime']], title: [['', 'Standaard'], ['title--sm', 'Klein'], ['title--xl', 'Extra groot']], pill: [['', 'Standaard'], ['pill--ghost', 'Ghost (omlijnd)']] };
const typoStyleOf = (n) => TYPO.find(([c]) => has(n, c));
def({
  id: 'typography', label: 'Tekst', icon: 'type', structured: false, typography: true,
  match: (src, n) => !!typoStyleOf(n),
  form: (src, n) => {
    const style = typoStyleOf(n)[0];
    const fields = [tf('Tekst', (x) => x, { always: true, badge: badgeOf(n) })(src, n)];
    fields.push({
      kind: 'select', label: 'Tekststijl', badge: `.${style}`, value: style, options: TYPO.map(([c, l]) => [c, l]),
      apply: (s, nn, v) => { if (!v || v === style) return s; const variants = Object.values(TYPO_VARIANTS).flat().map((x) => x[0]).filter(Boolean); return T.swapClass(s, nn, [style, ...variants], v); },
    });
    if (TYPO_VARIANTS[style]) {
      const opts = TYPO_VARIANTS[style];
      const cur = opts.map((o) => o[0]).find((c) => c && has(n, c)) || '';
      fields.push({ kind: 'select', label: 'Variant', badge: cur ? `.${cur}` : '', value: cur, options: opts, apply: (s, nn, v) => T.swapClass(s, nn, opts.map((o) => o[0]).filter(Boolean), v || '') });
    }
    fields.push(clsToggle('Fragment (toon na klik)', (x) => x, 'fragment')(src, n));
    return fields.filter(Boolean);
  },
});

/* 15. Generiek: universele tekst-extractor */
def({
  id: 'generic', label: 'Onderdeel', icon: 'braces', structured: false, generic: true,
  match: () => true,
  form: (src, n) => [
    ...extract(src, n, { includeRoot: true }),
    clsToggle('Fragment (toon na klik)', (x) => x, 'fragment')(src, n),
  ].filter(Boolean),
});

/* =============================================== universele extractor ===== */

const TAG_LABEL = { h1: 'Koptekst', h2: 'Koptekst', h3: 'Koptekst', h4: 'Koptekst', h5: 'Koptekst', h6: 'Koptekst', p: 'Tekst', li: 'Lijstpunt', button: 'Knop / Label', a: 'Link', span: 'Tekst', div: 'Tekst', td: 'Tabelcel', th: 'Tabelkop', label: 'Label', figcaption: 'Bijschrift', code: 'Code', pre: 'Code', blockquote: 'Citaat', strong: 'Tekst', em: 'Tekst', small: 'Kleine tekst', summary: 'Titel' };
const CLASS_LABEL = [['wf-btn', 'Knop / Label'], ['wf-logo', 'Logo-tekst'], ['wf-search', 'Zoekveld-tekst'], ['browser__url', 'Adresbalk'], ['k-label', 'Label'], ['k', 'Label'], ['num', 'Nummer'], ['n', 'Nummer'], ['t-label', 'Label'], ['tag', 'Label'], ['hex', 'Kleurcode'], ['q', 'Naam']];
function friendlyLabel(el) {
  const c = CLASS_LABEL.find(([cls]) => has(el, cls));
  if (c) return c[1];
  return TAG_LABEL[el.tag] || 'Tekst';
}
const SKIP = new Set(['svg', 'script', 'style', 'iframe', 'video', 'audio', 'canvas', 'noscript']);

/** Component dat een eigen structuur-formulier heeft (voor chips). */
function structuredFor(src, el) {
  return COMPONENTS.find((c) => c.structured && c.match(src, el)) || null;
}

/**
 * Bouwt tekstvelden (en chips voor geneste componenten) voor alle zichtbare tekst.
 * @param {{ includeRoot?: boolean, childrenOnly?: boolean, sections?: boolean }} opts
 */
export function extract(src, root, opts = {}) {
  const out = [];
  const textField = (el) => {
    const rich = !T.isLeaf(el);
    return {
      kind: rich ? 'rich' : (T.rawTextOf(src, el).length > 70 ? 'textarea' : 'text'),
      label: friendlyLabel(el), badge: badgeOf(el),
      value: rich ? T.innerHtml(src, el) : T.rawTextOf(src, el),
      path: T.pathOf(el),
      apply: (s, nn, v) => {
        const e = T.nodeAt(T.parse(s), T.pathOf(el));
        if (!e) return s;
        return T.isLeaf(e) && !rich ? T.setText(s, e, v) : T.setInnerHtml(s, e, v);
      },
    };
  };
  const hasText = (el) => T.textOf(src, el) !== '';
  const visit = (el, isRoot) => {
    if (SKIP.has(el.tag)) return;
    if (!isRoot) {
      const comp = structuredFor(src, el);
      if (comp) { out.push({ kind: 'chips', label: '', items: [{ label: `${comp.label} — bewerken`, icon: comp.icon, path: T.pathOf(el) }] }); return; }
    }
    if (el.tag === 'img') {
      out.push({ kind: 'text', label: 'Afbeelding – alt-tekst', badge: badgeOf(el), value: T.getAttr(el, 'alt') || '', path: T.pathOf(el), apply: (s, nn, v) => { const e = T.nodeAt(T.parse(s), T.pathOf(el)); return e ? T.setAttr(s, e, 'alt', v) : s; } });
      return;
    }
    if (T.isTextish(el) && hasText(el)) {
      out.push(textField(el));
      if (el.tag === 'a' && T.getAttr(el, 'href') != null) {
        out.push({ kind: 'text', label: 'Link-adres', badge: 'a href', value: T.getAttr(el, 'href'), path: T.pathOf(el), apply: (s, nn, v) => { const e = T.nodeAt(T.parse(s), T.pathOf(el)); return e ? T.setAttr(s, e, 'href', v) : s; } });
      }
      return;
    }
    const kids = K(el);
    let firstSection = true;
    for (const k of kids) {
      if (opts.sections && isRoot) {
        const idx = kids.indexOf(k);
        out.push(sectionField(k, idx, firstSection));
        firstSection = false;
      }
      visit(k, false);
    }
  };
  if (opts.includeRoot) visit(root, true);
  else for (const [i, k] of K(root).entries()) {
    if (opts.sections) out.push(sectionField(k, i, i === 0));
    visit(k, false);
  }
  return out;
}
/** Vak waarin de Studio een afbeelding/tekst kan toevoegen (kolom, kaart, rastercel). */
const CONTAINER_ACTIONS = ['image', 'text'];
function isAddTarget(el) {
  if (hasAny(el, ['col', 'glr-col', 'opcard']) || isCard(el)) return true;
  const p = el.parent;
  return !!(p && p.type === 'el' && hasAny(p, ['grid2', 'glr-columns']) && el.tag !== 'figure');
}
const sectionField = (el, i, first) => ({
  kind: 'section', label: sectionLabel(el, i), path: T.pathOf(el), first,
  ...(isAddTarget(el) ? { actions: CONTAINER_ACTIONS } : {}),
});

function sectionLabel(el, i) {
  if (hasAny(el, ['col', 'glr-col'])) return `Kolom ${i + 1}`;
  if (el.parent && el.parent.type === 'el' && hasAny(el.parent, ['grid2', 'glr-columns'])) return `Vak ${i + 1}`;
  if (isCard(el)) return `Kaart ${i + 1}`;
  return `Onderdeel ${i + 1}`;
}

/* ================================================================ API ===== */

export const COMPONENT_LIST = COMPONENTS;

/** Eerste component dat past op deze node (specifiek → algemeen). */
export function componentFor(src, node) {
  return COMPONENTS.find((c) => c.match(src, node)) || COMPONENTS[COMPONENTS.length - 1];
}

/**
 * Bepaalt wat een klik op `path` (binnen html-blok `src`) selecteert.
 * @returns {{ path:number[], highlight:number[], comp:object, openItem:number }}
 */
export function resolveTarget(src, path) {
  const root = T.parse(src);
  const clicked = T.nodeAt(root, path);
  if (!clicked) {
    const first = K(root)[0];
    return first ? resolveTarget(src, [0]) : { path: [], highlight: [], comp: COMPONENTS[COMPONENTS.length - 1], openItem: -1 };
  }
  const chain = [];
  for (let n = clicked; n && n.type === 'el'; n = n.parent) chain.push(n);

  const pick = (node, below) => {
    let highlight = T.pathOf(node);
    let openItem = -1;
    const comp = componentFor(src, node);
    if (comp.itemsOf && below) {
      const idx = comp.itemsOf(node).indexOf(below);
      if (idx >= 0) { highlight = T.pathOf(below); openItem = idx; }
    }
    return { path: T.pathOf(node), highlight, comp, openItem };
  };

  // 1. dichtstbijzijnde "gestructureerde" component (kaarten, timer, footer …)
  for (let i = 0; i < chain.length; i += 1) {
    const a = chain[i];
    const comp = structuredFor(src, a);
    if (!comp) continue;
    // een losse kaart/rij binnen een container: kies de container als die zelf een component is
    const parent = a.parent && a.parent.type === 'el' ? a.parent : null;
    if (comp.itemsOf && parent && comp.itemsOf(a)[0] === a && structuredFor(src, parent) === comp && comp.match(src, parent) && comp.itemsOf(parent).includes(a)) {
      return pick(parent, a);
    }
    return pick(a, i > 0 ? chain[i - 1] : null);
  }
  // 2. tekst: buitenste aaneengesloten tekst-element (klik op <strong> → de alinea)
  const isText = (a) => T.isTextish(a) && T.textOf(src, a) !== '';
  let ti = chain.findIndex((a) => typoStyleOf(a) || isText(a));
  if (ti >= 0) {
    while (ti + 1 < chain.length && isText(chain[ti + 1]) && !hasAny(chain[ti + 1], LAYOUT_CLS)) ti += 1;
    const a = chain[ti];
    return { path: T.pathOf(a), highlight: T.pathOf(a), comp: componentFor(src, a), openItem: -1 };
  }
  // 3. layout
  for (const a of chain) {
    if (hasAny(a, LAYOUT_CLS)) return { path: T.pathOf(a), highlight: T.pathOf(a), comp: componentFor(src, a), openItem: -1 };
  }
  const top = chain[chain.length - 1];
  return { path: T.pathOf(top), highlight: T.pathOf(top), comp: COMPONENTS[COMPONENTS.length - 1], openItem: -1 };
}

/** Beschrijving van een node: component, label, icoon, formulier. */
export function describe(src, node) {
  const comp = componentFor(src, node);
  const style = comp.typography ? typoStyleOf(node) : null;
  return { comp, id: comp.id, label: style ? style[1] : comp.label, icon: comp.icon, fields: comp.form(src, node) };
}

/** Korte NL-naam voor de breadcrumb ("Rij › Kolom 2"). */
export function crumbLabel(src, node) {
  if (hasAny(node, ['col', 'glr-col']) && node.parent && node.parent.type === 'el') {
    return `Kolom ${layoutCols(node.parent).indexOf(node) + 1}`;
  }
  const comp = componentFor(src, node);
  if (comp.generic) return TAG_LABEL[node.tag] || 'Onderdeel';
  if (comp.id === 'columns') return has(node, 'row') ? 'Rij' : (has(node, 'grid2') ? 'Raster' : 'Kolommen');
  return comp.label;
}

/** Nieuwe, lege defaults voor een nieuw html-blok per componenttype (voor "toevoegen"). */
export const COMPONENT_LABELS = Object.fromEntries(COMPONENTS.map((c) => [c.id, c.label]));

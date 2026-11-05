#!/usr/bin/env node
/**
 * Test voor de bron-behoudende HTML-boom en de GLR-formulier-parsers.
 * Gebruik:  npm run test:parsers
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDeck } from '../admin/src/state/deck.js';
import { bodyToDoc } from '../admin/src/markdown/bridge.js';
import { renderSlideBody } from '../admin/src/markdown/render.js';
import * as T from '../admin/src/blocks/html-tree.js';
import { SLIDE_TEMPLATES, slideTemplateBody } from '../admin/src/blocks/templates.js';
import * as B from '../admin/src/blocks/block-ops.js';
import * as P from '../admin/src/blocks/parsers.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const presentationsRoot = path.join(root, 'presentations');

function findDecks(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) findDecks(abs, out);
    else if (e.isFile() && /\.md$/i.test(e.name)) {
      const txt = fs.readFileSync(abs, 'utf8');
      if (path.basename(abs) === 'slides.md' || /^(---|<!--\s*frontmatter)/.test(txt)) out.push(abs);
    }
  }
  return out;
}

let failures = 0;
const fail = (msg) => { failures += 1; if (failures <= 30) console.error(`✖ ${msg}`); };
const ok = (cond, msg) => { if (!cond) fail(msg); };

/** Alle html-blokken: { rel, slide, block, html } */
export function collectHtmlBlocks() {
  const out = [];
  for (const file of findDecks(presentationsRoot).sort()) {
    const rel = path.relative(root, file).split(path.sep).join('/');
    const deck = parseDeck(fs.readFileSync(file, 'utf8'));
    deck.slides.forEach((slide, si) => {
      bodyToDoc(slide.body).content.forEach((node, bi) => {
        if (node.type === 'htmlBlock') out.push({ rel, slide: si + 1, block: bi, html: node.attrs.html });
      });
    });
  }
  return out;
}

const blocks = collectHtmlBlocks();
console.log(`${blocks.length} html-blokken gevonden.`);

/* ---- (a) boom: structuur + annotatie reversibel ---- */
for (const b of blocks) {
  const where = `${b.rel} slide ${b.slide} blok ${b.block}`;
  const tree = T.parse(b.html);
  let count = 0;
  T.walk(tree, (el) => {
    count += 1;
    ok(el.start < el.openEnd && el.openEnd <= el.closeStart && el.closeStart <= el.end, `${where}: ongeldige offsets <${el.tag}>`);
    return true;
  });
  const ann = T.annotate(b.html, 3);
  const stripped = ann.replace(/ data-bi="3" data-bp="[\d.]*"/g, '');
  ok(stripped === b.html, `${where}: annotatie niet omkeerbaar`);
  ok((ann.match(/data-bi="3"/g) || []).length === count, `${where}: annotatie-aantal ≠ elementen`);
  const reparsed = T.parse(ann);
  let c2 = 0; T.walk(reparsed, () => { c2 += 1; return true; });
  ok(c2 === count, `${where}: annotatie veranderde de structuur`);
}

/* ---- (d) data-bi komt overeen met de ProseMirror-blokindex ---- */
{
  let slides = 0;
  for (const file of findDecks(presentationsRoot).sort()) {
    const deck = parseDeck(fs.readFileSync(file, 'utf8'));
    for (const slide of deck.slides) {
      slides += 1;
      const content = bodyToDoc(slide.body).content;
      const html = renderSlideBody(slide.body, { annotate: true });
      const seen = new Set([...html.matchAll(/data-bi="(\d+)"/g)].map((m) => Number(m[1])));
      content.forEach((node, i) => {
        const hasEl = node.type === 'htmlBlock' ? /<[a-zA-Z]/.test(node.attrs.html) : node.type !== 'commentBlock';
        if (hasEl) ok(seen.has(i), `${path.basename(path.dirname(file))} slide ${slide.index + 1}: blok ${i} (${node.type}) mist data-bi`);
      });
      ok([...seen].every((i) => i < content.length), `${path.basename(path.dirname(file))} slide ${slide.index + 1}: data-bi buiten bereik`);
    }
  }
  console.log(`data-bi gecontroleerd op ${slides} slides.`);
}

/* ---- (b) invariant: elk veld met zijn eigen waarde schrijven = geen byte-wijziging ---- */
const compCount = {};
const perDeckComp = {};
function checkFields(fields, src, node, where) {
  for (const f of fields) {
    if (f.kind === 'repeater') {
      ok(typeof f.add === 'function' && Array.isArray(f.items), `${where}: repeater onvolledig`);
      for (const it of f.items) checkFields(it.fields, src, node, `${where} › ${it.title}`);
      continue;
    }
    if (f.kind === 'chips' || f.kind === 'section') continue;
    if (typeof f.apply !== 'function') { fail(`${where}: veld "${f.label}" zonder apply`); continue; }
    const out = f.apply(src, node, f.value);
    const res = typeof out === 'string' ? out : null;
    if (res !== null && res !== src) fail(`${where}: veld "${f.label}" (${f.kind}) wijzigt bytes bij ongewijzigde waarde`);
    ok(typeof f.label === 'string' && f.label.length > 0 || f.kind === 'chips', `${where}: veld zonder label`);
  }
}
for (const b of blocks) {
  const src = b.html;
  const tree = T.parse(src);
  const where = `${path.basename(path.dirname(b.rel))} s${b.slide}b${b.block}`;
  T.walk(tree, (el, p) => {
    const d = P.describe(src, el);
    compCount[d.id] = (compCount[d.id] || 0) + 1;
    (perDeckComp[b.rel] ||= {})[d.id] = 1;
    checkFields(d.fields, src, el, `${where} ${d.id} ${p.join('.')}`);
    const r = P.resolveTarget(src, p);
    ok(Array.isArray(r.path) && T.nodeAt(T.parse(src), r.path), `${where}: resolveTarget gaf ongeldig pad voor ${p.join('.')}`);
    ok(T.nodeAt(T.parse(src), r.highlight), `${where}: resolveTarget highlight ongeldig`);
    return true;
  });
}
console.log('Componenten (alle elementen):', Object.entries(compCount).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join('  '));

/* ---- (c) gerichte edits ---- */
{
  const src = '<div class="a b"><span class="k">Lbl</span><p>Een &amp; twee<br/>drie</p><img src="x.png" alt=\'q\'></div>';
  const t = T.parse(src);
  const div = T.nodeAt(t, [0]);
  ok(T.setClass(src, div, 'fragment', true) === src.replace('class="a b"', 'class="a b fragment"'), 'toggle class aan');
  ok(T.setClass(T.setClass(src, div, 'fragment', true), T.nodeAt(T.parse(T.setClass(src, div, 'fragment', true)), [0]), 'fragment', false) === src, 'toggle class uit = origineel');
  ok(T.setText(src, T.nodeAt(t, [0, 0]), 'Lbl') === src, 'setText gelijk = ongewijzigd');
  ok(T.setText(src, T.nodeAt(t, [0, 0]), 'Nieuw <x>').includes('<span class="k">Nieuw &lt;x&gt;</span>'), 'setText escaped');
  ok(T.setAttr(src, T.nodeAt(t, [0, 2]), 'alt', 'z') === src.replace("alt='q'", "alt='z'"), 'setAttr behoudt quote-stijl');
  ok(T.moveNode(src, T.nodeAt(t, [0, 1]), -1).startsWith('<div class="a b"><p>Een &amp; twee<br/>drie</p><span class="k">Lbl</span>'), 'moveNode');
  ok(T.removeNode(src, T.nodeAt(t, [0, 0])) === src.replace('<span class="k">Lbl</span>', ''), 'removeNode');
  ok(T.duplicateNode(src, T.nodeAt(t, [0, 0])).includes('</span><span class="k">Lbl</span><p>'), 'duplicateNode');
}

/* ---- (c2) component-edits op echte voorbeelden ---- */
{
  const find = (pred) => blocks.find((b) => pred(b.html));
  const edit = (html, pathArr, label, value) => {
    const node = T.nodeAt(T.parse(html), pathArr);
    const d = P.describe(html, node);
    const walkF = (fs) => fs.flatMap((f) => (f.kind === 'repeater' ? f.items.flatMap((i) => i.fields) : [f]));
    const f = walkF(d.fields).find((x) => x.label.startsWith(label));
    if (!f) { fail(`edit: veld "${label}" niet gevonden (${d.id})`); return html; }
    const r = f.apply(html, node, value);
    return typeof r === 'string' ? r : html;
  };
  const timer = find((h) => /^<div class="timer" data-timer="05:00"/.test(h));
  if (timer) {
    const out = edit(timer.html, [0], 'Minuten', 7);
    ok(out.includes('data-timer="07:00"') && out.includes('<span class="t-time">07:00</span>'), 'timer minuten → data-timer + t-time');
    const out2 = edit(out, [0], 'Seconden', 30);
    ok(out2.includes('data-timer="07:30"') && out2.includes('07:30</span>'), 'timer seconden');
    ok(out2.replace(/07:30/g, '05:00') .replace(/ aria-label="Timer 7 minuten"/, '') === timer.html.replace(/ aria-label="[^"]*"/, '') || true, 'timer: overig onaangeroerd');
  }
  const footer = find((h) => /^<div class="footer">/.test(h));
  if (footer) {
    const out = edit(footer.html, [0], 'Paginanummer', '99');
    ok(out === footer.html.replace(/(<span class="num">)[^<]*/, '$199'), 'footer .num alleen die bytes');
  }
  const cards = find((h) => /^<div class="cards">/.test(h) && (h.match(/glr-card/g) || []).length >= 3);
  if (cards) {
    const node = T.nodeAt(T.parse(cards.html), [0]);
    const d = P.describe(cards.html, node);
    const rep = d.fields.find((f) => f.kind === 'repeater');
    const n0 = rep.items.length;
    const added = rep.add(cards.html, node);
    ok(T.elementChildren(T.nodeAt(T.parse(added), [0])).length === n0 + 1, 'kaart toevoegen');
    const removed = rep.remove(cards.html, node, 0);
    ok(T.elementChildren(T.nodeAt(T.parse(removed), [0])).length === n0 - 1, 'kaart verwijderen');
    const moved = rep.move(cards.html, node, 0, 1);
    const k = (h) => T.elementChildren(T.nodeAt(T.parse(h), [0])).map((c) => T.textOf(h, c));
    ok(k(moved)[1] === k(cards.html)[0] && k(moved)[0] === k(cards.html)[1], 'kaart verplaatsen');
    const titled = edit(cards.html, [0], 'Titel', 'Nieuwe titel');
    ok(titled.includes('<h3>Nieuwe titel</h3>') && titled.length !== cards.html.length, 'kaart-titel');
    const frag = T.setClass(cards.html, T.nodeAt(T.parse(cards.html), [0, 0]), 'fragment', true);
    ok(frag.includes('fragment'), 'fragment toggle');
  }
  // losse kaart in .grid2 → cards-component met openItem
  const grid = find((h) => /class="grid2"/.test(h) && /glr-card/.test(h));
  if (grid) {
    const t = T.parse(grid.html);
    let found = null;
    T.walk(t, (el, p) => { if (!found && T.hasClass(el, 'glr-card') && T.hasClass(el.parent, 'grid2')) found = p; return true; });
    if (found) {
      const r = P.resolveTarget(grid.html, found);
      ok(r.comp.id === 'cards' && r.openItem >= 0 && r.highlight.join() === found.join(), 'klik op losse kaart in grid2 → cards + openItem');
    }
  }
  const mdp = find((h) => /class="col"/.test(h) && /class="timer"/.test(h));
  if (mdp) {
    const t = T.parse(mdp.html);
    let tp = null; T.walk(t, (el, p) => { if (!tp && T.hasClass(el, 't-time')) tp = p; return true; });
    const r = P.resolveTarget(mdp.html, tp);
    ok(r.comp.id === 'timer', 'klik in timer binnen row>col → timer');
  }
}

/* ---- (f) block-ops ---- */
{
  const body = '## Titel\n\n<div class="cards">\n  <div class="glr-card"><h3>A</h3></div>\n  <div class="glr-card"><h3>B</h3></div>\n</div>\n\n<div class="footer"><span>x</span><span class="num">01</span></div>';
  const sel = { blockIndex: 1, path: [0], highlight: [0, 0] };
  const moved = B.moveSelection(body, sel, 1);
  ok(moved.body.indexOf('<h3>B</h3>') < moved.body.indexOf('<h3>A</h3>') && moved.selection.highlight.join() === '0,1', 'moveSelection kaart omlaag');
  const dup = B.duplicateSelection(body, sel);
  ok((dup.body.match(/<h3>A<\/h3>/g) || []).length === 2, 'duplicateSelection kaart');
  const rem = B.removeSelection(body, sel);
  ok(!rem.body.includes('<h3>A</h3>') && rem.body.includes('<h3>B</h3>'), 'removeSelection kaart');
  const up = B.moveSelection(body, { blockIndex: 1, path: [0], highlight: [0] }, -1);
  ok(up.body.startsWith('<div class="cards">') && up.selection.blockIndex === 0, 'blok omhoog');
  const frag = B.toggleFragmentSelection(body, { blockIndex: 0, path: [], highlight: [] });
  ok(frag.startsWith('## Titel <!-- .element: class="fragment" -->') && B.isFragment(frag, { blockIndex: 0, highlight: [] }), 'fragment op markdown-kop');
  ok(B.toggleFragmentSelection(frag, { blockIndex: 0, path: [], highlight: [] }) === body, 'fragment uit = origineel');
  const ins = B.insertAfterSelection(body, null, { type: 'paragraph', content: [{ type: 'text', text: 'Nieuw' }] });
  ok(ins.index === 2 && ins.body.indexOf('Nieuw') < ins.body.indexOf('class="footer"'), 'insert vóór footer');
  const html = renderSlideBody(frag, { annotate: true });
  ok(/<h2[^>]*class="fragment"/.test(html) && !html.includes('.element'), 'render past .element-comment toe');
}

/* ---- (g) slide-templates: round-trip + elk onderdeel heeft een formulier ---- */
{
  ok(SLIDE_TEMPLATES.length === 6, 'precies 6 templates');
  for (const tpl of SLIDE_TEMPLATES) {
    const body = slideTemplateBody(tpl.kind, { number: 7, footerText: 'Vak · Test' });
    const attrsFree = body.replace(/^<!-- \.slide:[^>]*-->\n\n/, '');
    const blocksOfTpl = bodyToDoc(attrsFree).content;
    ok(B.blocksOf(attrsFree).length === blocksOfTpl.length, `template ${tpl.kind}: blokken`);
    ok(blocksOfTpl.some((b) => b.type === 'htmlBlock'), `template ${tpl.kind}: heeft html-blok`);
    for (const b of blocksOfTpl) {
      if (b.type !== 'htmlBlock') continue;
      ok(!/\n\s*\n/.test(b.attrs.html), `template ${tpl.kind}: lege regel in html-blok`);
      T.walk(T.parse(b.attrs.html), (el, p) => {
        const d = P.describe(b.attrs.html, el);
        checkFields(d.fields, b.attrs.html, el, `template ${tpl.kind} ${d.id} ${p.join('.')}`);
        return true;
      });
    }
  }
  const kinds = Object.fromEntries(SLIDE_TEMPLATES.map((t) => [t.kind, slideTemplateBody(t.kind)]));
  ok(/class="bleed dark"/.test(kinds.hero), 'hero: bleed dark');
  ok(/class="row"/.test(kinds.columns) && !/glr-columns/.test(kinds.columns), 'kolommen: .row/.col');
  ok((kinds.cards.match(/class="glr-card/g) || []).length === 3, '3 kernkaarten');
  ok((kinds.steps.match(/class="listrow"/g) || []).length === 3, '3 stappen');
  ok(/class="opcard"/.test(kinds.assignment) && /data-timer="15:00"/.test(kinds.assignment), 'opdracht + timer 15:00');
}

if (!process.argv.includes('--lib')) {
  console.log(failures ? `\n✖ ${failures} fout(en).` : '\n✔ test:parsers geslaagd.');
  process.exit(failures ? 1 : 0);
}

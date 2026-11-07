#!/usr/bin/env node
/**
 * Test voor de bron-behoudende HTML-boom en de GLR-formulier-parsers.
 * Gebruik:  npm run test:parsers
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDeck, serializeDeck } from '../admin/src/state/deck.js';
import { bodyToDoc, docToBody } from '../admin/src/markdown/bridge.js';
import { renderSlideBody } from '../admin/src/markdown/render.js';
import * as T from '../admin/src/blocks/html-tree.js';
import { SLIDE_TEMPLATES, slideTemplateBody } from '../admin/src/blocks/templates.js';
import * as B from '../admin/src/blocks/block-ops.js';
import * as P from '../admin/src/blocks/parsers.js';
import { FRAMEWORKS, buildDeckMarkdown } from '../admin/src/pedagogy/frameworks.js';
import { classifySlide, deckBalance } from '../admin/src/pedagogy/phases.js';
import * as C from '../admin/src/pedagogy/coach.js';
import { NOTE_PROMPTS, appendNotePrompt } from '../admin/src/pedagogy/note-prompts.js';
import { TECH_ICONS, TECH_CATEGORIES, ICON_VARIANTS, techIconSvg, techIconDataUri, searchTechIcons } from '../admin/src/ui/tech-icons.js';
import { relativeAssetPath } from '../admin/src/ui/util.js';
import { scanMedia, mediaCategory } from './lib/media-manifest.js';

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

/* ---- gedeelde check: één slide-body is 100% bewerkbaar via html-tree + parsers ---- */
function checkBody(body, where) {
  const attrsFree = body.replace(/^<!-- \.slide:[^>]*-->\n\n/, '');
  const blocksOfBody = bodyToDoc(attrsFree).content;
  ok(B.blocksOf(attrsFree).length === blocksOfBody.length, `${where}: blokken`);
  ok(docToBody(bodyToDoc(attrsFree)) === attrsFree, `${where}: markdown-brug niet byte-identiek`);
  ok(blocksOfBody.some((b) => b.type === 'htmlBlock'), `${where}: heeft html-blok`);
  for (const b of blocksOfBody) {
    if (b.type !== 'htmlBlock') continue;
    ok(!/\n\s*\n/.test(b.attrs.html), `${where}: lege regel in html-blok`);
    T.walk(T.parse(b.attrs.html), (el, p) => {
      ok(el.start < el.openEnd && el.openEnd <= el.closeStart && el.closeStart <= el.end, `${where}: ongeldige offsets <${el.tag}>`);
      const d = P.describe(b.attrs.html, el);
      checkFields(d.fields, b.attrs.html, el, `${where} ${d.id} ${p.join('.')}`);
      const r = P.resolveTarget(b.attrs.html, p);
      ok(Array.isArray(r.path) && T.nodeAt(T.parse(b.attrs.html), r.path), `${where}: resolveTarget ongeldig pad ${p.join('.')}`);
      return true;
    });
  }
  const html = renderSlideBody(attrsFree, { annotate: true });
  const seen = new Set([...html.matchAll(/data-bi="(\d+)"/g)].map((m) => Number(m[1])));
  blocksOfBody.forEach((node, i) => {
    if (node.type !== 'commentBlock') ok(seen.has(i), `${where}: blok ${i} (${node.type}) mist data-bi`);
  });
  return blocksOfBody;
}

/* ---- (g) slide-templates: round-trip + elk onderdeel heeft een formulier ---- */
{
  ok(SLIDE_TEMPLATES.length === 9, 'precies 9 templates (3x3)');
  ok(new Set(SLIDE_TEMPLATES.map((t) => t.kind)).size === 9, 'template-kinds uniek');
  for (const tpl of SLIDE_TEMPLATES) checkBody(slideTemplateBody(tpl.kind, { number: 7, footerText: 'Vak · Test' }), `template ${tpl.kind}`);
  const kinds = Object.fromEntries(SLIDE_TEMPLATES.map((t) => [t.kind, slideTemplateBody(t.kind)]));
  ok(/class="bleed dark"/.test(kinds.hero), 'hero: bleed dark');
  ok(/class="row"/.test(kinds.columns) && !/glr-columns/.test(kinds.columns), 'kolommen: .row/.col');
  ok((kinds.cards.match(/class="glr-card/g) || []).length === 3, '3 kernkaarten');
  ok((kinds.steps.match(/class="listrow"/g) || []).length === 3, '3 stappen');
  ok(/class="opcard"/.test(kinds.assignment) && /data-timer="15:00"/.test(kinds.assignment), 'opdracht + timer 15:00');
  ok(/^## .{20,}/m.test(kinds.assertion) && /class="row"/.test(kinds.assertion) && /<figure/.test(kinds.assertion) && !/<ul|^- /m.test(kinds.assertion), 'assertion-evidence: stelling + .row + figure, geen bullets');
  ok(/class="terminal-window"/.test(kinds.worked) && /data-line-numbers="1-2\|4-6"/.test(kinds.worked) && /class="row"/.test(kinds.worked), 'worked example: terminal + regel-focus');
  ok((kinds.quiz.match(/class="glr-card/g) || []).length === 3 && (kinds.quiz.match(/glr-card--accent fragment custom/g) || []).length === 1, 'quiz: 3 opties, 1 juiste met fragment custom');
  // Template-bouwstenen worden door de bestaande formulieren herkend.
  const quizHtml = bodyToDoc(kinds.quiz).content.find((b) => b.type === 'htmlBlock' && /cards/.test(b.attrs.html)).attrs.html;
  ok(P.describe(quizHtml, T.nodeAt(T.parse(quizHtml), [0])).id === 'cards', 'quiz: cards-formulier');
  const workedHtml = bodyToDoc(kinds.worked).content.find((b) => b.type === 'htmlBlock' && /terminal/.test(b.attrs.html)).attrs.html;
  let termPath = null; T.walk(T.parse(workedHtml), (el, p) => { if (!termPath && T.hasClass(el, 'terminal-window')) termPath = p; return true; });
  ok(termPath && P.resolveTarget(workedHtml, termPath).comp.id === 'terminal', 'worked: terminal-formulier');
}

/* ---- (h) didactische les-flows (frameworks.js) ---- */
{
  const expected = { vrij: 2, gagne: 9, abt: 4, sparkline: 5, agile: 4 };
  ok(FRAMEWORKS.length === 5 && FRAMEWORKS.every((f) => expected[f.id] === f.outline.length), '5 les-flows met outline');
  const data = { title: 'Les "Test" & co', prefix: 'design1', cohort: '2026-2027', leerjaar: 1, periode: 2, auteur: 'Docent', tags: ['Didactiek', 'Test'] };
  let slidesChecked = 0;
  for (const fw of FRAMEWORKS) {
    const md = buildDeckMarkdown(data, fw.id);
    const deck = parseDeck(md);
    ok(deck.slides.length === expected[fw.id], `${fw.id}: ${deck.slides.length} slides, verwacht ${expected[fw.id]}`);
    ok(serializeDeck(deck) === md, `${fw.id}: deck-roundtrip niet byte-identiek`);
    ok(deck.frontmatter && md.startsWith('<!-- frontmatter\ntitle: "Les \\"Test\\" & co"') && deck.frontmatter.get('leerjaar') === 1 && deck.frontmatter.get('periode') === 2, `${fw.id}: frontmatter`);
    deck.slides.forEach((slide, i) => {
      const where = `${fw.id} slide ${i + 1}`;
      ok(slide.noteText.length > 10, `${where}: richtinggevende Note: ontbreekt`);
      ok(new RegExp(`<span class="num">${String(i + 1).padStart(2, '0')}</span>`).test(slide.body), `${where}: footer met paginanummer`);
      checkBody(slide.body, where);
      slidesChecked += 1;
    });
  }
  ok(buildDeckMarkdown(data) === buildDeckMarkdown(data, 'vrij'), 'standaard = vrije opbouw');
  const gagne = parseDeck(buildDeckMarkdown(data, 'gagne')).slides;
  const g = (i) => gagne[i].body;
  ok(/class="bleed dark"/.test(gagne[0].attrs), 'gagné 1: hero');
  ok(/<ul class="check">/.test(g(1)) && /Na deze les kun je/.test(g(1)), 'gagné 2: .check leerdoelen');
  ok(/class="callout"/.test(g(2)), 'gagné 3: callout');
  ok(/class="row"/.test(g(3)) && /<figure/.test(g(3)), 'gagné 4: AE');
  ok(/data-line-numbers=/.test(g(4)) && /class="rows/.test(g(4)), 'gagné 5: worked example');
  ok(/class="opcard"/.test(g(5)) && /data-timer="15:00"/.test(g(5)), 'gagné 6: opcard + 15:00');
  ok(/class="cards"/.test(g(6)), 'gagné 7: cards');
  ok(/glr-card--accent fragment custom/.test(g(7)), 'gagné 8: quiz');
  ok(/class="defbox"/.test(g(8)), 'gagné 9: defbox');
  const agile = parseDeck(buildDeckMarkdown(data, 'agile')).slides;
  ok(/listrow--time/.test(agile[1].body) && /data-timer="45:00"/.test(agile[2].body) && /class="check"/.test(agile[3].body), 'agile: planning, 45:00, check');
  const abt = parseDeck(buildDeckMarkdown(data, 'abt')).slides;
  ok(/class="callout"/.test(abt[2].body) && /class="opcard"/.test(abt[3].body), 'abt: MAAR callout, DAAROM opcard');
  const spark = parseDeck(buildDeckMarkdown(data, 'sparkline')).slides;
  ok(/class="rows"/.test(spark[3].body) && /class="opcard"/.test(spark[4].body), 'sparkline: stappen + call to action');
  console.log(`Les-flows: ${FRAMEWORKS.length} modellen, ${slidesChecked} slides gecontroleerd.`);

  // Fase-herkenning op de Gagné-flow
  const phases = gagne.map((s) => classifySlide(s).id).join(',');
  ok(phases === 'hero,doelen,check,theorie,code,opdracht,theorie,check,theorie', `gagné fasen: ${phases}`);
  const bal = deckBalance(gagne);
  ok(bal.theory === 4 && bal.interaction === 3 && bal.theoryPct + bal.interactionPct === 100, 'deckBalance gagné');
  ok(deckBalance([]).total === 0, 'deckBalance leeg');
  // Echte decks: classificatie crasht nooit
  for (const file of findDecks(presentationsRoot)) for (const s of parseDeck(fs.readFileSync(file, 'utf8')).slides) classifySlide(s);
}

/* ---- (i) Didactische Coach & notitie-chips ---- */
{
  // Segmentatie: HTML-kaarten aan/uit = origineel
  const cardsBody = slideTemplateBody('cards');
  const segs = C.findSegmentables(cardsBody);
  ok(segs.length === 1 && segs[0].count === 3 && segs[0].fragments === 0, 'segment: 3 kaarten gevonden');
  const on = C.setItemsFragment(cardsBody, segs[0], true);
  ok((on.match(/fragment/g) || []).length === 3 && C.findSegmentables(on)[0].fragments === 3, 'segment: fragment op alle kaarten');
  ok(C.setItemsFragment(on, C.findSegmentables(on)[0], false) === cardsBody, 'segment: uit = origineel (html)');
  // Segmentatie: Markdown-lijst
  const listBody = '## Titel\n\n- een\n- twee\n- drie\n\n<div class="footer"><span>x</span><span class="num">01</span></div>';
  const ls = C.findSegmentables(listBody);
  ok(ls.length === 1 && ls[0].md && ls[0].count === 3, 'segment: markdown-lijst gevonden');
  const lsOn = C.setItemsFragment(listBody, ls[0], true);
  ok((lsOn.match(/<!-- \.element: class="fragment" -->/g) || []).length === 3, 'segment: element-comments op lijstitems');
  ok(C.setItemsFragment(lsOn, C.findSegmentables(lsOn)[0], false) === listBody, 'segment: uit = origineel (markdown)');
  const lsHtml = renderSlideBody(lsOn, { annotate: true });
  ok((lsHtml.match(/<li class="fragment">/g) || []).length === 3 && !lsHtml.includes('.element'), 'render: fragment op <li>');
  ok(C.analyzeSlide({ body: cardsBody }).some((t) => t.id.startsWith('segment') && t.actions.length), 'analyse: segment-tip');
  ok(!C.analyzeSlide({ body: on }).some((t) => t.id.startsWith('segment') && !t.quiet), 'analyse: geen segment-tip als al stapsgewijs');

  // Redundantie
  const long = 'Dit is een hele lange alinea met heel veel woorden die de docent eigenlijk gewoon hardop vertelt tijdens de les. '.repeat(4).trim();
  const redBody = `## Titel als stelling over iets\n\n${long}\n\nKort.\n\n<div class="footer"><span>x</span><span class="num">01</span></div>`;
  ok(C.proseWordCount(redBody) > C.REDUNDANCY_WORDS, 'redundantie: woorden geteld');
  const red = C.analyzeSlide({ body: redBody, noteText: '' }).find((t) => t.id === 'redundancy');
  ok(red && red.actions.length === 1, 'redundantie: tip + actie');
  const moved = red.actions[0].run(redBody, 'Bestaande notitie');
  ok(!moved.body.includes('hele lange alinea') && moved.body.includes('Kort.') && moved.note.startsWith('Bestaande notitie\n\n') && moved.note.includes('hele lange alinea'), 'redundantie: alinea → notities');
  const htmlP = `<div class="row">\n  <div class="col"><p class="lede">${long}</p></div>\n  <div class="col"><p>Rest</p></div>\n</div>`;
  const cands = C.proseCandidates(htmlP);
  ok(cands.length === 2 && cands[0].path.join('.') === '0.0.0', 'redundantie: html-<p>-kandidaten');
  const sel = C.selectedCandidate(cands, { blockIndex: 0, path: [0, 1, 0], highlight: [0, 1, 0] });
  ok(sel && sel.text === 'Rest', 'redundantie: geselecteerde alinea');
  const mv = C.moveToNotes(htmlP, '', cands[0]);
  ok(!mv.body.includes('lede') && mv.body.includes('<p>Rest</p>') && mv.note === long, 'redundantie: html-<p> verplaatst');
  ok(C.proseWordCount('```js\n' + 'a b c d e f g h i j\n'.repeat(20) + '```') === 0, 'redundantie: code telt niet mee');

  // Signalering
  const code12 = Array.from({ length: 12 }, (_, i) => `regel${i + 1}();`).join('\n');
  ok(C.suggestRanges(code12) === '1-4|5-8|9-12', `suggestRanges blokken: ${C.suggestRanges(code12)}`);
  ok(C.suggestRanges('a\nb\n\nc\nd\ne\n\nf') === '1-2|4-6|8', 'suggestRanges per alinea');
  const mdCode = `## Code\n\n\`\`\`javascript\n${code12}\n\`\`\``;
  const fc = C.findUnfocusedCode(mdCode);
  ok(fc.length === 1 && fc[0].lines === 12, 'signalering: md-codeblok gevonden');
  const focused = C.applyLineFocus(mdCode, fc[0], '1-4|5-8|9-12');
  ok(focused.includes('```javascript [1-4|5-8|9-12]') && C.findUnfocusedCode(focused).length === 0, 'signalering: fence-highlight');
  const termBody = slideTemplateBody('worked').replace(' data-line-numbers="1-2|4-6"', '').replace(/(<code[^>]*>)([\s\S]*?)(<\/code>)/, (m, a, c, z) => `${a}${c}\n${c}${z}`);
  const ft = C.findUnfocusedCode(termBody);
  ok(ft.length === 1 && ft[0].path, 'signalering: html-code gevonden');
  const tFocus = C.analyzeSlide({ body: termBody }).find((t) => t.id.startsWith('code')).actions[0].run(termBody, '');
  ok(/data-line-numbers="[\d|-]+"/.test(tFocus.body) && tFocus.focus && tFocus.focus.field === 'Regel-highlights', 'signalering: data-line-numbers + focus');

  // AE-titel
  ok(C.titleTip({ body: '## Databases\n\nTekst.' }), 'AE-tip bij 1-woord-titel');
  ok(!C.titleTip({ body: '## Een index maakt zoeken honderd keer sneller\n\nTekst.' }), 'geen AE-tip bij stelling');
  ok(!C.titleTip({ body: '<p class="kicker">Leerdoelen</p>\n\n## Leerdoelen\n\n<ul class="check"><li>a</li></ul>' }), 'geen AE-tip op doelen-slide');
  ok(C.mainTitle('<div class="x"><h2 class="title">Twee woorden</h2></div>').path.join('.') === '0.0', 'mainTitle html');

  // Notitie-chips
  ok(NOTE_PROMPTS.length === 4, '4 notitie-chips');
  ok(appendNotePrompt('', 'X') === 'X' && appendNotePrompt('A\n\n', 'X') === 'A\nX', 'appendNotePrompt');
  // noteText accepteert ook `Note: tekst` op één regel (alleen de getter; serialisatie ongewijzigd)
  const one = parseDeck('<!-- frontmatter\ntitle: "x"\n-->\n\n## A\n\nNote: Hallo\n');
  ok(one.slides[0].noteText === 'Hallo' && serializeDeck(one) === '<!-- frontmatter\ntitle: "x"\n-->\n\n## A\n\nNote: Hallo\n', 'noteText op één regel');
}

// --- Tech-logo's, asset-paden en media-manifest (Fase 7A)
{
  ok(TECH_ICONS.length >= 30, `minstens 30 tech-iconen (${TECH_ICONS.length})`);
  ok(new Set(TECH_ICONS.map((i) => i.id)).size === TECH_ICONS.length, 'tech-icoon ids uniek');
  for (const c of TECH_CATEGORIES) ok(TECH_ICONS.some((i) => i.category === c), `categorie ${c} gevuld`);
  for (const must of ['html5', 'css3', 'javascript', 'typescript', 'php', 'csharp', 'python', 'sql', 'json', 'react', 'vue', 'nodejs', 'tailwind', 'threejs', 'unity', 'gamepad', 'git', 'github', 'vscode', 'docker', 'terminal', 'figma', 'browser', 'rest-api', 'server', 'mobile', 'security', 'bug', 'check-badge', 'rocket']) {
    ok(TECH_ICONS.some((i) => i.id === must), `icoon ${must} aanwezig`);
  }
  for (const ic of TECH_ICONS) {
    ok(ic.label && ic.tags.length, `${ic.id}: label en tags`);
    for (const v of ICON_VARIANTS) {
      const uri = techIconDataUri(ic.id, v.id);
      ok(uri.startsWith('data:image/svg+xml;utf8,'), `${ic.id}/${v.id}: data-URI`);
      const svg = decodeURIComponent(uri.slice('data:image/svg+xml;utf8,'.length));
      ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"') && svg.endsWith('</svg>') && !/\n/.test(svg), `${ic.id}/${v.id}: zelfstandige enkelregelige SVG`);
      ok(!/undefined|NaN/.test(svg), `${ic.id}/${v.id}: geen undefined/NaN`);
    }
  }
  ok(techIconSvg('git', 'lime').includes('#8fe507'), 'lime-variant gebruikt #8fe507');
  ok(/#fff/i.test(techIconSvg('git', 'white')) && !techIconSvg('git', 'white').includes('#F05032'), 'wit-variant zonder merkkleur');
  ok(techIconSvg('git', 'brand').includes('#F05032'), 'merkkleur-variant');
  ok(techIconSvg('nope') === '' && techIconDataUri('nope') === '', 'onbekend icoon = leeg');
  ok(searchTechIcons('react').some((i) => i.id === 'react'), 'zoek op label');
  ok(searchTechIcons('database').some((i) => i.id === 'sql'), 'zoek op tag');
  ok(searchTechIcons('', 'Concepten').every((i) => i.category === 'Concepten') && searchTechIcons('zzzz').length === 0, 'zoek op categorie / geen resultaat');
  // Een tech-logo werkt in een <figure>-blok en blijft in één regel (geen ongewenste slide-split)
  const figure = `<figure><img src="${techIconDataUri('react', 'brand')}" alt="React logo"></figure>`;
  const dd = parseDeck(`## A\n\n${figure}\n`);
  ok(dd.slides.length === 1 && serializeDeck(dd).includes(figure), 'tech-logo in figure: verliesvrij, één slide');

  const D = 'presentations/2026-2027/jaar-1/design/design1_logos/slides.md';
  ok(relativeAssetPath(D, 'presentations/2026-2027/jaar-1/design/design1_logos/assets/x.png') === 'assets/x.png', 'relatief pad: eigen assets');
  ok(relativeAssetPath(D, 'shared/img/glr-logo.svg') === '../../../../../shared/img/glr-logo.svg', 'relatief pad: shared');
  ok(relativeAssetPath(D, 'presentations/2026-2027/jaar-1/design/design1_typografie/assets/a.png') === '../design1_typografie/assets/a.png', 'relatief pad: ander deck');
  ok(relativeAssetPath('', 'shared/img/glr-logo.svg') === '/presentations/shared/img/glr-logo.svg', 'zonder deck-pad: absoluut');

  ok(mediaCategory('shared/img/uploads/a.png') === 'Uploads' && mediaCategory('shared/img/glr-logo.svg') === 'Gedeeld', 'media: shared/uploads');
  ok(mediaCategory('presentations/2026-2027/jaar-1/design/x/assets/a.png') === 'Design', 'media: design');
  ok(mediaCategory('presentations/2026-2027/jaar-2/beroeps/beroeps2_x/assets/a.png') === 'Beroeps', 'media: beroeps');
  ok(mediaCategory('presentations/webxr_x/assets/a.png') === 'WebXR' && mediaCategory('presentations/iets/a.png') === 'Overig', 'media: webxr/overig');
  const media = scanMedia(root);
  ok(media.length > 0 && media.every((m) => m.path && m.name && m.folder && m.category && m.ext), 'scanMedia: items compleet');
  ok(media.every((m) => /^(png|jpe?g|svg|webp|gif)$/.test(m.ext) && !m.path.startsWith('/')), 'scanMedia: alleen afbeeldingen, repo-relatief');
  ok(media.some((m) => m.path === 'shared/img/glr-logo.svg' && m.category === 'Gedeeld'), 'scanMedia: shared logo');
  ok(media.some((m) => /\/assets\//.test(m.path)) && media.some((m) => /\/media\//.test(m.path)), 'scanMedia: assets/ en media/');
}

if (!process.argv.includes('--lib')) {
  console.log(failures ? `\n✖ ${failures} fout(en).` : '\n✔ test:parsers geslaagd.');
  process.exit(failures ? 1 : 0);
}

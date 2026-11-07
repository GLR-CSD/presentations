#!/usr/bin/env node
/**
 * Tests voor de globale Undo/Redo-engine (admin/src/app/history.js).
 * Gebruik:  npm run test:history
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDeck, serializeDeck } from '../admin/src/state/deck.js';
import { HistoryManager, makeSnapshot, validSelection } from '../admin/src/app/history.js';
import * as B from '../admin/src/blocks/block-ops.js';
import * as T from '../admin/src/blocks/html-tree.js';
import * as P from '../admin/src/blocks/parsers.js';

let failures = 0;
const ok = (c, m) => { if (!c) { failures += 1; console.error(`✖ ${m}`); } };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = `<!-- frontmatter
title: Test
-->

<!-- .slide: class="dark" -->

## Eerste slide

Een alinea.

<div class="cards"><div class="glr-card"><h3>A</h3><p>a</p></div><div class="glr-card"><h3>B</h3><p>b</p></div></div>

---

## Tweede slide

Tekst twee.

---

## Derde slide

Tekst drie.
`;

let clock = 1000;
const mk = () => {
  const deck = parseDeck(SRC);
  const h = new HistoryManager({ now: () => clock });
  const st = { deck, idx: 0, sel: null };
  const snap = (label, key) => makeSnapshot(st.deck, st.idx, st.sel, { label, coalesceKey: key, timestamp: clock });
  h.reset(snap('Geopend'));
  const rec = (label, origin = 'action', key = null) => h.record(snap(label, key), { label, origin, coalesceKey: key });
  const restore = (s) => { if (!s) return false; st.deck = parseDeck(s.markdown); st.idx = s.slideIndex; st.sel = validSelection(st.deck, s.slideIndex, s.selection); return true; };
  return { st, h, rec, restore, snap };
};
const md = (st) => serializeDeck(st.deck);

ok(md(mk().st) === SRC, 'fixture roundtrip');

// --- coalescing
{
  const { st, h, rec } = mk();
  for (let i = 0; i < 5; i += 1) {
    clock += 100;
    st.deck.slides[0].setBody(`${st.deck.slides[0].body}x`);
    rec('Tekst aangepast', 'form-input', 'k1');
  }
  ok(h.past.length === 1, `5 edits binnen 800ms = 1 stap (${h.past.length})`);
  clock += 1000;
  st.deck.slides[0].setBody(`${st.deck.slides[0].body}y`);
  rec('Tekst aangepast', 'form-input', 'k1');
  ok(h.past.length === 2, 'pauze > 800ms = nieuwe stap');
  clock += 100;
  st.deck.slides[0].setBody(`${st.deck.slides[0].body}z`);
  rec('Tekst aangepast', 'form-input', 'k2');
  ok(h.past.length === 3, 'andere coalesceKey = nieuwe stap');
  clock += 100;
  h.updateView({ slideIndex: 0, selection: { blockIndex: 1, path: [], highlight: [], openItem: -1 } });
  st.deck.slides[0].setBody(`${st.deck.slides[0].body}w`);
  rec('Tekst aangepast', 'form-input', 'k2');
  ok(h.past.length === 4, 'selectiewissel verbreekt coalescing');
  const before = h.past.length;
  h.updateView({ slideIndex: 0, selection: null });
  ok(h.past.length === before, 'selectiewissel zonder edit voegt geen stap toe');
  rec('Niets', 'action');
  ok(h.past.length === before, 'ongewijzigde markdown wordt genegeerd');
}

// --- structuuracties: undo/redo + byte-identiek
{
  const { st, h, rec, restore } = mk();
  const states = [md(st)];
  const views = [{ idx: 0, sel: null }];
  // views[i] = view vlak vóór stap i+1 (dat herstelt undo); na de laatste stap de eindview
  const step = (label, fn) => {
    views[views.length - 1] = { idx: st.idx, sel: st.sel };
    fn(); rec(label); h.updateView({ slideIndex: st.idx, selection: st.sel }); states.push(md(st)); views.push({ idx: st.idx, sel: st.sel });
  };

  // blok selecteren en verwijderen
  st.sel = { blockIndex: 1, path: [], highlight: [], openItem: -1 };
  h.updateView({ slideIndex: st.idx, selection: st.sel });
  step('Blok verwijderd', () => {
    const r = B.removeSelection(st.deck.slides[0].body, st.sel);
    st.deck.slides[0].setBody(r.body); st.sel = r.selection || null;
  });
  ok(states[1] !== states[0], 'blok verwijderd verandert deck');

  // kaart toevoegen in repeater
  const body = st.deck.slides[0].body;
  const bi = B.blocksOf(body).findIndex((b) => b.type === 'htmlBlock' && /class="cards"/.test(b.attrs.html));
  ok(bi >= 0, 'cards-blok aanwezig');
  st.sel = { blockIndex: bi, path: [0], highlight: [0], openItem: -1 };
  h.updateView({ slideIndex: 0, selection: st.sel });
  step('Kaart toegevoegd', () => {
    const html = B.htmlAt(st.deck.slides[0].body, bi);
    const node = T.nodeAt(T.parse(html), [0]);
    const rep = P.describe(html, node).fields.find((f) => f.kind === 'repeater');
    st.deck.slides[0].setBody(B.setHtmlAt(st.deck.slides[0].body, bi, rep.add(html, node)));
  });

  // slide toevoegen, daarna verwijderen
  step('Slide toegevoegd', () => { st.deck.insertSlide(1, {}); st.idx = 1; st.sel = null; });
  step('Slide verwijderd', () => { st.deck.removeSlide(1); st.idx = 0; });

  const final = md(st);
  for (let i = states.length - 1; i >= 1; i -= 1) {
    ok(restore(h.undo()), `undo ${i} beschikbaar`);
    ok(md(st) === states[i - 1], `undo ${i} herstelt vorige staat byte-identiek`);
    ok(st.idx === views[i - 1].idx, `undo ${i} herstelt slideIndex`);
    ok(JSON.stringify(st.sel) === JSON.stringify(views[i - 1].sel), `undo ${i} herstelt selectie`);
  }
  ok(md(st) === SRC, 'volledige undo-keten = originele slides.md');
  ok(!h.canUndo && h.undo() === null, 'geen undo meer');
  for (let i = 1; i < states.length; i += 1) {
    ok(restore(h.redo()), `redo ${i}`);
    ok(md(st) === states[i], `redo ${i} byte-identiek`);
    ok(st.idx === views[i].idx, `redo ${i} herstelt slideIndex`);
  }
  ok(md(st) === final, 'volledige redo-keten = eindtoestand');
  ok(!h.canRedo, 'geen redo meer');
}

// --- labels, future leegmaken, limiet
{
  const { st, h, rec } = mk();
  st.deck.slides[1].setBody('## X'); rec('Blok verwijderd');
  ok(h.undoLabel === 'Blok verwijderd' && h.redoLabel === '', 'undoLabel');
  h.undo();
  ok(h.redoLabel === 'Blok verwijderd' && h.undoLabel === '', 'redoLabel');
  st.deck = parseDeck(SRC); st.deck.slides[1].setBody('## Y'); rec('Nieuwe edit');
  ok(!h.canRedo, 'nieuwe edit leegt future');

  const m = mk();
  for (let i = 0; i < 130; i += 1) { m.st.deck.slides[0].setBody(`## ${i}`); m.rec(`s${i}`); }
  ok(m.h.past.length === 100, `limiet 100 (${m.h.past.length})`);
  m.h.reset(m.snap('nieuw'));
  ok(!m.h.canUndo && !m.h.canRedo, 'reset leegt history');
}

// --- validSelection
{
  const deck = parseDeck(SRC);
  ok(validSelection(deck, 0, { blockIndex: 99, path: [] }) === null, 'validSelection: verdwenen blok = null');
  ok(validSelection(deck, 0, { blockIndex: 0, path: [] }) !== null, 'validSelection: bestaand blok');
  ok(validSelection(deck, 9, { blockIndex: 0, path: [] }) === null, 'validSelection: verdwenen slide');
  ok(validSelection(deck, 0, null) === null, 'validSelection: geen selectie');
}

void fs; void root;
if (failures) { console.error(`\n${failures} test(s) mislukt.`); process.exit(1); }
console.log('✔ history: alle tests geslaagd');

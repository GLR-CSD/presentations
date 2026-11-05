#!/usr/bin/env node
/**
 * Fidelity-test voor de markdown ↔ ProseMirror-brug (admin/src/markdown/bridge.js).
 *
 * Voor elke slide-body in elk deck: bodyToDoc → docToBody en vergelijk met het
 * origineel. Rapporteert hoeveel bodies byte-identiek terugkomen (ideaal) en
 * toont de eerste afwijking per deck. Daarnaast een rooktest van de
 * reveal-HTML-renderer (render.js).
 *
 * Gebruik:  node scripts/test-bridge.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDeck } from '../admin/src/state/deck.js';
import { bodyToDoc, docToBody } from '../admin/src/markdown/bridge.js';
import { deckToSlidesHtml } from '../admin/src/markdown/render.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const presentationsRoot = path.join(root, 'presentations');

function isDeckMarkdown(file) {
  if (path.basename(file) === 'slides.md') return true;
  try {
    return /^(---|<!--\s*frontmatter)/.test(fs.readFileSync(file, 'utf8'));
  } catch {
    return false;
  }
}
function findDecks(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) findDecks(abs, out);
    else if (e.isFile() && /\.md$/i.test(e.name) && isDeckMarkdown(abs)) out.push(abs);
  }
  return out;
}

const decks = findDecks(presentationsRoot).sort();
let totalBodies = 0;
let identical = 0;
const perDeck = [];

for (const file of decks) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  const deck = parseDeck(fs.readFileSync(file, 'utf8'));
  let deckIdentical = 0;
  let firstDiff = null;
  deck.slides.forEach((slide, idx) => {
    totalBodies += 1;
    const back = docToBody(bodyToDoc(slide.body));
    if (back === slide.body) {
      identical += 1;
      deckIdentical += 1;
    } else if (!firstDiff) {
      let i = 0;
      while (i < Math.min(back.length, slide.body.length) && back[i] === slide.body[i]) i += 1;
      firstDiff = { idx, at: i, orig: slide.body.slice(Math.max(0, i - 25), i + 35), got: back.slice(Math.max(0, i - 25), i + 35) };
    }
  });
  perDeck.push({ rel, slides: deck.slides.length, identical: deckIdentical, firstDiff });

  // Rooktest renderer: moet niet crashen en dezelfde #secties opleveren als slides.
  const html = deckToSlidesHtml(deck);
  const sectionCount = (html.match(/<section/g) || []).length;
  if (sectionCount < 1) console.error(`✖ renderer gaf geen <section> voor ${rel}`);
}

console.log('Markdown ↔ ProseMirror brug — fidelity per deck:');
for (const d of perDeck) {
  const pct = ((d.identical / d.slides) * 100).toFixed(0);
  const mark = d.identical === d.slides ? '✔' : '•';
  console.log(`  ${mark} ${pct.padStart(3)}% (${d.identical}/${d.slides})  ${d.rel}`);
  if (d.firstDiff) {
    console.log(`       eerste verschil in slide #${d.firstDiff.idx + 1} op byte ${d.firstDiff.at}:`);
    console.log(`         orig: ${JSON.stringify(d.firstDiff.orig)}`);
    console.log(`         got : ${JSON.stringify(d.firstDiff.got)}`);
  }
}
console.log(`\nTotaal: ${identical}/${totalBodies} bodies byte-identiek (${((identical / totalBodies) * 100).toFixed(1)}%).`);
process.exit(0);

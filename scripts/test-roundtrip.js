#!/usr/bin/env node
/**
 * Round-trip test voor de verliesvrije deck-parser (admin/src/state/deck.js).
 *
 * Bewijst dat `serializeDeck(parseDeck(src)) === src` byte-voor-byte voor elk
 * deck in `presentations/`, plus dat een edit alleen de bewerkte slide raakt.
 *
 * Gebruik:  npm run test:roundtrip
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDeck, serializeDeck } from '../admin/src/state/deck.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const presentationsRoot = path.join(root, 'presentations');

/** Is dit .md-bestand een reveal-deck? (zelfde regel als build-index.js) */
function isDeckMarkdown(file) {
  if (path.basename(file) === 'slides.md') return true;
  try {
    return /^(---|<!--\s*frontmatter)/.test(fs.readFileSync(file, 'utf8'));
  } catch {
    return false;
  }
}

/** Alle deck-.md-bestanden (recursief). */
function findDecks(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) findDecks(abs, out);
    else if (entry.isFile() && /\.md$/i.test(entry.name) && isDeckMarkdown(abs)) out.push(abs);
  }
  return out;
}

const decks = findDecks(presentationsRoot).sort();
if (decks.length === 0) {
  console.error('Geen decks gevonden onder presentations/.');
  process.exit(1);
}

let failed = 0;
let totalSlides = 0;

for (const file of decks) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  const src = fs.readFileSync(file, 'utf8');
  const deck = parseDeck(src);
  const out = serializeDeck(deck);

  const ok = out === src;
  const title = deck.frontmatter ? deck.frontmatter.get('title') : '(geen frontmatter)';
  totalSlides += deck.slides.length;

  if (ok) {
    console.log(`✔ ${rel}`);
    console.log(`   ${deck.slides.length} slides · frontmatter: ${title}${deck.frontmatter ? '' : ' ⚠'}`);
    if (deck.fenceWarnings.length) {
      console.log(`   ⚠ ${deck.fenceWarnings.length} scheidingsteken(s) binnen een code-fence (regel-index ${deck.fenceWarnings.join(', ')})`);
    }
  } else {
    failed += 1;
    console.error(`✖ ROUND-TRIP MISLUKT: ${rel}`);
    // Toon de eerste afwijking.
    let i = 0;
    while (i < Math.min(src.length, out.length) && src[i] === out[i]) i += 1;
    console.error(`   eerste verschil op byte ${i}:`);
    console.error(`   verwacht: ${JSON.stringify(src.slice(Math.max(0, i - 30), i + 30))}`);
    console.error(`   gekregen: ${JSON.stringify(out.slice(Math.max(0, i - 30), i + 30))}`);
    console.error(`   lengte: bron=${src.length} uit=${out.length}`);
  }
}

/* ---- Edit-test: een wijziging mag alleen de bewerkte slide raken ---- */
const editTarget = decks[0];
{
  const src = fs.readFileSync(editTarget, 'utf8');
  const deck = parseDeck(src);
  const before = deck.slides.map((s) => s.raw);
  deck.slides[1].setBody('<p class="kicker">Aangepast</p>\n\n## Bewerkt\n\n<div class="footer"><span>Test</span><span class="num">99</span></div>');
  const edited = serializeDeck(deck);
  const deck2 = parseDeck(edited);
  const after = deck2.slides.map((s) => s.raw);
  const changed = before.map((b, i) => (b === after[i] ? null : i)).filter((x) => x !== null);
  const editOk = changed.length === 1 && changed[0] === 1 && edited.includes('Aangepast');
  console.log(`\n${editOk ? '✔' : '✖'} edit-isolatie (${path.relative(root, editTarget)}): gewijzigde slides = [${changed.join(', ')}]`);
  if (!editOk) failed += 1;
}

console.log(`\n${failed === 0 ? '✔' : '✖'} ${decks.length} decks, ${totalSlides} slides, ${failed} fout(en).`);
process.exit(failed === 0 ? 0 : 1);

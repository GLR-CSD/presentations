#!/usr/bin/env node
/**
 * Exporteert elke presentatie met een `index.html` naar PDF via DeckTape.
 *
 * Standaard wordt DeckTape in Docker gedraaid (zelfde aanpak als de CI-pipeline),
 * zodat je lokaal geen Chrome-afhankelijkheden hoeft te installeren:
 *
 *     npm run export:pdf
 *
 * Heb je DeckTape lokaal geïnstalleerd (bijv. via npm), gebruik dan:
 *
 *     npm run export:pdf -- --local
 *
 * Het resultaat komt naast elke `index.html` te staan als `presentation.pdf`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const presentationsRoot = path.join(root, 'presentations');
const useLocal = process.argv.includes('--local');

/** Vindt elke map met een index.html (recursief). */
function findDecks(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  if (entries.some((e) => e.isFile() && e.name === 'index.html')) {
    out.push(dir);
    return out;
  }
  for (const entry of entries.filter((e) => e.isDirectory())) {
    findDecks(path.join(dir, entry.name), out);
  }
  return out;
}

const decks = findDecks(presentationsRoot);
if (decks.length === 0) {
  console.log('Geen presentaties met index.html gevonden — niets te exporteren.');
  process.exit(0);
}

let failures = 0;
for (const deck of decks) {
  const rel = path.relative(root, deck);
  console.log(`\n▸ PDF genereren voor: ${rel}`);

  // De decks verwijzen met een relatief pad (../../../../../shared/...) naar de
  // gedeelde map. Daarom mounten we de hele repo-root op /slides, zodat die
  // verwijzing binnen de container klopt.
  const relPath = path.relative(root, deck).split(path.sep).join('/');
  // --allow-file-access-from-files: Markdown-decks laden `slides.md` via XHR,
  // wat Chromium op file:// anders blokkeert (resultaat: lege PDF).
  const chromeArg = '--chrome-arg=--allow-file-access-from-files';
  // ?showNotes=true laat reveal.js de sprekernotities in de slides renderen.
  // DeckTape behoudt de query alleen als de invoer een volledige URL is (anders
  // wordt de '?' als bestandsnaam gezien), vandaar de expliciete file://-URL's.
  const localUrl = `${pathToFileURL(path.join(deck, 'index.html')).href}?showNotes=true`;
  const dockerUrl = `file:///slides/${relPath}/index.html?showNotes=true`;
  // DeckTape draait intern als non-root `node` (UID 1000). Draai de container als
  // de host-gebruiker en geef Chromium een schrijfbare HOME, anders kan de
  // container niet in de gemounte map schrijven (EACCES: permission denied).
  const dockerArgs = ['run', '--rm'];
  if (typeof process.getuid === 'function' && typeof process.getgid === 'function') {
    dockerArgs.push('--user', `${process.getuid()}:${process.getgid()}`, '-e', 'HOME=/tmp');
  }
  dockerArgs.push('-v', `${root}:/slides`, 'ghcr.io/astefanutti/decktape:3.17.0', chromeArg,
    '--size', '1920x1080', dockerUrl, `/slides/${relPath}/presentation.pdf`);

  const args = useLocal
    ? [chromeArg, '--size', '1920x1080', localUrl, 'presentation.pdf']
    : dockerArgs;
  const command = useLocal ? 'decktape' : 'docker';

  const result = spawnSync(command, args, { cwd: deck, stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    failures += 1;
    console.error(`✖ Mislukt: ${rel}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} van de ${decks.length} presentatie(s) mislukt.`);
  process.exit(1);
}
console.log(`\n✔ Alle ${decks.length} PDF('s) gegenereerd.`);

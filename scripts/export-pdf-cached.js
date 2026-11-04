#!/usr/bin/env node
/**
 * CI-variant van `export-pdf.js` met **incrementele, content-addressed caching**
 * via de GitHub Actions Cache Service (`@actions/cache`).
 *
 * Werkwijze:
 *   1. `sharedHash` = hash over alle gedeelde assets (`shared/**`), de
 *      DeckTape-image en dit script zelf. Wijzigt er iets gedeelds (thema,
 *      reveal.js, DeckTape-versie of de exportlogica), dan verandert deze hash
 *      en worden alle PDF's opnieuw gebouwd.
 *   2. Per presentatie een `deckHash` over alle bestanden in de presentatiemap
 *      (m.u.v. de gegenereerde PDF). De cache-key wordt
 *      `pdf-v1-<veilig-pad>-<deckHash>`.
 *   3. Per presentatie: probeer de PDF uit de GitHub-cache te restoren. Hit →
 *      de dure DeckTape-render overslaan. Miss → bouwen en opslaan.
 *
 * De cache is *best-effort*: ontbreekt de runtime (lokaal) of faalt de
 * cache-service, dan bouwen we zonder cache — exact het huidige gedrag.
 *
 * Gebruik:
 *   npm run export:pdf:cached                 # bouwt alleen wat gewijzigd is
 *   npm run export:pdf:cached -- --dry-run    # toon cache-status zonder bouwen
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptFile = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(scriptFile), '..');
const distDir = path.join(root, 'dist');
const distPresentationsRoot = path.join(distDir, 'presentations');
const sourcePresentationsRoot = path.join(root, 'presentations');
const sharedRoot = path.join(root, 'shared');

const DECKTAPE_IMAGE = 'astefanutti/decktape:3.12.0';
const EXPORT_SIZE = '1920x1080';
// v2: v1 bevatte lege PDF's van Markdown-decks (file://-XHR geblokkeerd).
const CACHE_VERSION = 'v2'; // bump om de volledige cache te invalidaten
// Een lege 1920x1080-pagina is ~850 B; een echte slide met fonts is veel groter.
const MIN_PDF_BYTES = 10 * 1024;
const dryRun = process.argv.includes('--dry-run');

// --- hashing ---------------------------------------------------------------

function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

/** Alle bestanden onder `dir`, recursief. */
function listFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(abs, out);
    else if (entry.isFile()) out.push(abs);
  }
  return out;
}

/**
 * Deterministische hash over een bestandsboom: gesorteerde relatieve
 * POSIX-paden + bestandsinhoud. Sorteren maakt de hash onafhankelijk van de
 * (filesystem-afhankelijke) readdir-volgorde; het pad meenemen zorgt dat een
 * rename de cache invalideert.
 */
function hashTree(dir, { exclude = () => false } = {}) {
  const rels = listFiles(dir)
    .filter((abs) => !exclude(abs))
    .map((abs) => path.relative(dir, abs).split(path.sep).join('/'))
    .sort();
  const hash = crypto.createHash('sha256');
  for (const rel of rels) {
    hash.update(`${rel}\0${hashFile(path.join(dir, rel))}\n`);
  }
  return hash.digest('hex');
}

function computeSharedHash() {
  const hash = crypto.createHash('sha256');
  hash.update(`decktape=${DECKTAPE_IMAGE}\n`);
  hash.update(`size=${EXPORT_SIZE}\n`);
  hash.update(`shared=${hashTree(sharedRoot)}\n`);
  // Dit script zelf: wijzigingen aan de exportlogica of DeckTape-flags busten.
  hash.update(`script=${hashFile(scriptFile)}\n`);
  return hash.digest('hex');
}

// --- cache-runtime ---------------------------------------------------------

/**
 * De GitHub-runner injecteert ACTIONS_RUNTIME_TOKEN + cache-URL alleen in
 * JavaScript-actions (`uses:`), niet in `run:`-stappen. De workflow exporteert
 * ze daarom expliciet naar GITHUB_ENV (zie deploy.yml).
 */
function cacheRuntimeAvailable() {
  const url = process.env.ACTIONS_RESULTS_URL || process.env.ACTIONS_CACHE_URL;
  return Boolean(process.env.ACTIONS_RUNTIME_TOKEN && url);
}

let cache = null;
if (cacheRuntimeAvailable()) {
  try {
    // @actions/cache >= 6 is ESM-only → dynamische import, geen require().
    cache = await import('@actions/cache');
  } catch (err) {
    console.warn(`⚠️  @actions/cache niet geladen (${err.message}); PDF's worden zonder cache gebouwd.`);
  }
} else {
  console.log('ℹ️  Geen GitHub-cache-runtime gevonden — PDF-export zonder caching.');
}

// --- presentaties ----------------------------------------------------------

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

/** Relatief POSIX-pad t.o.v. de huidige werkmap (de runner-workspace in CI). */
function cwdRelativePosix(abs) {
  return path.relative(process.cwd(), abs).split(path.sep).join('/');
}

function runDecktape(deckDir, rel) {
  const relPath = `presentations/${rel}`;
  const args = ['run', '--rm'];

  // Draai de container als de host-gebruiker zodat de PDF's eigendom van de
  // runner zijn. DeckTape draait intern als `node` (UID 1000) terwijl de
  // ubuntu-runner UID 1001 heeft; zonder --user kan de container niet in de
  // mount schrijven. Chromium heeft bovendien een schrijfbare HOME nodig.
  if (typeof process.getuid === 'function' && typeof process.getgid === 'function') {
    args.push('--user', `${process.getuid()}:${process.getgid()}`, '-e', 'HOME=/tmp');
  }
  args.push(
    '-v', `${distDir}:/slides`,
    DECKTAPE_IMAGE,
    // Markdown-decks laden `slides.md` via XHR; Chromium blokkeert dat op
    // file:// standaard, waardoor de deck zonder slides (= lege PDF) rendert.
    '--chrome-arg=--allow-file-access-from-files',
    '--size', EXPORT_SIZE,
    `/slides/${relPath}/index.html`,
    `/slides/${relPath}/presentation.pdf`,
  );

  const result = spawnSync('docker', args, { cwd: deckDir, stdio: 'inherit' });
  return !result.error && result.status === 0;
}

/** Grootte van de PDF in bytes, of 0 als die ontbreekt. */
function pdfSize(file) {
  try {
    return fs.statSync(file).size;
  } catch {
    return 0;
  }
}

// --- main ------------------------------------------------------------------

const sharedHash = computeSharedHash();
const decks = findDecks(distPresentationsRoot).sort();
if (decks.length === 0) {
  console.log('Geen presentaties met index.html gevonden — niets te exporteren.');
  process.exit(0);
}

let hits = 0;
let built = 0;
let failures = 0;

for (const deckDir of decks) {
  const rel = path.relative(distPresentationsRoot, deckDir).split(path.sep).join('/');
  const pdfAbs = path.join(deckDir, 'presentation.pdf');
  const pdfPath = cwdRelativePosix(pdfAbs); // relatief POSIX-pad voor de cache-API

  const deckHash = crypto
    .createHash('sha256')
    .update(
      `${hashTree(path.join(sourcePresentationsRoot, rel), {
        exclude: (abs) => abs.endsWith('.pdf'), // de output nooit meetellen
      })}|${sharedHash}`,
    )
    .digest('hex');
  const safeRel = rel.replace(/[^a-zA-Z0-9_-]/g, '-');
  const key = `pdf-${CACHE_VERSION}-${safeRel}-${deckHash}`;

  if (dryRun) {
    console.log(`${cache ? 'cache   ' : 'no-cache'}  ${rel}\n           key: ${key}`);
    continue;
  }

  // 1. Probeer de PDF uit de cache te halen.
  if (cache) {
    try {
      const entry = await cache.restoreCache([pdfPath], key);
      // Alleen overslaan als het bestand na restore écht bestaat.
      if (entry && fs.existsSync(pdfAbs)) {
        console.log(`✔ cache-hit: ${rel}`);
        hits += 1;
        continue;
      }
    } catch (err) {
      console.warn(`⚠️  cache-restore mislukt voor ${rel}: ${err.message}`);
    }
  }

  // 2. Cache-miss (of geen cache): PDF bouwen.
  console.log(`▸ PDF genereren voor: ${rel}`);
  if (!runDecktape(deckDir, rel)) {
    console.error(`✖ Mislukt: ${rel}`);
    failures += 1;
    continue;
  }
  // DeckTape slaagt ook als de deck geen slides heeft (bijv. markdown niet
  // geladen). Zo'n lege PDF niet deployen en vooral niet cachen.
  const size = pdfSize(pdfAbs);
  if (size < MIN_PDF_BYTES) {
    console.error(`✖ Lege PDF (${size} bytes): ${rel}`);
    fs.rmSync(pdfAbs, { force: true });
    failures += 1;
    continue;
  }
  built += 1;

  // 3. Nieuwe PDF opslaan (best-effort).
  if (cache) {
    try {
      await cache.saveCache([pdfPath], key);
      console.log(`✔ PDF gecached: ${rel}`);
    } catch (err) {
      console.warn(`⚠️  cache-save mislukt voor ${rel}: ${err.message}`);
    }
  }
}

if (dryRun) process.exit(0);
console.log(
  `\nPDF-export afgerond: ${hits} uit cache, ${built} gebouwd, ${failures} mislukt ` +
  `(totaal ${decks.length}).`,
);
process.exit(failures > 0 ? 1 : 0);

#!/usr/bin/env node
/**
 * PDF-export naar een GitHub Release (tag `pdfs`), incrementeel en parallel.
 *
 * Een deck is "stale" als er geen asset voor bestaat of het hash-label in de
 * release afwijkt van de huidige content-hash (zie scripts/lib/pdf-assets.js).
 * Alleen stale decks worden met DeckTape gerenderd en geüpload; assets van
 * verwijderde decks worden opgeruimd. De release zelf is de enige state.
 *
 * Gebruik:
 *   node scripts/export-pdf-release.js            # render + upload stale decks
 *   node scripts/export-pdf-release.js --plan     # alleen tellen (GITHUB_OUTPUT: stale=<n>)
 *   node scripts/export-pdf-release.js --dry-run  # status per deck tonen
 *   node scripts/export-pdf-release.js --force    # alles opnieuw
 * Env: GITHUB_TOKEN (lezen/uploaden), PDF_CONCURRENCY (default cpus-1).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import {
  root, sourcePresentationsRoot, DECKTAPE_IMAGE, EXPORT_SIZE, PDF_RELEASE_TAG,
  pdfRepo, pdfAssetName, makeLabel, computeDeckHash, listPdfAssets,
} from './lib/pdf-assets.js';

const distPresentationsRoot = path.join(root, 'dist', 'presentations');
const distDir = path.join(root, 'dist');
// Een lege 1920x1080-pagina is ~850 B; een echte slide met fonts is veel groter.
const MIN_PDF_BYTES = 10 * 1024;

const args = new Set(process.argv.slice(2));
const planOnly = args.has('--plan');
const dryRun = args.has('--dry-run');
const force = args.has('--force') || process.env.PDF_FORCE === 'true';
const concurrency = Math.max(1, Number(process.env.PDF_CONCURRENCY) || os.cpus().length - 1);
const hasToken = Boolean(process.env.GITHUB_TOKEN || process.env.GH_TOKEN);

function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

/** Vindt elke map met een index.html (recursief). */
function findDecks(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  if (entries.some((e) => e.isFile() && e.name === 'index.html')) { out.push(dir); return out; }
  for (const e of entries.filter((x) => x.isDirectory())) findDecks(path.join(dir, e.name), out);
  return out;
}

// Decks komen uit de bron (plan werkt zonder dist/); de render gebruikt dist/.
const rels = findDecks(sourcePresentationsRoot).map((d) => path.relative(sourcePresentationsRoot, d).split(path.sep).join('/')).sort();
if (rels.length === 0) { console.log('Geen presentaties gevonden.'); setOutput('stale', 0); process.exit(0); }

const assets = await listPdfAssets(); // Map | null
const decks = rels.map((rel) => {
  const hash = computeDeckHash(rel);
  const a = assets?.get(pdfAssetName(rel));
  return { rel, hash, stale: force || !assets || !a || a.hash !== hash };
});
const stale = decks.filter((d) => d.stale);
const orphans = assets ? [...assets.entries()].filter(([name]) => !rels.some((r) => pdfAssetName(r) === name)) : [];

console.log(`${decks.length} decks, ${stale.length} stale, ${orphans.length} te verwijderen.`);
if (planOnly) { setOutput('stale', stale.length + orphans.length); process.exit(0); }
if (dryRun) {
  for (const d of decks) console.log(`${d.stale ? 'STALE' : 'ok   '}  ${d.hash}  ${d.rel}`);
  process.exit(0);
}

const gh = (a) => spawnSync('gh', a, { stdio: 'inherit', env: process.env });
const ghQuiet = (a) => spawnSync('gh', a, { encoding: 'utf8', env: process.env });
const repo = pdfRepo();

function ensureRelease() {
  if (ghQuiet(['release', 'view', PDF_RELEASE_TAG, '-R', repo]).status === 0) return;
  gh(['release', 'create', PDF_RELEASE_TAG, '-R', repo, '--latest=false', '--title', 'Presentatie-PDF\'s',
    '--notes', 'Automatisch gegenereerd door .github/workflows/pdfs.yml. Niet handmatig wijzigen.']);
}

function render(rel) {
  const relPath = `presentations/${rel}`;
  const a = ['run', '--rm'];
  if (typeof process.getuid === 'function') a.push('--user', `${process.getuid()}:${process.getgid()}`, '-e', 'HOME=/tmp');
  a.push('-v', `${distDir}:/slides`, DECKTAPE_IMAGE,
    '--chrome-arg=--allow-file-access-from-files', '--size', EXPORT_SIZE,
    `file:///slides/${relPath}/index.html?showNotes=true`, `/slides/${relPath}/presentation.pdf`);
  return new Promise((resolve) => {
    const p = spawn('docker', a, { cwd: path.join(distPresentationsRoot, rel), stdio: 'inherit' });
    p.on('error', () => resolve(false));
    p.on('exit', (code) => resolve(code === 0));
  });
}

let changed = 0;
let failures = 0;

if (stale.length > 0) {
  if (hasToken) ensureRelease();
  spawnSync('docker', ['pull', DECKTAPE_IMAGE], { stdio: 'inherit' });
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfs-'));
  const queue = [...stale];

  async function worker() {
    for (let d = queue.shift(); d; d = queue.shift()) {
      console.log(`▸ PDF genereren: ${d.rel}`);
      const pdf = path.join(distPresentationsRoot, d.rel, 'presentation.pdf');
      const ok = await render(d.rel);
      const size = fs.existsSync(pdf) ? fs.statSync(pdf).size : 0;
      // DeckTape slaagt ook bij een deck zonder slides; zo'n lege PDF nooit uploaden.
      if (!ok || size < MIN_PDF_BYTES) {
        console.error(`✖ Mislukt of lege PDF (${size} bytes): ${d.rel}`);
        fs.rmSync(pdf, { force: true });
        failures += 1;
        continue;
      }
      if (!hasToken) { console.log(`✔ gebouwd (geen token, niet geüpload): ${d.rel}`); continue; }
      const asset = path.join(outDir, pdfAssetName(d.rel));
      fs.copyFileSync(pdf, asset);
      const up = gh(['release', 'upload', PDF_RELEASE_TAG, '-R', repo, '--clobber', `${asset}#${makeLabel(d.rel, d.hash)}`]);
      if (up.status === 0) { changed += 1; console.log(`✔ geüpload: ${d.rel}`); } else { failures += 1; console.error(`✖ upload mislukt: ${d.rel}`); }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, stale.length) }, worker));
}

if (hasToken) {
  for (const [name] of orphans) {
    if (gh(['release', 'delete-asset', PDF_RELEASE_TAG, name, '-R', repo, '-y']).status === 0) changed += 1;
  }
}

console.log(`\nKlaar: ${changed} gewijzigd, ${failures} mislukt (totaal ${decks.length}).`);
setOutput('changed', changed);
process.exit(failures > 0 ? 1 : 0);

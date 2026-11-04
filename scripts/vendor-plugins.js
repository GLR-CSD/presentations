#!/usr/bin/env node
/**
 * Zet de externe reveal.js-afhankelijkheden klaar in `shared/vendor/`:
 *
 *   1. **KaTeX** — gekopieerd uit `node_modules` (npm-dependency). De
 *      reveal.js `math`-plugin rendert formules hiermee volledig offline
 *      (geen CDN nodig) via de `katex.local`-config in de decks.
 *   2. **reveal.js-plugins** (rajgoel) — `chalkboard` (tekenen op slides) en
 *      `customcontrols` (knoppen om de chalkboard/notities-canvas te openen).
 *      Deze staan niet op npm en worden daarom gepind op een vaste commit
 *      gedownload. Gepind = reproduceerbare builds, net als de DeckTape-image.
 *
 * De map `shared/vendor/` staat in .gitignore: het is een gegenereerd
 * artefact (net als de reveal.js-distributie uit `vendor-reveal.js`).
 *
 * Gebruik:  npm run vendor   (of los: node scripts/vendor-plugins.js)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vendorDir = path.join(root, 'shared', 'vendor');

// --- KaTeX (offline wiskunde-rendering) ------------------------------------
const katexSrc = path.join(root, 'node_modules', 'katex', 'dist');
const katexDir = path.join(vendorDir, 'katex');
if (!fs.existsSync(katexSrc)) {
  console.error('✖ katex niet gevonden in node_modules. Voer eerst `npm install` uit.');
  process.exit(1);
}
fs.rmSync(katexDir, { recursive: true, force: true });
fs.cpSync(katexSrc, path.join(katexDir, 'dist'), { recursive: true });
console.log(`✔ KaTeX gekopieerd naar ${path.relative(root, path.join(katexDir, 'dist'))}/`);

// --- reveal.js-plugins: chalkboard + customcontrols (offline, gepind) -------
const PLUGINS_COMMIT = '5e5375a830eb8101836c10c1f3b56c71066c458e'; // rajgoel/reveal.js-plugins
const BASE = `https://raw.githubusercontent.com/rajgoel/reveal.js-plugins/${PLUGINS_COMMIT}`;

// De chalkboard-plugin verwijst met relatieve paden naar deze afbeeldingen.
const CHALKBOARD_IMAGES = [
  'blackboard.png', 'whiteboard.png', 'sponge.png',
  'boardmarker-black.png', 'boardmarker-blue.png', 'boardmarker-green.png',
  'boardmarker-orange.png', 'boardmarker-purple.png', 'boardmarker-red.png',
  'boardmarker-yellow.png',
  'chalk-blue.png', 'chalk-green.png', 'chalk-orange.png', 'chalk-purple.png',
  'chalk-red.png', 'chalk-white.png', 'chalk-yellow.png',
];

const FILES = [
  'chalkboard/plugin.js',
  'chalkboard/style.css',
  'customcontrols/plugin.js',
  'customcontrols/style.css',
  ...CHALKBOARD_IMAGES.map((name) => `chalkboard/img/${name}`),
];

/** Downloadt één bestand uit de gepinde reveal.js-plugins-commit. */
async function download(relPath) {
  const url = `${BASE}/${relPath}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} voor ${url}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const dest = path.join(vendorDir, relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buffer);
  return buffer.length;
}

// Oude versies opruimen zodat verwijderde bestanden niet blijven staan.
fs.rmSync(path.join(vendorDir, 'chalkboard'), { recursive: true, force: true });
fs.rmSync(path.join(vendorDir, 'customcontrols'), { recursive: true, force: true });

let total = 0;
for (const file of FILES) {
  total += await download(file);
}
console.log(
  `✔ reveal.js-plugins (chalkboard + customcontrols) gedownload ` +
  `(${FILES.length} bestanden, ${Math.round(total / 1024)} kB).`,
);

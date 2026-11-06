/**
 * Gedeelde logica voor PDF-hosting op een GitHub Release (tag `pdfs`).
 *
 * Gebruikt door `build-index.js` (status + link op de portaalpagina) en
 * `export-pdf-release.js` (renderen + uploaden). Door hashes en assetnamen op
 * één plek te berekenen blijven beide altijd synchroon.
 *
 * Alleen Node-built-ins: draait dus zonder `npm ci`.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const libDir = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(libDir, '..', '..');
export const sourcePresentationsRoot = path.join(root, 'presentations');
const sharedRoot = path.join(root, 'shared');

export const PDF_RELEASE_TAG = 'pdfs';
export const DECKTAPE_IMAGE = 'ghcr.io/astefanutti/decktape:3.17.0';
export const EXPORT_SIZE = '1920x1080';
export const HASH_LEN = 16;
const LABEL_SEP = ' · ';

export const pdfRepo = () => process.env.GITHUB_REPOSITORY || 'GLR-CSD/presentations';

/** `2026-2027/jaar-1/design/x` -> `2026-2027--jaar-1--design--x.pdf` */
export function pdfAssetName(rel) {
  return `${rel.split('/').join('--').replace(/[^A-Za-z0-9._-]/g, '-')}.pdf`;
}

export const pdfUrl = (rel) =>
  `https://github.com/${pdfRepo()}/releases/download/${PDF_RELEASE_TAG}/${pdfAssetName(rel)}`;

export const makeLabel = (rel, hash) => `${rel}${LABEL_SEP}${hash}`;
export const parseLabelHash = (label) => (label && label.includes(LABEL_SEP) ? label.split(LABEL_SEP).pop() : '');

// --- hashing ---------------------------------------------------------------

const sha = (data) => crypto.createHash('sha256').update(data);
const hashFile = (file) => sha(fs.readFileSync(file)).digest('hex');

export function listFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(abs, out);
    else if (entry.isFile()) out.push(abs);
  }
  return out;
}

/** Deterministische hash over gesorteerde relatieve paden + inhoud. */
export function hashTree(dir, { exclude = () => false } = {}) {
  const rels = listFiles(dir)
    .filter((abs) => !exclude(abs))
    .map((abs) => path.relative(dir, abs).split(path.sep).join('/'))
    .sort();
  const h = crypto.createHash('sha256');
  for (const rel of rels) h.update(`${rel}\0${hashFile(path.join(dir, rel))}\n`);
  return h.digest('hex');
}

/** Integrity-hash van een npm-pakket uit package-lock.json. */
function lockIntegrity(name) {
  try {
    const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
    return lock.packages?.[`node_modules/${name}`]?.integrity || '';
  } catch {
    return '';
  }
}

let sharedHashCache = null;
/**
 * Hash over de *inputs* van de render (niet over gevendorde output), zodat hij
 * berekend kan worden zonder `npm ci`/vendor. Uploads staan buiten de hash;
 * die tellen per deck mee (zie computeDeckHash).
 */
export function computeSharedHash() {
  if (sharedHashCache) return sharedHashCache;
  const sharedDir = sharedRoot;
  const h = crypto.createHash('sha256');
  h.update(`decktape=${DECKTAPE_IMAGE}\nsize=${EXPORT_SIZE}\n`);
  h.update(`shared=${hashTree(sharedDir, {
    exclude: (abs) => {
      const rel = path.relative(sharedDir, abs).split(path.sep).join('/');
      return rel.startsWith('vendor/') || rel.startsWith('img/uploads/');
    },
  })}\n`);
  h.update(`reveal=${lockIntegrity('reveal.js')}\nkatex=${lockIntegrity('katex')}\n`);
  for (const f of ['scripts/vendor-reveal.js', 'scripts/vendor-plugins.js', 'scripts/lib/html-shell.js', 'scripts/lib/pdf-assets.js', 'scripts/export-pdf-release.js']) {
    const abs = path.join(root, f);
    h.update(`${f}=${fs.existsSync(abs) ? hashFile(abs) : ''}\n`);
  }
  sharedHashCache = h.digest('hex');
  return sharedHashCache;
}

/** Hash van één deck: bestanden + gebruikte uploads + sharedHash. */
export function computeDeckHash(rel) {
  const dir = path.join(sourcePresentationsRoot, rel);
  const h = crypto.createHash('sha256');
  h.update(hashTree(dir, { exclude: (abs) => abs.endsWith('.pdf') }));
  // Uploads die in de decktekst voorkomen tellen mee voor dit deck alleen.
  const used = new Set();
  for (const f of listFiles(dir)) {
    if (!/\.(md|html|css|js)$/i.test(f)) continue;
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/img\/uploads\/([A-Za-z0-9._\-/]+)/g)) used.add(m[1]);
  }
  for (const name of [...used].sort()) {
    const abs = path.join(sharedRoot, 'img', 'uploads', name);
    h.update(`upload:${name}=${fs.existsSync(abs) ? hashFile(abs) : 'missing'}\n`);
  }
  h.update(`|${computeSharedHash()}`);
  return h.digest('hex').slice(0, HASH_LEN);
}

// --- release-assets --------------------------------------------------------

/**
 * Leest de assets van de `pdfs`-release. Geeft een Map(assetnaam -> {hash,id})
 * terug; lege Map als de release nog niet bestaat; `null` bij geen token of
 * een API-fout (dan is de status onbekend).
 */
export async function listPdfAssets() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) return null;
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  const api = `https://api.github.com/repos/${pdfRepo()}`;
  try {
    const rel = await fetch(`${api}/releases/tags/${PDF_RELEASE_TAG}`, { headers });
    if (rel.status === 404) return new Map();
    if (!rel.ok) throw new Error(`HTTP ${rel.status}`);
    const { id } = await rel.json();
    const map = new Map();
    for (let page = 1; ; page += 1) {
      const res = await fetch(`${api}/releases/${id}/assets?per_page=100&page=${page}`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const assets = await res.json();
      for (const a of assets) map.set(a.name, { hash: parseLabelHash(a.label), id: a.id });
      if (assets.length < 100) break;
    }
    return map;
  } catch (err) {
    console.warn(`⚠️  Release-assets niet te lezen (${err.message}); PDF-status onbekend.`);
    return null;
  }
}

/** ready | outdated | missing | unknown */
export function pdfStatus(assets, rel, hash) {
  if (!assets) return 'unknown';
  const a = assets.get(pdfAssetName(rel));
  if (!a) return 'missing';
  return a.hash === hash ? 'ready' : 'outdated';
}

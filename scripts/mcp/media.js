/**
 * Mediabestanden (foto's en video's) toevoegen aan de repo, voor de MCP-server.
 *
 * De agent levert een lokaal bestandspad (`source`) of een URL (`url`); deze
 * module saneert de bestandsnaam, haalt de bytes op en bepaalt het doelpad en
 * het pad waarmee het bestand in `slides.md` wordt aangeroepen.
 */
import fs from 'node:fs';
import path from 'node:path';
import { IMAGE_EXTS, VIDEO_EXTS, MEDIA_EXTS, extOf, mediaKind } from '../lib/media-manifest.js';

export { IMAGE_EXTS, VIDEO_EXTS, MEDIA_EXTS, extOf, mediaKind };

/** Bovengrens voor downloads en kopieën, om enorme bestanden te voorkomen. */
export const MAX_MEDIA_BYTES = 200 * 1024 * 1024;

const mb = (n) => `${Math.max(1, Math.round(n / 1048576))} MB`;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Maakt een veilige, voorspelbare bestandsnaam: gooit het pad weg, verwijdert
 * diakritische tekens en vervangt alles buiten `a-z0-9` door streepjes.
 * De extensie (kleine letters) blijft behouden.
 */
export function sanitizeMediaName(name) {
  const raw = String(name || '').split(/[\\/]/).pop() || '';
  const dot = raw.lastIndexOf('.');
  const ext = dot > 0 ? raw.slice(dot + 1).toLowerCase() : '';
  const stem = (dot > 0 ? raw.slice(0, dot) : raw)
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'media';
  return ext ? `${stem}.${ext}` : stem;
}

/** Leidt een bestandsnaam af uit een URL (laatste padsegment, query eraf). */
export function filenameFromUrl(url) {
  try {
    const u = new URL(String(url));
    const base = decodeURIComponent(u.pathname.split('/').filter(Boolean).pop() || '');
    return base || 'media';
  } catch {
    return 'media';
  }
}

/** Downloadt een mediabestand met een grootte-limiet (volgt redirects). */
export async function downloadMedia(url, { maxBytes = MAX_MEDIA_BYTES } = {}) {
  let res;
  try {
    res = await fetch(url, { redirect: 'follow' });
  } catch (e) {
    throw new Error(`Kon de URL niet ophalen: ${e.message}`);
  }
  if (!res.ok) throw new Error(`Download mislukt (HTTP ${res.status}) voor ${url}.`);
  const len = Number(res.headers.get('content-length') || 0);
  if (len && len > maxBytes) throw new Error(`Bestand te groot (${mb(len)}); limiet is ${mb(maxBytes)}.`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > maxBytes) throw new Error(`Bestand te groot (${mb(buf.length)}); limiet is ${mb(maxBytes)}.`);
  return buf;
}

/** Repo-relatieve paden van alle mediabestanden onder een deck-map (assets/, media/, …), gesorteerd. */
export function deckMediaFiles(root, deckDir) {
  const base = path.join(root, deckDir);
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue;
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== 'node_modules') walk(abs); continue; }
      if (!e.isFile() || !MEDIA_EXTS.has(extOf(e.name))) continue;
      out.push(path.relative(root, abs).split(path.sep).join('/'));
    }
  };
  if (fs.existsSync(base)) walk(base);
  return out.sort();
}

/** Kant-en-klaar HTML-snippet voor een afbeelding of video (met het juiste pad). */
export function buildMediaSnippet(kind, reference, { alt = '', caption = '' } = {}) {
  const ref = esc(reference);
  if (kind === 'video') {
    const label = caption || alt;
    return `<figure class="video-wrap"><video controls preload="metadata" src="${ref}"${label ? ` title="${esc(label)}"` : ''}></video>`
      + `${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;
  }
  return `<figure class="img-auto"><img src="${ref}" alt="${esc(alt)}">`
    + `${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>`;
}

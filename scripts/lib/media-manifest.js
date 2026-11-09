/**
 * Scant de repo op afbeeldingen én video's voor de media-bibliotheek van de
 * GLR Slide Studio en de MCP-server.
 * Pure Node-functies (geen build-side-effects), zodat ze testbaar zijn.
 */
import fs from 'node:fs';
import path from 'node:path';

export const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif']);
export const VIDEO_EXTS = new Set(['mp4', 'webm', 'mov', 'm4v', 'ogv']);
export const MEDIA_EXTS = new Set([...IMAGE_EXTS, ...VIDEO_EXTS]);

/** Bestandsextensie (zonder punt, kleine letters) van een bestandsnaam of pad. */
export function extOf(name) {
  const m = /\.([a-z0-9]+)$/i.exec(String(name || ''));
  return m ? m[1].toLowerCase() : '';
}

/** 'image' | 'video' | null op basis van de bestandsextensie (met of zonder punt). */
export function mediaKind(ext) {
  const e = String(ext || '').replace(/^\./, '').toLowerCase();
  if (IMAGE_EXTS.has(e)) return 'image';
  if (VIDEO_EXTS.has(e)) return 'video';
  return null;
}

/** Bepaalt de bibliotheek-categorie op basis van het repo-relatieve pad. */
export function mediaCategory(relPath) {
  const p = relPath.split('\\').join('/');
  if (p.startsWith('shared/img/uploads/')) return 'Uploads';
  if (p.startsWith('shared/')) return 'Gedeeld';
  const segs = p.split('/').slice(1, -1).map((s) => s.toLowerCase());
  const test = (s) => {
    if (/^(design|immersive-design)/.test(s)) return 'Design';
    if (/^interface/.test(s)) return 'Interface';
    if (/^beroeps/.test(s)) return 'Beroeps';
    if (/^mvi/.test(s)) return 'MVI';
    if (/^webxr/.test(s)) return 'WebXR';
    return null;
  };
  // Eerst het vak-segment (…/design/…), anders de deck-map-prefix (design1_logos).
  for (const s of segs) { const c = test(s); if (c) return c; }
  return 'Overig';
}

/** Deck-map waartoe een presentatie-asset hoort (`presentations/…/<deck>`), anders ''. */
function deckOf(relPath) {
  const segs = relPath.split('/');
  if (segs[0] !== 'presentations') return '';
  const i = segs.findIndex((s, k) => k > 0 && /^(assets|media|img|images)$/i.test(s));
  return (i > 0 ? segs.slice(0, i) : segs.slice(0, -1)).join('/');
}

function walk(dir, root, out) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs, root, out);
    else if (e.isFile()) {
      const ext = path.extname(e.name).slice(1).toLowerCase();
      if (!MEDIA_EXTS.has(ext)) continue;
      const rel = path.relative(root, abs).split(path.sep).join('/');
      out.push({
        path: rel,
        name: e.name,
        folder: path.posix.dirname(rel),
        category: mediaCategory(rel),
        ext,
        kind: mediaKind(ext),
        deck: deckOf(rel),
      });
    }
  }
}

/** @returns {{path:string,name:string,folder:string,category:string,ext:string,kind:'image'|'video',deck:string}[]} */
export function scanMedia(root) {
  const out = [];
  walk(path.join(root, 'shared', 'img'), root, out);
  walk(path.join(root, 'presentations'), root, out);
  return out.sort((a, b) => a.path.localeCompare(b.path, 'nl'));
}

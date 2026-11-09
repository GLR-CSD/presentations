/**
 * Operaties op de blokken van één slide-body (Markdown + HTML).
 *
 * Een "blok" is een top-level item uit de ProseMirror-brug (`bodyToDoc`), dus
 * exact de eenheid waarop de preview `data-bi` zet. Alle functies zijn puur:
 * ze krijgen een body-string en geven een nieuwe body (+ nieuwe selectie) terug.
 *
 * Selectie: `{ blockIndex, path, highlight }`
 *   - `path`      = element-pad binnen het html-blok dat het Properties Panel toont
 *   - `highlight` = element-pad dat op het canvas groen omlijnd wordt (bijv. één kaart)
 *   Voor markdown-blokken zijn beide `[]`.
 */
import { bodyToDoc, docToBody } from '../markdown/bridge.js';
import * as T from './html-tree.js';

// Eén-plaats-geheugen: lees-paden (hover, balkstatus) parsen dezelfde body niet telkens opnieuw.
let memo = { body: null, blocks: null };
const peek = (body) => {
  if (memo.body !== body) memo = { body, blocks: bodyToDoc(body).content };
  return memo.blocks;
};
/** Veranderbare kopie van de blokken van een body. */
export const blocksOf = (body) => JSON.parse(JSON.stringify(peek(body)));
export const blockAt = (body, i) => peek(body)[i] || null;
const toBody = (blocks) => docToBody({ type: 'doc', content: blocks });
const isHtml = (b) => b && b.type === 'htmlBlock';
const FRAG_COMMENT = /^<!--\s*\.element:[^>]*\bfragment\b[^>]*-->$/;

export function blockCount(body) { return peek(body).length; }
export function htmlAt(body, i) { const b = peek(body)[i]; return isHtml(b) ? b.attrs.html : null; }

export function setHtmlAt(body, i, html) {
  const blocks = blocksOf(body);
  if (!isHtml(blocks[i])) return body;
  blocks[i] = { type: 'htmlBlock', attrs: { html } };
  return toBody(blocks);
}

/** Vervangt blok i door één of meer doc-nodes. */
export function replaceBlock(body, i, nodes) {
  const blocks = blocksOf(body);
  blocks.splice(i, 1, ...(Array.isArray(nodes) ? nodes : [nodes]));
  return toBody(blocks);
}

export function moveBlock(body, i, dir) {
  const blocks = blocksOf(body);
  const j = i + dir;
  if (j < 0 || j >= blocks.length) return { body, index: i };
  [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
  return { body: toBody(blocks), index: j };
}

export function duplicateBlock(body, i) {
  const blocks = blocksOf(body);
  blocks.splice(i + 1, 0, JSON.parse(JSON.stringify(blocks[i])));
  return { body: toBody(blocks), index: i + 1 };
}

export function removeBlock(body, i) {
  const blocks = blocksOf(body);
  blocks.splice(i, 1);
  return toBody(blocks);
}

/** Vindt de footer: `{ blockIndex, path }` van een root-element met klasse `footer`, of null. */
export function findFooter(body) {
  const blocks = peek(body);
  for (let i = blocks.length - 1; i >= 0; i -= 1) {
    if (!isHtml(blocks[i])) continue;
    const roots = T.elementChildren(T.parse(blocks[i].attrs.html));
    const k = roots.findIndex((r) => T.hasClass(r, 'footer'));
    if (k >= 0) return { blockIndex: i, path: [k] };
  }
  return null;
}

/** Index van het blok met de footer, of -1. */
export function footerIndex(body) {
  const f = findFooter(body);
  return f ? f.blockIndex : -1;
}

/** Voegt nodes in na de selectie (of vóór de footer, of onderaan). */
export function insertAfterSelection(body, sel, nodes) {
  const blocks = blocksOf(body);
  const list = Array.isArray(nodes) ? nodes : [nodes];
  let at;
  if (sel && sel.blockIndex != null && sel.blockIndex < blocks.length) at = sel.blockIndex + 1;
  else {
    const f = findFooter(body);
    if (f) {
      const html = blocks[f.blockIndex].attrs.html;
      const roots = T.elementChildren(T.parse(html));
      if (roots.length === 1) at = f.blockIndex;
      else if (list.length === 1 && isHtml(list[0])) {
        // footer staat samen met andere elementen in één HTML-blok: voeg het nieuwe HTML-blok erbovenop in
        const footer = roots[f.path[0]];
        blocks[f.blockIndex] = { type: 'htmlBlock', attrs: { html: T.insertBefore(html, footer, list[0].attrs.html) } };
        return { body: toBody(blocks), index: f.blockIndex };
      } else at = blocks.length;
    } else at = blocks.length;
  }
  blocks.splice(at, 0, ...list);
  return { body: toBody(blocks), index: at };
}

/* ------------------------------------------------------- afbeelding invoegen --- */

const CONTAINER_CLS = ['col', 'glr-col', 'glr-card', 'card', 'opcard'];
const GRID_CLS = ['grid2', 'glr-columns'];
const isPlaceholderFig = (n) => n.tag === 'figure' && (T.hasAttr(n, 'data-placeholder')
  || (T.elementChildren(n).find((c) => c.tag === 'img') || { attrs: [] }).attrs.some((a) => a.lname === 'src' && /Visueel(%20|\s)bewijs/.test(a.value || '')));

/** Is dit element een vak waar je iets in kunt zetten (kolom, kaart, rastercel)? */
export function isContainer(node) {
  if (!node || node.type !== 'el') return false;
  if (CONTAINER_CLS.some((c) => T.hasClass(node, c))) return true;
  const p = node.parent;
  return !!(p && p.type === 'el' && GRID_CLS.some((c) => T.hasClass(p, c)) && node.tag !== 'figure');
}

/** Pad van het dichtstbijzijnde vak rond (of op) `path`, of null. */
export function containerPathFor(html, path) {
  let node = path && path.length ? T.nodeAt(T.parse(html), path) : null;
  while (node && node.type === 'el' && !isContainer(node)) node = node.parent;
  return node && node.type === 'el' ? T.pathOf(node) : null;
}

const selOf = (bi, path) => ({ blockIndex: bi, path, highlight: path, openItem: -1 });

/** Vult een placeholder-figuur (src/alt) en haalt de markering weg. */
function fillPlaceholder(html, figPath, src, alt) {
  let out = html;
  const fig = () => T.nodeAt(T.parse(out), figPath);
  const img = () => T.elementChildren(fig()).find((c) => c.tag === 'img');
  out = T.setAttr(out, img(), 'src', src);
  out = T.setAttr(out, img(), 'alt', alt || '');
  return T.removeAttr(out, fig(), 'data-placeholder');
}

/**
 * Zet `html` als laatste kind in het vak op `containerPath` van blok `blockIndex`.
 * @returns {{ body:string, selection:object }|null}
 */
export function appendToContainer(body, blockIndex, containerPath, html) {
  const blocks = blocksOf(body);
  if (!isHtml(blocks[blockIndex])) return null;
  let src = blocks[blockIndex].attrs.html;
  const node = T.nodeAt(T.parse(src), containerPath);
  if (!node) return null;
  src = T.appendChild(src, node, html);
  const kids = T.elementChildren(T.nodeAt(T.parse(src), containerPath));
  blocks[blockIndex] = { type: 'htmlBlock', attrs: { html: src } };
  return { body: toBody(blocks), selection: selOf(blockIndex, [...containerPath, kids.length - 1]) };
}

/**
 * Plaatst een afbeelding in een vak: een lege placeholder in dat vak wordt gevuld,
 * anders komt de figuur onderaan het vak.
 */
export function insertImageInContainer(body, blockIndex, containerPath, { src, alt, figureHtml }) {
  const html = htmlAt(body, blockIndex);
  if (html == null) return null;
  const node = T.nodeAt(T.parse(html), containerPath);
  if (!node) return null;
  let ph = null;
  T.walk(node, (el, p) => { if (!ph && isPlaceholderFig(el)) ph = [...containerPath, ...p]; return !ph; });
  if (ph) return { body: setHtmlAt(body, blockIndex, fillPlaceholder(html, ph, src, alt)), selection: selOf(blockIndex, ph) };
  return appendToContainer(body, blockIndex, containerPath, figureHtml);
}

/**
 * Plaatst een afbeelding laagbewust: (1) IN de geselecteerde kolom/kaart/rastercel (een lege
 * placeholder daarin wordt gevuld), (2) anders vult hij een placeholder op de slide (bij
 * voorkeur in het geselecteerde blok), (3) anders null (aanroeper valt terug op insertAfterSelection).
 * @returns {{ body:string, selection:{blockIndex:number,path:number[],highlight:number[],openItem:number} }|null}
 */
export function insertImageIntoSelection(body, sel, img) {
  const blocks = blocksOf(body);
  // 1. geselecteerd vak
  if (sel && sel.blockIndex != null && isHtml(blocks[sel.blockIndex])) {
    const cpath = containerPathFor(blocks[sel.blockIndex].attrs.html, sel.highlight && sel.highlight.length ? sel.highlight : sel.path);
    if (cpath) return insertImageInContainer(body, sel.blockIndex, cpath, img);
  }
  // 2. placeholder op de slide
  const found = [];
  blocks.forEach((b, bi) => {
    if (!isHtml(b)) return;
    T.walk(T.parse(b.attrs.html), (el, p) => { if (isPlaceholderFig(el)) found.push({ bi, p }); return true; });
  });
  const hit = found.find((f) => sel && f.bi === sel.blockIndex) || found[0];
  if (!hit) return null;
  blocks[hit.bi] = { type: 'htmlBlock', attrs: { html: fillPlaceholder(blocks[hit.bi].attrs.html, hit.p, img.src, img.alt) } };
  return { body: toBody(blocks), selection: selOf(hit.bi, hit.p) };
}

/* ------------------------------------------------------------ selectie-ops --- */

const shiftLast = (p, d) => (p.length ? [...p.slice(0, -1), p[p.length - 1] + d] : p);
const samePath = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

/** Is het geselecteerde onderdeel een heel top-level blok? (markdown, of enig root-element) */
function isWholeBlock(body, sel) {
  const html = htmlAt(body, sel.blockIndex);
  if (html == null || sel.highlight.length === 0) return true;
  return sel.highlight.length === 1 && T.elementChildren(T.parse(html)).length === 1;
}

/** Kan het geselecteerde onderdeel nog een plek omhoog (-1) / omlaag (+1)? Goedkoop, zonder serialisatie. */
export function canMove(body, sel, dir) {
  const count = blockCount(body);
  const blockOk = sel.blockIndex + dir >= 0 && sel.blockIndex + dir < count;
  const html = htmlAt(body, sel.blockIndex);
  if (html == null || sel.highlight.length === 0) return blockOk;
  const node = T.nodeAt(T.parse(html), sel.highlight);
  if (!node) return false;
  if (sel.highlight.length === 1 && T.elementChildren(T.parse(html)).length === 1) return blockOk;
  const sibs = T.elementChildren(node.parent);
  const at = sibs.indexOf(node) + dir;
  if (at >= 0 && at < sibs.length) return true;
  return sel.highlight.length === 1 && blockOk;
}

const patch = (sel, extra) => ({ ...sel, ...extra });

export function moveSelection(body, sel, dir) {
  const wholeBlock = () => {
    const r = moveBlock(body, sel.blockIndex, dir);
    return { body: r.body, selection: patch(sel, { blockIndex: r.index }), changed: r.index !== sel.blockIndex };
  };
  if (isWholeBlock(body, sel)) return wholeBlock();
  const html = htmlAt(body, sel.blockIndex);
  const node = T.nodeAt(T.parse(html), sel.highlight);
  const sibs = node ? T.elementChildren(node.parent) : [];
  const at = sibs.indexOf(node);
  if (!node || at + dir < 0 || at + dir >= sibs.length) {
    if (sel.highlight.length === 1) return wholeBlock();
    return { body, selection: sel, changed: false };
  }
  const hl = shiftLast(sel.highlight, dir);
  return {
    body: setHtmlAt(body, sel.blockIndex, T.moveNode(html, node, dir)),
    selection: patch(sel, { highlight: hl, path: samePath(sel.path, sel.highlight) ? hl : sel.path }),
    changed: true,
  };
}

export function duplicateSelection(body, sel) {
  if (isWholeBlock(body, sel)) {
    const r = duplicateBlock(body, sel.blockIndex);
    return { body: r.body, selection: patch(sel, { blockIndex: r.index }) };
  }
  const html = htmlAt(body, sel.blockIndex);
  const node = T.nodeAt(T.parse(html), sel.highlight);
  const hl = shiftLast(sel.highlight, 1);
  return {
    body: setHtmlAt(body, sel.blockIndex, T.duplicateNode(html, node)),
    selection: patch(sel, { highlight: hl, path: samePath(sel.path, sel.highlight) ? hl : sel.path }),
  };
}

/** @returns {{ body:string, selection:object|null }} */
export function removeSelection(body, sel) {
  if (isWholeBlock(body, sel)) return { body: removeBlock(body, sel.blockIndex), selection: null };
  const html = htmlAt(body, sel.blockIndex);
  const node = T.nodeAt(T.parse(html), sel.highlight);
  const nextBody = setHtmlAt(body, sel.blockIndex, T.removeNode(html, node));
  // Na verwijderen van een item: val terug op de container (of het blok) als selectie.
  const parentPath = sel.highlight.slice(0, -1);
  if (!parentPath.length) return { body: nextBody, selection: null };
  return { body: nextBody, selection: patch(sel, { path: parentPath, highlight: parentPath }) };
}

/** Ondersteunt dit onderdeel een animatiestap? (html-element, of markdown kop/alinea) */
export function canFragment(body, sel) {
  const b = peek(body)[sel.blockIndex];
  if (!b) return false;
  return isHtml(b) || b.type === 'heading' || b.type === 'paragraph';
}

export function isFragment(body, sel) {
  const b = peek(body)[sel.blockIndex];
  if (!b) return false;
  if (isHtml(b)) {
    const node = T.nodeAt(T.parse(b.attrs.html), sel.highlight);
    return !!node && T.hasClass(node, 'fragment');
  }
  if (b.type === 'heading' || b.type === 'paragraph') {
    const last = (b.content || [])[(b.content || []).length - 1];
    return !!last && last.type === 'inlineHtml' && FRAG_COMMENT.test(last.attrs.html);
  }
  return false;
}

export function toggleFragmentSelection(body, sel) {
  if (!canFragment(body, sel)) return body;
  const blocks = blocksOf(body);
  const b = blocks[sel.blockIndex];
  if (isHtml(b)) {
    const node = T.nodeAt(T.parse(b.attrs.html), sel.highlight);
    if (!node) return body;
    return setHtmlAt(body, sel.blockIndex, T.setClass(b.attrs.html, node, 'fragment', !T.hasClass(node, 'fragment')));
  }
  const content = setInlineFragment(b.content, !hasInlineFragment(b.content));
  blocks[sel.blockIndex] = { ...b, content };
  return toBody(blocks);
}

/** Eindigt deze inline-inhoud (kop, alinea, lijstitem) met `<!-- .element: class="fragment" -->`? */
export function hasInlineFragment(content) {
  const list = content || [];
  const last = list[list.length - 1];
  return !!last && last.type === 'inlineHtml' && FRAG_COMMENT.test(last.attrs.html);
}

/** Zet/verwijdert de `.element`-fragment-comment aan het eind van inline-inhoud (geeft een nieuwe array). */
export function setInlineFragment(content, on) {
  const out = [...(content || [])];
  if (hasInlineFragment(out) === !!on) return out;
  if (!on) {
    out.pop();
    const prev = out[out.length - 1];
    if (prev && prev.type === 'text') {
      if (prev.text.trim() === '') out.pop();
      else out[out.length - 1] = { ...prev, text: prev.text.replace(/\s+$/, '') };
    }
  } else {
    out.push({ type: 'text', text: ' ', marks: [] }, { type: 'inlineHtml', attrs: { html: '<!-- .element: class="fragment" -->' } });
  }
  return out;
}

/**
 * Rendert een slide-body (Markdown + HTML) naar reveal.js-HTML.
 * Wordt gebruikt door de LivePreviewController (in-memory Reveal) en de
 * slide-sorter-miniaturen.
 */
import { md } from './md.js';
import { annotate as annotateHtml } from '../blocks/html-tree.js';

const escapeAttr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const BLOCK_OPEN = new Set(['hr', 'heading_open', 'paragraph_open', 'bullet_list_open', 'ordered_list_open', 'blockquote_open']);

/**
 * Rendert de body van één slide naar HTML (zonder <section>).
 *
 * Met `{ annotate: true }` (alleen live preview) krijgt elk top-level blok
 * `data-bi="N"` (N = index in `bodyToDoc(body).content`, exact dezelfde telling
 * als de ProseMirror-brug) en elk element binnen een HTML-blok bovendien
 * `data-bp="0.2.1"` (pad). Zo kan een klik op het canvas een blok én het
 * geneste onderdeel terugvinden.
 */
export function renderSlideBody(body, { annotate = false } = {}) {
  if (!annotate) return md.render(body || '');
  const env = {};
  const tokens = md.parse(body || '', env);
  let n = 0;
  for (let ti = 0; ti < tokens.length; ti += 1) {
    const t = tokens[ti];
    if (t.type === 'list_item_open') {
      // `- item <!-- .element: class="fragment" -->`: reveal.js past de comment toe op het
      // ouder-element: de <li> in een strakke lijst, de <p> in een losse lijst.
      const p = tokens[ti + 1];
      if (p && p.type === 'paragraph_open') applyElementComment(p.hidden ? t : p, tokens[ti + 2]);
    }
    if (t.level !== 0) continue;
    if (t.type === 'html_block') {
      t.content = annotateHtml(t.content, n);
      n += 1;
    } else if (t.type === 'fence' || t.type === 'code_block') {
      t.meta = { bi: n };
      n += 1;
    } else if (BLOCK_OPEN.has(t.type)) {
      t.attrSet('data-bi', String(n));
      n += 1;
      if (t.type === 'heading_open' || t.type === 'paragraph_open') applyElementComment(t, tokens[ti + 1]);
    }
  }
  return md.renderer.render(tokens, md.options, env);
}

/**
 * Emuleert de reveal.js markdown-plugin: `<!-- .element: class="fragment" -->`
 * aan het eind van een kop/alinea geldt voor dat element.
 */
function applyElementComment(open, inline) {
  const kids = inline && inline.children;
  if (!kids || !kids.length) return;
  const last = kids[kids.length - 1];
  const m = last.type === 'html_inline' && /^<!--\s*\.element:\s*([\s\S]*?)-->$/.exec(last.content);
  if (!m) return;
  const re = /([A-Za-z_:][-\w:.]*)\s*=\s*"([^"]*)"/g;
  let a;
  while ((a = re.exec(m[1]))) {
    if (a[1] === 'class') open.attrJoin('class', a[2]);
    else open.attrSet(a[1], a[2]);
  }
  kids.pop();
  const prev = kids[kids.length - 1];
  if (prev && prev.type === 'text' && prev.content.trim() === '') kids.pop();
}

/** Maakt relatieve `src`/`data-src`/`poster`-paden absoluut t.o.v. `base` (alleen voor preview/miniaturen). */
export function resolveAssets(html, base) {
  if (!base) return html;
  return html.replace(/(\s(?:src|data-src|poster)=")(?!(?:[a-z][a-z0-9+.-]*:|\/|#|data:))([^"]+)"/gi, (m, pre, url) => `${pre}${base}${url}"`);
}

/** Zet de `<!-- .slide: ... -->`-attributen om naar HTML-attributen. */
export function slideAttrsToHtml(slide) {
  const attrs = slide.attrsData || {};
  return Object.entries(attrs)
    .map(([key, value]) => (value === '' ? key : `${key}="${escapeAttr(value)}"`))
    .join(' ');
}

/**
 * Bouwt de volledige `<div class="slides">`-inhoud voor een Deck.
 * Horizontale slides worden top-level <section>; opeenvolgende verticale
 * slides (kind === 'vertical') worden in een wrapper-<section> gegroepeerd —
 * exact zoals de reveal.js markdown-plugin dat doet.
 */
export function deckToSlidesHtml(deck) {
  const groups = [];
  for (const slide of deck.slides) {
    if (slide.kind === 'vertical' && groups.length) groups[groups.length - 1].push(slide);
    else groups.push([slide]);
  }

  return groups
    .map((group) => {
      if (group.length === 1) {
        const s = group[0];
        return `<section ${slideAttrsToHtml(s)}>${renderSlideBody(s.body)}</section>`;
      }
      const inner = group
        .map((s) => `<section ${slideAttrsToHtml(s)}>${renderSlideBody(s.body)}</section>`)
        .join('\n');
      return `<section>\n${inner}\n</section>`;
    })
    .join('\n');
}

/** Eenvoudige platte tekst uit een slide-body (voor de sorter-miniatuur). */
export function slideToPlainText(slide) {
  return md
    .render(slide.body || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

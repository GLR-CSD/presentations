/**
 * Rendert een slide-body (Markdown + HTML) naar reveal.js-HTML.
 * Wordt gebruikt door de LivePreviewController (in-memory Reveal) en de
 * slide-sorter-miniaturen.
 */
import { md } from './md.js';

const escapeAttr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Rendert de body van één slide naar HTML (zonder <section>). */
export function renderSlideBody(body) {
  return md.render(body || '');
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

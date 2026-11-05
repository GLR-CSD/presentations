/**
 * Gedeelde markdown-it-instantie voor de GLR Slide Studio.
 *
 * Belangrijk: de decks zijn "Markdown + rauwe HTML". Daarom staat `html: true`
 * aan (rauwe HTML/comments gaan ongewijzigd door) en passen we de fence-renderer
 * aan zodat reveal.js line-highlighting (` ```js [1-3|5] `) en de taalklasse
 * hetzelfde uitpakken als de reveal.js markdown-plugin.
 */
import MarkdownIt from 'markdown-it';

const BASE = { html: true, linkify: false, breaks: false };

/** Render-instantie (typographer aan → benadert reveal's smartypants). */
export const md = new MarkdownIt({ ...BASE, typographer: true });

/**
 * Tokeniseer-instantie voor de ProseMirror-brug: typographer UIT, zodat
 * markdown-it de tekst-tokens niet herschrijft (`'` → `’`, `--` → `–`, …) en
 * de round-trip byte-identiek blijft.
 */
export const mdTokens = new MarkdownIt({ ...BASE, typographer: false });

// Bewaar HTML-entities letterlijk (`&#8209;` blijft `&#8209;` i.p.v. het te
// decoderen naar het teken). Anders zou een edit zo'n entiteit stilletjes
// herschrijven en is de round-trip niet meer byte-identiek.
const ENTITY_RE = /^&(?:#(?:x[0-9a-fA-F]+|\d+)|[a-zA-Z][a-zA-Z0-9]{1,31});/;
mdTokens.inline.ruler.at('entity', (state, silent) => {
  const match = ENTITY_RE.exec(state.src.slice(state.pos));
  if (!match) return false;
  if (!silent) {
    const token = state.push('text', '', 0);
    token.content = match[0];
  }
  state.pos += match[0].length;
  return true;
});

const escapeHtml = md.utils.escapeHtml;

/** `javascript [1-3|5]` → { lang, highlight }. */
export function parseFenceInfo(info) {
  const raw = String(info || '').trim();
  const m = /^([^\s[]+)?\s*(?:\[([^\]]*)\])?\s*$/.exec(raw);
  return { lang: (m && m[1]) || '', highlight: (m && m[2]) || '' };
}

// Fence → <pre><code class="language-x" data-line-numbers="1-3|5">…</code></pre>
md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx];
  const { lang, highlight } = parseFenceInfo(token.info);
  const cls = lang ? ` class="language-${escapeHtml(lang)}"` : '';
  const ln = highlight ? ` data-line-numbers="${escapeHtml(highlight)}"` : '';
  const bi = token.meta && token.meta.bi != null ? ` data-bi="${token.meta.bi}"` : '';
  return `<pre${bi}><code${ln}${cls}>${escapeHtml(token.content)}</code></pre>\n`;
};

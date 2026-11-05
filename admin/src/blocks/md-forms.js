/**
 * Formulieren voor de Markdown-blokken (kop, alinea, lijst, citaat, codeblok …).
 *
 * Veldtypes zijn dezelfde als in parsers.js, maar `applyMd(node, waarde)`
 * werkt op een ProseMirror-blok en geeft de vervangende doc-nodes terug
 * (zodat de verliesvrije brug het terugschrijven naar Markdown doet).
 */
import { bodyToDoc, blockToMarkdown } from '../markdown/bridge.js';
import { escapeText } from './html-tree.js';
import { CODE_LANGS } from './parsers.js';

const ELEMENT_COMMENT = /\s*(<!--\s*\.element:[^>]*-->)\s*$/;

const parseMd = (text) => bodyToDoc(text).content;
const orEmpty = (nodes, fallback) => (nodes.length ? nodes : [fallback]);

/** Markdown-bron van het blok, zonder de eventuele `.element:`-comment. */
function splitComment(node) {
  const md = blockToMarkdown(node);
  const m = ELEMENT_COMMENT.exec(md);
  return { text: m ? md.slice(0, m.index) : md, comment: m ? m[1] : '' };
}
const withComment = (text, comment) => (comment ? `${text} ${comment}` : text);

/** HTML voor een terminalvenster (zelfde opbouw als de blokken-toolbar). */
export function terminalHtml({ lang = 'bash', highlight = '', text = '', title = 'bash' }) {
  const cls = lang ? ` class="language-${lang}"` : '';
  const ln = highlight ? ` data-line-numbers="${highlight}"` : '';
  return '<div class="terminal-window">\n'
    + `  <div class="terminal-window__bar"><span class="dot"></span><span class="dot"></span><span class="dot dot--lime"></span><span class="title">${escapeText(title)}</span></div>\n`
    + `  <pre><code${ln}${cls}>${escapeText(text)}</code></pre>\n`
    + '</div>';
}

/**
 * @returns {{ label:string, icon:string, fields:Array } | null}
 */
export function markdownForm(node) {
  switch (node.type) {
    case 'heading': {
      const { text, comment } = splitComment(node);
      const body = text.replace(/^#{1,6}\s+/, '');
      const level = node.attrs.level;
      return {
        label: 'Koptekst', icon: 'heading',
        fields: [
          { kind: 'select', label: 'Niveau', badge: `h${level}`, value: String(level), options: [['1', 'Hoofdtitel (H1)'], ['2', 'Slide-titel (H2)'], ['3', 'Subkop (H3)'], ['4', 'Kleine kop (H4)']], applyMd: (n, v) => parseMd(withComment(`${'#'.repeat(Number(v))} ${body}`, comment)) },
          { kind: 'textarea', label: 'Koptekst', badge: `h${level}`, mdTools: true, value: body, applyMd: (n, v) => orEmpty(parseMd(withComment(`${'#'.repeat(level)} ${v.replace(/\n+/g, ' ')}`, comment)), { type: 'heading', attrs: { level }, content: [] }) },
        ],
      };
    }
    case 'paragraph': {
      const { text, comment } = splitComment(node);
      return {
        label: 'Tekst', icon: 'type',
        fields: [{ kind: 'textarea', label: 'Tekst', badge: 'p', mdTools: true, value: text, applyMd: (n, v) => orEmpty(parseMd(withComment(v, comment)), { type: 'paragraph' }) }],
      };
    }
    case 'bulletList':
    case 'orderedList':
      return {
        label: node.type === 'bulletList' ? 'Opsomming' : 'Genummerde lijst', icon: node.type === 'bulletList' ? 'list' : 'list-ordered',
        fields: [{ kind: 'textarea', label: 'Punten (één per regel, begin met - of 1.)', badge: 'ul/ol', mdTools: true, value: blockToMarkdown(node), applyMd: (n, v) => orEmpty(parseMd(v), { type: 'paragraph' }) }],
      };
    case 'blockquote':
      return {
        label: 'Citaat', icon: 'lede',
        fields: [{ kind: 'textarea', label: 'Citaat', badge: 'blockquote', mdTools: true, value: blockToMarkdown(node), applyMd: (n, v) => orEmpty(parseMd(v), { type: 'paragraph' }) }],
      };
    case 'codeBlock': {
      const lang = node.attrs.lang || '';
      const known = CODE_LANGS.some((l) => l[0] === lang);
      const code = (node.content || []).map((c) => c.text || '').join('');
      const rebuild = (n, patch) => [{ ...n, attrs: { ...n.attrs, ...patch } }];
      return {
        label: 'Codeblok', icon: 'code',
        fields: [
          { kind: 'select', label: 'Taal', value: lang, options: known ? CODE_LANGS : [...CODE_LANGS, [lang, lang]], applyMd: (n, v) => rebuild(n, { lang: v }) },
          { kind: 'text', label: 'Regel-highlights (bijv. 1-3|5)', badge: 'fence [..]', value: node.attrs.highlight || '', applyMd: (n, v) => rebuild(n, { highlight: v }) },
          { kind: 'toggle', label: 'Terminal-kader', badge: '.terminal-window', value: false, applyMd: (n, v) => (v ? [{ type: 'htmlBlock', attrs: { html: terminalHtml({ lang: n.attrs.lang || 'bash', highlight: n.attrs.highlight, text: (n.content || []).map((c) => c.text || '').join('') }) } }] : [n]) },
          { kind: 'code', label: 'Code', value: code, applyMd: (n, v) => [{ ...n, content: v ? [{ type: 'text', text: v }] : [] }] },
        ],
      };
    }
    case 'commentBlock':
      return {
        label: 'Meta-comment', icon: 'braces',
        fields: [{ kind: 'textarea', label: 'Comment (HTML)', value: node.attrs.comment, applyMd: (n, v) => [{ ...n, attrs: { comment: v } }] }],
      };
    case 'hr':
      return { label: 'Scheidingslijn', icon: 'minus', fields: [] };
    default:
      return null;
  }
}

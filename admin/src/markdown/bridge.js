/**
 * Brug tussen slide-Markdown en het ProseMirror/Tiptap-document.
 *
 * Ontwerp (Optie A): de doc kent twee soorten top-level blokken:
 *   - BEWERKBAAR: heading, paragraph, bulletList, orderedList, blockquote, hr
 *     (met inline marks bold/italic/code/link/highlight/underline/strike);
 *   - BESCHERMD (atomair, verbatim): htmlBlock, commentBlock, codeBlock.
 *
 * Rauwe HTML en HTML-comments worden dus nooit door ProseMirror genormaliseerd;
 * ze worden byte-voor-byte bewaard en in de visuele modus als veilige blokken
 * (NodeViews) getoond.
 *
 * De functies werken op ProseMirror-JSON, niet op een live editor, zodat ze
 * los testbaar zijn (zie scripts/test-bridge.js).
 */
import { md, mdTokens, parseFenceInfo } from './md.js';

/* ============================================================ markdown → doc */

/** Zet een slide-body (Markdown + HTML) om naar een ProseMirror-doc (JSON). */
export function bodyToDoc(body) {
  const tokens = mdTokens.parse(body || '', {});
  return { type: 'doc', content: buildBlocks(tokens, 0, tokens.length) };
}

function buildBlocks(tokens, start, end) {
  const blocks = [];
  let i = start;
  while (i < end) {
    const t = tokens[i];
    if (t.type === 'html_block') {
      blocks.push(htmlBlockNode(t.content));
      i += 1;
    } else if (t.type === 'fence' || t.type === 'code_block') {
      blocks.push(codeBlockNode(t));
      i += 1;
    } else if (t.type === 'hr') {
      blocks.push({ type: 'hr' });
      i += 1;
    } else if (t.type === 'heading_open') {
      blocks.push({ type: 'heading', attrs: { level: parseInt(t.tag.slice(1), 10) }, content: inlineToNodes(tokens[i + 1]) });
      i += 3;
    } else if (t.type === 'paragraph_open') {
      blocks.push({ type: 'paragraph', content: inlineToNodes(tokens[i + 1]) });
      i += 3;
    } else if (t.type === 'bullet_list_open' || t.type === 'ordered_list_open') {
      const res = buildList(tokens, i);
      blocks.push(res.node);
      i = res.next;
    } else if (t.type === 'blockquote_open') {
      const res = buildBlockquote(tokens, i);
      blocks.push(res.node);
      i = res.next;
    } else {
      i += 1;
    }
  }
  return blocks;
}

function buildList(tokens, start) {
  const open = tokens[start];
  const ordered = open.type === 'ordered_list_open';
  const closeType = ordered ? 'ordered_list_close' : 'bullet_list_close';
  const items = [];
  let i = start + 1;
  while (i < tokens.length && tokens[i].type !== closeType) {
    if (tokens[i].type === 'list_item_open') {
      const res = buildListItem(tokens, i);
      items.push(res.node);
      i = res.next;
    } else {
      i += 1;
    }
  }
  const node = { type: ordered ? 'orderedList' : 'bulletList', content: items };
  const startAttr = open.attrs && open.attrs.find((a) => a[0] === 'start');
  if (ordered && startAttr && startAttr[1] !== 1) node.attrs = { start: startAttr[1] };
  return { node, next: i + 1 };
}

function buildListItem(tokens, start) {
  const content = [];
  let i = start + 1;
  while (i < tokens.length && tokens[i].type !== 'list_item_close') {
    const t = tokens[i];
    if (t.type === 'paragraph_open') {
      content.push({ type: 'paragraph', content: inlineToNodes(tokens[i + 1]) });
      i += 3;
    } else if (t.type === 'bullet_list_open' || t.type === 'ordered_list_open') {
      const res = buildList(tokens, i);
      content.push(res.node);
      i = res.next;
    } else if (t.type === 'html_block') {
      content.push(htmlBlockNode(t.content));
      i += 1;
    } else if (t.type === 'fence' || t.type === 'code_block') {
      content.push(codeBlockNode(t));
      i += 1;
    } else {
      i += 1;
    }
  }
  return { node: { type: 'listItem', content }, next: i + 1 };
}

function buildBlockquote(tokens, start) {
  const blocks = [];
  let i = start + 1;
  while (i < tokens.length && tokens[i].type !== 'blockquote_close') {
    const t = tokens[i];
    if (t.type === 'paragraph_open') {
      blocks.push({ type: 'paragraph', content: inlineToNodes(tokens[i + 1]) });
      i += 3;
    } else if (t.type === 'html_block') {
      blocks.push(htmlBlockNode(t.content));
      i += 1;
    } else {
      i += 1;
    }
  }
  return { node: { type: 'blockquote', content: blocks }, next: i + 1 };
}

/* ------------------------------------------------------------- inline (md→doc) */

function attr(token, name) {
  const a = (token.attrs || []).find((x) => x[0] === name);
  return a ? a[1] : '';
}

function inlineToNodes(token) {
  const nodes = [];
  if (!token || !token.children) return nodes;
  const marks = [];
  const drop = (type) => {
    const idx = marks.map((m) => m.type).lastIndexOf(type);
    if (idx >= 0) marks.splice(idx, 1);
  };
  const pushText = (text, extra = []) => {
    if (text === '') return;
    nodes.push({ type: 'text', text, marks: [...marks, ...extra] });
  };
  for (const c of token.children) {
    switch (c.type) {
      case 'text': pushText(c.content); break;
      case 'strong_open': marks.push({ type: 'bold' }); break;
      case 'strong_close': drop('bold'); break;
      case 'em_open': marks.push({ type: 'italic' }); break;
      case 'em_close': drop('italic'); break;
      case 's_open': marks.push({ type: 'strike' }); break;
      case 's_close': drop('strike'); break;
      case 'code_inline': pushText(c.content, [{ type: 'code' }]); break;
      case 'link_open': marks.push({ type: 'link', attrs: { href: attr(c, 'href'), title: attr(c, 'title') } }); break;
      case 'link_close': drop('link'); break;
      case 'image': nodes.push({ type: 'image', attrs: { src: attr(c, 'src'), alt: c.content || '', title: attr(c, 'title') } }); break;
      case 'html_inline': nodes.push({ type: 'inlineHtml', attrs: { html: c.content } }); break;
      case 'softbreak': pushText('\n'); break;
      case 'hardbreak': nodes.push({ type: 'hardBreak' }); break;
      default: if (c.content) pushText(c.content);
    }
  }
  return nodes;
}

/** html_block → commentBlock (als het enkel een comment is) of htmlBlock. */
function htmlBlockNode(raw) {
  const trimmed = String(raw).replace(/\s+$/, '');
  if (/^<!--[\s\S]*-->$/.test(trimmed.trim())) return { type: 'commentBlock', attrs: { comment: trimmed } };
  return { type: 'htmlBlock', attrs: { html: trimmed } };
}

function codeBlockNode(token) {
  const { lang, highlight } = token.type === 'fence' ? parseFenceInfo(token.info) : { lang: '', highlight: '' };
  const code = token.type === 'fence' ? token.content.replace(/\n$/, '') : token.content.replace(/\n$/, '');
  return { type: 'codeBlock', attrs: { lang, highlight }, content: [{ type: 'text', text: code }] };
}

/* ============================================================ doc → markdown */

/** Zet een ProseMirror-doc (JSON) terug naar slide-Markdown. */
export function docToBody(doc) {
  return (doc.content || []).map(blockToMarkdown).join('\n\n');
}

export function blockToMarkdown(node) {
  switch (node.type) {
    case 'heading':
      return `${'#'.repeat(node.attrs.level)} ${inlineNodesToMarkdown(node.content)}`;
    case 'paragraph':
      return inlineNodesToMarkdown(node.content);
    case 'bulletList':
      return (node.content || []).map((item) => listItemToMarkdown(item, '- ')).join('\n');
    case 'orderedList': {
      const start = (node.attrs && node.attrs.start) || 1;
      return (node.content || []).map((item, i) => listItemToMarkdown(item, `${start + i}. `)).join('\n');
    }
    case 'blockquote':
      return (node.content || [])
        .map((b) => blockToMarkdown(b).split('\n').map((l) => `> ${l}`.trimEnd()).join('\n'))
        .join('\n>\n');
    case 'codeBlock':
      return codeBlockToMarkdown(node);
    case 'htmlBlock':
      return node.attrs.html;
    case 'commentBlock':
      return node.attrs.comment;
    case 'hr':
      return '---';
    default:
      return '';
  }
}

function listItemToMarkdown(item, marker) {
  const inner = (item.content || []).map(blockToMarkdown).join('\n\n');
  const lines = inner.split('\n');
  const indent = ' '.repeat(marker.length);
  return marker + lines[0] + (lines.length > 1 ? `\n${lines.slice(1).map((l) => indent + l).join('\n')}` : '');
}

function codeBlockToMarkdown(node) {
  const code = (node.content || []).map((c) => c.text || '').join('');
  const { lang, highlight } = node.attrs || {};
  const info = (lang || '') + (highlight ? ` [${highlight}]` : '');
  return `\`\`\`${info}\n${code.replace(/\n$/, '')}\n\`\`\``;
}

function inlineNodesToMarkdown(nodes) {
  return (nodes || []).map(nodeToMarkdown).join('');
}

function nodeToMarkdown(node) {
  switch (node.type) {
    case 'text':
      return applyMarks(node.text, node.marks || []);
    case 'hardBreak':
      return '  \n';
    case 'inlineHtml':
      return node.attrs.html;
    case 'image':
      return `![${node.attrs.alt || ''}](${node.attrs.src}${node.attrs.title ? ` "${node.attrs.title}"` : ''})`;
    default:
      return '';
  }
}

const MARK_ORDER = ['code', 'bold', 'italic', 'strike', 'underline', 'highlight', 'link'];

function applyMarks(text, marks) {
  let out = text;
  const ordered = [...marks].sort((a, b) => MARK_ORDER.indexOf(a.type) - MARK_ORDER.indexOf(b.type));
  for (const m of ordered) {
    if (m.type === 'code') out = `\`${out}\``;
    else if (m.type === 'bold') out = `**${out}**`;
    else if (m.type === 'italic') out = `*${out}*`;
    else if (m.type === 'strike') out = `~~${out}~~`;
    else if (m.type === 'underline') out = `<u>${out}</u>`;
    else if (m.type === 'highlight') out = `<span class="highlight">${out}</span>`;
    else if (m.type === 'link') out = `[${out}](${m.attrs.href}${m.attrs.title ? ` "${m.attrs.title}"` : ''})`;
  }
  return out;
}


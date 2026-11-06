/** JSON-weergave van decks en slides voor LLM's (blokken, componenten, fase). */
import { bodyToDoc, blockToMarkdown } from '../../admin/src/markdown/bridge.js';
import * as T from '../../admin/src/blocks/html-tree.js';
import { classifySlide, headingOf } from '../../admin/src/pedagogy/phases.js';
import { componentView } from './component-ops.js';

export function blockViews(body) {
  return bodyToDoc(body).content.map((node, blockIndex) => {
    if (node.type === 'htmlBlock') {
      const html = node.attrs.html;
      const roots = T.elementChildren(T.parse(html));
      return {
        blockIndex, type: 'html', html,
        components: roots.map((_, i) => componentView(html, [i])).filter(Boolean),
      };
    }
    if (node.type === 'codeBlock') {
      return { blockIndex, type: 'code', lang: node.attrs.lang || '', highlight: node.attrs.highlight || '', code: (node.content || []).map((c) => c.text).join('') };
    }
    if (node.type === 'commentBlock') return { blockIndex, type: 'comment', comment: node.attrs.comment };
    return { blockIndex, type: node.type, markdown: blockToMarkdown(node) };
  });
}

export function slideView(slide, i, { blocks = true } = {}) {
  const phase = classifySlide(slide);
  const v = {
    slide: i + 1,
    kind: slide.kind,
    title: headingOf(slide.body),
    phase: phase.label,
    attrs: slide.attrsData,
    note: slide.noteText,
  };
  if (blocks) v.blocks = blockViews(slide.body);
  return v;
}

export function deckView(deck, { blocks = true } = {}) {
  return {
    frontmatter: deck.frontmatter ? deck.frontmatter.toObject() : null,
    slideCount: deck.slides.length,
    slides: deck.slides.map((s, i) => slideView(s, i, { blocks })),
  };
}

export const outline = (deck) => deck.slides.map((s, i) => `${i + 1}. [${classifySlide(s).label}] ${headingOf(s.body) || '(zonder titel)'}`).join('\n');

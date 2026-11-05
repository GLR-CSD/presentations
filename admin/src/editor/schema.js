/**
 * ProseMirror/Tiptap-schema voor de GLR Slide Studio.
 *
 * De node- en mark-namen komen exact overeen met de JSON die de markdown-brug
 * (admin/src/markdown/bridge.js) produceert/consumeert. Daardoor werkt
 * `docToBody(editor.getJSON())` direct en blijft de round-trip verliesvrij.
 *
 * Beschermde blokken (Optie A): `htmlBlock`, `commentBlock`, `codeBlock` en
 * `inlineHtml` zijn atomair/verbatim. Ze worden via NodeViews getoond en zijn
 * niet per ongeluk kapot te typen; klikken opent een inspector.
 */
import { Node, mergeAttributes } from '@tiptap/core';

/** NodeView voor een beschermd blok: toont de rauwe HTML + label, klik = inspector. */
function makeBlockView(kind, initialNode, getPos, editor) {
  let node = initialNode;
  const dom = document.createElement('div');
  dom.className = `glr-block glr-block--${kind}`;
  dom.contentEditable = 'false';
  dom.setAttribute('data-glr-block', kind);

  const label = document.createElement('div');
  label.className = 'glr-block__label';
  const body = document.createElement('div');
  body.className = 'glr-block__body';
  dom.append(label, body);

  const render = (n) => {
    if (kind === 'html') {
      const firstTag = (n.attrs.html.match(/<([a-zA-Z][\w-]*)/) || [, 'html'])[1];
      label.textContent = `HTML-blok · <${firstTag}>`;
      body.innerHTML = n.attrs.html;
    } else if (kind === 'comment') {
      label.textContent = 'Meta-comment';
      body.textContent = n.attrs.comment;
    }
  };
  render(node);

  dom.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    editor.emit('glr-block-click', { kind, pos: getPos(), node });
  });

  return {
    dom,
    update: (updated) => {
      if (updated.type.name !== initialNode.type.name) return false;
      node = updated;
      render(updated);
      return true;
    },
    ignoreMutation: () => true,
  };
}

/** Beschermd blok met rauwe HTML (grids, cards, timers, plugins …). */
export const HtmlBlock = Node.create({
  name: 'htmlBlock',
  group: 'block',
  atom: true,
  selectable: true,
  addAttributes() {
    return { html: { default: '' } };
  },
  parseHTML() {
    return [{ tag: 'div[data-glr-block="html"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-glr-block': 'html' }, HTMLAttributes)];
  },
  addNodeView() {
    return ({ node, getPos, editor }) => makeBlockView('html', node, getPos, editor);
  },
});

/** Beschermd blok met een HTML-comment (`<!-- .slide: … -->`, `.element:` …). */
export const CommentBlock = Node.create({
  name: 'commentBlock',
  group: 'block',
  atom: true,
  selectable: true,
  addAttributes() {
    return { comment: { default: '' } };
  },
  parseHTML() {
    return [{ tag: 'div[data-glr-block="comment"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-glr-block': 'comment' }, HTMLAttributes)];
  },
  addNodeView() {
    return ({ node, getPos, editor }) => makeBlockView('comment', node, getPos, editor);
  },
});

/** Inline rauwe HTML (bijv. een `<span class="highlight">` midden in een regel). */
export const InlineHtml = Node.create({
  name: 'inlineHtml',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  addAttributes() {
    return { html: { default: '' } };
  },
  parseHTML() {
    return [{ tag: 'span[data-glr-inline-html]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-glr-inline-html': '' }, HTMLAttributes)];
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const dom = document.createElement('span');
      dom.className = 'glr-inline-html';
      dom.contentEditable = 'false';
      dom.setAttribute('data-glr-inline-html', '');
      dom.innerHTML = node.attrs.html;
      dom.addEventListener('click', (event) => {
        event.preventDefault();
        editor.emit('glr-block-click', { kind: 'inline-html', pos: getPos(), node });
      });
      return { dom, ignoreMutation: () => true };
    };
  },
});

/** Fenced codeblok met taal + reveal line-highlighting als attributen. */
export const GlrCodeBlock = Node.create({
  name: 'codeBlock',
  group: 'block',
  content: 'text*',
  marks: '',
  code: true,
  defining: true,
  addAttributes() {
    return { lang: { default: '' }, highlight: { default: '' } };
  },
  parseHTML() {
    return [{ tag: 'pre', preserveWhitespace: 'full' }];
  },
  renderHTML({ node, HTMLAttributes }) {
    const cls = node.attrs.lang ? `language-${node.attrs.lang}` : null;
    return ['pre', mergeAttributes(HTMLAttributes), ['code', cls ? { class: cls } : {}, 0]];
  },
  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.className = 'glr-codeblock';
      const bar = document.createElement('div');
      bar.className = 'glr-codeblock__bar';
      const lang = document.createElement('span');
      const hl = document.createElement('span');
      bar.append(lang, hl);
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      pre.appendChild(code);
      dom.append(bar, pre);

      const render = (n) => {
        lang.textContent = n.attrs.lang || 'code';
        hl.textContent = n.attrs.highlight ? `regels: ${n.attrs.highlight}` : '';
        code.textContent = n.textContent || '';
      };
      render(node);
      bar.addEventListener('click', (event) => {
        event.preventDefault();
        editor.emit('glr-block-click', { kind: 'code', pos: getPos(), node });
      });
      return { dom, ignoreMutation: () => true };
    };
  },
});

/** Thematische regel (`---` binnen een slide). */
export const Hr = Node.create({
  name: 'hr',
  group: 'block',
  atom: true,
  parseHTML() {
    return [{ tag: 'hr' }];
  },
  renderHTML() {
    return ['hr'];
  },
});

/** Afbeelding (inline, zodat `![alt](src)` in een alinea past). */
export const GlrImage = Node.create({
  name: 'image',
  group: 'inline',
  inline: true,
  atom: true,
  draggable: true,
  addAttributes() {
    return { src: { default: null }, alt: { default: null }, title: { default: null } };
  },
  parseHTML() {
    return [{ tag: 'img[src]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },
});


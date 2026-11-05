/**
 * SlideEditor — dunne wrapper om Tiptap met het GLR-schema.
 * Laadt/schrijft slide-bodies via de verliesvrije brug.
 */
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { HtmlBlock, CommentBlock, InlineHtml, GlrCodeBlock, Hr, GlrImage } from './schema.js';
import { bodyToDoc, docToBody } from '../markdown/bridge.js';

/** Link-mark met een `title`-attribuut, zodat `[tekst](url "titel")` verliesvrij blijft. */
const GlrLink = Link.extend({
  addAttributes() {
    return { ...this.parent(), title: { default: null } };
  },
});

export class SlideEditor {
  constructor(element, { onChange, onBlockClick } = {}) {
    this.onChange = onChange;
    this.onBlockClick = onBlockClick;
    this.suppress = false;
    this.editor = new Editor({
      element,
      extensions: [
        StarterKit.configure({ codeBlock: false, horizontalRule: false }),
        GlrLink.configure({ openOnClick: false, autolink: false }),
        Highlight,
        Underline,
        HtmlBlock,
        CommentBlock,
        InlineHtml,
        GlrCodeBlock,
        Hr,
        GlrImage,
      ],
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
      onUpdate: ({ editor }) => {
        if (this.suppress) return;
        if (this.onChange) this.onChange(docToBody(editor.getJSON()));
      },
    });
    this.editor.on('glr-block-click', (payload) => {
      if (this.onBlockClick) this.onBlockClick(payload);
    });
  }

  /** Laadt de body van een slide (zonder een change-event te vuren). */
  loadBody(body) {
    this.suppress = true;
    this.editor.commands.setContent(bodyToDoc(body), false);
    this.suppress = false;
  }

  /** Huidige body als markdown (verliesvrij). */
  getBody() {
    return docToBody(this.editor.getJSON());
  }

  /** Vervangt een specifieke node (bv. na een inspector-aanpassing). */
  updateNodeAt(pos, nodeJson) {
    this.suppress = true;
    this.editor
      .chain()
      .command(({ tr, state }) => {
        const node = state.doc.nodeAt(pos);
        if (!node) return false;
        tr.replaceWith(pos, pos + node.nodeSize, state.schema.nodeFromJSON(nodeJson));
        return true;
      })
      .run();
    this.suppress = false;
    if (this.onChange) this.onChange(this.getBody());
  }

  run(fn) {
    fn(this.editor.chain().focus()).run();
  }

  focus() {
    this.editor.commands.focus();
  }

  destroy() {
    this.editor.destroy();
  }
}

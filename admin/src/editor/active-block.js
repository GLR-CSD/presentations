/**
 * Tiptap-extensie: markeert het geselecteerde top-level blok in de editor
 * (klasse `is-glr-selected`) en meldt wanneer de cursor naar een ander blok gaat.
 */
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export const activeBlockKey = new PluginKey('glrActiveBlock');

export const ActiveBlock = Extension.create({
  name: 'activeBlock',
  addOptions() { return { onCaretBlock: null }; },
  addProseMirrorPlugins() {
    const ext = this;
    return [new Plugin({
      key: activeBlockKey,
      state: {
        init: () => ({ index: null }),
        apply(tr, value) {
          const meta = tr.getMeta(activeBlockKey);
          return meta !== undefined ? { index: meta.index } : value;
        },
      },
      props: {
        decorations(state) {
          const { index } = activeBlockKey.getState(state);
          if (index == null) return null;
          let deco = null;
          state.doc.forEach((node, offset, i) => {
            if (i === index) deco = Decoration.node(offset, offset + node.nodeSize, { class: 'is-glr-selected' });
          });
          return deco ? DecorationSet.create(state.doc, [deco]) : null;
        },
      },
      view() {
        return {
          update(view, prev) {
            if (prev.selection.eq(view.state.selection) || !view.hasFocus()) return;
            const cb = ext.options.onCaretBlock;
            if (cb) cb(view.state.selection.$from.index(0));
          },
        };
      },
    })];
  },
});

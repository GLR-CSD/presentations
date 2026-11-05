/**
 * SourceEditor — CodeMirror 6 voor de "Source"- en "Split"-weergave.
 * Bewerkt de ruwe Markdown van het hele deck (of één slide) met
 * Markdown/YAML/HTML-syntaxmarkering. Dit blijft de "source of truth": alles
 * wat de visuele modus niet 1-op-1 kan tonen, is hier te repareren.
 */
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';

export class SourceEditor {
  constructor(parent, { onChange } = {}) {
    this.onChange = onChange;
    this.suppress = false;
    this.view = new EditorView({
      parent,
      state: EditorState.create({
        doc: '',
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          drawSelection(),
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap]),
          markdown(),
          EditorView.lineWrapping,
          EditorView.updateListener.of((update) => {
            if (update.docChanged && !this.suppress && this.onChange) this.onChange(update.state.doc.toString());
          }),
        ],
      }),
    });
  }

  setValue(text) {
    this.suppress = true;
    this.view.dispatch({ changes: { from: 0, to: this.view.state.doc.length, insert: text } });
    this.suppress = false;
  }

  getValue() {
    return this.view.state.doc.toString();
  }

  destroy() {
    this.view.destroy();
  }
}

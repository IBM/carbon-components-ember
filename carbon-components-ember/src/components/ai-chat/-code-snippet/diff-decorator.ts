/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported verbatim from `@carbon/ai-chat-components`'
 * `code-snippet/src/codemirror/diff-decorator.ts` - a line-level decorator
 * that colors `diff`-language `+`/`-` lines (skipping `+++`/`---` metadata
 * lines).
 */
import { ViewPlugin, Decoration, EditorView } from '@codemirror/view';
import type { DecorationSet, ViewUpdate } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';

const insertedLineDeco = Decoration.line({ class: 'cm-diff-line-inserted' });
const deletedLineDeco = Decoration.line({ class: 'cm-diff-line-deleted' });

export function createDiffDecorator() {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = this.buildDecorations(update.view);
        }
      }

      buildDecorations(view: EditorView): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>();

        for (const { from, to } of view.visibleRanges) {
          for (let pos = from; pos <= to; ) {
            const line = view.state.doc.lineAt(pos);
            const text = line.text;

            // Check if line is an insertion (starts with + but not +++)
            if (text.startsWith('+') && !text.startsWith('+++')) {
              builder.add(line.from, line.from, insertedLineDeco);
            }
            // Check if line is a deletion (starts with - but not ---)
            else if (text.startsWith('-') && !text.startsWith('---')) {
              builder.add(line.from, line.from, deletedLineDeco);
            }

            pos = line.to + 1;
          }
        }

        return builder.finish();
      }
    },
    {
      decorations: (v) => v.decorations,
    }
  );
}

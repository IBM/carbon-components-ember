/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Editor, Extension } from '@tiptap/core';
import type { JSONContent } from '@tiptap/core';
import { Plugin, TextSelection } from '@tiptap/pm/state';
import { Fragment, Slice } from '@tiptap/pm/model';
import type { Node as ProseMirrorNode, Schema } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';
import DocumentNode from '@tiptap/extension-document';
import HardBreakNode from '@tiptap/extension-hard-break';
import ParagraphNode from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import TextNode from '@tiptap/extension-text';
import { UndoRedo } from '@tiptap/extensions';
import { getRawText, textToDoc } from './text-utils.ts';
import type { EditingSurfaceController, EditingSurfaceInit } from './controller.ts';

/**
 * The **only** module in the prompt-line stack that imports `@tiptap/*` —
 * reached exclusively through `PromptLine`'s dynamic `import()`, so a
 * bundler splits Tiptap into its own lazy chunk and chats that never enable
 * `@rich` never ship it. Ported from `@carbon/ai-chat-components`'
 * `prompt-line-rich-runtime.ts`, trimmed to this port's scope: no
 * mention/autocomplete extensions (`carbon-mention`/`carbon-autocomplete`/
 * `carbon-starter-trigger` — a separate, not-yet-ported feature), no
 * typing-indicator event, and no origin-tagging (both exist upstream to keep
 * a mention-removal plugin and a typing indicator in sync with host-driven
 * changes; neither exists in this port). `@extensions` is compared by
 * reference, not upstream's deep equivalence check — a fresh array every
 * render rebuilds the editor (resetting undo history), so memoize it.
 */

const HISTORY_DEFAULTS = { depth: 100, newGroupDelay: 500 };

function createChatKeymap(onSendIntent: () => void) {
  return Extension.create({
    name: 'carbonChatKeymap',
    addKeyboardShortcuts() {
      return {
        'Mod-Enter': () => {
          onSendIntent();
          return true;
        },
        Escape: ({ editor }) => {
          editor.view.dom.blur();
          return true;
        },
      };
    },
  });
}

/** Plain Enter sends (non-empty); empty Enter falls through to a newline. */
function createChatEnter(onSendIntent: () => void) {
  return Extension.create({
    name: 'carbonChatEnter',
    addKeyboardShortcuts() {
      return {
        Enter: ({ editor }) => {
          if (editor.isEmpty) {
            return false;
          }
          onSendIntent();
          return true;
        },
      };
    },
  });
}

/** Builds a paragraph node per interior line, for a multi-line paste/drop. */
function linesToNodes(schema: Schema, lines: string[]): ProseMirrorNode[] {
  return lines.map((line) =>
    line.length === 0
      ? schema.nodes['paragraph']!.create()
      : schema.nodes['paragraph']!.create(null, schema.text(line)),
  );
}

/**
 * Clamps `pos` into the range `setTextSelection` itself would clamp a
 * selection into (`TextSelection.atStart(doc).from` .. `TextSelection.atEnd
 * (doc).to`) - never the document's outer boundary (`0`/`doc.content.size`)
 * for a non-empty doc. `insertPlainText`'s multi-line branch relies on an
 * "open" slice merging into a paragraph that already surrounds `from`/`to`;
 * at the true outer boundary there is no such paragraph (resolving that
 * position has depth `0`), so the open ends fail to merge and a multi-line
 * insert silently produces extra, unmerged paragraphs instead.
 */
function clampToTextRange(doc: ProseMirrorNode, pos: number): number {
  return Math.min(Math.max(pos, TextSelection.atStart(doc).from), TextSelection.atEnd(doc).to);
}

/**
 * Inserts plain text at `from`/`to`, splitting on newlines. A single-line
 * paste/drop (the overwhelmingly common case - a URL, a word mid-sentence)
 * is inserted as inline text so it merges into whatever paragraph is already
 * there, instead of being wrapped in its own `paragraph` node (which would
 * split the surrounding line in two). Genuine multi-line text is inserted as
 * an "open" slice (`openStart`/`openEnd: 1`) so only the *interior* lines
 * become new paragraphs - the first and last lines merge into the paragraph
 * content already surrounding `from`/`to`, matching how a real multi-line
 * paste behaves in any other rich text editor.
 */
function insertPlainText(view: EditorView, text: string, from: number, to: number) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const tr =
    lines.length === 1
      ? view.state.tr.insertText(lines[0]!, from, to)
      : view.state.tr.replace(
          from,
          to,
          new Slice(Fragment.from(linesToNodes(view.state.schema, lines)), 1, 1),
        );
  view.dispatch(tr.scrollIntoView());
}

/** Intercepts paste/drop and inserts plain text, splitting on newlines. */
const PlainTextPaste = Extension.create({
  name: 'carbonPlainTextPaste',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste(view, event) {
            const text = event.clipboardData?.getData('text/plain');
            if (text == null) {
              return false;
            }
            const { from, to } = view.state.selection;
            insertPlainText(view, text, from, to);
            return true;
          },
          handleDrop(view, event, _slice, moved) {
            if (moved) {
              return false;
            }
            const text = event.dataTransfer?.getData('text/plain');
            if (!text) {
              return true;
            }
            const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
            if (!pos) {
              return true;
            }
            insertPlainText(view, text, pos.pos, pos.pos);
            event.preventDefault();
            return true;
          },
        },
      }),
    ];
  },
});

const PM_CONTENT_CLASS = 'cds-aichat-prompt-line__pm-content';

class RichController implements EditingSurfaceController {
  private editor: Editor | null = null;
  private host: HTMLElement | null = null;
  private extensions: Extension[] = [];
  private placeholder = '';
  private ariaLabel: string | undefined;
  private testId: string | undefined;
  private disabled = false;
  private onChange: (value: string) => void = () => {};
  private onSendIntent: () => void = () => {};
  /** Guards `setContent` (a controlled `@content` sync) from re-emitting `onChange`. */
  private suppressChange = false;
  /** Set while an IME composition is in flight (see `setComposing`). */
  private composing = false;
  /** Set when a `setExtensions` rebuild was withheld during a composition. */
  private pendingRecreate = false;

  mount(host: HTMLElement, init: EditingSurfaceInit) {
    this.host = host;
    this.extensions = init.extensions;
    this.onChange = init.onChange;
    this.onSendIntent = init.onSendIntent;
    this.placeholder = init.placeholder;
    this.ariaLabel = init.ariaLabel;
    this.testId = init.testId;
    this.disabled = init.disabled;
    this.editor = this.createEditor(host, textToDoc(init.value));
    this.applyEditorChrome();
    // `emitUpdate: false` - Tiptap's `setEditable` fires an `update` event
    // (and so `onChange`) by default, even though editability alone never
    // changes the text content. Left at its default here would spuriously
    // re-report the current value on every mount/rebuild - including the
    // very first one, for a controlled `@content` seed nothing typed.
    this.editor.setEditable(!this.disabled, false);
  }

  destroy() {
    this.editor?.destroy();
    this.editor = null;
    this.host = null;
  }

  getValue(): string {
    return this.editor ? getRawText(this.editor.getJSON()) : '';
  }

  setContent(value: string) {
    const editor = this.editor;
    if (!editor || this.getValue() === value) {
      return;
    }
    this.suppressChange = true;
    editor.commands.setContent(textToDoc(value));
    this.suppressChange = false;
  }

  /**
   * Inserts `text` as literal characters, never as parsed HTML - Tiptap's own
   * `insertContent`/`insertContentAt` commands parse a string argument via
   * `DOMParser`, so any substring that happens to look like a recognized tag
   * (this schema has `<p>`/`<br>`) would otherwise get spliced in as a real
   * node instead of visible text. Routed through the same `insertPlainText`
   * helper the paste/drop handler uses, so this stays consistent with
   * `setContent()` (which seeds via `textToDoc`, not a raw string) and with
   * `TextareaController.insertContent()`, which is always literal. `opts.at`
   * is clamped via `clampToTextRange` (mirroring `setTextSelection`) so a
   * caller passing `0`/`doc.content.size` for a multi-line insert still
   * merges into the surrounding paragraph instead of leaving it detached.
   */
  insertContent(text: string, opts: { at?: number } = {}) {
    const editor = this.editor;
    if (!editor) {
      return;
    }
    const { view } = editor;
    const at = typeof opts.at === 'number' ? clampToTextRange(view.state.doc, opts.at) : undefined;
    const from = at ?? view.state.selection.from;
    const to = at ?? view.state.selection.to;
    insertPlainText(view, text, from, to);
  }

  clearContent() {
    this.editor?.commands.clearContent(true);
  }

  getEditor(): Editor | null {
    return this.editor;
  }

  focus() {
    this.editor?.commands.focus();
  }

  blur() {
    this.editor?.commands.blur();
  }

  hasFocus(): boolean {
    return this.editor?.isFocused ?? false;
  }

  getSelection() {
    const selection = this.editor?.state.selection;
    return selection ? { from: selection.from, to: selection.to } : { from: 0, to: 0 };
  }

  setTextSelection(pos: number | { from: number; to: number }) {
    this.editor?.commands.setTextSelection(pos);
  }

  selectAll() {
    this.editor?.commands.selectAll();
  }

  setEditable(editable: boolean) {
    this.disabled = !editable;
    // See the `emitUpdate: false` comment in `createEditor`'s caller above -
    // toggling editability isn't a content change.
    this.editor?.setEditable(editable, false);
  }

  setPlaceholder(placeholder: string) {
    this.placeholder = placeholder;
    // `Placeholder.configure`'s resolver (below) reads `this.placeholder`
    // live, so an empty transaction just repaints the decoration with the
    // new text instead of waiting for the next edit.
    const editor = this.editor;
    if (editor) {
      editor.view.dispatch(editor.state.tr);
    }
  }

  setAriaLabel(ariaLabel?: string) {
    this.ariaLabel = ariaLabel;
    this.applyEditorChrome();
  }

  setTestId(testId?: string) {
    this.testId = testId;
    this.applyEditorChrome();
  }

  setExtensions(extensions: Extension[]) {
    if (extensions === this.extensions) {
      return;
    }
    this.extensions = extensions;
    // `recreateEditor` destroys and rebuilds the live editor - doing that
    // mid-composition would strand the IME's candidate text the same way an
    // unguarded textarea->rich swap would. Withhold it until `setComposing
    // (false)` releases it.
    if (this.composing) {
      this.pendingRecreate = true;
      return;
    }
    this.recreateEditor();
  }

  /**
   * Reports whether an IME composition is in flight. `PromptLine` owns the
   * one composition observer for both surfaces and pushes the state down
   * here so a `setExtensions` rebuild during composition is deferred instead
   * of stranding the IME's candidate text, then flushed once composition
   * ends.
   */
  setComposing(composing: boolean) {
    this.composing = composing;
    if (!composing && this.pendingRecreate) {
      this.pendingRecreate = false;
      this.recreateEditor();
    }
  }

  undo(): boolean {
    return Boolean(this.editor?.commands.undo());
  }

  redo(): boolean {
    return Boolean(this.editor?.commands.redo());
  }

  private createEditor(element: HTMLElement, content: JSONContent): Editor {
    const baseExtensions = [
      DocumentNode,
      ParagraphNode,
      TextNode,
      HardBreakNode,
      UndoRedo.configure({ ...HISTORY_DEFAULTS }),
      Placeholder.configure({ placeholder: () => this.placeholder }),
      PlainTextPaste,
      createChatKeymap(() => this.onSendIntent()),
      createChatEnter(() => this.onSendIntent()),
    ];
    return new Editor({
      element,
      extensions: [...baseExtensions, ...this.extensions],
      content,
      autofocus: false,
      injectCSS: false,
      onUpdate: ({ editor }) => {
        if (this.suppressChange) {
          return;
        }
        this.onChange(getRawText(editor.getJSON()));
      },
    });
  }

  private recreateEditor() {
    const host = this.host;
    const editor = this.editor;
    if (!host || !editor) {
      return;
    }
    const value = getRawText(editor.getJSON());
    const selection = this.getSelection();
    const wasFocused = editor.isFocused;
    editor.destroy();
    this.editor = this.createEditor(host, textToDoc(value));
    this.applyEditorChrome();
    // `emitUpdate: false` - Tiptap's `setEditable` fires an `update` event
    // (and so `onChange`) by default, even though editability alone never
    // changes the text content. Left at its default here would spuriously
    // re-report the current value on every mount/rebuild - including the
    // very first one, for a controlled `@content` seed nothing typed.
    this.editor.setEditable(!this.disabled, false);
    const { size } = this.editor.state.doc.content;
    this.editor.commands.setTextSelection({
      from: Math.min(selection.from, size),
      to: Math.min(selection.to, size),
    });
    if (wasFocused) {
      this.editor.commands.focus();
    }
  }

  /** Applies the CSS hook and ARIA attributes to the live contenteditable. */
  private applyEditorChrome() {
    const dom = this.editor?.view.dom;
    if (!dom) {
      return;
    }
    dom.classList.add(PM_CONTENT_CLASS);
    dom.setAttribute('role', 'textbox');
    dom.setAttribute('aria-multiline', 'true');
    if (this.ariaLabel) {
      dom.setAttribute('aria-label', this.ariaLabel);
    } else {
      dom.removeAttribute('aria-label');
    }
    if (this.testId) {
      dom.setAttribute('data-testid', this.testId);
    } else {
      dom.removeAttribute('data-testid');
    }
  }
}

export function createRichController(): EditingSurfaceController {
  return new RichController();
}

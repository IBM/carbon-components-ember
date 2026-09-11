/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Editor } from '@tiptap/core';
import type { EditingSurfaceController, EditingSurfaceInit } from './controller.ts';

/**
 * `<textarea>`-backed controller, ported from `@carbon/ai-chat-components`'
 * `TextareaController` (`prompt-line-controller.ts`) — Tiptap-free, so this
 * file (and everything it imports) is safe to import eagerly. Auto-grows via
 * a hidden mirror capped at the same block size the rich contenteditable
 * uses (`_prompt-line.scss`'s `157px`), so the textarea→rich swap is
 * imperceptible. Enter-to-send matches the rich editor's keymap: plain Enter
 * sends on a non-empty field, Mod-Enter always sends, Shift-Enter inserts a
 * newline, Escape blurs.
 */
export class TextareaController implements EditingSurfaceController {
  private wrap: HTMLDivElement | null = null;
  private textarea: HTMLTextAreaElement | null = null;
  private mirror: HTMLDivElement | null = null;
  private onChange: (value: string) => void = () => {};
  private onSendIntent: () => void = () => {};

  private handleInput = () => {
    this.syncMirror();
    this.onChange(this.getValue());
  };

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.isComposing) {
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      const isModEnter = event.metaKey || event.ctrlKey;
      if (isModEnter || this.getValue() !== '') {
        event.preventDefault();
        this.onSendIntent();
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.textarea?.blur();
    }
  };

  mount(host: HTMLElement, init: EditingSurfaceInit) {
    this.onChange = init.onChange;
    this.onSendIntent = init.onSendIntent;

    const wrap = document.createElement('div');
    wrap.className = 'cds-aichat-prompt-line__grow';

    const textarea = document.createElement('textarea');
    textarea.className = 'cds-aichat-prompt-line__field';
    textarea.rows = 1;
    textarea.name = 'message';
    textarea.spellcheck = true;
    textarea.placeholder = init.placeholder;
    textarea.value = init.value;
    textarea.readOnly = init.disabled;
    if (init.ariaLabel) {
      textarea.setAttribute('aria-label', init.ariaLabel);
    }
    if (init.testId) {
      textarea.setAttribute('data-testid', init.testId);
    }

    const mirror = document.createElement('div');
    mirror.className = 'cds-aichat-prompt-line__mirror';
    mirror.setAttribute('aria-hidden', 'true');

    wrap.appendChild(textarea);
    wrap.appendChild(mirror);
    host.appendChild(wrap);

    this.wrap = wrap;
    this.textarea = textarea;
    this.mirror = mirror;

    textarea.addEventListener('input', this.handleInput);
    textarea.addEventListener('keydown', this.handleKeydown);

    this.syncMirror();
  }

  destroy() {
    const textarea = this.textarea;
    textarea?.removeEventListener('input', this.handleInput);
    textarea?.removeEventListener('keydown', this.handleKeydown);
    this.wrap?.remove();
    this.wrap = null;
    this.textarea = null;
    this.mirror = null;
  }

  getValue(): string {
    return this.textarea?.value ?? '';
  }

  setContent(value: string) {
    if (!this.textarea || this.textarea.value === value) {
      return;
    }
    this.textarea.value = value;
    this.syncMirror();
  }

  insertContent(text: string, opts: { at?: number } = {}) {
    const ta = this.textarea;
    if (!ta) {
      return;
    }
    const value = ta.value;
    const at = typeof opts.at === 'number' ? Math.max(0, Math.min(opts.at, value.length)) : (ta.selectionStart ?? value.length);
    const end = typeof opts.at === 'number' ? at : (ta.selectionEnd ?? at);
    const nextValue = value.slice(0, at) + text + value.slice(end);
    const caret = at + text.length;
    ta.value = nextValue;
    this.syncMirror();
    ta.setSelectionRange(caret, caret);
    this.onChange(nextValue);
  }

  clearContent() {
    if (!this.textarea) {
      return;
    }
    this.textarea.value = '';
    this.syncMirror();
    this.onChange('');
  }

  getEditor(): Editor | null {
    return null;
  }

  focus() {
    this.textarea?.focus();
  }

  blur() {
    this.textarea?.blur();
  }

  hasFocus(): boolean {
    const ta = this.textarea;
    if (!ta) {
      return false;
    }
    const root = ta.getRootNode() as Document | ShadowRoot;
    return root.activeElement === ta;
  }

  getSelection() {
    const ta = this.textarea;
    return { from: ta?.selectionStart ?? 0, to: ta?.selectionEnd ?? 0 };
  }

  setTextSelection(pos: number | { from: number; to: number }) {
    const ta = this.textarea;
    if (!ta) {
      return;
    }
    const len = ta.value.length;
    if (typeof pos === 'number') {
      const p = Math.max(0, Math.min(pos, len));
      ta.setSelectionRange(p, p);
      return;
    }
    ta.setSelectionRange(Math.max(0, Math.min(pos.from, len)), Math.max(0, Math.min(pos.to, len)));
  }

  selectAll() {
    this.textarea?.select();
  }

  setEditable(editable: boolean) {
    if (this.textarea) {
      this.textarea.readOnly = !editable;
    }
  }

  setPlaceholder(placeholder: string) {
    if (this.textarea) {
      this.textarea.placeholder = placeholder;
    }
  }

  setAriaLabel(ariaLabel?: string) {
    if (!this.textarea) {
      return;
    }
    if (ariaLabel) {
      this.textarea.setAttribute('aria-label', ariaLabel);
    } else {
      this.textarea.removeAttribute('aria-label');
    }
  }

  setTestId(testId?: string) {
    if (!this.textarea) {
      return;
    }
    if (testId) {
      this.textarea.setAttribute('data-testid', testId);
    } else {
      this.textarea.removeAttribute('data-testid');
    }
  }

  setExtensions() {
    // Textarea mode has no Tiptap extensions; `PromptLine` upgrades to the
    // rich controller once it wants them installed.
  }

  undo() {
    return false;
  }

  redo() {
    return false;
  }

  private syncMirror() {
    if (this.mirror && this.textarea) {
      // Trailing newline so the box grows the instant a new line starts.
      this.mirror.textContent = `${this.textarea.value}\n`;
    }
  }
}

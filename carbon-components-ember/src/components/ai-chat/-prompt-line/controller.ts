/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Editor, Extension } from '@tiptap/core';

/**
 * Common shape both editing surfaces (`TextareaController` and the
 * dynamically-imported `RichController`) implement, mirroring
 * `@carbon/ai-chat-components`' own `TextareaController`/`RichController`
 * pair. `PromptLine` talks to whichever one is currently mounted through
 * this interface so the swap between them is a plain object reassignment.
 *
 * `import type` only — referencing `Extension`/`Editor` here doesn't pull a
 * real `@tiptap/core` import into this (eagerly-loaded) file.
 */
export interface EditingSurfaceInit {
  value: string;
  placeholder: string;
  disabled: boolean;
  ariaLabel?: string;
  testId?: string;
  /** Ignored by `TextareaController`; installed by `RichController` only. */
  extensions: Extension[];
  onChange: (value: string) => void;
  onSendIntent: () => void;
}

export interface EditingSurfaceController {
  mount(host: HTMLElement, init: EditingSurfaceInit): void;
  destroy(): void;
  getValue(): string;
  /** Controlled `@content` sync — must not itself invoke `onChange`. */
  setContent(value: string): void;
  insertContent(text: string, opts?: { at?: number }): void;
  clearContent(): void;
  getEditor(): Editor | null;
  focus(): void;
  blur(): void;
  hasFocus(): boolean;
  getSelection(): { from: number; to: number };
  setTextSelection(pos: number | { from: number; to: number }): void;
  selectAll(): void;
  setEditable(editable: boolean): void;
  setPlaceholder(placeholder: string): void;
  setAriaLabel(ariaLabel?: string): void;
  setTestId(testId?: string): void;
  setExtensions(extensions: Extension[]): void;
  /**
   * Reports whether an IME composition is in flight, so a controller can
   * withhold a destructive rebuild (`RichController`'s `recreateEditor`)
   * until it ends rather than stranding the IME's candidate text.
   * `TextareaController` never rebuilds, so it's a no-op there.
   */
  setComposing(composing: boolean): void;
  undo(): boolean;
  redo(): boolean;
}

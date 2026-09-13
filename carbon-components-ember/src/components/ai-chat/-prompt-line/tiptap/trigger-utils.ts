/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Editor } from '@tiptap/core';
import type { TriggerChangeEventDetail } from './types.ts';

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/trigger-utils.ts`,
 * unchanged — pure event dispatch, no framework dependency. Each factory
 * (`carbonMention`/`carbonCommand`/`carbonAutocomplete`/
 * `carbonStarterTrigger`) calls this directly from its own suggestion-render
 * lifecycle; there is no central bridge extension. A real `cds-aichat-
 * trigger-change` DOM event bubbles from `editor.view.dom` up through
 * `PromptLine`'s own (unshadowed, light-DOM) markup to its root element,
 * which forwards `...attributes` — a host listens for it the same way it
 * already can for a real `keydown` (see `PromptLine`'s class doc), no
 * dedicated `@onTriggerChange` arg needed.
 */
const lastDetailByEditor = new WeakMap<Editor, TriggerChangeEventDetail | null>();

export function dispatchTriggerChange(editor: Editor, detail: TriggerChangeEventDetail | null): void {
  const previous = lastDetailByEditor.get(editor) ?? null;
  if (areDetailsEqual(previous, detail)) {
    return;
  }
  lastDetailByEditor.set(editor, detail);
  editor.view.dom.dispatchEvent(
    new CustomEvent<TriggerChangeEventDetail | null>('cds-aichat-trigger-change', {
      detail,
      bubbles: true,
      composed: true,
    }),
  );
}

/** Reset the coalescing state so the next `dispatchTriggerChange` call re-dispatches instead of being swallowed as a no-op. */
export function resetTriggerChangeState(editor: Editor): void {
  lastDetailByEditor.delete(editor);
}

function areDetailsEqual(a: TriggerChangeEventDetail | null, b: TriggerChangeEventDetail | null): boolean {
  if (a === null || b === null) {
    return a === b;
  }
  return a.type === b.type && a.query === b.query && a.triggerOffset === b.triggerOffset;
}

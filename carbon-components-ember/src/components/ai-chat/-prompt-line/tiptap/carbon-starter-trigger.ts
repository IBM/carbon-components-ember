/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Extension, type Editor } from '@tiptap/core';
import { dispatchTriggerChange, resetTriggerChangeState } from './trigger-utils.ts';
import type { SuggestionItem } from './types.ts';

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/carbon-starter-trigger.ts`.
 * Watches the editor's empty + focused + editable state and emits
 * `cds-aichat-trigger-change` with `type: 'starter'`. Cut from upstream:
 * `readStarterStorage`/`writeStarterStorage`, which exist there only to
 * patch a live editor's storage in place so a starter-only config change
 * doesn't recreate the editor (upstream's own extension-equivalence check —
 * not ported here, see `build-extensions.ts`). This port's `@extensions`
 * contract is already "a fresh array rebuilds the editor, so memoize it" —
 * changing the starters list is just another instance of that, not a new
 * gap. Selecting a starter has no schema-node insertion step upstream
 * either: a host reads the item off its own config and calls `insertContent`
 * + `onSendIntent` directly (see `PromptLine`'s class doc), so there's no
 * `command` for `active-suggestion.ts` to capture here.
 */
export function carbonStarterTrigger(initialItems: SuggestionItem[], initialIsOn = true): Extension {
  return Extension.create<unknown, { items: SuggestionItem[]; isOn: boolean }>({
    name: 'carbonStarterTrigger',

    addStorage() {
      return { items: initialItems, isOn: initialIsOn };
    },

    onUpdate() {
      maybeEmit(this.editor);
    },

    onTransaction() {
      if (this.editor.isFocused) {
        maybeEmit(this.editor);
      }
    },

    onFocus({ editor }) {
      maybeEmit(editor);
    },

    onBlur({ editor }) {
      // Clear coalescing state on blur so the next focus can re-emit the
      // starter trigger even if the detail hasn't changed.
      resetTriggerChangeState(editor);
    },
  });
}

function maybeEmit(editor: Editor): void {
  const storage = (editor.storage as unknown as Record<string, unknown>)['carbonStarterTrigger'] as
    | { items: SuggestionItem[]; isOn: boolean }
    | undefined;
  const isActive =
    storage?.isOn !== false && (storage?.items.length ?? 0) > 0 && editor.isEditable && editor.isFocused && editor.isEmpty;
  if (!isActive) {
    dispatchTriggerChange(editor, null);
    return;
  }
  dispatchTriggerChange(editor, { type: 'starter', query: '', triggerOffset: 0 });
}

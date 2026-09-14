/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface ChatHistorySignature {
  Element: HTMLDivElement;
  Blocks: {
    /** Typically a `ChatHistoryHeader`. */
    header: [];
    /** Typically a `ChatHistoryToolbar`. */
    toolbar: [];
    /** Typically a `ChatHistoryContent` wrapping a `ChatHistoryPanel` (or a `ChatHistoryLoading`). */
    content: [];
  };
}

/**
 * Entry-point shell for the chat history feature: three stacked named
 * blocks (header, toolbar, content), matching upstream's three slots.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-history-shell`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-history).
 * Tracked by `scripts/parity-check.mjs` under the `chat-history` directory
 * name (`nameToEmberExport('chat-history')` → `ChatHistory`, no upstream
 * override needed) - all of this family's other pieces
 * (`ChatHistoryHeader`, `ChatHistoryToolbar`, `ChatHistoryContent`,
 * `ChatHistoryPanel` (+`Items`/`Menu`/`Item`/`ItemInput`),
 * `ChatHistorySearchItem`, `ChatHistoryLoading`,
 * `ChatHistoryDeletePanel`) are separate top-level exports under that same
 * `ChatHistory*` prefix, not nested blocks of this component - upstream
 * itself keeps them as sibling custom elements assembled by a consumer,
 * not children this shell renders on their behalf.
 *
 * Upstream's own `history-shell.ts` additionally listens for a bubbling
 * `history-delete-confirm` event (fired by `cds-aichat-history-delete-panel`)
 * to synthesize post-delete focus management: querying every
 * `cds-aichat-history-panel-item` by id, waiting two animation frames, and
 * re-dispatching a synthetic `history-item-selected` event on whichever
 * item comes next. That's host-application list bookkeeping in this port's
 * terms (the same class of cut as `ChatHistoryDeletePanel`'s own scope
 * note) - a consumer wires `ChatHistoryDeletePanel`'s `@onConfirm` directly
 * to its own item-list logic instead of relying on implicit DOM event
 * bubbling plus a DOM query.
 */
export default class ChatHistory extends Component<ChatHistorySignature> {
  <template>
    <div class='cds-aichat-history-shell' ...attributes>
      {{yield to='header'}}
      {{yield to='toolbar'}}
      {{yield to='content'}}
    </div>
  </template>
}

/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { modifier as eModifier } from 'ember-modifier';
import { default as or } from 'ember-truth-helpers/helpers/or';
import AiChatChatButton from './chat-button.gts';
import { TrashCan } from '../../icons.ts';

export type Args = {
  /** Defaults to `'Cancel'`. */
  cancelText?: string;
  /** Defaults to `'Delete'`. */
  deleteText?: string;
  /** Id of the chat item being deleted, threaded through to `@onConfirm`. */
  itemId?: string;
  onCancel?: () => void;
  onConfirm?: (detail: { itemId?: string }) => void;
};

export interface ChatHistoryDeletePanelSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    /** Defaults to `'Confirm Delete'`. */
    title: [];
    /** Defaults to `'This conversation will be permanently deleted.'`. */
    description: [];
  };
}

const autofocus = eModifier((element: HTMLElement) => {
  requestAnimationFrame(() => element.focus());
});

/**
 * Confirmation overlay for deleting a chat history item.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-history-delete-panel`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-history).
 * Upstream also queries the DOM for the deleted item's sibling
 * `cds-aichat-history-panel-item` elements to compute a `nextItemId`/
 * `deletedItemWasSelected` pair and synthesizes focus-management/selection
 * side effects from it (see `history-shell.ts`'s
 * `_handleHistoryDeleteConfirm`) - that's host-application bookkeeping in
 * this port's terms (the consumer owns the item list and already knows
 * which item comes next), not part of this component's own public
 * surface, so it isn't reproduced. `@onConfirm` only passes `@itemId`
 * back; a consumer that needs to move focus/selection after a delete
 * should do so itself from that callback.
 */
export default class ChatHistoryDeletePanel extends Component<ChatHistoryDeletePanelSignature> {
  handleCancel = () => this.args.onCancel?.();
  handleDelete = () => this.args.onConfirm?.({ itemId: this.args.itemId });

  <template>
    <div class='cds-aichat-history-delete-panel' ...attributes>
      <div aria-live='polite' class='cds-aichat-history-delete-panel__content'>
        <h1>
          {{#if (has-block 'title')}}
            {{yield to='title'}}
          {{else}}
            Confirm Delete
          {{/if}}
        </h1>
        <span>
          {{#if (has-block 'description')}}
            {{yield to='description'}}
          {{else}}
            This conversation will be permanently deleted.
          {{/if}}
        </span>
        <div class='cds-aichat-history-delete-panel__actions'>
          <AiChatChatButton @kind='tertiary' @size='sm' @onClick={{this.handleCancel}}>
            {{or @cancelText 'Cancel'}}
          </AiChatChatButton>
          <AiChatChatButton @kind='danger' @size='sm' @onClick={{this.handleDelete}} {{autofocus}}>
            {{or @deleteText 'Delete'}}
            <TrashCan @size='16' />
          </AiChatChatButton>
        </div>
      </div>
    </div>
  </template>
}

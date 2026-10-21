/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import Button from '../button.gts';
import ChevronLeft from '../icons/chevron-left.ts';
import './chat-history.scss';

export interface ChatHistoryHeaderSignature {
  Element: HTMLDivElement;
  Args: {
    /** Defaults to `'Chats'`. */
    headerTitle?: string;
    /** Defaults to `'Close chat history'`. */
    closeButtonLabel?: string;
    /** Renders the close button. Defaults to `false`. */
    showCloseAction?: boolean;
    onClose?: () => void;
  };
}

/**
 * Title bar for a `ChatHistoryShell`, with an optional close button.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-history-header`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-history).
 */
export default class ChatHistoryHeader extends Component<ChatHistoryHeaderSignature> {
  handleClose = () => this.args.onClose?.();

  <template>
    <div class="cds-aichat-history-header" ...attributes>
      {{#if @showCloseAction}}
        <Button
          @kind="ghost"
          @hasIconOnly={{true}}
          @iconDescription={{or @closeButtonLabel "Close chat history"}}
          @tooltipPosition="bottom"
          @size="sm"
          class="cds-aichat-history-header__close-button"
          {{on "click" this.handleClose}}
        >
          <ChevronLeft @size="16" />
        </Button>
      {{/if}}
      <span class="cds-aichat-history-header__title">{{or
          @headerTitle
          "Chats"
        }}</span>
    </div>
  </template>
}

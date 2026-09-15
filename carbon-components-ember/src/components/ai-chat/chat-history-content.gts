/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export type Args = {
  /** Label prefixed to the results count, e.g. `"Results: 12"`. Defaults to `'Results'`. */
  resultsLabel?: string;
  /** The results count to display. Omit (or pass `undefined`/`''`) to hide the count line entirely. */
  resultsCount?: string | number;
};

export interface ChatHistoryContentSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    default: [];
  };
}

/**
 * Scroll container for a `ChatHistoryPanel` (or `ChatHistoryLoading`),
 * showing an optional live-announced results count above the list.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-history-content`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-history).
 */
export default class ChatHistoryContent extends Component<ChatHistoryContentSignature> {
  get shouldDisplay() {
    return this.args.resultsCount !== undefined && this.args.resultsCount !== null && this.args.resultsCount !== '';
  }

  get displayText() {
    const label = this.args.resultsLabel ?? 'Results';
    return this.shouldDisplay && label ? `${label}: ${this.args.resultsCount}` : this.args.resultsCount;
  }

  <template>
    <div class='cds-aichat-history-content' ...attributes>
      <div class='cds-aichat-history-content__container' aria-live='polite'>
        {{#if this.shouldDisplay}}
          <span class='cds-aichat-history-content__results-count'>{{this.displayText}}</span>
        {{/if}}
      </div>
      {{yield}}
    </div>
  </template>
}

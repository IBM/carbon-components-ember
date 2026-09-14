/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { action } from '@ember/object';

export type Args = {
  name?: string;
  /** Displayed as a subtitle below `@name`. */
  date?: string;
  /** Id of this search result, threaded through to `@onSelect`. */
  id?: string;
  disabled?: boolean;
  onSelect?: (detail: { itemId?: string; itemName?: string }) => void;
};

export interface ChatHistorySearchItemSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    /** Overrides `@name` as the visible label - matches upstream's default (unnamed) slot. */
    default: [];
  };
}

/**
 * A single search-result row (name + date), rendered while a
 * `ChatHistoryToolbar`'s search field has an active query.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-history-search-item`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-history).
 * The row is a real `<button>`, so (as with `ChatHistoryPanelItem`)
 * upstream's separate host-level `Enter`/`Space` keydown handling isn't
 * needed - a native button already activates on both.
 */
export default class ChatHistorySearchItem extends Component<ChatHistorySearchItemSignature> {
  @action
  handleClick() {
    if (this.args.disabled) return;
    this.args.onSelect?.({ itemId: this.args.id, itemName: this.args.name });
  }

  <template>
    <div class='cds-aichat-history-search-item' ...attributes>
      <button type='button' class='cds--side-nav__link' disabled={{@disabled}} {{on 'click' this.handleClick}}>
        <span class='cds--side-nav__link-text'>
          {{#if (has-block)}}
            {{yield}}
          {{else}}
            {{@name}}
          {{/if}}
        </span>
        <span class='cds--side-nav__link-subtitle'>{{@date}}</span>
      </button>
    </div>
  </template>
}

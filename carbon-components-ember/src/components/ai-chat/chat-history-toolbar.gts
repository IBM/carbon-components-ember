/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { default as or } from 'ember-truth-helpers/helpers/or';
import { default as Search } from '../search.gts';
import Button from '../button.gts';
import Tooltip from '../tooltip.gts';
import { AddComment } from '../../icons.ts';

/**
 * Upstream accepts a `searchAttributes` object keyed by literal DOM
 * attribute names (`'label-text'`, `'close-button-label-text'`, ...) meant
 * to be spread onto its internal `cds-search`. This port uses camelCase
 * keys instead, matching this addon's `Search` component's own Ember args.
 */
export type SearchAttributes = {
  labelText?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  closeButtonLabelText?: string;
};

export type Args = {
  /** Defaults to `'New chat'`. */
  newChatLabel?: string;
  /** `true` to remove the search field from the toolbar. */
  searchOff?: boolean;
  searchAttributes?: SearchAttributes;
  onNewChat?: () => void;
  onSearch?: (value: string) => void;
  onSearchClear?: () => void;
};

export interface ChatHistoryToolbarSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    /** Upstream slot `actions-start`. */
    actionsStart: [];
    /** Upstream slot `actions-end`. */
    actionsEnd: [];
  };
}

/**
 * Toolbar for a `ChatHistoryShell`: an optional search field, plus a "new
 * chat" icon button.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-history-toolbar`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-history).
 * Doesn't reproduce upstream's deprecated top-level `close-button-label-text`
 * property - only `@searchAttributes.closeButtonLabelText`, matching
 * upstream's own documented preference for the newer prop.
 */
export default class ChatHistoryToolbar extends Component<ChatHistoryToolbarSignature> {
  handleNewChat = () => this.args.onNewChat?.();

  <template>
    <div class='cds-aichat-history-toolbar' ...attributes>
      {{yield to='actionsStart'}}
      {{#unless @searchOff}}
        <Search
          class='cds-aichat-history-toolbar__search'
          @labelText={{@searchAttributes.labelText}}
          @placeholder={{@searchAttributes.placeholder}}
          @disabled={{@searchAttributes.disabled}}
          @value={{@searchAttributes.value}}
          @closeButtonLabelText={{or @searchAttributes.closeButtonLabelText 'Clear search'}}
          @onChange={{@onSearch}}
          @onClear={{@onSearchClear}}
        />
      {{/unless}}
      {{yield to='actionsEnd'}}
      <Tooltip @label={{or @newChatLabel 'New chat'}} @align='bottom'>
        <Button
          class='cds-aichat-history-toolbar__new-chat'
          @ghost={{true}}
          @iconOnly={{true}}
          @size='md'
          @onClick={{this.handleNewChat}}
        >
          <AddComment @size='16' />
        </Button>
      </Tooltip>
    </div>
  </template>
}

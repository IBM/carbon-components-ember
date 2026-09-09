/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export type Args = {
  /**
   * When `true`, follows Carbon's layered-tile styling instead of the chat
   * shell's default background.
   */
  isLayered?: boolean;
  /**
   * When `true`, removes the default padding, useful when the card is used
   * as a container for content that needs to be flush against its edges.
   */
  isFlush?: boolean;
};

export interface AiChatCardSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    /** Upstream `header` slot. */
    header: [];
    /** Upstream `media` slot. */
    media: [];
    /** Upstream `body` slot. */
    body: [];
    /** Upstream `footer` slot — typically an `<AiChatCardFooter>`. */
    footer: [];
    /** Upstream `decorator` slot. */
    decorator: [];
  };
}

/**
 * Card container for Carbon AI Chat.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-card`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/card).
 * Upstream's `header`/`media`/`body`/`footer`/`decorator` slots become the
 * named blocks of the same name.
 *
 * Upstream's `card.scss` also has a `::slotted([slot='card-media'])` rule
 * that can never actually match its own `<slot name="media">` (the slot and
 * selector names disagree) — a pre-existing upstream inconsistency, not
 * reproduced here since the rule was already dead code upstream too.
 *
 * ```gjs
 * import { AiChatCard } from 'carbon-components-ember/components';
 *
 * <template>
 *   <AiChatCard>
 *     <:body>Card content</:body>
 *   </AiChatCard>
 * </template>
 * ```
 */
export default class AiChatCard extends Component<AiChatCardSignature> {
  <template>
    <div
      class='cds-aichat-card cds--tile
        {{if @isLayered "cds-aichat-card--layered"}}
        {{if @isFlush "cds-aichat-card--flush"}}'
      ...attributes
    >
      {{yield to='header'}}
      {{yield to='media'}}
      {{yield to='body'}}
      {{yield to='footer'}}
      {{yield to='decorator'}}
    </div>
  </template>
}

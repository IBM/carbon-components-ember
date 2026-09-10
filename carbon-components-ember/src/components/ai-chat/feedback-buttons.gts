/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { default as Button } from '../button.gts';
import { default as Tooltip } from '../tooltip.gts';
import {
  ThumbsDown,
  ThumbsDownFilled,
  ThumbsUp,
  ThumbsUpFilled,
} from '../../icons.ts';

export type Args = {
  isPositiveOpen?: boolean;
  isNegativeOpen?: boolean;
  isPositiveSelected?: boolean;
  isNegativeSelected?: boolean;
  hasPositiveDetails?: boolean;
  hasNegativeDetails?: boolean;
  isPositiveDisabled?: boolean;
  isNegativeDisabled?: boolean;
  /** Defaults to `'Good response'`. */
  positiveLabel?: string;
  /** Defaults to `'Bad response'`. */
  negativeLabel?: string;
  /** ID prefix used to build `aria-controls` for each button's own details panel. */
  panelId?: string;
  /** Called with `true` for the thumbs-up button, `false` for thumbs-down. */
  onClick?: (isPositive: boolean) => void;
};

export interface FeedbackButtonsSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * Thumbs-up / thumbs-down pair used to collect quick feedback on a chat
 * response, each optionally wired to its own details panel (typically a
 * `Feedback`) via `aria-controls`.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-feedback-buttons`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/feedback).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed.
 *
 * Upstream flips its tooltip alignment (`top-start`/`top-end`) based on
 * document direction. Not reproduced — `Tooltip`'s own `@autoAlign` already
 * repositions to stay within the viewport regardless of direction, so this
 * port just uses the default `'top'` alignment.
 */
export default class FeedbackButtons extends Component<FeedbackButtonsSignature> {
  get positiveControls() {
    return this.args.panelId ? `${this.args.panelId}-feedback-positive` : undefined;
  }

  get negativeControls() {
    return this.args.panelId ? `${this.args.panelId}-feedback-negative` : undefined;
  }

  get positiveExpanded() {
    if (this.args.isPositiveDisabled || !this.args.hasPositiveDetails) {
      return undefined;
    }
    return this.args.isPositiveOpen ? 'true' : 'false';
  }

  get negativeExpanded() {
    if (this.args.isNegativeDisabled || !this.args.hasNegativeDetails) {
      return undefined;
    }
    return this.args.isNegativeOpen ? 'true' : 'false';
  }

  @action
  clickPositive() {
    this.args.onClick?.(true);
  }

  @action
  clickNegative() {
    this.args.onClick?.(false);
  }

  <template>
    <div class='cds-aichat-feedback-buttons' ...attributes>
      <Tooltip @label={{if @positiveLabel @positiveLabel 'Good response'}} @autoAlign={{true}}>
        <Button
          class='cds-aichat-feedback-buttons__positive'
          @ghost={{true}}
          @iconOnly={{true}}
          @size='sm'
          @disabled={{@isPositiveDisabled}}
          @onClick={{this.clickPositive}}
          aria-pressed={{if @isPositiveSelected 'true' undefined}}
          aria-expanded={{this.positiveExpanded}}
          aria-controls={{this.positiveControls}}
        >
          {{#if @isPositiveSelected}}
            <ThumbsUpFilled @size='16' />
          {{else}}
            <ThumbsUp @size='16' />
          {{/if}}
        </Button>
      </Tooltip>
      <Tooltip @label={{if @negativeLabel @negativeLabel 'Bad response'}} @autoAlign={{true}}>
        <Button
          class='cds-aichat-feedback-buttons__negative'
          @ghost={{true}}
          @iconOnly={{true}}
          @size='sm'
          @disabled={{@isNegativeDisabled}}
          @onClick={{this.clickNegative}}
          aria-pressed={{if @isNegativeSelected 'true' undefined}}
          aria-expanded={{this.negativeExpanded}}
          aria-controls={{this.negativeControls}}
        >
          {{#if @isNegativeSelected}}
            <ThumbsDownFilled @size='16' />
          {{else}}
            <ThumbsDown @size='16' />
          {{/if}}
        </Button>
      </Tooltip>
    </div>
  </template>
}

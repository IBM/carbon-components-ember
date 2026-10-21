/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import Button from '../button.gts';
import ThumbsDown from '../icons/thumbs-down.ts';
import ThumbsDownFilled from '../icons/thumbs-down-filled.ts';
import ThumbsUp from '../icons/thumbs-up.ts';
import ThumbsUpFilled from '../icons/thumbs-up-filled.ts';
import './feedback.scss';

export interface FeedbackButtonsSignature {
  Element: HTMLDivElement;
  Args: {
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
}

/**
 * Thumbs-up / thumbs-down pair used to collect quick feedback on a chat
 * response, each optionally wired to its own details panel (typically a
 * `Feedback`) via `aria-controls`.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-feedback-buttons`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/feedback).
 *
 * Upstream flips its tooltip alignment (`top-start`/`top-end`) based on
 * document direction. Not reproduced — `Tooltip`'s own `@autoAlign` already
 * repositions to stay within the viewport regardless of direction, so this
 * port just uses the default `'top'` alignment.
 */
export default class FeedbackButtons extends Component<FeedbackButtonsSignature> {
  get positiveControls() {
    return this.args.panelId
      ? `${this.args.panelId}-feedback-positive`
      : undefined;
  }

  get negativeControls() {
    return this.args.panelId
      ? `${this.args.panelId}-feedback-negative`
      : undefined;
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

  clickPositive = () => {
    this.args.onClick?.(true);
  };

  clickNegative = () => {
    this.args.onClick?.(false);
  };

  <template>
    <div class="cds-aichat-feedback-buttons" ...attributes>
      <Button
        @kind="ghost"
        @hasIconOnly={{true}}
        @iconDescription={{if @positiveLabel @positiveLabel "Good response"}}
        @autoAlign={{true}}
        @size="sm"
        @disabled={{@isPositiveDisabled}}
        class="cds-aichat-feedback-buttons__positive"
        aria-pressed={{if @isPositiveSelected "true" undefined}}
        aria-expanded={{this.positiveExpanded}}
        aria-controls={{this.positiveControls}}
        {{on "click" this.clickPositive}}
      >
        {{#if @isPositiveSelected}}
          <ThumbsUpFilled @size="16" />
        {{else}}
          <ThumbsUp @size="16" />
        {{/if}}
      </Button>
      <Button
        @kind="ghost"
        @hasIconOnly={{true}}
        @iconDescription={{if @negativeLabel @negativeLabel "Bad response"}}
        @autoAlign={{true}}
        @size="sm"
        @disabled={{@isNegativeDisabled}}
        class="cds-aichat-feedback-buttons__negative"
        aria-pressed={{if @isNegativeSelected "true" undefined}}
        aria-expanded={{this.negativeExpanded}}
        aria-controls={{this.negativeControls}}
        {{on "click" this.clickNegative}}
      >
        {{#if @isNegativeSelected}}
          <ThumbsDownFilled @size="16" />
        {{else}}
          <ThumbsDown @size="16" />
        {{/if}}
      </Button>
    </div>
  </template>
}

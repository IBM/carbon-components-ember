/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { ChevronUp } from '../../icons.ts';

export type Args = {
  /** Whether the panel this toggle controls is open. */
  open?: boolean;
  /** Defaults to `'Hide reasoning steps'`. */
  openLabelText?: string;
  /** Defaults to `'Show reasoning steps'`. */
  closedLabelText?: string;
  /** `aria-controls` target — typically a `ReasoningSteps`' own id. */
  panelId?: string;
  disabled?: boolean;
  /** Called with the new open state whenever the button is clicked. */
  onToggle?: (open: boolean) => void;
};

export interface ReasoningStepsToggleSignature {
  Element: HTMLButtonElement;
  Args: Args;
}

/**
 * Standalone disclosure button for a `ReasoningSteps` panel, DOM-decoupled
 * from it (same as `ChainOfThoughtToggle`/`ChainOfThought`).
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-reasoning-steps-toggle`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/reasoning-steps).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed.
 */
export default class ReasoningStepsToggle extends Component<ReasoningStepsToggleSignature> {
  // Seeded from `@open` so a static `@open={{true}}` (without `@onToggle`)
  // still sets the initial state — it just isn't a permanent lock afterward.
  @tracked internalOpen = this.args.open ?? false;

  get open() {
    if (this.args.onToggle) {
      return this.args.open ?? false;
    }
    return this.internalOpen;
  }

  get labelText() {
    return this.open
      ? this.args.openLabelText ?? 'Hide reasoning steps'
      : this.args.closedLabelText ?? 'Show reasoning steps';
  }

  @action
  handleClick() {
    if (this.args.disabled) {
      return;
    }
    const next = !this.open;
    this.internalOpen = next;
    this.args.onToggle?.(next);
  }

  <template>
    <button
      type='button'
      class='cds-aichat-reasoning-steps-toggle cds-aichat-reasoning-steps-toggle__button
        {{if this.open "cds-aichat-reasoning-steps-toggle--open"}}'
      aria-expanded={{if this.open 'true' 'false'}}
      aria-controls={{@panelId}}
      disabled={{@disabled}}
      {{on 'click' this.handleClick}}
      ...attributes
    >
      <span class='cds-aichat-reasoning-steps-toggle__label'>{{this.labelText}}</span>
      <span class='cds-aichat-reasoning-steps-toggle__caret' aria-hidden='true'>
        <ChevronUp @size='16' />
      </span>
    </button>
  </template>
}

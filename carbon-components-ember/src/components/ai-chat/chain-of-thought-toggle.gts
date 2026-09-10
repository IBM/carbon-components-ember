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
import { ChevronDown } from '../../icons.ts';

export type Args = {
  /** Whether the panel this toggle controls is open. */
  open?: boolean;
  /** Defaults to `'Hide chain of thought'`. */
  openLabelText?: string;
  /** Defaults to `'Show chain of thought'`. */
  closedLabelText?: string;
  /** `aria-controls` target — typically a `ChainOfThought`'s `@panelId`. */
  panelId?: string;
  disabled?: boolean;
  /** Called with the new open state whenever the button is clicked. */
  onToggle?: (open: boolean) => void;
};

export interface ChainOfThoughtToggleSignature {
  Element: HTMLButtonElement;
  Args: Args;
}

/**
 * Standalone disclosure button for a `ChainOfThought` panel. Upstream keeps
 * this DOM-decoupled from `cds-aichat-chain-of-thought` (they only agree via
 * `panel-id`/`aria-controls` and whatever event listeners a host wires up),
 * so this port does too — this button doesn't render or control a
 * `ChainOfThought` directly; wire `@onToggle` to whatever should happen
 * (typically setting a `ChainOfThought`'s own `@open`).
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-chain-of-thought-toggle`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chain-of-thought).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed.
 */
export default class ChainOfThoughtToggle extends Component<ChainOfThoughtToggleSignature> {
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
      ? this.args.openLabelText ?? 'Hide chain of thought'
      : this.args.closedLabelText ?? 'Show chain of thought';
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
      class='cds-aichat-chain-of-thought-toggle cds-aichat-chain-of-thought-toggle__button'
      aria-expanded={{if this.open 'true' 'false'}}
      aria-controls={{@panelId}}
      disabled={{@disabled}}
      {{on 'click' this.handleClick}}
      ...attributes
    >
      <span
        class='cds-aichat-chain-of-thought-toggle__chevron
          {{if this.open "cds-aichat-chain-of-thought-toggle--open"}}'
        aria-hidden='true'
      >
        <ChevronDown @size='16' />
      </span>
      <span class='cds-aichat-chain-of-thought-toggle__label' title={{this.labelText}}>
        {{this.labelText}}
      </span>
    </button>
  </template>
}

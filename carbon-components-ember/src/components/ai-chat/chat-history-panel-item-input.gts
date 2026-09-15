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
import { modifier as eModifier } from 'ember-modifier';
import { default as or } from 'ember-truth-helpers/helpers/or';
import { default as and } from 'ember-truth-helpers/helpers/and';
import { default as not } from 'ember-truth-helpers/helpers/not';
import Button from '../button.gts';
import Tooltip from '../tooltip.gts';
import { Checkmark, Close, WarningFilled } from '../../icons.ts';

export type Args = {
  value?: string;
  placeholder?: string;
  /** Text read by a screen reader when visiting the input. */
  labelText?: string;
  /** Defaults to `'Cancel'`. */
  cancelLabel?: string;
  /** Defaults to `'Save'`. */
  saveLabel?: string;
  invalid?: boolean;
  invalidMessage?: string;
  /** Id of the parent `ChatHistoryPanelItem`, threaded through to every callback. */
  itemId?: string;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  onSave?: (newName: string) => void;
};

export interface ChatHistoryPanelItemInputSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * Rename input swapped in for a `ChatHistoryPanelItem` while `@rename` is
 * set: a text field plus cancel/save icon buttons, auto-focused and
 * selected on mount. Saves/cancels on Enter/Escape, and on blur (unless a
 * cancel/save button click already triggered one).
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-history-panel-item-input`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-history).
 * Doesn't reproduce upstream's `tooltipAlignment` prop - this addon's
 * `Tooltip` already auto-aligns via a fixed `@align`, and every other
 * icon-button-plus-tooltip in this port (e.g. `ChatHistoryHeader`'s close
 * button) hardcodes its own alignment the same way.
 */
export default class ChatHistoryPanelItemInput extends Component<ChatHistoryPanelItemInputSignature> {
  @tracked value = this.args.value ?? '';
  @tracked valueChanged = false;
  initialValue = this.args.value ?? '';
  actionTriggered = false;

  get canSave() {
    return this.valueChanged && !this.args.invalid;
  }

  @action
  handleInput(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.valueChanged = this.value !== this.initialValue;
    this.args.onChange?.(this.value);
  }

  @action
  handleCancel() {
    this.actionTriggered = true;
    this.args.onCancel?.();
  }

  @action
  handleSave() {
    if (!this.canSave) return;
    this.actionTriggered = true;
    this.args.onSave?.(this.value);
  }

  @action
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.handleCancel();
    } else if (event.key === 'Enter') {
      if (this.canSave) {
        this.handleSave();
      } else {
        this.handleCancel();
      }
    }
  }

  @action
  handleFocusOut(event: FocusEvent) {
    if (this.actionTriggered) {
      this.actionTriggered = false;
      return;
    }
    const related = event.relatedTarget as Node | null;
    const container = event.currentTarget;
    if (related && container instanceof Node && container.contains(related)) {
      return;
    }
    // Deferred to a microtask: a `focusout` here isn't always a genuine
    // user-driven blur - removing this component's DOM (e.g. a host
    // flipping `@rename` back to `false` externally, or a sibling item
    // entering rename mode) also fires a native `focusout` on the
    // still-focused input as a side effect of the removal itself, and it
    // can do so *synchronously from within the very render transaction*
    // that's already updating this component's backing state. Calling
    // `handleSave`/`handleCancel` (which write tracked state) immediately
    // from inside that transaction would write to state already read
    // earlier in the same computation and trip Ember's backtracking-
    // rerender assertion. A microtask guarantees this only ever runs once
    // the current render transaction (whatever triggered it) has fully
    // settled, regardless of exactly when the removal itself completes.
    void Promise.resolve().then(() => {
      if (this.isDestroying || this.isDestroyed) {
        return;
      }
      if (this.canSave) {
        this.handleSave();
      } else {
        this.handleCancel();
      }
    });
  }

  focusAndSelect = eModifier((element: HTMLInputElement) => {
    requestAnimationFrame(() => {
      element.focus();
      element.select();
    });
  });

  <template>
    <div
      class='cds-aichat-history-panel-item-input
        {{if @invalid "cds-aichat-history-panel-item-input--invalid"}}'
      {{on 'focusout' this.handleFocusOut}}
      ...attributes
    >
      <div class='cds-aichat-history-panel-item-input__row'>
        <input
          type='text'
          placeholder={{@placeholder}}
          value={{this.value}}
          aria-label={{@labelText}}
          data-invalid={{if @invalid ''}}
          {{on 'input' this.handleInput}}
          {{on 'keydown' this.handleKeydown}}
          {{this.focusAndSelect}}
        />
        <div class='cds-aichat-history-panel-item-input__actions'>
          <Tooltip @label={{or @cancelLabel 'Cancel'}} @align='top'>
            <Button
              class='cds-aichat-history-panel-item-input__cancel'
              @ghost={{true}}
              @iconOnly={{true}}
              @size='sm'
              @onClick={{this.handleCancel}}
            >
              <Close @size='16' />
            </Button>
          </Tooltip>
          <Tooltip @label={{or @saveLabel 'Save'}} @align='top'>
            <Button
              class='cds-aichat-history-panel-item-input__save'
              @ghost={{true}}
              @iconOnly={{true}}
              @size='sm'
              @disabled={{not this.canSave}}
              @onClick={{this.handleSave}}
            >
              <Checkmark @size='16' />
            </Button>
          </Tooltip>
        </div>
      </div>
      {{#if (and @invalid @invalidMessage)}}
        <div class='cds-aichat-history-panel-item-input__invalid-message'>
          <div class='cds-aichat-history-panel-item-input__invalid-message-text'>{{@invalidMessage}}</div>
          <WarningFilled @size='16' />
        </div>
      {{/if}}
    </div>
  </template>
}

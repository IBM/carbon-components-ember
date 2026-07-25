/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
import { ChevronDown } from '../icons.ts';

export interface TimePickerSelectSignature {
  Args: {
    /**
     * Specify a custom `id` for the `<select>`
     */
    id?: string;
    /**
     * Specify whether the control is disabled
     */
    disabled?: boolean;
    /**
     * Optionally provide the default value of the `<select>`
     */
    defaultValue?: string;
    /**
     * The current value of the `<select>`, for controlled usage
     */
    value?: string;
    /**
     * Provide an accessible label for the `<select>`
     */
    ariaLabel?: string;
    /**
     * Called with the new value when the selection changes
     */
    onChange?: (value: string, event: Event) => void;
  };
  Element: HTMLSelectElement;
  Blocks: {
    default: [];
  };
}

/**
 * TimePickerSelect renders a native `<select>` styled to sit alongside a
 * `TimePicker`'s text input (e.g. for AM/PM or timezone selection), but it
 * can also be used on its own wherever a plain select control is needed.
 *
 * ```gjs
 * <TimePickerSelect @id='time-picker-select-1'>
 *   <option value='AM'>AM</option>
 *   <option value='PM'>PM</option>
 * </TimePickerSelect>
 * ```
 */
export default class TimePickerSelect extends Component<TimePickerSelectSignature> {
  @tracked internalValue: string;

  guid = guidFor(this);

  constructor(owner: any, args: TimePickerSelectSignature['Args']) {
    super(owner, args);
    this.internalValue = args.defaultValue ?? '';
  }

  get id() {
    return this.args.id ?? `time-picker-select-${this.guid}`;
  }

  get value() {
    return this.args.value ?? this.internalValue;
  }

  get ariaLabel() {
    return this.args.ariaLabel ?? 'open list of options';
  }

  @action
  updateValue(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.internalValue = value;
    this.args.onChange?.(value, event);
  }

  // The `<option>`s are yielded by the caller, so they only exist in the DOM
  // once this element (and its children) have been inserted/updated - setting
  // the `value` property any earlier is a no-op in the browser.
  @action
  syncValue(element: HTMLSelectElement) {
    element.value = this.value;
  }

  <template>
    <div class='cds--select cds--time-picker__select'>
      <select
        aria-label={{this.ariaLabel}}
        class='cds--select-input'
        disabled={{@disabled}}
        id={{this.id}}
        {{on 'change' this.updateValue}}
        {{didInsert this.syncValue}}
        {{didUpdate this.syncValue this.value}}
        ...attributes
      >
        {{yield}}
      </select>
      <ChevronDown @size='16' @svgClass='cds--select__arrow' />
    </div>
  </template>
}

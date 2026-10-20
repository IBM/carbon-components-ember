/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import ChevronDown from '../icons/chevron-down.ts';

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
     * Specify the value of the `<select>`
     */
    value?: string;
    /**
     * Optionally provide the default value of the `<select>`
     */
    defaultValue?: string;
    /**
     * Optionally provide an `onChange` handler that is called whenever the
     * `<select>` is updated
     */
    onChange?: (value: string, event: Event) => void;
  };
  Element: HTMLSelectElement;
  Blocks: {
    /**
     * Pass in `<option>`/`SelectItemGroup` elements
     */
    default: [];
  };
}

export default class TimePickerSelect extends Component<TimePickerSelectSignature> {
  @tracked internalValue?: string;

  guid = guidFor(this);

  constructor(owner: Owner, args: TimePickerSelectSignature['Args']) {
    super(owner, args);
    this.internalValue = args.defaultValue;
  }

  get id() {
    return this.args.id ?? `time-picker-select-${this.guid}`;
  }

  get value() {
    return this.args.value ?? this.internalValue;
  }

  // Glimmer sets a <select>'s value before its options render, so a value
  // attribute would select nothing. Select it once they're in.
  syncValue = modifier(
    (select: HTMLSelectElement, [value]: [value: string | undefined]) => {
      if (value !== undefined) select.value = value;
    },
  );

  handleChange = (event: Event) => {
    const select = event.currentTarget as HTMLSelectElement;
    this.internalValue = select.value;
    this.args.onChange?.(select.value, event);
    // A controlled select goes back to `@value` if the change didn't update it.
    if (this.args.value !== undefined) select.value = this.args.value;
  };

  <template>
    <div class="cds--select cds--time-picker__select">
      <select
        aria-label="open list of options"
        class="cds--select-input"
        id={{this.id}}
        disabled={{@disabled}}
        ...attributes
        {{this.syncValue this.value}}
        {{on "change" this.handleChange}}
      >
        {{yield}}
      </select>
      <ChevronDown @size="16" @svgClass="cds--select__arrow" />
    </div>
  </template>
}

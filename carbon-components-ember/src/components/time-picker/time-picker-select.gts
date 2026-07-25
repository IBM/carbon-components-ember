/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { ChevronDown } from '../../icons.ts';

export interface Signature {
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
     * Specify an aria-label for the `<select>` (defaults to "open list of
     * options")
     */
    ariaLabel?: string;
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

export default class TimePickerSelect extends Component<Signature> {
  @tracked internalValue: string;

  guid = guidFor(this);

  constructor(owner: any, args: Signature['Args']) {
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
  handleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.internalValue = value;
    this.args.onChange?.(value, event);
  }

  <template>
    <div class='cds--select cds--time-picker__select'>
      <select
        aria-label={{this.ariaLabel}}
        class='cds--select-input'
        id={{this.id}}
        disabled={{@disabled}}
        value={{this.value}}
        {{on 'change' this.handleChange}}
        ...attributes
      >
        {{yield}}
      </select>
      <ChevronDown @size='16' @svgClass='cds--select__arrow' />
    </div>
  </template>
}

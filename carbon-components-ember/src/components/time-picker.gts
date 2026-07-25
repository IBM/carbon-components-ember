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
import { concat } from '@ember/helper';
import { WarningFilled, WarningAltFilled } from '../icons.ts';

export interface Signature {
  Args: {
    /**
     * Specify a custom `id` for the `<input>`
     */
    id?: string;
    /**
     * Provide the text that will be read by a screen reader when visiting
     * this control
     */
    labelText?: string;
    /**
     * Specify whether you want the underlying label to be visually hidden
     */
    hideLabel?: boolean;
    /**
     * Specify the value of the `<input>`
     */
    value?: string;
    /**
     * Optionally provide the initial value of the `<input>` when uncontrolled
     */
    defaultValue?: string;
    /**
     * Specify the placeholder attribute for the `<input>`
     */
    placeholder?: string;
    /**
     * Specify the regular expression working as the pattern of the time
     * string in `<input>`
     */
    pattern?: string;
    /**
     * Specify the maximum length of the time string in `<input>`
     */
    maxLength?: number;
    /**
     * Specify the type of the `<input>`
     */
    type?: string;
    /**
     * Specify the size of the Time Picker
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Specify whether the `<input>` should be disabled
     */
    disabled?: boolean;
    /**
     * Specify whether the TimePicker should be read-only
     */
    readOnly?: boolean;
    /**
     * Specify whether the control is currently invalid
     */
    invalid?: boolean;
    /**
     * Provide the text that is displayed when the control is in an invalid
     * state
     */
    invalidText?: string;
    /**
     * Specify a warning message
     */
    warning?: boolean;
    /**
     * Provide the text that is displayed when the control is in a warning
     * state
     */
    warningText?: string;
    /**
     * The `light` prop for `TimePicker` has been deprecated. It will be
     * removed in v12. Use the `Layer` component instead.
     *
     * @deprecated
     */
    light?: boolean;
    /**
     * Specify an optional className to be applied to the `<input>` node
     */
    inputClassName?: string;
    /**
     * Specify an optional className to be applied to the container that
     * wraps the `<input>` and select option(s)
     */
    pickerClassName?: string;
    /**
     * Optionally provide an `onChange` handler that is called whenever
     * `<input>` is updated
     */
    onChange?: (value: string, event: Event) => void;
    /**
     * Optionally provide an `onClick` handler that is called whenever the
     * `<input>` is clicked
     */
    onClick?: (event: MouseEvent) => void;
    /**
     * Optionally provide an `onBlur` handler that is called whenever the
     * `<input>` loses focus
     */
    onBlur?: (event: FocusEvent) => void;
  };
  Element: HTMLDivElement;
  Blocks: {
    /**
     * Pass in `TimePickerSelect` components to render next to the `<input>`
     */
    default: [];
  };
}

export default class TimePicker extends Component<Signature> {
  @tracked internalValue: string;

  guid = guidFor(this);

  constructor(owner: any, args: Signature['Args']) {
    super(owner, args);
    this.internalValue = args.defaultValue ?? '';
  }

  get id() {
    return this.args.id ?? `time-picker-${this.guid}`;
  }

  get value() {
    return this.args.value ?? this.internalValue;
  }

  get maxLength() {
    return this.args.maxLength ?? 5;
  }

  get pattern() {
    return this.args.pattern ?? '(1[012]|[1-9]):[0-5][0-9](\\s)?';
  }

  get placeholder() {
    return this.args.placeholder ?? 'hh:mm';
  }

  get type() {
    return this.args.type ?? 'text';
  }

  get size() {
    return this.args.size ?? 'md';
  }

  get isInvalid() {
    return !!this.args.invalid;
  }

  get isWarn() {
    return this.isInvalid ? false : !!this.args.warning;
  }

  @action
  handleChange(event: Event) {
    if (this.args.disabled || this.args.readOnly) return;
    const value = (event.target as HTMLInputElement).value;
    this.internalValue = value;
    this.args.onChange?.(value, event);
  }

  @action
  handleClick(event: MouseEvent) {
    if (this.args.disabled) return;
    this.args.onClick?.(event);
  }

  @action
  handleBlur(event: FocusEvent) {
    if (this.args.disabled) return;
    this.args.onBlur?.(event);
  }

  <template>
    <div class='cds--form-item' ...attributes>
      {{#if @labelText}}
        <label
          for={{this.id}}
          class='cds--label
            {{if @hideLabel "cds--visually-hidden"}}
            {{if @disabled "cds--label--disabled"}}'
        >{{@labelText}}</label>
      {{/if}}
      <div
        class='cds--time-picker
          {{if @light "cds--time-picker--light"}}
          {{if this.isInvalid "cds--time-picker--invalid"}}
          {{if this.isWarn "cds--time-picker--warning"}}
          {{if @readOnly "cds--time-picker--readonly"}}
          {{concat "cds--time-picker--" this.size}}
          {{@pickerClassName}}'
      >
        <div class='cds--time-picker__input'>
          <input
            id={{this.id}}
            type={{this.type}}
            class='cds--time-picker__input-field cds--text-input
              {{@inputClassName}}
              {{if @light "cds--text-input--light"}}
              {{if this.isInvalid "cds--time-picker__input-field-error"}}
              {{if this.isWarn "cds--time-picker__input-field-error"}}'
            maxlength={{this.maxLength}}
            pattern={{this.pattern}}
            placeholder={{this.placeholder}}
            disabled={{@disabled}}
            readonly={{@readOnly}}
            value={{this.value}}
            aria-invalid={{if this.isInvalid 'true'}}
            data-invalid={{if this.isInvalid 'true'}}
            {{on 'input' this.handleChange}}
            {{on 'click' this.handleClick}}
            {{on 'blur' this.handleBlur}}
          />
          {{#if this.isInvalid}}
            <div class='cds--time-picker__error__icon'>
              <WarningFilled @size='16' @svgClass='cds--checkbox__invalid-icon' />
            </div>
          {{else if this.isWarn}}
            <div class='cds--time-picker__error__icon'>
              <WarningAltFilled
                @size='16'
                @svgClass='cds--text-input__invalid-icon--warning'
              />
            </div>
          {{/if}}
        </div>
        {{yield}}
      </div>
      {{#if this.isInvalid}}
        <div class='cds--form-requirement'>{{@invalidText}}</div>
      {{else if this.isWarn}}
        <div class='cds--form-requirement'>{{@warningText}}</div>
      {{/if}}
    </div>
  </template>
}

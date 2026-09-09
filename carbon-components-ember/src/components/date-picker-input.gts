/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { concat } from '@ember/helper';
import type { ComponentLike } from '@glint/template';
import { Calendar, WarningFilled, WarningAltFilled } from '../icons.ts';

export interface DatePickerInputSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * The id of the `<input>`. Also used to associate the label with the
     * field. Auto-generated when omitted.
     */
    id?: string;
    /**
     * The text read by assistive technology and (unless `@hideLabel` is
     * set) rendered above the field.
     */
    labelText: string;
    /**
     * Visually hide the label, while still keeping it available to
     * assistive technology.
     */
    hideLabel?: boolean;
    /**
     * Placeholder text shown in the field when it is empty.
     */
    placeholder?: string;
    /**
     * A regular expression pattern the input's value must match.
     */
    pattern?: string;
    /**
     * The `<input>` element's `type` attribute.
     */
    type?: string;
    /**
     * Specify the size of the field.
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Set by the parent `DatePicker` (`simple` renders no calendar icon
     * unless `@invalid`/`@warn` is set).
     */
    datePickerType?: 'simple' | 'single' | 'range';
    /**
     * Specify whether or not the input should be disabled.
     */
    disabled?: boolean;
    /**
     * Whether the field is read-only. Set by the parent `DatePicker` when it
     * is read-only.
     */
    readOnly?: boolean;
    /**
     * Specify whether the value is invalid.
     */
    invalid?: boolean;
    /**
     * Message which is displayed if the value is invalid.
     */
    invalidText?: string;
    /**
     * Specify whether the control is currently in warning state.
     */
    warn?: boolean;
    /**
     * Message which is displayed if the control is in warning state.
     */
    warnText?: string;
    /**
     * Provide text that is used alongside the control label for additional
     * help.
     */
    helperText?: string;
    /**
     * A component (for example `AILabel` once implemented) rendered inside
     * the field. Invoked with `@size='16'` and an inert `@svgClass`, so it
     * must accept both.
     */
    decorator?: ComponentLike<{
      Args: { size?: string; svgClass?: string };
    }>;
    /**
     * Called whenever the raw `<input>` fires a `change` event. `DatePicker`
     * drives the actual value through flatpickr directly on the DOM node;
     * this is for consumers that want the raw text as the user types it.
     */
    onChange?: (event: Event) => void;
    /**
     * Called when the field is clicked.
     */
    onClick?: (event: MouseEvent) => void;
  };
}

/**
 * The text `<input>` rendered by `DatePicker` - one per field (a `single`
 * or `simple` picker renders one, a `range` picker renders two: start and
 * end). Does not accept a `@value`/`@defaultValue` itself: for `single`/
 * `range` pickers, `DatePicker` drives the input's value directly through
 * flatpickr; pass `@value` to `DatePicker` instead.
 */
export default class DatePickerInput extends Component<DatePickerInputSignature> {
  guid = guidFor(this);

  get id() {
    return this.args.id ?? `date-picker-input-${this.guid}`;
  }

  get type() {
    return this.args.type ?? 'text';
  }

  get pattern() {
    return this.args.pattern ?? '\\d{1,2}\\/\\d{1,2}\\/\\d{4}';
  }

  get size() {
    return this.args.size ?? 'md';
  }

  get isInvalid() {
    return !!this.args.invalid;
  }

  get isWarn() {
    return this.isInvalid ? false : !!this.args.warn;
  }

  get showCalendarIcon() {
    // A `simple` picker has no calendar, so no calendar icon either, unless
    // there's an invalid/warn icon to show in its place.
    return this.args.datePickerType !== 'simple' || this.isInvalid || this.isWarn;
  }

  get descriptionId() {
    return `${this.id}-description`;
  }

  get hasDescription() {
    return !!(this.isInvalid || this.isWarn || this.args.helperText);
  }

  @action
  handleChange(event: Event) {
    this.args.onChange?.(event);
  }

  @action
  handleClick(event: MouseEvent) {
    if (this.args.disabled) return;
    this.args.onClick?.(event);
  }

  <template>
    <div
      class='cds--date-picker-container {{unless @labelText "cds--date-picker--nolabel"}}'
      ...attributes
    >
      {{#if @labelText}}
        <label
          for={{this.id}}
          class='cds--label
            {{if @hideLabel "cds--visually-hidden"}}
            {{if @disabled "cds--label--disabled"}}'
        >{{@labelText}}</label>
      {{/if}}
      <div
        class='cds--date-picker-input__wrapper
          {{if this.isInvalid "cds--date-picker-input__wrapper--invalid"}}
          {{if this.isWarn "cds--date-picker-input__wrapper--warn"}}
          {{if @decorator "cds--date-picker-input__wrapper--decorator"}}'
        data-invalid={{if this.isInvalid 'true'}}
      >
        <span>
          <input
            id={{this.id}}
            type={{this.type}}
            class='cds--date-picker__input
              {{concat "cds--date-picker__input--" this.size}}
              {{if this.isInvalid "cds--date-picker__input--invalid"}}
              {{if this.isWarn "cds--date-picker__input--warn"}}'
            placeholder={{@placeholder}}
            pattern={{this.pattern}}
            disabled={{@disabled}}
            readonly={{@readOnly}}
            aria-invalid={{if this.isInvalid 'true'}}
            data-invalid={{if this.isInvalid 'true'}}
            aria-describedby={{if this.hasDescription this.descriptionId}}
            {{on 'change' this.handleChange}}
            {{on 'click' this.handleClick}}
          />
          {{#if @decorator}}
            <div class='cds--date-picker-input-inner-wrapper--decorator'>
              <@decorator @size='16' @svgClass='cds--date-picker__decorator-icon' />
            </div>
          {{/if}}
          {{#if this.showCalendarIcon}}
            {{#if this.isInvalid}}
              <WarningFilled
                @size='16'
                @svgClass='cds--date-picker__icon cds--date-picker__icon--invalid'
              />
            {{else if this.isWarn}}
              <WarningAltFilled
                @size='16'
                @svgClass='cds--date-picker__icon cds--date-picker__icon--warn'
              />
            {{else}}
              <Calendar @size='16' @svgClass='cds--date-picker__icon' />
            {{/if}}
          {{/if}}
        </span>
      </div>
      {{#if this.isInvalid}}
        <div id={{this.descriptionId}} class='cds--form-requirement'>{{@invalidText}}</div>
      {{else if this.isWarn}}
        <div id={{this.descriptionId}} class='cds--form-requirement'>{{@warnText}}</div>
      {{else if @helperText}}
        <div
          id={{this.descriptionId}}
          class='cds--form__helper-text {{if @disabled "cds--form__helper-text--disabled"}}'
        >{{@helperText}}</div>
      {{/if}}
    </div>
  </template>
}

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
import { concat, fn } from '@ember/helper';
import { Add, Subtract, WarningFilled, WarningAltFilled } from '../icons.ts';

export interface Signature {
  Args: {
    id?: string;
    label?: string;
    hideLabel?: boolean;
    value?: number | '';
    defaultValue?: number | '';
    min?: number;
    max?: number;
    step?: number;
    stepStartValue?: number;
    allowEmpty?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    invalidText?: string;
    warn?: boolean;
    warnText?: string;
    helperText?: string;
    hideSteppers?: boolean;
    size?: 'sm' | 'md' | 'lg';
    light?: boolean;
    iconDescription?: string;
    onChange?: (
      value: number | '',
      event: Event,
      direction: 'up' | 'down',
    ) => void;
    onClick?: (event: MouseEvent) => void;
    onBlur?: (event: FocusEvent) => void;
  };
  Element: HTMLDivElement;
}

function decimalPlaces(num: number): number {
  const parts = num.toString().split('.');
  return parts[1] ? parts[1].length : 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default class NumberInput extends Component<Signature> {
  @tracked internalValue: number | '';

  guid = guidFor(this);

  constructor(owner: any, args: Signature['Args']) {
    super(owner, args);
    this.internalValue = args.defaultValue ?? 0;
  }

  get value(): number | '' {
    return this.args.value ?? this.internalValue;
  }

  get id() {
    return this.args.id ?? `number-input-${this.guid}`;
  }

  get step() {
    return this.args.step ?? 1;
  }

  get isOutOfRange() {
    const value = this.value;
    if (value === '') {
      return !this.args.allowEmpty;
    }
    const { min, max } = this.args;
    return (
      (min !== undefined && value < min) || (max !== undefined && value > max)
    );
  }

  get isInvalid() {
    return !!this.args.invalid || this.isOutOfRange;
  }

  get steppersDisabled() {
    return !!this.args.disabled || !!this.args.readOnly;
  }

  get isWarn() {
    return this.isInvalid ? false : !!this.args.warn;
  }

  get incrementLabel() {
    return this.args.iconDescription ?? 'Increment number';
  }

  get decrementLabel() {
    return this.args.iconDescription ?? 'Decrement number';
  }

  setValue(newValue: number | '', event: Event, direction: 'up' | 'down') {
    if (this.args.value === undefined) {
      this.internalValue = newValue;
    }
    this.args.onChange?.(newValue, event, direction);
  }

  @action
  updateValue(event: Event) {
    const raw = (event.target as HTMLInputElement).value;
    const previousValue = this.value;
    const newValue = this.args.allowEmpty && raw === '' ? '' : Number(raw);
    const direction =
      typeof previousValue === 'number' &&
      typeof newValue === 'number' &&
      previousValue < newValue
        ? 'up'
        : 'down';
    this.setValue(newValue, event, direction);
  }

  @action
  handleStep(direction: 'up' | 'down', event: Event) {
    if (this.args.disabled || this.args.readOnly) {
      return;
    }

    const { min, max } = this.args;
    const step = this.step;
    const stepStartValue = this.args.stepStartValue ?? 0;
    const value = this.value;
    const current = value === '' ? NaN : value;

    let rawValue: number;
    if (Number.isNaN(current) || !current) {
      if (stepStartValue) {
        rawValue = stepStartValue;
      } else if (
        (min !== undefined && min < 0 && max !== undefined && max > 0) ||
        (min === undefined && max === undefined) ||
        max !== undefined
      ) {
        rawValue = direction === 'up' ? 1 : -1;
      } else if (
        (min !== undefined && min > 0 && max !== undefined && max > 0) ||
        min !== undefined
      ) {
        rawValue = min as number;
      } else {
        rawValue = direction === 'up' ? 1 : -1;
      }
    } else {
      rawValue = direction === 'up' ? current + step : current - step;
    }

    const precision = Math.max(
      decimalPlaces(Number.isNaN(current) ? 0 : current),
      decimalPlaces(step),
    );
    const floatValue = parseFloat(rawValue.toFixed(precision));
    const newValue = clamp(floatValue, min ?? -Infinity, max ?? Infinity);

    this.setValue(newValue, event, direction);
  }

  @action
  handleStepperClick(direction: 'up' | 'down', event: MouseEvent) {
    this.handleStep(direction, event);
    this.args.onClick?.(event);
  }

  @action
  handleClick(event: MouseEvent) {
    this.args.onClick?.(event);
  }

  @action
  handleBlur(event: FocusEvent) {
    this.args.onBlur?.(event);
  }

  <template>
    <div class='cds--form-item' ...attributes>
      <div
        class='cds--number cds--number--helpertext
          {{if @readOnly "cds--number--readonly"}}
          {{if @light "cds--number--light"}}
          {{if @hideLabel "cds--number--nolabel"}}
          {{if @hideSteppers "cds--number--nosteppers"}}
          {{concat "cds--number--" (if @size @size "md")}}'
        data-invalid={{if this.isInvalid 'true'}}
      >
        {{#if @label}}
          <label
            for={{this.id}}
            class='cds--label {{if @disabled "cds--label--disabled"}} {{if @hideLabel "cds--visually-hidden"}}'
          >
            {{@label}}
          </label>
        {{/if}}
        <div
          class='cds--number__input-wrapper
            {{if this.isWarn "cds--number__input-wrapper--warning"}}'
        >
          <input
            id={{this.id}}
            type='number'
            data-invalid={{if this.isInvalid 'true'}}
            aria-invalid={{if this.isInvalid 'true'}}
            aria-readonly={{if @readOnly 'true'}}
            disabled={{@disabled}}
            readonly={{@readOnly}}
            min={{@min}}
            max={{@max}}
            step={{this.step}}
            value={{this.value}}
            {{on 'input' this.updateValue}}
            {{on 'click' this.handleClick}}
            {{on 'blur' this.handleBlur}}
          />
          {{#if this.isInvalid}}
            <WarningFilled @size='16' @svgClass='cds--number__invalid' />
          {{else if this.isWarn}}
            <WarningAltFilled
              @size='16'
              @svgClass='cds--number__invalid cds--number__invalid--warning'
            />
          {{/if}}
          {{#unless @hideSteppers}}
            <div class='cds--number__controls'>
              <button
                type='button'
                aria-label={{this.decrementLabel}}
                title={{this.decrementLabel}}
                class='cds--number__control-btn down-icon'
                disabled={{this.steppersDisabled}}
                tabindex='-1'
                {{on 'click' (fn this.handleStepperClick 'down')}}
              >
                <Subtract @size='16' @svgClass='down-icon' />
              </button>
              <div class='cds--number__rule-divider'></div>
              <button
                type='button'
                aria-label={{this.incrementLabel}}
                title={{this.incrementLabel}}
                class='cds--number__control-btn up-icon'
                disabled={{this.steppersDisabled}}
                tabindex='-1'
                {{on 'click' (fn this.handleStepperClick 'up')}}
              >
                <Add @size='16' @svgClass='up-icon' />
              </button>
              <div class='cds--number__rule-divider'></div>
            </div>
          {{/unless}}
        </div>
        {{#if this.isInvalid}}
          <div class='cds--form-requirement'>{{@invalidText}}</div>
        {{else if this.isWarn}}
          <div class='cds--form-requirement'>{{@warnText}}</div>
        {{else if @helperText}}
          <div
            class='cds--form__helper-text {{if @disabled "cds--form__helper-text--disabled"}}'
          >{{@helperText}}</div>
        {{/if}}
      </div>
    </div>
  </template>
}

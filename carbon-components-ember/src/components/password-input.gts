/**
 * Copyright IBM Corp. 2016, 2023
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
import { and } from 'ember-truth-helpers';
import { View, ViewOff, WarningFilled, WarningAltFilled } from '../icons.ts';
import Tooltip, { type TooltipAlignment } from './tooltip.gts';

export interface Signature {
  Args: {
    id?: string;
    labelText?: string;
    hideLabel?: boolean;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    type?: 'password' | 'text';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    readOnly?: boolean;
    inline?: boolean;
    invalid?: boolean;
    invalidText?: string;
    warn?: boolean;
    warnText?: string;
    helperText?: string;
    light?: boolean;
    hidePasswordLabel?: string;
    showPasswordLabel?: string;
    tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
    tooltipAlignment?: 'start' | 'center' | 'end';
    onChange?: (value: string, event: Event) => void;
    onClick?: (event: MouseEvent) => void;
    onTogglePasswordVisibility?: (event: MouseEvent) => void;
  };
  Element: HTMLDivElement;
}

export default class PasswordInput extends Component<Signature> {
  @tracked internalValue: string;
  @tracked passwordVisible: boolean;

  guid = guidFor(this);

  constructor(owner: any, args: Signature['Args']) {
    super(owner, args);
    this.internalValue = args.defaultValue ?? '';
    this.passwordVisible = (args.type ?? 'password') === 'text';
  }

  get value() {
    return this.args.value ?? this.internalValue;
  }

  get id() {
    return this.args.id ?? `password-input-${this.guid}`;
  }

  get inputType() {
    return this.passwordVisible ? 'text' : 'password';
  }

  get isInvalid() {
    return !!this.args.invalid;
  }

  get isWarn() {
    return this.isInvalid ? false : !!this.args.warn;
  }

  get hidePasswordLabel() {
    return this.args.hidePasswordLabel ?? 'Hide password';
  }

  get showPasswordLabel() {
    return this.args.showPasswordLabel ?? 'Show password';
  }

  get toggleLabel() {
    return this.passwordVisible ? this.hidePasswordLabel : this.showPasswordLabel;
  }

  get tooltipAlign(): TooltipAlignment {
    const position = this.args.tooltipPosition ?? 'bottom';
    const alignment = this.args.tooltipAlignment ?? 'end';
    if (position === 'top' || position === 'bottom') {
      return alignment === 'center' ? position : (`${position}-${alignment}` as TooltipAlignment);
    }
    return position;
  }

  @action
  updateValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.internalValue = value;
    this.args.onChange?.(value, event);
  }

  @action
  handleClick(event: MouseEvent) {
    this.args.onClick?.(event);
  }

  @action
  toggleVisibility(event: MouseEvent) {
    this.passwordVisible = !this.passwordVisible;
    this.args.onTogglePasswordVisibility?.(event);
  }

  <template>
    <div
      class='cds--form-item cds--text-input-wrapper cds--password-input-wrapper
        {{if @readOnly "cds--text-input-wrapper--readonly"}}
        {{if @light "cds--text-input-wrapper--light"}}
        {{if @inline "cds--text-input-wrapper--inline"}}
        {{if (and @inline this.isInvalid) "cds--text-input-wrapper--inline--invalid"}}'
      ...attributes
    >
      {{#if @labelText}}
        <label
          for={{this.id}}
          class='cds--label {{if @hideLabel "cds--visually-hidden"}}'
        >
          {{@labelText}}
        </label>
      {{/if}}
      <div
        class='cds--text-input__field-outer-wrapper
          {{if @inline "cds--text-input__field-outer-wrapper--inline"}}'
      >
        <div
          class='cds--text-input__field-wrapper
            {{if this.isWarn "cds--text-input__field-wrapper--warning"}}'
          data-invalid={{if this.isInvalid 'true'}}
        >
          {{#if this.isInvalid}}
            <WarningFilled @size='16' @svgClass='cds--text-input__invalid-icon' />
          {{else if this.isWarn}}
            <WarningAltFilled
              @size='16'
              @svgClass='cds--text-input__invalid-icon cds--text-input__invalid-icon--warning'
            />
          {{/if}}
          <input
            id={{this.id}}
            type={{this.inputType}}
            class='cds--text-input cds--password-input
              {{if @size (concat "cds--text-input--" @size)}}
              {{if @light "cds--text-input--light"}}
              {{if this.isInvalid "cds--text-input--invalid"}}
              {{if this.isWarn "cds--text-input--warning"}}'
            placeholder={{@placeholder}}
            disabled={{@disabled}}
            readonly={{@readOnly}}
            aria-invalid={{if this.isInvalid 'true'}}
            data-invalid={{if this.isInvalid 'true'}}
            data-toggle-password-visibility={{if this.passwordVisible 'false' 'true'}}
            value={{this.value}}
            {{on 'input' this.updateValue}}
            {{on 'click' this.handleClick}}
          />
          <Tooltip
            @label={{this.toggleLabel}}
            @align={{this.tooltipAlign}}
            class='cds--toggle-password-tooltip cds--icon-tooltip'
          >
            <button
              type='button'
              class='cds--text-input--password__visibility__toggle cds--btn cds--btn--icon-only cds--tooltip__trigger cds--tooltip--a11y'
              disabled={{@disabled}}
              {{on 'click' this.toggleVisibility}}
            >
              {{#if this.passwordVisible}}
                <ViewOff @size='16' @svgClass='cds--icon-visibility-off' />
              {{else}}
                <View @size='16' @svgClass='cds--icon-visibility-on' />
              {{/if}}
            </button>
          </Tooltip>
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

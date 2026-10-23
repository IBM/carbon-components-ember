/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { concat } from '@ember/helper';
import View from './icons/view.ts';
import ViewOff from './icons/view-off.ts';
import WarningFilled from './icons/warning-filled.ts';
import WarningAltFilled from './icons/warning-alt-filled.ts';
import Tooltip from './tooltip.gts';
import { FieldMessage, fieldState } from './-private/field.gts';
import type { TooltipAlignment } from './tooltip.gts';

export interface PasswordInputSignature {
  Args: {
    id?: string;
    labelText?: string;
    hideLabel?: boolean;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    type?: 'password' | 'text';
    size?: 'xs' | 'sm' | 'md' | 'lg';
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
    /**
     * Called with the `input` event on each change, as Carbon React's
     * `onChange`; the value is `event.target.value`.
     */
    onChange?: (event: Event & { target: HTMLInputElement }) => void;
    onTogglePasswordVisibility?: (event: MouseEvent) => void;
    /**
     * @internal Set by FluidTextInput, as Carbon React's `FormContext`: the
     * fluid style, with the invalid or warning text inside the field.
     */
    isFluid?: boolean;
  };
  Element: HTMLInputElement;
  Blocks: {
    /**
     * The label, in place of `@labelText`, when it's more than plain text,
     * such as formatted text or a required marker.
     */
    labelText: [];
  };
}

export default class PasswordInput extends Component<PasswordInputSignature> {
  @tracked internalValue: string;
  @tracked passwordVisible: boolean;

  guid = guidFor(this);

  constructor(owner: Owner, args: PasswordInputSignature['Args']) {
    super(owner, args);
    this.internalValue = args.defaultValue ?? '';
    this.passwordVisible = (args.type ?? 'password') === 'text';
  }

  get value() {
    return this.args.value ?? this.internalValue;
  }

  // Ember 7 writes a `value=""` attribute for an empty initial value; bind
  // `undefined` instead so the input renders like Carbon React (no attribute).
  get boundValue() {
    return this.value === '' ? undefined : this.value;
  }

  get id() {
    return this.args.id ?? `password-input-${this.guid}`;
  }

  get inputType() {
    return this.passwordVisible ? 'text' : 'password';
  }

  get field() {
    return fieldState(this.id, this.args);
  }

  get isInvalid() {
    return this.field.invalid;
  }

  get isWarn() {
    return this.field.warn;
  }

  // The invalid or warning text, else the helper text. Carbon React only
  // makes the invalid text the error message, which nothing announces.
  get describedBy() {
    if (this.isInvalid) return this.field.invalidId;
    if (this.isWarn) return this.field.warnId;
    return this.args.helperText ? this.field.helperId : undefined;
  }

  get hidePasswordLabel() {
    return this.args.hidePasswordLabel ?? 'Hide password';
  }

  get showPasswordLabel() {
    return this.args.showPasswordLabel ?? 'Show password';
  }

  get toggleLabel() {
    return this.passwordVisible
      ? this.hidePasswordLabel
      : this.showPasswordLabel;
  }

  get tooltipAlign(): TooltipAlignment {
    const position = this.args.tooltipPosition ?? 'bottom';
    const alignment = this.args.tooltipAlignment ?? 'end';
    if (position === 'top' || position === 'bottom') {
      return alignment === 'center' ? position : `${position}-${alignment}`;
    }
    return position;
  }

  updateValue = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    this.internalValue = value;
    this.args.onChange?.(event as Event & { target: HTMLInputElement });
  };

  toggleVisibility = (event: MouseEvent) => {
    this.passwordVisible = !this.passwordVisible;
    this.args.onTogglePasswordVisibility?.(event);
  };

  <template>
    <div
      class="cds--form-item cds--text-input-wrapper cds--password-input-wrapper
        {{if @readOnly 'cds--text-input-wrapper--readonly'}}
        {{if @light 'cds--text-input-wrapper--light'}}
        {{if @inline 'cds--text-input-wrapper--inline'}}
        {{if
          (and @inline this.isInvalid)
          'cds--text-input-wrapper--inline--invalid'
        }}
        {{if @size (concat 'cds--layout--size-' @size)}}
        {{if @isFluid 'cds--text-input--fluid'}}"
    >
      {{#if (or (has-block "labelText") @labelText)}}
        <label
          for={{this.id}}
          class="cds--label
            {{if @hideLabel 'cds--visually-hidden'}}
            {{if @disabled 'cds--label--disabled'}}"
        >
          {{#if (has-block "labelText")}}
            {{yield to="labelText"}}
          {{else}}
            {{@labelText}}
          {{/if}}
        </label>
      {{/if}}
      <div
        class="cds--text-input__field-outer-wrapper
          {{if @inline 'cds--text-input__field-outer-wrapper--inline'}}"
      >
        <div
          class="cds--text-input__field-wrapper
            {{if this.isWarn 'cds--text-input__field-wrapper--warning'}}"
          data-invalid={{if this.isInvalid "true"}}
        >
          {{#if this.isInvalid}}
            <WarningFilled
              @size="16"
              @svgClass="cds--text-input__invalid-icon"
            />
          {{else if this.isWarn}}
            <WarningAltFilled
              @size="16"
              @svgClass="cds--text-input__invalid-icon cds--text-input__invalid-icon--warning"
            />
          {{/if}}
          <input
            aria-describedby={{this.describedBy}}
            aria-errormessage={{if this.isInvalid this.field.invalidId}}
            ...attributes
            id={{this.id}}
            type={{this.inputType}}
            class="cds--text-input cds--password-input
              {{if @size (concat 'cds--text-input--' @size)}}
              {{if @light 'cds--text-input--light'}}
              {{if this.isInvalid 'cds--text-input--invalid'}}
              {{if this.isWarn 'cds--text-input--warning'}}"
            placeholder={{@placeholder}}
            disabled={{@disabled}}
            readonly={{@readOnly}}
            aria-invalid={{if this.isInvalid "true"}}
            data-invalid={{if this.isInvalid "true"}}
            data-toggle-password-visibility={{if
              this.passwordVisible
              "false"
              "true"
            }}
            value={{this.boundValue}}
            {{on "input" this.updateValue}}
          />
          {{#if @isFluid}}
            <hr class="cds--text-input__divider" />
          {{/if}}
          <Tooltip
            @label={{this.toggleLabel}}
            @align={{this.tooltipAlign}}
            class="cds--toggle-password-tooltip cds--icon-tooltip"
          >
            <button
              type="button"
              class="cds--text-input--password__visibility__toggle cds--btn cds--btn--icon-only cds--tooltip__trigger cds--tooltip--a11y"
              disabled={{@disabled}}
              {{on "click" this.toggleVisibility}}
            >
              {{#if this.passwordVisible}}
                <ViewOff @size="16" @svgClass="cds--icon-visibility-off" />
              {{else}}
                <View @size="16" @svgClass="cds--icon-visibility-on" />
              {{/if}}
            </button>
          </Tooltip>
          {{#if @isFluid}}
            <FieldMessage
              @field={{this.field}}
              @invalidText={{@invalidText}}
              @warnText={{@warnText}}
            />
          {{/if}}
        </div>
        {{#unless @isFluid}}
          <FieldMessage
            @field={{this.field}}
            @invalidText={{@invalidText}}
            @warnText={{@warnText}}
            @helperText={{@helperText}}
            @disabled={{@disabled}}
            @plainHelper={{true}}
          />
        {{/unless}}
      </div>
    </div>
  </template>
}

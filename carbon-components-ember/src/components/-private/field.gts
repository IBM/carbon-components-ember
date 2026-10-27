/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface FieldState {
  disabled: boolean;
  invalid: boolean;
  warn: boolean;
  invalidId: string;
  warnId: string;
  helperId: string;
}

/**
 * A form control's state, as Carbon React's `useNormalizedInputProps`
 * works it out: a read-only control is neither disabled, invalid nor
 * warning, a disabled one neither invalid nor warning, and invalid wins
 * over warn. The ids are for the texts `FieldMessage` renders, which the
 * control's `aria-*` attributes point at.
 */
export function fieldState(
  id: string,
  {
    disabled = false,
    readOnly = false,
    invalid = false,
    warn = false,
  }: {
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    warn?: boolean;
  },
): FieldState {
  return {
    disabled: !readOnly && disabled,
    invalid: !readOnly && !disabled && invalid,
    warn: !readOnly && !disabled && !invalid && warn,
    invalidId: `${id}-error-msg`,
    warnId: `${id}-warn-msg`,
    helperId: `${id}-helper-text`,
  };
}

/** The args that put a form control in an invalid or warning state. */
export interface FieldValidationArgs {
  /** Specify whether the control is currently invalid. */
  invalid?: boolean;
  /** Provide the text that is displayed when the control is in an invalid state. */
  invalidText?: string;
  /** Specify whether the control is currently in warning state. */
  warn?: boolean;
  /** Provide the text that is displayed when the control is in warning state. */
  warnText?: string;
}

/** The args for a form control's helper text and read-only state. */
export interface FieldHelperArgs {
  /**
   * Provide text that is used alongside the control label for additional
   * help.
   */
  helperText?: string;
  /** Whether the control can be read and focused, but not changed. */
  readOnly?: boolean;
}

/** The args for a form control's label. */
export interface FieldLabelArgs {
  /** The label's text, shown with the control and read by assistive technology. */
  labelText?: string;
  /**
   * Specify whether you want the label (`@labelText`, or a list box's
   * `@titleText`) to be visually hidden. Assistive technology still reads it.
   */
  hideLabel?: boolean;
}

export interface FieldMessageSignature {
  Args: Pick<FieldValidationArgs, 'invalidText' | 'warnText'> &
    Pick<FieldHelperArgs, 'helperText'> & {
      field: FieldState;
      /** Greys out the helper text. */
      disabled?: boolean;
      /** The invalid or warning text's role, as TextArea's `alert`. */
      role?: string;
      /** A plain helper text, without `dir`, as PasswordInput's in React. */
      plainHelper?: boolean;
    };
}

/**
 * The invalid or warning text, or else the helper text, each with its id
 * from `fieldState`, as Carbon React's `Text` divs.
 */
// eslint-disable-next-line ember/template-require-splattributes -- one of three texts; the control takes the attributes
export const FieldMessage: TOC<FieldMessageSignature> = <template>
  {{#if @field.invalid}}
    <div
      class="cds--form-requirement"
      id={{@field.invalidId}}
      role={{@role}}
      dir="auto"
    >{{@invalidText}}</div>
  {{else if @field.warn}}
    <div
      class="cds--form-requirement"
      id={{@field.warnId}}
      role={{@role}}
      dir="auto"
    >{{@warnText}}</div>
  {{else if @helperText}}
    <div
      id={{@field.helperId}}
      class="cds--form__helper-text
        {{if @disabled 'cds--form__helper-text--disabled'}}"
      dir={{unless @plainHelper "auto"}}
    >{{@helperText}}</div>
  {{/if}}
</template>;

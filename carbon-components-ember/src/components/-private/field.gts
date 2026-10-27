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

export interface FieldMessageSignature {
  Args: {
    field: FieldState;
    invalidText?: string;
    warnText?: string;
    helperText?: string;
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

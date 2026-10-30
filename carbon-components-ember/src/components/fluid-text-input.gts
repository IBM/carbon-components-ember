/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { concat } from '@ember/helper';
import PasswordInput from './password-input.gts';
import TextInput from './text-input.gts';
import type { TextInputSignature } from './text-input.gts';
import type { TOC } from '@ember/component/template-only';
import type {
  FieldValidationArgs,
  FieldHelperArgs,
  FieldLabelArgs,
} from './-private/field.gts';

export interface FluidTextInputSignature {
  Args: FieldValidationArgs &
    Pick<FieldHelperArgs, 'readOnly'> &
    Pick<FieldLabelArgs, 'labelText'> & {
      /**
       * Classes for the wrapper, or for the `<input>` with `@isPassword`, as
       * Carbon React's `className`.
       */
      className?: string;
      id?: string;
      value?: string;
      defaultValue?: string;
      placeholder?: string;
      disabled?: boolean;
      enableCounter?: boolean;
      maxCount?: number;
      isPassword?: boolean;
      showPasswordLabel?: string;
      hidePasswordLabel?: string;
      /**
       * Called with the `input` event on each change, as Carbon React's
       * `onChange`; the value is `event.target.value`.
       */
      onChange?: (event: Event & { target: HTMLInputElement }) => void;
      onTogglePasswordVisibility?: (event: MouseEvent) => void;
    };
  Blocks: {
    /**
     * The label, in place of `@labelText`, when it's more than plain text,
     * such as formatted text or a required marker.
     */
    labelText: [];
  };
  Element: TextInputSignature['Element'];
}

/**
 * Carbon React's FluidTextInput: a TextInput, or with `@isPassword` a
 * PasswordInput, in the fluid style.
 */
const FluidTextInput: TOC<FluidTextInputSignature> = <template>
  {{#if @isPassword}}
    {{#let
      (component
        PasswordInput
        isFluid=true
        id=@id
        labelText=@labelText
        value=@value
        defaultValue=@defaultValue
        placeholder=@placeholder
        disabled=@disabled
        readOnly=@readOnly
        invalid=@invalid
        invalidText=@invalidText
        warn=@warn
        warnText=@warnText
        showPasswordLabel=@showPasswordLabel
        hidePasswordLabel=@hidePasswordLabel
        onChange=@onChange
        onTogglePasswordVisibility=@onTogglePasswordVisibility
      )
      as |Input|
    }}
      {{! As Carbon React's FluidPasswordInput: the fluid class on the input. }}
      {{#if (has-block "labelText")}}
        <Input class="cds--text-input--fluid {{@className}}" ...attributes>
          <:labelText>{{yield to="labelText"}}</:labelText>
        </Input>
      {{else}}
        <Input class="cds--text-input--fluid {{@className}}" ...attributes />
      {{/if}}
    {{/let}}
  {{else}}
    {{#let
      (component
        TextInput
        isFluid=true
        className=(concat "cds--text-input--fluid " @className)
        id=@id
        labelText=@labelText
        value=@value
        defaultValue=@defaultValue
        placeholder=@placeholder
        disabled=@disabled
        readOnly=@readOnly
        invalid=@invalid
        invalidText=@invalidText
        warn=@warn
        warnText=@warnText
        enableCounter=@enableCounter
        maxCount=@maxCount
        onChange=@onChange
      )
      as |Input|
    }}
      {{#if (has-block "labelText")}}
        <Input ...attributes>
          <:labelText>{{yield to="labelText"}}</:labelText>
        </Input>
      {{else}}
        <Input ...attributes />
      {{/if}}
    {{/let}}
  {{/if}}
</template>;

export default FluidTextInput;

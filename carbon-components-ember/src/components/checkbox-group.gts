/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import AILabel from './ai-label.gts';
import Checkbox from './checkbox.gts';
import WarningAltFilled from './icons/warning-alt-filled.ts';
import WarningFilled from './icons/warning-filled.ts';
import { fieldState } from './-private/field.gts';
import legendId from '../modifiers/legend-id.ts';

import type { WithBoundArgs } from '@glint/template';
import type {
  FieldHelperArgs,
  FieldValidationArgs,
} from './-private/field.gts';
import type { FormGroupSignature } from './form-group.gts';

export interface CheckboxGroupSignature {
  Element: HTMLFieldSetElement;
  Args: FieldHelperArgs &
    FieldValidationArgs & {
      /** Specify whether the group, and so each checkbox in it, is disabled. */
      disabled?: boolean;
      legendId?: FormGroupSignature['Args']['legendId'];
      legendText: FormGroupSignature['Args']['legendText'];
      /** Provide the orientation for how the checkboxes should be displayed. */
      orientation?: 'horizontal' | 'vertical';
    };
  Blocks: {
    /**
     * The group's checkboxes. The yielded `Checkbox` gets the group's
     * `@invalid`, `@readOnly`, `@warn` and `@disabled`; one it is given its
     * own keeps it. A disabled group's fieldset disables its checkboxes
     * whatever they are given.
     */
    default: [
      Checkbox: WithBoundArgs<
        typeof Checkbox,
        'invalid' | 'readOnly' | 'warn' | 'disabled'
      >,
    ];
    /**
     * **Experimental:** an AI label, or any other decorator, shown after the
     * legend. Yields an `AILabel` already set up for it.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size' | 'kind'>];
  };
}

const ariaBoolean = (value?: boolean) =>
  value === undefined ? undefined : String(value);

export default class CheckboxGroup extends Component<CheckboxGroupSignature> {
  guid = guidFor(this);

  get field() {
    return fieldState(`checkbox-group-${this.guid}`, this.args);
  }

  get helperId() {
    return this.args.helperText
      ? `checkbox-group-helper-text-${this.guid}`
      : undefined;
  }

  get showHelper() {
    return !this.field.invalid && !this.field.warn && !!this.args.helperText;
  }

  get readOnlyLabel() {
    return ariaBoolean(this.args.readOnly);
  }

  get disabledLabel() {
    return ariaBoolean(this.args.disabled);
  }

  <template>
    {{! eslint-disable-next-line ember/template-no-unsupported-role-attributes -- aria-readonly is on Carbon React's fieldset }}
    <fieldset
      class="cds--checkbox-group
        {{if (eq @orientation 'horizontal') 'cds--checkbox-group--horizontal'}}
        {{if @readOnly 'cds--checkbox-group--readonly'}}
        {{if this.field.invalid 'cds--checkbox-group--invalid'}}
        {{if this.field.warn 'cds--checkbox-group--warning'}}
        {{if (has-block 'decorator') 'cds--checkbox-group--decorator'}}"
      disabled={{@disabled}}
      data-invalid={{if this.field.invalid "true"}}
      aria-labelledby={{@legendId}}
      aria-readonly={{this.readOnlyLabel}}
      aria-disabled={{this.disabledLabel}}
      aria-describedby={{if this.showHelper this.helperId}}
      ...attributes
      {{legendId @legendId}}
    >
      <legend class="cds--label" id={{@legendId}}>{{@legendText}}</legend>
      {{#if (has-block "decorator")}}
        <div class="cds--checkbox-group-inner--decorator">
          {{~yield
            (component AILabel size="mini" kind="default")
            to="decorator"
          ~}}
        </div>
      {{/if}}
      {{yield
        (component
          Checkbox
          invalid=this.field.invalid
          readOnly=@readOnly
          warn=this.field.warn
          disabled=@disabled
        )
      }}
      <div class="cds--checkbox-group__validation-msg">
        {{~#if this.field.invalid~}}
          <WarningFilled @svgClass="cds--checkbox__invalid-icon" />
          <div class="cds--form-requirement">{{@invalidText}}</div>
        {{~else if this.field.warn~}}
          <WarningAltFilled
            @svgClass="cds--checkbox__invalid-icon cds--checkbox__invalid-icon--warning"
          />
          <div class="cds--form-requirement">{{@warnText}}</div>
        {{~/if~}}
      </div>
      {{#if this.showHelper}}
        <div
          id={{this.helperId}}
          class="cds--form__helper-text"
        >{{@helperText}}</div>
      {{/if}}
    </fieldset>
  </template>
}

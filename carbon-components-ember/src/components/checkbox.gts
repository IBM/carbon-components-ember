/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import AILabel from './ai-label.gts';
import WarningAltFilled from './icons/warning-alt-filled.ts';
import WarningFilled from './icons/warning-filled.ts';
import indeterminate from '../modifiers/indeterminate.ts';
import { fieldState } from './-private/field.gts';
import type { WithBoundArgs } from '@glint/template';
import type {
  FieldHelperArgs,
  FieldLabelArgs,
  FieldValidationArgs,
} from './-private/field.gts';

export interface CheckboxSignature {
  Element: HTMLInputElement;
  Args: FieldLabelArgs &
    FieldHelperArgs &
    FieldValidationArgs & {
      /**
       * Classes for the wrapper, as Carbon React's `className`. `class` and
       * the other attributes go on the `<input>`.
       */
      className?: string;
      /** Specify whether the checkbox is checked. */
      checked?: boolean;
      /**
       * Specify whether the checkbox is checked when first rendered, leaving
       * the state to it afterwards.
       */
      defaultChecked?: boolean;
      /** Specify whether the Checkbox should be disabled */
      disabled?: boolean;
      /** Provide an `id` to uniquely identify the Checkbox input */
      id?: string;
      /** Specify whether the Checkbox is in an indeterminate state */
      indeterminate?: boolean;
      /**
       * Called with the `change` event, as Carbon React's `onChange`, and
       * the new checked state and the `<input>`'s id. A read-only checkbox
       * doesn't call it.
       */
      onChange?: (
        event: Event & { target: HTMLInputElement },
        data: { checked: boolean; id: string },
      ) => void;
      /** The label's tooltip. */
      title?: string;
    };
  Blocks: {
    /** The label's content, in place of `@labelText`. */
    default: [];
    /**
     * **Experimental:** an AI label, or any other decorator, shown after the
     * label. Yields an `AILabel` already set up for it; with
     * `@kind="inline"`, also pass `@size="md"`.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
  };
}

export default class Checkbox extends Component<CheckboxSignature> {
  guid = guidFor(this);

  #defaultChecked = this.args.defaultChecked;

  get id() {
    return this.args.id ?? `checkbox-${this.guid}`;
  }

  get field() {
    return fieldState(this.id, this.args);
  }

  get helperId() {
    return this.args.helperText
      ? `checkbox-helper-text-${this.guid}`
      : undefined;
  }

  get showHelper() {
    return !this.field.invalid && !this.field.warn && !!this.args.helperText;
  }

  get checked() {
    return this.args.checked ?? this.#defaultChecked;
  }

  // A read-only checkbox doesn't toggle or report a change, as in Carbon React.
  preventToggle = (event: MouseEvent) => {
    if (this.args.readOnly) event.preventDefault();
  };

  handleChange = (event: Event) => {
    if (this.args.readOnly) return;
    const input = event.target as HTMLInputElement;
    this.args.onChange?.(event as Event & { target: HTMLInputElement }, {
      checked: input.checked,
      id: this.id,
    });
  };

  <template>
    <div
      class="cds--form-item cds--checkbox-wrapper
        {{if @readOnly 'cds--checkbox-wrapper--readonly'}}
        {{if this.field.invalid 'cds--checkbox-wrapper--invalid'}}
        {{if this.field.warn 'cds--checkbox-wrapper--warning'}}
        {{if (has-block 'decorator') 'cds--checkbox-wrapper--decorator'}}
        {{@className}}"
    >
      <input
        disabled={{@disabled}}
        ...attributes
        type="checkbox"
        data-invalid={{if this.field.invalid "true"}}
        class="cds--checkbox"
        id={{this.id}}
        aria-readonly={{if @readOnly "true"}}
        checked={{this.checked}}
        {{indeterminate @indeterminate}}
        {{on "click" this.preventToggle}}
        {{on "change" this.handleChange}}
      />
      <label
        for={{this.id}}
        class="cds--checkbox-label"
        title={{if @title @title ""}}
      >
        <div
          class="cds--checkbox-label-text
            {{if @hideLabel 'cds--visually-hidden'}}"
          dir="auto"
        >
          {{~#if (has-block)~}}
            {{yield}}
          {{~else~}}
            {{@labelText}}
          {{~/if~}}
        </div>
      </label>
      {{#if (has-block "decorator")}}
        <div class="cds--checkbox-wrapper-inner--decorator">
          {{~yield (component AILabel size="mini") to="decorator"~}}
        </div>
      {{/if}}
      <div class="cds--checkbox__validation-msg">
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
    </div>
  </template>
}

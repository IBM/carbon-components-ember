/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface FormGroupSignature {
  Args: {
    /**
     * Specify whether the FormGroup should be disabled
     */
    disabled?: boolean;
    /**
     * Specify whether the FormGroup is invalid
     */
    invalid?: boolean;
    /**
     * Provide id for the fieldset legend which corresponds to the fieldset
     * `aria-labelledby`
     */
    legendId?: string;
    /**
     * Provide the text to be rendered inside of the fieldset legend
     */
    legendText: string;
    /**
     * Specify whether the message should be displayed in the FormGroup
     */
    message?: boolean;
    /**
     * Provide the text for the message in the FormGroup
     */
    messageText?: string;
  };
  Element: HTMLFieldSetElement;
  Blocks: {
    default: [];
  };
}

export default class FormGroup extends Component<FormGroupSignature> {
  <template>
    <fieldset
      class='cds--fieldset'
      disabled={{@disabled}}
      data-invalid={{if @invalid ''}}
      aria-labelledby={{@legendId}}
      ...attributes
    >
      <legend class='cds--label' id={{@legendId}}>{{@legendText}}</legend>
      {{yield}}
      {{#if @message}}
        <div class='cds--form__requirements'>{{@messageText}}</div>
      {{/if}}
    </fieldset>
  </template>
}

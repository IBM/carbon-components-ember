/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface FormLabelSignature {
  Element: HTMLLabelElement;
  Args: {
    /**
     * Provide a unique id for the given `FormLabel`. Used as the `for`
     * attribute so the label is associated with its form control.
     */
    id?: string;
  };
  Blocks: {
    /**
     * Specify the content of the form label
     */
    default: [];
  };
}

export default class FormLabel extends Component<FormLabelSignature> {
  <template>
    <label for={{@id}} class='cds--label cds--label--no-margin' ...attributes>
      {{yield}}
    </label>
  </template>
}

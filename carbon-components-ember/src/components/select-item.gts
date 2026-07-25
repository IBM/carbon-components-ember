/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface SelectItemSignature {
  Element: HTMLOptionElement;
  Args: {
    /**
     * Specify the value of the <SelectItem>
     */
    value: string;
    /**
     * Provide the contents of your <SelectItem>
     */
    text: string;
    /**
     * Specify whether the <SelectItem> should be disabled
     */
    disabled?: boolean;
    /**
     * Specify whether the <SelectItem> is hidden
     */
    hidden?: boolean;
  };
}

export default class SelectItem extends Component<SelectItemSignature> {
  <template>
    <option
      class='cds--select-option'
      value={{@value}}
      disabled={{@disabled}}
      hidden={{@hidden}}
      ...attributes
    >{{@text}}</option>
  </template>
}

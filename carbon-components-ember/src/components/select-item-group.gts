/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface SelectItemGroupSignature {
  Element: HTMLOptGroupElement;
  Args: {
    /**
     * Specify the label to be displayed
     */
    label: string;
    /**
     * Specify whether the SelectItemGroup should be disabled
     */
    disabled?: boolean;
  };
  Blocks: {
    default: [];
  };
}

export default class SelectItemGroup extends Component<SelectItemGroupSignature> {
  <template>
    <optgroup
      class='cds--select-optgroup'
      label={{@label}}
      disabled={{@disabled}}
      ...attributes
    >
      {{yield}}
    </optgroup>
  </template>
}

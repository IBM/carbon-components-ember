/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface FormItemSignature {
  Element: HTMLDivElement;
  Blocks: {
    /**
     * Specify the content of the form item
     */
    default: [];
  };
}

export default class FormItem extends Component<FormItemSignature> {
  <template>
    <div class='cds--form-item' ...attributes>
      {{yield}}
    </div>
  </template>
}

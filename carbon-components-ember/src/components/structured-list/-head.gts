/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface StructuredListHeadSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class StructuredListHead extends Component<StructuredListHeadSignature> {
  <template>
    <div role='rowgroup' class='cds--structured-list-thead' ...attributes>
      {{yield}}
    </div>
  </template>
}

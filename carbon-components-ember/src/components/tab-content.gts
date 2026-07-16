/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface TabContentSignature {
  Element: HTMLDivElement;
  Args: {
    selected?: boolean;
  };
  Blocks: {
    default: [];
  };
}

export default class TabContent extends Component<TabContentSignature> {
  get isHidden() {
    return !this.args.selected;
  }

  <template>
    <div
      class='cds--tab-content'
      role='tabpanel'
      hidden={{this.isHidden}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

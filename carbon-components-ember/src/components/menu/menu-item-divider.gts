/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface MenuItemDividerSignature {
  Element: HTMLLIElement;
}

export default class MenuItemDivider extends Component<MenuItemDividerSignature> {
  <template>
    <li class='cds--menu-item-divider' role='separator' ...attributes></li>
  </template>
}

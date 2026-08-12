/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface MenuItemGroupSignature {
  Element: HTMLLIElement;
  Args: {
    /**
     * A required label titling this group.
     */
    label: string;
  };
  Blocks: {
    default: [];
  };
}

export default class MenuItemGroup extends Component<MenuItemGroupSignature> {
  <template>
    <li class='cds--menu-item-group' role='none' ...attributes>
      <ul role='group' aria-label={{@label}}>
        {{yield}}
      </ul>
    </li>
  </template>
}

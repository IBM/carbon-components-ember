/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface MenuItemGroupSignature {
  Element: HTMLUListElement;
  Args: {
    /**
     * Classes for the `<li>`, as Carbon React's `className`. `class` and the
     * other attributes go on the group's `<ul>`.
     */
    className?: string;
    /**
     * A required label titling this group.
     */
    label: string;
  };
  Blocks: {
    default: [];
  };
}

const MenuItemGroup: TOC<MenuItemGroupSignature> = <template>
  <li class="cds--menu-item-group {{@className}}" role="none">
    <ul role="group" aria-label={{@label}} ...attributes>
      {{yield}}
    </ul>
  </li>
</template>;

export default MenuItemGroup;

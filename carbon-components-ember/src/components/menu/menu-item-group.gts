/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

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

const MenuItemGroup: TOC<MenuItemGroupSignature> = <template>
  <li class="cds--menu-item-group" role="none" ...attributes>
    <ul role="group" aria-label={{@label}}>
      {{yield}}
    </ul>
  </li>
</template>;

export default MenuItemGroup;

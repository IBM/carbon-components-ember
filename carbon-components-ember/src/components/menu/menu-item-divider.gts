/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface MenuItemDividerSignature {
  Element: HTMLLIElement;
}

const MenuItemDivider: TOC<MenuItemDividerSignature> = <template>
  <li class="cds--menu-item-divider" role="separator" ...attributes></li>
</template>;

export default MenuItemDivider;

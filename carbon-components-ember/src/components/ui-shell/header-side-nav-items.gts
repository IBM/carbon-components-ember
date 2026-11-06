/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface HeaderSideNavItemsSignature {
  Element: HTMLUListElement;
  Args: {
    /** Draws a line under them, between them and the side nav's own items. */
    hasDivider?: boolean;
  };
  Blocks: {
    /** `HeaderMenuItem`s and `HeaderMenu`s. */
    default: [];
  };
}

/**
 * The `Header`'s links, repeated in the `SideNav` for widths where
 * `HeaderNavigation` is hidden.
 */
const HeaderSideNavItems: TOC<HeaderSideNavItemsSignature> = <template>
  <ul
    ...attributes
    class="cds--side-nav__header-navigation
      {{if @hasDivider 'cds--side-nav__header-divider'}}"
  >
    {{~yield~}}
  </ul>
</template>;

export default HeaderSideNavItems;

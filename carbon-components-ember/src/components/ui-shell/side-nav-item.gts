/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface SideNavItemSignature {
  Element: HTMLLIElement;
  Args: {
    /** Makes it taller, for a label that wraps. */
    large?: boolean;
  };
  Blocks: {
    default: [];
  };
}

/** An item of `SideNavItems`, for content other than a link or a menu. */
const SideNavItem: TOC<SideNavItemSignature> = <template>
  <li
    ...attributes
    class="cds--side-nav__item {{if @large 'cds--side-nav__item--large'}}"
  >
    {{~yield~}}
  </li>
</template>;

export default SideNavItem;

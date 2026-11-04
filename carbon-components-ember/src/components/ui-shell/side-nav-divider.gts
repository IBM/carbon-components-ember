/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface SideNavDividerSignature {
  Element: HTMLLIElement;
}

/** A line between groups of `SideNavItems`. */
const SideNavDivider: TOC<SideNavDividerSignature> = <template>
  <li ...attributes class="cds--side-nav__divider">
    <hr />
  </li>
</template>;

export default SideNavDivider;

/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface SideNavIconSignature {
  Element: HTMLDivElement;
  Args: {
    /** Sizes it for a 16px icon. */
    small?: boolean;
  };
  Blocks: {
    /** The icon. */
    default: [];
  };
}

/** Holds an icon in the `SideNav`. */
const SideNavIcon: TOC<SideNavIconSignature> = <template>
  <div
    ...attributes
    class="cds--side-nav__icon {{if @small 'cds--side-nav__icon--small'}}"
  >
    {{~yield~}}
  </div>
</template>;

export default SideNavIcon;

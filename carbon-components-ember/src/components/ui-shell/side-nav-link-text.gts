/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface SideNavLinkTextSignature {
  Element: HTMLSpanElement;
  Blocks: {
    default: [];
  };
}

/** The label of a side nav link, truncated to its width. */
const SideNavLinkText: TOC<SideNavLinkTextSignature> = <template>
  <span ...attributes class="cds--side-nav__link-text">{{yield}}</span>
</template>;

export default SideNavLinkText;

/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface HeaderNavigationSignature {
  Element: HTMLElement;
  Blocks: {
    /** `HeaderMenuItem`s and `HeaderMenu`s. */
    default: [];
  };
}

/** The `Header`'s links. Name it with `aria-label`. */
const HeaderNavigation: TOC<HeaderNavigationSignature> = <template>
  <nav ...attributes class="cds--header__nav">
    <ul class="cds--header__menu-bar">
      {{yield}}
    </ul>
  </nav>
</template>;

export default HeaderNavigation;

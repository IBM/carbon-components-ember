/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface HeaderSignature {
  Element: HTMLElement;
  Blocks: {
    default: [];
  };
}

/**
 * The UI Shell's top bar. Name it with `aria-label`, and put its parts in
 * it: `SkipToContent`, `HeaderMenuButton`, `HeaderName`, `HeaderNavigation`,
 * `HeaderGlobalBar`, `HeaderPanel` and the `SideNav`.
 */
const Header: TOC<HeaderSignature> = <template>
  <header ...attributes class="cds--header">
    {{~yield~}}
  </header>
</template>;

export default Header;

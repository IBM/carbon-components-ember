/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface SwitcherDividerSignature {
  Element: HTMLHRElement;
}

/** A line between groups of `SwitcherItem`s. */
const SwitcherDivider: TOC<SwitcherDividerSignature> = <template>
  <li>
    <hr ...attributes class="cds--switcher__item--divider" />
  </li>
</template>;

export default SwitcherDivider;

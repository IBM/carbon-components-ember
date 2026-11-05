/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface HeaderGlobalBarSignature {
  Element: HTMLDivElement;
  Blocks: {
    /** `HeaderGlobalAction`s. */
    default: [];
  };
}

/** The `Header`'s actions, at its end. */
const HeaderGlobalBar: TOC<HeaderGlobalBarSignature> = <template>
  <div ...attributes class="cds--header__global">
    {{yield}}
  </div>
</template>;

export default HeaderGlobalBar;

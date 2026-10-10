/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface ToggleSkeletonSignature {
  Element: HTMLDivElement;
}

/** A loading placeholder for a `Toggle`. */
const ToggleSkeleton: TOC<ToggleSkeletonSignature> = <template>
  <div class="cds--toggle cds--toggle--skeleton" ...attributes>
    <div class="cds--toggle__skeleton-circle"></div>
    <div class="cds--toggle__skeleton-rectangle"></div>
  </div>
</template>;

export default ToggleSkeleton;

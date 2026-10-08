/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface CheckboxSkeletonSignature {
  Element: HTMLDivElement;
}

/** A loading placeholder for a `Checkbox`. */
const CheckboxSkeleton: TOC<CheckboxSkeletonSignature> = <template>
  <div
    class="cds--form-item cds--checkbox-wrapper cds--checkbox-skeleton"
    ...attributes
  >
    <div class="cds--checkbox-label">
      <span class="cds--checkbox-label-text cds--skeleton"></span>
    </div>
  </div>
</template>;

export default CheckboxSkeleton;

/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface FluidTextInputSkeletonSignature {
  Element: HTMLDivElement;
}

/** A loading placeholder for a `FluidTextInput`. */
const FluidTextInputSkeleton: TOC<FluidTextInputSkeletonSignature> = <template>
  <div class="cds--form-item cds--text-input--fluid__skeleton" ...attributes>
    <span class="cds--label cds--skeleton"></span>
    <div class="cds--skeleton cds--text-input"></div>
  </div>
</template>;

export default FluidTextInputSkeleton;

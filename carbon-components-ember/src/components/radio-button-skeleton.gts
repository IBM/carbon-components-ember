/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface RadioButtonSkeletonSignature {
  Element: HTMLDivElement;
}

/** A loading placeholder for a `RadioButton`. */
const RadioButtonSkeleton: TOC<RadioButtonSkeletonSignature> = <template>
  <div class="cds--radio-button-wrapper" ...attributes>
    <div class="cds--radio-button cds--skeleton"></div>
    <span class="cds--radio-button__label cds--skeleton"></span>
  </div>
</template>;

export default RadioButtonSkeleton;

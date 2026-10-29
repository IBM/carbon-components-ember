/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import { concat } from '@ember/helper';
import type { NumberInputSignature } from './number-input.gts';

export interface NumberInputSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    /** Leaves out the label placeholder. */
    hideLabel?: boolean;
    size?: NumberInputSignature['Args']['size'];
  };
}

/** A loading placeholder for a `NumberInput`. */
const NumberInputSkeleton: TOC<NumberInputSkeletonSignature> = <template>
  <div class="cds--form-item" ...attributes>
    {{#unless @hideLabel}}
      <span class="cds--label cds--skeleton"></span>
    {{/unless}}
    <div
      class="cds--number cds--skeleton
        {{if @size (concat 'cds--number--' @size ' cds--layout--size-' @size)}}"
    ></div>
  </div>
</template>;

export default NumberInputSkeleton;

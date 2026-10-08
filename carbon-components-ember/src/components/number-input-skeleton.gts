/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface NumberInputSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    /** Leaves out the label placeholder. */
    hideLabel?: boolean;
    /** Defaults to `md`. */
    size?: 'sm' | 'md' | 'lg';
  };
}

/** A loading placeholder for a `NumberInput`. */
const NumberInputSkeleton: TOC<NumberInputSkeletonSignature> = <template>
  <div class="cds--form-item" ...attributes>
    {{#unless @hideLabel}}
      <span class="cds--label cds--skeleton"></span>
    {{/unless}}
    <div
      class="cds--number cds--skeleton cds--number--{{if @size @size 'md'}}"
    ></div>
  </div>
</template>;

export default NumberInputSkeleton;

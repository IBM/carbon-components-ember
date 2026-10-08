/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface SelectSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    /** Leaves out the label placeholder. */
    hideLabel?: boolean;
  };
}

/** A loading placeholder for a `Select`. */
const SelectSkeleton: TOC<SelectSkeletonSignature> = <template>
  <div class="cds--form-item" ...attributes>
    {{#unless @hideLabel}}
      <span class="cds--label cds--skeleton"></span>
    {{/unless}}
    <div class="cds--select cds--skeleton">
      <div class="cds--select-input"></div>
    </div>
  </div>
</template>;

export default SelectSkeleton;

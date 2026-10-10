/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { concat } from '@ember/helper';

import type { TOC } from '@ember/component/template-only';

export interface DropdownSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    /** Leaves out the label placeholder. */
    hideLabel?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
  };
}

/** A loading placeholder for a `Dropdown`. */
const DropdownSkeleton: TOC<DropdownSkeletonSignature> = <template>
  <div class="cds--skeleton cds--form-item" ...attributes>
    {{#unless @hideLabel}}
      <span class="cds--label cds--skeleton"></span>
    {{/unless}}
    <div
      class="cds--skeleton cds--dropdown
        {{if @size (concat 'cds--list-box--' @size)}}"
    ></div>
  </div>
</template>;

export default DropdownSkeleton;

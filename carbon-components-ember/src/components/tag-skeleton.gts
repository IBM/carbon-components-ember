/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { concat } from '@ember/helper';

import type { TOC } from '@ember/component/template-only';

export interface TagSkeletonSignature {
  Element: HTMLSpanElement;
  Args: {
    size?: 'sm' | 'md' | 'lg';
  };
}

/** A loading placeholder for a `Tag`. */
const TagSkeleton: TOC<TagSkeletonSignature> = <template>
  <span
    class="cds--tag cds--skeleton
      {{if @size (concat 'cds--tag--' @size ' cds--layout--size-' @size)}}"
    ...attributes
  ></span>
</template>;

export default TagSkeleton;

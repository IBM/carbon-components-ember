/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import SkeletonText from './skeleton-text.gts';

import type { TOC } from '@ember/component/template-only';

export interface PaginationSkeletonSignature {
  Element: HTMLDivElement;
}

/** A loading placeholder for a `Pagination` bar. */
const PaginationSkeleton: TOC<PaginationSkeletonSignature> = <template>
  <div class="cds--pagination cds--skeleton" ...attributes>
    <div class="cds--pagination__left">
      <SkeletonText @width="70px" />
      <SkeletonText @width="35px" />
      <SkeletonText @width="105px" />
    </div>
    <div class="cds--pagination__right cds--pagination--inline">
      <SkeletonText @width="70px" />
    </div>
  </div>
</template>;

export default PaginationSkeleton;

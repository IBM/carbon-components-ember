/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { concat } from '@ember/helper';

import type { TOC } from '@ember/component/template-only';

export interface SearchSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    size?: 'xs' | 'sm' | 'md' | 'lg';
  };
}

/**
 * A loading placeholder for a `Search` field. A `Search` that's already
 * rendered can show `@isLoading` instead.
 */
const SearchSkeleton: TOC<SearchSkeletonSignature> = <template>
  <div
    class="cds--skeleton {{if @size (concat 'cds--layout--size-' @size)}}"
    ...attributes
  >
    <div class="cds--search-input"></div>
  </div>
</template>;

export default SearchSkeleton;

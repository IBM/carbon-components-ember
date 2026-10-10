/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import SkeletonPlaceholder from './skeleton-placeholder.gts';

import type { TOC } from '@ember/component/template-only';
import type { SkeletonPlaceholderSignature } from './skeleton-placeholder.gts';

export interface AISkeletonPlaceholderSignature {
  Element: SkeletonPlaceholderSignature['Element'];
}

/** A `SkeletonPlaceholder` for content that AI is generating. */
const AISkeletonPlaceholder: TOC<AISkeletonPlaceholderSignature> = <template>
  <SkeletonPlaceholder class="cds--skeleton__placeholder--ai" ...attributes />
</template>;

export default AISkeletonPlaceholder;

/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import SkeletonIcon from './skeleton-icon.gts';

import type { TOC } from '@ember/component/template-only';
import type { SkeletonIconSignature } from './skeleton-icon.gts';

export interface AISkeletonIconSignature {
  Element: SkeletonIconSignature['Element'];
}

/** A `SkeletonIcon` for content that AI is generating. */
const AISkeletonIcon: TOC<AISkeletonIconSignature> = <template>
  <SkeletonIcon class="cds--skeleton__icon--ai" ...attributes />
</template>;

export default AISkeletonIcon;

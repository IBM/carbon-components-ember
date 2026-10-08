/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import SkeletonText from './skeleton-text.gts';

import type { TOC } from '@ember/component/template-only';
import type { SkeletonTextSignature } from './skeleton-text.gts';

export interface AISkeletonTextSignature {
  Element: SkeletonTextSignature['Element'];
  Args: SkeletonTextSignature['Args'];
}

/** A `SkeletonText` for text that AI is generating. */
const AISkeletonText: TOC<AISkeletonTextSignature> = <template>
  <SkeletonText
    @heading={{@heading}}
    @lineCount={{@lineCount}}
    @paragraph={{@paragraph}}
    @width={{@width}}
    class="cds--skeleton__text--ai"
    ...attributes
  />
</template>;

export default AISkeletonText;

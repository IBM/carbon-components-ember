/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import SkeletonText from '../skeleton-text.gts';
import type { TOC } from '@ember/component/template-only';

export interface FileUploaderSkeletonSignature {
  Element: HTMLDivElement;
}

/** A placeholder shown while a `FileUploader`'s surrounding data is loading. */
const FileUploaderSkeleton: TOC<FileUploaderSkeletonSignature> = <template>
  <div class="cds--form-item" ...attributes>
    <SkeletonText @heading={{true}} @width="100px" />
    <SkeletonText @width="225px" class="cds--label-description" />
    <div class="cds--skeleton cds--btn cds--btn--lg cds--layout--size-lg"></div>
  </div>
</template>;

export default FileUploaderSkeleton;

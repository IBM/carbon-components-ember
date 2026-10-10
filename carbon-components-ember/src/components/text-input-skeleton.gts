/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { concat } from '@ember/helper';

import type { TOC } from '@ember/component/template-only';

export interface TextInputSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    /** Leaves out the label placeholder. */
    hideLabel?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
  };
}

/** A loading placeholder for a `TextInput`. */
const TextInputSkeleton: TOC<TextInputSkeletonSignature> = <template>
  <div
    class="cds--form-item {{if @size (concat 'cds--layout--size-' @size)}}"
    ...attributes
  >
    {{#unless @hideLabel}}
      <span class="cds--label cds--skeleton"></span>
    {{/unless}}
    <div class="cds--skeleton cds--text-input"></div>
  </div>
</template>;

export default TextInputSkeleton;

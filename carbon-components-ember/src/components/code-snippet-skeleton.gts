/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface CodeSnippetSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    /** `single` (the default) shows one line; `multi` shows three. */
    type?: 'single' | 'multi';
  };
}

/** A loading placeholder for a `CodeSnippet`. */
const CodeSnippetSkeleton: TOC<CodeSnippetSkeletonSignature> = <template>
  <div
    class="cds--snippet cds--skeleton
      {{if (eq @type 'multi') 'cds--snippet--multi' 'cds--snippet--single'}}"
    ...attributes
  >
    <div class="cds--snippet-container">
      <span></span>
      {{#if (eq @type "multi")}}
        <span></span>
        <span></span>
      {{/if}}
    </div>
  </div>
</template>;

export default CodeSnippetSkeleton;

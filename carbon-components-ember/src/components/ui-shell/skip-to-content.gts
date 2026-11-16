/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface SkipToContentSignature {
  Element: HTMLAnchorElement;
  Blocks: {
    /** The link's text. Defaults to "Skip to main content". */
    default: [];
  };
}

/**
 * The `Header`'s first link, shown only while focused, to `#main-content`:
 * give the `Content` that `id`, or the link another `href`.
 */
const SkipToContent: TOC<SkipToContentSignature> = <template>
  <a
    href="#main-content"
    tabindex="0"
    ...attributes
    class="cds--skip-to-content"
  >
    {{~#if (has-block)}}{{yield}}{{else}}Skip to main content{{/if~}}
  </a>
</template>;

export default SkipToContent;

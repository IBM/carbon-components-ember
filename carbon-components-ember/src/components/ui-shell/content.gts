/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface ContentSignature {
  Element: HTMLElement;
  Args: {
    /** The element to render. Defaults to `main`. */
    tagName?: keyof HTMLElementTagNameMap;
  };
  Blocks: {
    default: [];
  };
}

/**
 * The page's content, beside the UI Shell's `Header` and `SideNav`. Give it
 * `id="main-content"` for `SkipToContent`.
 */
const Content: TOC<ContentSignature> = <template>
  {{#let (element (if @tagName @tagName "main")) as |Tag|}}
    <Tag ...attributes class="cds--content">
      {{yield}}
    </Tag>
  {{/let}}
</template>;

export default Content;

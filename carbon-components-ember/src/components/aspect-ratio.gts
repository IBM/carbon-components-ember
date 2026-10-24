/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface AspectRatioSignature {
  Element: HTMLElement;
  Args: {
    /** The element to render. Defaults to `div`. */
    as?: keyof HTMLElementTagNameMap;
    /** The width to height ratio. Defaults to `1x1`. */
    ratio?:
      '1x1' | '2x3' | '3x2' | '3x4' | '4x3' | '1x2' | '2x1' | '9x16' | '16x9';
  };
  Blocks: {
    default: [];
  };
}

/**
 * Keeps its content at a fixed width to height ratio, whatever its width.
 */
const AspectRatio: TOC<AspectRatioSignature> = <template>
  {{#let (element (or @as "div")) as |Tag|}}
    <Tag
      class="cds--aspect-ratio cds--aspect-ratio--{{or @ratio '1x1'}}"
      ...attributes
    >{{yield}}</Tag>
  {{/let}}
</template>;

export default AspectRatio;

/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface CardFooterSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * @internal Bound by `Card`: a clickable card has a footer of its own,
     * so this renders nothing in one.
     */
    clickable?: boolean;
  };
  Blocks: {
    default: [];
  };
}

/**
 * The footer of a `Card`. With `Action`s in it, it lays them out as a row
 * of buttons along the card's bottom edge. A clickable card renders its own
 * footer instead, and none of this one.
 */
const CardFooter: TOC<CardFooterSignature> = <template>
  {{#unless @clickable}}
    <div class="cds--card__footer" ...attributes>{{yield}}</div>
  {{/unless}}
</template>;

export default CardFooter;

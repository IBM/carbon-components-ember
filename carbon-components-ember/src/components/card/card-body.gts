/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface CardBodySignature {
  Element: HTMLDivElement;
  Args: {
    /** Drops the body's padding, so its content reaches the card's edges. */
    isFlush?: boolean;
  };
  Blocks: {
    default: [];
  };
}

/** The body of a `Card`, for any content. */
const CardBody: TOC<CardBodySignature> = <template>
  <div
    class="cds--card__body {{if @isFlush 'cds--card__body--flush'}}"
    ...attributes
  >{{yield}}</div>
</template>;

export default CardBody;

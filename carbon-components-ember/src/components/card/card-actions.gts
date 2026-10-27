/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface CardActionsSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

/**
 * The buttons in a `Card`'s header, each in an `Action`, in its top
 * corner.
 */
const CardActions: TOC<CardActionsSignature> = <template>
  <div class="cds--card__actions" ...attributes>{{yield}}</div>
</template>;

export default CardActions;

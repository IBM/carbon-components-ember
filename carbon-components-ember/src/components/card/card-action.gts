/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface CardActionSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

/**
 * Holds one button in a `Card`'s header `Actions` or its footer. Don't put
 * one in a clickable card, which shouldn't hold controls.
 */
const CardAction: TOC<CardActionSignature> = <template>
  <div class="cds--card__action" ...attributes>{{yield}}</div>
</template>;

export default CardAction;

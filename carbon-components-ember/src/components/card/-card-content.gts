/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface CardContentSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

/**
 * A horizontal card's header, body and footer, beside its media. Carbon
 * React's `Card` wraps them itself, sorting its children.
 */
const CardContent: TOC<CardContentSignature> = <template>
  <div class="cds--card__content" ...attributes>{{yield}}</div>
</template>;

export default CardContent;

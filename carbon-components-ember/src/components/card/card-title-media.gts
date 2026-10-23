/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface CardTitleMediaSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

/**
 * Media beside a `Card`'s title, in its header, between 48 and 64 pixels
 * high, aligned with the title's first line.
 */
const CardTitleMedia: TOC<CardTitleMediaSignature> = <template>
  <div class="cds--card__title-media" ...attributes>{{yield}}</div>
</template>;

export default CardTitleMedia;

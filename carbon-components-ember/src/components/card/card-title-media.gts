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
 * Media beside a `Card`'s title, between 48 and 64 pixels high, aligned
 * with the title's first line. `Title`'s `<:titleMedia>` block renders this
 * wrapper itself, so put media straight in the block instead.
 */
const CardTitleMedia: TOC<CardTitleMediaSignature> = <template>
  <div class="cds--card__title-media" ...attributes>{{yield}}</div>
</template>;

export default CardTitleMedia;

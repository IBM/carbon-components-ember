/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface CardHeaderMediaSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

/** An icon or avatar above a `Card`'s title, in its header. */
const CardHeaderMedia: TOC<CardHeaderMediaSignature> = <template>
  <div class="cds--card__header-media" ...attributes>{{yield}}</div>
</template>;

export default CardHeaderMedia;

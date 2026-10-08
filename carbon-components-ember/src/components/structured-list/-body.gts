/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface StructuredListBodySignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

const StructuredListBody: TOC<StructuredListBodySignature> = <template>
  <div role="rowgroup" class="cds--structured-list-tbody" ...attributes>
    {{yield}}
  </div>
</template>;

export default StructuredListBody;

import type { TOC } from '@ember/component/template-only';
/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface StructuredListHeadSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

const StructuredListHead: TOC<StructuredListHeadSignature> = <template>
  <div role="rowgroup" class="cds--structured-list-thead" ...attributes>
    {{yield}}
  </div>
</template>;

export default StructuredListHead;

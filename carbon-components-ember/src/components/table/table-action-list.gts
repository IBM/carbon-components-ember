/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface TableActionListSignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

/** The row of actions in a `TableBatchActions`, as Carbon React's `TableActionList`. */
const TableActionList: TOC<TableActionListSignature> = <template>
  <div class="cds--action-list" ...attributes>{{yield}}</div>
</template>;

export default TableActionList;

/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface TableRowSignature {
  Element: HTMLTableRowElement;
  Args: {
    /** Styles the row as selected. */
    isSelected?: boolean;
  };
  Blocks: {
    default: [];
  };
}

/** A row of a `TableHead` or `TableBody`, as Carbon React's `TableRow`. */
const TableRow: TOC<TableRowSignature> = <template>
  <tr
    class={{if @isSelected "cds--data-table--selected"}}
    ...attributes
  >{{yield}}</tr>
</template>;

export default TableRow;

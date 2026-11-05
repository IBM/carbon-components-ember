/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';

export interface TableCellSignature {
  Element: HTMLTableCellElement;
  Args: {
    /** How many columns the cell spans. */
    colSpan?: number;
    /** The `id` of the matching `TableHeader`. */
    headers?: string;
    /** Marks the cell as in an AI column. */
    hasAILabelHeader?: boolean;
  };
  Blocks: {
    default: [];
  };
}

/** A cell of a `TableRow`, as Carbon React's `TableCell`. */
const TableCell: TOC<TableCellSignature> = <template>
  <td
    class={{if @hasAILabelHeader "cds--table-cell--column-slug"}}
    colspan={{@colSpan}}
    headers={{@headers}}
    ...attributes
  >{{yield}}</td>
</template>;

export default TableCell;

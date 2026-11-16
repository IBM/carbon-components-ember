/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import InlineCheckbox from '../inline-checkbox.gts';

export interface TableSelectAllSignature {
  Element: HTMLTableCellElement;
  Args: {
    /**
     * Names the checkbox: Carbon React's `aria-label`. Defaults to `Select
     * all rows in the table`.
     */
    ariaLabel?: string;
    /** Whether every row is selected. */
    checked?: boolean;
    disabled?: boolean;
    /** The `id` of the checkbox. */
    id: string;
    /** Whether only some of the rows are selected. */
    indeterminate?: boolean;
    /** The `name` of the checkbox. */
    name: string;
    /** Called with the `click` event when a user clicks the checkbox. */
    onSelect: (event: MouseEvent) => void;
  };
}

/**
 * The header cell that selects every row, as Carbon React's
 * `TableSelectAll`. `class` and the other attributes go on the `<th>`.
 */
const TableSelectAll: TOC<TableSelectAllSignature> = <template>
  <th
    aria-live="off"
    scope="col"
    class="cds--table-column-checkbox"
    ...attributes
  >
    <InlineCheckbox
      @ariaLabel={{if @ariaLabel @ariaLabel "Select all rows in the table"}}
      @checked={{@checked}}
      @id={{@id}}
      @indeterminate={{@indeterminate}}
      @name={{@name}}
      @onClick={{@onSelect}}
      @disabled={{@disabled}}
    />
  </th>
</template>;

export default TableSelectAll;

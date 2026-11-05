/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';
import AILabel from '../ai-label.gts';

export interface TableDecoratorRowSignature {
  Element: HTMLTableCellElement;
  Blocks: {
    /**
     * **Experimental:** an AI label, or any other decorator, in the row's
     * first cell. Yields an `AILabel` already set up for it.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
  };
}

/**
 * The cell of a row that holds its AI label or other decorator, as Carbon
 * React's `TableDecoratorRow`. Carbon React's deprecated `TableSlugRow` has
 * no counterpart here. `TableExpandRow` renders this cell itself from its
 * own `decorator` block.
 */
const TableDecoratorRow: TOC<TableDecoratorRowSignature> = <template>
  <td
    class="cds--table-column-decorator
      {{if (has-block 'decorator') 'cds--table-column-decorator--active'}}"
    ...attributes
  >
    {{#if (has-block "decorator")}}
      {{yield (component AILabel size="mini") to="decorator"}}
    {{/if}}
  </td>
</template>;

export default TableDecoratorRow;

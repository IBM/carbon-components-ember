import Button from '../../button.gts';
import type { DataTableContext } from '../../data-table.gts';
import type { TOC } from '@ember/component/template-only';

export interface Signature {
  Args: {
    table: DataTableContext;
  };
  Element: null;
  Blocks: {
    default: [
      {
        close: () => void;
      },
    ];
  };
}

const clearSelection = (table: DataTableContext) =>
  table.state.selectedItems.clear();

const TableActionsComponent: TOC<Signature> = <template>
  {{#if @table.state.selectedItems.size}}
    <div
      class="cds--batch-actions cds--batch-actions--active"
      aria-label="Table Action Bar"
    >
      <div class="cds--action-list">
        {{yield (hash close=(fn clearSelection @table))}}
        <Button @type="primary" @onClick={{fn clearSelection @table}}>
          Cancel
        </Button>
      </div>
      <div class="cds--batch-summary">
        <p class="cds--batch-summary__para">
          <span data-items-selected>
            {{@table.state.selectedItems.size}}
          </span>
          items selected
        </p>
      </div>
    </div>
  {{/if}}
</template>;

export default TableActionsComponent;

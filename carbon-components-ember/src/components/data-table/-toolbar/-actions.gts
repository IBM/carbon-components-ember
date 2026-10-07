import Button from '../../button.gts';
import Component from '@glimmer/component';
import type Table from '../../data-table.gts';

export interface Signature {
  Args: {
    table: Table<any>;
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

const clearSelection = (table: Table<any>) => table.state.selectedItems.clear();

export default class TableActionsComponent extends Component<Signature> {
  <template>
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
  </template>
}

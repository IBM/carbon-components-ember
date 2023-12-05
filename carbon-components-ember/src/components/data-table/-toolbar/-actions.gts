import { default as getFn } from '../../../helpers/get-fn.ts';
import { default as Button } from '../../button.gts';
import { fn } from '@ember/helper';
import { hash } from '@ember/helper';
import Component from '@glimmer/component';
import Table from '../../data-table.gts';

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

export default class TableActionsComponent extends Component<Signature> {
  <template>
    {{#if @table.state.selectedItems.size}}
      <div
        class='cds--batch-actions cds--batch-actions--active'
        aria-label='Table Action Bar'
      >
        <div class='cds--action-list'>
          {{yield (hash close=(fn (getFn @table.state.selectedItems 'clear')))}}
          <Button
            @type='primary'
            @onClick={{fn (getFn @table.state.selectedItems 'clear')}}
          >
            Cancel
          </Button>
        </div>
        <div class='cds--batch-summary'>
          <p class='cds--batch-summary__para'>
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

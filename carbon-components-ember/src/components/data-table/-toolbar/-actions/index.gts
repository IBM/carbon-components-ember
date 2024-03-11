import { default as set } from 'carbon-components-ember/helpers/set';
import { default as getFn } from 'carbon-components-ember/helpers/get-fn';
import { default as Button } from 'carbon-components-ember/components/button';
import { fn } from '@ember/helper';
import Component from '@glimmer/component';
import Table from '../../index';

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

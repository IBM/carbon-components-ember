import Component from '@glimmer/component';
import DataTableComponent from 'carbon-components-ember/components/data-table';
import { WithBoundArgs } from '@glint/template';
import DataTableRow from 'carbon-components-ember/components/data-table/-row';

type Args = {
  isExpandable: boolean;
  isCheckable: boolean;
  table: DataTableComponent<any>;
  items: any[];
}

export interface DataTableBodySignature<T> {
  Args: Args;
  Blocks: {
    default: [{
      Row: WithBoundArgs<typeof DataTableRow<any>, 'table'|'isCheckable'|'item'|'isExpandable'>;
      item: T;
    }];
  };
}

export default class DataTableBody<T> extends Component<DataTableBodySignature<T>> {

}

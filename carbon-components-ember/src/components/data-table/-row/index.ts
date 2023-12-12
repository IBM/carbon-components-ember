import Component from '@glimmer/component';
import DataTableComponent from 'carbon-components-ember/components/data-table';
import { tracked } from '@glimmer/tracking';

type Args<T> = {
  table: DataTableComponent<any>;
  isExpandable?: boolean;
  isExpanded?: boolean;
  isCheckable?: boolean;
  length?: number;
  item: T;
}

export interface DataTableRowSignature<T> {
  Args: Args<T>;
  Blocks: {
    default: [];
  };
}

export default class DataTableRow<T> extends Component<DataTableRowSignature<T>> {
  @tracked isExpanded: boolean;
}

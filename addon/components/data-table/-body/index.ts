import Component from '@glimmer/component';
import DataTableComponent from 'carbon-components-ember/components/data-table';

type Args = {
  isExpandable: boolean;
  isCheckable: boolean;
  table: typeof DataTableComponent;
}

export default class DataTableBody extends Component<Args> {

}

import Component from '@glimmer/component';
import DataTableComponent from 'carbon-components-ember/components/data-table/index';

export type Header = {
  sortable?: boolean;
  label?: string;
}

type Args = {
  table: DataTableComponent;
  headers: Header[];
  isExpandable: boolean;
  isCheckable: boolean;
}

export default class ListHeaderComponent extends Component<Args> {
  didSetup = false;
  table: DataTableComponent;

  constructor(...args: ConstructorParameters<typeof Component<Args>>) {
    super(...args);
    if (this.args.table) {
      this.table = this.args.table;
      this.didSetup = true;
      Object.defineProperty(this.args.table, 'headers', {
        configurable: true,
        get: () => this.args.headers
      });
      Object.defineProperty(this.args.table, 'isExpandable', {
        configurable: true,
        get: () => this.args.isExpandable
      });
      Object.defineProperty(this.args.table, 'isCheckable', {
        configurable: true,
        get: () => this.args.isCheckable
      });
    }
  }
}

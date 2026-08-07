import Component from '@glimmer/component';
import type DataTableComponent from '../data-table.gts';

export type Args = {
  table?: DataTableComponent<any>;
  // overrides the auto-associated header id used for the `headers` attribute
  header?: string;
};

export interface TableColumnSignature {
  Args: Args;
  Element: HTMLTableCellElement;
  Blocks: {
    default: [];
  };
}

export default class TableColumn extends Component<TableColumnSignature> {
  // captures this column's position among its row's Column instances, so it
  // can be matched up with the corresponding header's id
  columnIndex?: number;

  constructor(
    ...args: ConstructorParameters<typeof Component<TableColumnSignature>>
  ) {
    super(...args);
    if (this.args.table) {
      this.columnIndex = this.args.table.columnIndexCounter++;
    }
  }

  get headerId() {
    if (this.args.header) return this.args.header;
    if (this.columnIndex === undefined) return undefined;
    return this.args.table?.headerIds?.[this.columnIndex];
  }

  <template>
    <td headers={{this.headerId}} ...attributes>
      {{yield}}
    </td>
  </template>
}

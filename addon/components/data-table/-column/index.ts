import Component from '@glimmer/component';

export interface TableColumnSignature {
  Args: {};
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class TableColumn extends Component<TableColumnSignature> {
}

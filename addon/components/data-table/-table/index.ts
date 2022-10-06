import Component from '@glimmer/component';

type Args = {
  isLoading?: boolean;
  isSortable?: boolean;
}

export interface TableComponentSignature {
  Args: Args;
  Blocks: {
    default: [];
  };
}

export default class TableComponent extends Component<TableComponentSignature> {

}

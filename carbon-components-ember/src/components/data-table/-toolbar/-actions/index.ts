import Component from '@glimmer/component';
import Table from '../../index'

export interface Signature {
  Args: {
    table: Table<any>;
  };
  Element: null;
  Blocks: {
    default: [{
      close: () => void;
    }];
  };
}

export default class TableActionsComponent extends Component<Signature> {}




import Component from '@glimmer/component';
import Table from '../../index'

export interface Signature {
  Args: {
    table: typeof Table
  },
  Element: null,
  Blocks: {
    default: [{
      close: () => void
    }]
  }
}

export default class TableActionsComponent extends Component<Signature> {}




import Component from '@glimmer/component';
import Table from '../../index'

export interface Signature {
  Args: {
    table: Table
  },
  Element: null,
  Blocks: {
    default: [any]
  }
}

export default class ListHeaderActionsComponent extends Component<Signature> {}




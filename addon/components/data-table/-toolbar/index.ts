import Component from '@glimmer/component';

export interface Signature {
  Args: {
    table: any
  },
  Element: null,
  Blocks: {
    default: [any]
  }
}

export default class ListHeaderContentComponent extends Component<Signature> {}




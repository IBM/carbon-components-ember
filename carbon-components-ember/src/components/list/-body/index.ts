import Component from '@glimmer/component';
import { WithBoundArgs } from '@glint/template';
import ListRowComponent from 'carbon-components-ember/components/list/-row';

type Args = {
  items: any[];
  list: any;
}

export interface ListBodyComponentSignature<T> {
  Args: Args;
  Blocks: {
    default: [{
      Row: WithBoundArgs<typeof ListRowComponent<any>, 'list'|'isHeader'|'item'>;
      item: T;
    }];
  };
}


export default class ListBodyComponent<T> extends Component<ListBodyComponentSignature<T>> {

}

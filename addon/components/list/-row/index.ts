import Component from '@glimmer/component';
import { action } from '@ember/object';
import ListComponent from 'carbon-components-ember/components/list';

type Args<T> = {
  onSelect?(item: any): void;
  list: ListComponent<T>;
  isHeader: boolean;
  item: T;
}

export interface ListRowComponentSignature<T> {
  Args: Args<T>;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class ListRowComponent<T> extends Component<ListRowComponentSignature<T>> {

  @action
  onSelect(item: T) {
    this.args.onSelect?.(item);
  }
}

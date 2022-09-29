import Component from '@glimmer/component';

type Args<T> = {
  isExpandable: boolean;
  length: number;
  item: T
}

export default class DataTableRow<T> extends Component<Args<T>> {

}

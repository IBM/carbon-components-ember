import Component from '@glimmer/component';
import { action } from '@ember/object';

type Args = {
  onSelect(item: any): void
}

export default class ListRowComponent extends Component<Args> {

  @action
  onSelect(item) {
    this.args.onSelect?.(item);
  }
}

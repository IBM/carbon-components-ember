import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';

type Args = {
  selectable: boolean;
  expandable: boolean;
}

export default class TileComponent extends Component<Args> {

  @computed()
  get guid() {
    return guidFor(this);
  }

  get default() {
    return !this.args.selectable && !this.args.expandable;
  }

  @action
  onClick() {

  }
}

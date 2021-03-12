import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { autoComputed } from 'carbon-components-ember/decorators';

type Args = {
  selectable: boolean;
  expandable: boolean;
}

export default class TileComponent extends Component<Args> {

  @autoComputed()
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

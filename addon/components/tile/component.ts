import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { autoComputed } from 'carbon-components-ember/decorators';

type Args = {
  selectable: boolean;
  expandable: boolean;
  onClick: () => null;
  onSelect: () => null;
}

export default class TileComponent extends Component<Args> {

  @tracked selected = null;

  @autoComputed()
  get guid() {
    return guidFor(this);
  }

  get default() {
    return !this.args.selectable && !this.args.expandable;
  }

  @action
  onClick() {
    this.args.onClick?.();
  }

  @action
  onSelect() {
    this.args.onSelect?.();
  }
}

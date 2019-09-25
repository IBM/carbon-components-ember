import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class TileComponent extends Component {
  tagName = '';
  @tracked attrs;

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

import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';

export default class TagComponent extends Component {
  tagName = '';
  @tracked attrs;
  get type() {
    const types = 'red magenta purple blue cyan teal green gray cool-gray warm-gray'.split(' ');
    if (!this.attrs) return null;
    if (!types.includes(this.attrs.type)) {
      console.error(`${this.attrs.type} not supported type for Carbon::Tag, supported are:${types.join(',')}`);
    }
    return this.attrs.type;
  }

  set type(v) {
    return this.type;
  }
}

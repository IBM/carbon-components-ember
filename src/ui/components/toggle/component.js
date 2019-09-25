import Component from '@ember/component';
import { computed, action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class ToggleComponent extends Component {
  tagName = '';
  @computed
  get guid() { return guidFor(this); }

  @action
  onToggleChange(element) {
    const value = element.target.checked;
    this.attrs.onChange(value);
  }
}

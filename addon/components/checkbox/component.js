import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class CarbonCheckbox extends Component {
  tagName = '';
  @tracked disabled = false;
  @tracked state = null;
  @tracked isFocus = false;
  @tracked attrs;

  @computed()
  get guid() {
    return guidFor(this);
  }

  @action
  onCheckChange(element) {
    const value = element.target.checked;
    if (this.attrs.onChange) this.attrs.onChange(value);
  }

  @action
  setFocus(val) {
    this.isFocus = val;
  }
}

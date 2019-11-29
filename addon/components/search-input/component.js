import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { bool } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';

export default class SearchComponent extends Component {
  tagName = '';
  @bool('value') hasInput;
  @tracked value = null;

  @computed()
  get guid() {
    return guidFor(this);
  }

  @action
  onSearchChange(value) {
    value = value.target.value;
    this.value = value;
    if (this.attrs.onChange) {
      debounce(this.attrs.onChange, value, 250);
    }
  }

  @action
  onSearchClear() {
    this.value = null;
    if (this.attrs.onChange) this.attrs.onChange(null);
  }
}

import Component from '@ember/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';

export default class FormInput extends Component {
  tagName = '';
  get guid() {
    return guidFor(this);
  }

  @action
  onInputChange(evt) {
    if (this.attrs.onChange) this.attrs.onChange(evt.target.value);
  }
}

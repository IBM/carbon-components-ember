import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';

type Args = {
  onChange: (value) => null
}

export default class FormInput extends Component<Args> {
  get guid() {
    return guidFor(this);
  }

  @action
  onInputChange(evt) {
    this.args.onChange?.(evt.target.value);
  }
}

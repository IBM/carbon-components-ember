import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';

type Args = {
  label?: string;
  help?: string;
  errors?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  onChange: (value) => void
}

export interface FormInputSignature {
  Args: Args,
  Element: HTMLDivElement
}

export default class FormInput extends Component<FormInputSignature> {
  get guid() {
    return guidFor(this);
  }

  @action
  onInputChange(evt) {
    this.args.onChange?.(evt.target.value);
  }
}




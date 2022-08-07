import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { defaultArgs } from '../../decorators';

type Args = {
  disabled: boolean,
  onChange: () => null,
  state: object
}

export interface CarbonCheckboxSignature {
  Args,
  Element: HTMLDivElement
}

export default class CarbonCheckbox extends Component<CarbonCheckboxSignature> {
  @tracked isFocus = false;
  @tracked guid: string = '';

  args = defaultArgs(this, {
    disabled: false,
    onChange: () => null,
    state: null
  })

  @action
  setup() {
    this.guid = guidFor(this);
  }

  @action
  onCheckChange(element) {
    const value = element.target.checked;
    if (this.args.onChange) this.args.onChange(value);
  }

  @action
  setFocus(val) {
    this.isFocus = val;
  }
}

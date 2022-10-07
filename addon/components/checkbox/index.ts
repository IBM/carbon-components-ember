import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { defaultArgs } from '../../decorators';

type Args = {
  name?: string;
  readonly?: boolean;
  indeterminate?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  state?: object;
  label?: string;
}

export interface CarbonCheckboxSignature {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class CarbonCheckbox extends Component<CarbonCheckboxSignature> {
  @tracked isFocus = false;
  @tracked guid: string = '';

  args: Args = defaultArgs(this, {
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





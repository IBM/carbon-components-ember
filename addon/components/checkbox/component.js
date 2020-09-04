import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { defaultArgs } from "../../decorators";

export default class CarbonCheckbox extends Component {
  @tracked isFocus = false;
  @tracked guid = null;

  @defaultArgs
  args = {
    disabled: false,
    onChange: () => null,
    state: null
  }

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

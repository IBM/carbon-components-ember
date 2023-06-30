import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

type Args = {
  onChange?: (v: any) => void;
  value?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  name?: string;
  size?: 'sm'|'md';
}

export default class ToggleComponent extends Component<Args> {

  get guid() { return guidFor(this); }

  @action
  onToggleChange() {
    if (this.args.readonly) return;
    const value = !this.args.value;
    this.args.onChange?.(value);
  }
}

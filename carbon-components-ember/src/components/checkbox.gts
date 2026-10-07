import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { defaultArgs } from '../utils/decorators.ts';

export type Args = {
  name?: string;
  readonly?: boolean;
  indeterminate?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  state?: object;
  label?: string;
  /** Visually hide the label, keeping it as the checkbox's accessible name (as Carbon React's `hideLabel`). */
  hideLabel?: boolean;
};

export interface CarbonCheckboxSignature {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class CarbonCheckbox extends Component<CarbonCheckboxSignature> {
  @tracked isFocus = false;

  args: Args = defaultArgs(this, {
    disabled: false,
    onChange: () => null,
    state: undefined,
  });

  @cached
  get guid() {
    return guidFor(this);
  }

  onCheckChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).checked;
    if (this.args.onChange) this.args.onChange(value);
  };

  setFocus = (val: boolean) => {
    this.isFocus = val;
  };

  <template>
    <div class="cds--checkbox-wrapper" ...attributes>
      <label
        tabindex="0"
        {{on "focus" (fn this.setFocus true)}}
        {{on "blur" (fn this.setFocus false)}}
        for="checkbox-{{this.guid}}"
        class="cds--checkbox-label
          {{if this.isFocus 'cds--checkbox-label__focus'}}"
        data-contained-checkbox-disabled="{{if @disabled 'true' 'false'}}"
        data-contained-checkbox-state="{{if @indeterminate 'mixed' @checked}}"
      >
        <input
          disabled={{if @disabled true false}}
          id="checkbox-{{this.guid}}"
          readonly={{@readonly}}
          class="cds--checkbox"
          type="checkbox"
          name="{{@name}}"
          checked={{if @indeterminate true @checked}}
          {{on "change" this.onCheckChange}}
        />

        <span
          class="cds--checkbox-label-text
            {{if @hideLabel 'cds--visually-hidden'}}"
        >
          {{#if (has-block)}}
            {{yield}}
          {{else}}
            {{@label}}
          {{/if}}
        </span>
      </label>
    </div>
  </template>
}

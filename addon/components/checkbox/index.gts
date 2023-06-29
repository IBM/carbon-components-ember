import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { defaultArgs } from '../../decorators';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import set from 'carbon-components-ember/helpers/set';

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

  <template>
    <div class='cds--checkbox-wrapper' ...attributes>
      <label
        tabindex='0'
        {{didInsert this.setup}}
        {{on 'focus' (fn (set this 'isFocus') true)}}
        {{on 'blur' (fn (set this 'isFocus') false)}}
        for='checkbox-{{this.guid}}'
        class='cds--checkbox-label
          {{if this.isFocus "cds--checkbox-label__focus"}}'
        data-contained-checkbox-disabled='{{if @disabled "true" "false"}}'
        data-contained-checkbox-state='{{if @indeterminate "mixed" @checked}}'
      >
        <input
          disabled={{if @disabled true false}}
          id='checkbox-{{this.guid}}'
          readonly={{@readonly}}
          class='cds--checkbox'
          type='checkbox'
          name='{{@name}}'
          checked={{if @indeterminate true @checked}}
          {{on 'change' this.onCheckChange}}
        />

        <span class='cds--checkbox-label-text'>
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





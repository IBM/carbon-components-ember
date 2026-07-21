import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { defaultArgs } from '../../utils/decorators.ts';
import type { WithBoundArgs } from '@glint/template';
import RadioButton, { type Value } from '../radio-button.gts';

export interface Signature {
  Args: {
    orientation?: 'horizontal' | 'vertical';
    labelPosition?: 'left' | 'right';
    legendText?: string;
    name?: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    valueSelected?: Value;
    defaultSelected?: Value;
    onChange?: (value: Value | undefined, name: string | undefined, event: Event) => void;
  };
  Element: HTMLFieldSetElement;
  Blocks: {
    heading: [];
    default: [WithBoundArgs<typeof RadioButton, 'group' | 'onChange'>];
  };
}

export default class RadioButtonGroup extends Component<Signature> {
  args: Signature['Args'] = defaultArgs(this, {
    orientation: 'horizontal',
    labelPosition: 'right',
  });

  guid = guidFor(this);

  @tracked _selectedValue?: Value;

  get selectedValue() {
    return this.args.valueSelected ?? this._selectedValue ?? this.args.defaultSelected;
  }

  @action
  setCurrent(value: Value | undefined, name: string | undefined, event: Event) {
    this._selectedValue = value;
    this.args.onChange?.(value, name, event);
  }

  <template>
    <fieldset
      class='cds--radio-button-group cds--radio-button-group--{{@orientation}}
        cds--radio-button-group--label-{{@labelPosition}}'
      disabled={{@disabled}}
      ...attributes
    >
      <legend class='cds--label' dir='auto'>
        {{#if (has-block "heading")}}
          {{yield to='heading'}}
        {{else}}
          {{@legendText}}
        {{/if}}
      </legend>
      {{yield (component RadioButton group=this onChange=this.setCurrent)}}
    </fieldset>
  </template>
}

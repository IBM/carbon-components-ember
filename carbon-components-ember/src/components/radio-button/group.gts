import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { defaultArgs } from '../../utils/decorators.ts';
import type { WithBoundArgs } from '@glint/template';
import AILabel from '../ai-label.gts';
import RadioButton from '../radio-button.gts';
import type { Value } from '../radio-button.gts';

export interface RadioButtonGroupSignature {
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
    onChange?: (
      value: Value | undefined,
      name: string | undefined,
      event: Event,
    ) => void;
  };
  Element: HTMLFieldSetElement;
  Blocks: {
    /** The legend's content. Keep it text: put an AI label in `<:decorator>`. */
    heading: [];
    default: [
      RadioButton: WithBoundArgs<typeof RadioButton, 'group' | 'onChange'>,
    ];
    /**
     * **Experimental:** an AI label, or any other decorator, shown after the
     * legend. Yields an `AILabel` already set up for it; keep its default
     * kind, as Carbon React does.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size' | 'kind'>];
  };
}

export default class RadioButtonGroup extends Component<RadioButtonGroupSignature> {
  args: RadioButtonGroupSignature['Args'] = defaultArgs(this, {
    orientation: 'horizontal',
    labelPosition: 'right',
  });

  guid = guidFor(this);

  @tracked _selectedValue?: Value;

  get orientation() {
    return this.args.orientation;
  }

  get labelPosition() {
    return this.args.labelPosition;
  }

  get selectedValue() {
    return (
      this.args.valueSelected ??
      this._selectedValue ??
      this.args.defaultSelected
    );
  }

  setCurrent = (
    value: Value | undefined,
    name: string | undefined,
    event: Event,
  ) => {
    this._selectedValue = value;
    this.args.onChange?.(value, name, event);
  };

  <template>
    <fieldset
      class="cds--radio-button-group cds--radio-button-group--{{this.orientation}}
        cds--radio-button-group--label-{{this.labelPosition}}
        {{if (has-block 'decorator') 'cds--radio-button-group--decorator'}}"
      disabled={{@disabled}}
      ...attributes
    >
      <legend class="cds--label" dir="auto">
        {{#if (has-block "heading")}}
          {{yield to="heading"}}
        {{else}}
          {{@legendText}}
        {{/if}}
      </legend>
      {{#if (has-block "decorator")}}
        <div class="cds--radio-button-group-inner--decorator">
          {{yield
            (component AILabel size="mini" kind="default")
            to="decorator"
          }}
        </div>
      {{/if}}
      {{yield (component RadioButton group=this onChange=this.setCurrent)}}
    </fieldset>
  </template>
}

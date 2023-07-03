import Component from '@glimmer/component';
import { defaultArgs } from 'carbon-components-ember/decorators';
import RadioButton from 'carbon-components-ember/components/radio/index';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { WithBoundArgs } from '@glint/template';

interface Signature {
  Args: {
    orientation?: 'horizontal' | 'vertical';
    labelPosition?: 'left' | 'right';
    onSelect: (value: string) => void;
  };
  Element: null;
  Blocks: {
    heading: [];
    default: [WithBoundArgs<typeof RadioButton, 'group'|'onChange'>];
  };
}

export default class RadioButtonGroup extends Component<Signature> {

  args: Signature['Args'] = defaultArgs(this, {
    orientation: 'horizontal',
    labelPosition: 'left',
  });

  @tracked current;
  @action
  setCurrent(radio: RadioButton) {
    this.current = radio;
    this.args.onSelect(radio.args.value);
  }

  <template>
    <fieldset
      class='cds--radio-button-group cds--radio-button-group--{{@orientation}}
        cds--radio-button-group--label-{{@labelPosition}}'
    >
      <legend class='cds--label' dir='auto'>
        {{yield to='heading'}}
      </legend>
      {{yield (component RadioButton group=this onChange=this.setCurrent)}}
    </fieldset>
  </template>
}

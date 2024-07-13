import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import RadioButtonGroup from '../components/radio/group.gts';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

interface Signature {
  Args: {
    labelText?: string;
    value: string;
    isChecked?: boolean;
    group?: RadioButtonGroup;
    onChange: (radio: RadioButton) => void;
    isDefault?: boolean;
  };
  Element: null;
  Blocks: {
    default: [];
  };
}

export default class RadioButton extends Component<Signature> {
  get guid() {
    return guidFor(this);
  }

  get isChecked() {
    if (this.args.group && !this.args.group.current) {
      return this.args.isDefault;
    }
    return this.args.group?.current === this || this.args.isChecked;
  }

  <template>
    <div class='cds--radio-button-wrapper'>
      <input
        type='radio'
        class='cds--radio-button'
        id='radio-{{this.guid}}'
        name='radio-button-group'
        value={{@value}}
        checked={{this.isChecked}}
        {{on 'change' (fn @onChange this)}}
      />
      <label for='radio-{{this.guid}}' class='cds--radio-button__label'>
        <span class='cds--radio-button__appearance'></span>
        <span class='cds--radio-button__label-text' dir='auto'>
          {{#if (has-block)}}
            {{yield}}
          {{else}}
            {{@labelText}}
          {{/if}}
        </span>
      </label>
    </div>
  </template>
}

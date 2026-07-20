import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import RadioButtonGroup from '../components/radio/group.gts';
import { on } from '@ember/modifier';
import { or } from '../helpers/index.ts';
import not from 'ember-truth-helpers/helpers/not';

export interface Signature {
  Args: {
    labelText?: string;
    value?: any;
    isChecked?: boolean;
    disabled?: boolean;
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

  get name() {
    if (this.args.group) {
      return this.args.group.name;
    }
    return 'radio-button-group-';
  }

  get isChecked() {
    const group = this.args.group;
    if (group) {
      if (group.args.valueSelected !== undefined) {
        return group.args.valueSelected === this.args.value;
      }
      if (group.current) {
        return group.current === this;
      }
      if (group.args.defaultSelected !== undefined) {
        return group.args.defaultSelected === this.args.value;
      }
      return this.args.isDefault;
    }
    return this.args.isChecked;
  }

  onChange = (event: Event) => {
    this.args.onChange?.(this);
    event.preventDefault();
    return false;
  }

  onClick = (event: Event) => {
    if (this.args.group?.args.readOnly) {
      event.preventDefault();
    }
  }

  <template>
    <div class='cds--radio-button-wrapper'>
      <input
        type='radio'
        class='cds--radio-button'
        id='radio-{{this.guid}}'
        disabled={{or @disabled (not @onChange)}}
        name={{this.name}}
        checked={{this.isChecked}}
        {{on 'change' this.onChange}}
        {{on 'click' this.onClick}}
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

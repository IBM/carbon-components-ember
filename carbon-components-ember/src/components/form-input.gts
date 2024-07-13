import { default as defaultTo } from '../helpers/default-to.ts';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';

type Args = {
  label?: string;
  help?: string;
  errors?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  onChange: (value: any) => void;
};

export interface FormInputSignature {
  Args: Args;
  Element: HTMLDivElement;
}

export default class FormInput extends Component<FormInputSignature> {
  get guid() {
    return guidFor(this);
  }

  @action
  onInputChange(evt: any) {
    this.args.onChange?.(evt.target?.value);
  }

  <template>
    <div class='cds--form-item' style='margin-bottom: 1.5rem;' ...attributes>
      {{#if @label}}
        <label for='text-input-{{this.guid}}' class='cds--label'>
          {{@label}}
        </label>
      {{/if}}
      <input
        {{on 'change' this.onInputChange}}
        id='text-input-{{this.guid}}'
        type='{{defaultTo @type "text"}}'
        value={{@value}}
        class='cds--text-input'
        placeholder='{{@placeholder}}'
      />
      {{#if @help}}
        <div class='cds--form__helper-text'>
          {{@help}}
        </div>
      {{/if}}
      {{#if @errors}}
        <div class='cds--form-requirement'>
          {{@errors}}
        </div>
      {{/if}}
    </div>
  </template>
}

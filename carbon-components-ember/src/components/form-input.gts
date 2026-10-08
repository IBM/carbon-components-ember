import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { WarningFilled } from '../icons.ts';

export interface FormInputSignature {
  Element: HTMLDivElement;
  Args: {
    label?: string;
    help?: string;
    errors?: string;
    type?: string;
    value?: string;
    placeholder?: string;
    onChange: (value: string) => void;
  };
}

export default class FormInput extends Component<FormInputSignature> {
  get guid() {
    return guidFor(this);
  }

  onInputChange = (evt: Event) => {
    this.args.onChange?.((evt.target as HTMLInputElement).value);
  };

  <template>
    <div
      class="cds--form-item some-class cds--text-input-wrapper"
      ...attributes
    >
      <div class="cds--text-input__label-wrapper">
        {{#if @label}}
          <label for="text-input-{{this.guid}}" class="cds--label">
            {{@label}}
          </label>
        {{/if}}
      </div>
      <div class="cds--text-input__field-outer-wrapper">
        <div
          class="cds--text-input__field-wrapper"
          data-invalid={{if @errors "true"}}
        >
          {{#if @errors}}
            <WarningFilled
              @size="16"
              @svgClass="cds--text-input__invalid-icon"
            />
          {{/if}}
          <input
            {{on "change" this.onInputChange}}
            id="text-input-{{this.guid}}"
            aria-invalid={{if @errors "true"}}
            data-invalid={{if @errors "true"}}
            type="{{or @type 'text'}}"
            value={{@value}}
            class="cds--text-input {{if @errors 'cds--text-input--invalid'}}"
            placeholder="{{@placeholder}}"
          />
          {{#if @errors}}
            <span
              class="cds--text-input__counter-alert"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            ></span>
          {{/if}}
        </div>
        <div class="cds--form__helper-text">
          {{@help}}
        </div>
        {{#if @errors}}
          <span
            class="cds--text-input__counter-alert"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          ></span>
          <div class="cds--form-requirement">
            {{@errors}}
          </div>
        {{/if}}
      </div>
    </div>
  </template>
}

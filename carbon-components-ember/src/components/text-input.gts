import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { concat } from '@ember/helper';
import { WarningFilled, WarningAltFilled } from '../icons.ts';

export interface Signature {
  Args: {
    id?: string;
    labelText?: string;
    hideLabel?: boolean;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    type?: string;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    invalidText?: string;
    warn?: boolean;
    warnText?: string;
    helperText?: string;
    enableCounter?: boolean;
    maxCount?: number;
    light?: boolean;
    onChange?: (value: string, event: Event) => void;
    onClick?: (event: MouseEvent) => void;
  };
  Element: HTMLDivElement;
}

export default class TextInput extends Component<Signature> {
  @tracked internalValue: string;

  guid = guidFor(this);

  constructor(owner: any, args: Signature['Args']) {
    super(owner, args);
    this.internalValue = args.defaultValue ?? '';
  }

  get value() {
    return this.args.value ?? this.internalValue;
  }

  get id() {
    return this.args.id ?? `text-input-${this.guid}`;
  }

  get type() {
    return this.args.type ?? 'text';
  }

  get isInvalid() {
    return !!this.args.invalid;
  }

  get isWarn() {
    return this.isInvalid ? false : !!this.args.warn;
  }

  get count() {
    return this.value.length;
  }

  get showCounter() {
    return !!this.args.enableCounter && this.args.maxCount !== undefined;
  }

  get isOverCountLimit() {
    return this.showCounter && this.count > (this.args.maxCount as number);
  }

  @action
  updateValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.internalValue = value;
    this.args.onChange?.(value, event);
  }

  @action
  handleClick(event: MouseEvent) {
    this.args.onClick?.(event);
  }

  <template>
    <div
      class='cds--form-item cds--text-input-wrapper
        {{if @readOnly "cds--text-input-wrapper--readonly"}}
        {{if @light "cds--text-input-wrapper--light"}}'
      ...attributes
    >
      <div class='cds--text-input__label-wrapper'>
        {{#if @labelText}}
          <label
            for={{this.id}}
            class='cds--label {{if @hideLabel "cds--visually-hidden"}}'
          >
            {{@labelText}}
          </label>
        {{/if}}
        {{#if this.showCounter}}
          <label
            class='cds--label cds--text-input__label-counter'
            aria-live='polite'
            aria-atomic='true'
          >{{this.count}}/{{@maxCount}}</label>
        {{/if}}
      </div>
      <div class='cds--text-input__field-outer-wrapper'>
        <div
          class='cds--text-input__field-wrapper
            {{if this.isWarn "cds--text-input__field-wrapper--warning"}}'
          data-invalid={{if this.isInvalid 'true'}}
        >
          {{#if this.isInvalid}}
            <WarningFilled @size='16' @svgClass='cds--text-input__invalid-icon' />
          {{else if this.isWarn}}
            <WarningAltFilled
              @size='16'
              @svgClass='cds--text-input__invalid-icon cds--text-input__invalid-icon--warning'
            />
          {{/if}}
          <input
            id={{this.id}}
            type={{this.type}}
            class='cds--text-input
              {{if @size (concat "cds--text-input--" @size)}}
              {{if @light "cds--text-input--light"}}
              {{if this.isInvalid "cds--text-input--invalid"}}
              {{if this.isWarn "cds--text-input--warning"}}'
            placeholder={{@placeholder}}
            disabled={{@disabled}}
            readonly={{@readOnly}}
            aria-invalid={{if this.isInvalid 'true'}}
            data-invalid={{if this.isInvalid 'true'}}
            value={{this.value}}
            {{on 'input' this.updateValue}}
            {{on 'click' this.handleClick}}
          />
          <span
            class='cds--text-input__counter-alert'
            role='alert'
            aria-live='assertive'
            aria-atomic='true'
          >
            {{#if this.isOverCountLimit}}{{this.count}}/{{@maxCount}}{{/if}}
          </span>
        </div>
        {{#if this.isInvalid}}
          <div class='cds--form-requirement'>{{@invalidText}}</div>
        {{else if this.isWarn}}
          <div class='cds--form-requirement'>{{@warnText}}</div>
        {{else if @helperText}}
          <div
            class='cds--form__helper-text {{if @disabled "cds--form__helper-text--disabled"}}'
          >{{@helperText}}</div>
        {{/if}}
      </div>
    </div>
  </template>
}

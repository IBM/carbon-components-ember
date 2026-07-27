import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { WarningFilled, WarningAltFilled, View, ViewOff } from '../icons.ts';
import Tooltip from './tooltip.gts';

export interface Signature {
  Args: {
    id?: string;
    labelText?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    invalidText?: string;
    warn?: boolean;
    warnText?: string;
    enableCounter?: boolean;
    maxCount?: number;
    isPassword?: boolean;
    showPasswordLabel?: string;
    hidePasswordLabel?: string;
    onChange?: (value: string, event: Event) => void;
    onClick?: (event: MouseEvent) => void;
    onTogglePasswordVisibility?: (event: MouseEvent) => void;
  };
  Blocks: {
    labelText: [];
  };
  Element: HTMLDivElement;
}

export default class FluidTextInput extends Component<Signature> {
  @tracked internalValue: string;
  @tracked passwordVisible = false;

  guid = guidFor(this);

  constructor(owner: any, args: Signature['Args']) {
    super(owner, args);
    this.internalValue = args.defaultValue ?? '';
  }

  get value() {
    return this.args.value ?? this.internalValue;
  }

  get id() {
    return this.args.id ?? `fluid-text-input-${this.guid}`;
  }

  get type() {
    if (this.args.isPassword) {
      return this.passwordVisible ? 'text' : 'password';
    }
    return 'text';
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
    return (
      !this.args.isPassword &&
      !!this.args.enableCounter &&
      this.args.maxCount !== undefined
    );
  }

  get isOverCountLimit() {
    return this.showCounter && this.count > (this.args.maxCount as number);
  }

  get showPasswordLabel() {
    return this.args.showPasswordLabel ?? 'Show password';
  }

  get hidePasswordLabel() {
    return this.args.hidePasswordLabel ?? 'Hide password';
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

  @action
  togglePasswordVisibility(event: MouseEvent) {
    this.passwordVisible = !this.passwordVisible;
    this.args.onTogglePasswordVisibility?.(event);
  }

  <template>
    <div
      class='cds--form-item cds--text-input-wrapper cds--text-input--fluid
        {{if @isPassword "cds--password-input-wrapper"}}
        {{if @readOnly "cds--text-input-wrapper--readonly"}}'
      ...attributes
    >
      <div class='cds--text-input__label-wrapper'>
        {{#if (has-block 'labelText')}}
          <label for={{this.id}} class='cds--label'>
            {{yield to='labelText'}}
          </label>
        {{else if @labelText}}
          <label for={{this.id}} class='cds--label'>
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
              {{if @isPassword "cds--password-input"}}
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
          {{#unless @isPassword}}
            <span
              class='cds--text-input__counter-alert'
              role='alert'
              aria-live='assertive'
              aria-atomic='true'
            >
              {{#if this.isOverCountLimit}}{{this.count}}/{{@maxCount}}{{/if}}
            </span>
          {{/unless}}
          <hr class='cds--text-input__divider' />
          {{#if @isPassword}}
            <Tooltip
              @label={{if
                this.passwordVisible
                this.hidePasswordLabel
                this.showPasswordLabel
              }}
              @align='bottom'
              class='cds--toggle-password-tooltip'
            >
              <button
                type='button'
                class='cds--text-input--password__visibility__toggle cds--btn cds--tooltip__trigger'
                disabled={{@disabled}}
                aria-label={{if
                  this.passwordVisible
                  this.hidePasswordLabel
                  this.showPasswordLabel
                }}
                {{on 'click' this.togglePasswordVisibility}}
              >
                {{#if this.passwordVisible}}
                  <ViewOff @size='16' @svgClass='cds--icon-visibility-off' />
                {{else}}
                  <View @size='16' @svgClass='cds--icon-visibility-on' />
                {{/if}}
              </button>
            </Tooltip>
          {{/if}}
          {{#if this.isInvalid}}
            <div class='cds--form-requirement'>{{@invalidText}}</div>
          {{else if this.isWarn}}
            <div class='cds--form-requirement'>{{@warnText}}</div>
          {{/if}}
        </div>
      </div>
    </div>
  </template>
}

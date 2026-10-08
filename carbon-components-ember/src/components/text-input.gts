import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { concat } from '@ember/helper';
import { WarningFilled, WarningAltFilled } from '../icons.ts';
import AILabel from './ai-label.gts';
import type { WithBoundArgs } from '@glint/template';

export interface TextInputSignature {
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
  Blocks: {
    /**
     * **Experimental:** an AI label, or any other decorator, shown in the field.
     * Yields an `AILabel` already set up for it.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
  };
}

export default class TextInput extends Component<TextInputSignature> {
  @tracked internalValue: string;

  guid = guidFor(this);

  constructor(owner: Owner, args: TextInputSignature['Args']) {
    super(owner, args);
    this.internalValue = args.defaultValue ?? '';
  }

  get value() {
    return this.args.value ?? this.internalValue;
  }

  // Ember 7 writes a `value=""` attribute for an empty initial value; bind
  // `undefined` instead so the input renders like Carbon React (no attribute).
  get boundValue() {
    return this.value === '' ? undefined : this.value;
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

  updateValue = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    this.internalValue = value;
    this.args.onChange?.(value, event);
  };

  handleClick = (event: MouseEvent) => {
    this.args.onClick?.(event);
  };

  <template>
    <div
      class="cds--form-item cds--text-input-wrapper
        {{if @readOnly 'cds--text-input-wrapper--readonly'}}
        {{if @light 'cds--text-input-wrapper--light'}}"
      ...attributes
    >
      <div class="cds--text-input__label-wrapper">
        {{#if @labelText}}
          <label
            for={{this.id}}
            class="cds--label
              {{if @hideLabel 'cds--visually-hidden'}}
              {{if @disabled 'cds--label--disabled'}}"
          >
            {{@labelText}}
          </label>
        {{/if}}
        {{#if this.showCounter}}
          <label
            class="cds--label cds--text-input__label-counter"
            aria-live="polite"
            aria-atomic="true"
          >{{this.count}}/{{@maxCount}}</label>
        {{/if}}
      </div>
      <div class="cds--text-input__field-outer-wrapper">
        <div
          class="cds--text-input__field-wrapper
            {{if this.isWarn 'cds--text-input__field-wrapper--warning'}}
            {{if
              (has-block 'decorator')
              'cds--text-input__field-wrapper--decorator'
            }}"
          data-invalid={{if this.isInvalid "true"}}
        >
          {{#if this.isInvalid}}
            <WarningFilled
              @size="16"
              @svgClass="cds--text-input__invalid-icon"
            />
          {{else if this.isWarn}}
            <WarningAltFilled
              @size="16"
              @svgClass="cds--text-input__invalid-icon cds--text-input__invalid-icon--warning"
            />
          {{/if}}
          <input
            id={{this.id}}
            type={{this.type}}
            class="cds--text-input
              {{if @size (concat 'cds--text-input--' @size)}}
              {{if @size (concat 'cds--layout--size-' @size)}}
              {{if @light 'cds--text-input--light'}}
              {{if this.isInvalid 'cds--text-input--invalid'}}
              {{if this.isWarn 'cds--text-input--warning'}}"
            placeholder={{@placeholder}}
            disabled={{@disabled}}
            readonly={{@readOnly}}
            aria-invalid={{if this.isInvalid "true"}}
            data-invalid={{if this.isInvalid "true"}}
            value={{this.boundValue}}
            {{on "input" this.updateValue}}
            {{on "click" this.handleClick}}
          />
          {{#if (has-block "decorator")}}
            <div class="cds--text-input__field-inner-wrapper--decorator">
              {{yield (component AILabel size="mini") to="decorator"}}
            </div>
          {{/if}}
          <span
            class="cds--text-input__counter-alert"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            {{#if this.isOverCountLimit}}{{this.count}}/{{@maxCount}}{{/if}}
          </span>
        </div>
        {{#if this.isInvalid}}
          <div class="cds--form-requirement">{{@invalidText}}</div>
        {{else if this.isWarn}}
          <div class="cds--form-requirement">{{@warnText}}</div>
        {{else if @helperText}}
          <div
            class="cds--form__helper-text
              {{if @disabled 'cds--form__helper-text--disabled'}}"
          >{{@helperText}}</div>
        {{/if}}
      </div>
    </div>
  </template>
}

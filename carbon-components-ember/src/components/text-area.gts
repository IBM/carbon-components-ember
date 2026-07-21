import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { WarningFilled, WarningAltFilled } from '../icons.ts';

export interface Signature {
  Args: {
    id?: string;
    labelText?: string;
    hideLabel?: boolean;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    rows?: number;
    cols?: number;
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    invalidText?: string;
    warn?: boolean;
    warnText?: string;
    helperText?: string;
    enableCounter?: boolean;
    maxCount?: number;
    counterMode?: 'character' | 'word';
    light?: boolean;
    onChange?: (value: string, event: Event) => void;
  };
  Element: HTMLDivElement;
}

export default class TextArea extends Component<Signature> {
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
    return this.args.id ?? `text-area-${this.guid}`;
  }

  get rows() {
    return this.args.rows ?? 4;
  }

  get isInvalid() {
    return !!this.args.invalid;
  }

  get isWarn() {
    return this.isInvalid ? false : !!this.args.warn;
  }

  get wordCount() {
    const trimmed = this.value.trim();
    return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
  }

  get count() {
    return this.args.counterMode === 'word' ? this.wordCount : this.value.length;
  }

  get showCounter() {
    return !!this.args.enableCounter && this.args.maxCount !== undefined;
  }

  get isOverCountLimit() {
    return this.showCounter && this.count > (this.args.maxCount as number);
  }

  @action
  updateValue(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.internalValue = value;
    this.args.onChange?.(value, event);
  }

  <template>
    <div class='cds--form-item' ...attributes>
      <div class='cds--text-area__label-wrapper'>
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
            class='cds--label cds--text-area__counter'
            aria-live='polite'
            aria-atomic='true'
          >{{this.count}}/{{@maxCount}}</label>
        {{/if}}
      </div>
      <div
        class='cds--text-area__wrapper
          {{if @readOnly "cds--text-area__wrapper--readonly"}}
          {{if this.isInvalid "cds--text-area__wrapper--invalid"}}
          {{if this.isWarn "cds--text-area__wrapper--warn"}}'
        data-invalid={{if this.isInvalid 'true'}}
      >
        {{#if this.isInvalid}}
          <WarningFilled @size='16' @svgClass='cds--text-area__invalid-icon' />
        {{else if this.isWarn}}
          <WarningAltFilled
            @size='16'
            @svgClass='cds--text-area__invalid-icon cds--text-area__invalid-icon--warning'
          />
        {{/if}}
        <textarea
          id={{this.id}}
          class='cds--text-area
            {{if @light "cds--text-area--light"}}
            {{if this.isInvalid "cds--text-area--invalid"}}
            {{if this.isWarn "cds--text-area--warn"}}'
          rows={{this.rows}}
          cols={{@cols}}
          placeholder={{@placeholder}}
          disabled={{@disabled}}
          readonly={{@readOnly}}
          aria-invalid={{if this.isInvalid 'true'}}
          data-invalid={{if this.isInvalid 'true'}}
          {{on 'input' this.updateValue}}
        >{{this.value}}</textarea>
        <span
          class='cds--text-area__counter-alert'
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
  </template>
}

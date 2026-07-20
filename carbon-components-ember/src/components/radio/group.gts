import Component from '@glimmer/component';
import { defaultArgs } from '../../utils/decorators.ts';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import type { WithBoundArgs } from '@glint/template';
import RadioButton from '../../components/radio.gts';
import { or } from '../../helpers/index.ts';
import { WarningFilled, WarningAltFilled } from '../../icons.ts';

export interface Signature {
  Args: {
    legendText?: string;
    helperText?: string;
    name?: string;
    orientation?: 'horizontal' | 'vertical';
    labelPosition?: 'left' | 'right';
    defaultSelected?: string | number;
    valueSelected?: string | number;
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    invalidText?: string;
    warn?: boolean;
    warnText?: string;
    onChange?: (value: any, name: string) => void;
    onSelect?: (value: any) => void;
  };
  Element: HTMLFieldSetElement;
  Blocks: {
    heading: [];
    default: [WithBoundArgs<typeof RadioButton, 'group' | 'onChange'>];
  };
}

export default class RadioButtonGroup extends Component<Signature> {
  args: Signature['Args'] = defaultArgs(this, {
    orientation: 'horizontal',
    labelPosition: 'right',
  });

  @tracked current?: RadioButton;

  get name() {
    return this.args.name ?? `radio-button-group-${guidFor(this)}`;
  }

  get selectedValue() {
    if (this.args.valueSelected !== undefined) {
      return this.args.valueSelected;
    }
    if (this.current) {
      return this.current.args.value;
    }
    return this.args.defaultSelected;
  }

  get invalid() {
    return Boolean(
      this.args.invalid && !this.args.readOnly && !this.args.disabled,
    );
  }

  get warn() {
    return Boolean(
      this.args.warn && !this.invalid && !this.args.readOnly && !this.args.disabled,
    );
  }

  get showHelper() {
    return Boolean(
      this.args.helperText && !this.invalid && !this.warn && !this.args.disabled,
    );
  }

  get classes() {
    const classes = ['cds--radio-button-group'];
    if (this.args.orientation === 'vertical') {
      classes.push('cds--radio-button-group--vertical');
    }
    classes.push(`cds--radio-button-group--label-${this.args.labelPosition}`);
    if (this.args.readOnly) {
      classes.push('cds--radio-button-group--readonly');
    }
    if (this.invalid) {
      classes.push('cds--radio-button-group--invalid');
    }
    if (this.warn) {
      classes.push('cds--radio-button-group--warning');
    }
    return classes.join(' ');
  }

  @action
  setCurrent(radio: RadioButton) {
    if (this.args.readOnly || this.args.disabled) {
      return;
    }
    this.current = radio;
    this.args.onSelect?.(radio.args.value);
    this.args.onChange?.(radio.args.value, this.name);
  }

  <template>
    <div class='cds--form-item'>
      <fieldset
        class={{this.classes}}
        disabled={{@disabled}}
        aria-readonly={{if @readOnly 'true'}}
        ...attributes
      >
        {{#if (or (has-block 'heading') @legendText)}}
          <legend class='cds--label' dir='auto'>
            {{#if (has-block 'heading')}}
              {{yield to='heading'}}
            {{else}}
              {{@legendText}}
            {{/if}}
          </legend>
        {{/if}}
        {{yield (component RadioButton group=this onChange=this.setCurrent)}}
      </fieldset>
      {{#if this.invalid}}
        <div class='cds--radio-button__validation-msg'>
          <WarningFilled
            @size='16'
            @svgClass='cds--radio-button__invalid-icon'
          />
          <div class='cds--form-requirement'>
            {{@invalidText}}
          </div>
        </div>
      {{else if this.warn}}
        <div class='cds--radio-button__validation-msg'>
          <WarningAltFilled
            @size='16'
            @svgClass='cds--radio-button__invalid-icon cds--radio-button__invalid-icon--warning'
          />
          <div class='cds--form-requirement'>
            {{@warnText}}
          </div>
        </div>
      {{/if}}
      {{#if this.showHelper}}
        <div class='cds--form__helper-text'>
          {{@helperText}}
        </div>
      {{/if}}
    </div>
  </template>
}

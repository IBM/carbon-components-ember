import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import RadioButtonGroup from './radio-button/group.gts';
import { on } from '@ember/modifier';
import { defaultArgs } from '../utils/decorators.ts';

export type Value = string | number;

export interface Signature {
  Args: {
    id?: string;
    labelText?: string;
    value?: Value;
    name?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    hideLabel?: boolean;
    labelPosition?: 'left' | 'right';
    readOnly?: boolean;
    required?: boolean;
    group?: RadioButtonGroup;
    onChange?: (value: Value | undefined, name: string | undefined, event: Event) => void;
    onClick?: (event: MouseEvent) => void;
  };
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class RadioButton extends Component<Signature> {
  args: Signature['Args'] = defaultArgs(this, {
    hideLabel: false,
  });

  guid = guidFor(this);

  get groupGuid() {
    return this.args.group ? guidFor(this.args.group) : this.guid;
  }

  get id() {
    return this.args.id ?? `radio-button-${this.guid}`;
  }

  get name() {
    return (
      this.args.name ??
      this.args.group?.args.name ??
      `radio-button-group-${this.groupGuid}`
    );
  }

  get disabled() {
    return this.args.disabled ?? this.args.group?.args.disabled ?? false;
  }

  get readOnly() {
    return this.args.readOnly ?? this.args.group?.args.readOnly ?? false;
  }

  get required() {
    return this.args.required ?? this.args.group?.args.required ?? false;
  }

  get labelPosition() {
    return this.args.labelPosition ?? this.args.group?.args.labelPosition ?? 'right';
  }

  get wrapperClass() {
    const classes = ['cds--radio-button-wrapper'];
    if (this.labelPosition === 'left') {
      classes.push('cds--radio-button-wrapper--label-left');
    }
    return classes.join(' ');
  }

  get checked() {
    if (this.args.checked !== undefined) {
      return this.args.checked;
    }
    if (this.args.group && this.args.group.selectedValue !== undefined) {
      return this.args.group.selectedValue === this.args.value;
    }
    return !!this.args.defaultChecked;
  }

  handleChange = (event: Event) => {
    this.args.group?.setCurrent(this.args.value, this.name, event);
    this.args.onChange?.(this.args.value, this.name, event);
  };

  handleClick = (event: MouseEvent) => {
    this.args.onClick?.(event);
  };

  <template>
    <div class={{this.wrapperClass}} ...attributes>
      <input
        type='radio'
        class='cds--radio-button'
        id={{this.id}}
        value={{@value}}
        disabled={{this.disabled}}
        readonly={{this.readOnly}}
        required={{this.required}}
        name={{this.name}}
        checked={{this.checked}}
        {{on 'click' this.handleClick}}
        {{on 'change' this.handleChange}}
      />
      <label for={{this.id}} class='cds--radio-button__label'>
        <span class='cds--radio-button__appearance'></span>
        <span
          class='cds--radio-button__label-text
            {{if @hideLabel "cds--visually-hidden"}}'
          dir='auto'
        >
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

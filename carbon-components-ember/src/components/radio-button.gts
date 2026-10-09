import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import type RadioButtonGroup from './radio-button/group.gts';
import { defaultArgs } from '../utils/decorators.ts';
import AILabel from './ai-label.gts';
import type { WithBoundArgs } from '@glint/template';

export type Value = string | number;

export interface RadioButtonSignature {
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
    onChange?: (
      value: Value | undefined,
      name: string | undefined,
      event: Event,
    ) => void;
    onClick?: (event: MouseEvent) => void;
  };
  Element: HTMLDivElement;
  Blocks: {
    /** The label's content. Keep it text: put an AI label or other controls in `<:decorator>`. */
    default: [];
    /**
     * **Experimental:** an AI label, or any other decorator, shown after the label.
     * Yields an `AILabel` already set up for it;
     * with `@kind="inline"`, also pass `@size="md"`.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
  };
}

export default class RadioButton extends Component<RadioButtonSignature> {
  args: RadioButtonSignature['Args'] = defaultArgs(this, {
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
    return (
      this.args.labelPosition ?? this.args.group?.args.labelPosition ?? 'right'
    );
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
    <div
      class="{{this.wrapperClass}}
        {{if (has-block 'decorator') 'cds--radio-button-wrapper--decorator'}}"
      ...attributes
    >
      <input
        type="radio"
        class="cds--radio-button"
        id={{this.id}}
        value={{@value}}
        disabled={{this.disabled}}
        readonly={{this.readOnly}}
        required={{this.required}}
        name={{this.name}}
        checked={{this.checked}}
        {{on "click" this.handleClick}}
        {{on "change" this.handleChange}}
      />
      <label for={{this.id}} class="cds--radio-button__label">
        <span class="cds--radio-button__appearance"></span>
        <span
          class="cds--radio-button__label-text
            {{if @hideLabel 'cds--visually-hidden'}}"
          dir="auto"
        >
          {{#if (has-block)}}
            {{yield}}
          {{else}}
            {{@labelText}}
          {{/if}}
        </span>
      </label>
      {{#if (has-block "decorator")}}
        <div class="cds--radio-button-wrapper-inner--decorator">
          {{yield (component AILabel size="mini") to="decorator"}}
        </div>
      {{/if}}
    </div>
  </template>
}

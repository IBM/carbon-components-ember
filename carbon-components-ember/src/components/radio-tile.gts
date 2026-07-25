import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import { CheckmarkFilled } from '../icons.ts';
import type RadioTileGroup from './tile/tile-group.gts';

export type Value = string | number;

export interface Signature {
  Args: {
    id?: string;
    value: Value;
    name?: string;
    checked?: boolean;
    disabled?: boolean;
    tabindex?: string;
    required?: boolean;
    group?: RadioTileGroup;
    onChange?: (value: Value | undefined, name: string | undefined, event: Event) => void;
  };
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

export default class RadioTile extends Component<Signature> {
  guid = guidFor(this);

  get id() {
    return this.args.id ?? `radio-tile-${this.guid}`;
  }

  get name() {
    return this.args.name ?? this.args.group?.args.name;
  }

  get disabled() {
    return this.args.disabled ?? this.args.group?.args.disabled ?? false;
  }

  get required() {
    return this.args.required ?? this.args.group?.args.required ?? false;
  }

  get checked() {
    if (this.args.group) {
      return this.args.group.selectedValue === this.args.value;
    }
    return !!this.args.checked;
  }

  handleChange = (event: Event) => {
    this.args.group?.setCurrent(this.args.value, this.name, event);
    this.args.onChange?.(this.args.value, this.name, event);
  };

  <template>
    <div ...attributes>
      <input
        type='radio'
        class='cds--tile-input'
        id={{this.id}}
        value={{@value}}
        disabled={{this.disabled}}
        required={{this.required}}
        name={{this.name}}
        checked={{this.checked}}
        tabindex={{@tabindex}}
        {{on 'change' this.handleChange}}
      />
      <label
        for={{this.id}}
        class='cds--tile cds--tile--selectable cds--tile--radio
          {{if this.checked "cds--tile--is-selected"}}
          {{if this.disabled "cds--tile--disabled"}}'
      >
        <span class='cds--tile__checkmark'>
          <CheckmarkFilled @size="16" />
        </span>
        <div class='cds--tile-content'>
          {{yield}}
        </div>
      </label>
    </div>
  </template>
}

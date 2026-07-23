import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type { WithBoundArgs } from '@glint/template';
import RadioTile, { type Value } from '../radio-tile.gts';

export interface Signature {
  Args: {
    legend?: string;
    name: string;
    disabled?: boolean;
    required?: boolean;
    valueSelected?: Value;
    defaultSelected?: Value;
    onChange?: (value: Value | undefined, name: string | undefined, event: Event) => void;
  };
  Element: HTMLFieldSetElement;
  Blocks: {
    default: [WithBoundArgs<typeof RadioTile, 'group' | 'onChange'>];
  };
}

export default class TileGroup extends Component<Signature> {
  @tracked _selectedValue?: Value;

  get selectedValue() {
    return this.args.valueSelected ?? this._selectedValue ?? this.args.defaultSelected;
  }

  @action
  setCurrent(value: Value | undefined, name: string | undefined, event: Event) {
    this._selectedValue = value;
    this.args.onChange?.(value, name, event);
  }

  <template>
    <fieldset class='cds--tile-group' disabled={{@disabled}} ...attributes>
      {{#if @legend}}
        <legend class='cds--label'>{{@legend}}</legend>
      {{/if}}
      <div>
        {{yield (component RadioTile group=this onChange=this.setCurrent)}}
      </div>
    </fieldset>
  </template>
}

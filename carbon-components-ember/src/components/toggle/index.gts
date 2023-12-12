import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import eq from 'ember-truth-helpers/helpers/eq';

type Args = {
  onChange?: (v: any) => void;
  value?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  name?: string;
  size?: 'sm'|'md';
}

export default class ToggleComponent extends Component<Args> {

  get guid() { return guidFor(this); }

  @action
  onToggleChange() {
    if (this.args.readonly) return;
    const value = !this.args.value;
    this.args.onChange?.(value);
  }

  <template>
    <div class='cds--toggle {{if @disabled "cds--toggle--disabled"}}'>
      <button
        id='toggle-{{this.guid}}'
        class='cds--toggle__button'
        role='switch'
        type='button'
        aria-checked='{{@value}}'
        disabled={{@disabled}}
        {{on 'click' this.onToggleChange}}
      ></button>
      <label class='cds--toggle__label' for='toggle-{{this.guid}}'>
        <span class='cds--toggle__label-text'>
          {{@name}}
        </span>
        <div
          class='cds--toggle__appearance
            {{if (eq @size "sm") "cds--toggle__appearance--sm"}}'
        >
          <div
            class='cds--toggle__switch
              {{if @value "cds--toggle__switch--checked"}}'
          ></div>
          <span class='cds--toggle__text' aria-hidden='true'>
            {{if @value 'On' 'Off'}}
          </span>
        </div>
      </label>
    </div>
  </template>
}

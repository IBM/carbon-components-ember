/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import InlineCheckbox from '../inline-checkbox.gts';
import RadioButton from '../radio-button.gts';

export interface TableSelectRowSignature {
  Element: HTMLTableCellElement;
  Args: {
    /** Names the control: Carbon React's `aria-label`. */
    ariaLabel?: string;
    /** Whether the row is selected. */
    checked?: boolean;
    disabled?: boolean;
    /** The `id` of the control. */
    id: string;
    /** The `name` of the control. Defaults to a unique one. */
    name?: string;
    /**
     * Called each time the control changes, with whether it is checked, its
     * `id` (a radio button's `name`) and the `change` event.
     */
    onChange?: (checked: boolean, name: string, event: Event) => void;
    /** Called with the `click` event when a user clicks the control. */
    onSelect: (event: MouseEvent) => void;
    /** Renders a radio button rather than a checkbox. */
    radio?: boolean;
  };
}

/**
 * The cell that selects a row, as Carbon React's `TableSelectRow`. `class`
 * and the other attributes go on the `<td>`.
 */
export default class TableSelectRow extends Component<TableSelectRowSignature> {
  uniqueName = `table-select-row-${guidFor(this)}`;

  get name() {
    return this.args.name || this.uniqueName;
  }

  handleRadioChange = (
    value: string | number | undefined,
    name: string | undefined,
    event: Event,
  ) => {
    this.args.onChange?.(!!value, name ?? '', event);
  };

  <template>
    <td
      class="cds--table-column-checkbox {{if @radio 'cds--table-column-radio'}}"
      aria-live="off"
      ...attributes
    >
      {{#if @radio}}
        <RadioButton
          @id={{@id}}
          @name={{this.name}}
          @checked={{@checked}}
          @disabled={{@disabled}}
          @labelText={{@ariaLabel}}
          @hideLabel={{true}}
          @onChange={{if @onChange this.handleRadioChange}}
          {{on "click" @onSelect}}
        />
      {{else}}
        <InlineCheckbox
          @ariaLabel={{if @ariaLabel @ariaLabel ""}}
          @id={{@id}}
          @name={{this.name}}
          @checked={{@checked}}
          @disabled={{@disabled}}
          @onChange={{@onChange}}
          @onClick={{@onSelect}}
        />
      {{/if}}
    </td>
  </template>
}

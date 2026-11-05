/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import type { WithBoundArgs } from '@glint/template';
import StructuredListCell from './structured-list-cell.gts';
import StructuredListInput from './structured-list-input.gts';
import RadioButtonChecked from '../icons/radio-button-checked.ts';
import RadioButton from '../icons/radio-button.ts';
import closeOnOutsideClick from '../../modifiers/close-on-outside-click.ts';
import type StructuredListWrapper from './structured-list-wrapper.gts';

export interface StructuredListRowSignature {
  Element: HTMLDivElement;
  Args: {
    /** Makes it the header row, in a `StructuredListHead`. */
    head?: boolean;
    /**
     * Its value when selected, which `@selectedInitialRow` names. Defaults
     * to a generated id.
     */
    id?: string;
    /**
     * Shows the selection column: a radio icon, or in the header row an
     * empty heading. Give the `StructuredListWrapper` `@selection` too.
     */
    selection?: boolean;
    wrapper?: StructuredListWrapper;
  };
  Blocks: {
    default: [
      StructuredListInput: WithBoundArgs<typeof StructuredListInput, 'row'>,
    ];
  };
}

/**
 * A row of `StructuredListCell`s. A click selects it; with `@selection`, a
 * `StructuredListInput` in it makes it selectable from the keyboard.
 */
export default class StructuredListRow extends Component<StructuredListRowSignature> {
  @tracked hasFocusWithin = false;

  get rowId() {
    return this.args.id ?? `${guidFor(this)}-grid-input`;
  }

  get isSelected() {
    return this.args.wrapper?.selectedRow === this.rowId;
  }

  // As Carbon React: with selection, only the selected row shows focus, or
  // any row while none is selected.
  get isFocusedWithin() {
    if (!this.hasFocusWithin) return false;
    if (!this.args.selection) return true;
    const selected = this.args.wrapper?.selectedRow ?? null;
    return selected === null || selected === this.rowId;
  }

  select = () => {
    this.args.wrapper?.selectRow(this.rowId);
    if (this.args.selection) this.hasFocusWithin = true;
  };

  focusIn = (event: FocusEvent) => {
    if (this.args.selection || event.currentTarget === event.target) {
      this.hasFocusWithin = true;
    }
  };

  focusOut = () => {
    this.hasFocusWithin = false;
  };

  <template>
    {{#if @head}}
      <div
        role="row"
        ...attributes
        class="cds--structured-list-row cds--structured-list-row--header-row"
      >
        {{#if @selection}}
          {{! Carbon React leaves this heading empty, which axe flags (empty-table-header). }}
          <StructuredListCell @head={{true}}>
            <span class="cds--visually-hidden">Selection</span>
          </StructuredListCell>
        {{/if}}
        {{yield (component StructuredListInput row=this)}}
      </div>
    {{else}}
      {{! As in Carbon React, the row isn't focusable: its StructuredListInput takes the keyboard, and the click is for the pointer. }}
      <div
        ...attributes
        role="row"
        class="cds--structured-list-row
          {{if this.isFocusedWithin 'cds--structured-list-row--focused-within'}}
          {{if this.isSelected 'cds--structured-list-row--selected'}}"
        {{on "click" this.select}}
        {{on "focusin" this.focusIn}}
        {{on "focusout" this.focusOut}}
        {{closeOnOutsideClick this.focusOut}}
      >
        {{#if @selection}}
          <StructuredListCell>
            {{#if this.isSelected}}
              <RadioButtonChecked @svgClass="cds--structured-list__icon" />
            {{else}}
              <RadioButton @svgClass="cds--structured-list__icon" />
            {{/if}}
          </StructuredListCell>
        {{/if}}
        {{yield (component StructuredListInput row=this)}}
      </div>
    {{/if}}
  </template>
}

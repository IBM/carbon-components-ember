/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import type { WithBoundArgs } from '@glint/template';
import Cell from './-cell.gts';
import Input from './-input.gts';
import type StructuredList from '../structured-list.gts';
import { RadioButtonChecked, RadioButton } from '../../icons.ts';

export interface StructuredListRowSignature {
  Element: HTMLDivElement;
  Args: {
    wrapper: StructuredList;
    head?: boolean;
    id?: string;
    onClick?: (event: MouseEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
  };
  Blocks: {
    default: [WithBoundArgs<typeof Input, 'row'>];
  };
}

export default class StructuredListRow extends Component<StructuredListRowSignature> {
  @tracked hasFocusWithin = false;

  get rowId() {
    return this.args.id ?? guidFor(this);
  }

  get selection() {
    return this.args.wrapper.args.selection;
  }

  get isSelected() {
    return this.args.wrapper.selectedRow === this.rowId;
  }

  @action
  handleClick(event: MouseEvent) {
    this.args.wrapper.setSelectedRow(this.rowId);
    this.args.onClick?.(event);
    if (this.selection) {
      this.hasFocusWithin = true;
    }
  }

  @action
  handleFocusIn() {
    this.hasFocusWithin = true;
  }

  @action
  handleFocusOut() {
    this.hasFocusWithin = false;
  }

  @action
  handleKeyDown(event: KeyboardEvent) {
    this.args.onKeyDown?.(event);
  }

  <template>
    {{#if @head}}
      <div role='row' class='cds--structured-list-row cds--structured-list-row--header-row' ...attributes>
        {{#if this.selection}}
          <Cell @head={{true}} />
        {{/if}}
        {{yield (component Input row=this)}}
      </div>
    {{else}}
      <div
        role='row'
        class='cds--structured-list-row
          {{if this.hasFocusWithin "cds--structured-list-row--focused-within"}}
          {{if this.isSelected "cds--structured-list-row--selected"}}'
        {{on 'click' this.handleClick}}
        {{on 'focusin' this.handleFocusIn}}
        {{on 'focusout' this.handleFocusOut}}
        {{on 'keydown' this.handleKeyDown}}
        ...attributes
      >
        {{#if this.selection}}
          <Cell>
            {{#if this.isSelected}}
              <RadioButtonChecked
                @size={{16}}
                @svgClass='cds--structured-list__icon'
              />
            {{else}}
              <RadioButton
                @size={{16}}
                @svgClass='cds--structured-list__icon'
              />
            {{/if}}
          </Cell>
        {{/if}}
        {{yield (component Input row=this)}}
      </div>
    {{/if}}
  </template>
}

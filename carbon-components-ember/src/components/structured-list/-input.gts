/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { on } from '@ember/modifier';
import type StructuredListRow from './-row.gts';

export interface StructuredListInputSignature {
  Element: HTMLInputElement;
  Args: {
    row: StructuredListRow;
    id?: string;
    name?: string;
    title?: string;
    onChange?: (event: Event) => void;
  };
}

export default class StructuredListInput extends Component<StructuredListInputSignature> {
  get id() {
    return this.args.id ?? this.args.row.rowId;
  }

  get name() {
    return this.args.name ?? `structured-list-input-${guidFor(this.args.row.args.wrapper)}`;
  }

  @action
  handleChange(event: Event) {
    this.args.row.args.wrapper.setSelectedRow(this.args.row.rowId);
    this.args.onChange?.(event);
  }

  <template>
    <input
      type='radio'
      tabindex='0'
      checked={{this.args.row.isSelected}}
      value={{this.args.row.rowId}}
      id={{this.id}}
      class='cds--structured-list-input cds--visually-hidden'
      name={{this.name}}
      title={{@title}}
      {{on 'change' this.handleChange}}
      ...attributes
    />
  </template>
}

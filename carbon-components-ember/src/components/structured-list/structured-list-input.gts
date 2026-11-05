/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import type StructuredListRow from './structured-list-row.gts';

export interface StructuredListInputSignature {
  Element: HTMLInputElement;
  Args: {
    row: StructuredListRow;
  };
}

/**
 * The visually hidden radio that selects its row from the keyboard. Name it
 * with `title` or `aria-label`, and follow the choice with
 * `{{on "change"}}`, whose input's `value` is the row's `@id`.
 */
export default class StructuredListInput extends Component<StructuredListInputSignature> {
  id = `${guidFor(this)}-structured-list-input`;
  // As in Carbon React, each input is its own group, so Tab visits every row.
  name = `structured-list-input-${guidFor(this)}`;

  select = (event: Event) => {
    const { value } = event.target as HTMLInputElement;
    this.args.row.args.wrapper?.selectRow(value);
  };

  <template>
    {{! A row may only own cells, so the hidden input sits in one; out of flow, it adds no column. }}
    <div role="cell" class="cds--visually-hidden">
      <input
        id={{this.id}}
        name={{this.name}}
        ...attributes
        type="radio"
        tabindex="0"
        checked={{@row.isSelected}}
        value={{@row.rowId}}
        class="cds--structured-list-input cds--visually-hidden"
        {{on "change" this.select}}
      />
    </div>
  </template>
}

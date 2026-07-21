/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface StructuredListCellSignature {
  Element: HTMLDivElement;
  Args: {
    head?: boolean;
    noWrap?: boolean;
  };
  Blocks: {
    default: [];
  };
}

export default class StructuredListCell extends Component<StructuredListCellSignature> {
  <template>
    {{#if @head}}
      <div
        role='columnheader'
        class='cds--structured-list-th
          {{if @noWrap "cds--structured-list-content--nowrap"}}'
        ...attributes
      >
        {{yield}}
      </div>
    {{else}}
      <div
        role='cell'
        class='cds--structured-list-td
          {{if @noWrap "cds--structured-list-content--nowrap"}}'
        ...attributes
      >
        {{yield}}
      </div>
    {{/if}}
  </template>
}

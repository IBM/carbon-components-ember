/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import captureElement from '../../modifiers/capture-element.ts';
import TableCell from './table-cell.gts';

export interface TableExpandedRowSignature {
  Element: HTMLTableRowElement;
  Args: {
    /** How many columns the row's cell spans. */
    colSpan: number;
  };
  Blocks: {
    default: [];
  };
}

/**
 * The row under an expanded `TableExpandRow`, as Carbon React's
 * `TableExpandedRow`. Hovering it highlights the row above.
 */
export default class TableExpandedRow extends Component<TableExpandedRowSignature> {
  row: HTMLElement | undefined;

  setRow = (element: HTMLElement) => {
    this.row = element;
  };

  toggleParentHover(on: boolean) {
    this.row?.previousElementSibling?.classList.toggle(
      'cds--expandable-row--hover',
      on,
    );
  }

  enter = () => this.toggleParentHover(true);

  leave = () => this.toggleParentHover(false);

  <template>
    <tr
      class="cds--expandable-row"
      data-child-row="true"
      {{captureElement this.setRow}}
      {{on "mouseenter" this.enter}}
      {{on "mouseleave" this.leave}}
      ...attributes
    >
      <TableCell colspan={{@colSpan}}>
        <div class="cds--child-row-inner-container">{{yield}}</div>
      </TableCell>
    </tr>
  </template>
}

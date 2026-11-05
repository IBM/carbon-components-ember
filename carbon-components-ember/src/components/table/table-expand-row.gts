/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import type AILabel from '../ai-label.gts';
import ChevronRight from '../icons/chevron-right.ts';
import TableCell from './table-cell.gts';
import TableDecoratorRow from './table-decorator-row.gts';

export interface TableExpandRowSignature {
  Element: HTMLTableRowElement;
  Args: {
    /** The `id`s of the `TableExpandedRow`s the button controls, separated by spaces. */
    ariaControls?: string;
    /** Labels the expand button for assistive technology. */
    ariaLabel?: string;
    /** The `id` of the `TableExpandHeader` above the expand button. Defaults to `expand`. */
    expandHeader?: string;
    /** The expand button's title, and the chevron's label. */
    expandIconDescription?: string;
    /** Whether the row is expanded. */
    isExpanded?: boolean;
    /** Styles the row as selected. */
    isSelected?: boolean;
    /** Called when the expand button is clicked. */
    onExpand: (event: MouseEvent) => void;
  };
  Blocks: {
    /** The row's cells, after the expand button's. */
    default: [];
    /**
     * **Experimental:** the row's AI label, in a cell before the expand
     * button's, as a `TableDecoratorRow` child in Carbon React. Yields an
     * `AILabel` already set up for it. The row takes Carbon's AI row
     * styles, so put only an AI label here.
     */
    decorator: [AILabel: WithBoundArgs<typeof AILabel, 'size'>];
  };
}

/**
 * A row with a button that expands the `TableExpandedRow` after it, as
 * Carbon React's `TableExpandRow`. Keep the expanded state and handle
 * `@onExpand` yourself. The rest props go to the `<tr>`.
 */
export default class TableExpandRow extends Component<TableExpandRowSignature> {
  get ariaExpanded() {
    const { isExpanded } = this.args;
    return isExpanded === undefined ? undefined : String(isExpanded);
  }

  handleExpand = (event: MouseEvent) => {
    this.args.onExpand(event);
  };

  <template>
    <tr
      class="cds--parent-row
        {{if @isExpanded 'cds--expandable-row'}}
        {{if @isSelected 'cds--data-table--selected'}}
        {{if
          (has-block 'decorator')
          'cds--data-table--slug-row cds--data-table--ai-label-row'
        }}"
      data-parent-row="true"
      ...attributes
    >
      {{#if (has-block "decorator")}}
        <TableDecoratorRow>
          <:decorator as |AILabel|>{{yield AILabel to="decorator"}}</:decorator>
        </TableDecoratorRow>
      {{/if}}
      <TableCell
        class="cds--table-expand"
        data-previous-value={{if @isExpanded "collapsed"}}
        headers={{if @expandHeader @expandHeader "expand"}}
      >
        <button
          type="button"
          class="cds--table-expand__button"
          title={{@expandIconDescription}}
          aria-label={{@ariaLabel}}
          aria-expanded={{this.ariaExpanded}}
          aria-controls={{@ariaControls}}
          {{on "click" this.handleExpand}}
        >
          <ChevronRight
            @size="16"
            @svgClass="cds--table-expand__svg"
            @ariaLabel={{@expandIconDescription}}
          />
        </button>
      </TableCell>
      {{yield}}
    </tr>
  </template>
}

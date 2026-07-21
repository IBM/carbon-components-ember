/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { hash } from '@ember/helper';
import type { WithBoundArgs } from '@glint/template';
import Head from './structured-list/-head.gts';
import Body from './structured-list/-body.gts';
import Row from './structured-list/-row.gts';
import Cell from './structured-list/-cell.gts';

export interface StructuredListSignature {
  Element: HTMLDivElement;
  Args: {
    selection?: boolean;
    multiSelection?: boolean;
    isCondensed?: boolean;
    isFlush?: boolean;
    selectedInitialRow?: string;
    selectedRow?: string | null;
    onSelectionChange?: (id: string) => void;
    selectedInitialRows?: string[];
    selectedRows?: string[] | null;
    onMultiSelectionChange?: (ids: string[]) => void;
    ariaLabel?: string;
  };
  Blocks: {
    default: [
      {
        Head: typeof Head;
        Body: typeof Body;
        Row: WithBoundArgs<typeof Row, 'wrapper'>;
        Cell: typeof Cell;
      },
    ];
  };
}

/**
 * StructuredList presents information in a structured format, arranging
 * content into rows and columns.
 *
 * ```gjs
 * <StructuredList as |SL|>
 *   <SL.Head>
 *     <SL.Row @head={{true}}>
 *       <SL.Cell @head={{true}}>Column A</SL.Cell>
 *     </SL.Row>
 *   </SL.Head>
 *   <SL.Body>
 *     <SL.Row>
 *       <SL.Cell>Row 1</SL.Cell>
 *     </SL.Row>
 *   </SL.Body>
 * </StructuredList>
 * ```
 */
export default class StructuredList extends Component<StructuredListSignature> {
  @tracked internalSelectedRow: string | null =
    this.args.selectedInitialRow ?? null;
  @tracked internalSelectedRows: string[] = this.args.selectedInitialRows ?? [];

  get ariaLabel() {
    return this.args.ariaLabel ?? 'Structured list section';
  }

  get isFlush() {
    return this.args.isFlush && !this.args.selection;
  }

  /**
   * The currently selected row id. Pass `@selectedRow` to control selection
   * externally (e.g. to drive it from route/query-param state); otherwise
   * the component tracks it internally, seeded by `@selectedInitialRow`.
   */
  get selectedRow(): string | null {
    return this.args.selectedRow ?? this.internalSelectedRow;
  }

  /**
   * The currently selected row ids, used when `@multiSelection` is enabled.
   * Pass `@selectedRows` to control selection externally; otherwise the
   * component tracks it internally, seeded by `@selectedInitialRows`.
   */
  get selectedRows(): string[] {
    return this.args.selectedRows ?? this.internalSelectedRows;
  }

  isRowSelected(id: string): boolean {
    return this.args.multiSelection
      ? this.selectedRows.includes(id)
      : this.selectedRow === id;
  }

  /**
   * Applies a row selection triggered by user interaction, dispatching to
   * single- or multi-selection handling depending on `@multiSelection`.
   */
  @action
  selectRow(id: string) {
    if (this.args.multiSelection) {
      this.toggleSelectedRow(id);
    } else {
      this.setSelectedRow(id);
    }
  }

  @action
  setSelectedRow(id: string) {
    if (this.internalSelectedRow === id) return;
    this.internalSelectedRow = id;
    this.args.onSelectionChange?.(id);
  }

  @action
  toggleSelectedRow(id: string) {
    const current = this.selectedRows;
    const next = current.includes(id)
      ? current.filter((rowId) => rowId !== id)
      : [...current, id];
    this.internalSelectedRows = next;
    this.args.onMultiSelectionChange?.(next);
  }

  <template>
    <div
      role='table'
      aria-label={{this.ariaLabel}}
      class='cds--structured-list
        {{if @selection "cds--structured-list--selection"}}
        {{if @isCondensed "cds--structured-list--condensed"}}
        {{if this.isFlush "cds--structured-list--flush"}}'
      ...attributes
    >
      {{yield
        (hash
          Head=Head Body=Body Row=(component Row wrapper=this) Cell=Cell
        )
      }}
    </div>
  </template>
}

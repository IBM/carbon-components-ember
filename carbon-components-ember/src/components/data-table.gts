/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import {
  DataTableBatchActions,
  DataTableCell,
  DataTableContainer,
  DataTableExpandHeader,
  DataTableExpandRow,
  DataTableExpandedRow,
  DataTableHeader,
  DataTableRow,
  DataTableSelectAll,
  DataTableSelectRow,
  DataTableTable,
  DataTableToolbar,
} from './data-table/-parts.gts';
import { DataTableState } from './data-table/-state.ts';
import Table from './table/table.gts';
import TableBody from './table/table-body.gts';
import TableHead from './table/table-head.gts';
import TableRow from './table/table-row.gts';

import type { WithBoundArgs } from '@glint/template';
import type {
  DataTableHeader as Header,
  DataTableInputRow,
  DataTableRow as Row,
  FilterRowsFn,
  SortRowFn,
} from './data-table/-state.ts';
import type { TableSignature } from './table/table.gts';

export type {
  DataTableCell,
  DataTableHeader,
  DataTableInputRow,
  DataTableRow,
  FilterRowsFn,
  SortRowFn,
} from './data-table/-state.ts';

export type DataTableTranslationId =
  | 'carbon.table.row.expand'
  | 'carbon.table.row.collapse'
  | 'carbon.table.all.expand'
  | 'carbon.table.all.collapse'
  | 'carbon.table.all.select'
  | 'carbon.table.all.unselect'
  | 'carbon.table.row.select'
  | 'carbon.table.row.unselect';

const defaultTranslations: Record<DataTableTranslationId, string> = {
  'carbon.table.all.expand': 'Expand all rows',
  'carbon.table.all.collapse': 'Collapse all rows',
  'carbon.table.row.expand': 'Expand current row',
  'carbon.table.row.collapse': 'Collapse current row',
  'carbon.table.all.select': 'Select all rows',
  'carbon.table.all.unselect': 'Unselect all rows',
  'carbon.table.row.select': 'Select row',
  'carbon.table.row.unselect': 'Unselect row',
};

/** The values of a row's cells: everything but its `id` and its state. */
export type DataTableCellValue<R> = R[Exclude<
  keyof R,
  'id' | 'disabled' | 'isExpanded' | 'isSelected'
>];

/** The state of the batch actions, as Carbon React's `getBatchActionProps()` returns it. */
export interface DataTableBatchActionProps {
  /** Whether the batch actions show: they are on, and a row is selected. */
  shouldShowBatchActions: boolean;
  /** How many rows are selected, leaving out disabled ones. */
  totalSelected: number;
  /** How many rows there are, filtered out or not. */
  totalCount: number;
  /** Unselects every row and hides the batch actions. */
  onCancel: () => void;
}

/**
 * What `DataTable` yields, as Carbon React's render props: the rows, sorted
 * and filtered, what changes them, and the table parts bound to them in
 * place of React's `getHeaderProps`, `getRowProps` and the rest.
 */
export interface DataTableRenderProps<T = unknown> {
  /** The rows to render, sorted and filtered, each with a cell per header. */
  rows: Row<T>[];
  headers: Header[];
  /** The selected rows, leaving out disabled ones. */
  selectedRows: Row<T>[];
  radio: boolean | undefined;
  /** Sorts by a header's key: ascending, descending, then unsorted. */
  sortBy: (headerKey: string) => void;
  /** Selects every row, or unselects them when any is selected. */
  selectAll: () => void;
  selectRow: (rowId: string) => void;
  expandRow: (rowId: string) => void;
  expandAll: () => void;
  /**
   * What `getBatchActionProps()` gives: whether the batch actions show, and
   * the counts and Cancel they use. `table.TableBatchActions` sets them up.
   */
  batchActionProps: DataTableBatchActionProps;
  /** Filters the rows: give it to a `TableToolbarSearch` as `@onChange`. */
  onInputChange: (event: Event | '', value?: string) => void;
  /** The table, with the `DataTable`'s options (`getTableProps`). */
  Table: WithBoundArgs<typeof DataTableTable, 'table' | 'Table'>;
  /** The container, which yields the `Table` (`getTableContainerProps`). */
  TableContainer: WithBoundArgs<typeof DataTableContainer, 'table'>;
  /** A column header that sorts the table: give it `@header` (`getHeaderProps`). */
  TableHeader: WithBoundArgs<typeof DataTableHeader, 'table'>;
  /** A row: give it `@row` (`getRowProps`). */
  TableRow: WithBoundArgs<typeof DataTableRow, 'table'>;
  /** A row that expands: give it `@row` (`getRowProps`). */
  TableExpandRow: WithBoundArgs<typeof DataTableExpandRow, 'table'>;
  /** A row's details: give it `@row` (`getExpandedRowProps`). */
  TableExpandedRow: WithBoundArgs<typeof DataTableExpandedRow, 'table'>;
  /** The expand column's header (`getExpandHeaderProps`). */
  TableExpandHeader: WithBoundArgs<typeof DataTableExpandHeader, 'table'>;
  /** The header cell that selects every row (`getSelectionProps()`). */
  TableSelectAll: WithBoundArgs<typeof DataTableSelectAll, 'table'>;
  /** The cell that selects a row: give it `@row` (`getSelectionProps({ row })`). */
  TableSelectRow: WithBoundArgs<typeof DataTableSelectRow, 'table'>;
  /** A cell that names its header: give it `@cell` (`getCellProps`). */
  TableCell: WithBoundArgs<typeof DataTableCell, 'table'>;
  /** The toolbar (`getToolbarProps`). */
  TableToolbar: WithBoundArgs<typeof DataTableToolbar, 'table'>;
  /** The batch actions for the selected rows (`getBatchActionProps`). */
  TableBatchActions: WithBoundArgs<typeof DataTableBatchActions, 'table'>;
}

export interface DataTableSignature<
  R extends DataTableInputRow = DataTableInputRow,
> {
  Args: {
    /** The rows: each an `id`, and a value for each header's `key`. */
    rows: R[];
    /** The columns: each a `key` into the rows and a `header` to show. */
    headers: Header[];
    /**
     * **Experimental:** top-aligns the cells once a cell's or header's text
     * wraps. Might have performance issues; intended for smaller tables.
     */
    experimentalAutoAlign?: boolean;
    /** Picks the rows a search shows. Defaults to rows with a cell containing it. */
    filterRows?: FilterRowsFn;
    /** Lets users sort by every header, unless a header says otherwise. */
    isSortable?: boolean;
    /** The locale cells sort in. Defaults to `en`. */
    locale?: string;
    /** Whether an overflow menu in a row shows only on hover. Defaults to `false`. */
    overflowMenuOnHover?: boolean;
    /** Selects one row at a time, with radio buttons. */
    radio?: boolean;
    /** The row height. Defaults to `lg`. */
    size?: TableSignature['Args']['size'];
    /** Compares two cells' values to sort by them. */
    sortRow?: SortRowFn;
    /** Makes the header stay put while the rows scroll. */
    stickyHeader?: boolean;
    /** Returns the text for each message. */
    translateWithId?: (messageId: DataTableTranslationId) => string;
    /** Sets the table's width to `auto` rather than 100%. */
    useStaticWidth?: boolean;
    /** Stripes the rows. */
    useZebraStyles?: boolean;
  };
  Blocks: {
    /**
     * The table, built from the parts it yields. Without a block, it renders
     * the headers and a row per row.
     */
    default: [table: DataTableRenderProps<DataTableCellValue<R>>];
  };
}

// A cell's value as text, in the table without a block.
const display = (value: unknown) =>
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean'
    ? String(value)
    : '';

/**
 * A table that sorts, filters, selects and expands its rows, as Carbon
 * React's `DataTable`: it keeps that state and yields its rows, with the
 * table parts already wired to them. Without a block it renders a plain
 * table of its rows.
 */
export default class DataTable<
  R extends DataTableInputRow = DataTableInputRow,
> extends Component<DataTableSignature<R>> {
  state = new DataTableState(() => this.args);

  // The state keeps any values; these are the rows' own.
  get rows() {
    return this.state.rows as Row<DataTableCellValue<R>>[];
  }

  get selectedRows() {
    return this.state.selectedRows as Row<DataTableCellValue<R>>[];
  }

  #id = guidFor(this);
  prefix = `data-table-${this.#id}`;

  get batchActionProps(): DataTableBatchActionProps {
    return {
      shouldShowBatchActions: this.state.shouldShowBatchActions,
      totalSelected: this.state.selectedRows.length,
      totalCount: this.state.rowIds.length,
      onCancel: this.state.cancel,
    };
  }

  get size() {
    return this.args.size ?? 'lg';
  }

  get overflowMenuOnHover() {
    return this.args.overflowMenuOnHover ?? false;
  }

  get toolbarSize() {
    const { size } = this.args;
    return size === 'xs' || size === 'sm' ? size : undefined;
  }

  t = (messageId: DataTableTranslationId) =>
    (this.args.translateWithId ?? ((id) => defaultTranslations[id]))(messageId);

  headerId = (key: string) => `${this.prefix}__header-${key}`;

  isSortHeader = (key: string) => this.state.sortHeaderKey === key;

  expandedRowId = (rowId: string) => `${this.prefix}-expanded-row-${rowId}`;

  get expandHeaderId() {
    return `${this.prefix}-expand`;
  }

  get allExpandedRowIds() {
    return this.state.rowIds.map(this.expandedRowId).join(' ');
  }

  get selectAllId() {
    return `${this.prefix}__select-all`;
  }

  get selectAllName() {
    return `select-all-${this.#id}`;
  }

  selectRowId = (rowId: string) => `${this.prefix}__select-row-${rowId}`;

  get selectRowName() {
    return `select-row-${this.#id}`;
  }

  get isAllSelected() {
    const count = this.state.rowIds.length;
    return count > 0 && this.state.selectedRows.length === count;
  }

  get isSomeSelected() {
    const count = this.state.rowIds.length;
    const selected = this.state.selectedRows.length;
    return count > 0 && selected > 0 && selected !== count;
  }

  get selectAllLabel() {
    return this.t(
      this.isAllSelected || this.isSomeSelected
        ? 'carbon.table.all.unselect'
        : 'carbon.table.all.select',
    );
  }

  // eslint-disable-next-line ember/template-require-splattributes -- no element of its own; its parts take the attributes
  <template>
    {{~#if (has-block)~}}
      {{~yield
        (hash
          rows=this.rows
          headers=@headers
          selectedRows=this.selectedRows
          radio=@radio
          sortBy=this.state.sortBy
          selectAll=this.state.selectAll
          selectRow=this.state.selectRow
          expandRow=this.state.expandRow
          expandAll=this.state.expandAll
          batchActionProps=this.batchActionProps
          onInputChange=this.state.onInputChange
          Table=(component DataTableTable table=this Table=Table)
          TableContainer=(component DataTableContainer table=this)
          TableHeader=(component DataTableHeader table=this)
          TableRow=(component DataTableRow table=this)
          TableExpandRow=(component DataTableExpandRow table=this)
          TableExpandedRow=(component DataTableExpandedRow table=this)
          TableExpandHeader=(component DataTableExpandHeader table=this)
          TableSelectAll=(component DataTableSelectAll table=this)
          TableSelectRow=(component DataTableSelectRow table=this)
          TableCell=(component DataTableCell table=this)
          TableToolbar=(component DataTableToolbar table=this)
          TableBatchActions=(component DataTableBatchActions table=this)
        )
      ~}}
    {{~else~}}
      <DataTableContainer @table={{this}} as |ContainerTable|>
        <ContainerTable>
          <TableHead>
            <TableRow>
              {{#each @headers key="key" as |header|}}
                <DataTableHeader
                  @table={{this}}
                  @header={{header}}
                >{{header.header}}</DataTableHeader>
              {{/each}}
            </TableRow>
          </TableHead>
          <TableBody>
            {{#each this.state.rows key="id" as |row|}}
              <DataTableRow @table={{this}} @row={{row}}>
                {{#each row.cells key="id" as |cell|}}
                  <DataTableCell @table={{this}} @cell={{cell}}>{{display
                      cell.value
                    }}</DataTableCell>
                {{/each}}
              </DataTableRow>
            {{/each}}
          </TableBody>
        </ContainerTable>
      </DataTableContainer>
    {{~/if~}}
  </template>
}

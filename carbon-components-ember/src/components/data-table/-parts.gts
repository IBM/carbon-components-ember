/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// The table parts DataTable yields, each bound to the table's state: the
// props Carbon React's DataTable hands out through `getHeaderProps`,
// `getRowProps` and the rest.

import Component from '@glimmer/component';
import TableBatchActions from '../table/table-batch-actions.gts';
import TableCell from '../table/table-cell.gts';
import TableContainer from '../table/table-container.gts';
import TableExpandHeader from '../table/table-expand-header.gts';
import TableExpandRow from '../table/table-expand-row.gts';
import TableExpandedRow from '../table/table-expanded-row.gts';
import TableHeader from '../table/table-header.gts';
import TableRow from '../table/table-row.gts';
import TableSelectAll from '../table/table-select-all.gts';
import TableSelectRow from '../table/table-select-row.gts';
import TableToolbar from '../table/table-toolbar.gts';

import type { TOC } from '@ember/component/template-only';
import type { ComponentLike, WithBoundArgs } from '@glint/template';
import type DataTable from '../data-table.gts';
import type { DataTableSignature } from '../data-table.gts';
import type { TableBatchActionsSignature } from '../table/table-batch-actions.gts';
import type { TableCellSignature } from '../table/table-cell.gts';
import type { TableContainerSignature } from '../table/table-container.gts';
import type { TableExpandHeaderSignature } from '../table/table-expand-header.gts';
import type { TableExpandRowSignature } from '../table/table-expand-row.gts';
import type { TableExpandedRowSignature } from '../table/table-expanded-row.gts';
import type {
  SortState,
  TableHeaderSignature,
} from '../table/table-header.gts';
import type { TableRowSignature } from '../table/table-row.gts';
import type { TableSelectAllSignature } from '../table/table-select-all.gts';
import type { TableSelectRowSignature } from '../table/table-select-row.gts';
import type { TableToolbarSignature } from '../table/table-toolbar.gts';
import type { TableSignature } from '../table/table.gts';
import type {
  DataTableCell as Cell,
  DataTableHeader as Header,
  DataTableRow as Row,
} from './-state.ts';

// What the parts read from the DataTable that yields them, whatever its rows.
type DataTableContext = Pick<
  DataTable,
  | 'state'
  | 'size'
  | 'overflowMenuOnHover'
  | 'toolbarSize'
  | 't'
  | 'headerId'
  | 'isSortHeader'
  | 'expandedRowId'
  | 'expandHeaderId'
  | 'allExpandedRowIds'
  | 'selectAllId'
  | 'selectAllName'
  | 'selectRowId'
  | 'selectRowName'
  | 'isAllSelected'
  | 'isSomeSelected'
  | 'selectAllLabel'
> & {
  args: Pick<
    DataTableSignature['Args'],
    | 'experimentalAutoAlign'
    | 'isSortable'
    | 'radio'
    | 'stickyHeader'
    | 'useStaticWidth'
    | 'useZebraStyles'
  >;
};

interface Bound {
  /** The `DataTable` the part belongs to. Set by the `DataTable` that yields it. */
  table: DataTableContext;
}

export interface DataTableTableSignature {
  Element: TableSignature['Element'];
  Args: Bound & {
    /**
     * The table to render with the `DataTable`'s options: the `Table`, or a
     * container's, which names it. Set by whatever yields this.
     */
    Table: ComponentLike<{
      Element: TableSignature['Element'];
      Args: Omit<TableSignature['Args'], 'container'>;
      Blocks: TableSignature['Blocks'];
    }>;
  };
  Blocks: TableSignature['Blocks'];
}

/** A `Table` with the `DataTable`'s options, as `getTableProps` gives them. */
export const DataTableTable: TOC<DataTableTableSignature> = <template>
  <@Table
    @experimentalAutoAlign={{@table.args.experimentalAutoAlign}}
    @isSortable={{@table.args.isSortable}}
    @overflowMenuOnHover={{@table.overflowMenuOnHover}}
    @size={{@table.size}}
    @stickyHeader={{@table.args.stickyHeader}}
    @useStaticWidth={{@table.args.useStaticWidth}}
    @useZebraStyles={{@table.args.useZebraStyles}}
    ...attributes
  >{{yield}}</@Table>
</template>;

export interface DataTableContainerSignature {
  Element: TableContainerSignature['Element'];
  Args: Bound & {
    aiEnabled?: TableContainerSignature['Args']['aiEnabled'];
    description?: TableContainerSignature['Args']['description'];
    title?: TableContainerSignature['Args']['title'];
  };
  Blocks: {
    /** The table, named by the title and description, with the `DataTable`'s options. */
    default: [Table: WithBoundArgs<typeof DataTableTable, 'table' | 'Table'>];
    decorator: [];
  };
}

export const DataTableContainer: TOC<DataTableContainerSignature> = <template>
  {{~#if (has-block "decorator")~}}
    <TableContainer
      @aiEnabled={{@aiEnabled}}
      @description={{@description}}
      @stickyHeader={{@table.args.stickyHeader}}
      @title={{@title}}
      @useStaticWidth={{@table.args.useStaticWidth}}
      ...attributes
    >
      <:default as |ContainerTable|>
        {{yield (component DataTableTable table=@table Table=ContainerTable)}}
      </:default>
      <:decorator>{{yield to="decorator"}}</:decorator>
    </TableContainer>
  {{~else~}}
    <TableContainer
      @aiEnabled={{@aiEnabled}}
      @description={{@description}}
      @stickyHeader={{@table.args.stickyHeader}}
      @title={{@title}}
      @useStaticWidth={{@table.args.useStaticWidth}}
      ...attributes
      as |ContainerTable|
    >
      {{yield (component DataTableTable table=@table Table=ContainerTable)}}
    </TableContainer>
  {{~/if~}}
</template>;

export interface DataTableHeaderSignature {
  Element: TableHeaderSignature['Element'];
  Args: Bound &
    Omit<TableHeaderSignature['Args'], 'isSortHeader' | 'sortDirection'> & {
      /** The header this column shows, from the `DataTable`'s `@headers`. */
      header: Header;
      /**
       * Called after a click has sorted the table, with the event and the
       * new sort: the header's key and direction.
       */
      onClick?: (
        event: MouseEvent,
        sort: { sortHeaderKey: string; sortDirection: SortState },
      ) => void;
    };
  Blocks: TableHeaderSignature['Blocks'];
}

/** A column header that sorts the table, as `getHeaderProps` sets one up. */
export class DataTableHeader extends Component<DataTableHeaderSignature> {
  get isSortable() {
    return (
      this.args.isSortable ??
      this.args.header.isSortable ??
      this.args.table.args.isSortable
    );
  }

  // A header that doesn't sort drops the click, as React's TableHeader does.
  sort = (event: MouseEvent) => {
    if (!this.isSortable) return;
    const { header, table, onClick } = this.args;
    table.state.sortBy(header.key);
    onClick?.(event, {
      sortHeaderKey: header.key,
      sortDirection: table.state.sortDirection,
    });
  };

  <template>
    {{~#if (has-block "decorator")~}}
      <TableHeader
        @className={{@className}}
        @colSpan={{@colSpan}}
        @id={{if @id @id (@table.headerId @header.key)}}
        @isSortHeader={{@table.isSortHeader @header.key}}
        @isSortable={{this.isSortable}}
        @scope={{@scope}}
        @sortDirection={{@table.state.sortDirection}}
        @translateWithId={{@translateWithId}}
        ...attributes
        {{on "click" this.sort}}
      >
        <:default>{{yield}}</:default>
        <:decorator as |AILabel|>{{yield AILabel to="decorator"}}</:decorator>
      </TableHeader>
    {{~else~}}
      <TableHeader
        @className={{@className}}
        @colSpan={{@colSpan}}
        @id={{if @id @id (@table.headerId @header.key)}}
        @isSortHeader={{@table.isSortHeader @header.key}}
        @isSortable={{this.isSortable}}
        @scope={{@scope}}
        @sortDirection={{@table.state.sortDirection}}
        @translateWithId={{@translateWithId}}
        ...attributes
        {{on "click" this.sort}}
      >{{yield}}</TableHeader>
    {{~/if~}}
  </template>
}

export interface DataTableRowSignature {
  Element: TableRowSignature['Element'];
  Args: Bound & {
    /** The row it renders, from the rows the `DataTable` yields. */
    row: Row;
  };
  Blocks: TableRowSignature['Blocks'];
}

/** A row, selected as its row is, as `getRowProps` sets one up. */
export const DataTableRow: TOC<DataTableRowSignature> = <template>
  <TableRow @isSelected={{@row.isSelected}} ...attributes>{{yield}}</TableRow>
</template>;

export interface DataTableExpandRowSignature {
  Element: TableExpandRowSignature['Element'];
  Args: Bound &
    Pick<TableExpandRowSignature['Args'], 'expandIconDescription'> & {
      /** The row it renders, from the rows the `DataTable` yields. */
      row: Row;
      /** Called after the row expands or collapses, with the click. */
      onExpand?: (event: MouseEvent) => void;
    };
  Blocks: TableExpandRowSignature['Blocks'];
}

/** A row that expands, as `getRowProps` sets one up. */
export class DataTableExpandRow extends Component<DataTableExpandRowSignature> {
  expand = (event: MouseEvent) => {
    this.args.table.state.expandRow(this.args.row.id);
    this.args.onExpand?.(event);
  };

  get ariaLabel() {
    return this.args.table.t(
      this.args.row.isExpanded
        ? 'carbon.table.row.collapse'
        : 'carbon.table.row.expand',
    );
  }

  <template>
    {{~#if (has-block "decorator")~}}
      <TableExpandRow
        @ariaControls={{@table.expandedRowId @row.id}}
        @ariaLabel={{this.ariaLabel}}
        @expandHeader={{@table.expandHeaderId}}
        @expandIconDescription={{@expandIconDescription}}
        @isExpanded={{@row.isExpanded}}
        @isSelected={{@row.isSelected}}
        @onExpand={{this.expand}}
        ...attributes
      >
        <:default>{{yield}}</:default>
        <:decorator as |AILabel|>{{yield AILabel to="decorator"}}</:decorator>
      </TableExpandRow>
    {{~else~}}
      <TableExpandRow
        @ariaControls={{@table.expandedRowId @row.id}}
        @ariaLabel={{this.ariaLabel}}
        @expandHeader={{@table.expandHeaderId}}
        @expandIconDescription={{@expandIconDescription}}
        @isExpanded={{@row.isExpanded}}
        @isSelected={{@row.isSelected}}
        @onExpand={{this.expand}}
        ...attributes
      >{{yield}}</TableExpandRow>
    {{~/if~}}
  </template>
}

export interface DataTableExpandedRowSignature {
  Element: TableExpandedRowSignature['Element'];
  Args: Bound &
    TableExpandedRowSignature['Args'] & {
      /** The row it details, from the rows the `DataTable` yields. */
      row: Row;
    };
  Blocks: TableExpandedRowSignature['Blocks'];
}

/** The details of an expanded row, which its expand button controls. */
export const DataTableExpandedRow: TOC<DataTableExpandedRowSignature> =
  <template>
    <TableExpandedRow
      @colSpan={{@colSpan}}
      ...attributes
      id={{@table.expandedRowId @row.id}}
    >{{yield}}</TableExpandedRow>
  </template>;

export interface DataTableExpandHeaderSignature {
  Element: TableExpandHeaderSignature['Element'];
  Args: Bound &
    Pick<
      TableExpandHeaderSignature['Args'],
      'enableToggle' | 'expandIconDescription'
    > & {
      /** Called after the rows expand or collapse, with the click. */
      onExpand?: (event: MouseEvent) => void;
      /** Called after `onExpand`, with the click and whether the rows were expanded before it. */
      onClick?: (event: MouseEvent, expand: { isExpanded: boolean }) => void;
    };
  Blocks: TableExpandHeaderSignature['Blocks'];
}

/** The expand column's header, which expands every row, as `getExpandHeaderProps` sets one up. */
export class DataTableExpandHeader extends Component<DataTableExpandHeaderSignature> {
  expand = (event: MouseEvent) => {
    const { isExpandedAll: isExpanded } = this.args.table.state;
    this.args.table.state.expandAll();
    this.args.onExpand?.(event);
    this.args.onClick?.(event, { isExpanded });
  };

  get ariaLabel() {
    return this.args.table.t(
      this.args.table.state.isExpandedAll
        ? 'carbon.table.all.collapse'
        : 'carbon.table.all.expand',
    );
  }

  <template>
    <TableExpandHeader
      @ariaControls={{@table.allExpandedRowIds}}
      @ariaLabel={{this.ariaLabel}}
      @enableToggle={{@enableToggle}}
      @expandIconDescription={{@expandIconDescription}}
      @id={{@table.expandHeaderId}}
      @isExpanded={{@table.state.isExpandedAll}}
      @onExpand={{this.expand}}
      ...attributes
    >{{yield}}</TableExpandHeader>
  </template>
}

export interface DataTableSelectAllSignature {
  Element: TableSelectAllSignature['Element'];
  Args: Bound & {
    /** Called after the rows are selected or unselected, with the click. */
    onSelect?: (event: MouseEvent) => void;
  };
}

/** The header cell that selects every row, as `getSelectionProps()` sets one up. */
export class DataTableSelectAll extends Component<DataTableSelectAllSignature> {
  select = (event: MouseEvent) => {
    this.args.table.state.selectAll();
    this.args.onSelect?.(event);
  };

  <template>
    <TableSelectAll
      @ariaLabel={{@table.selectAllLabel}}
      @checked={{@table.isAllSelected}}
      @id={{@table.selectAllId}}
      @indeterminate={{@table.isSomeSelected}}
      @name={{@table.selectAllName}}
      @onSelect={{this.select}}
      ...attributes
    />
  </template>
}

export interface DataTableSelectRowSignature {
  Element: TableSelectRowSignature['Element'];
  Args: Bound &
    Pick<TableSelectRowSignature['Args'], 'onChange'> & {
      /** The row it selects, from the rows the `DataTable` yields. */
      row: Row;
      /** Called after the row is selected or unselected, with the click. */
      onSelect?: (event: MouseEvent) => void;
    };
}

/** The cell that selects its row, as `getSelectionProps({ row })` sets one up. */
export class DataTableSelectRow extends Component<DataTableSelectRowSignature> {
  select = (event: MouseEvent) => {
    this.args.table.state.selectRow(this.args.row.id);
    this.args.onSelect?.(event);
  };

  get ariaLabel() {
    return this.args.table.t(
      this.args.row.isSelected
        ? 'carbon.table.row.unselect'
        : 'carbon.table.row.select',
    );
  }

  <template>
    <TableSelectRow
      @ariaLabel={{this.ariaLabel}}
      @checked={{@row.isSelected}}
      @disabled={{@row.disabled}}
      @id={{@table.selectRowId @row.id}}
      @name={{@table.selectRowName}}
      @onChange={{@onChange}}
      @onSelect={{this.select}}
      @radio={{@table.args.radio}}
      ...attributes
    />
  </template>
}

export interface DataTableCellSignature {
  Element: TableCellSignature['Element'];
  Args: Bound & {
    /** The cell it renders, from a row the `DataTable` yields. */
    cell: Cell;
  };
  Blocks: TableCellSignature['Blocks'];
}

/** A cell that names its column's header, as `getCellProps` sets one up. */
export const DataTableCell: TOC<DataTableCellSignature> = <template>
  <TableCell
    @hasAILabelHeader={{@cell.hasAILabelHeader}}
    headers={{@table.headerId @cell.info.header}}
    ...attributes
  >{{yield}}</TableCell>
</template>;

export interface DataTableToolbarSignature {
  Element: TableToolbarSignature['Element'];
  Args: Bound & {};
  Blocks: TableToolbarSignature['Blocks'];
}

/** The toolbar, the table's size when it's `xs` or `sm`, as `getToolbarProps` sets it up. */
export const DataTableToolbar: TOC<DataTableToolbarSignature> = <template>
  <TableToolbar @size={{@table.toolbarSize}} ...attributes as |Content|>
    {{yield Content}}
  </TableToolbar>
</template>;

export interface DataTableBatchActionsSignature {
  Element: TableBatchActionsSignature['Element'];
  Args: Bound & {
    onSelectAll?: TableBatchActionsSignature['Args']['onSelectAll'];
    /** The number of rows "Select all" names. Defaults to every row, filtered out or not. */
    totalCount?: TableBatchActionsSignature['Args']['totalCount'];
    translateWithId?: TableBatchActionsSignature['Args']['translateWithId'];
  };
  Blocks: TableBatchActionsSignature['Blocks'];
}

/** The batch actions for the selected rows, as `getBatchActionProps` sets them up. */
export class DataTableBatchActions extends Component<DataTableBatchActionsSignature> {
  get totalCount() {
    return this.args.totalCount ?? this.args.table.state.rowIds.length;
  }

  <template>
    <TableBatchActions
      @onCancel={{@table.state.cancel}}
      @onSelectAll={{@onSelectAll}}
      @shouldShowBatchActions={{@table.state.shouldShowBatchActions}}
      @totalCount={{this.totalCount}}
      @totalSelected={{@table.state.selectedRows.length}}
      @translateWithId={{@translateWithId}}
      ...attributes
    >{{yield}}</TableBatchActions>
  </template>
}

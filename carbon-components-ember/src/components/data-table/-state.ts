/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { cached, tracked } from '@glimmer/tracking';
import { sortStates } from '../table/table-header.gts';

import type { SortState } from '../table/table-header.gts';

/** A cell of a `DataTable` row, as Carbon React's `DataTableCell`. */
export interface DataTableCell<T = unknown> {
  id: string;
  value: T;
  isEditable: boolean;
  isEditing: boolean;
  isValid: boolean;
  errors: null | Error[];
  info: { header: string };
  hasAILabelHeader?: boolean;
}

/** A row `DataTable` yields, with a cell per header, as Carbon React's `DataTableRow`. */
export interface DataTableRow<T = unknown> {
  id: string;
  cells: DataTableCell<T>[];
  disabled?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
}

/** A row of `DataTable`'s `@rows`: its `id`, and its value for each header's `key`. */
export type DataTableInputRow = Omit<DataTableRow, 'cells'> &
  Record<string, unknown>;

/** A column of `DataTable`'s `@headers`, as Carbon React's `DataTableHeader`. */
export interface DataTableHeader {
  key: string;
  header: string;
  isSortable?: boolean;
  /**
   * Set it on a column that shows an AI label (its header's `decorator`
   * block), as Carbon React's `decorator` and `slug`: its cells take the
   * AI column styles.
   */
  decorator?: unknown;
  /** The same as `decorator`, as Carbon React's deprecated `slug`. */
  slug?: unknown;
}

/** What `@sortRow` gets besides the two cells' values. */
export interface SortRowParams {
  key: string;
  sortDirection: SortState;
  sortStates: typeof sortStates;
  locale: string;
  compare: typeof compare;
  rowIds: string[];
}

export type SortRowFn = (
  cellA: unknown,
  cellB: unknown,
  params: SortRowParams,
) => number;

export type FilterRowsFn = (options: {
  cellsById: Record<string, DataTableCell>;
  getCellId: typeof getCellId;
  headers: DataTableHeader[];
  inputValue: string;
  rowIds: string[];
}) => string[];

export const getCellId = (rowId: string, header: string) =>
  `${rowId}:${header}`;

export const isSelectedRow = (row: {
  isSelected?: boolean;
  disabled?: boolean;
}) => row.isSelected === true && !row.disabled;

const compareStrings = (a: string, b: string, locale = 'en') => {
  const isNumeric = !isNaN(parseFloat(a)) && !isNaN(parseFloat(b));
  return a.localeCompare(b, locale, { numeric: isNumeric });
};

/** Compares two cell values, as Carbon React's `compare`: numbers as numbers, the rest as text. */
export function compare(a: unknown, b: unknown, locale = 'en') {
  if (a === null) a = '';
  if (b === null) b = '';
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'string' && typeof b === 'string') {
    return compareStrings(a, b, locale);
  }
  return compareStrings(String(a), String(b), locale);
}

export const defaultSortRow: SortRowFn = (
  cellA,
  cellB,
  { sortDirection, locale },
) =>
  sortDirection === sortStates.ASC
    ? compare(cellA, cellB, locale)
    : compare(cellB, cellA, locale);

export const defaultFilterRows: FilterRowsFn = ({
  rowIds,
  headers,
  cellsById,
  inputValue,
}) => {
  const input = inputValue.trim().toLowerCase();
  if (!input) return rowIds;

  return rowIds.filter((rowId) =>
    headers.some(({ key }) => {
      const cell = cellsById[getCellId(rowId, key)];
      if (!cell || typeof cell.value === 'boolean') return false;
      return String(cell.value).toLowerCase().includes(input);
    }),
  );
};

/** The next direction for a click on header `key`: ascending, descending, then unsorted. */
export function getNextSortDirection(
  key: string,
  sortHeaderKey: string | null,
  sortDirection: SortState,
): SortState {
  if (key !== sortHeaderKey) return sortStates.ASC;
  if (sortDirection === sortStates.NONE) return sortStates.ASC;
  if (sortDirection === sortStates.ASC) return sortStates.DESC;
  return sortStates.NONE;
}

export interface DataTableStateArgs {
  rows: DataTableInputRow[];
  headers: DataTableHeader[];
  locale?: string;
  sortRow?: SortRowFn;
  filterRows?: FilterRowsFn;
  radio?: boolean;
}

// What users change about a row, which stays while the row stays in `@rows`.
class RowFlags {
  @tracked isSelected: boolean;
  @tracked isExpanded: boolean;

  constructor(isSelected: boolean, isExpanded: boolean) {
    this.isSelected = isSelected;
    this.isExpanded = isExpanded;
  }
}

// A row yielded to templates. It is replaced only when its `disabled` or a
// cell changes, and selecting or expanding it updates it in place, so an
// unkeyed `{{#each}}` keeps its elements, and their focus. Like React's plain
// object, it has `isSelected` and `isExpanded` as enumerable own properties.
class Row<T = unknown> implements DataTableRow<T> {
  readonly id: string;
  readonly disabled: boolean;
  readonly cells: DataTableCell<T>[];
  declare isSelected: boolean;
  declare isExpanded: boolean;
  #flags: RowFlags;

  constructor(
    id: string,
    disabled: boolean,
    cells: DataTableCell<T>[],
    flags: RowFlags,
  ) {
    this.id = id;
    this.disabled = disabled;
    this.cells = cells;
    this.#flags = flags;
    for (const key of ['isSelected', 'isExpanded'] as const) {
      Object.defineProperty(this, key, {
        enumerable: true,
        get: () => flags[key],
        set: (value: boolean) => {
          flags[key] = value;
        },
      });
    }
  }

  static flagsOf(row: Row) {
    return row.#flags;
  }

  // What a handler gets: the row as it is now.
  snapshot(): DataTableRow<T> {
    return {
      id: this.id,
      disabled: this.disabled,
      cells: this.cells,
      isSelected: this.isSelected,
      isExpanded: this.isExpanded,
    };
  }
}

/**
 * The state Carbon React's `DataTable` keeps: its rows in order, sorted and
 * filtered, and which are selected and expanded. The rows come from the
 * args each time, so new `@rows` keep the sort, the filter, and the
 * selection and expansion of the rows that stay. A row that leaves `@rows`
 * loses them, and starts from its own `isSelected` and `isExpanded` when it
 * returns. A new `@rows` array restarts a sort's tie order from the rows' own.
 */
export class DataTableState {
  @tracked sortHeaderKey: string | null = null;
  @tracked sortDirection: SortState = sortStates.NONE;
  @tracked filterInputValue: string | null = null;
  @tracked private shownTick = 0;
  #shown = false;
  #shownSource: object | null = null;

  #args: () => DataTableStateArgs;
  #rows = new Map<string, Row>();
  #cells = new Map<string, DataTableCell>();
  // The order a sort starts from: the one the last click saw, as React's.
  #sortBase: { source: object; ids: string[] } | null = null;

  constructor(args: () => DataTableStateArgs) {
    this.#args = args;
  }

  get args() {
    return this.#args();
  }

  // Reuses the rows and cells that did not change, and drops those of rows
  // that left.
  @cached
  get normalized() {
    const { rows, headers } = this.args;
    const rowsById: Record<string, Row> = {};
    const cellsById: Record<string, DataTableCell> = {};
    const prevRows = this.#rows;
    const prevCells = this.#cells;
    this.#rows = new Map();
    this.#cells = new Map();

    for (const input of rows) {
      const cells = headers.map(({ key, slug, decorator }) => {
        const id = getCellId(input.id, key);
        const value = input[key];
        const hasAILabelHeader = Boolean(slug || decorator);
        const prev = prevCells.get(id);
        const cell =
          prev &&
          Object.is(prev.value, value) &&
          prev.hasAILabelHeader === hasAILabelHeader
            ? prev
            : {
                id,
                value,
                isEditable: false,
                isEditing: false,
                isValid: true,
                errors: null,
                hasAILabelHeader,
                info: { header: key },
              };
        this.#cells.set(id, cell);
        cellsById[id] = cell;
        return cell;
      });

      const prev = prevRows.get(input.id);
      const disabled = input.disabled ?? false;
      const row =
        prev &&
        prev.disabled === disabled &&
        prev.cells.length === cells.length &&
        prev.cells.every((cell, i) => cell === cells[i])
          ? prev
          : new Row(
              input.id,
              disabled,
              cells,
              prev
                ? Row.flagsOf(prev)
                : new RowFlags(
                    input.isSelected ?? false,
                    input.isExpanded ?? false,
                  ),
            );
      this.#rows.set(input.id, row);
      rowsById[input.id] = row;
    }

    return { rowIds: rows.map((row) => row.id), rowsById, cellsById };
  }

  /** Every row's id, in the sort order. */
  @cached
  get rowIds() {
    const normalized = this.normalized;
    const { rowIds, cellsById } = normalized;
    const { sortHeaderKey: key, sortDirection } = this;

    if (key === null || sortDirection === sortStates.NONE) return rowIds;

    const { locale = 'en', sortRow = defaultSortRow } = this.args;
    const base = this.#sortBase;
    const start = base?.source === normalized ? base.ids : rowIds;
    return start
      .slice()
      .sort((a, b) =>
        sortRow(
          cellsById[getCellId(a, key)]?.value,
          cellsById[getCellId(b, key)]?.value,
          { key, sortDirection, sortStates, locale, compare, rowIds: [a, b] },
        ),
      );
  }

  /** The ids of the rows the filter shows, in the sort order. */
  @cached
  get filteredRowIds() {
    const { rowIds } = this;
    if (typeof this.filterInputValue !== 'string') return rowIds;

    const { headers, filterRows = defaultFilterRows } = this.args;
    return filterRows({
      cellsById: this.normalized.cellsById,
      getCellId,
      headers,
      inputValue: this.filterInputValue,
      rowIds,
    });
  }

  /** The rows to render. */
  get rows(): DataTableRow[] {
    const { rowsById } = this.normalized;
    return this.filteredRowIds.map((id) => rowsById[id]!);
  }

  /** The selected rows, leaving out disabled ones. */
  get selectedRows(): DataTableRow[] {
    const { rowsById } = this.normalized;
    return this.rowIds
      .map((id) => rowsById[id]!)
      .filter((row) => isSelectedRow(row))
      .map((row) => row.snapshot());
  }

  get isExpandedAll() {
    const { rowsById } = this.normalized;
    return this.rowIds.every((id) => rowsById[id]!.isExpanded);
  }

  // Hidden for good when new rows leave none selected, as React's
  // `getDerivedStateFromProps` does.
  get showBatchActions() {
    void this.shownTick;
    const { normalized } = this;
    if (this.#shownSource !== normalized) {
      this.#shownSource = normalized;
      if (!Object.values(normalized.rowsById).some(isSelectedRow)) {
        this.#shown = false;
      }
    }
    return this.#shown;
  }

  set showBatchActions(value: boolean) {
    this.#shownSource = this.normalized;
    this.#shown = value;
    this.shownTick++;
  }

  get shouldShowBatchActions() {
    return this.showBatchActions && this.selectedRows.length > 0;
  }

  sortBy = (key: string) => {
    this.#sortBase = { source: this.normalized, ids: this.rowIds };
    this.sortDirection = getNextSortDirection(
      key,
      this.sortHeaderKey,
      this.sortDirection,
    );
    this.sortHeaderKey = key;
  };

  // Selects or unselects every row the filter shows, leaving out disabled ones.
  #selectAll(isSelected: boolean) {
    const { rowsById } = this.normalized;
    for (const id of this.filteredRowIds) {
      const row = rowsById[id]!;
      if (!row.disabled) row.isSelected = isSelected;
    }
  }

  selectAll = () => {
    const isSelected = !Object.values(this.normalized.rowsById).some(
      isSelectedRow,
    );
    this.showBatchActions = isSelected;
    this.#selectAll(isSelected);
  };

  /** Unselects every row and hides the batch actions, as their Cancel does. */
  cancel = () => {
    this.showBatchActions = false;
    this.#selectAll(false);
  };

  selectRow = (rowId: string) => {
    const { rowsById } = this.normalized;
    const row = rowsById[rowId];
    if (!row) return;

    if (this.args.radio) {
      for (const each of Object.values(rowsById)) {
        each.isSelected = each.id === rowId;
      }
      this.showBatchActions = false;
      return;
    }

    const selectedCount = Object.values(rowsById).filter(
      (each) => each.isSelected,
    ).length;
    this.showBatchActions = !row.isSelected || selectedCount - 1 > 0;
    row.isSelected = !row.isSelected;
  };

  expandRow = (rowId: string) => {
    const row = this.normalized.rowsById[rowId];
    if (row) row.isExpanded = !row.isExpanded;
  };

  expandAll = () => {
    const { rowsById } = this.normalized;
    const isExpanded = !this.isExpandedAll;
    for (const row of Object.values(rowsById)) row.isExpanded = isExpanded;
  };

  /**
   * Filters the rows by a search's value, as Carbon React's `onInputChange`:
   * the value given, or the input's.
   */
  onInputChange = (event: Event | '', value?: string) => {
    this.filterInputValue =
      value ?? (event === '' ? '' : (event.target as HTMLInputElement).value);
  };
}

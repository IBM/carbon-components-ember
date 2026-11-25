import { module, test } from 'qunit';
import { tracked } from '@glimmer/tracking';
import { DataTableState, compare } from '#src/components/data-table/-state.ts';

import type {
  DataTableRow,
  DataTableHeader,
  DataTableInputRow,
  DataTableStateArgs,
} from '#src/components/data-table/-state.ts';

const HEADERS = [
  { key: 'name', header: 'Name' },
  { key: 'port', header: 'Port' },
];

const ROWS: DataTableInputRow[] = [
  { id: 'a', name: 'Load balancer 10', port: 443 },
  { id: 'b', name: 'Load balancer 2', port: 80 },
  { id: 'c', name: 'Load balancer 1', port: 3000, disabled: true },
];

class Args implements DataTableStateArgs {
  @tracked rows = ROWS;
  @tracked headers: DataTableHeader[] = HEADERS;
  @tracked radio = false;
}

const setup = () => {
  const args = new Args();
  return { args, state: new DataTableState(() => args) };
};

const ids = (state: DataTableState) => state.rows.map((row) => row.id);

module('Unit | data-table state', function () {
  test('it yields a cell per header, as Carbon React does', function (assert) {
    const { state } = setup();
    const [first] = state.rows;

    assert.deepEqual(
      {
        id: first!.id,
        isSelected: first!.isSelected,
        isExpanded: first!.isExpanded,
        disabled: first!.disabled,
      },
      { id: 'a', isSelected: false, isExpanded: false, disabled: false },
    );
    assert.deepEqual(first!.cells, [
      {
        id: 'a:name',
        value: 'Load balancer 10',
        isEditable: false,
        isEditing: false,
        isValid: true,
        errors: null,
        hasAILabelHeader: false,
        info: { header: 'name' },
      },
      {
        id: 'a:port',
        value: 443,
        isEditable: false,
        isEditing: false,
        isValid: true,
        errors: null,
        hasAILabelHeader: false,
        info: { header: 'port' },
      },
    ]);
  });

  test("a header's decorator or slug marks its cells, as in Carbon React", function (assert) {
    const { args, state } = setup();
    args.headers = [
      { key: 'name', header: 'Name', decorator: true },
      { key: 'port', header: 'Port', slug: true },
      { key: 'rule', header: 'Rule' },
    ];

    assert.deepEqual(
      state.rows[0]!.cells.map((cell) => cell.hasAILabelHeader),
      [true, true, false],
    );
  });

  test("sorting cycles ascending, descending, then the rows' own order", function (assert) {
    const { state } = setup();

    state.sortBy('name');
    assert.deepEqual(
      ids(state),
      ['c', 'a', 'b'],
      'text sorts as text unless it starts with a number, as in Carbon React',
    );
    state.sortBy('name');
    assert.deepEqual(ids(state), ['b', 'a', 'c']);
    state.sortBy('name');
    assert.deepEqual(ids(state), ['a', 'b', 'c']);
    assert.strictEqual(state.sortDirection, 'NONE');

    state.sortBy('port');
    assert.deepEqual(
      ids(state),
      ['b', 'a', 'c'],
      'another header sorts ascending',
    );
    assert.strictEqual(state.sortHeaderKey, 'port');
  });

  test('@sortRow sorts with its own comparison', function (assert) {
    const state = new DataTableState(() => ({
      rows: ROWS,
      headers: HEADERS,
      sortRow: (a, b, params) => params.compare(b, a, params.locale),
    }));

    state.sortBy('port');
    assert.deepEqual(ids(state), ['c', 'a', 'b']);
  });

  test('compare treats null as empty and numbers as numbers', function (assert) {
    assert.true(compare(null, 'a') < 0);
    assert.true(compare(2, 10) < 0);
    assert.true(compare('2', '10') < 0);
    assert.true(compare('b', 'a') > 0);
  });

  test("the filter matches any cell's text, but not booleans", function (assert) {
    const { args, state } = setup();
    args.rows = [...ROWS, { id: 'd', name: 'true', port: true }];

    state.onInputChange('', ' BALANCER 1 ');
    assert.deepEqual(ids(state), ['a', 'c']);

    const input = document.createElement('input');
    input.addEventListener('input', (event) => state.onInputChange(event));
    input.value = '80';
    input.dispatchEvent(new Event('input'));
    assert.deepEqual(ids(state), ['b'], "an input's value");

    state.onInputChange('', 'true');
    assert.deepEqual(
      ids(state),
      ['d'],
      'the name matches; the boolean port does not',
    );
  });

  test('select all selects the rows the filter shows, leaving out disabled ones', function (assert) {
    const { state } = setup();

    state.selectAll();
    assert.deepEqual(
      state.selectedRows.map((row) => row.id),
      ['a', 'b'],
    );
    assert.true(state.shouldShowBatchActions);

    state.selectAll();
    assert.deepEqual(state.selectedRows, [], 'a second click unselects');
    assert.false(state.shouldShowBatchActions);

    state.onInputChange('', 'balancer 2');
    state.selectAll();
    assert.deepEqual(
      state.selectedRows.map((row) => row.id),
      ['b'],
    );

    state.cancel();
    assert.deepEqual(state.selectedRows, []);
    assert.false(state.shouldShowBatchActions);
  });

  test('selecting rows shows the batch actions until none is selected', function (assert) {
    const { state } = setup();

    state.selectRow('a');
    state.selectRow('b');
    assert.deepEqual(
      state.selectedRows.map((row) => row.id),
      ['a', 'b'],
    );
    assert.true(state.shouldShowBatchActions);

    state.selectRow('a');
    assert.true(state.shouldShowBatchActions);
    state.selectRow('b');
    assert.false(state.shouldShowBatchActions);
  });

  test('with @radio, one row is selected at a time', function (assert) {
    const { args, state } = setup();
    args.radio = true;

    state.selectRow('a');
    state.selectRow('b');
    assert.deepEqual(
      state.selectedRows.map((row) => row.id),
      ['b'],
    );
    assert.false(state.shouldShowBatchActions);
  });

  test('rows expand one at a time or all together', function (assert) {
    const { state } = setup();

    state.expandRow('a');
    assert.deepEqual(
      state.rows.map((row) => row.isExpanded),
      [true, false, false],
    );
    assert.false(state.isExpandedAll);

    state.expandAll();
    assert.true(state.isExpandedAll);
    state.expandAll();
    assert.deepEqual(
      state.rows.map((row) => row.isExpanded),
      [false, false, false],
    );
  });

  test('new rows keep the sort, and the selection of rows that stay', function (assert) {
    const { args, state } = setup();

    state.sortBy('port');
    state.selectRow('a');
    args.rows = [
      ...ROWS.filter((row) => row.id !== 'b'),
      { id: 'd', name: 'Load balancer 4', port: 22, isSelected: true },
    ];

    assert.deepEqual(ids(state), ['d', 'a', 'c']);
    assert.deepEqual(
      state.selectedRows.map((row) => row.id),
      ['d', 'a'],
    );
  });

  test('rows and cells keep their identity when rows are selected, expanded or sorted', function (assert) {
    const { state } = setup();
    const [a, b] = state.rows;
    const cell = a!.cells[0];

    state.selectRow('a');
    state.expandRow('a');
    assert.strictEqual(state.rows[0], a, 'the selected row is the same object');
    assert.true(state.rows[0]!.isSelected);
    assert.true(state.rows[0]!.isExpanded);

    state.sortBy('port');
    assert.strictEqual(
      state.rows.find((row) => row.id === 'b'),
      b,
    );
    assert.strictEqual(
      state.rows.find((row) => row.id === 'a')!.cells[0],
      cell,
    );
  });

  test('rows and cells that changed are replaced, keeping the state of their row', function (assert) {
    const { args, state } = setup();
    const [a, b] = state.rows;
    state.selectRow('a');

    args.rows = [{ ...ROWS[0]!, port: 8080 }, ROWS[1]!, ROWS[2]!];
    const [newA, newB] = state.rows;

    assert.notStrictEqual(newA, a);
    assert.strictEqual(newA!.cells[0], a!.cells[0], 'the cell that stayed');
    assert.notStrictEqual(newA!.cells[1], a!.cells[1]);
    assert.true(newA!.isSelected, 'the selection stays');
    assert.strictEqual(newB, b);
  });

  test('a changed isSelected on a row that stays is ignored', function (assert) {
    const { args, state } = setup();
    state.selectRow('b');

    args.rows = [
      { ...ROWS[0]!, isSelected: true },
      { ...ROWS[1]!, isSelected: false },
      ROWS[2]!,
    ];
    assert.deepEqual(
      state.rows.map((row) => row.isSelected),
      [false, true, false],
    );
  });

  test('rows are plain-object like, and selectedRows are snapshots', function (assert) {
    const { state } = setup();
    state.selectRow('a');
    const [row] = state.rows;

    assert.true(Object.keys(row!).includes('isSelected'));
    assert.true(Object.keys(row!).includes('isExpanded'));
    assert.false(Object.keys(row!).includes('flags'));
    assert.true((JSON.parse(JSON.stringify(row)) as DataTableRow).isSelected);

    const [snapshot] = state.selectedRows;
    state.selectRow('a');
    assert.true(snapshot!.isSelected, 'the snapshot keeps its selection');
    assert.false(row!.isSelected);
  });

  test('the batch actions stay hidden when new rows leave none selected', function (assert) {
    const { args, state } = setup();
    state.selectRow('a');
    assert.true(state.shouldShowBatchActions);

    args.rows = [{ ...ROWS[1]!, id: 'x' }];
    assert.false(state.shouldShowBatchActions);

    args.rows = [{ ...ROWS[1]!, id: 'y', isSelected: true }];
    assert.false(state.shouldShowBatchActions, 'rows selected later');
  });

  test('a row that leaves the rows loses its selection and expansion', function (assert) {
    const { args, state } = setup();
    state.selectRow('a');
    state.expandRow('a');
    state.selectRow('b');

    args.rows = ROWS.filter((row) => row.id !== 'a');
    assert.deepEqual(ids(state), ['b', 'c']);
    assert.deepEqual(
      state.selectedRows.map((row) => row.id),
      ['b'],
    );

    args.rows = ROWS;
    const a = state.rows.find((row) => row.id === 'a')!;
    assert.false(a.isSelected, 'back as its own row says');
    assert.false(a.isExpanded);
  });

  test('a returning row starts from its own isSelected and isExpanded', function (assert) {
    const { args, state } = setup();
    args.rows = [{ ...ROWS[0]!, isSelected: true, isExpanded: true }];
    state.selectRow('a');
    assert.false(state.rows[0]!.isSelected);

    args.rows = [];
    assert.deepEqual(ids(state), []);
    args.rows = [{ ...ROWS[0]!, isSelected: true, isExpanded: true }];
    assert.true(state.rows[0]!.isSelected);
    assert.true(state.rows[0]!.isExpanded);
  });

  test('a sort starts from the order the last one left, as in Carbon React', function (assert) {
    const state = new DataTableState(() => ({
      rows: ROWS,
      headers: HEADERS,
      sortRow: (a, b, { key, sortDirection }) =>
        key === 'protocol'
          ? 0
          : compare(a, b) * (sortDirection === 'ASC' ? 1 : -1),
    }));

    state.sortBy('port');
    assert.deepEqual(ids(state), ['b', 'a', 'c']);
    state.sortBy('name');
    state.sortBy('name');
    state.sortBy('name');
    state.sortBy('port');
    state.sortBy('port');
    assert.deepEqual(ids(state), ['c', 'a', 'b']);

    state.sortBy('protocol');
    assert.deepEqual(
      ids(state),
      ['c', 'a', 'b'],
      'a sort that ties everything keeps the order the table showed',
    );
  });

  test('new rows sort from their own order', function (assert) {
    const { args, state } = setup();
    state.sortBy('port');
    state.sortBy('port');
    args.rows = [...ROWS].reverse();
    assert.deepEqual(ids(state), ['c', 'a', 'b']);
  });

  test('every row is expanded when there are none, as in Carbon React', function (assert) {
    const { args, state } = setup();
    args.rows = [];
    assert.true(state.isExpandedAll);
    assert.false(state.shouldShowBatchActions);
  });
});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  fillIn,
  find,
  findAll,
  render,
  settled,
  waitUntil,
} from '@ember/test-helpers';
import style from 'ember-style-modifier';
import { tracked } from '@glimmer/tracking';
import DataTable from '#src/components/data-table.gts';
import TableBatchAction from '#src/components/table/table-batch-action.gts';
import TableBody from '#src/components/table/table-body.gts';
import TableCell from '#src/components/table/table-cell.gts';
import TableHead from '#src/components/table/table-head.gts';
import TableRow from '#src/components/table/table-row.gts';

import type { TOC } from '@ember/component/template-only';
import type {
  DataTableHeader,
  DataTableInputRow,
} from '#src/components/data-table.gts';

const HEADERS = [
  { key: 'name', header: 'Name' },
  { key: 'port', header: 'Port' },
];

const ROWS = [
  { id: 'a', name: 'Load balancer 3', port: 3000 },
  { id: 'b', name: 'Load balancer 1', port: 443 },
  { id: 'c', name: 'Load balancer 2', port: 80, disabled: true },
];

const LONG_ROWS = [
  {
    id: 'a',
    name: 'A load balancer whose name wraps in a narrow column',
    port: 1,
  },
];

class RowsState {
  @tracked rows = ROWS;
}

// The text of each body row's cell at an index, leaving out selection and
// expand cells.
const column = (index: number) =>
  findAll('tbody tr').map((row) =>
    row
      .querySelectorAll(
        'td:not(.cds--table-column-checkbox):not(.cds--table-expand)',
      )
      [index]?.textContent?.trim(),
  );

interface FullSignature {
  Args: {
    rows: DataTableInputRow[];
    headers: DataTableHeader[];
    isSortable?: boolean;
    radio?: boolean;
    onHeaderClick?: (event: MouseEvent, sort: unknown) => void;
    onExpand?: (event: MouseEvent) => void;
    onExpandAll?: (event: MouseEvent) => void;
    onExpandHeaderClick?: (
      event: MouseEvent,
      expand: { isExpanded: boolean },
    ) => void;
    onSelect?: (event: MouseEvent) => void;
    onSelectAll?: (event: MouseEvent) => void;
  };
}

const text = (value: unknown) =>
  typeof value === 'string' || typeof value === 'number' ? value : '';

// A table that renders every part, without keys on its `{{#each}}`s.
const Full: TOC<FullSignature> = <template>
  <DataTable
    @rows={{@rows}}
    @headers={{@headers}}
    @isSortable={{@isSortable}}
    @radio={{@radio}}
    as |table|
  >
    <table.Table>
      <TableHead>
        <TableRow>
          <table.TableExpandHeader
            @enableToggle={{true}}
            @onExpand={{@onExpandAll}}
            @onClick={{@onExpandHeaderClick}}
          />
          <table.TableSelectAll @onSelect={{@onSelectAll}} />
          {{#each table.headers as |header|}}
            <table.TableHeader
              @header={{header}}
              @onClick={{@onHeaderClick}}
              data-test-header={{header.key}}
            >{{header.header}}</table.TableHeader>
          {{/each}}
        </TableRow>
      </TableHead>
      <TableBody>
        {{#each table.rows as |row|}}
          <table.TableExpandRow
            @row={{row}}
            @onExpand={{@onExpand}}
            data-test-row={{row.id}}
          >
            <table.TableSelectRow @row={{row}} @onSelect={{@onSelect}} />
            {{#each row.cells as |cell|}}
              <table.TableCell @cell={{cell}}>{{text
                  cell.value
                }}</table.TableCell>
            {{/each}}
          </table.TableExpandRow>
          <table.TableExpandedRow @row={{row}} @colSpan={{4}}>Details of
            {{row.id}}</table.TableExpandedRow>
        {{/each}}
      </TableBody>
    </table.Table>
  </DataTable>
</template>;

// The names in the `Full` table's rows, leaving out its select and expand cells.
const names = () =>
  findAll('[data-test-row] td:nth-child(3)').map((td) =>
    td.textContent?.trim(),
  );

module('Integration | Component | DataTable', (hooks) => {
  setupRenderingTest(hooks);

  test('without a block, it renders the headers and a row per row', async function (assert) {
    await render(
      <template><DataTable @rows={{ROWS}} @headers={{HEADERS}} /></template>,
    );

    assert.dom('.cds--data-table-container table.cds--data-table').exists();
    assert.dom('table').hasClass('cds--data-table--lg', 'lg, as in React');
    assert.deepEqual(
      findAll('thead th').map((th) => th.textContent?.trim()),
      ['Name', 'Port'],
    );
    assert.deepEqual(column(0), [
      'Load balancer 3',
      'Load balancer 1',
      'Load balancer 2',
    ]);
    assert.deepEqual(column(1), ['3000', '443', '80']);
    assert
      .dom('tbody td')
      .hasAttribute('headers', find('thead th')!.id, 'a cell names its header');
  });

  test('a header sorts the rows ascending, descending, then back', async function (assert) {
    const sorts: unknown[] = [];
    const onClick = (_: MouseEvent, sort: unknown) => sorts.push(sort);

    await render(
      <template>
        <DataTable
          @rows={{ROWS}}
          @headers={{HEADERS}}
          @isSortable={{true}}
          as |table|
        >
          <table.Table>
            <TableHead>
              <TableRow>
                {{#each table.headers as |header|}}
                  <table.TableHeader
                    @header={{header}}
                    @onClick={{onClick}}
                    data-test-header={{header.key}}
                  >{{header.header}}</table.TableHeader>
                {{/each}}
              </TableRow>
            </TableHead>
            <TableBody>
              {{#each table.rows as |row|}}
                <table.TableRow @row={{row}}>
                  {{#each row.cells as |cell|}}
                    <table.TableCell
                      @cell={{cell}}
                    >{{cell.value}}</table.TableCell>
                  {{/each}}
                </table.TableRow>
              {{/each}}
            </TableBody>
          </table.Table>
        </DataTable>
      </template>,
    );

    const port = 'th:has([data-test-header="port"])';
    assert.dom('table').hasClass('cds--data-table--sort');

    await click('[data-test-header="port"]');
    assert.deepEqual(column(1), ['80', '443', '3000']);
    assert.dom(port).hasAttribute('aria-sort', 'ascending');

    await click('[data-test-header="port"]');
    assert.deepEqual(column(1), ['3000', '443', '80']);
    assert.dom(port).hasAttribute('aria-sort', 'descending');

    await click('[data-test-header="port"]');
    assert.deepEqual(column(1), ['3000', '443', '80'], "the rows' own order");
    assert.dom(port).hasAttribute('aria-sort', 'none');

    assert.deepEqual(sorts, [
      { sortHeaderKey: 'port', sortDirection: 'ASC' },
      { sortHeaderKey: 'port', sortDirection: 'DESC' },
      { sortHeaderKey: 'port', sortDirection: 'NONE' },
    ]);
  });

  test("a header's isSortable wins over the table's", async function (assert) {
    const headers = [
      { key: 'name', header: 'Name', isSortable: false },
      { key: 'port', header: 'Port' },
    ];

    await render(
      <template>
        <DataTable
          @rows={{ROWS}}
          @headers={{headers}}
          @isSortable={{true}}
          as |table|
        >
          <table.Table>
            <TableHead>
              <TableRow>
                {{#each table.headers as |header|}}
                  <table.TableHeader
                    @header={{header}}
                  >{{header.header}}</table.TableHeader>
                {{/each}}
              </TableRow>
            </TableHead>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert.dom('th:first-child button').doesNotExist();
    assert.dom('th:last-child button.cds--table-sort').exists();
  });

  test('rows are selected one by one or all at once, leaving out disabled ones', async function (assert) {
    await render(
      <template>
        <DataTable @rows={{ROWS}} @headers={{HEADERS}} as |table|>
          <output data-test-selected>{{#each
              table.selectedRows
              as |row|
            }}{{row.id}}{{/each}}</output>
          <table.TableBatchActions />
          <table.Table>
            <TableHead>
              <TableRow>
                <table.TableSelectAll />
                {{#each table.headers as |header|}}
                  <table.TableHeader
                    @header={{header}}
                  >{{header.header}}</table.TableHeader>
                {{/each}}
              </TableRow>
            </TableHead>
            <TableBody>
              {{#each table.rows as |row|}}
                <table.TableRow @row={{row}}>
                  <table.TableSelectRow @row={{row}} />
                  {{#each row.cells as |cell|}}
                    <table.TableCell
                      @cell={{cell}}
                    >{{cell.value}}</table.TableCell>
                  {{/each}}
                </table.TableRow>
              {{/each}}
            </TableBody>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert.dom('th .cds--checkbox-label').hasText('Select all rows');
    assert
      .dom('.cds--batch-actions')
      .doesNotHaveClass('cds--batch-actions--active');

    await click('tbody tr:first-child input');
    assert.dom('[data-test-selected]').hasText('a');
    assert.dom('tbody tr:first-child').hasClass('cds--data-table--selected');
    assert.dom('th input').hasProperty('indeterminate', true);
    assert.dom('th .cds--checkbox-label').hasText('Unselect all rows');
    assert
      .dom('tbody tr:first-child .cds--checkbox-label')
      .hasText('Unselect row');
    assert.dom('.cds--batch-actions').hasClass('cds--batch-actions--active');

    await click('th input');
    assert
      .dom('[data-test-selected]')
      .hasText('', 'with a row selected, it unselects them all');

    await click('th input');
    assert
      .dom('[data-test-selected]')
      .hasText('ab', 'the disabled row stays unselected');
    assert.dom('tbody tr:last-child input').isDisabled();

    await click('.cds--batch-summary__cancel');
    assert.dom('[data-test-selected]').hasText('');
    assert
      .dom('.cds--batch-actions')
      .doesNotHaveClass('cds--batch-actions--active');
  });

  test('with @radio, one row is selected at a time', async function (assert) {
    await render(
      <template>
        <DataTable
          @rows={{ROWS}}
          @headers={{HEADERS}}
          @radio={{true}}
          as |table|
        >
          <output data-test-selected>{{#each
              table.selectedRows
              as |row|
            }}{{row.id}}{{/each}}</output>
          <table.Table>
            <TableBody>
              {{#each table.rows as |row|}}
                <table.TableRow @row={{row}}>
                  <table.TableSelectRow @row={{row}} />
                </table.TableRow>
              {{/each}}
            </TableBody>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert.strictEqual(findAll('input[type="radio"]').length, 3);
    await click('tbody tr:first-child input');
    await click('tbody tr:nth-child(2) input');
    assert.dom('[data-test-selected]').hasText('b');
  });

  test('rows expand one at a time or all together', async function (assert) {
    await render(
      <template>
        <DataTable @rows={{ROWS}} @headers={{HEADERS}} as |table|>
          <table.Table>
            <TableHead>
              <TableRow>
                <table.TableExpandHeader @enableToggle={{true}} />
                {{#each table.headers as |header|}}
                  <table.TableHeader
                    @header={{header}}
                  >{{header.header}}</table.TableHeader>
                {{/each}}
              </TableRow>
            </TableHead>
            <TableBody>
              {{#each table.rows as |row|}}
                <table.TableExpandRow @row={{row}} data-test-row={{row.id}}>
                  {{#each row.cells as |cell|}}
                    <table.TableCell
                      @cell={{cell}}
                    >{{cell.value}}</table.TableCell>
                  {{/each}}
                </table.TableExpandRow>
                {{#if row.isExpanded}}
                  <table.TableExpandedRow
                    @row={{row}}
                    @colSpan={{3}}
                    data-test-details={{row.id}}
                  >Details</table.TableExpandedRow>
                {{/if}}
              {{/each}}
            </TableBody>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert.dom('[data-test-details]').doesNotExist();
    assert
      .dom('[data-test-row="a"] button')
      .hasAria('label', 'Expand current row');

    await click('[data-test-row="a"] button');
    assert.dom('[data-test-details="a"]').exists();
    assert
      .dom('[data-test-row="a"] button')
      .hasAria('controls', find('[data-test-details="a"]')!.id)
      .hasAria('expanded', 'true')
      .hasAria('label', 'Collapse current row');
    assert
      .dom('[data-test-row="a"] td.cds--table-expand')
      .hasAttribute('headers', find('th.cds--table-expand')!.id);

    await click('th.cds--table-expand button');
    assert.strictEqual(findAll('[data-test-details]').length, 3);
    assert
      .dom('th.cds--table-expand button')
      .hasAria('label', 'Collapse all rows');

    await click('th.cds--table-expand button');
    assert.dom('[data-test-details]').doesNotExist();
  });

  test('a toolbar search filters the rows', async function (assert) {
    await render(
      <template>
        <DataTable @rows={{ROWS}} @headers={{HEADERS}} @size="sm" as |table|>
          <table.TableToolbar as |Content|>
            <Content as |Search|>
              <Search @persistent={{true}} @onChange={{table.onInputChange}} />
            </Content>
          </table.TableToolbar>
          <table.Table>
            <TableBody>
              {{#each table.rows as |row|}}
                <table.TableRow @row={{row}}>
                  {{#each row.cells as |cell|}}
                    <table.TableCell
                      @cell={{cell}}
                    >{{cell.value}}</table.TableCell>
                  {{/each}}
                </table.TableRow>
              {{/each}}
            </TableBody>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert
      .dom('.cds--table-toolbar')
      .hasClass('cds--table-toolbar--sm', "the table's size");

    await fillIn('.cds--search-input', ' balancer 1');
    assert.deepEqual(column(0), ['Load balancer 1']);

    await fillIn('.cds--search-input', '');
    assert.strictEqual(findAll('tbody tr').length, 3);
  });

  test("the container yields a table with the DataTable's options, named by its title", async function (assert) {
    await render(
      <template>
        <DataTable
          @rows={{ROWS}}
          @headers={{HEADERS}}
          @size="xs"
          @useZebraStyles={{true}}
          @stickyHeader={{true}}
          as |table|
        >
          <table.TableContainer @title="Load balancers" as |Table|>
            <Table />
          </table.TableContainer>
        </DataTable>
      </template>,
    );

    assert
      .dom('table')
      .hasClass('cds--data-table--xs')
      .hasClass('cds--data-table--zebra')
      .hasClass('cds--data-table--sticky-header')
      .hasClass(
        'cds--data-table--visible-overflow-menu',
        "overflow menus show, DataTable's default",
      )
      .hasAria('labelledby', find('.cds--data-table-header__title')!.id);
    assert
      .dom('.cds--data-table-container')
      .hasClass('cds--data-table--max-width');
  });

  test('new rows keep the sort, and translateWithId translates', async function (assert) {
    const state = new RowsState();
    const translate = (id: string) => `[${id}]`;

    await render(
      <template>
        <DataTable
          @rows={{state.rows}}
          @headers={{HEADERS}}
          @isSortable={{true}}
          @translateWithId={{translate}}
          as |table|
        >
          <table.Table>
            <TableHead>
              <TableRow>
                <table.TableSelectAll />
                {{#each table.headers as |header|}}
                  <table.TableHeader
                    @header={{header}}
                    data-test-header={{header.key}}
                  >{{header.header}}</table.TableHeader>
                {{/each}}
              </TableRow>
            </TableHead>
            <TableBody>
              {{#each table.rows as |row|}}
                <table.TableRow @row={{row}}>
                  {{#each row.cells as |cell|}}
                    <table.TableCell
                      @cell={{cell}}
                    >{{cell.value}}</table.TableCell>
                  {{/each}}
                </table.TableRow>
              {{/each}}
            </TableBody>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert.dom('th .cds--checkbox-label').hasText('[carbon.table.all.select]');

    await click('[data-test-header="port"]');
    state.rows = [...ROWS, { id: 'd', name: 'Load balancer 4', port: 22 }];
    await settled();
    assert.deepEqual(column(1), ['22', '80', '443', '3000']);
  });

  test('a header that does not sort drops the click', async function (assert) {
    const headers = [
      { key: 'name', header: 'Name', isSortable: false },
      { key: 'port', header: 'Port' },
    ];
    const clicks: unknown[] = [];
    const onClick = (...args: unknown[]) => clicks.push(args);

    await render(
      <template>
        <Full @rows={{ROWS}} @headers={{headers}} @onHeaderClick={{onClick}} />
      </template>,
    );

    assert.deepEqual(
      names(),
      ['Load balancer 3', 'Load balancer 1', 'Load balancer 2'],
      'rows in their order',
    );
    await click('[data-test-header="name"]');
    await click('[data-test-header="port"]');
    assert.deepEqual(
      names(),
      ['Load balancer 3', 'Load balancer 1', 'Load balancer 2'],
      'nothing sorted',
    );
    assert.deepEqual(clicks, [], 'and @onClick was not called');
    assert.dom('th').doesNotHaveAttribute('aria-sort');
  });

  test('a header of a sortable table sorts and a non-sortable one next to it does not', async function (assert) {
    const headers = [
      { key: 'name', header: 'Name', isSortable: false },
      { key: 'port', header: 'Port' },
    ];
    const clicks: unknown[] = [];
    const onClick = (_: MouseEvent, sort: unknown) => clicks.push(sort);

    await render(
      <template>
        <Full
          @rows={{ROWS}}
          @headers={{headers}}
          @isSortable={{true}}
          @onHeaderClick={{onClick}}
        />
      </template>,
    );

    await click('[data-test-header="name"]');
    assert.deepEqual(clicks, []);
    await click('[data-test-header="port"]');
    assert.deepEqual(clicks, [{ sortHeaderKey: 'port', sortDirection: 'ASC' }]);
  });

  test('selecting, expanding and sorting keep the rows and the focus, without keys', async function (assert) {
    await render(
      <template>
        <Full @rows={{ROWS}} @headers={{HEADERS}} @isSortable={{true}} />
      </template>,
    );

    const checkbox = find('[data-test-row="a"] input')!;
    const row = find('[data-test-row="a"]')!;
    await click(checkbox);
    assert.true((checkbox as HTMLInputElement).checked);
    assert.strictEqual(
      find('[data-test-row="a"] input'),
      checkbox,
      'same input',
    );
    assert.strictEqual(find('[data-test-row="a"]'), row, 'same row');
    assert.strictEqual(document.activeElement, checkbox, 'still focused');

    const expand = find('[data-test-row="a"] .cds--table-expand__button')!;
    await click(expand);
    assert.dom('[data-test-row="a"]').hasClass('cds--expandable-row');
    assert.strictEqual(
      find('[data-test-row="a"] .cds--table-expand__button'),
      expand,
    );
    assert.strictEqual(
      document.activeElement,
      expand,
      'the button keeps focus',
    );

    await click('th input');
    await click('th .cds--table-expand__button');
    assert.strictEqual(find('[data-test-row="a"]'), row);

    await click('[data-test-header="port"]');
    assert.strictEqual(find('[data-test-row="a"]'), row, 'same row, sorted');
    assert.strictEqual(
      find('[data-test-row="a"] .cds--table-expand__button'),
      expand,
    );
    assert.strictEqual(
      document.activeElement,
      find('[data-test-header="port"]'),
      'the sort button keeps focus',
    );
  });

  test("translateWithId on a header translates the sort button's description", async function (assert) {
    const translate = (id: string, { header }: { header: string }) =>
      `[${id}] ${header}`;

    await render(
      <template>
        <DataTable
          @rows={{ROWS}}
          @headers={{HEADERS}}
          @isSortable={{true}}
          as |table|
        >
          <table.Table>
            <TableHead>
              <TableRow>
                {{#each table.headers as |header|}}
                  <table.TableHeader
                    @header={{header}}
                    @translateWithId={{translate}}
                  >{{header.header}}</table.TableHeader>
                {{/each}}
              </TableRow>
            </TableHead>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert
      .dom('.cds--table-sort__description')
      .hasText('[carbon.table.header.icon.description] Name');
  });

  test("a header's decorator or slug marks its cells", async function (assert) {
    const headers = [
      { key: 'name', header: 'Name', decorator: true },
      { key: 'port', header: 'Port', slug: true },
    ];
    const plain = [{ key: 'name', header: 'Name' }];

    await render(
      <template>
        <DataTable @rows={{ROWS}} @headers={{headers}} as |table|>
          <table.Table data-test-marked>
            <TableBody>
              {{#each table.rows as |row|}}
                <table.TableRow @row={{row}}>
                  {{#each row.cells as |cell|}}
                    <table.TableCell
                      @cell={{cell}}
                    >{{cell.value}}</table.TableCell>
                  {{/each}}
                </table.TableRow>
              {{/each}}
            </TableBody>
          </table.Table>
        </DataTable>
        <DataTable @rows={{ROWS}} @headers={{plain}} as |table|>
          <table.Table data-test-plain>
            <TableBody>
              {{#each table.rows as |row|}}
                <table.TableRow @row={{row}}>
                  {{#each row.cells as |cell|}}
                    <table.TableCell
                      @cell={{cell}}
                    >{{cell.value}}</table.TableCell>
                  {{/each}}
                </table.TableRow>
              {{/each}}
            </TableBody>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert
      .dom('[data-test-marked] td.cds--table-cell--column-slug')
      .exists({ count: 6 });
    assert
      .dom('[data-test-plain] td.cds--table-cell--column-slug')
      .doesNotExist();
  });

  test('the decorator blocks of the header, the expand row and the container render', async function (assert) {
    await render(
      <template>
        <DataTable
          @rows={{ROWS}}
          @headers={{HEADERS}}
          @isSortable={{true}}
          as |table|
        >
          <table.TableContainer @title="Team" @aiEnabled={{true}}>
            <:default as |Table|>
              <Table>
                <TableHead>
                  <TableRow>
                    <table.TableExpandHeader />
                    {{#each table.headers as |header|}}
                      {{#if (eq header.key "name")}}
                        <table.TableHeader @header={{header}}>
                          <:default>{{header.header}}</:default>
                          <:decorator as |AILabel|><AILabel
                              data-test-header-label
                            /></:decorator>
                        </table.TableHeader>
                      {{else}}
                        <table.TableHeader
                          @header={{header}}
                        >{{header.header}}</table.TableHeader>
                      {{/if}}
                    {{/each}}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {{#each table.rows as |row|}}
                    <table.TableExpandRow @row={{row}}>
                      <:decorator as |AILabel|><AILabel
                          data-test-row-label
                        /></:decorator>
                      <:default>
                        <TableCell>{{row.id}}</TableCell>
                      </:default>
                    </table.TableExpandRow>
                  {{/each}}
                </TableBody>
              </Table>
            </:default>
            <:decorator><span data-test-table-label>AI</span></:decorator>
          </table.TableContainer>
        </DataTable>
      </template>,
    );

    assert.dom('[data-test-header-label]').exists({ count: 1 });
    assert
      .dom(
        'th .cds--table-header-label--decorator-inner, th.cds--table-sort__header--decorator',
      )
      .exists();
    assert.dom('[data-test-row-label]').exists({ count: 3 });
    assert.dom('tr.cds--data-table--ai-label-row').exists({ count: 3 });
    assert.dom('[data-test-table-label]').exists();
    assert.dom('.cds--data-table-container--ai-enabled').exists();
  });

  test('a header takes its own id, and a cell its own headers', async function (assert) {
    await render(
      <template>
        <DataTable @rows={{ROWS}} @headers={{HEADERS}} as |table|>
          <table.Table>
            <TableHead>
              <TableRow>
                {{#each table.headers as |header|}}
                  <table.TableHeader
                    @header={{header}}
                    @id={{if (eq header.key "name") "custom-header"}}
                  >{{header.header}}</table.TableHeader>
                {{/each}}
              </TableRow>
            </TableHead>
            <TableBody>
              {{#each table.rows as |row|}}
                <table.TableRow @row={{row}}>
                  {{#each row.cells as |cell|}}
                    {{#if (eq cell.info.header "name")}}
                      <table.TableCell
                        @cell={{cell}}
                        headers="custom-header"
                        data-test-cell="name"
                      >{{text cell.value}}</table.TableCell>
                    {{else}}
                      <table.TableCell
                        @cell={{cell}}
                        data-test-cell="port"
                      >{{text cell.value}}</table.TableCell>
                    {{/if}}
                  {{/each}}
                </table.TableRow>
              {{/each}}
            </TableBody>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert.dom('th:first-child').hasAttribute('id', 'custom-header');
    assert
      .dom('[data-test-cell="name"]')
      .hasAttribute('headers', 'custom-header');
    assert
      .dom('[data-test-cell="port"]')
      .hasAttribute('headers', find('th:last-child')!.id);
  });

  test('onExpand and onSelect are called by the expand and select parts', async function (assert) {
    const calls: string[] = [];
    const record = (name: string) => () => calls.push(name);
    const onExpand = record('row expand');
    const onExpandAll = record('expand all');
    const onSelect = record('select row');
    const onSelectAll = record('select all');

    await render(
      <template>
        <Full
          @rows={{ROWS}}
          @headers={{HEADERS}}
          @onExpand={{onExpand}}
          @onExpandAll={{onExpandAll}}
          @onSelect={{onSelect}}
          @onSelectAll={{onSelectAll}}
        />
      </template>,
    );

    await click('[data-test-row="a"] .cds--table-expand__button');
    await click('th .cds--table-expand__button');
    await click('[data-test-row="b"] input');
    await click('th input');
    assert.deepEqual(calls, [
      'row expand',
      'expand all',
      'select row',
      'select all',
    ]);
  });

  test('the expand header calls onClick with whether the rows were expanded', async function (assert) {
    const calls: boolean[] = [];
    const onExpandHeaderClick = (
      _event: MouseEvent,
      { isExpanded }: { isExpanded: boolean },
    ) => calls.push(isExpanded);

    await render(
      <template>
        <Full
          @rows={{ROWS}}
          @headers={{HEADERS}}
          @onExpandHeaderClick={{onExpandHeaderClick}}
        />
      </template>,
    );

    await click('th .cds--table-expand__button');
    await click('th .cds--table-expand__button');
    assert.deepEqual(calls, [false, true]);
  });

  test('the yielded functions sort, select and expand', async function (assert) {
    await render(
      <template>
        <DataTable @rows={{ROWS}} @headers={{HEADERS}} as |table|>
          <button
            type="button"
            data-test-sort
            {{on "click" (fn table.sortBy "port")}}
          >sort</button>
          <button
            type="button"
            data-test-select-row
            {{on "click" (fn table.selectRow "a")}}
          >select</button>
          <button
            type="button"
            data-test-select-all
            {{on "click" table.selectAll}}
          >all</button>
          <button
            type="button"
            data-test-expand-row
            {{on "click" (fn table.expandRow "b")}}
          >expand</button>
          <button
            type="button"
            data-test-expand-all
            {{on "click" table.expandAll}}
          >expand all</button>
          <output data-test-rows>{{#each
              table.rows
              as |row|
            }}{{row.id}}{{row.isSelected}}{{row.isExpanded}} {{/each}}</output>
          <output data-test-selected>{{table.selectedRows.length}}</output>
        </DataTable>
      </template>,
    );

    await click('[data-test-sort]');
    assert
      .dom('[data-test-rows]')
      .hasText('cfalsefalse bfalsefalse afalsefalse');
    await click('[data-test-select-row]');
    await click('[data-test-expand-row]');
    assert.dom('[data-test-rows]').hasText('cfalsefalse bfalsetrue atruefalse');
    await click('[data-test-select-all]');
    assert
      .dom('[data-test-selected]')
      .hasText('0', 'with a row selected, it unselects');
    await click('[data-test-select-all]');
    assert
      .dom('[data-test-selected]')
      .hasText('2', 'the disabled row stays out');
    await click('[data-test-expand-all]');
    assert.dom('[data-test-rows]').hasText('cfalsetrue btruetrue atruetrue');
  });

  test('useStaticWidth, overflowMenuOnHover and experimentalAutoAlign reach the table', async function (assert) {
    await render(
      <template>
        <div {{style width="160px"}}>
          <DataTable
            @rows={{LONG_ROWS}}
            @headers={{HEADERS}}
            @useStaticWidth={{true}}
            @overflowMenuOnHover={{true}}
            @experimentalAutoAlign={{true}}
            as |table|
          >
            <table.TableContainer as |Table|>
              <Table data-test-table>
                <TableBody>
                  {{#each table.rows as |row|}}
                    <table.TableRow @row={{row}}>
                      {{#each row.cells as |cell|}}
                        <table.TableCell
                          @cell={{cell}}
                        >{{cell.value}}</table.TableCell>
                      {{/each}}
                    </table.TableRow>
                  {{/each}}
                </TableBody>
              </Table>
            </table.TableContainer>
          </DataTable>
        </div>
      </template>,
    );

    assert
      .dom('[data-test-table]')
      .hasClass('cds--data-table--static')
      .doesNotHaveClass('cds--data-table--visible-overflow-menu');
    assert
      .dom('.cds--data-table-container')
      .hasClass('cds--data-table-container--static');
    await waitUntil(() =>
      document.querySelector(
        '[data-test-table].cds--data-table--top-aligned-body',
      ),
    );
    assert
      .dom('[data-test-table]')
      .hasClass('cds--data-table--top-aligned-body');
  });

  test('new rows keep the selection and expansion of the rows that stay, and drop those of rows that leave', async function (assert) {
    const state = new RowsState();

    await render(
      <template><Full @rows={{state.rows}} @headers={{HEADERS}} /></template>,
    );

    await click('[data-test-row="a"] input');
    await click('[data-test-row="b"] input');
    await click('[data-test-row="a"] .cds--table-expand__button');

    state.rows = ROWS.filter((row) => row.id !== 'b');
    await settled();
    assert.dom('[data-test-row="a"] input').isChecked();
    assert.dom('[data-test-row="a"]').hasClass('cds--expandable-row');

    state.rows = ROWS;
    await settled();
    assert.dom('[data-test-row="a"] input').isChecked('a stayed');
    assert.dom('[data-test-row="b"] input').isNotChecked('b left and returned');
  });

  test('rows with isSelected and isExpanded render selected and expanded', async function (assert) {
    const rows = [
      {
        id: 'a',
        name: 'Load balancer 3',
        port: 3000,
        isSelected: true,
        isExpanded: true,
      },
      { id: 'b', name: 'Load balancer 1', port: 443 },
      {
        id: 'c',
        name: 'Load balancer 2',
        port: 80,
        disabled: true,
        isSelected: true,
      },
    ];

    await render(
      <template><Full @rows={{rows}} @headers={{HEADERS}} /></template>,
    );

    assert.dom('[data-test-row="a"] input').isChecked();
    assert
      .dom('[data-test-row="a"]')
      .hasClass('cds--data-table--selected')
      .hasClass('cds--expandable-row');
    assert
      .dom('[data-test-row="a"] .cds--table-expand__button')
      .hasAria('expanded', 'true')
      .hasAria('label', 'Collapse current row');
    assert.dom('[data-test-row="b"] input').isNotChecked();
    assert.dom('th input').hasProperty('indeterminate', true);
    assert.dom('th input').hasAttribute('id');
  });

  test('batchActionProps is what getBatchActionProps gives, and totalCount can be overridden', async function (assert) {
    const select = (count: number) => `Select all (${count})`;
    const selectAll = () => {};
    const translate = (
      id: string,
      { totalCount }: { totalCount?: number } = {},
    ) => (id === 'carbon.table.batch.selectAll' ? select(totalCount ?? 0) : id);

    await render(
      <template>
        <DataTable @rows={{ROWS}} @headers={{HEADERS}} as |table|>
          <output
            data-test-props
          >{{table.batchActionProps.shouldShowBatchActions}}
            {{table.batchActionProps.totalSelected}}
            {{table.batchActionProps.totalCount}}</output>
          <table.TableToolbar>
            <table.TableBatchActions
              @totalCount={{50}}
              @onSelectAll={{selectAll}}
              @translateWithId={{translate}}
            >
              <TableBatchAction>Add</TableBatchAction>
            </table.TableBatchActions>
          </table.TableToolbar>
          <table.Table>
            <TableBody>
              {{#each table.rows as |row|}}
                <table.TableRow @row={{row}}>
                  <table.TableSelectRow @row={{row}} />
                </table.TableRow>
              {{/each}}
            </TableBody>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert.dom('[data-test-props]').hasText('false 0 3');
    await click('tbody tr:first-child input');
    assert.dom('[data-test-props]').hasText('true 1 3');
    assert
      .dom('.cds--batch-summary .cds--btn')
      .hasText('Select all (50)', 'the override');
    await click('.cds--batch-summary__cancel');
    assert.dom('[data-test-props]').hasText('false 0 3');
  });

  test('without rows, the expand header reads "Collapse all rows", as in Carbon React', async function (assert) {
    await render(
      <template>
        <DataTable @rows={{(array)}} @headers={{HEADERS}} as |table|>
          <table.Table>
            <TableHead>
              <TableRow>
                <table.TableExpandHeader @enableToggle={{true}} />
              </TableRow>
            </TableHead>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert
      .dom('th.cds--table-expand button')
      .hasAria('label', 'Collapse all rows');
  });

  test("the select controls share a name per table, and ids come from the table's", async function (assert) {
    await render(
      <template>
        <Full @rows={{ROWS}} @headers={{HEADERS}} />
        <Full @rows={{ROWS}} @headers={{HEADERS}} />
      </template>,
    );

    const names = (selector: string) =>
      new Set(findAll(selector).map((input) => input.getAttribute('name')));
    const [first, second] = findAll('table');
    const rowNames = (table: Element) =>
      new Set(
        [...table.querySelectorAll('tbody input')].map((input) =>
          input.getAttribute('name'),
        ),
      );

    assert.strictEqual(names('tbody input').size, 2, 'one name per table');
    assert.strictEqual(rowNames(first!).size, 1);
    assert.true([...rowNames(first!)][0]!.startsWith('select-row-'));
    assert.true(
      first!
        .querySelector('thead input')!
        .getAttribute('name')!
        .startsWith('select-all-'),
    );
    assert.notDeepEqual([...rowNames(first!)], [...rowNames(second!)]);
    assert.notStrictEqual(
      first!.querySelector('thead th:nth-child(3)')!.id,
      second!.querySelector('thead th:nth-child(3)')!.id,
      'headers get ids of their own table',
    );
  });
});

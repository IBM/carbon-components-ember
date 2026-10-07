import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  findAll,
  render,
  settled,
  waitUntil,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import DataTable from '#src/components/data-table.gts';
import Pagination from '#src/components/pagination.gts';

const noop = () => undefined;

module('Integration | Component | DataTable', (hooks) => {
  setupRenderingTest(hooks);

  const items = [
    { name: 'a', b: 'c' },
    { name: 'John', b: 'asd' },
  ];

  test('should render title, description and rows', async function (assert) {
    await render(
      <template>
        <DataTable
          @title="Table title"
          @description="Table description"
          @items={{items}}
          as |table|
        >
          <table.Table>
            <table.Header
              @headers={{array (hash label="Name") (hash label="details")}}
            />
            <table.EachBodyRows as |row|>
              <row.Row>
                <table.Column>{{row.item.name}}</table.Column>
                <table.Column>{{row.item.b}}</table.Column>
              </row.Row>
            </table.EachBodyRows>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert.dom('.cds--data-table-header__title').hasText('Table title');
    assert
      .dom('.cds--data-table-header__description')
      .hasText('Table description');
    assert.dom('table.cds--data-table').exists();
    assert.dom('thead th').exists({ count: 2 });
    assert.dom('tbody tr').exists({ count: 2 });
  });

  test('should associate each td with its column header via the headers attribute', async function (assert) {
    await render(
      <template>
        <DataTable @title="Table title" @items={{items}} as |table|>
          <table.Table>
            <table.Header
              @headers={{array (hash label="Name") (hash label="details")}}
            />
            <table.EachBodyRows as |row|>
              <row.Row>
                <table.Column>{{row.item.name}}</table.Column>
                <table.Column>{{row.item.b}}</table.Column>
              </row.Row>
            </table.EachBodyRows>
          </table.Table>
        </DataTable>
      </template>,
    );

    // `DataTable`'s row/column-index bookkeeping (and the header ids they
    // key off of) settle one render pass after `await render()` resolves
    // (the initial items slice is populated via a scheduled task, not
    // synchronously) - wait for the actual `td[headers]` values this test
    // asserts on, not just the header `th` ids, which can be populated
    // while the body hasn't re-rendered against them yet.
    await waitUntil(
      () =>
        findAll('tbody tr').length === 2 &&
        findAll('tbody td').every((td) => !!td.getAttribute('headers')),
      { timeout: 5000 },
    );

    const headerIds = findAll('thead th').map((th) => th.id);
    assert.strictEqual(headerIds.length, 2);
    assert.ok(headerIds.every((id) => !!id));

    const rows = findAll('tbody tr');
    assert.strictEqual(rows.length, 2);
    for (const row of rows) {
      const cells = row.querySelectorAll('td');
      assert.strictEqual(
        cells[0]?.getAttribute('headers'),
        headerIds[0],
        'first column links to first header',
      );
      assert.strictEqual(
        cells[1]?.getAttribute('headers'),
        headerIds[1],
        'second column links to second header',
      );
    }
  });

  test('should support an xs sized toolbar and forward size to the search input', async function (assert) {
    await render(
      <template>
        <DataTable @title="Table title" @items={{items}} as |table|>
          <table.Toolbar @size="xs" as |toolbar|>
            <toolbar.Content>
              <table.SearchInput @size="xs" />
            </toolbar.Content>
          </table.Toolbar>
        </DataTable>
      </template>,
    );

    assert.dom('.cds--table-toolbar').hasClass('cds--table-toolbar--xs');
    assert.dom('.cds--table-toolbar').hasAttribute('role', 'group');
    assert
      .dom('.cds--table-toolbar')
      .hasAttribute('aria-label', 'data table toolbar');
    assert.dom('.cds--search').hasClass('cds--search--xs');
    assert
      .dom('[role="search"] .cds--label')
      .hasText(
        'Filter table',
        'the search landmark is named, as in Carbon React',
      );
    assert
      .dom('.cds--search-input')
      .hasAttribute('placeholder', 'Filter table');
  });

  test('should support checkable rows and selection', async function (assert) {
    await render(
      <template>
        <DataTable @title="Table title" @items={{items}} as |table|>
          <table.Table>
            <table.Header
              @isCheckable={{true}}
              @headers={{array (hash label="Name") (hash label="details")}}
            />
            <table.EachBodyRows as |row|>
              <row.Row @isCheckable={{true}}>
                <table.Column>{{row.item.name}}</table.Column>
                <table.Column>{{row.item.b}}</table.Column>
              </row.Row>
            </table.EachBodyRows>
          </table.Table>
        </DataTable>
      </template>,
    );

    assert.dom('thead .cds--table-column-checkbox input').exists();
    assert.dom('tbody .cds--table-column-checkbox input').exists({
      count: 2,
    });
    assert
      .dom('thead .cds--table-column-checkbox .cds--checkbox-label-text')
      .hasText('Select all rows in the table')
      .hasClass('cds--visually-hidden');
    assert
      .dom('tbody .cds--table-column-checkbox .cds--checkbox-label-text')
      .hasText('Select row')
      .hasClass('cds--visually-hidden');
  });

  module('expandable rows', function () {
    const headers = [{ label: 'Name' }, { label: 'details' }];
    const parentRow = (index: number) =>
      document.querySelectorAll<HTMLElement>('tr[data-parent-row]')[index]!;
    const childRow = (index: number) =>
      document.querySelectorAll<HTMLElement>('tr[data-child-row]')[index]!;
    const expandButton = (index: number) =>
      parentRow(index).querySelector<HTMLButtonElement>(
        '.cds--table-expand__button',
      )!;
    const contentHeight = (index: number) =>
      childRow(index)
        .querySelector('.cds--child-row-inner-container')!
        .getBoundingClientRect().height;

    test('the expand button toggles the expanded content', async function (assert) {
      await render(
        <template>
          <DataTable @title="Table title" @items={{items}} as |table|>
            <table.Table>
              <table.Header @isExpandable={{true}} @headers={{headers}} />
              <table.EachBodyRows as |row|>
                <row.Row>
                  <:default>
                    <table.Column>{{row.item.name}}</table.Column>
                    <table.Column>{{row.item.b}}</table.Column>
                  </:default>
                  <:expanded>Details for {{row.item.name}}</:expanded>
                </row.Row>
              </table.EachBodyRows>
            </table.Table>
          </DataTable>
          {{! Carbon's CSS is what collapses the child row. }}
          <style>
            {{carbonStyle.default}}
          </style>
        </template>,
      );

      assert.dom('tr[data-parent-row]').exists({ count: 2 });
      assert.dom('tr[data-child-row]').exists({ count: 2 });
      assert
        .dom(childRow(0))
        .hasClass('cds--expandable-row')
        .hasText('Details for a');
      // Two data columns plus the expand column.
      assert.dom(childRow(0).querySelector('td')).hasAttribute('colspan', '3');
      assert
        .dom(expandButton(0))
        .hasAttribute('aria-expanded', 'false')
        .hasAttribute('aria-label', 'Expand current row')
        .hasAttribute('aria-controls', childRow(0).id);
      assert.dom(parentRow(0)).doesNotHaveClass('cds--expandable-row');
      assert.strictEqual(contentHeight(0), 0, 'collapsed content is hidden');

      await click(expandButton(0));

      assert.dom(parentRow(0)).hasClass('cds--parent-row');
      assert.dom(parentRow(0)).hasClass('cds--expandable-row');
      assert
        .dom(parentRow(0).querySelector('.cds--table-expand'))
        .hasAttribute('data-previous-value', 'collapsed');
      assert
        .dom(expandButton(0))
        .hasAttribute('aria-expanded', 'true')
        .hasAttribute('aria-label', 'Collapse current row');
      assert.true(contentHeight(0) > 0, 'expanded content is shown');
      assert
        .dom(parentRow(1))
        .doesNotHaveClass('cds--expandable-row', 'other rows stay collapsed');

      await click(expandButton(0));

      assert.dom(parentRow(0)).doesNotHaveClass('cds--expandable-row');
      assert.dom(expandButton(0)).hasAttribute('aria-expanded', 'false');
    });

    test('@isExpanded sets the initial state without onExpand', async function (assert) {
      await render(
        <template>
          <DataTable @title="Table title" @items={{items}} as |table|>
            <table.Table>
              <table.Header @isExpandable={{true}} @headers={{headers}} />
              <table.EachBodyRows as |row|>
                <row.Row @isExpanded={{true}}>
                  <:default>
                    <table.Column>{{row.item.name}}</table.Column>
                    <table.Column>{{row.item.b}}</table.Column>
                  </:default>
                  <:expanded>Details</:expanded>
                </row.Row>
              </table.EachBodyRows>
            </table.Table>
          </DataTable>
        </template>,
      );

      assert.dom(parentRow(0)).hasClass('cds--expandable-row');

      await click(expandButton(0));

      assert
        .dom(parentRow(0))
        .doesNotHaveClass(
          'cds--expandable-row',
          'a static @isExpanded does not lock the row open',
        );
    });

    test('@isExpanded with @onExpand is controlled', async function (assert) {
      const expanded = tracked(false);
      const calls: boolean[] = [];
      const onExpand = (isExpanded: boolean) => calls.push(isExpanded);

      await render(
        <template>
          <DataTable @title="Table title" @items={{items}} as |table|>
            <table.Table>
              <table.Header @isExpandable={{true}} @headers={{headers}} />
              <table.EachBodyRows as |row|>
                <row.Row @isExpanded={{expanded.value}} @onExpand={{onExpand}}>
                  <:default>
                    <table.Column>{{row.item.name}}</table.Column>
                    <table.Column>{{row.item.b}}</table.Column>
                  </:default>
                  <:expanded>Details</:expanded>
                </row.Row>
              </table.EachBodyRows>
            </table.Table>
          </DataTable>
        </template>,
      );

      await click(expandButton(0));

      assert.deepEqual(calls, [true]);
      assert
        .dom(parentRow(0))
        .doesNotHaveClass(
          'cds--expandable-row',
          'the row waits for @isExpanded to change',
        );

      expanded.value = true;
      await settled();

      assert.dom(parentRow(0)).hasClass('cds--expandable-row');
      assert.dom(parentRow(1)).hasClass('cds--expandable-row');

      await click(expandButton(0));

      assert.deepEqual(calls, [true, false]);
    });

    test('the expanded row also spans the selection column', async function (assert) {
      await render(
        <template>
          <DataTable @title="Table title" @items={{items}} as |table|>
            <table.Table>
              <table.Header
                @isExpandable={{true}}
                @isCheckable={{true}}
                @headers={{headers}}
              />
              <table.EachBodyRows as |row|>
                <row.Row @isCheckable={{true}}>
                  <:default>
                    <table.Column>{{row.item.name}}</table.Column>
                    <table.Column>{{row.item.b}}</table.Column>
                  </:default>
                  <:expanded>Details</:expanded>
                </row.Row>
              </table.EachBodyRows>
            </table.Table>
          </DataTable>
        </template>,
      );

      assert.dom(childRow(0).querySelector('td')).hasAttribute('colspan', '4');
    });
  });

  test('a header with hideLabel keeps its name but hides it visually', async function (assert) {
    await render(
      <template>
        <DataTable @title="Table title" @items={{items}} as |table|>
          <table.Table>
            <table.Header
              @headers={{array
                (hash label="Name")
                (hash label="Actions" hideLabel=true)
              }}
            />
          </table.Table>
        </DataTable>
      </template>,
    );

    assert
      .dom('th:last-child .cds--table-header-label')
      .hasText('Actions')
      .hasClass('cds--visually-hidden');
  });
});

module('Integration | Component | Pagination', (hooks) => {
  setupRenderingTest(hooks);

  test('should default to the md size', async function (assert) {
    await render(
      <template>
        <Pagination @length={{10}} @onPageChanged={{noop}} />
      </template>,
    );

    assert.dom('.cds--pagination').hasClass('cds--pagination--md');
  });

  test('should support an xs size', async function (assert) {
    await render(
      <template>
        <Pagination @length={{10}} @size="xs" @onPageChanged={{noop}} />
      </template>,
    );

    assert.dom('.cds--pagination').hasClass('cds--pagination--xs');
  });
});

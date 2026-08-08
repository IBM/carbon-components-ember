import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { array, hash } from '@ember/helper';
import DataTable from 'carbon-components-ember/components/data-table';
import Pagination from 'carbon-components-ember/components/pagination';

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
          @title='Table title'
          @description='Table description'
          @items={{items}}
          as |table|
        >
          <table.Table>
            <table.Header
              @headers={{array (hash label='Name') (hash label='details')}}
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
        <DataTable @title='Table title' @items={{items}} as |table|>
          <table.Table>
            <table.Header
              @headers={{array (hash label='Name') (hash label='details')}}
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

    const headerIds = Array.from(document.querySelectorAll('thead th')).map(
      (th) => th.id,
    );
    assert.strictEqual(headerIds.length, 2);
    assert.ok(headerIds.every((id) => !!id));

    const rows = document.querySelectorAll('tbody tr');
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
        <DataTable @title='Table title' @items={{items}} as |table|>
          <table.Toolbar @size='xs' as |toolbar|>
            <toolbar.Content>
              <table.SearchInput @size='xs' />
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
  });

  test('should support checkable rows and selection', async function (assert) {
    await render(
      <template>
        <DataTable @title='Table title' @items={{items}} as |table|>
          <table.Table>
            <table.Header
              @isCheckable={{true}}
              @headers={{array (hash label='Name') (hash label='details')}}
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
        <Pagination
          @length={{10}}
          @size='xs'
          @onPageChanged={{noop}}
        />
      </template>,
    );

    assert.dom('.cds--pagination').hasClass('cds--pagination--xs');
  });
});

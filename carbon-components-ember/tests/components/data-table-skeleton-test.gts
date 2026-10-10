import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import DataTableSkeleton from '#src/components/data-table-skeleton.gts';

const HEADERS = [{ label: 'Name' }, { label: 'Port' }, { label: 'Status' }];

module('Integration | Component | DataTableSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render five rows of five columns with a header and toolbar', async function (assert) {
    await render(<template><DataTableSkeleton data-test-skeleton /></template>);

    assert
      .dom('table[data-test-skeleton]')
      .hasClass('cds--data-table')
      .hasClass('cds--data-table--lg')
      .doesNotHaveClass('cds--data-table--zebra');
    assert.dom('thead th').exists({ count: 5 });
    assert.dom('tbody tr').exists({ count: 5 });
    assert.dom('.cds--data-table-header').exists();
    assert.dom('.cds--table-toolbar').exists();
  });

  test('should show a column per header', async function (assert) {
    await render(
      <template><DataTableSkeleton @headers={{HEADERS}} /></template>,
    );

    assert.dom('thead th').exists({ count: 3 });
    assert.dom('thead .cds--table-header-label').exists({ count: 3 });
    assert.dom('thead th:first-child').hasText('Name');
  });

  test('should take its counts, size and options', async function (assert) {
    await render(
      <template>
        <DataTableSkeleton
          @columnCount={{2}}
          @rowCount={{3}}
          @size="sm"
          @zebra={{true}}
          @showHeader={{false}}
          @showToolbar={{false}}
        />
      </template>,
    );

    assert
      .dom('table')
      .hasClass('cds--data-table--sm')
      .hasClass('cds--data-table--zebra');
    assert.dom('thead th').exists({ count: 2 });
    assert.dom('tbody tr').exists({ count: 3 });
    assert.dom('.cds--data-table-header').doesNotExist();
    assert.dom('.cds--table-toolbar').doesNotExist();
  });
});

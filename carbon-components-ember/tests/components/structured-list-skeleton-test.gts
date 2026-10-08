import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import StructuredListSkeleton from '#src/components/structured-list-skeleton.gts';

module('Integration | Component | StructuredListSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a header and five rows', async function (assert) {
    await render(
      <template><StructuredListSkeleton data-test-skeleton /></template>,
    );

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--structured-list')
      .hasClass('cds--skeleton');
    assert.dom('.cds--structured-list-th').exists({ count: 3 });
    assert
      .dom('.cds--structured-list-tbody .cds--structured-list-row')
      .exists({ count: 5 });
  });

  test('should take a row count', async function (assert) {
    await render(
      <template><StructuredListSkeleton @rowCount={{2}} /></template>,
    );

    assert
      .dom('.cds--structured-list-tbody .cds--structured-list-row')
      .exists({ count: 2 });
  });
});

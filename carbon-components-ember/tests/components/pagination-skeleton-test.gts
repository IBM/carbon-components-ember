import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import PaginationSkeleton from '#src/components/pagination-skeleton.gts';

module('Integration | Component | PaginationSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render placeholders on both sides', async function (assert) {
    await render(
      <template><PaginationSkeleton data-test-skeleton /></template>,
    );

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--pagination')
      .hasClass('cds--skeleton');
    assert
      .dom('.cds--pagination__left .cds--skeleton__text')
      .exists({ count: 3 });
    assert
      .dom('.cds--pagination__right .cds--skeleton__text')
      .exists({ count: 1 });
  });
});

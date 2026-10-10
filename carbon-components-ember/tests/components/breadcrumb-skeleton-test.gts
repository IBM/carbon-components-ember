import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import BreadcrumbSkeleton from '#src/components/breadcrumb-skeleton.gts';

module('Integration | Component | BreadcrumbSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render three items', async function (assert) {
    await render(
      <template><BreadcrumbSkeleton data-test-skeleton /></template>,
    );

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--breadcrumb')
      .hasClass('cds--skeleton');
    assert.dom('.cds--breadcrumb-item').exists({ count: 3 });
  });

  test('should take its item count, size and trailing slash', async function (assert) {
    await render(
      <template>
        <BreadcrumbSkeleton @items={{5}} @size="sm" @noTrailingSlash={{true}} />
      </template>,
    );

    assert
      .dom('.cds--breadcrumb')
      .hasClass('cds--breadcrumb--sm')
      .hasClass('cds--breadcrumb--no-trailing-slash');
    assert.dom('.cds--breadcrumb-item').exists({ count: 5 });
  });
});

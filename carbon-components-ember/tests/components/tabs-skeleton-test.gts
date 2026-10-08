import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import TabsSkeleton from '#src/components/tabs-skeleton.gts';

module('Integration | Component | TabsSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render five tabs', async function (assert) {
    await render(<template><TabsSkeleton data-test-skeleton /></template>);

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--tabs')
      .hasClass('cds--skeleton')
      .doesNotHaveClass('cds--tabs--contained');
    assert.dom('.cds--tabs__nav-item').exists({ count: 5 });
  });

  test('should render contained tabs', async function (assert) {
    await render(<template><TabsSkeleton @contained={{true}} /></template>);

    assert.dom('.cds--tabs').hasClass('cds--tabs--contained');
  });
});

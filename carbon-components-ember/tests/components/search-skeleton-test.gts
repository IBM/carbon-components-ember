import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import SearchSkeleton from '#src/components/search-skeleton.gts';

module('Integration | Component | SearchSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a search placeholder', async function (assert) {
    await render(<template><SearchSkeleton data-test-skeleton /></template>);

    assert.dom('[data-test-skeleton]').hasClass('cds--skeleton');
    assert.dom('.cds--search-input').exists();
  });

  test('should take a size', async function (assert) {
    await render(
      <template><SearchSkeleton @size="lg" data-test-skeleton /></template>,
    );

    assert.dom('[data-test-skeleton]').hasClass('cds--layout--size-lg');
  });
});

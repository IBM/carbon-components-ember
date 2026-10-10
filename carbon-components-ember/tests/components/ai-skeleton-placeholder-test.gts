import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import AISkeletonPlaceholder from '#src/components/ai-skeleton-placeholder.gts';

module('Integration | Component | AISkeletonPlaceholder', (hooks) => {
  setupRenderingTest(hooks);

  test('should render an AI skeleton placeholder', async function (assert) {
    await render(
      <template><AISkeletonPlaceholder data-test-skeleton /></template>,
    );

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--skeleton__placeholder')
      .hasClass('cds--skeleton__placeholder--ai');
  });
});

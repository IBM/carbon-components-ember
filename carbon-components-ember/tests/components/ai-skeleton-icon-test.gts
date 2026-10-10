import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import AISkeletonIcon from '#src/components/ai-skeleton-icon.gts';

module('Integration | Component | AISkeletonIcon', (hooks) => {
  setupRenderingTest(hooks);

  test('should render an AI skeleton icon', async function (assert) {
    await render(<template><AISkeletonIcon data-test-skeleton /></template>);

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--icon--skeleton')
      .hasClass('cds--skeleton__icon--ai');
  });
});

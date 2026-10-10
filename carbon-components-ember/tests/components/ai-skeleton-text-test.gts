import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import AISkeletonText from '#src/components/ai-skeleton-text.gts';

module('Integration | Component | AISkeletonText', (hooks) => {
  setupRenderingTest(hooks);

  test('should render AI skeleton text', async function (assert) {
    await render(<template><AISkeletonText data-test-skeleton /></template>);

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--skeleton__text')
      .hasClass('cds--skeleton__text--ai');
  });

  test('should pass its arguments to SkeletonText', async function (assert) {
    await render(
      <template>
        <AISkeletonText @paragraph={{true}} @lineCount={{4}} />
      </template>,
    );

    assert.dom('.cds--skeleton__text--ai').exists({ count: 4 });
  });
});

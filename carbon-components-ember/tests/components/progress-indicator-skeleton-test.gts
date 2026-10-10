import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import ProgressIndicatorSkeleton from '#src/components/progress-indicator-skeleton.gts';

module('Integration | Component | ProgressIndicatorSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render four steps', async function (assert) {
    await render(
      <template><ProgressIndicatorSkeleton data-test-skeleton /></template>,
    );

    assert
      .dom('ul[data-test-skeleton]')
      .hasClass('cds--progress')
      .hasClass('cds--skeleton')
      .doesNotHaveClass('cds--progress--vertical');
    assert.dom('.cds--progress-step--incomplete').exists({ count: 4 });
  });

  test('should stack vertically', async function (assert) {
    await render(
      <template><ProgressIndicatorSkeleton @vertical={{true}} /></template>,
    );

    assert.dom('.cds--progress').hasClass('cds--progress--vertical');
  });
});

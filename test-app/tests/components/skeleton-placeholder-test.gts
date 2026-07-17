import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import SkeletonPlaceholder from 'carbon-components-ember/components/skeleton-placeholder';

module('Integration | Component | SkeletonPlaceholder', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a placeholder', async function (assert) {
    await render(<template><SkeletonPlaceholder /></template>);

    assert.dom('.cds--skeleton__placeholder').exists();
  });

  test('should pass through attributes', async function (assert) {
    await render(
      <template><SkeletonPlaceholder class="custom-class" /></template>,
    );

    assert.dom('.cds--skeleton__placeholder').hasClass('custom-class');
  });
});

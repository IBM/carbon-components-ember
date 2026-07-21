import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import SkeletonIcon from 'carbon-components-ember/components/skeleton-icon';

module('Integration | Component | SkeletonIcon', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a skeleton icon', async function (assert) {
    await render(<template><SkeletonIcon /></template>);

    assert.dom('.cds--icon--skeleton').exists();
  });

  test('should pass through attributes', async function (assert) {
    await render(
      <template>
        <SkeletonIcon
          class="custom-class"
          style="width: 2rem; height: 2rem;"
        />
      </template>,
    );

    assert.dom('.cds--icon--skeleton').hasClass('custom-class');
    assert
      .dom('.cds--icon--skeleton')
      .hasStyle({ width: '32px', height: '32px' });
  });
});

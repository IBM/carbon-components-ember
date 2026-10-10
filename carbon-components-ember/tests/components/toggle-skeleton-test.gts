import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import ToggleSkeleton from '#src/components/toggle-skeleton.gts';

module('Integration | Component | ToggleSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a toggle placeholder', async function (assert) {
    await render(<template><ToggleSkeleton data-test-skeleton /></template>);

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--toggle')
      .hasClass('cds--toggle--skeleton');
    assert.dom('.cds--toggle__skeleton-circle').exists();
    assert.dom('.cds--toggle__skeleton-rectangle').exists();
  });
});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import CheckboxSkeleton from '#src/components/checkbox-skeleton.gts';

module('Integration | Component | CheckboxSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a checkbox placeholder', async function (assert) {
    await render(<template><CheckboxSkeleton data-test-skeleton /></template>);

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--checkbox-wrapper')
      .hasClass('cds--checkbox-skeleton');
    assert.dom('.cds--checkbox-label-text').hasClass('cds--skeleton');
  });
});

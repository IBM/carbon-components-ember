import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import SelectSkeleton from '#src/components/select-skeleton.gts';

module('Integration | Component | SelectSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a label and field', async function (assert) {
    await render(<template><SelectSkeleton data-test-skeleton /></template>);

    assert.dom('[data-test-skeleton]').hasClass('cds--form-item');
    assert.dom('.cds--label').exists();
    assert.dom('.cds--select').hasClass('cds--skeleton');
  });

  test('should hide its label', async function (assert) {
    await render(<template><SelectSkeleton @hideLabel={{true}} /></template>);

    assert.dom('.cds--label').doesNotExist();
  });
});

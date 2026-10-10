import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import TextInputSkeleton from '#src/components/text-input-skeleton.gts';

module('Integration | Component | TextInputSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a label and field', async function (assert) {
    await render(<template><TextInputSkeleton data-test-skeleton /></template>);

    assert.dom('[data-test-skeleton]').hasClass('cds--form-item');
    assert.dom('.cds--label').exists();
    assert.dom('.cds--text-input').hasClass('cds--skeleton');
  });

  test('should take a size and hide its label', async function (assert) {
    await render(
      <template><TextInputSkeleton @size="sm" @hideLabel={{true}} /></template>,
    );

    assert.dom('.cds--form-item').hasClass('cds--layout--size-sm');
    assert.dom('.cds--label').doesNotExist();
  });
});

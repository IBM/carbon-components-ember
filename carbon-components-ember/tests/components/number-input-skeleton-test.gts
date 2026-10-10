import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import NumberInputSkeleton from '#src/components/number-input-skeleton.gts';

module('Integration | Component | NumberInputSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a medium field with a label', async function (assert) {
    await render(
      <template><NumberInputSkeleton data-test-skeleton /></template>,
    );

    assert.dom('[data-test-skeleton]').hasClass('cds--form-item');
    assert.dom('.cds--label').exists();
    assert
      .dom('.cds--number')
      .hasClass('cds--skeleton')
      .hasClass('cds--number--md');
  });

  test('should take a size and hide its label', async function (assert) {
    await render(
      <template>
        <NumberInputSkeleton @size="lg" @hideLabel={{true}} />
      </template>,
    );

    assert.dom('.cds--label').doesNotExist();
    assert.dom('.cds--number').hasClass('cds--number--lg');
  });
});

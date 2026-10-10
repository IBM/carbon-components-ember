import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import FluidTextInputSkeleton from '#src/components/fluid-text-input-skeleton.gts';

module('Integration | Component | FluidTextInputSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a fluid field placeholder', async function (assert) {
    await render(
      <template><FluidTextInputSkeleton data-test-skeleton /></template>,
    );

    assert
      .dom('[data-test-skeleton]')
      .hasClass('cds--text-input--fluid__skeleton');
    assert.dom('.cds--text-input').hasClass('cds--skeleton');
  });
});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import RadioButtonSkeleton from '#src/components/radio-button-skeleton.gts';

module('Integration | Component | RadioButtonSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a radio button placeholder', async function (assert) {
    await render(
      <template><RadioButtonSkeleton data-test-skeleton /></template>,
    );

    assert.dom('[data-test-skeleton]').hasClass('cds--radio-button-wrapper');
    assert.dom('.cds--radio-button').hasClass('cds--skeleton');
    assert.dom('.cds--radio-button__label').hasClass('cds--skeleton');
  });
});

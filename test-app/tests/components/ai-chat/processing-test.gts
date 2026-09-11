import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Processing from 'carbon-components-ember/components/ai-chat/processing';

module('Integration | Component | ai-chat/Processing', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders the three dots', async function (assert) {
    await render(<template><Processing /></template>);

    assert.dom('.cds-aichat-processing').exists();
    assert.dom('.cds-aichat-processing__dot').exists({ count: 3 });
    assert.dom('.cds-aichat-processing').hasClass('cds-aichat-processing--linear-no-loop');
  });

  test('@loop switches to the looping variant', async function (assert) {
    await render(<template><Processing @loop={{true}} /></template>);

    assert.dom('.cds-aichat-processing').hasClass('cds-aichat-processing--linear');
    assert.dom('.cds-aichat-processing').doesNotHaveClass('cds-aichat-processing--linear-no-loop');
  });

  test('@quickLoad adds the quick-load class', async function (assert) {
    await render(<template><Processing @quickLoad={{true}} /></template>);

    assert.dom('.cds-aichat-processing').hasClass('cds-aichat-processing--quick-load');
  });
});

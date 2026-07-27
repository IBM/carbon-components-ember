import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import FormItem from 'carbon-components-ember/components/form-item';

module('Integration | Component | FormItem', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a div with the correct class', async function (assert) {
    await render(<template><FormItem>Form item content</FormItem></template>);

    assert.dom('div.cds--form-item').exists();
    assert.dom('div.cds--form-item').hasText('Form item content');
  });

  test('should support a custom className via ...attributes', async function (assert) {
    await render(
      <template>
        <FormItem class='custom-class'>Form item content</FormItem>
      </template>,
    );

    assert.dom('div.cds--form-item').hasClass('custom-class');
  });
});

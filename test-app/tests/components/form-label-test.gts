import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import FormLabel from 'carbon-components-ember/components/form-label';

module('Integration | Component | FormLabel', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a label with the correct classes', async function (assert) {
    await render(<template><FormLabel>Form label</FormLabel></template>);

    assert.dom('label.cds--label').exists();
    assert.dom('label.cds--label').hasClass('cds--label--no-margin');
    assert.dom('label.cds--label').hasText('Form label');
  });

  test('should associate the label with a form control via @id', async function (assert) {
    await render(
      <template>
        <FormLabel @id='my-input'>Form label</FormLabel>
        <input id='my-input' type='text' />
      </template>,
    );

    assert.dom('label.cds--label').hasAttribute('for', 'my-input');
  });

  test('should support a custom className via ...attributes', async function (assert) {
    await render(
      <template>
        <FormLabel class='custom-class'>Form label</FormLabel>
      </template>,
    );

    assert.dom('label.cds--label').hasClass('custom-class');
  });
});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import FormGroup from 'carbon-components-ember/components/form-group';

module('Integration | Component | FormGroup', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a fieldset with a legend', async function (assert) {
    await render(
      <template>
        <FormGroup @legendText='FormGroup Legend'>Form content</FormGroup>
      </template>,
    );

    assert.dom('fieldset.cds--fieldset').exists();
    assert.dom('fieldset.cds--fieldset').hasText('FormGroup Legend Form content');
    assert.dom('legend.cds--label').hasText('FormGroup Legend');
  });

  test('should support disabled', async function (assert) {
    await render(
      <template>
        <FormGroup @legendText='Legend' @disabled={{true}}>Content</FormGroup>
      </template>,
    );

    assert.dom('fieldset').isDisabled();
  });

  test('should support invalid', async function (assert) {
    await render(
      <template>
        <FormGroup @legendText='Legend' @invalid={{true}}>Content</FormGroup>
      </template>,
    );

    assert.dom('fieldset').hasAttribute('data-invalid');
  });

  test('should not render data-invalid when not invalid', async function (assert) {
    await render(
      <template><FormGroup @legendText='Legend'>Content</FormGroup></template>,
    );

    assert.dom('fieldset').doesNotHaveAttribute('data-invalid');
  });

  test('should support legendId with aria-labelledby', async function (assert) {
    await render(
      <template>
        <FormGroup @legendText='Legend' @legendId='my-legend'>
          Content
        </FormGroup>
      </template>,
    );

    assert.dom('fieldset').hasAttribute('aria-labelledby', 'my-legend');
    assert.dom('legend').hasAttribute('id', 'my-legend');
  });

  test('should render message text when message is true', async function (assert) {
    await render(
      <template>
        <FormGroup
          @legendText='Legend'
          @message={{true}}
          @messageText='Required message'
        >Content</FormGroup>
      </template>,
    );

    assert.dom('.cds--form__requirements').hasText('Required message');
  });

  test('should not render message when message is false', async function (assert) {
    await render(
      <template>
        <FormGroup @legendText='Legend' @messageText='Required message'>
          Content
        </FormGroup>
      </template>,
    );

    assert.dom('.cds--form__requirements').doesNotExist();
  });

  test('should support a custom className via ...attributes', async function (assert) {
    await render(
      <template>
        <FormGroup @legendText='Legend' class='custom-class'>
          Content
        </FormGroup>
      </template>,
    );

    assert.dom('fieldset').hasClass('custom-class');
  });
});

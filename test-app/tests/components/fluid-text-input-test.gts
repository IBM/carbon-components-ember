import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click, waitFor } from '@ember/test-helpers';
import FluidTextInput from 'carbon-components-ember/components/fluid-text-input';

module('Integration | Component | FluidTextInput', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a labelled input with the fluid class', async function (assert) {
    await render(<template><FluidTextInput @labelText='Name' /></template>);

    assert.dom('.cds--form-item').exists();
    assert.dom('.cds--text-input-wrapper').hasClass('cds--text-input--fluid');
    assert.dom('input.cds--text-input').exists();
    assert.dom('label.cds--label').hasText('Name');
    assert.dom('hr.cds--text-input__divider').exists();
  });

  test('should support a labelText block for rich label content', async function (assert) {
    await render(
      <template>
        <FluidTextInput @placeholder='Placeholder text'>
          <:labelText>Custom Label</:labelText>
        </FluidTextInput>
      </template>,
    );

    assert.dom('label.cds--label').hasText('Custom Label');
  });

  test('should render the defaultValue', async function (assert) {
    await render(
      <template><FluidTextInput @defaultValue='Hello world' /></template>,
    );

    assert.dom('input.cds--text-input').hasValue('Hello world');
  });

  test('should respect the disabled and readOnly arguments', async function (assert) {
    await render(
      <template>
        <FluidTextInput @disabled={{true}} @readOnly={{true}} />
      </template>,
    );

    assert.dom('input.cds--text-input').isDisabled();
    assert.dom('input.cds--text-input').hasAttribute('readonly');
  });

  test('should call onChange with the new value when typed into', async function (assert) {
    let received;
    const handleChange = (value: string) => (received = value);

    await render(
      <template><FluidTextInput @onChange={{handleChange}} /></template>,
    );

    await fillIn('input.cds--text-input', 'new value');

    assert.strictEqual(received, 'new value');
  });

  test('should show the invalid state and message', async function (assert) {
    await render(
      <template>
        <FluidTextInput @invalid={{true}} @invalidText='This field is required' />
      </template>,
    );
    await waitFor('.cds--text-input__invalid-icon');

    assert.dom('input.cds--text-input').hasClass('cds--text-input--invalid');
    assert.dom('.cds--text-input__invalid-icon').exists();
    assert.dom('.cds--form-requirement').hasText('This field is required');
  });

  test('should show the warn state and message when not invalid', async function (assert) {
    await render(
      <template>
        <FluidTextInput @warn={{true}} @warnText='Careful with this' />
      </template>,
    );

    assert.dom('input.cds--text-input').hasClass('cds--text-input--warning');
    assert.dom('.cds--form-requirement').hasText('Careful with this');
  });

  test('should show a character counter when enableCounter and maxCount are set', async function (assert) {
    await render(
      <template>
        <FluidTextInput @defaultValue='hello' @enableCounter={{true}} @maxCount={{10}} />
      </template>,
    );

    assert.dom('.cds--text-input__label-counter').hasText('5/10');
  });

  test('should render a password toggle when isPassword is set', async function (assert) {
    await render(
      <template>
        <FluidTextInput @labelText='Password' @isPassword={{true}} />
      </template>,
    );

    assert.dom('input.cds--text-input').hasAttribute('type', 'password');
    assert
      .dom('.cds--text-input--password__visibility__toggle')
      .hasAttribute('aria-label', 'Show password');

    await click('.cds--text-input--password__visibility__toggle');

    assert.dom('input.cds--text-input').hasAttribute('type', 'text');
    assert
      .dom('.cds--text-input--password__visibility__toggle')
      .hasAttribute('aria-label', 'Hide password');
  });
});

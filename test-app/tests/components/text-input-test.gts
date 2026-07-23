import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, waitFor } from '@ember/test-helpers';
import TextInput from 'carbon-components-ember/components/text-input';

module('Integration | Component | TextInput', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a labelled input', async function (assert) {
    await render(<template><TextInput @labelText='Name' /></template>);

    assert.dom('.cds--form-item').exists();
    assert.dom('input.cds--text-input').exists();
    assert.dom('label.cds--label').hasText('Name');
  });

  test('should hide the label visually when hideLabel is set', async function (assert) {
    await render(
      <template><TextInput @labelText='Hidden' @hideLabel={{true}} /></template>,
    );

    assert.dom('label.cds--label').hasClass('cds--visually-hidden');
  });

  test('should render the defaultValue', async function (assert) {
    await render(<template><TextInput @defaultValue='Hello world' /></template>);

    assert.dom('input.cds--text-input').hasValue('Hello world');
  });

  test('should default to type text', async function (assert) {
    await render(<template><TextInput /></template>);

    assert.dom('input.cds--text-input').hasAttribute('type', 'text');
  });

  test('should apply the type argument', async function (assert) {
    await render(<template><TextInput @type='password' /></template>);

    assert.dom('input.cds--text-input').hasAttribute('type', 'password');
  });

  test('should apply the size class', async function (assert) {
    await render(<template><TextInput @size='sm' /></template>);

    assert.dom('input.cds--text-input').hasClass('cds--text-input--sm');
  });

  test('should respect the disabled and readOnly arguments', async function (assert) {
    await render(
      <template><TextInput @disabled={{true}} @readOnly={{true}} /></template>,
    );

    assert.dom('input.cds--text-input').isDisabled();
    assert.dom('input.cds--text-input').hasAttribute('readonly');
  });

  test('should call onChange with the new value when typed into', async function (assert) {
    let received;
    const handleChange = (value: string) => (received = value);

    await render(
      <template><TextInput @onChange={{handleChange}} /></template>,
    );

    await fillIn('input.cds--text-input', 'new value');

    assert.strictEqual(received, 'new value');
  });

  test('should show the invalid state and message', async function (assert) {
    await render(
      <template>
        <TextInput @invalid={{true}} @invalidText='This field is required' />
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
        <TextInput @warn={{true}} @warnText='Careful with this' />
      </template>,
    );

    assert.dom('input.cds--text-input').hasClass('cds--text-input--warning');
    assert.dom('.cds--form-requirement').hasText('Careful with this');
  });

  test('should prioritize the invalid state over the warn state', async function (assert) {
    await render(
      <template>
        <TextInput
          @invalid={{true}}
          @invalidText='Invalid'
          @warn={{true}}
          @warnText='Warn'
        />
      </template>,
    );

    assert.dom('.cds--form-requirement').hasText('Invalid');
  });

  test('should show the helper text when not invalid or warn', async function (assert) {
    await render(
      <template><TextInput @helperText='Optional field' /></template>,
    );

    assert.dom('.cds--form__helper-text').hasText('Optional field');
  });

  test('should show a character counter when enableCounter and maxCount are set', async function (assert) {
    await render(
      <template>
        <TextInput @defaultValue='hello' @enableCounter={{true}} @maxCount={{10}} />
      </template>,
    );

    assert.dom('.cds--text-input__label-counter').hasText('5/10');
  });
});

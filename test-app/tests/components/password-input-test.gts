import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click, waitFor } from '@ember/test-helpers';
import PasswordInput from 'carbon-components-ember/components/password-input';

module('Integration | Component | PasswordInput', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a labelled input of type password', async function (assert) {
    await render(<template><PasswordInput @labelText='Password' /></template>);

    assert.dom('.cds--form-item').exists();
    assert.dom('input.cds--text-input.cds--password-input').exists();
    assert.dom('input.cds--text-input').hasAttribute('type', 'password');
    assert.dom('label.cds--label').hasText('Password');
  });

  test('should hide the label visually when hideLabel is set', async function (assert) {
    await render(
      <template><PasswordInput @labelText='Hidden' @hideLabel={{true}} /></template>,
    );

    assert.dom('label.cds--label').hasClass('cds--visually-hidden');
  });

  test('should render the defaultValue', async function (assert) {
    await render(
      <template><PasswordInput @defaultValue='secret' /></template>,
    );

    assert.dom('input.cds--text-input').hasValue('secret');
  });

  test('should apply the layout size class', async function (assert) {
    await render(<template><PasswordInput @size='sm' /></template>);

    assert.dom('.cds--text-input-wrapper').hasClass('cds--layout--size-sm');
  });

  test('should respect the disabled and readOnly arguments', async function (assert) {
    await render(
      <template><PasswordInput @disabled={{true}} @readOnly={{true}} /></template>,
    );

    assert.dom('input.cds--text-input').isDisabled();
    assert.dom('input.cds--text-input').hasAttribute('readonly');
    assert.dom('button.cds--text-input--password__visibility__toggle').isDisabled();
  });

  test('should call onChange with the new value when typed into', async function (assert) {
    let received;
    const handleChange = (value: string) => (received = value);

    await render(
      <template><PasswordInput @onChange={{handleChange}} /></template>,
    );

    await fillIn('input.cds--text-input', 'new value');

    assert.strictEqual(received, 'new value');
  });

  test('should show the invalid state and message', async function (assert) {
    await render(
      <template>
        <PasswordInput @invalid={{true}} @invalidText='This field is required' />
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
        <PasswordInput @warn={{true}} @warnText='Careful with this' />
      </template>,
    );

    assert.dom('input.cds--text-input').hasClass('cds--text-input--warning');
    assert.dom('.cds--form-requirement').hasText('Careful with this');
  });

  test('should show the helper text when not invalid or warn', async function (assert) {
    await render(
      <template><PasswordInput @helperText='Optional field' /></template>,
    );

    assert.dom('.cds--form__helper-text').hasText('Optional field');
  });

  test('should toggle the input type when the visibility button is clicked', async function (assert) {
    await render(<template><PasswordInput @labelText='Password' /></template>);
    await waitFor('button.cds--text-input--password__visibility__toggle svg');

    assert.dom('input.cds--text-input').hasAttribute('type', 'password');

    await click('button.cds--text-input--password__visibility__toggle');

    assert.dom('input.cds--text-input').hasAttribute('type', 'text');

    await click('button.cds--text-input--password__visibility__toggle');

    assert.dom('input.cds--text-input').hasAttribute('type', 'password');
  });

  test('should call onTogglePasswordVisibility when the toggle button is clicked', async function (assert) {
    let calls = 0;
    const handleToggle = () => calls++;

    await render(
      <template>
        <PasswordInput
          @labelText='Password'
          @onTogglePasswordVisibility={{handleToggle}}
        />
      </template>,
    );
    await waitFor('button.cds--text-input--password__visibility__toggle svg');
    await click('button.cds--text-input--password__visibility__toggle');

    assert.strictEqual(calls, 1);
  });

  test('should default to type text when the type argument is text', async function (assert) {
    await render(<template><PasswordInput @type='text' /></template>);

    assert.dom('input.cds--text-input').hasAttribute('type', 'text');
  });
});

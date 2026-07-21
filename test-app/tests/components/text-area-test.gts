import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, waitFor } from '@ember/test-helpers';
import TextArea from 'carbon-components-ember/components/text-area';

module('Integration | Component | TextArea', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a labelled textarea', async function (assert) {
    await render(<template><TextArea @labelText='Comments' /></template>);

    assert.dom('.cds--form-item').exists();
    assert.dom('textarea.cds--text-area').exists();
    assert.dom('label.cds--label').hasText('Comments');
  });

  test('should hide the label visually when hideLabel is set', async function (assert) {
    await render(
      <template><TextArea @labelText='Hidden' @hideLabel={{true}} /></template>,
    );

    assert.dom('label.cds--label').hasClass('cds--visually-hidden');
  });

  test('should render the defaultValue', async function (assert) {
    await render(<template><TextArea @defaultValue='Hello world' /></template>);

    assert.dom('textarea.cds--text-area').hasValue('Hello world');
  });

  test('should respect the disabled and readOnly arguments', async function (assert) {
    await render(
      <template><TextArea @disabled={{true}} @readOnly={{true}} /></template>,
    );

    assert.dom('textarea.cds--text-area').isDisabled();
    assert.dom('textarea.cds--text-area').hasAttribute('readonly');
  });

  test('should apply rows and cols', async function (assert) {
    await render(<template><TextArea @rows={{8}} @cols={{50}} /></template>);

    assert.dom('textarea.cds--text-area').hasAttribute('rows', '8');
    assert.dom('textarea.cds--text-area').hasAttribute('cols', '50');
  });

  test('should default to 4 rows', async function (assert) {
    await render(<template><TextArea /></template>);

    assert.dom('textarea.cds--text-area').hasAttribute('rows', '4');
  });

  test('should call onChange with the new value when typed into', async function (assert) {
    let received;
    const handleChange = (value: string) => (received = value);

    await render(
      <template><TextArea @onChange={{handleChange}} /></template>,
    );

    await fillIn('textarea.cds--text-area', 'new value');

    assert.strictEqual(received, 'new value');
  });

  test('should show the invalid state and message', async function (assert) {
    await render(
      <template>
        <TextArea @invalid={{true}} @invalidText='This field is required' />
      </template>,
    );
    await waitFor('.cds--text-area__invalid-icon');

    assert.dom('textarea.cds--text-area').hasClass('cds--text-area--invalid');
    assert.dom('.cds--text-area__invalid-icon').exists();
    assert.dom('.cds--form-requirement').hasText('This field is required');
  });

  test('should show the warn state and message when not invalid', async function (assert) {
    await render(
      <template>
        <TextArea @warn={{true}} @warnText='Careful with this' />
      </template>,
    );

    assert.dom('textarea.cds--text-area').hasClass('cds--text-area--warn');
    assert.dom('.cds--form-requirement').hasText('Careful with this');
  });

  test('should prioritize the invalid state over the warn state', async function (assert) {
    await render(
      <template>
        <TextArea
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
      <template><TextArea @helperText='Optional field' /></template>,
    );

    assert.dom('.cds--form__helper-text').hasText('Optional field');
  });

  test('should show a character counter when enableCounter and maxCount are set', async function (assert) {
    await render(
      <template>
        <TextArea @defaultValue='hello' @enableCounter={{true}} @maxCount={{10}} />
      </template>,
    );

    assert.dom('.cds--text-area__counter').hasText('5/10');
  });

  test('should count words when counterMode is word', async function (assert) {
    await render(
      <template>
        <TextArea
          @defaultValue='hello there friend'
          @enableCounter={{true}}
          @maxCount={{5}}
          @counterMode='word'
        />
      </template>,
    );

    assert.dom('.cds--text-area__counter').hasText('3/5');
  });
});

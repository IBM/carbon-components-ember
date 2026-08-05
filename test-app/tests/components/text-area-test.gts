import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  fillIn,
  waitFor,
  waitUntil,
  find,
  click,
  triggerKeyEvent,
} from '@ember/test-helpers';
import TextArea from 'carbon-components-ember/components/text-area';
import TextAreaSkeleton from 'carbon-components-ember/components/text-area-skeleton';
import { Add } from 'carbon-components-ember/icons';

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

    assert.dom('.cds--text-area__label-counter').hasText('5/10');
  });

  test('should limit typed characters to maxCount in character counter mode', async function (assert) {
    await render(
      <template>
        <TextArea @enableCounter={{true}} @maxCount={{5}} />
      </template>,
    );

    assert.dom('textarea.cds--text-area').hasAttribute('maxlength', '5');
  });

  test('should not limit the textarea maxlength in word counter mode', async function (assert) {
    await render(
      <template>
        <TextArea
          @enableCounter={{true}}
          @maxCount={{5}}
          @counterMode='word'
        />
      </template>,
    );

    assert.dom('textarea.cds--text-area').doesNotHaveAttribute('maxlength');
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

    assert.dom('.cds--text-area__label-counter').hasText('3/5');
  });

  test('should call onClick when clicked', async function (assert) {
    let clicked = false;
    const handleClick = () => (clicked = true);

    await render(<template><TextArea @onClick={{handleClick}} /></template>);

    await click('textarea.cds--text-area');

    assert.true(clicked);
  });

  test('should call onKeyDown when a key is pressed', async function (assert) {
    let received;
    const handleKeyDown = (event: KeyboardEvent) =>
      (received = event.key);

    await render(
      <template><TextArea @onKeyDown={{handleKeyDown}} /></template>,
    );

    await triggerKeyEvent('textarea.cds--text-area', 'keydown', 'A');

    assert.strictEqual(received, 'A');
  });

  test('should render a decorator component and apply the decorator wrapper classes', async function (assert) {
    await render(<template><TextArea @decorator={{Add}} /></template>);
    await waitUntil(() => find('.cds--text-area__inner-wrapper--decorator svg'));

    assert.dom('.cds--text-area__wrapper').hasClass('cds--text-area__wrapper--decorator');
    assert.dom('.cds--text-area__inner-wrapper--decorator svg').exists();
  });

  test('should render a slug component without the inner-wrapper and apply the slug wrapper class', async function (assert) {
    await render(<template><TextArea @slug={{Add}} /></template>);
    await waitUntil(() => find('.cds--text-area__wrapper svg'));

    assert.dom('.cds--text-area__wrapper').hasClass('cds--text-area__wrapper--slug');
    assert.dom('.cds--text-area__inner-wrapper--decorator').doesNotExist();
  });
});

module('Integration | Component | TextAreaSkeleton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a skeleton text area with a label', async function (assert) {
    await render(<template><TextAreaSkeleton /></template>);

    assert.dom('.cds--form-item').exists();
    assert.dom('.cds--label.cds--skeleton').exists();
    assert.dom('.cds--skeleton.cds--text-area').exists();
  });

  test('@hideLabel hides the label', async function (assert) {
    await render(<template><TextAreaSkeleton @hideLabel={{true}} /></template>);

    assert.dom('.cds--label').doesNotExist();
    assert.dom('.cds--skeleton.cds--text-area').exists();
  });
});

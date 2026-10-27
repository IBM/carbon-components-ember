import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render, fillIn, find } from '@ember/test-helpers';
import TextInput from '#src/components/text-input.gts';

module('Integration | Component | TextInput', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a labelled input', async function (assert) {
    await render(<template><TextInput @labelText="Name" /></template>);

    assert.dom('.cds--form-item').exists();
    assert.dom('input.cds--text-input').exists();
    assert.dom('label.cds--label').hasText('Name');
  });

  test('should hide the label visually when hideLabel is set', async function (assert) {
    await render(
      <template>
        <TextInput @labelText="Hidden" @hideLabel={{true}} />
      </template>,
    );

    assert.dom('label.cds--label').hasClass('cds--visually-hidden');
  });

  test('should render the defaultValue', async function (assert) {
    await render(
      <template><TextInput @defaultValue="Hello world" /></template>,
    );

    assert.dom('input.cds--text-input').hasValue('Hello world');
  });

  test('should default to type text', async function (assert) {
    await render(<template><TextInput /></template>);

    assert.dom('input.cds--text-input').hasAttribute('type', 'text');
  });

  test('should apply the type argument', async function (assert) {
    await render(<template><TextInput @type="password" /></template>);

    assert.dom('input.cds--text-input').hasAttribute('type', 'password');
  });

  test('should apply the size class', async function (assert) {
    await render(<template><TextInput @size="sm" /></template>);

    assert.dom('input.cds--text-input').hasClass('cds--text-input--sm');
  });

  test('should respect the disabled and readOnly arguments', async function (assert) {
    await render(<template><TextInput @disabled={{true}} /></template>);
    assert.dom('input.cds--text-input').isDisabled();

    // Read-only wins, as in Carbon React.
    await render(
      <template><TextInput @disabled={{true}} @readOnly={{true}} /></template>,
    );
    assert.dom('input.cds--text-input').isNotDisabled();
    assert.dom('input.cds--text-input').hasAttribute('readonly');
  });

  test('should call onChange with the input event when typed into, as Carbon React does', async function (assert) {
    let received: (Event & { target: HTMLInputElement }) | undefined;
    const handleChange = (event: Event & { target: HTMLInputElement }) =>
      (received = event);

    await render(<template><TextInput @onChange={{handleChange}} /></template>);

    await fillIn('input.cds--text-input', 'new value');

    assert.strictEqual(received?.type, 'input');
    assert.strictEqual(received?.target.value, 'new value');
  });

  test('should show the invalid state and message', async function (assert) {
    await render(
      <template>
        <TextInput @invalid={{true}} @invalidText="This field is required" />
      </template>,
    );
    assert.dom('input.cds--text-input').hasClass('cds--text-input--invalid');
    assert.dom('.cds--text-input__invalid-icon').exists();
    assert.dom('.cds--form-requirement').hasText('This field is required');
  });

  test('should show the warn state and message when not invalid', async function (assert) {
    await render(
      <template>
        <TextInput @warn={{true}} @warnText="Careful with this" />
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
          @invalidText="Invalid"
          @warn={{true}}
          @warnText="Warn"
        />
      </template>,
    );

    assert.dom('.cds--form-requirement').hasText('Invalid');
  });

  test('should show the helper text when not invalid or warn', async function (assert) {
    await render(
      <template><TextInput @helperText="Optional field" /></template>,
    );

    assert.dom('.cds--form__helper-text').hasText('Optional field');
  });

  test('should show a character counter when enableCounter and maxCount are set', async function (assert) {
    await render(
      <template>
        <TextInput
          @defaultValue="hello"
          @enableCounter={{true}}
          @maxCount={{10}}
        />
      </template>,
    );

    assert.dom('.cds--text-input__label-counter').hasText('5/10');
  });

  test('renders an AI label in its decorator block with the decorator wrapper classes', async function (assert) {
    await render(
      <template>
        <TextInput @labelText="Name">
          <:decorator as |AILabel|><AILabel /></:decorator>
        </TextInput>
      </template>,
    );

    assert
      .dom('.cds--text-input__field-wrapper')
      .hasClass('cds--text-input__field-wrapper--decorator');
    assert
      .dom(
        '.cds--text-input__field-inner-wrapper--decorator .cds--ai-label__button--mini',
      )
      .exists('the yielded AI label is mini, as in Carbon React');
  });

  test('moves the invalid icon clear of an AI label', async function (assert) {
    await render(
      <template>
        <TextInput @labelText="Name" @invalid={{true}} @invalidText="Required">
          <:decorator as |AILabel|><AILabel /></:decorator>
        </TextInput>
      </template>,
    );
    assert.strictEqual(
      getComputedStyle(find('.cds--text-input__invalid-icon')!).insetInlineEnd,
      '40px',
      "Carbon's decorator offset applies, as the icon follows the input",
    );
  });

  test('attributes and {{on "click"}} go on the <input>, @className on the wrapper', async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;
    await render(
      <template>
        <TextInput
          @labelText="Email"
          @className="my-field"
          class="my-input"
          name="email"
          {{on "click" onClick}}
        />
      </template>,
    );

    assert.dom('.cds--text-input-wrapper').hasClass('my-field');
    assert
      .dom('input.cds--text-input')
      .hasClass('my-input')
      .hasAttribute('name');
    await click('input.cds--text-input');
    assert.strictEqual(clicks, 1);
  });

  test('links its invalid, warning and helper texts by id', async function (assert) {
    const input = 'input.cds--text-input';
    await render(
      <template>
        <TextInput
          @labelText="Name"
          @invalid={{true}}
          @invalidText="Required"
        />
      </template>,
    );
    const error = find('.cds--form-requirement')!;
    assert.dom(error).hasText('Required').hasAttribute('dir', 'auto');
    assert.dom(input).hasAttribute('aria-errormessage', error.id);
    assert.dom(input).hasAttribute('aria-describedby', error.id);

    await render(
      <template>
        <TextInput
          @labelText="Name"
          @warn={{true}}
          @warnText="Too short"
          @helperText="Your name"
        />
      </template>,
    );
    assert
      .dom(input)
      .hasAttribute('aria-describedby', find('.cds--form-requirement')!.id)
      .doesNotHaveAttribute('aria-errormessage');

    await render(
      <template>
        <TextInput @labelText="Name" @helperText="Your name" />
      </template>,
    );
    assert
      .dom(input)
      .hasAttribute('aria-describedby', find('.cds--form__helper-text')!.id);
  });

  test('a disabled or read-only input is neither invalid nor warning', async function (assert) {
    await render(
      <template>
        <TextInput
          @disabled={{true}}
          @invalid={{true}}
          @invalidText="Required"
        />
      </template>,
    );
    assert.dom('.cds--form-requirement').doesNotExist();
    assert.dom('input').doesNotHaveAttribute('aria-invalid');

    await render(
      <template>
        <TextInput @readOnly={{true}} @warn={{true}} @warnText="Too short" />
      </template>,
    );
    assert.dom('.cds--form-requirement').doesNotExist();
  });
});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click, waitFor, settled, typeIn } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import { TrackedObject } from 'tracked-built-ins';
import { cell } from 'ember-resources';
import FluidTextInput from 'carbon-components-ember/components/fluid-text-input';
import Toggletip from 'carbon-components-ember/components/toggletip';

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

  test('should open a Toggletip rendered in the labelText block when its button is clicked', async function (assert) {
    await render(
      <template>
        <FluidTextInput @placeholder='Placeholder text'>
          <:labelText>
            <Toggletip as |t|>
              <t.Button @label='Show information'>i</t.Button>
              <t.Content>Additional field information here.</t.Content>
            </Toggletip>
          </:labelText>
        </FluidTextInput>
      </template>,
    );

    assert.dom('.cds--popover-container').doesNotHaveClass('cds--popover--open');

    await click('.cds--toggletip-button');

    assert.dom('.cds--popover-container').hasClass('cds--popover--open');
    assert.dom('.cds--toggletip-content').hasText('Additional field information here.');
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
    assert
      .dom('.cds--text-input-wrapper')
      .hasClass('cds--text-input-wrapper--readonly');
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

  test('should reflect external updates to a controlled value', async function (assert) {
    class State {
      @tracked value = '';
    }
    const state = new State();
    const update = (value: string) => (state.value = value);

    await render(
      <template>
        <FluidTextInput @value={{state.value}} @onChange={{update}} />
      </template>,
    );

    await fillIn('input.cds--text-input', 'typed value');
    assert.strictEqual(state.value, 'typed value');
    assert.dom('input.cds--text-input').hasValue('typed value');

    state.value = 'set from outside';
    await settled();
    assert.dom('input.cds--text-input').hasValue('set from outside');
  });

  test('should keep a TrackedObject-backed controlled value in sync while typing, matching the docs demo', async function (assert) {
    const context = new TrackedObject<{ value: string }>({ value: '' });
    const update = (value: string) => {
      context.value = value;
    };

    await render(
      <template>
        <FluidTextInput @labelText='Controlled' @value={{context.value}} @onChange={{update}} />
        <div id='display'>value: {{context.value}}</div>
      </template>,
    );

    await typeIn('input.cds--text-input', 'hi');

    assert.dom('input.cds--text-input').hasValue('hi');
    assert.dom('#display').hasText('value: hi');
  });

  test('should keep an ember-resources cell-backed controlled value in sync while typing, matching the docs demo', async function (assert) {
    const value = cell('');
    const update = (newValue: string) => (value.current = newValue);

    await render(
      <template>
        <FluidTextInput @labelText='Controlled' @value={{value.current}} @onChange={{update}} />
        <div id='display'>value: {{value.current}}</div>
      </template>,
    );

    await typeIn('input.cds--text-input', 'hi');

    assert.dom('input.cds--text-input').hasValue('hi');
    assert.dom('#display').hasText('value: hi');
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

  test('should prioritize the invalid state over the warn state', async function (assert) {
    await render(
      <template>
        <FluidTextInput
          @invalid={{true}}
          @invalidText='Invalid'
          @warn={{true}}
          @warnText='Warn'
        />
      </template>,
    );
    await waitFor('.cds--text-input__invalid-icon');

    assert.dom('input.cds--text-input').hasClass('cds--text-input--invalid');
    assert
      .dom('input.cds--text-input')
      .doesNotHaveClass('cds--text-input--warning');
    assert.dom('.cds--text-input__invalid-icon').exists();
    assert
      .dom('.cds--text-input__invalid-icon--warning')
      .doesNotExist();
    assert.dom('.cds--form-requirement').hasText('Invalid');
  });

  test('should show a character counter when enableCounter and maxCount are set', async function (assert) {
    await render(
      <template>
        <FluidTextInput @defaultValue='hello' @enableCounter={{true}} @maxCount={{10}} />
      </template>,
    );

    assert.dom('.cds--text-input__label-counter').hasText('5/10');
  });

  test('should show the counter alert when over the maxCount limit', async function (assert) {
    await render(
      <template>
        <FluidTextInput
          @defaultValue='hello world'
          @enableCounter={{true}}
          @maxCount={{5}}
        />
      </template>,
    );

    assert.dom('.cds--text-input__counter-alert').hasText('11/5');
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
    assert
      .dom('.cds--text-input--password__visibility__toggle')
      .hasClass('cds--tooltip__trigger');
    assert.dom('.cds--toggle-password-tooltip').exists();

    await click('.cds--text-input--password__visibility__toggle');

    assert.dom('input.cds--text-input').hasAttribute('type', 'text');
    assert
      .dom('.cds--text-input--password__visibility__toggle')
      .hasAttribute('aria-label', 'Hide password');
  });

  test('should disable the password toggle when disabled', async function (assert) {
    await render(
      <template>
        <FluidTextInput
          @labelText='Password'
          @isPassword={{true}}
          @disabled={{true}}
        />
      </template>,
    );

    assert
      .dom('.cds--text-input--password__visibility__toggle')
      .isDisabled();
  });

  test('should support custom show/hide password labels and onTogglePasswordVisibility', async function (assert) {
    let callCount = 0;
    const handleToggle = () => callCount++;

    await render(
      <template>
        <FluidTextInput
          @labelText='Password'
          @isPassword={{true}}
          @showPasswordLabel='Reveal'
          @hidePasswordLabel='Conceal'
          @onTogglePasswordVisibility={{handleToggle}}
        />
      </template>,
    );

    assert
      .dom('.cds--text-input--password__visibility__toggle')
      .hasAttribute('aria-label', 'Reveal');

    await click('.cds--text-input--password__visibility__toggle');

    assert
      .dom('.cds--text-input--password__visibility__toggle')
      .hasAttribute('aria-label', 'Conceal');
    assert.strictEqual(callCount, 1);
  });
});

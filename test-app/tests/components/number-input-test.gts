import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, typeIn, waitFor } from '@ember/test-helpers';
import { TrackedObject } from 'tracked-built-ins';
import NumberInput from 'carbon-components-ember/components/number-input';

module('Integration | Component | NumberInput', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a labelled number input', async function (assert) {
    await render(<template><NumberInput @label='Quantity' /></template>);

    assert.dom('.cds--form-item').exists();
    assert.dom('.cds--number').exists();
    assert.dom('input[type="number"]').exists();
    assert.dom('label.cds--label').hasText('Quantity');
  });

  test('should default the value to 0', async function (assert) {
    await render(<template><NumberInput /></template>);

    assert.dom('input').hasValue('0');
  });

  test('should render the defaultValue', async function (assert) {
    await render(<template><NumberInput @defaultValue={{5}} /></template>);

    assert.dom('input').hasValue('5');
  });

  test('should hide the label visually when hideLabel is set', async function (assert) {
    await render(
      <template>
        <NumberInput @label='Hidden' @hideLabel={{true}} />
      </template>,
    );

    assert.dom('label.cds--label').hasClass('cds--visually-hidden');
    assert.dom('.cds--number').hasClass('cds--number--nolabel');
  });

  test('should hide the steppers when hideSteppers is set', async function (assert) {
    await render(<template><NumberInput @hideSteppers={{true}} /></template>);

    assert.dom('.cds--number__controls').doesNotExist();
    assert.dom('.cds--number').hasClass('cds--number--nosteppers');
  });

  test('should apply the size class', async function (assert) {
    await render(<template><NumberInput @size='sm' /></template>);

    assert.dom('.cds--number').hasClass('cds--number--sm');
  });

  test('should respect the disabled and readOnly arguments', async function (assert) {
    await render(
      <template>
        <NumberInput @disabled={{true}} @readOnly={{true}} />
      </template>,
    );

    assert.dom('input').isDisabled();
    assert.dom('input').hasAttribute('readonly');
    assert.dom('.cds--number__control-btn.up-icon').isDisabled();
    assert.dom('.cds--number__control-btn.down-icon').isDisabled();
  });

  test('should increment the value when the up stepper is clicked', async function (assert) {
    let received;
    const handleChange = (value: number | '') => (received = value);

    await render(
      <template>
        <NumberInput @defaultValue={{1}} @onChange={{handleChange}} />
      </template>,
    );

    await click('.cds--number__control-btn.up-icon');

    assert.dom('input').hasValue('2');
    assert.strictEqual(received, 2);
  });

  test('should decrement the value when the down stepper is clicked', async function (assert) {
    await render(<template><NumberInput @defaultValue={{1}} /></template>);

    await click('.cds--number__control-btn.down-icon');

    assert.dom('input').hasValue('0');
  });

  test('should step by the given step amount', async function (assert) {
    await render(
      <template><NumberInput @defaultValue={{2}} @step={{5}} /></template>,
    );

    await click('.cds--number__control-btn.up-icon');

    assert.dom('input').hasValue('7');
  });

  test('should clamp stepped values to min and max', async function (assert) {
    await render(
      <template>
        <NumberInput @defaultValue={{10}} @max={{10}} @min={{0}} />
      </template>,
    );

    await click('.cds--number__control-btn.up-icon');

    assert.dom('input').hasValue('10');
  });

  test('should call onChange with the new value when typed into', async function (assert) {
    let received;
    const handleChange = (value: number | '') => (received = value);

    await render(
      <template><NumberInput @onChange={{handleChange}} /></template>,
    );

    await fillIn('input', '42');

    assert.strictEqual(received, 42);
  });

  test('should show an invalid state when the value is out of range', async function (assert) {
    await render(
      <template>
        <NumberInput
          @defaultValue={{20}}
          @max={{10}}
          @invalidText='Value must be 10 or less'
        />
      </template>,
    );
    await waitFor('.cds--number__invalid');

    assert.dom('.cds--number').hasAttribute('data-invalid', 'true');
    assert.dom('.cds--number__invalid').exists();
    assert
      .dom('.cds--form-requirement')
      .hasText('Value must be 10 or less');
  });

  test('should show the warn state and message when not invalid', async function (assert) {
    await render(
      <template>
        <NumberInput @warn={{true}} @warnText='Careful with this' />
      </template>,
    );

    assert
      .dom('.cds--number__input-wrapper')
      .hasClass('cds--number__input-wrapper--warning');
    assert.dom('.cds--form-requirement').hasText('Careful with this');
  });

  test('should show the helper text when not invalid or warn', async function (assert) {
    await render(
      <template><NumberInput @helperText='Optional field' /></template>,
    );

    assert.dom('.cds--form__helper-text').hasText('Optional field');
  });

  test('should update a bound @value through @onChange when used as a controlled input, mirroring the docs demo', async function (assert) {
    const context = new TrackedObject<{ value?: number | '' }>();
    const update = (value: number | '') => {
      context.value = value;
    };

    await render(
      <template>
        <NumberInput @value={{context.value}} @onChange={{update}} />
        <span id='out'>{{context.value}}</span>
      </template>,
    );

    assert.dom('input').hasValue('0');
    assert.dom('#out').hasText('');

    await click('.cds--number__control-btn.up-icon');
    assert.dom('input').hasValue('1');
    assert.dom('#out').hasText('1');

    await click('input');
    await fillIn('input', '');
    await typeIn('input', '42');
    assert.dom('input').hasValue('42');
    assert.dom('#out').hasText('42');

    await click('.cds--number__control-btn.up-icon');
    assert.dom('input').hasValue('43');
    assert.dom('#out').hasText('43');
  });
});

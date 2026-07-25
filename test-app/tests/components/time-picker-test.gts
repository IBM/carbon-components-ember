import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click, select } from '@ember/test-helpers';
import TimePicker from 'carbon-components-ember/components/time-picker';
import TimePickerSelect from 'carbon-components-ember/components/time-picker/time-picker-select';

module('Integration | Component | TimePicker', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a labelled input', async function (assert) {
    await render(<template><TimePicker @labelText='Select a time' /></template>);

    assert.dom('.cds--form-item').exists();
    assert.dom('.cds--time-picker').exists();
    assert.dom('input.cds--time-picker__input-field').exists();
    assert.dom('label.cds--label').hasText('Select a time');
  });

  test('should default the placeholder to hh:mm', async function (assert) {
    await render(<template><TimePicker /></template>);

    assert.dom('input.cds--time-picker__input-field').hasAttribute('placeholder', 'hh:mm');
  });

  test('should hide the label visually when hideLabel is set', async function (assert) {
    await render(
      <template><TimePicker @labelText='Hidden' @hideLabel={{true}} /></template>,
    );

    assert.dom('label.cds--label').hasClass('cds--visually-hidden');
  });

  test('should render the defaultValue', async function (assert) {
    await render(<template><TimePicker @defaultValue='11:00' /></template>);

    assert.dom('input.cds--time-picker__input-field').hasValue('11:00');
  });

  test('should apply the size class, defaulting to md', async function (assert) {
    await render(<template><TimePicker /></template>);
    assert.dom('.cds--time-picker').hasClass('cds--time-picker--md');

    await render(<template><TimePicker @size='sm' /></template>);
    assert.dom('.cds--time-picker').hasClass('cds--time-picker--sm');
  });

  test('should respect the disabled and readOnly arguments', async function (assert) {
    await render(
      <template><TimePicker @disabled={{true}} @readOnly={{true}} /></template>,
    );

    assert.dom('input.cds--time-picker__input-field').isDisabled();
    assert.dom('input.cds--time-picker__input-field').hasAttribute('readonly');
    assert.dom('.cds--time-picker').hasClass('cds--time-picker--readonly');
  });

  test('should call onChange with the new value when typed into', async function (assert) {
    let received;
    const handleChange = (value: string) => (received = value);

    await render(<template><TimePicker @onChange={{handleChange}} /></template>);

    await fillIn('input.cds--time-picker__input-field', '11:00');

    assert.strictEqual(received, '11:00');
  });

  test('should call onClick when the input is clicked', async function (assert) {
    let called = false;
    const handleClick = () => (called = true);

    await render(<template><TimePicker @onClick={{handleClick}} /></template>);

    await click('input.cds--time-picker__input-field');

    assert.true(called);
  });

  test('should show the invalid state and message', async function (assert) {
    await render(
      <template>
        <TimePicker @invalid={{true}} @invalidText='This field is required' />
      </template>,
    );

    assert.dom('.cds--time-picker').hasClass('cds--time-picker--invalid');
    assert.dom('.cds--time-picker__error__icon').exists();
    assert.dom('.cds--form-requirement').hasText('This field is required');
  });

  test('should show the warning state and message when not invalid', async function (assert) {
    await render(
      <template>
        <TimePicker @warning={{true}} @warningText='Careful with this' />
      </template>,
    );

    assert.dom('.cds--time-picker').hasClass('cds--time-picker--warning');
    assert.dom('.cds--form-requirement').hasText('Careful with this');
  });

  test('should prioritize the invalid state over the warning state', async function (assert) {
    await render(
      <template>
        <TimePicker
          @invalid={{true}}
          @invalidText='Invalid'
          @warning={{true}}
          @warningText='Warn'
        />
      </template>,
    );

    assert.dom('.cds--form-requirement').hasText('Invalid');
  });

  test('should render TimePickerSelect children next to the input', async function (assert) {
    await render(
      <template>
        <TimePicker @labelText='Select a time'>
          <TimePickerSelect @id='time-picker-select-1'>
            <option value='AM'>AM</option>
            <option value='PM'>PM</option>
          </TimePickerSelect>
        </TimePicker>
      </template>,
    );

    assert.dom('.cds--time-picker__select').exists();
    assert.dom('select#time-picker-select-1').exists();
    assert.dom('select#time-picker-select-1 option').exists({ count: 2 });
  });

  test('TimePickerSelect should call onChange when a new option is selected', async function (assert) {
    let received;
    const handleChange = (value: string) => (received = value);

    await render(
      <template>
        <TimePickerSelect @id='tp-select' @onChange={{handleChange}}>
          <option value='AM'>AM</option>
          <option value='PM'>PM</option>
        </TimePickerSelect>
      </template>,
    );

    await select('#tp-select', 'PM');

    assert.strictEqual(received, 'PM');
  });

  test('TimePickerSelect should respect the disabled argument', async function (assert) {
    await render(
      <template>
        <TimePickerSelect @id='tp-select-disabled' @disabled={{true}}>
          <option value='AM'>AM</option>
        </TimePickerSelect>
      </template>,
    );

    assert.dom('#tp-select-disabled').isDisabled();
  });
});

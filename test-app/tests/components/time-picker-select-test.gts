import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerEvent, waitUntil } from '@ember/test-helpers';
import TimePickerSelect from 'carbon-components-ember/components/time-picker-select';

module('Integration | Component | TimePickerSelect', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a select with the given id and options', async function (assert) {
    await render(
      <template>
        <TimePickerSelect @id='time-picker-select-1'>
          <option value='AM'>AM</option>
          <option value='PM'>PM</option>
        </TimePickerSelect>
      </template>,
    );

    assert.dom('.cds--select.cds--time-picker__select').exists();
    assert.dom('select.cds--select-input#time-picker-select-1').exists();
    assert.dom('select.cds--select-input option').exists({ count: 2 });
    await waitUntil(() => document.querySelector('.cds--select__arrow'));
    assert.dom('.cds--select__arrow').exists();
  });

  test('should generate an id when none is provided', async function (assert) {
    await render(<template><TimePickerSelect /></template>);

    assert.dom('select.cds--select-input').hasAttribute('id');
  });

  test('should default the aria-label and allow overriding it', async function (assert) {
    await render(<template><TimePickerSelect @id='s1' /></template>);
    assert
      .dom('select.cds--select-input')
      .hasAttribute('aria-label', 'open list of options');

    await render(
      <template><TimePickerSelect @id='s2' @ariaLabel='Select time zone' /></template>,
    );
    assert
      .dom('select.cds--select-input')
      .hasAttribute('aria-label', 'Select time zone');
  });

  test('should respect the disabled argument', async function (assert) {
    await render(<template><TimePickerSelect @id='s1' @disabled={{true}} /></template>);

    assert.dom('select.cds--select-input').isDisabled();
  });

  test('should render the defaultValue', async function (assert) {
    await render(
      <template>
        <TimePickerSelect @id='s1' @defaultValue='PM'>
          <option value='AM'>AM</option>
          <option value='PM'>PM</option>
        </TimePickerSelect>
      </template>,
    );

    assert.dom('select.cds--select-input').hasValue('PM');
  });

  test('should call onChange with the new value when a different option is selected', async function (assert) {
    let received: string | undefined;
    const handleChange = (value: string) => (received = value);

    await render(
      <template>
        <TimePickerSelect @id='s1' @onChange={{handleChange}}>
          <option value='AM'>AM</option>
          <option value='PM'>PM</option>
        </TimePickerSelect>
      </template>,
    );

    await click('select.cds--select-input');
    (document.querySelector('select.cds--select-input') as HTMLSelectElement).value = 'PM';
    await triggerEvent('select.cds--select-input', 'change');

    assert.strictEqual(received, 'PM');
  });

  test('should reflect a controlled value argument', async function (assert) {
    await render(
      <template>
        <TimePickerSelect @id='s1' @value='PM'>
          <option value='AM'>AM</option>
          <option value='PM'>PM</option>
        </TimePickerSelect>
      </template>,
    );

    assert.dom('select.cds--select-input').hasValue('PM');
  });
});

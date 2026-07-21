import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import RadioButton from 'carbon-components-ember/components/radio-button';
import RadioButtonGroup from 'carbon-components-ember/components/radio-button/group';
import { fn } from '@ember/helper';
import { cell } from 'ember-resources';

function setCell(theCell: { current: unknown }, value: unknown) {
  theCell.current = value;
}

module('Integration | Component | RadioButton', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a labelled radio button', async function (assert) {
    await render(<template><RadioButton @labelText='Option' /></template>);

    assert.dom('.cds--radio-button-wrapper').exists();
    assert.dom('input.cds--radio-button').exists();
    assert.dom('.cds--radio-button__label-text').hasText('Option');
  });

  test('should render label from block content', async function (assert) {
    await render(
      <template>
        <RadioButton @labelText='ignored'>Block label</RadioButton>
      </template>,
    );

    assert.dom('.cds--radio-button__label-text').hasText('Block label');
  });

  test('should respect the checked argument', async function (assert) {
    await render(<template><RadioButton @checked={{true}} /></template>);

    assert.dom('input.cds--radio-button').isChecked();
  });

  test('should respect the disabled argument', async function (assert) {
    await render(<template><RadioButton @disabled={{true}} /></template>);

    assert.dom('input.cds--radio-button').isDisabled();
  });

  test('should hide the label visually when hideLabel is set', async function (assert) {
    await render(
      <template><RadioButton @labelText='Hidden' @hideLabel={{true}} /></template>,
    );

    assert
      .dom('.cds--radio-button__label-text')
      .hasClass('cds--visually-hidden');
  });

  test('should add the label-left wrapper class when labelPosition is left', async function (assert) {
    await render(
      <template><RadioButton @labelPosition='left' /></template>,
    );

    assert.dom('.cds--radio-button-wrapper--label-left').exists();
  });

  test('should call onChange with the value, name, and event when clicked', async function (assert) {
    let receivedValue;
    let receivedName;
    const handleChange = (value: unknown, name: string | undefined) => {
      receivedValue = value;
      receivedName = name;
    };

    await render(
      <template>
        <RadioButton
          @value='my-value'
          @name='my-name'
          @onChange={{handleChange}}
        />
      </template>,
    );

    await click('input.cds--radio-button');

    assert.strictEqual(receivedValue, 'my-value');
    assert.strictEqual(receivedName, 'my-name');
  });

  test('RadioButtonGroup should render a legend and only allow one selection', async function (assert) {
    await render(
      <template>
        <RadioButtonGroup @legendText='Choose one' as |Radio|>
          <Radio @value='a' @labelText='A' />
          <Radio @value='b' @labelText='B' />
        </RadioButtonGroup>
      </template>,
    );

    assert.dom('legend.cds--label').hasText('Choose one');

    const inputs = document.querySelectorAll('.cds--radio-button-group input');
    assert.strictEqual(inputs.length, 2);

    await click(inputs[0] as Element);
    assert.dom(inputs[0] as Element).isChecked();
    assert.dom(inputs[1] as Element).isNotChecked();

    await click(inputs[1] as Element);
    assert.dom(inputs[0] as Element).isNotChecked();
    assert.dom(inputs[1] as Element).isChecked();
  });

  test('RadioButtonGroup should respect defaultChecked on a child', async function (assert) {
    await render(
      <template>
        <RadioButtonGroup as |Radio|>
          <Radio @value='a' @labelText='A' @defaultChecked={{true}} />
          <Radio @value='b' @labelText='B' />
        </RadioButtonGroup>
      </template>,
    );

    const inputs = document.querySelectorAll('.cds--radio-button-group input');
    assert.dom(inputs[0] as Element).isChecked();
    assert.dom(inputs[1] as Element).isNotChecked();
  });

  test('RadioButtonGroup should call onChange with the selected value', async function (assert) {
    const selected = cell<string | undefined>(undefined);

    await render(
      <template>
        <RadioButtonGroup @onChange={{fn setCell selected}} as |Radio|>
          <Radio @value='a' @labelText='A' />
          <Radio @value='b' @labelText='B' />
        </RadioButtonGroup>
      </template>,
    );

    const inputs = document.querySelectorAll('.cds--radio-button-group input');
    await click(inputs[1] as Element);

    assert.strictEqual(selected.current, 'b');
  });

  test('RadioButtonGroup should apply the vertical orientation class', async function (assert) {
    await render(
      <template>
        <RadioButtonGroup @orientation='vertical' as |Radio|>
          <Radio @value='a' @labelText='A' />
        </RadioButtonGroup>
      </template>,
    );

    assert.dom('.cds--radio-button-group--vertical').exists();
  });

  test('RadioButtonGroup should disable all radio buttons when disabled', async function (assert) {
    await render(
      <template>
        <RadioButtonGroup @disabled={{true}} as |Radio|>
          <Radio @value='a' @labelText='A' />
          <Radio @value='b' @labelText='B' />
        </RadioButtonGroup>
      </template>,
    );

    const inputs = document.querySelectorAll('.cds--radio-button-group input');
    assert.dom(inputs[0] as Element).isDisabled();
    assert.dom(inputs[1] as Element).isDisabled();
  });
});

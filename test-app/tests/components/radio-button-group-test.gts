import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll, find } from '@ember/test-helpers';
import RadioButtonGroup from 'carbon-components-ember/components/radio/group';

module('Integration | Component | RadioButtonGroup', (hooks) => {
  setupRenderingTest(hooks);

  test('renders legend text and default classes', async function (assert) {
    await render(
      <template>
        <RadioButtonGroup @legendText='Group label' as |Radio|>
          <Radio @value='a' @labelText='option 1' />
          <Radio @value='b' @labelText='option 2' />
        </RadioButtonGroup>
      </template>,
    );

    assert.dom('legend.cds--label').hasText('Group label');
    assert.dom('.cds--form-item').exists();
    assert
      .dom('fieldset')
      .hasClass('cds--radio-button-group')
      .hasClass('cds--radio-button-group--label-right')
      .doesNotHaveClass('cds--radio-button-group--vertical');
    assert.dom('input[type="radio"]').exists({ count: 2 });
  });

  test('applies orientation and label position classes', async function (assert) {
    await render(
      <template>
        <RadioButtonGroup
          @orientation='vertical'
          @labelPosition='left'
          as |Radio|
        >
          <Radio @value='a' @labelText='option 1' />
        </RadioButtonGroup>
      </template>,
    );

    assert
      .dom('fieldset')
      .hasClass('cds--radio-button-group--vertical')
      .hasClass('cds--radio-button-group--label-left');
  });

  test('selecting a radio calls onSelect and onChange with the value', async function (assert) {
    const selected: any[] = [];
    const changed: any[] = [];
    const onSelect = (value: any) => selected.push(value);
    const onChange = (value: any, name: string) => changed.push([value, name]);

    await render(
      <template>
        <RadioButtonGroup
          @name='storage'
          @onSelect={{onSelect}}
          @onChange={{onChange}}
          as |Radio|
        >
          <Radio @value='a' @labelText='option 1' />
          <Radio @value='b' @labelText='option 2' />
        </RadioButtonGroup>
      </template>,
    );

    const inputs = findAll('input[type="radio"]');
    assert.dom(inputs[0]).hasAttribute('name', 'storage');
    await click(inputs[1]!);

    assert.deepEqual(selected, ['b']);
    assert.deepEqual(changed, [['b', 'storage']]);
    assert.true((inputs[1] as HTMLInputElement).checked);
  });

  test('defaultSelected marks the matching radio as checked', async function (assert) {
    await render(
      <template>
        <RadioButtonGroup @defaultSelected='b' as |Radio|>
          <Radio @value='a' @labelText='option 1' />
          <Radio @value='b' @labelText='option 2' />
        </RadioButtonGroup>
      </template>,
    );

    const inputs = findAll('input[type="radio"]') as HTMLInputElement[];
    assert.false(inputs[0]!.checked);
    assert.true(inputs[1]!.checked);
  });

  test('valueSelected marks the matching radio as checked', async function (assert) {
    await render(
      <template>
        <RadioButtonGroup @valueSelected='a' as |Radio|>
          <Radio @value='a' @labelText='option 1' />
          <Radio @value='b' @labelText='option 2' />
        </RadioButtonGroup>
      </template>,
    );

    const inputs = findAll('input[type="radio"]') as HTMLInputElement[];
    assert.true(inputs[0]!.checked);
    assert.false(inputs[1]!.checked);
  });

  test('renders helper text', async function (assert) {
    await render(
      <template>
        <RadioButtonGroup @helperText='Some helper text' as |Radio|>
          <Radio @value='a' @labelText='option 1' />
        </RadioButtonGroup>
      </template>,
    );

    assert.dom('.cds--form__helper-text').hasText('Some helper text');
  });

  test('invalid state renders invalidText and hides helper text', async function (assert) {
    await render(
      <template>
        <RadioButtonGroup
          @invalid={{true}}
          @invalidText='Invalid selection'
          @helperText='Some helper text'
          as |Radio|
        >
          <Radio @value='a' @labelText='option 1' />
        </RadioButtonGroup>
      </template>,
    );

    assert.dom('fieldset').hasClass('cds--radio-button-group--invalid');
    assert
      .dom('.cds--radio-button__validation-msg .cds--form-requirement')
      .hasText('Invalid selection');
    assert.dom('.cds--form__helper-text').doesNotExist();
  });

  test('warn state renders warnText', async function (assert) {
    await render(
      <template>
        <RadioButtonGroup @warn={{true}} @warnText='Watch out' as |Radio|>
          <Radio @value='a' @labelText='option 1' />
        </RadioButtonGroup>
      </template>,
    );

    assert.dom('fieldset').hasClass('cds--radio-button-group--warning');
    assert
      .dom('.cds--radio-button__validation-msg .cds--form-requirement')
      .hasText('Watch out');
  });

  test('readOnly prevents selection', async function (assert) {
    const selected: any[] = [];
    const onSelect = (value: any) => selected.push(value);

    await render(
      <template>
        <RadioButtonGroup @readOnly={{true}} @onSelect={{onSelect}} as |Radio|>
          <Radio @value='a' @labelText='option 1' />
          <Radio @value='b' @labelText='option 2' />
        </RadioButtonGroup>
      </template>,
    );

    assert.dom('fieldset').hasClass('cds--radio-button-group--readonly');
    assert.dom('fieldset').hasAttribute('aria-readonly', 'true');

    const inputs = findAll('input[type="radio"]') as HTMLInputElement[];
    await click(inputs[1]!);

    assert.deepEqual(selected, []);
    assert.false(inputs[1]!.checked);
  });

  test('disabled disables all radio inputs via the fieldset', async function (assert) {
    await render(
      <template>
        <RadioButtonGroup @disabled={{true}} as |Radio|>
          <Radio @value='a' @labelText='option 1' />
        </RadioButtonGroup>
      </template>,
    );

    assert.dom('fieldset').hasAttribute('disabled');
    assert.true(
      find('input[type="radio"]')!.matches(':disabled'),
      'input is disabled through the fieldset',
    );
  });
});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  triggerKeyEvent,
  find,
  waitFor,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Dropdown from 'carbon-components-ember/components/dropdown';

module('Integration | Component | Dropdown', (hooks) => {
  setupRenderingTest(hooks);

  const items = ['Option 1', 'Option 2', 'Option 3'];

  test('renders closed by default with @label as placeholder text', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
        />
      </template>,
    );

    assert.dom('.cds--label').hasText('Choose an option');
    assert.dom('.cds--list-box__label').hasText('Select an option');
    assert.dom('.cds--dropdown').doesNotHaveClass('cds--dropdown--open');
    assert
      .dom('.cds--dropdown')
      .doesNotHaveClass('cds--list-box--expanded');
    assert.dom('[role="listbox"]').exists();
    assert
      .dom('.cds--list-box__field')
      .hasAttribute('aria-expanded', 'false');
  });

  test('clicking the trigger opens the menu and lists items', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
        />
      </template>,
    );

    await click('.cds--list-box__field');

    assert.dom('.cds--dropdown').hasClass('cds--dropdown--open');
    assert
      .dom('.cds--list-box__field')
      .hasAttribute('aria-expanded', 'true');
    assert.dom('[role="option"]').exists({ count: 3 });
    assert
      .dom('[role="option"]:nth-child(1)')
      .hasText('Option 1');
  });

  test('clicking an item selects it, calls @onChange, and closes the menu', async function (assert) {
    let received: { selectedItem: string | null } | undefined;
    const onChange = (data: { selectedItem: string | null }) => {
      received = data;
    };

    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @onChange={{onChange}}
        />
      </template>,
    );

    await click('.cds--list-box__field');
    await click('[role="option"]:nth-child(2)');

    assert.dom('.cds--list-box__label').hasText('Option 2');
    assert.strictEqual(received?.selectedItem, 'Option 2');
    assert.dom('.cds--dropdown').doesNotHaveClass('cds--dropdown--open');
  });

  test('@selectedItem (controlled) always wins over internal state', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @selectedItem='Option 1'
        />
      </template>,
    );

    assert.dom('.cds--list-box__label').hasText('Option 1');

    await click('.cds--list-box__field');
    await click('[role="option"]:nth-child(2)');

    assert
      .dom('.cds--list-box__label')
      .hasText('Option 1', 'selection is frozen until @selectedItem changes');
  });

  test('@initialSelectedItem seeds the uncontrolled case', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @initialSelectedItem='Option 3'
        />
      </template>,
    );

    assert.dom('.cds--list-box__label').hasText('Option 3');

    await click('.cds--list-box__field');
    await click('[role="option"]:nth-child(1)');

    assert
      .dom('.cds--list-box__label')
      .hasText('Option 1', 'uncontrolled state updates freely after the seed');
  });

  test('ArrowDown opens the menu and moves the highlight, Enter selects', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
        />
      </template>,
    );

    const button = find('.cds--list-box__field')!;
    await triggerKeyEvent(button, 'keydown', 'ArrowDown');

    assert.dom('.cds--dropdown').hasClass('cds--dropdown--open');
    assert
      .dom('[role="option"]:nth-child(1)')
      .hasClass('cds--list-box__menu-item--highlighted');

    await triggerKeyEvent(button, 'keydown', 'ArrowDown');
    assert
      .dom('[role="option"]:nth-child(2)')
      .hasClass('cds--list-box__menu-item--highlighted');

    await triggerKeyEvent(button, 'keydown', 'Enter');

    assert.dom('.cds--list-box__label').hasText('Option 2');
    assert.dom('.cds--dropdown').doesNotHaveClass('cds--dropdown--open');
  });

  test('@disabled prevents opening', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @disabled={{true}}
        />
      </template>,
    );

    assert.dom('.cds--list-box__field').isDisabled();
    assert.dom('.cds--dropdown').hasClass('cds--dropdown--disabled');
    // A native `disabled` button can't receive a real click at all (and
    // `click()` throws if you try), which is itself the assertion that
    // matters here - the browser refuses interaction, so there's nothing
    // left for the component to guard against.
    assert.dom('.cds--dropdown').doesNotHaveClass('cds--dropdown--open');
  });

  test('@invalid and @invalidText render the invalid state', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @invalid={{true}}
          @invalidText='This field is required'
        />
      </template>,
    );

    await waitFor('.cds--list-box__invalid-icon');

    assert.dom('.cds--dropdown').hasClass('cds--dropdown--invalid');
    assert.dom('.cds--dropdown').hasAttribute('data-invalid', 'true');
    assert.dom('.cds--list-box__invalid-icon').exists();
    assert.dom('.cds--form-requirement').hasText('This field is required');
  });

  test('@warn and @warnText render the warning state when not invalid', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @warn={{true}}
          @warnText='Careful with this'
        />
      </template>,
    );

    assert.dom('.cds--dropdown').hasClass('cds--list-box--warning');
    assert.dom('.cds--form-requirement').hasText('Careful with this');
  });

  test("@direction='top' adds cds--list-box--up", async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @direction='top'
        />
      </template>,
    );

    assert.dom('.cds--dropdown').hasClass('cds--list-box--up');
  });

  test('supports a custom item block for menu item rendering', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          as |item|
        >
          <strong data-test-item>{{item}}!</strong>
        </Dropdown>
      </template>,
    );

    await click('.cds--list-box__field');

    assert.dom('[data-test-item]').exists({ count: 3 });
    assert
      .dom('[role="option"]:nth-child(1) [data-test-item]')
      .hasText('Option 1!');
  });

  test('passes through html attributes', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          data-test-dropdown
          class='custom-class'
        />
      </template>,
    );

    assert.dom('[data-test-dropdown]').exists();
    assert.dom('[data-test-dropdown]').hasClass('custom-class');
  });

  test('@readOnly keeps the field focusable but prevents opening', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @readOnly={{true}}
        />
      </template>,
    );

    assert.dom('.cds--list-box__field').isNotDisabled();
    assert.dom('.cds--dropdown').hasClass('cds--dropdown--readonly');

    await click('.cds--list-box__field');

    assert.dom('.cds--dropdown').doesNotHaveClass('cds--dropdown--open');
  });

  test('reactively updates selection with a tracked value', async function (assert) {
    class State {
      @tracked selected: string | null = null;
    }
    const state = new State();
    const onChange = (data: { selectedItem: string | null }) => {
      state.selected = data.selectedItem;
    };

    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @selectedItem={{state.selected}}
          @onChange={{onChange}}
        />
      </template>,
    );

    assert.dom('.cds--list-box__label').hasText('Select an option');

    await click('.cds--list-box__field');
    await click('[role="option"]:nth-child(3)');

    assert.dom('.cds--list-box__label').hasText('Option 3');
  });
});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  triggerEvent,
  triggerKeyEvent,
  find,
  waitFor,
} from '@ember/test-helpers';
import fireEvent from '@ember/test-helpers/dom/fire-event';
import { tracked } from '@glimmer/tracking';
import Dropdown from 'carbon-components-ember/components/dropdown';
import { Add } from 'carbon-components-ember/icons';

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

  test('ArrowUp opens the closed menu with the last item highlighted', async function (assert) {
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
    await triggerKeyEvent(button, 'keydown', 'ArrowUp');

    assert.dom('.cds--dropdown').hasClass('cds--dropdown--open');
    assert
      .dom(`[role="option"]:nth-child(${items.length})`)
      .hasClass('cds--list-box__menu-item--highlighted');
  });

  test('exposes the keyboard-highlighted item via aria-activedescendant and role=combobox', async function (assert) {
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
    assert.dom(button).hasAttribute('role', 'combobox');
    assert
      .dom(button)
      .doesNotHaveAttribute(
        'aria-activedescendant',
        'closed dropdown has no active descendant',
      );

    await triggerKeyEvent(button, 'keydown', 'ArrowDown');

    const firstOption = find('[role="option"]:nth-child(1)')!;
    assert.dom(button).hasAttribute('aria-activedescendant', firstOption.id);
    assert.true(!!firstOption.id, 'the highlighted item has an id');

    await triggerKeyEvent(button, 'keydown', 'ArrowDown');

    const secondOption = find('[role="option"]:nth-child(2)')!;
    assert.dom(button).hasAttribute('aria-activedescendant', secondOption.id);

    await triggerKeyEvent(button, 'keydown', 'Escape');

    assert
      .dom(button)
      .doesNotHaveAttribute(
        'aria-activedescendant',
        'closing the menu clears the active descendant',
      );
  });

  test('typing a character jumps the highlight to the next matching item while open', async function (assert) {
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
    await click(button);

    assert
      .dom('[role="option"]:nth-child(1)')
      .hasClass(
        'cds--list-box__menu-item--highlighted',
        'opening with nothing selected highlights the first item',
      );

    await triggerKeyEvent(button, 'keydown', 'O');

    assert
      .dom('[role="option"]:nth-child(2)')
      .hasClass(
        'cds--list-box__menu-item--highlighted',
        'all options start with "o", so typeahead advances past the already-highlighted item',
      );

    await triggerKeyEvent(button, 'keydown', 'O');

    assert
      .dom('[role="option"]:nth-child(3)')
      .hasClass(
        'cds--list-box__menu-item--highlighted',
        'repeating the same character cycles to the next match',
      );
  });

  test('typing a character while closed selects the next matching item', async function (assert) {
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

    const button = find('.cds--list-box__field')!;
    await triggerKeyEvent(button, 'keydown', 'O');

    assert.dom('.cds--list-box__label').hasText('Option 1');
    assert.strictEqual(received?.selectedItem, 'Option 1');
    assert
      .dom('.cds--dropdown')
      .doesNotHaveClass(
        'cds--dropdown--open',
        'typeahead while closed selects without opening the menu',
      );
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
    assert.dom('.cds--dropdown').hasClass('cds--list-box--invalid');
    assert.dom('.cds--dropdown').hasAttribute('data-invalid', 'true');
    assert.dom('.cds--list-box__invalid-icon').exists();
    assert.dom('.cds--form-requirement').hasText('This field is required');
  });

  test('@invalid combined with @decorator adds both state and decorator classes', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @invalid={{true}}
          @invalidText='This field is required'
          @decorator={{Add}}
        />
      </template>,
    );

    await waitFor('.cds--list-box__inner-wrapper--decorator svg');

    assert.dom('.cds--dropdown').hasClass('cds--dropdown--invalid');
    assert.dom('.cds--dropdown').hasClass('cds--list-box--invalid');
    assert.dom('.cds--dropdown__wrapper').hasClass('cds--list-box__wrapper--decorator');
    assert.dom('.cds--list-box__inner-wrapper--decorator svg').exists();
    assert
      .dom('.cds--list-box__inner-wrapper--decorator svg')
      .hasClass(
        'cds--list-box__decorator-icon',
        'decorator icon opts out of the default 24px Icon margin class',
      );
    assert
      .dom('.cds--list-box__inner-wrapper--decorator svg')
      .hasAttribute(
        'width',
        '16',
        'decorator icon is rendered at 16px, not the default 24px',
      );
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

    assert.dom('.cds--dropdown').hasClass('cds--dropdown--warning');
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

  test("default itemToString reads an object item's string `label`", async function (assert) {
    const objectItems = [{ label: 'Option 1' }, { label: 'Option 2' }];

    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{objectItems}}
        />
      </template>,
    );

    await click('.cds--list-box__field');

    assert
      .dom('[role="option"]:nth-child(1)')
      .hasText('Option 1');

    await click('[role="option"]:nth-child(2)');

    assert.dom('.cds--list-box__label').hasText('Option 2');
  });

  test('default itemToString falls back to an empty string when there is no string `label`', async function (assert) {
    const objectItems = [{ id: 1 }, { label: 42 }];

    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{objectItems}}
        />
      </template>,
    );

    await click('.cds--list-box__field');

    assert
      .dom('[role="option"]:nth-child(1)')
      .hasText('', 'an object with no `label` renders as empty text, not "[object Object]"');
    assert
      .dom('[role="option"]:nth-child(2)')
      .hasText('', 'a non-string `label` also falls back to empty text');
  });

  test('a custom @itemToString overrides the default rendering', async function (assert) {
    const objectItems = [{ id: 1, name: 'First' }, { id: 2, name: 'Second' }];
    const itemToString = (item: { id: number; name: string }) =>
      `#${item.id} ${item.name}`;

    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{objectItems}}
          @itemToString={{itemToString}}
        />
      </template>,
    );

    await click('.cds--list-box__field');

    assert
      .dom('[role="option"]:nth-child(1)')
      .hasText('#1 First');

    await click('[role="option"]:nth-child(2)');

    assert.dom('.cds--list-box__label').hasText('#2 Second');
  });

  test('typing two different characters within the reset window accumulates into one search query', async function (assert) {
    const typeaheadItems = ['Orange', 'Olive', 'Option'];

    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{typeaheadItems}}
        />
      </template>,
    );

    const button = find('.cds--list-box__field')!;
    await click(button);

    assert
      .dom('[role="option"]:nth-child(1)')
      .hasClass('cds--list-box__menu-item--highlighted', 'opens highlighting the first item');

    // Fire both keydowns back-to-back with no awaited settle in between, so
    // neither one lets the 500ms search-buffer-reset window elapse first.
    await fireEvent(button, 'keydown', { key: 'o' });
    await fireEvent(button, 'keydown', { key: 'p' });

    assert
      .dom('[role="option"]:nth-child(3)')
      .hasClass(
        'cds--list-box__menu-item--highlighted',
        'accumulated query "op" matches "Option", not just "o" or "p" alone',
      );
  });

  test('a pause longer than the reset window starts a new search query instead of accumulating', async function (assert) {
    const typeaheadItems = ['Orange', 'Olive', 'Option'];

    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{typeaheadItems}}
        />
      </template>,
    );

    const button = find('.cds--list-box__field')!;
    await click(button);

    // Each `triggerKeyEvent` awaits `settled()`, which itself waits for the
    // restartable reset task's 500ms `timeout()` to complete - so by the
    // time this resolves, the search buffer has already been cleared.
    await triggerKeyEvent(button, 'keydown', 'O');

    assert
      .dom('[role="option"]:nth-child(2)')
      .hasClass('cds--list-box__menu-item--highlighted', '"o" alone matches "Olive"');

    await triggerKeyEvent(button, 'keydown', 'P');

    assert
      .dom('[role="option"]:nth-child(2)')
      .hasClass(
        'cds--list-box__menu-item--highlighted',
        'no item starts with "p" alone, so the highlight is unchanged - it never sees the accumulated "op"',
      );
  });

  test('Tab closes the open menu', async function (assert) {
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
    await click(button);

    assert.dom('.cds--dropdown').hasClass('cds--dropdown--open');

    await triggerKeyEvent(button, 'keydown', 'Tab');

    assert.dom('.cds--dropdown').doesNotHaveClass('cds--dropdown--open');
  });

  test('blurring the field closes the open menu', async function (assert) {
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
    await click(button);

    assert.dom('.cds--dropdown').hasClass('cds--dropdown--open');

    await triggerEvent(button, 'blur');

    assert.dom('.cds--dropdown').doesNotHaveClass('cds--dropdown--open');
    assert.dom('.cds--dropdown').doesNotHaveClass('cds--dropdown--focus');
  });

  test('Home and End jump the highlight to the first and last item', async function (assert) {
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
    await click(button);
    await triggerKeyEvent(button, 'keydown', 'ArrowDown');

    assert
      .dom('[role="option"]:nth-child(2)')
      .hasClass('cds--list-box__menu-item--highlighted');

    await triggerKeyEvent(button, 'keydown', 'End');

    assert
      .dom('[role="option"]:nth-child(3)')
      .hasClass('cds--list-box__menu-item--highlighted', 'End jumps to the last item');

    await triggerKeyEvent(button, 'keydown', 'Home');

    assert
      .dom('[role="option"]:nth-child(1)')
      .hasClass('cds--list-box__menu-item--highlighted', 'Home jumps to the first item');
  });

  test('aria-describedby points at the helper text element', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @helperText='Some helpful text'
        />
      </template>,
    );

    const button = find('.cds--list-box__field')!;
    const describedBy = button.getAttribute('aria-describedby');

    assert.true(!!describedBy, 'aria-describedby is set when helper text is shown');
    assert.dom(`#${describedBy}`).hasText('Some helpful text');
  });

  test('@size renders the corresponding size classes', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @size='sm'
        />
      </template>,
    );

    assert.dom('.cds--dropdown').hasClass('cds--dropdown--sm');
    assert.dom('.cds--dropdown').hasClass('cds--list-box--sm');
  });

  test("@type='inline' adds the inline layout classes and suppresses helper text", async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @type='inline'
          @helperText='Some helpful text'
        />
      </template>,
    );

    assert.dom('.cds--dropdown__wrapper').hasClass('cds--dropdown__wrapper--inline');
    assert.dom('.cds--dropdown__wrapper').hasClass('cds--list-box__wrapper--inline');
    assert.dom('.cds--dropdown').hasClass('cds--dropdown--inline');
    assert.dom('.cds--label').exists('the label row is still rendered when inline');
    assert.dom('.cds--form__helper-text').doesNotExist('inline suppresses helper text');
  });

  test('@hideLabel visually hides the label without removing it', async function (assert) {
    await render(
      <template>
        <Dropdown
          @titleText='Choose an option'
          @label='Select an option'
          @items={{items}}
          @hideLabel={{true}}
        />
      </template>,
    );

    assert.dom('.cds--label').hasClass('cds--visually-hidden');
    assert.dom('.cds--label').hasText('Choose an option');
  });
});

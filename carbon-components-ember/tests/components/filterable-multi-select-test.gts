import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  blur,
  click,
  fillIn,
  find,
  findAll,
  focus,
  render,
  settled,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import FilterableMultiSelect from '#src/components/filterable-multi-select.gts';

import type { FilterableMultiSelectChange } from '#src/components/filterable-multi-select.gts';

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
  isSelectAll?: boolean;
}

const items: Item[] = [
  { id: 'cherry', text: 'Cherry' },
  { id: 'apple', text: 'Apple' },
  { id: 'banana', text: 'Banana', disabled: true },
  { id: 'apricot', text: 'Apricot' },
];
const [cherry, apple, banana, apricot] = items as [Item, Item, Item, Item];
const itemToString = (item: Item) => item.text;

const INPUT = 'input[role="combobox"]';
const OPTION = '[role="option"]';

function spy<T>() {
  const calls: T[] = [];
  return { calls, call: (value: T) => void calls.push(value) };
}

const listed = () =>
  findAll(OPTION).map((element) => element.getAttribute('aria-label'));

const highlighted = () =>
  find('.cds--list-box__menu-item--highlighted')?.getAttribute('aria-label');

function option(text: string) {
  return find(`${OPTION}[aria-label="${text}"]`)!;
}

module('Integration | Component | FilterableMultiSelect', function (hooks) {
  setupRenderingTest(hooks);

  test('the label names the input, and a click opens the sorted menu', async function (assert) {
    const onMenuChange = spy<boolean>();
    await render(
      <template>
        <FilterableMultiSelect
          @id="fruit"
          @titleText="Fruit"
          @placeholder="Filter fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @onMenuChange={{onMenuChange.call}}
        />
      </template>,
    );

    assert
      .dom('#fruit')
      .hasClass('cds--multi-select')
      .hasClass('cds--combo-box')
      .hasClass('cds--multi-select--filterable');
    assert
      .dom(INPUT)
      .hasAttribute('id', 'fruit-input')
      .hasAttribute('placeholder', 'Filter fruit')
      .hasAttribute('aria-expanded', 'false')
      .doesNotHaveAttribute('aria-controls');
    assert.dom('label.cds--label').hasAttribute('for', 'fruit-input');
    assert
      .dom('label.cds--label .cds--visually-hidden')
      .hasText('Total items selected: 0.');

    await click(INPUT);

    assert.dom(INPUT).hasAttribute('aria-controls', 'fruit__menu');
    assert.dom('.cds--multi-select').hasClass('cds--multi-select--open');
    assert.deepEqual(listed(), ['Apple', 'Apricot', 'Banana', 'Cherry']);
    assert.deepEqual(onMenuChange.calls, [true]);
  });

  test('typing lists the matching items, and checking one keeps the text and the menu', async function (assert) {
    const onChange = spy<FilterableMultiSelectChange<Item>>();
    const onInputValueChange = spy<{ inputValue: string }>();
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @onChange={{onChange.call}}
          @onInputValueChange={{onInputValueChange.call}}
        />
      </template>,
    );

    await fillIn(INPUT, 'ap');

    assert.deepEqual(listed(), ['Apple', 'Apricot']);
    assert.deepEqual(onInputValueChange.calls, [{ inputValue: 'ap' }]);
    assert.strictEqual(highlighted(), 'Apple');

    await click(option('Apricot'));

    assert.deepEqual(onChange.calls, [{ selectedItems: [apricot] }]);
    assert.dom(INPUT).hasValue('ap').isFocused();
    assert.dom(INPUT).hasAttribute('aria-expanded', 'true');
    assert.dom('.cds--tag__label').hasText('1');
  });

  test('items stay in place while the menu is open, and the selection comes first when it opens again', async function (assert) {
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
        />
      </template>,
    );

    await click(INPUT);
    await click(option('Cherry'));
    assert.deepEqual(listed(), ['Apple', 'Apricot', 'Banana', 'Cherry']);

    await click(INPUT);
    await click(INPUT);
    assert.deepEqual(listed(), ['Cherry', 'Apple', 'Apricot', 'Banana']);
  });

  test('Enter opens the field, and checks the highlighted item in the open menu', async function (assert) {
    const onChange = spy<FilterableMultiSelectChange<Item>>();
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await focus(INPUT);
    await triggerKeyEvent(INPUT, 'keydown', 'Enter');
    assert.dom(INPUT).hasAttribute('aria-expanded', 'true');

    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    assert.strictEqual(highlighted(), 'Apple');
    await triggerKeyEvent(INPUT, 'keydown', 'Enter');

    assert.deepEqual(onChange.calls, [{ selectedItems: [apple] }]);
    assert.dom(INPUT).hasAttribute('aria-expanded', 'true');
    assert.strictEqual(highlighted(), 'Apple');
  });

  test('ArrowDown opens the field, and the arrow keys wrap around, skipping disabled items', async function (assert) {
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
        />
      </template>,
    );

    await focus(INPUT);
    await triggerKeyEvent(INPUT, 'keydown', 'ArrowUp');
    assert
      .dom(INPUT)
      .hasAttribute('aria-expanded', 'false', "ArrowUp doesn't open it");

    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    assert.strictEqual(highlighted(), 'Apple');

    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    assert.strictEqual(highlighted(), 'Cherry', 'Banana is skipped');

    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    assert.strictEqual(highlighted(), 'Apple', 'wraps around');

    await triggerKeyEvent(INPUT, 'keydown', 'ArrowUp');
    assert.strictEqual(highlighted(), 'Cherry');
  });

  test('Escape on the open field clears the text and closes it', async function (assert) {
    const onChange = spy<FilterableMultiSelectChange<Item>>();
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItems={{array cherry}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await fillIn(INPUT, 'ap');
    await triggerKeyEvent(INPUT, 'keydown', 'Escape');

    assert.dom(INPUT).hasValue('').hasAttribute('aria-expanded', 'false');
    assert.deepEqual(onChange.calls, [], 'the selection stays');
  });

  test('Escape, Delete, or Backspace in the empty input clears the closed field', async function (assert) {
    for (const key of ['Escape', 'Delete', 'Backspace']) {
      const onChange = spy<FilterableMultiSelectChange<Item>>();
      await render(
        <template>
          <FilterableMultiSelect
            @items={{items}}
            @itemToString={{itemToString}}
            @initialSelectedItems={{array cherry apple}}
            @onChange={{onChange.call}}
          />
        </template>,
      );

      await focus(INPUT);
      await triggerKeyEvent(INPUT, 'keydown', key);

      assert.deepEqual(onChange.calls, [{ selectedItems: [] }], key);
    }
  });

  test('Delete on the open field leaves the selection', async function (assert) {
    const onChange = spy<FilterableMultiSelectChange<Item>>();
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItems={{array cherry}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await fillIn(INPUT, 'test');
    await triggerKeyEvent(INPUT, 'keydown', 'Delete');

    assert.deepEqual(onChange.calls, []);
    assert.dom(INPUT).hasValue('test');
  });

  test('the clear button empties the input, and the tag clears the selection', async function (assert) {
    const onChange = spy<FilterableMultiSelectChange<Item>>();
    const onInputValueChange = spy<{ inputValue: string }>();
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItems={{array cherry apple}}
          @onChange={{onChange.call}}
          @onInputValueChange={{onInputValueChange.call}}
        />
      </template>,
    );

    await fillIn(INPUT, 'ch');
    await click('.cds--list-box__selection');
    assert.dom(INPUT).hasValue('').isFocused();
    assert.deepEqual(onInputValueChange.calls.at(-1), { inputValue: '' });

    assert
      .dom('.cds--tag__close-icon')
      .hasAttribute('aria-label', 'Clear selected items');
    await click('.cds--tag__close-icon');
    assert.deepEqual(onChange.calls, [{ selectedItems: [] }]);
    assert.dom('.cds--tag').doesNotExist();
  });

  test('leaving the field closes it and clears the text, reporting both', async function (assert) {
    const onMenuChange = spy<boolean>();
    const onInputValueChange = spy<{ inputValue: string }>();
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @onMenuChange={{onMenuChange.call}}
          @onInputValueChange={{onInputValueChange.call}}
        />
      </template>,
    );

    await fillIn(INPUT, 'ap');
    await blur(INPUT);

    assert.dom(INPUT).hasValue('').hasAttribute('aria-expanded', 'false');
    assert.deepEqual(onMenuChange.calls, [true, false]);
    assert.deepEqual(
      onInputValueChange.calls,
      [{ inputValue: 'ap' }, { inputValue: '' }],
      'so a search done elsewhere resets too',
    );
  });

  test('Backspace with a modifier key leaves the selection, as in downshift', async function (assert) {
    const onChange = spy<FilterableMultiSelectChange<Item>>();
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItems={{array cherry}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await focus(INPUT);
    await triggerKeyEvent(INPUT, 'keydown', 'Backspace', { altKey: true });
    await triggerKeyEvent(INPUT, 'keydown', 'Backspace', { metaKey: true });

    assert.deepEqual(onChange.calls, []);
  });

  test('a disabled item draws its checkbox disabled', async function (assert) {
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItems={{array banana}}
        />
      </template>,
    );

    await click(INPUT);

    assert
      .dom(`${OPTION}[aria-label="Banana"] .cds--checkbox-label`)
      .hasAttribute('data-contained-checkbox-state', 'true')
      .hasAttribute('data-contained-checkbox-disabled', 'true');
    assert
      .dom(`${OPTION}[aria-label="Apple"] .cds--checkbox-label`)
      .hasAttribute('data-contained-checkbox-disabled', 'false');
  });

  test('the menu button opens and closes the menu', async function (assert) {
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
        />
      </template>,
    );

    await click('.cds--list-box__menu-icon');
    assert.dom(INPUT).hasAttribute('aria-expanded', 'true').isFocused();

    await click('.cds--list-box__menu-icon');
    assert.dom(INPUT).hasAttribute('aria-expanded', 'false');
  });

  test('@open opens the menu at first, reported once, and follows changes', async function (assert) {
    const open = tracked(true);
    const onMenuChange = spy<boolean>();
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @open={{open.value}}
          @onMenuChange={{onMenuChange.call}}
        />
      </template>,
    );
    assert.dom(INPUT).hasAttribute('aria-expanded', 'true');
    assert.deepEqual(onMenuChange.calls, [true]);

    open.value = false;
    await settled();
    assert.dom(INPUT).hasAttribute('aria-expanded', 'false');
    assert.deepEqual(onMenuChange.calls, [true, false]);
  });

  module('a select-all item', function () {
    const roles: Item[] = [
      { id: 'editor', text: 'Editor' },
      { id: 'owner', text: 'Owner' },
      { id: 'reader', text: 'Reader', disabled: true },
      { id: 'all', text: 'All roles', isSelectAll: true },
    ];
    const [editor, owner] = roles as [Item, Item];

    test('stays first, and checks or clears every enabled item listed', async function (assert) {
      const onChange = spy<FilterableMultiSelectChange<Item>>();
      await render(
        <template>
          <FilterableMultiSelect
            @items={{roles}}
            @itemToString={{itemToString}}
            @onChange={{onChange.call}}
          />
        </template>,
      );

      await click(INPUT);
      assert.deepEqual(listed(), ['All roles', 'Editor', 'Owner', 'Reader']);

      await click(option('All roles'));
      assert.deepEqual(onChange.calls.at(-1), {
        selectedItems: [editor, owner],
      });
      assert.dom(option('All roles')).hasAttribute('aria-checked', 'true');

      await click(option('Owner'));
      assert.dom(option('All roles')).hasAttribute('aria-checked', 'mixed');

      await click(option('All roles'));
      assert.deepEqual(onChange.calls.at(-1), { selectedItems: [] });
    });

    test('works on the items the text typed lists, keeping the rest of the selection', async function (assert) {
      const onChange = spy<FilterableMultiSelectChange<Item>>();
      await render(
        <template>
          <FilterableMultiSelect
            @items={{roles}}
            @itemToString={{itemToString}}
            @initialSelectedItems={{array editor}}
            @onChange={{onChange.call}}
          />
        </template>,
      );

      await fillIn(INPUT, 'own');
      assert.deepEqual(listed(), ['All roles', 'Owner']);
      assert.dom(option('All roles')).hasAttribute('aria-checked', 'false');

      await click(option('All roles'));
      assert.deepEqual(onChange.calls.at(-1), {
        selectedItems: [editor, owner],
      });

      await click(option('All roles'));
      assert.deepEqual(onChange.calls.at(-1), { selectedItems: [editor] });
    });

    test("isn't listed when nothing it could check is", async function (assert) {
      await render(
        <template>
          <FilterableMultiSelect
            @items={{roles}}
            @itemToString={{itemToString}}
          />
        </template>,
      );

      await fillIn(INPUT, 'read');

      assert.deepEqual(listed(), ['Reader']);
    });
  });

  test('@filterItems decides what is listed, for a search done elsewhere', async function (assert) {
    const results = tracked(items);
    const asGiven = (list: readonly Item[]) => [...list];
    const search = ({ inputValue }: { inputValue: string }) => {
      results.value = items.filter((item) =>
        item.id.startsWith(inputValue.toLowerCase()),
      );
    };
    await render(
      <template>
        <FilterableMultiSelect
          @items={{results.value}}
          @itemToString={{itemToString}}
          @filterItems={{asGiven}}
          @onInputValueChange={{search}}
        />
      </template>,
    );

    await fillIn(INPUT, 'ch');

    assert.deepEqual(listed(), ['Cherry']);
  });

  test('@selectedItems wins over internal state', async function (assert) {
    const selected = tracked<Item[]>([apple]);
    const handleChange = (data: FilterableMultiSelectChange<Item>) => {
      selected.value = data.selectedItems;
    };
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @selectedItems={{selected.value}}
          @onChange={{handleChange}}
        />
      </template>,
    );
    assert.dom('.cds--tag__label').hasText('1');

    await click(INPUT);
    await click(option('Cherry'));
    assert.deepEqual(selected.value, [apple, cherry]);

    selected.value = [];
    await settled();
    assert.dom('.cds--tag').doesNotExist();
    assert.dom(option('Apple')).hasAttribute('aria-selected', 'false');
  });

  test('a read-only field can be focused, but not opened or cleared', async function (assert) {
    const onChange = spy<FilterableMultiSelectChange<Item>>();
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItems={{array apple}}
          @readOnly={{true}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await click(INPUT);
    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    await triggerKeyEvent(INPUT, 'keydown', 'Escape');
    await click('.cds--list-box__menu-icon');

    assert
      .dom(INPUT)
      .hasAttribute('readonly')
      .hasAttribute('aria-expanded', 'false');
    assert.dom('.cds--multi-select').hasClass('cds--multi-select--readonly');
    assert.dom('.cds--tag__close-icon').isDisabled();
    assert.deepEqual(onChange.calls, []);
  });

  test('a disabled field is disabled throughout', async function (assert) {
    await render(
      <template>
        <FilterableMultiSelect
          @titleText="Fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItems={{array apple}}
          @disabled={{true}}
        />
      </template>,
    );

    assert.dom(INPUT).isDisabled();
    assert.dom('.cds--list-box__menu-icon').isDisabled();
    assert.dom('.cds--tag__close-icon').isDisabled();
    assert.dom('.cds--label').hasClass('cds--label--disabled');
  });

  test('the invalid and warning states show, unless the field is disabled or read-only', async function (assert) {
    const state = tracked<'invalid' | 'warn'>('invalid');
    const disabled = tracked(false);
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @helperText="Pick some"
          @invalid={{eq state.value "invalid"}}
          @invalidText="Required"
          @warn={{eq state.value "warn"}}
          @warnText="Check this"
          @disabled={{disabled.value}}
        />
      </template>,
    );
    const describedText = () =>
      document.getElementById(find(INPUT)!.getAttribute('aria-describedby')!)
        ?.textContent;

    assert.dom('.cds--multi-select').hasClass('cds--multi-select--invalid');
    assert.dom('.cds--form__helper-text').doesNotExist();
    assert.strictEqual(describedText(), 'Required');

    state.value = 'warn';
    await settled();
    assert.dom('.cds--form-requirement').hasText('Check this');
    assert.strictEqual(describedText(), 'Check this');

    disabled.value = true;
    await settled();
    assert.dom('.cds--form-requirement').doesNotExist();
    assert.dom('.cds--form__helper-text').hasText('Pick some');
  });

  test('@type, @direction, @hideLabel and @autoAlign set the classes', async function (assert) {
    await render(
      <template>
        <FilterableMultiSelect
          @titleText="Fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @type="inline"
          @direction="top"
          @hideLabel={{true}}
          @autoAlign={{true}}
        />
      </template>,
    );

    assert
      .dom('.cds--multi-select__wrapper')
      .hasClass('cds--multi-select--filterable__wrapper')
      .hasClass('cds--multi-select__wrapper--inline')
      .hasClass('cds--list-box--up')
      .hasClass('cds--autoalign');
    assert.dom('.cds--multi-select').hasClass('cds--multi-select--inline');
    assert.dom('label.cds--label').hasClass('cds--visually-hidden');

    await click(INPUT);
    assert.strictEqual(
      (find('.cds--list-box__menu') as HTMLElement).style.position,
      'fixed',
    );
  });

  test('Enter confirming an IME composition checks nothing', async function (assert) {
    const onChange = spy<FilterableMultiSelectChange<Item>>();
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await fillIn(INPUT, 'ap');
    find(INPUT)!.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        isComposing: true,
        bubbles: true,
      }),
    );
    await settled();

    assert.deepEqual(onChange.calls, []);
  });

  test('a block renders each item', async function (assert) {
    await render(
      <template>
        <FilterableMultiSelect
          @items={{items}}
          @itemToString={{itemToString}}
          as |item|
        >
          <strong>{{item.id}}</strong>
        </FilterableMultiSelect>
      </template>,
    );

    await click(INPUT);

    assert
      .dom(`${OPTION} .cds--checkbox-label-text strong`)
      .exists({ count: 4 });
  });
});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  blur,
  click,
  find,
  findAll,
  focus,
  render,
  settled,
  triggerEvent,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import MultiSelect from '#src/components/multi-select.gts';

import type { MultiSelectChange } from '#src/components/multi-select.gts';

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
  isSelectAll?: boolean;
}

// Out of order, as the menu lists them by text.
const items: Item[] = [
  { id: 'cherry', text: 'Cherry' },
  { id: 'apple', text: 'Apple' },
  { id: 'banana', text: 'Banana', disabled: true },
  { id: 'date', text: 'Date' },
];
const [cherry, apple, , date] = items as [Item, Item, Item, Item];
const itemToString = (item: Item) => item.text;

const FIELD = 'button.cds--list-box__field';
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

module('Integration | Component | MultiSelect', function (hooks) {
  setupRenderingTest(hooks);

  test('the field shows @label, the title names it, and a click opens the sorted menu', async function (assert) {
    await render(
      <template>
        <MultiSelect
          @id="fruit"
          @titleText="Fruit"
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
        />
      </template>,
    );

    assert
      .dom('#fruit')
      .hasClass('cds--multi-select')
      .hasClass('cds--list-box');
    assert.dom('.cds--list-box__label').hasText('Choose fruit');
    assert
      .dom(FIELD)
      .hasAttribute('role', 'combobox')
      .hasAttribute('aria-labelledby', 'fruit-label')
      .hasAttribute('aria-expanded', 'false');
    assert
      .dom('label.cds--label')
      .hasText('Fruit')
      .hasAttribute('for', find(FIELD)!.id);
    assert.dom('[role="listbox"]').hasAttribute('hidden');

    await click(FIELD);

    assert.dom(FIELD).hasAttribute('aria-expanded', 'true');
    assert.dom('[role="listbox"]').doesNotHaveAttribute('hidden');
    assert.deepEqual(listed(), ['Apple', 'Banana', 'Cherry', 'Date']);
    assert
      .dom(option('Banana'))
      .hasAttribute('disabled')
      .hasAttribute('aria-disabled', 'true');
  });

  test('clicking items checks and unchecks them, and the menu stays open', async function (assert) {
    const onChange = spy<MultiSelectChange<Item>>();
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await click(FIELD);
    await click(option('Cherry'));
    await click(option('Apple'));

    assert.deepEqual(onChange.calls, [
      { selectedItems: [cherry] },
      { selectedItems: [cherry, apple] },
    ]);
    assert.dom(FIELD).hasAttribute('aria-expanded', 'true').isFocused();
    assert
      .dom(option('Cherry'))
      .hasAttribute('aria-selected', 'true')
      .hasAttribute('aria-checked', 'true')
      .hasClass('cds--list-box__menu-item--active');
    assert
      .dom(`${OPTION}[aria-label="Cherry"] .cds--checkbox-label`)
      .hasAttribute('data-contained-checkbox-state', 'true');
    assert.dom('.cds--tag__label').hasText('2');
    assert.dom('.cds--multi-select').hasClass('cds--multi-select--selected');

    await click(option('Cherry'));
    assert.deepEqual(onChange.calls.at(-1), { selectedItems: [apple] });
    assert.dom(option('Cherry')).hasAttribute('aria-selected', 'false');

    await click(option('Banana'));
    assert.strictEqual(
      onChange.calls.length,
      3,
      "a disabled item can't be checked",
    );
  });

  test('Space, Enter and ArrowDown open the field, and Enter or Space checks the highlighted item', async function (assert) {
    const onChange = spy<MultiSelectChange<Item>>();
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    for (const key of ['Enter', ' '] as const) {
      await focus(FIELD);
      find(FIELD)!.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
      );
      await settled();
      assert.dom(FIELD).hasAttribute('aria-expanded', 'true', `${key} opens`);
      await triggerKeyEvent(FIELD, 'keydown', 'Escape');
    }

    await triggerKeyEvent(FIELD, 'keydown', 'ArrowDown');
    assert.strictEqual(highlighted(), 'Apple');
    assert.dom(FIELD).hasAttribute('aria-activedescendant', option('Apple').id);

    await triggerKeyEvent(FIELD, 'keydown', 'Enter');
    find(FIELD)!.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      }),
    );
    await settled();
    await triggerKeyEvent(FIELD, 'keydown', 'Enter');

    assert.deepEqual(onChange.calls, [
      { selectedItems: [apple] },
      { selectedItems: [] },
      { selectedItems: [apple] },
    ]);
    assert.dom(FIELD).hasAttribute('aria-expanded', 'true');
  });

  test('the arrow keys, Home, End, PageUp and PageDown move the highlight, skipping disabled items and stopping at the ends', async function (assert) {
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
        />
      </template>,
    );

    await focus(FIELD);
    await triggerKeyEvent(FIELD, 'keydown', 'ArrowDown');
    await triggerKeyEvent(FIELD, 'keydown', 'ArrowDown');
    assert.strictEqual(highlighted(), 'Cherry', 'Banana is skipped');

    await triggerKeyEvent(FIELD, 'keydown', 'ArrowDown');
    await triggerKeyEvent(FIELD, 'keydown', 'ArrowDown');
    assert.strictEqual(highlighted(), 'Date', "doesn't wrap around");

    await triggerKeyEvent(FIELD, 'keydown', 'Home');
    assert.strictEqual(highlighted(), 'Apple');

    await triggerKeyEvent(FIELD, 'keydown', 'ArrowUp');
    assert.strictEqual(highlighted(), 'Apple', "doesn't wrap around");

    await triggerKeyEvent(FIELD, 'keydown', 'End');
    assert.strictEqual(highlighted(), 'Date');

    await triggerKeyEvent(FIELD, 'keydown', 'PageUp');
    assert.strictEqual(highlighted(), 'Apple');

    await triggerKeyEvent(FIELD, 'keydown', 'PageDown');
    assert.strictEqual(highlighted(), 'Date', 'stops at the end');
  });

  test('typing highlights the item starting with what was typed', async function (assert) {
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
        />
      </template>,
    );

    await click(FIELD);
    await triggerKeyEvent(FIELD, 'keydown', 'D');
    assert.strictEqual(highlighted(), 'Date');

    await triggerKeyEvent(FIELD, 'keydown', 'B');
    assert.strictEqual(highlighted(), 'Date', 'the disabled Banana is skipped');
  });

  test('Escape closes the menu, and Escape or Delete clears the closed field', async function (assert) {
    const onChange = spy<MultiSelectChange<Item>>();
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItems={{array apple date}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await click(FIELD);
    await triggerKeyEvent(FIELD, 'keydown', 'Escape');
    assert.dom(FIELD).hasAttribute('aria-expanded', 'false');
    assert.deepEqual(onChange.calls, []);

    await triggerKeyEvent(FIELD, 'keydown', 'Delete');
    assert.deepEqual(onChange.calls, [{ selectedItems: [] }]);
    assert
      .dom('[aria-live="assertive"]')
      .hasText('all items have been cleared');
    assert.dom('.cds--tag').doesNotExist();

    await click(FIELD);
    await click(option('Cherry'));
    assert
      .dom('[aria-live="assertive"]')
      .hasNoText('a new selection re-arms the announcement');
    await triggerKeyEvent(FIELD, 'keydown', 'Escape');
    await triggerKeyEvent(FIELD, 'keydown', 'Delete');
    assert
      .dom('[aria-live="assertive"]')
      .hasText('all items have been cleared');
  });

  test("Escape doesn't reach the page", async function (assert) {
    let escapes = 0;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') escapes++;
    };
    await render(
      <template>
        {{! eslint-disable-next-line ember/template-no-invalid-interactive -- only counts the keys that reach it }}
        <div {{on "keydown" onKeydown}}>
          <MultiSelect
            @label="Choose fruit"
            @items={{items}}
            @itemToString={{itemToString}}
          />
        </div>
      </template>,
    );

    await click(FIELD);
    await triggerKeyEvent(FIELD, 'keydown', 'Escape');
    await triggerKeyEvent(FIELD, 'keydown', 'Escape');

    assert.strictEqual(escapes, 0);
  });

  test('Tab, or focus leaving, closes the menu', async function (assert) {
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
        />
        <button type="button" data-test-next>Next</button>
      </template>,
    );

    await click(FIELD);
    await triggerKeyEvent(FIELD, 'keydown', 'Tab');
    assert.dom(FIELD).hasAttribute('aria-expanded', 'false');

    await click(FIELD);
    await focus('[data-test-next]');
    assert.dom(FIELD).hasAttribute('aria-expanded', 'false');

    await click(FIELD);
    await triggerEvent('[data-test-next]', 'mousedown');
    await blur(FIELD);
    assert.dom(FIELD).hasAttribute('aria-expanded', 'false');
  });

  test('the tag counts the selection, and its button clears it', async function (assert) {
    const onChange = spy<MultiSelectChange<Item>>();
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItems={{array apple}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    assert.dom('.cds--tag__label').hasText('1');
    assert
      .dom('.cds--tag__close-icon')
      .hasAttribute('aria-label', 'Clear selected item');

    await click('.cds--tag__close-icon');

    assert.deepEqual(onChange.calls, [{ selectedItems: [] }]);
    assert.dom('.cds--tag').doesNotExist();
  });

  test('the label tells assistive technology what is selected', async function (assert) {
    await render(
      <template>
        <MultiSelect
          @titleText="Fruit"
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItems={{array apple date}}
        />
      </template>,
    );

    assert
      .dom('label.cds--label .cds--visually-hidden')
      .hasText(
        'Total items selected: 2 Apple, Date,To clear selection, press Delete or Backspace',
      );
  });

  module('@selectionFeedback', function () {
    test('top-after-reopen moves the selection to the top when the menu opens again', async function (assert) {
      await render(
        <template>
          <MultiSelect
            @label="Choose fruit"
            @items={{items}}
            @itemToString={{itemToString}}
          />
        </template>,
      );

      await click(FIELD);
      await click(option('Date'));
      assert.deepEqual(listed(), ['Apple', 'Banana', 'Cherry', 'Date']);

      await click(FIELD);
      await click(FIELD);
      assert.deepEqual(listed(), ['Date', 'Apple', 'Banana', 'Cherry']);
    });

    test('top moves an item to the top at once, and keeps it highlighted', async function (assert) {
      await render(
        <template>
          <MultiSelect
            @label="Choose fruit"
            @items={{items}}
            @itemToString={{itemToString}}
            @selectionFeedback="top"
          />
        </template>,
      );

      await click(FIELD);
      await click(option('Date'));

      assert.deepEqual(listed(), ['Date', 'Apple', 'Banana', 'Cherry']);
      assert.strictEqual(highlighted(), 'Date');
    });

    test('fixed keeps the order', async function (assert) {
      await render(
        <template>
          <MultiSelect
            @label="Choose fruit"
            @items={{items}}
            @itemToString={{itemToString}}
            @selectionFeedback="fixed"
            @initialSelectedItems={{array date}}
          />
        </template>,
      );

      await click(FIELD);

      assert.deepEqual(listed(), ['Apple', 'Banana', 'Cherry', 'Date']);
    });
  });

  test('@sortItems orders the items', async function (assert) {
    const asGiven = (list: readonly Item[]) => [...list];
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @sortItems={{asGiven}}
        />
      </template>,
    );

    await click(FIELD);

    assert.deepEqual(listed(), ['Cherry', 'Apple', 'Banana', 'Date']);
  });

  module('a select-all item', function () {
    const roles: Item[] = [
      { id: 'editor', text: 'Editor' },
      { id: 'owner', text: 'Owner' },
      { id: 'reader', text: 'Reader', disabled: true },
      { id: 'all', text: 'All roles', isSelectAll: true },
    ];
    const [editor, owner] = roles as [Item, Item];

    test('checks every enabled item, and unchecks them all', async function (assert) {
      const onChange = spy<MultiSelectChange<Item>>();
      await render(
        <template>
          <MultiSelect
            @label="Choose roles"
            @items={{roles}}
            @itemToString={{itemToString}}
            @onChange={{onChange.call}}
          />
        </template>,
      );

      await click(FIELD);
      assert.deepEqual(listed(), ['All roles', 'Editor', 'Owner', 'Reader']);
      assert.dom('.cds--multi-select').hasClass('cds--multi-select--selectall');

      await click(option('All roles'));
      assert.deepEqual(onChange.calls.at(-1), {
        selectedItems: [editor, owner],
      });
      assert.dom(option('All roles')).hasAttribute('aria-checked', 'true');
      assert.dom('.cds--tag__label').hasText('2');

      await click(option('Owner'));
      assert
        .dom(option('All roles'))
        .hasAttribute('aria-checked', 'mixed')
        .doesNotHaveClass('cds--list-box__menu-item--active');
      assert
        .dom(`${OPTION}[aria-label="All roles"] .cds--checkbox-label`)
        .hasClass('cds--ember-list-box-checkbox--mixed');

      await click(option('Owner'));
      await click(option('Editor'));
      await click(option('Editor'));
      assert.deepEqual(
        onChange.calls.at(-1),
        { selectedItems: [editor, owner] },
        'checking the last one settles on all of them, in their order',
      );

      await click(option('All roles'));
      assert.deepEqual(onChange.calls.at(-1), { selectedItems: [] });
    });

    test('shows a partial selection when items are added', async function (assert) {
      const list = tracked(roles);
      await render(
        <template>
          <MultiSelect
            @label="Choose roles"
            @items={{list.value}}
            @itemToString={{itemToString}}
          />
        </template>,
      );

      await click(FIELD);
      await click(option('All roles'));
      list.value = [...roles, { id: 'uploader', text: 'Uploader' }];
      await settled();

      assert.dom(option('All roles')).hasAttribute('aria-checked', 'mixed');
    });
  });

  module('@selectedItems', function () {
    test('wins over internal state, and follows changes from outside', async function (assert) {
      const selected = tracked<Item[]>([apple]);
      const onChange = spy<MultiSelectChange<Item>>();
      const handleChange = (data: MultiSelectChange<Item>) => {
        onChange.call(data);
        selected.value = data.selectedItems;
      };
      await render(
        <template>
          <MultiSelect
            @label="Choose fruit"
            @items={{items}}
            @itemToString={{itemToString}}
            @selectedItems={{selected.value}}
            @onChange={{handleChange}}
          />
        </template>,
      );
      assert.dom('.cds--tag__label').hasText('1');

      await click(FIELD);
      await click(option('Date'));
      assert.deepEqual(onChange.calls, [{ selectedItems: [apple, date] }]);

      selected.value = [];
      await settled();
      assert.dom('.cds--tag').doesNotExist();
      assert.dom(option('Apple')).hasAttribute('aria-selected', 'false');
    });

    test('compares items by value, as Carbon React does', async function (assert) {
      const copies = [{ ...apple }];
      await render(
        <template>
          <MultiSelect
            @label="Choose fruit"
            @items={{items}}
            @itemToString={{itemToString}}
            @selectedItems={{copies}}
          />
        </template>,
      );

      await click(FIELD);

      assert.dom(option('Apple')).hasAttribute('aria-selected', 'true');
    });
  });

  test('@onMenuChange reports the menu opening and closing, and @open drives it', async function (assert) {
    const open = tracked(false);
    const onMenuChange = spy<boolean>();
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @open={{open.value}}
          @onMenuChange={{onMenuChange.call}}
        />
      </template>,
    );
    assert.deepEqual(onMenuChange.calls, [], 'nothing on the first render');

    open.value = true;
    await settled();
    assert.dom(FIELD).hasAttribute('aria-expanded', 'true');
    assert.deepEqual(onMenuChange.calls, [true]);

    await triggerKeyEvent(FIELD, 'keydown', 'Escape');
    assert.deepEqual(onMenuChange.calls, [true, false]);

    await click(FIELD);
    assert.deepEqual(onMenuChange.calls, [true, false, true]);
  });

  test('a disabled field can be neither opened nor cleared', async function (assert) {
    await render(
      <template>
        <MultiSelect
          @titleText="Fruit"
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItems={{array apple}}
          @disabled={{true}}
        />
      </template>,
    );

    assert.dom(FIELD).isDisabled().hasAttribute('aria-disabled', 'true');
    assert.dom('.cds--tag__close-icon').isDisabled();
    assert.dom('.cds--tag').hasClass('cds--tag--disabled');
    assert.dom('.cds--label').hasClass('cds--label--disabled');
  });

  test('a read-only field can be focused, but not opened or cleared', async function (assert) {
    const onChange = spy<MultiSelectChange<Item>>();
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItems={{array apple}}
          @readOnly={{true}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await click(FIELD);
    await triggerKeyEvent(FIELD, 'keydown', 'ArrowDown');
    await triggerKeyEvent(FIELD, 'keydown', 'Delete');

    assert.dom(FIELD).isFocused().hasAttribute('aria-expanded', 'false');
    assert.dom(FIELD).hasAttribute('aria-disabled', 'true');
    assert.dom('.cds--multi-select').hasClass('cds--multi-select--readonly');
    assert
      .dom('.cds--tag__close-icon')
      .isDisabled()
      .hasAttribute('aria-disabled', 'true');
    assert.deepEqual(onChange.calls, []);
  });

  test('the invalid and warning states show, unless the field is disabled or read-only', async function (assert) {
    const state = tracked<'invalid' | 'warn'>('invalid');
    const readOnly = tracked(false);
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @helperText="Pick some"
          @invalid={{eq state.value "invalid"}}
          @invalidText="Required"
          @warn={{eq state.value "warn"}}
          @warnText="Check this"
          @readOnly={{readOnly.value}}
        />
      </template>,
    );
    const describedText = () =>
      document.getElementById(find(FIELD)!.getAttribute('aria-describedby')!)
        ?.textContent;

    assert.dom('.cds--multi-select').hasClass('cds--multi-select--invalid');
    assert.dom('.cds--form__helper-text').doesNotExist();
    assert.strictEqual(describedText(), 'Required');

    state.value = 'warn';
    await settled();
    assert.dom('.cds--multi-select').hasClass('cds--multi-select--warning');
    assert.strictEqual(describedText(), 'Check this');

    state.value = 'invalid';
    readOnly.value = true;
    await settled();
    assert
      .dom('.cds--multi-select')
      .doesNotHaveClass('cds--multi-select--invalid');
    assert.strictEqual(describedText(), 'Pick some');
  });

  test('@type, @size, @direction and @hideLabel set the classes', async function (assert) {
    await render(
      <template>
        <MultiSelect
          @titleText="Fruit"
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @type="inline"
          @size="sm"
          @direction="top"
          @hideLabel={{true}}
        />
      </template>,
    );

    assert
      .dom('.cds--multi-select__wrapper')
      .hasClass('cds--multi-select__wrapper--inline')
      .hasClass('cds--list-box__wrapper--inline');
    assert
      .dom('.cds--multi-select')
      .hasClass('cds--multi-select--inline')
      .hasClass('cds--list-box--inline')
      .hasClass('cds--list-box--sm')
      .hasClass('cds--list-box--up');
    assert.dom('label.cds--label').hasClass('cds--visually-hidden');
  });

  test('items with an undefined value are left out, as in Carbon React', async function (assert) {
    const withUndefined = [...items, { id: 'fig', text: undefined }] as Item[];
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{withUndefined}}
          @itemToString={{itemToString}}
        />
      </template>,
    );

    await click(FIELD);

    assert.dom(OPTION).exists({ count: 4 });
  });

  test('a block renders each item, and @useTitleInItem titles it', async function (assert) {
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @useTitleInItem={{true}}
          as |item|
        >
          <strong>{{item.id}}</strong>
        </MultiSelect>
      </template>,
    );

    await click(FIELD);

    assert
      .dom(`${OPTION} .cds--checkbox-label-text strong`)
      .exists({ count: 4 });
    assert
      .dom(`${OPTION}[aria-label="Apple"] .cds--checkbox-label`)
      .hasAttribute('title', 'Apple');
  });

  test('@autoAlign positions the open menu as wide as the field', async function (assert) {
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @autoAlign={{true}}
        />
      </template>,
    );
    assert.dom('.cds--multi-select').hasClass('cds--autoalign');

    await click(FIELD);

    const menu = find('.cds--list-box__menu') as HTMLElement;
    assert.strictEqual(menu.style.position, 'fixed');
    assert.strictEqual(
      menu.style.width,
      `${find('.cds--multi-select')!.clientWidth}px`,
    );
  });

  test('the decorator block shows an AI label in the field', async function (assert) {
    await render(
      <template>
        <MultiSelect
          @label="Choose fruit"
          @items={{items}}
          @itemToString={{itemToString}}
        >
          <:decorator as |AILabel|>
            <AILabel />
          </:decorator>
        </MultiSelect>
      </template>,
    );

    assert
      .dom('.cds--multi-select__wrapper')
      .hasClass('cds--list-box__wrapper--decorator');
    assert
      .dom(
        '.cds--list-box__field--wrapper .cds--list-box__inner-wrapper--decorator .cds--ai-label',
      )
      .exists();
  });
});

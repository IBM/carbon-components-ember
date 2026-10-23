import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  blur,
  click,
  fillIn,
  find,
  focus,
  render,
  settled,
  triggerEvent,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import ComboBox from '#src/components/combo-box.gts';

import type { ComboBoxChange } from '#src/components/combo-box.gts';

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
}

const items: Item[] = [
  { id: 'apple', text: 'Apple' },
  { id: 'apricot', text: 'Apricot' },
  { id: 'banana', text: 'Banana', disabled: true },
  { id: 'blueberry', text: 'Blueberry' },
  { id: 'cherry', text: 'Cherry' },
];
const [apple, apricot, , blueberry, cherry] = items as [
  Item,
  Item,
  Item,
  Item,
  Item,
];
const itemToString = (item: Item) => item.text;

const INPUT = '[role="combobox"]';
const OPTION = '[role="option"]';

function spy<T>() {
  const calls: T[] = [];
  return { calls, call: (value: T) => void calls.push(value) };
}

// Focus leaving with the keyboard, as Tab does.
async function tabAway() {
  await triggerKeyEvent(INPUT, 'keydown', 'Tab');
  await focus('[data-test-next]');
}

// Focus leaving because of a press elsewhere on the page.
async function pressElsewhere() {
  await triggerEvent('[data-test-elsewhere]', 'mousedown');
  await blur(INPUT);
}

function option(text: string) {
  return [...document.querySelectorAll(OPTION)].find(
    (element) => element.textContent?.trim() === text,
  )!;
}

module('Integration | Component | ComboBox', function (hooks) {
  setupRenderingTest(hooks);

  test('the label names the input, and a click opens the menu', async function (assert) {
    await render(
      <template>
        <ComboBox
          @titleText="Fruit"
          @items={{items}}
          @itemToString={{itemToString}}
        />
      </template>,
    );

    const input = find(INPUT)!;
    assert.dom('label.cds--label').hasText('Fruit');
    assert.dom('label.cds--label').hasAttribute('for', input.id);
    assert
      .dom(input)
      .hasAttribute('aria-labelledby', find('label')!.id)
      .doesNotHaveAttribute('aria-label')
      .hasAttribute('aria-expanded', 'false')
      .hasAttribute('aria-autocomplete', 'list')
      .hasAttribute('autocomplete', 'off');
    assert.dom(OPTION).doesNotExist();

    await click(INPUT);

    assert.dom(INPUT).hasAttribute('aria-expanded', 'true');
    assert.dom('.cds--combo-box').hasClass('cds--list-box--expanded');
    assert.dom(OPTION).exists({ count: 5 });
    assert.dom(option('Banana')).hasAttribute('disabled');
    assert.dom(option('Apple')).doesNotHaveAttribute('disabled');
  });

  test('without a title, the input is labelled "Choose an item" or by its aria-label', async function (assert) {
    await render(
      <template>
        <ComboBox @items={{items}} @itemToString={{itemToString}} />
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          aria-label="Fruits"
        />
      </template>,
    );

    const [first, second] = document.querySelectorAll(INPUT);
    assert.dom(first).hasAttribute('aria-label', 'Choose an item');
    assert.dom(first).doesNotHaveAttribute('aria-labelledby');
    assert.dom(second).hasAttribute('aria-label', 'Fruits');
  });

  test('clicking an item selects it, and choosing it again reports nothing', async function (assert) {
    const onChange = spy<ComboBoxChange<Item>>();
    await render(
      <template>
        <ComboBox
          @titleText="Fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await click(INPUT);
    await click(option('Apricot'));

    assert.deepEqual(onChange.calls, [{ selectedItem: apricot }]);
    assert
      .dom(INPUT)
      .hasValue('Apricot')
      .hasAttribute('aria-expanded', 'false');
    assert.dom(INPUT).isFocused('focus stays in the input');

    await click(INPUT);
    assert.dom(option('Apricot')).hasAttribute('aria-selected', 'true');
    assert
      .dom(option('Apricot'))
      .hasClass('cds--list-box__menu-item--active')
      .hasClass('cds--list-box__menu-item--highlighted');
    assert.dom('.cds--list-box__menu-item__selected-icon').exists({ count: 1 });

    await click(option('Apricot'));
    assert.strictEqual(onChange.calls.length, 1);
  });

  test("a disabled item can't be chosen", async function (assert) {
    const onChange = spy<ComboBoxChange<Item>>();
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await click(INPUT);
    await click(option('Banana'));

    assert.deepEqual(onChange.calls, []);
    assert.dom(INPUT).hasValue('').hasAttribute('aria-expanded', 'true');
  });

  test('typing opens the menu on the first item containing the text, and Enter chooses it', async function (assert) {
    const onChange = spy<ComboBoxChange<Item>>();
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await fillIn(INPUT, 'berry');

    assert.dom(INPUT).hasAttribute('aria-expanded', 'true');
    assert.dom(OPTION).exists({ count: 5 }, 'every item is listed by default');
    assert
      .dom(option('Blueberry'))
      .hasClass('cds--list-box__menu-item--highlighted');
    assert
      .dom(INPUT)
      .hasAttribute('aria-activedescendant', option('Blueberry').id);

    await triggerKeyEvent(INPUT, 'keydown', 'Enter');

    assert.deepEqual(onChange.calls, [{ selectedItem: blueberry }]);
    assert
      .dom(INPUT)
      .hasValue('Blueberry')
      .hasAttribute('aria-expanded', 'false');
  });

  test('Enter skips a disabled match, and the menu stays open', async function (assert) {
    const onChange = spy<ComboBoxChange<Item>>();
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await fillIn(INPUT, 'bana');
    assert.dom('.cds--list-box__menu-item--highlighted').doesNotExist();

    await triggerKeyEvent(INPUT, 'keydown', 'Enter');

    assert.deepEqual(onChange.calls, []);
    assert.dom(INPUT).hasValue('bana').hasAttribute('aria-expanded', 'true');
  });

  test('the arrow keys, Home and End move the highlight around, skipping disabled items', async function (assert) {
    await render(
      <template>
        <ComboBox @items={{items}} @itemToString={{itemToString}} />
      </template>,
    );
    const highlighted = () =>
      find('.cds--list-box__menu-item--highlighted')?.textContent?.trim();

    await focus(INPUT);
    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    assert.dom(INPUT).hasAttribute('aria-expanded', 'true');
    assert.strictEqual(highlighted(), 'Apple');

    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    assert.strictEqual(highlighted(), 'Blueberry', 'Banana is skipped');

    await triggerKeyEvent(INPUT, 'keydown', 'ArrowUp');
    assert.strictEqual(highlighted(), 'Apricot');

    await triggerKeyEvent(INPUT, 'keydown', 'End');
    assert.strictEqual(highlighted(), 'Cherry');

    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    assert.strictEqual(highlighted(), 'Apple', 'wraps around');

    await triggerKeyEvent(INPUT, 'keydown', 'ArrowUp');
    assert.strictEqual(highlighted(), 'Cherry');
  });

  test('ArrowUp opens the menu on the last item', async function (assert) {
    await render(
      <template>
        <ComboBox @items={{items}} @itemToString={{itemToString}} />
      </template>,
    );

    await focus(INPUT);
    await triggerKeyEvent(INPUT, 'keydown', 'ArrowUp');

    assert.dom('.cds--list-box__menu-item--highlighted').hasText('Cherry');
  });

  test('PageDown and PageUp move the highlight ten items, wrapping around', async function (assert) {
    const many = Array.from({ length: 15 }, (_, index) => ({
      id: `${index}`,
      text: `Item ${index}`,
    }));
    await render(
      <template>
        <ComboBox @items={{many}} @itemToString={{itemToString}} />
      </template>,
    );
    const highlighted = () =>
      find('.cds--list-box__menu-item--highlighted')?.textContent?.trim();

    await focus(INPUT);
    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    await triggerKeyEvent(INPUT, 'keydown', 'PageDown');
    assert.strictEqual(highlighted(), 'Item 10');

    await triggerKeyEvent(INPUT, 'keydown', 'PageDown');
    assert.strictEqual(highlighted(), 'Item 0', 'past the end, to the start');

    await triggerKeyEvent(INPUT, 'keydown', 'PageUp');
    assert.strictEqual(highlighted(), 'Item 14', 'past the start, to the end');
  });

  test('Enter confirming an IME composition chooses nothing', async function (assert) {
    const onChange = spy<ComboBoxChange<Item>>();
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await fillIn(INPUT, 'ap');
    // Firefox marks the keydown as composing; Safari's only has keyCode 229.
    for (const init of [{ isComposing: true }, { keyCode: 229 }]) {
      find(INPUT)!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, ...init }),
      );
    }
    await settled();

    assert.deepEqual(onChange.calls, []);
    assert.dom(INPUT).hasValue('ap').hasAttribute('aria-expanded', 'true');
  });

  test('Alt+ArrowDown opens the menu without highlighting, and Alt+ArrowUp closes it', async function (assert) {
    await render(
      <template>
        <ComboBox @items={{items}} @itemToString={{itemToString}} />
      </template>,
    );

    await focus(INPUT);
    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown', { altKey: true });
    assert.dom(INPUT).hasAttribute('aria-expanded', 'true');
    assert.dom('.cds--list-box__menu-item--highlighted').doesNotExist();

    await triggerKeyEvent(INPUT, 'keydown', 'ArrowUp', { altKey: true });
    assert.dom(INPUT).hasAttribute('aria-expanded', 'false');
    assert.dom(INPUT).isFocused();
  });

  test('leaving with Tab chooses the highlighted item', async function (assert) {
    const onChange = spy<ComboBoxChange<Item>>();
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @onChange={{onChange.call}}
        />
        <button type="button" data-test-next>Next</button>
      </template>,
    );

    await fillIn(INPUT, 'ap');
    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    await tabAway();

    assert.deepEqual(onChange.calls, [{ selectedItem: apricot }]);
    assert
      .dom(INPUT)
      .hasValue('Apricot')
      .hasAttribute('aria-expanded', 'false');
    assert.dom('[data-test-next]').isFocused();
  });

  test('a press elsewhere closes the menu without choosing, and drops text that matches no item', async function (assert) {
    const onChange = spy<ComboBoxChange<Item>>();
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @onChange={{onChange.call}}
        />
        <p data-test-elsewhere>Elsewhere</p>
      </template>,
    );

    await fillIn(INPUT, 'ap');
    await pressElsewhere();

    assert.deepEqual(onChange.calls, []);
    assert.dom(INPUT).hasValue('').hasAttribute('aria-expanded', 'false');
  });

  test('leaving restores the selection over text that matches no item, and keeps an exact match', async function (assert) {
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItem={{cherry}}
        />
        <ComboBox @items={{items}} @itemToString={{itemToString}} />
        <p data-test-elsewhere>Elsewhere</p>
      </template>,
    );
    const [first, second] = document.querySelectorAll<HTMLInputElement>(INPUT);

    await fillIn(first!, 'zz');
    await triggerEvent('[data-test-elsewhere]', 'mousedown');
    await blur(first);
    assert.dom(first).hasValue('Cherry');

    await fillIn(second!, 'Apple');
    await triggerEvent('[data-test-elsewhere]', 'mousedown');
    await blur(second);
    assert.dom(second).hasValue('Apple');
  });

  test('a field left empty loses its selection', async function (assert) {
    const onChange = spy<ComboBoxChange<Item>>();
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItem={{cherry}}
          @onChange={{onChange.call}}
        />
        <button type="button" data-test-next>Next</button>
      </template>,
    );

    await fillIn(INPUT, '');
    await tabAway();

    assert.deepEqual(onChange.calls, [{ selectedItem: null }]);
    assert.dom(INPUT).hasValue('');
  });

  test('the clear button clears the field and focuses the input', async function (assert) {
    const onChange = spy<ComboBoxChange<Item>>();
    const onInputChange = spy<string>();
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItem={{cherry}}
          @onChange={{onChange.call}}
          @onInputChange={{onInputChange.call}}
        />
      </template>,
    );

    assert
      .dom('.cds--list-box__selection')
      .hasAttribute('aria-label', 'Clear selected item');

    await click('.cds--list-box__selection');

    assert.deepEqual(onChange.calls, [{ selectedItem: null }]);
    assert.deepEqual(onInputChange.calls, ['']);
    assert.dom(INPUT).hasValue('').isFocused();
    assert.dom('.cds--list-box__selection').doesNotExist();
  });

  test('@onInputChange reports each change of the text, but not the first render', async function (assert) {
    const onInputChange = spy<string>();
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItem={{apple}}
          @onInputChange={{onInputChange.call}}
        />
      </template>,
    );
    assert.deepEqual(onInputChange.calls, []);

    await click(INPUT);
    await click(option('Apple'));
    assert.deepEqual(onInputChange.calls, [], 'the text stays the same');

    await fillIn(INPUT, 'Ch');
    await click(option('Cherry'));
    assert.deepEqual(onInputChange.calls, ['Ch', 'Cherry']);
  });

  test('the toggle button opens and closes the menu, dropping text that matches no item', async function (assert) {
    const onToggleClick = spy<MouseEvent>();
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItem={{apricot}}
          @onToggleClick={{onToggleClick.call}}
        />
      </template>,
    );

    assert.dom('.cds--list-box__menu-icon').hasAttribute('aria-label', 'Open');
    await click('.cds--list-box__menu-icon');
    assert.dom(INPUT).hasAttribute('aria-expanded', 'true').isFocused();
    assert
      .dom('.cds--list-box__menu-icon')
      .hasAttribute('aria-label', 'Close')
      .hasClass('cds--list-box__menu-icon--open');

    await click('.cds--list-box__menu-icon');
    assert.dom(INPUT).hasValue('Apricot', 'an unchanged value stays');
    assert.strictEqual(onToggleClick.calls.length, 2);

    await fillIn(INPUT, 'zz');
    await click('.cds--list-box__menu-icon');
    assert
      .dom(INPUT)
      .hasValue('Apricot')
      .hasAttribute('aria-expanded', 'false');
  });

  test('Escape closes the menu, and clears a closed field', async function (assert) {
    const onChange = spy<ComboBoxChange<Item>>();
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItem={{cherry}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await click(INPUT);
    await triggerKeyEvent(INPUT, 'keydown', 'Escape');
    assert.dom(INPUT).hasValue('Cherry').hasAttribute('aria-expanded', 'false');

    await triggerKeyEvent(INPUT, 'keydown', 'Escape');
    assert.dom(INPUT).hasValue('');
    assert.deepEqual(onChange.calls, [{ selectedItem: null }]);
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
          <ComboBox @items={{items}} @itemToString={{itemToString}} />
        </div>
      </template>,
    );

    await click(INPUT);
    await triggerKeyEvent(INPUT, 'keydown', 'Escape');

    assert.strictEqual(escapes, 0);
  });

  test('a space typed stays in the field', async function (assert) {
    let spaces = 0;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === ' ') spaces++;
    };
    await render(
      <template>
        {{! eslint-disable-next-line ember/template-no-invalid-interactive -- only counts the keys that reach it }}
        <div {{on "keydown" onKeydown}}>
          <ComboBox @items={{items}} @itemToString={{itemToString}} />
        </div>
      </template>,
    );

    find(INPUT)!.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
    );

    assert.strictEqual(spaces, 0);
  });

  test('Enter in an empty field opens the menu, with nothing highlighted', async function (assert) {
    await render(
      <template>
        <ComboBox @items={{items}} @itemToString={{itemToString}} />
      </template>,
    );

    await focus(INPUT);
    await triggerKeyEvent(INPUT, 'keydown', 'Enter');

    assert.dom(INPUT).hasAttribute('aria-expanded', 'true');
    assert.dom('.cds--list-box__menu-item--highlighted').doesNotExist();

    await triggerKeyEvent(INPUT, 'keydown', 'Enter');
    assert.dom(INPUT).hasAttribute('aria-expanded', 'false');
  });

  test('Enter on text that matches no item clears the selection, and keeps the text', async function (assert) {
    const onChange = spy<ComboBoxChange<Item>>();
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItem={{apple}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await fillIn(INPUT, 'xyz');
    await triggerKeyEvent(INPUT, 'keydown', 'Enter');

    assert.deepEqual(onChange.calls, [{ selectedItem: null }]);
    assert.dom(INPUT).hasValue('xyz').hasAttribute('aria-expanded', 'false');
  });

  test('@shouldFilterItem filters the menu, and the item clicked is the one chosen', async function (assert) {
    const onChange = spy<ComboBoxChange<Item>>();
    const shouldFilterItem = ({
      item,
      itemToString: toString,
      inputValue,
    }: {
      item: Item;
      itemToString: (item: Item) => string;
      inputValue: string;
    }) => toString(item).toLowerCase().includes(inputValue.toLowerCase());
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @shouldFilterItem={{shouldFilterItem}}
          @onChange={{onChange.call}}
        />
      </template>,
    );

    await fillIn(INPUT, 'rr');
    assert.deepEqual(
      [...document.querySelectorAll(OPTION)].map((element) =>
        element.textContent?.trim(),
      ),
      ['Blueberry', 'Cherry'],
    );

    await click(option('Cherry'));
    assert.deepEqual(onChange.calls, [{ selectedItem: cherry }]);
  });

  test('a block renders each item', async function (assert) {
    await render(
      <template>
        <ComboBox @items={{items}} @itemToString={{itemToString}} as |item|>
          <strong>{{item.id}}</strong>
        </ComboBox>
      </template>,
    );

    await click(INPUT);

    assert.dom(`${OPTION} strong`).exists({ count: 5 });
    assert.dom(`${OPTION}:first-child strong`).hasText('apple');
  });

  module('@allowCustomValue', function () {
    const fruits = ['Apple', 'Banana', 'Cherry'];

    test('leaving keeps text that matches no item as the value', async function (assert) {
      const onChange = spy<ComboBoxChange<string>>();
      await render(
        <template>
          <ComboBox
            @items={{fruits}}
            @allowCustomValue={{true}}
            @onChange={{onChange.call}}
          />
          <button type="button" data-test-next>Next</button>
        </template>,
      );

      await fillIn(INPUT, 'Kiwi');
      await tabAway();

      assert.deepEqual(onChange.calls, [
        { selectedItem: 'Kiwi', inputValue: 'Kiwi' },
      ]);
      assert.dom(INPUT).hasValue('Kiwi');

      await fillIn(INPUT, '');
      assert.deepEqual(onChange.calls.at(-1), {
        selectedItem: null,
        inputValue: '',
      });
    });

    test('Enter reports text that matches no item', async function (assert) {
      const onChange = spy<ComboBoxChange<string>>();
      await render(
        <template>
          <ComboBox
            @items={{fruits}}
            @allowCustomValue={{true}}
            @onChange={{onChange.call}}
          />
        </template>,
      );

      await fillIn(INPUT, 'Kiwi');
      await triggerKeyEvent(INPUT, 'keydown', 'Enter');

      assert.deepEqual(onChange.calls, [
        { selectedItem: null, inputValue: 'Kiwi' },
      ]);
      assert.dom(INPUT).hasValue('Kiwi').hasAttribute('aria-expanded', 'false');
    });

    test('an empty field left without a selection reports nothing', async function (assert) {
      const onChange = spy<ComboBoxChange<string>>();
      await render(
        <template>
          <ComboBox
            @items={{fruits}}
            @allowCustomValue={{true}}
            @onChange={{onChange.call}}
          />
          <button type="button" data-test-next>Next</button>
        </template>,
      );

      await click(INPUT);
      await tabAway();

      assert.deepEqual(onChange.calls, []);
    });
  });

  module('@selectedItem', function () {
    test('wins over internal state, and a change from outside is reported once', async function (assert) {
      const selected = tracked<Item | null>(apple);
      const onChange = spy<ComboBoxChange<Item>>();
      const handleChange = (data: ComboBoxChange<Item>) => {
        onChange.call(data);
        selected.value = data.selectedItem;
      };
      await render(
        <template>
          <ComboBox
            @items={{items}}
            @itemToString={{itemToString}}
            @selectedItem={{selected.value}}
            @onChange={{handleChange}}
          />
        </template>,
      );
      assert.dom(INPUT).hasValue('Apple');
      assert.deepEqual(onChange.calls, [], 'nothing on the first render');

      await click(INPUT);
      await click(option('Cherry'));
      assert.deepEqual(onChange.calls, [{ selectedItem: cherry }]);
      assert.dom(INPUT).hasValue('Cherry');

      selected.value = blueberry;
      await settled();
      assert.dom(INPUT).hasValue('Blueberry');
      assert.deepEqual(onChange.calls.at(-1), {
        selectedItem: blueberry,
        inputValue: 'Blueberry',
      });
      assert.strictEqual(onChange.calls.length, 2);

      selected.value = null;
      await settled();
      assert.dom(INPUT).hasValue('');
      assert.strictEqual(onChange.calls.length, 3);
    });

    test('a new item with the same text is not reported', async function (assert) {
      const selected = tracked<Item | null>(cherry);
      const onChange = spy<ComboBoxChange<Item>>();
      await render(
        <template>
          <ComboBox
            @items={{items}}
            @itemToString={{itemToString}}
            @selectedItem={{selected.value}}
            @onChange={{onChange.call}}
          />
        </template>,
      );

      selected.value = { ...cherry };
      await settled();

      assert.deepEqual(onChange.calls, []);
      assert.dom(INPUT).hasValue('Cherry');
    });

    test('a change from outside replaces the text typed, and moves the highlight', async function (assert) {
      const selected = tracked<Item | null>(null);
      await render(
        <template>
          <ComboBox
            @items={{items}}
            @itemToString={{itemToString}}
            @selectedItem={{selected.value}}
          />
        </template>,
      );

      await fillIn(INPUT, 'zz');
      selected.value = apricot;
      await settled();
      assert.dom(INPUT).hasValue('Apricot');

      await triggerKeyEvent(INPUT, 'keydown', 'Escape');
      await click(INPUT);
      assert
        .dom(option('Apricot'))
        .hasClass('cds--list-box__menu-item--highlighted');
    });
  });

  test('a disabled field can be neither typed into nor opened', async function (assert) {
    await render(
      <template>
        <ComboBox
          @titleText="Fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItem={{apple}}
          @disabled={{true}}
        />
      </template>,
    );

    assert.dom(INPUT).isDisabled();
    assert.dom('.cds--list-box__menu-icon').isDisabled();
    assert.dom('.cds--list-box__selection').isDisabled();
    assert.dom('.cds--combo-box').hasClass('cds--list-box--disabled');
    assert.dom('.cds--label').hasClass('cds--label--disabled');
  });

  test('a read-only field can be focused, but not opened or changed', async function (assert) {
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @initialSelectedItem={{apple}}
          @readOnly={{true}}
        />
      </template>,
    );

    assert.dom(INPUT).hasAttribute('readonly');
    assert.dom('.cds--combo-box').hasClass('cds--combo-box--readonly');
    assert
      .dom('.cds--list-box__selection')
      .isDisabled()
      .hasAttribute('aria-disabled', 'true');
    assert.dom('.cds--list-box__menu-icon').isDisabled();

    await click(INPUT);
    await triggerKeyEvent(INPUT, 'keydown', 'ArrowDown');
    await triggerKeyEvent(INPUT, 'keydown', 'Escape');

    assert.dom(INPUT).isFocused().hasValue('Apple');
    assert.dom(INPUT).hasAttribute('aria-expanded', 'false');
  });

  test('the invalid and warning states show, unless the field is disabled or read-only', async function (assert) {
    const state = tracked<'invalid' | 'warn' | 'helper'>('invalid');
    const readOnly = tracked(false);
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @helperText="Pick one"
          @invalid={{eq state.value "invalid"}}
          @invalidText="Required"
          @warn={{eq state.value "warn"}}
          @warnText="Check this"
          @readOnly={{readOnly.value}}
        />
      </template>,
    );
    const describedText = () =>
      document.getElementById(find(INPUT)!.getAttribute('aria-describedby')!)
        ?.textContent;

    assert.dom('.cds--combo-box').hasClass('cds--list-box--invalid');
    assert.dom('.cds--form__helper-text').doesNotExist();
    assert.strictEqual(describedText(), 'Required');

    state.value = 'warn';
    await settled();
    assert.dom('.cds--combo-box').hasClass('cds--combo-box--warning');
    assert.strictEqual(describedText(), 'Check this');

    state.value = 'helper';
    await settled();
    assert.strictEqual(describedText(), 'Pick one');

    state.value = 'invalid';
    readOnly.value = true;
    await settled();
    assert.dom('.cds--combo-box').doesNotHaveClass('cds--list-box--invalid');
    assert.dom('.cds--form-requirement').doesNotExist();
    assert.strictEqual(describedText(), 'Pick one');
  });

  module('@typeahead', function () {
    test('lists the items starting with the text, and completes it', async function (assert) {
      const onChange = spy<ComboBoxChange<Item>>();
      await render(
        <template>
          <ComboBox
            @items={{items}}
            @itemToString={{itemToString}}
            @typeahead={{true}}
            @onChange={{onChange.call}}
          />
          <button type="button" data-test-next>Next</button>
        </template>,
      );

      await fillIn(INPUT, 'ap');

      const input = find(INPUT) as HTMLInputElement;
      assert.dom(OPTION).exists({ count: 2 });
      assert.strictEqual(input.value, 'apple');
      assert.deepEqual(
        [input.selectionStart, input.selectionEnd],
        [2, 5],
        'the completion is selected, so typing replaces it',
      );

      await tabAway();
      assert.deepEqual(onChange.calls, [{ selectedItem: apple }]);
      assert.dom(INPUT).hasValue('Apple');
    });

    test('completes with the first enabled item', async function (assert) {
      await render(
        <template>
          <ComboBox
            @items={{items}}
            @itemToString={{itemToString}}
            @typeahead={{true}}
          />
        </template>,
      );

      await fillIn(INPUT, 'b');

      assert.strictEqual((find(INPUT) as HTMLInputElement).value, 'blueberry');
    });

    test("Tab after Escape doesn't complete the text", async function (assert) {
      const onChange = spy<ComboBoxChange<Item>>();
      await render(
        <template>
          <ComboBox
            @items={{items}}
            @itemToString={{itemToString}}
            @typeahead={{true}}
            @onChange={{onChange.call}}
          />
        </template>,
      );

      await fillIn(INPUT, 'ap');
      await triggerKeyEvent(INPUT, 'keydown', 'Escape');
      await triggerKeyEvent(INPUT, 'keydown', 'Tab');

      assert.deepEqual(onChange.calls, []);
    });
  });

  test('@autoAlign positions the open menu as wide as the field', async function (assert) {
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @autoAlign={{true}}
        />
      </template>,
    );
    assert.dom('.cds--combo-box').hasClass('cds--autoalign');

    await click(INPUT);

    const menu = find('.cds--list-box__menu') as HTMLElement;
    const field = find('.cds--combo-box') as HTMLElement;
    assert.strictEqual(menu.style.position, 'fixed');
    assert.strictEqual(menu.style.width, `${field.clientWidth}px`);

    await triggerKeyEvent(INPUT, 'keydown', 'Escape');
    assert.strictEqual(menu.style.position, '');
    assert.strictEqual(menu.style.width, '');
  });

  test('the decorator block shows an AI label in the field', async function (assert) {
    await render(
      <template>
        <ComboBox @items={{items}} @itemToString={{itemToString}}>
          <:decorator as |AILabel|>
            <AILabel />
          </:decorator>
        </ComboBox>
      </template>,
    );

    assert
      .dom('.cds--list-box__wrapper')
      .hasClass('cds--list-box__wrapper--decorator');
    assert
      .dom('.cds--list-box__inner-wrapper--decorator .cds--ai-label')
      .exists();
  });

  test('@id names the input, label and menu, and an id attribute is ignored', async function (assert) {
    await render(
      <template>
        <ComboBox
          @id="fruit"
          @titleText="Fruit"
          @items={{items}}
          @itemToString={{itemToString}}
          id="other"
        />
      </template>,
    );

    assert
      .dom(INPUT)
      .hasAttribute('id', 'fruit')
      .hasAttribute('aria-controls', 'fruit-menu');
    assert.dom('label').hasAttribute('for', 'fruit');
    assert.dom('[role="listbox"]').hasAttribute('id', 'fruit-menu');
  });

  test("@size and @direction set the field's classes", async function (assert) {
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @size="xs"
          @direction="top"
        />
      </template>,
    );

    assert
      .dom('.cds--combo-box')
      .hasClass('cds--list-box--xs')
      .hasClass('cds--layout--size-xs')
      .hasClass('cds--list-box--up');
  });

  test('items can be plain strings', async function (assert) {
    const fruits = ['Apple', 'Banana'];
    await render(<template><ComboBox @items={{fruits}} /></template>);

    await click(INPUT);
    await click(option('Banana'));

    assert.dom(INPUT).hasValue('Banana');
  });

  test('attributes go on the <input>, @className on the wrapper', async function (assert) {
    await render(
      <template>
        <ComboBox
          @items={{items}}
          @itemToString={{itemToString}}
          @className="my-field"
          name="fruit"
        />
      </template>,
    );

    assert.dom('.cds--list-box__wrapper').hasClass('my-field');
    assert.dom(INPUT).hasAttribute('name', 'fruit');
  });
});

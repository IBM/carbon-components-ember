import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { focus, render, settled, triggerKeyEvent } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import {
  nextIndex,
  RovingFocus,
  typeaheadIndex,
} from '#src/utils/roving-focus.ts';

module('Unit | Utility | roving-focus', function () {
  test('vertical: ArrowDown and ArrowUp step, stopping at the ends', function (assert) {
    assert.strictEqual(nextIndex('ArrowDown', 0, 3), 1);
    assert.strictEqual(nextIndex('ArrowDown', 2, 3), 2);
    assert.strictEqual(nextIndex('ArrowUp', 1, 3), 0);
    assert.strictEqual(nextIndex('ArrowUp', 0, 3), 0);
    assert.strictEqual(nextIndex('ArrowRight', 0, 3), undefined);
  });

  test('Home and End jump to the ends', function (assert) {
    assert.strictEqual(nextIndex('Home', 2, 3), 0);
    assert.strictEqual(nextIndex('End', 0, 3), 2);
  });

  test('loop wraps around', function (assert) {
    assert.strictEqual(nextIndex('ArrowDown', 2, 3, { loop: true }), 0);
    assert.strictEqual(nextIndex('ArrowUp', 0, 3, { loop: true }), 2);
  });

  test('horizontal uses ArrowLeft and ArrowRight, swapped in right-to-left', function (assert) {
    const horizontal = { orientation: 'horizontal' } as const;
    assert.strictEqual(nextIndex('ArrowRight', 0, 3, horizontal), 1);
    assert.strictEqual(nextIndex('ArrowLeft', 1, 3, horizontal), 0);
    assert.strictEqual(nextIndex('ArrowDown', 0, 3, horizontal), undefined);
    assert.strictEqual(
      nextIndex('ArrowRight', 1, 3, { ...horizontal, rtl: true }),
      0,
    );
    assert.strictEqual(
      nextIndex('ArrowLeft', 1, 3, { ...horizontal, rtl: true }),
      2,
    );
  });

  test('from outside the items, steps to the first or last', function (assert) {
    assert.strictEqual(nextIndex('ArrowDown', -1, 3), 0);
    assert.strictEqual(nextIndex('ArrowUp', -1, 3), 2);
  });

  test('no items, no move', function (assert) {
    assert.strictEqual(nextIndex('Home', 0, 0), undefined);
    assert.strictEqual(nextIndex('ArrowDown', 0, 0), undefined);
  });
});

module('Unit | Utility | typeaheadIndex', function () {
  const texts = ['Apple', 'Banana', 'Blueberry', 'Cherry'];

  test('finds the next item starting with what was typed', function (assert) {
    assert.strictEqual(
      typeaheadIndex(texts, 'b', { current: 0, anchor: 0 }),
      1,
    );
    assert.strictEqual(
      typeaheadIndex(texts, 'bl', { current: 1, anchor: 0 }),
      2,
    );
    assert.strictEqual(
      typeaheadIndex(texts, 'CH', { current: 0, anchor: 0 }),
      3,
    );
  });

  test('a repeated character cycles through the matches', function (assert) {
    assert.strictEqual(
      typeaheadIndex(texts, 'bb', { current: 1, anchor: 0 }),
      2,
    );
    assert.strictEqual(
      typeaheadIndex(texts, 'bbb', { current: 2, anchor: 0 }),
      1,
    );
  });

  test('wraps around, and returns -1 without a match', function (assert) {
    assert.strictEqual(
      typeaheadIndex(texts, 'a', { current: 3, anchor: 3 }),
      0,
    );
    assert.strictEqual(
      typeaheadIndex(texts, 'z', { current: 0, anchor: 0 }),
      -1,
    );
  });
});

module('Integration | Utility | RovingFocus', function (hooks) {
  setupRenderingTest(hooks);

  test('arrows from the focused container to the first item', async function (assert) {
    const roving = new RovingFocus();

    await render(
      <template>
        <ul tabindex="-1" {{roving.container}}>
          <li id="one" {{roving.item}}>One</li>
          <li id="two" {{roving.item}}>Two</li>
        </ul>
      </template>,
    );
    await focus('ul');
    await triggerKeyEvent('ul', 'keydown', 'ArrowDown');

    assert.dom('#one').isFocused();
  });

  test('moves the tab stop off an item once it is disabled', async function (assert) {
    const roving = new RovingFocus();
    const disabled = tracked(false);

    await render(
      <template>
        <ul {{roving.container}}>
          <li id="one" {{roving.item disabled=disabled.value}}>One</li>
          <li id="two" {{roving.item}}>Two</li>
        </ul>
      </template>,
    );
    assert.dom('#one').hasAttribute('tabindex', '0');

    disabled.value = true;
    await settled();

    assert.dom('#one').doesNotHaveAttribute('tabindex');
    assert.dom('#two').hasAttribute('tabindex', '0');
  });

  test("focus() ignores items focus can't move to", async function (assert) {
    const roving = new RovingFocus();

    await render(
      <template>
        <ul {{roving.container}}>
          <li id="one" {{roving.item}}>One</li>
          <li id="two" {{roving.item disabled=true}}>Two</li>
        </ul>
      </template>,
    );
    roving.focus(document.querySelector<HTMLElement>('#two')!);

    assert.dom('#two').isNotFocused();
    assert.dom('#two').doesNotHaveAttribute('tabindex');
  });
});

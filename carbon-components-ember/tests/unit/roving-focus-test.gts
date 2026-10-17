import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { focus, render, settled, triggerKeyEvent } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import { nextIndex, RovingFocus } from '#src/utils/roving-focus.ts';

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

  test('with followFocus off, leaves tabindex alone and reports navigation', async function (assert) {
    const navigated: string[] = [];
    const roving = new RovingFocus({
      followFocus: false,
      onNavigate: (element) => navigated.push(element.id),
    });

    await render(
      <template>
        <ul {{roving.container}}>
          <li id="one" tabindex="0" {{roving.item}}>One</li>
          <li id="two" tabindex="-1" {{roving.item}}>Two</li>
        </ul>
      </template>,
    );
    await focus('#one');
    await triggerKeyEvent('#one', 'keydown', 'ArrowDown');

    assert.dom('#two').isFocused();
    assert.dom('#two').hasAttribute('tabindex', '-1');
    assert.dom('#one').hasAttribute('tabindex', '0');
    assert.deepEqual(navigated, ['two']);
  });
});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  find,
  focus,
  render,
  rerender,
  settled,
  triggerEvent,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Modal from '#src/components/modal.gts';
import OverflowMenu from '#src/components/overflow-menu.gts';
import Filter from '#src/components/icons/filter.ts';
import { nonce } from '../helpers';

const TRIGGER = 'button.cds--overflow-menu';
const MENU = 'ul.cds--overflow-menu-options';

const item = (name: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')].find(
    (element) => element.textContent?.trim() === name,
  )!;

function spy() {
  const calls: unknown[][] = [];
  return { calls, call: (...args: unknown[]) => void calls.push(args) };
}

module('Integration | Component | OverflowMenu', (hooks) => {
  setupRenderingTest(hooks);

  test('renders Carbon React icon-button trigger, labelled by its tooltip', async function (assert) {
    await render(
      <template>
        <OverflowMenu class="my-menu" as |Item|>
          <Item @itemText="Stop app" />
        </OverflowMenu>
      </template>,
    );

    assert
      .dom(TRIGGER)
      .hasClass('cds--btn')
      .hasClass('cds--btn--ghost')
      .hasClass('cds--btn--icon-only')
      .hasClass('my-menu')
      .hasAttribute('type', 'button')
      .hasAttribute('aria-haspopup', 'true')
      .hasAttribute('aria-expanded', 'false')
      .doesNotHaveAttribute('aria-controls')
      .hasAria('labelledby', find('[role="tooltip"]')!.id);
    assert.dom('.cds--overflow-menu__wrapper .cds--icon-tooltip').exists();
    assert.dom('[role="tooltip"]').hasText('Options');
    assert
      .dom(`${TRIGGER} svg`)
      .hasClass('cds--overflow-menu__icon')
      .hasAttribute('aria-label', 'Options');
    assert.dom(MENU).doesNotExist();
  });

  test('takes the trigger name, icon, its class and size', async function (assert) {
    await render(
      <template>
        <OverflowMenu
          @iconDescription="Filters"
          @renderIcon={{Filter}}
          @iconClass="my-icon"
          @size="sm"
          as |Item|
        >
          <Item @itemText="Filter A" />
        </OverflowMenu>
      </template>,
    );

    assert.dom('[role="tooltip"]').hasText('Filters');
    assert
      .dom(`${TRIGGER} svg`)
      .hasClass('my-icon')
      .hasAttribute('aria-label', 'Filters');
    assert
      .dom(TRIGGER)
      .hasClass('cds--btn--sm')
      .hasClass('cds--layout--size-sm')
      .hasClass('cds--overflow-menu--sm');

    await click(TRIGGER);
    assert
      .dom(MENU)
      .hasClass('cds--overflow-menu-options--sm')
      .hasClass('cds--layout--size-sm');
  });

  test('disables the trigger and its tooltip', async function (assert) {
    await render(
      <template>
        <OverflowMenu @disabled={{true}} as |Item|>
          <Item @itemText="Stop app" />
        </OverflowMenu>
      </template>,
    );

    assert.dom(TRIGGER).isDisabled();
    assert.dom('.cds--icon-tooltip').hasClass('cds--icon-tooltip--disabled');
  });

  test('opens the menu in the top layer, on its first enabled item', async function (assert) {
    await render(
      <template>
        <OverflowMenu
          @ariaLabel="App actions"
          @menuOptionsClass="my-options"
          as |Item|
        >
          <Item @itemText="Clone app" @disabled={{true}} />
          <Item @itemText="Stop app" />
        </OverflowMenu>
      </template>,
    );

    await click(TRIGGER);

    const menu = find(MENU) as HTMLElement;
    assert
      .dom(MENU)
      .hasClass('cds--overflow-menu-options--open')
      .hasClass('my-options')
      .hasAttribute('role', 'menu')
      .hasAttribute('tabindex', '-1')
      .hasAria('label', 'App actions')
      .hasAttribute('data-floating-menu-direction', 'bottom');
    assert.true(menu.matches(':popover-open'));
    assert
      .dom(TRIGGER)
      .hasClass('cds--overflow-menu--open')
      .hasAttribute('aria-expanded', 'true')
      .hasAria('controls', menu.id);
    assert.dom(item('Stop app')).isFocused();
  });

  test("opening doesn't scroll the page", async function (assert) {
    const spacer = document.createElement('div');
    spacer.style.height = '300vh';
    document.body.append(spacer);
    window.scrollTo(0, 1000);
    try {
      await render(
        <template>
          <OverflowMenu as |Item|>
            <Item @itemText="Stop app" />
          </OverflowMenu>
        </template>,
      );

      await click(TRIGGER);
      assert.dom(item('Stop app')).isFocused();
      assert.strictEqual(window.scrollY, 1000);
    } finally {
      window.scrollTo(0, 0);
      spacer.remove();
    }
  });

  test('focuses the @selectorPrimaryFocus match when it opens', async function (assert) {
    await render(
      <template>
        <OverflowMenu @selectorPrimaryFocus="[data-test-second]" as |Item|>
          <Item @itemText="Stop app" />
          <Item @itemText="Restart app" data-test-second />
        </OverflowMenu>
      </template>,
    );

    await click(TRIGGER);
    assert.dom(item('Restart app')).isFocused();
  });

  test('moves between enabled items with the arrow keys, wrapping round', async function (assert) {
    await render(
      <template>
        <OverflowMenu as |Item|>
          <Item @itemText="Stop app" />
          <Item @itemText="Clone app" @disabled={{true}} />
          <Item @itemText="Delete app" />
        </OverflowMenu>
      </template>,
    );

    await click(TRIGGER);
    await triggerKeyEvent(item('Stop app'), 'keydown', 'ArrowDown');
    assert.dom(item('Delete app')).isFocused('skips the disabled item');
    await triggerKeyEvent(item('Delete app'), 'keydown', 'ArrowDown');
    assert.dom(item('Stop app')).isFocused('wraps to the first');
    await triggerKeyEvent(item('Stop app'), 'keydown', 'ArrowUp');
    assert.dom(item('Delete app')).isFocused('wraps to the last');
  });

  test('closes on Escape and Tab, returning focus to the trigger', async function (assert) {
    await render(
      <template>
        <OverflowMenu as |Item|>
          <Item @itemText="Stop app" />
        </OverflowMenu>
      </template>,
    );

    await click(TRIGGER);
    await triggerKeyEvent(item('Stop app'), 'keydown', 'Escape');
    assert.dom(MENU).doesNotExist();
    assert.dom(TRIGGER).isFocused().hasAttribute('aria-expanded', 'false');

    await click(TRIGGER);
    await triggerKeyEvent(item('Stop app'), 'keydown', 'Tab');
    assert.dom(MENU).doesNotExist();
    assert.dom(TRIGGER).isFocused();
  });

  test('runs an item and closes, returning focus to the trigger', async function (assert) {
    const onClick = spy();
    await render(
      <template>
        <OverflowMenu as |Item|>
          <Item @itemText="Stop app" @onClick={{onClick.call}} />
        </OverflowMenu>
      </template>,
    );

    await click(TRIGGER);
    await click(item('Stop app'));

    assert.strictEqual(onClick.calls.length, 1);
    assert.true(onClick.calls[0]![0] instanceof MouseEvent);
    assert.dom(MENU).doesNotExist();
    assert.dom(TRIGGER).isFocused();
  });

  test('closes on a click outside, and when focus leaves it', async function (assert) {
    await render(
      <template>
        <button type="button" data-test-outside>Outside</button>
        <OverflowMenu as |Item|>
          <Item @itemText="Stop app" />
        </OverflowMenu>
      </template>,
    );

    await click(TRIGGER);
    await click('[data-test-outside]');
    assert.dom(MENU).doesNotExist();

    await click(TRIGGER);
    await focus('[data-test-outside]');
    assert.dom(MENU).doesNotExist();
  });

  test('a press that starts in the menu and ends outside keeps it open', async function (assert) {
    await render(
      <template>
        <div data-test-outside>Outside</div>
        <OverflowMenu as |Item|>
          <Item @itemText="Stop app" />
        </OverflowMenu>
      </template>,
    );

    await click(TRIGGER);
    await triggerEvent(MENU, 'pointerdown');
    await triggerEvent('[data-test-outside]', 'click', { detail: 1 });
    assert.dom(MENU).exists();
  });

  test('opens and closes with @open, calling @onOpen and @onClose', async function (assert) {
    const open = tracked(false);
    const onOpen = spy();
    const onClose = spy();
    await render(
      <template>
        <OverflowMenu
          @open={{open.value}}
          @onOpen={{onOpen.call}}
          @onClose={{onClose.call}}
          as |Item|
        >
          <Item @itemText="Stop app" />
        </OverflowMenu>
      </template>,
    );

    assert.dom(MENU).doesNotExist();
    open.value = true;
    await rerender();
    await settled();
    assert.dom(MENU).exists();
    assert.strictEqual(onOpen.calls.length, 1);

    await triggerKeyEvent(item('Stop app'), 'keydown', 'Escape');
    assert.dom(MENU).doesNotExist();
    assert.strictEqual(onClose.calls.length, 1);

    // A click still toggles it while @open stays true, as in Carbon React.
    await click(TRIGGER);
    assert.dom(MENU).exists();
    assert.strictEqual(onOpen.calls.length, 2);
  });

  test("lines the menu up with the trigger's start edge, or its end edge when @flipped", async function (assert) {
    const flipped = tracked(false);
    await render(
      <template>
        <style nonce={{nonce}}>
          .overflow-menu-test__center {
            padding-inline-start: 12rem;
          }
        </style>
        <div class="overflow-menu-test__center">
          <OverflowMenu @flipped={{flipped.value}} as |Item|>
            <Item @itemText="Stop app" />
          </OverflowMenu>
        </div>
      </template>,
    );

    await click(TRIGGER);
    let trigger = find(TRIGGER)!.getBoundingClientRect();
    let menu = find(MENU)!.getBoundingClientRect();
    assert.true(Math.abs(menu.left - trigger.left) < 1, 'start edges');
    assert.true(menu.top >= trigger.bottom - 1, 'below the trigger');
    assert.dom(MENU).doesNotHaveClass('cds--overflow-menu--flip');

    await triggerKeyEvent(item('Stop app'), 'keydown', 'Escape');
    flipped.value = true;
    await click(TRIGGER);
    trigger = find(TRIGGER)!.getBoundingClientRect();
    menu = find(MENU)!.getBoundingClientRect();
    assert.true(Math.abs(menu.right - trigger.right) < 1, 'end edges');
    assert.dom(MENU).hasClass('cds--overflow-menu--flip');
  });

  test('moves the menu by @menuOffset from centered on the trigger', async function (assert) {
    const offset = { top: 10, left: 20 };
    await render(
      <template>
        <style nonce={{nonce}}>
          .overflow-menu-test__center {
            padding-inline-start: 12rem;
          }
        </style>
        <div class="overflow-menu-test__center">
          <OverflowMenu @menuOffset={{offset}} as |Item|>
            <Item @itemText="Stop app" />
          </OverflowMenu>
        </div>
      </template>,
    );

    await click(TRIGGER);
    const trigger = find(TRIGGER)!.getBoundingClientRect();
    const menu = find(MENU)!.getBoundingClientRect();
    const center = (rect: DOMRect) => rect.left + rect.width / 2;
    assert.true(Math.abs(center(menu) - center(trigger) - 20) < 1, 'left');
    assert.true(Math.abs(menu.top - trigger.bottom - 10) < 1, 'top');
  });

  test('opens on its first render with @open', async function (assert) {
    await render(
      <template>
        <OverflowMenu @open={{true}} as |Item|>
          <Item @itemText="Stop app" />
        </OverflowMenu>
      </template>,
    );

    const menu = find(MENU) as HTMLElement;
    assert.true(menu.matches(':popover-open'));
    assert.true(
      menu.getBoundingClientRect().top >=
        find(TRIGGER)!.getBoundingClientRect().bottom - 1,
      'below the trigger',
    );
    assert.dom(item('Stop app')).isFocused();
  });

  test('closes when the trigger is pressed again', async function (assert) {
    await render(
      <template>
        <OverflowMenu as |Item|>
          <Item @itemText="Stop app" />
        </OverflowMenu>
      </template>,
    );

    await click(TRIGGER);
    assert.dom(MENU).exists();
    await click(TRIGGER);
    assert.dom(MENU).doesNotExist();
    assert.dom(TRIGGER).hasAttribute('aria-expanded', 'false');
  });

  test('opens above the trigger with @direction="top"', async function (assert) {
    await render(
      <template>
        <style nonce={{nonce}}>
          .overflow-menu-test__low {
            padding-block-start: 16rem;
          }
        </style>
        <div class="overflow-menu-test__low">
          <OverflowMenu @direction="top" as |Item|>
            <Item @itemText="Stop app" />
          </OverflowMenu>
        </div>
      </template>,
    );

    await click(TRIGGER);
    const trigger = find(TRIGGER)!.getBoundingClientRect();
    const menu = find(MENU)!.getBoundingClientRect();
    assert.true(menu.bottom <= trigger.top + 1, 'above the trigger');
    assert.dom(MENU).hasAttribute('data-floating-menu-direction', 'top');
  });

  test("opens on the other side when there's no room below", async function (assert) {
    await render(
      <template>
        <style nonce={{nonce}}>
          .overflow-menu-test__bottom {
            position: fixed;
            inset-block-end: 0;
            inset-inline-start: 12rem;
          }
        </style>
        <div class="overflow-menu-test__bottom">
          <OverflowMenu as |Item|>
            <Item @itemText="Stop app" />
            <Item @itemText="Restart app" />
          </OverflowMenu>
        </div>
      </template>,
    );

    await click(TRIGGER);
    const trigger = find(TRIGGER)!.getBoundingClientRect();
    const menu = find(MENU)!.getBoundingClientRect();
    assert.true(menu.bottom <= trigger.top + 1, 'above the trigger');
    assert.dom(MENU).hasAttribute('data-floating-menu-direction', 'top');
  });

  test('works the offset out with a @menuOffset function', async function (assert) {
    const calls: unknown[][] = [];
    const menuOffset = (...args: unknown[]) => {
      calls.push(args);
      return { top: 4, left: 0 };
    };
    await render(
      <template>
        <style nonce={{nonce}}>
          .overflow-menu-test__center {
            padding-inline-start: 12rem;
          }
        </style>
        <div class="overflow-menu-test__center">
          <OverflowMenu @menuOffset={{menuOffset}} as |Item|>
            <Item @itemText="Stop app" />
          </OverflowMenu>
        </div>
      </template>,
    );

    await click(TRIGGER);
    const [menuBody, direction, trigger, flipped] = calls[0]!;
    assert.strictEqual(menuBody, find(MENU));
    assert.strictEqual(direction, 'bottom');
    assert.strictEqual(trigger, find(TRIGGER));
    assert.false(flipped);
    const triggerRect = find(TRIGGER)!.getBoundingClientRect();
    const menuRect = find(MENU)!.getBoundingClientRect();
    assert.true(Math.abs(menuRect.top - triggerRect.bottom - 4) < 1, 'top');
  });

  test('works in a Modal, even one a transformed, clipped box holds', async function (assert) {
    const onRequestClose = spy();
    await render(
      <template>
        {{! A transform makes the box hold the fixed dialog for Floating UI,
            though the top layer escapes it. }}
        <style nonce={{nonce}}>
          .overflow-menu-test__clip {
            position: fixed;
            inset-block-end: 0;
            inset-inline-end: 0;
            inline-size: 1px;
            block-size: 1px;
            overflow: hidden;
            transform: translateZ(0);
          }
        </style>
        <div class="overflow-menu-test__clip">
          <Modal @open={{true}} @onRequestClose={{onRequestClose.call}}>
            <OverflowMenu as |Item|>
              <Item @itemText="Stop app" />
            </OverflowMenu>
          </Modal>
        </div>
      </template>,
    );

    await click(TRIGGER);
    assert.notStrictEqual(
      getComputedStyle(find(MENU)!).visibility,
      'hidden',
      'shown',
    );
    assert.dom(item('Stop app')).isFocused();

    await triggerKeyEvent(item('Stop app'), 'keydown', 'Escape');
    // What the browser fires on Escape: no synthetic keydown triggers it.
    find('dialog.cds--modal')!.dispatchEvent(
      new Event('cancel', { cancelable: true }),
    );
    assert.dom(MENU).doesNotExist();
    assert.strictEqual(onRequestClose.calls.length, 0, 'the Modal stays open');
  });
});

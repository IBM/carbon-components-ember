import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, findAll, settled } from '@ember/test-helpers';
import OverflowMenu from '#src/components/overflow-menu.gts';
import { tracked } from '@glimmer/tracking';

module('Integration | Component | OverflowMenu', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a trigger button with the overflow menu classes', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction="bottom" as |Item|>
          <Item>option 1</Item>
        </OverflowMenu>
      </template>,
    );

    assert.dom('.cds--overflow-menu').exists();
  });

  test('should open the options list on click', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction="bottom" as |Item|>
          <Item>option 1</Item>
          <Item>option 2</Item>
        </OverflowMenu>
      </template>,
    );

    assert.dom('.cds--overflow-menu-options').doesNotExist();

    await click('.cds--overflow-menu');

    assert.dom('.cds--overflow-menu-options').exists();
    assert.dom('.cds--overflow-menu-options__option').exists({ count: 2 });
  });

  test('names the trigger and gives the options a menu role', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction="bottom" as |Item|>
          <Item>option 1</Item>
        </OverflowMenu>
      </template>,
    );

    assert
      .dom('.cds--overflow-menu')
      .hasAttribute('aria-label', 'Options', 'defaults to "Options"');

    await click('.cds--overflow-menu');

    assert
      .dom('.cds--overflow-menu-options')
      .hasAttribute('role', 'menu')
      .hasAttribute('aria-label', 'Options');
    assert.dom('.cds--overflow-menu-options [role="menuitem"]').exists();
  });

  test('names the trigger from @iconDescription, then @tooltip', async function (assert) {
    const state = tracked<string | undefined>('Row actions');
    await render(
      <template>
        <OverflowMenu
          @direction="bottom"
          @tooltip="More"
          @iconDescription={{state.value}}
          as |Item|
        >
          <Item>option 1</Item>
        </OverflowMenu>
      </template>,
    );

    assert.dom('.cds--overflow-menu').hasAttribute('aria-label', 'Row actions');

    state.value = undefined;
    await settled();

    assert.dom('.cds--overflow-menu').hasAttribute('aria-label', 'More');
  });

  test('should stay open after a touch tap on the trigger (mobile)', async function (assert) {
    // Simulate a touch-capable device (real phones have this; desktop
    // headless Chrome does not), since ember-basic-dropdown branches on it
    // to short-circuit the synthetic click it dispatches after touchend.
    window.ontouchstart = null;
    try {
      await render(
        <template>
          <OverflowMenu @direction="bottom" @tooltip="Options" as |Item|>
            <Item>option 1</Item>
            <Item>option 2</Item>
          </OverflowMenu>
        </template>,
      );

      const trigger = document.querySelector('.cds--overflow-menu')!;
      trigger.dispatchEvent(
        new Event('touchstart', { bubbles: true, cancelable: true }),
      );
      trigger.dispatchEvent(
        new Event('touchend', { bubbles: true, cancelable: true }),
      );

      // ember-basic-dropdown dispatches its synthetic click via setTimeout(0).
      await new Promise((resolve) => setTimeout(resolve, 50));

      assert.dom('.cds--overflow-menu-options').exists();
    } finally {
      delete window.ontouchstart;
    }
  });

  test('should support configuring the trigger eventType', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction="bottom" @eventType="mousedown" as |Item|>
          <Item>option 1</Item>
        </OverflowMenu>
      </template>,
    );

    assert.dom('.cds--overflow-menu-options').doesNotExist();

    const trigger = document.querySelector('.cds--overflow-menu')!;
    trigger.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        button: 0,
      }),
    );
    await settled();

    assert.dom('.cds--overflow-menu-options').exists();
  });

  test('should call onClick when an item is clicked', async function (assert) {
    const clicked = tracked(false);
    const onClick = () => (clicked.value = true);

    await render(
      <template>
        <OverflowMenu @direction="bottom" as |Item|>
          <Item @onClick={{onClick}}>option 1</Item>
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');
    await click('.cds--overflow-menu-options__btn');

    assert.true(clicked.value);
  });

  test('should support the danger and disabled arguments on all items', async function (assert) {
    await render(
      <template>
        <OverflowMenu
          @direction="bottom"
          @danger={{true}}
          @disabled={{true}}
          as |Item|
        >
          <Item>option 1</Item>
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');

    assert
      .dom('.cds--overflow-menu-options__option')
      .hasClass('cds--overflow-menu-options__option--danger');
    assert
      .dom('.cds--overflow-menu-options__option')
      .hasClass('cds--overflow-menu-options__option--disabled');
  });

  test('should render a tooltip when the tooltip argument is provided', async function (assert) {
    await render(
      <template>
        <OverflowMenu @tooltip="Options" @direction="bottom" as |Item|>
          <Item>option 1</Item>
        </OverflowMenu>
      </template>,
    );

    assert.dom('.cds--overflow-menu').exists();
  });

  test('should render a divider item', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction="bottom" as |Item|>
          <Item @hasDivider={{true}}>option 1</Item>
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');

    assert
      .dom('.cds--overflow-menu-options__option')
      .hasClass('cds--overflow-menu--divider');
  });

  test('lines the menu up with its trigger', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction="bottom" as |Item|>
          <Item @itemText="Option 1" />
        </OverflowMenu>
      </template>,
    );
    await click('.cds--overflow-menu');

    assert.true(
      find('.ember-basic-dropdown-content')!.getBoundingClientRect().width > 0,
      'the dropdown wrapper takes the size of the options list',
    );
    assert
      .dom('.cds--overflow-menu-options')
      .hasAttribute('data-floating-menu-direction', 'bottom')
      .doesNotHaveClass('cds--overflow-menu--flip');
  });

  test('flips the menu when it opens aligned to the right, as @flipped does', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction="bottom" @horizontalPosition="right" as |Item|>
          <Item @itemText="Option 1" />
        </OverflowMenu>
        <OverflowMenu @direction="bottom" @flipped={{true}} as |Item|>
          <Item @itemText="Option 1" />
        </OverflowMenu>
      </template>,
    );

    for (const trigger of findAll('.cds--overflow-menu')) {
      await click(trigger);
      assert
        .dom('.ember-basic-dropdown-content')
        .hasClass('ember-basic-dropdown-content--right');
      assert
        .dom('.cds--overflow-menu-options')
        .hasClass('cds--overflow-menu--flip');
      await click(trigger);
    }
  });
});

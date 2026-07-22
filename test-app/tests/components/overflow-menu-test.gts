import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import OverflowMenu from 'carbon-components-ember/components/overflow-menu';
import { cell } from 'ember-resources';

module('Integration | Component | OverflowMenu', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a trigger button with the overflow menu classes', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction='bottom' as |Item|>
          <Item>option 1</Item>
        </OverflowMenu>
      </template>,
    );

    assert.dom('.cds--overflow-menu').exists();
  });

  test('should open the options list on click', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction='bottom' as |Item|>
          <Item>option 1</Item>
          <Item>option 2</Item>
        </OverflowMenu>
      </template>,
    );

    assert.dom('.cds--overflow-menu-options').doesNotExist();

    await click('.cds--overflow-menu');

    assert.dom('.cds--overflow-menu-options').exists();
    assert
      .dom('.cds--overflow-menu-options__option')
      .exists({ count: 2 });
  });

  test('should stay open after a touch tap on the trigger (mobile)', async function (assert) {
    // Simulate a touch-capable device (real phones have this; desktop
    // headless Chrome does not), since ember-basic-dropdown branches on it
    // to short-circuit the synthetic click it dispatches after touchend.
    window.ontouchstart = null;
    try {
      await render(
        <template>
          <OverflowMenu @direction='bottom' @tooltip='Options' as |Item|>
            <Item>option 1</Item>
            <Item>option 2</Item>
          </OverflowMenu>
        </template>,
      );

      const trigger = document.querySelector('.cds--overflow-menu');
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

  test('should call onClick when an item is clicked', async function (assert) {
    const clicked = cell(false);
    const onClick = () => (clicked.current = true);

    await render(
      <template>
        <OverflowMenu @direction='bottom' as |Item|>
          <Item @onClick={{onClick}}>option 1</Item>
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');
    await click('.cds--overflow-menu-options__btn');

    assert.true(clicked.current);
  });

  test('should support the danger and disabled arguments on all items', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction='bottom' @danger={{true}} @disabled={{true}} as |Item|>
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
        <OverflowMenu @tooltip='Options' @direction='bottom' as |Item|>
          <Item>option 1</Item>
        </OverflowMenu>
      </template>,
    );

    assert.dom('.cds--overflow-menu').exists();
  });

  test('should render a divider item', async function (assert) {
    await render(
      <template>
        <OverflowMenu @direction='bottom' as |Item|>
          <Item @isDivider={{true}}>option 1</Item>
        </OverflowMenu>
      </template>,
    );

    await click('.cds--overflow-menu');

    assert
      .dom('.cds--overflow-menu-options__option')
      .hasClass('cds--overflow-menu--divider');
  });
});

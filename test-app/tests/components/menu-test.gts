import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent } from '@ember/test-helpers';
import { array } from '@ember/helper';
import Menu from 'carbon-components-ember/components/menu';
import MenuItem from 'carbon-components-ember/components/menu/menu-item';
import MenuItemDivider from 'carbon-components-ember/components/menu/menu-item-divider';
import MenuItemGroup from 'carbon-components-ember/components/menu/menu-item-group';
import MenuItemRadioGroup from 'carbon-components-ember/components/menu/menu-item-radio-group';
import MenuItemSelectable from 'carbon-components-ember/components/menu/menu-item-selectable';
import { Copy } from 'carbon-components-ember/icons';
import { waitForAnimationFrame } from '../helpers';

module('Integration | Component | Menu', (hooks) => {
  setupRenderingTest(hooks);

  test('does not render anything when @open is false', async function (assert) {
    await render(
      <template>
        <Menu @label='Test menu' @open={{false}}>
          <MenuItem @label='Cut' />
        </Menu>
      </template>,
    );

    assert.dom('[role="menu"]').doesNotExist();
  });

  test('renders items with the correct roles when open', async function (assert) {
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}}>
          <MenuItem @label='Cut' />
          <MenuItemDivider />
          <MenuItem @label='Delete' @kind='danger' />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert.dom('[role="menu"]').exists();
    assert.dom('[role="menu"]').hasAttribute('aria-label', 'Test menu');
    assert.dom('[role="menuitem"]').exists({ count: 2 });
    assert.dom('[role="separator"]').exists({ count: 1 });
    assert.dom('.cds--menu-item--danger').exists({ count: 1 });
  });

  test('clicking an item invokes @onClick and closes the menu via @onClose', async function (assert) {
    let clicked = false;
    let closed = false;
    const onClick = () => {
      clicked = true;
    };
    const onClose = () => {
      closed = true;
    };

    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @onClose={{onClose}}>
          <MenuItem @label='Cut' @onClick={{onClick}} />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();
    await click('[role="menuitem"]');

    assert.true(clicked, '@onClick was called');
    assert.true(closed, '@onClose was called');
  });

  test('disabled items cannot be clicked', async function (assert) {
    let clicked = false;
    const onClick = () => {
      clicked = true;
    };

    await render(
      <template>
        <Menu @label='Test menu' @open={{true}}>
          <MenuItem @label='Cut' @disabled={{true}} @onClick={{onClick}} />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert.dom('[role="menuitem"]').hasAttribute('aria-disabled', 'true');
    assert.dom('[role="menuitem"]').hasAttribute('tabindex', '-1');

    await click('[role="menuitem"]');
    assert.false(clicked, '@onClick was not called for a disabled item');
  });

  test('renders an icon and adds the with-icons modifier class', async function (assert) {
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}}>
          <MenuItem @label='Copy' @renderIcon={{Copy}} />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert.dom('[role="menu"]').hasClass('cds--menu--with-icons');
    assert.dom('.cds--menu-item__icon svg').exists();
  });

  test('MenuItemSelectable toggles its checked state on click and calls @onChange', async function (assert) {
    let checked: boolean | undefined;
    const onChange = (value: boolean) => {
      checked = value;
    };

    await render(
      <template>
        <Menu @label='Test menu' @open={{true}}>
          <MenuItemSelectable
            @label='Bold'
            @defaultSelected={{true}}
            @onChange={{onChange}}
          />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert
      .dom('[role="menuitemcheckbox"]')
      .hasAttribute('aria-checked', 'true');
    assert.dom('[role="menu"]').hasClass('cds--menu--with-selectable-items');

    await click('[role="menuitemcheckbox"]');

    assert.strictEqual(checked, false);
    assert
      .dom('[role="menuitemcheckbox"]')
      .hasAttribute('aria-checked', 'false');
  });

  test('MenuItemGroup wraps its items in a labelled group', async function (assert) {
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}}>
          <MenuItemGroup @label='Font style'>
            <MenuItemSelectable @label='Bold' />
            <MenuItemSelectable @label='Italic' />
          </MenuItemGroup>
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert.dom('.cds--menu-item-group').exists({ count: 1 });
    assert
      .dom('.cds--menu-item-group > ul')
      .hasAttribute('aria-label', 'Font style');
    assert
      .dom('.cds--menu-item-group [role="menuitemcheckbox"]')
      .exists({ count: 2 });
  });

  test('MenuItemRadioGroup renders one item per entry and only one is checked at a time', async function (assert) {
    let selected: string | undefined;
    const onChange = (value: string) => {
      selected = value;
    };

    await render(
      <template>
        <Menu @label='Test menu' @open={{true}}>
          <MenuItemRadioGroup
            @label='Text decoration'
            @items={{array 'None' 'Underline'}}
            @defaultSelectedItem='None'
            @onChange={{onChange}}
          />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert.dom('[role="menuitemradio"]').exists({ count: 2 });
    assert
      .dom('[role="menuitemradio"]:nth-child(1)')
      .hasAttribute('aria-checked', 'true');
    assert
      .dom('[role="menuitemradio"]:nth-child(2)')
      .hasAttribute('aria-checked', 'false');

    await click('[role="menuitemradio"]:nth-child(2)');

    assert.strictEqual(selected, 'Underline');
    assert
      .dom('[role="menuitemradio"]:nth-child(1)')
      .hasAttribute('aria-checked', 'false');
    assert
      .dom('[role="menuitemradio"]:nth-child(2)')
      .hasAttribute('aria-checked', 'true');
  });

  test('a MenuItem with a submenu opens it on click and closes it on ArrowLeft', async function (assert) {
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}}>
          <MenuItem @label='Share with'>
            <MenuItem @label='Product team' />
          </MenuItem>
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert
      .dom('[aria-haspopup="true"]')
      .hasAttribute('aria-expanded', 'false');
    assert.dom('.cds--menu-item .cds--menu').doesNotHaveClass('cds--menu--open');

    await click('[aria-haspopup="true"]');
    await waitForAnimationFrame();

    assert.dom('[aria-haspopup="true"]').hasAttribute('aria-expanded', 'true');
    assert.dom('.cds--menu-item .cds--menu').hasClass('cds--menu--open');
    assert.dom('[role="menuitem"]', document.body).exists({ count: 2 });

    await triggerKeyEvent(
      '.cds--menu-item .cds--menu',
      'keydown',
      'ArrowLeft',
    );

    assert.dom('.cds--menu-item .cds--menu').doesNotHaveClass('cds--menu--open');
  });

  test('pressing Escape calls @onClose', async function (assert) {
    let closed = false;
    const onClose = () => {
      closed = true;
    };

    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @onClose={{onClose}}>
          <MenuItem @label='Cut' />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();
    await triggerKeyEvent('[role="menu"]', 'keydown', 'Escape');

    assert.true(closed);
  });
});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled, triggerKeyEvent } from '@ember/test-helpers';
import { array } from '@ember/helper';
import { tracked } from '@glimmer/tracking';
import Menu from 'carbon-components-ember/components/menu';
import MenuItem from 'carbon-components-ember/components/menu/menu-item';
import MenuItemDivider from 'carbon-components-ember/components/menu/menu-item-divider';
import MenuItemGroup from 'carbon-components-ember/components/menu/menu-item-group';
import MenuItemRadioGroup from 'carbon-components-ember/components/menu/menu-item-radio-group';
import MenuItemSelectable from 'carbon-components-ember/components/menu/menu-item-selectable';
import { Copy } from 'carbon-components-ember/icons';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import { waitForAnimationFrame } from '../helpers';

module('Integration | Component | Menu', (hooks) => {
  setupRenderingTest(hooks);

  // Menu (the root Menu, at least) renders via `{{in-element}}` into
  // `document.body` by default, which is outside `#ember-testing`'s
  // rendering-test container - the same reason portal-test.gts avoids
  // exercising its own `document.body` default. Rendering there directly via
  // a real `render()` call corrupts `#qunit-fixture` on teardown and breaks
  // later tests in the suite, so every test here points `@target` at a
  // dedicated container appended to `document.body` instead, and queries
  // scope to that container rather than the default rendering-test root.
  hooks.beforeEach(function (this: { container: HTMLElement }) {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  });

  hooks.afterEach(function (this: { container: HTMLElement }) {
    this.container.remove();
  });

  test('does not render anything when @open is false', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{false}} @target={{target}}>
          <MenuItem @label='Cut' />
        </Menu>
      </template>,
    );

    assert.dom('[role="menu"]', this.container).doesNotExist();
  });

  test('renders items with the correct roles when open', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
          <MenuItem @label='Cut' />
          <MenuItemDivider />
          <MenuItem @label='Delete' @kind='danger' />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert.dom('[role="menu"]', this.container).exists();
    assert
      .dom('[role="menu"]', this.container)
      .hasAttribute('aria-label', 'Test menu');
    assert.dom('[role="menuitem"]', this.container).exists({ count: 2 });
    assert.dom('[role="separator"]', this.container).exists({ count: 1 });
    assert.dom('.cds--menu-item--danger', this.container).exists({ count: 1 });
  });

  test('clicking an item invokes @onClick and closes the menu via @onClose', async function (this: {
    container: HTMLElement;
  }, assert) {
    let clicked = false;
    let closed = false;
    const onClick = () => {
      clicked = true;
    };
    const onClose = () => {
      closed = true;
    };

    const target = this.container;
    await render(
      <template>
        <Menu
          @label='Test menu'
          @open={{true}}
          @target={{target}}
          @onClose={{onClose}}
        >
          <MenuItem @label='Cut' @onClick={{onClick}} />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();
    await click(this.container.querySelector('[role="menuitem"]')!);

    assert.true(clicked, '@onClick was called');
    assert.true(closed, '@onClose was called');
  });

  test('disabled items cannot be clicked', async function (this: {
    container: HTMLElement;
  }, assert) {
    let clicked = false;
    const onClick = () => {
      clicked = true;
    };

    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
          <MenuItem @label='Cut' @disabled={{true}} @onClick={{onClick}} />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert
      .dom('[role="menuitem"]', this.container)
      .hasAttribute('aria-disabled', 'true');
    assert
      .dom('[role="menuitem"]', this.container)
      .hasAttribute('tabindex', '-1');

    await click(this.container.querySelector('[role="menuitem"]')!);
    assert.false(clicked, '@onClick was not called for a disabled item');
  });

  test('renders an icon and adds the with-icons modifier class', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
          <MenuItem @label='Copy' @renderIcon={{Copy}} />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert
      .dom('[role="menu"]', this.container)
      .hasClass('cds--menu--with-icons');
    assert.dom('.cds--menu-item__icon svg', this.container).exists();
  });

  test('the with-icons and with-selectable-items classes follow items being added and removed', async function (this: {
    container: HTMLElement;
  }, assert) {
    class State {
      @tracked extras = false;
    }
    const state = new State();

    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
          <MenuItem @label='Cut' />
          {{#if state.extras}}
            <MenuItem @label='Copy' @renderIcon={{Copy}} />
            <MenuItemSelectable @label='Bold' />
          {{/if}}
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert
      .dom('[role="menu"]', this.container)
      .doesNotHaveClass('cds--menu--with-icons');
    assert
      .dom('[role="menu"]', this.container)
      .doesNotHaveClass('cds--menu--with-selectable-items');

    state.extras = true;
    await settled();

    assert.dom('[role="menu"]', this.container).hasClass('cds--menu--with-icons');
    assert
      .dom('[role="menu"]', this.container)
      .hasClass('cds--menu--with-selectable-items');

    state.extras = false;
    await settled();

    assert
      .dom('[role="menu"]', this.container)
      .doesNotHaveClass('cds--menu--with-icons');
    assert
      .dom('[role="menu"]', this.container)
      .doesNotHaveClass('cds--menu--with-selectable-items');
  });

  test('a submenu tracks its own items rather than the root menu ones', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
          <MenuItem @label='Share with'>
            <MenuItemSelectable @label='Product team' />
          </MenuItem>
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert
      .dom('[role="menu"]', this.container)
      .doesNotHaveClass(
        'cds--menu--with-selectable-items',
        'the root menu only has a plain item',
      );
    assert
      .dom('.cds--menu-item .cds--menu', this.container)
      .hasClass('cds--menu--with-selectable-items');
  });

  test('MenuItemSelectable toggles its checked state on click and calls @onChange', async function (this: {
    container: HTMLElement;
  }, assert) {
    let checked: boolean | undefined;
    const onChange = (value: boolean) => {
      checked = value;
    };

    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
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
      .dom('[role="menuitemcheckbox"]', this.container)
      .hasAttribute('aria-checked', 'true');
    assert
      .dom('[role="menu"]', this.container)
      .hasClass('cds--menu--with-selectable-items');

    await click(this.container.querySelector('[role="menuitemcheckbox"]')!);

    assert.strictEqual(checked, false);
    assert
      .dom('[role="menuitemcheckbox"]', this.container)
      .hasAttribute('aria-checked', 'false');
  });

  test('MenuItemGroup wraps its items in a labelled group', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
          <MenuItemGroup @label='Font style'>
            <MenuItemSelectable @label='Bold' />
            <MenuItemSelectable @label='Italic' />
          </MenuItemGroup>
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert.dom('.cds--menu-item-group', this.container).exists({ count: 1 });
    assert
      .dom('.cds--menu-item-group > ul', this.container)
      .hasAttribute('aria-label', 'Font style');
    assert
      .dom('.cds--menu-item-group [role="menuitemcheckbox"]', this.container)
      .exists({ count: 2 });
  });

  test('MenuItemRadioGroup renders one item per entry and only one is checked at a time', async function (this: {
    container: HTMLElement;
  }, assert) {
    let selected: string | undefined;
    const onChange = (value: string) => {
      selected = value;
    };

    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
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

    assert.dom('[role="menuitemradio"]', this.container).exists({ count: 2 });
    assert
      .dom('[role="menuitemradio"]:nth-child(1)', this.container)
      .hasAttribute('aria-checked', 'true');
    assert
      .dom('[role="menuitemradio"]:nth-child(2)', this.container)
      .hasAttribute('aria-checked', 'false');

    await click(
      this.container.querySelector(
        '[role="menuitemradio"]:nth-child(2)',
      )!,
    );

    assert.strictEqual(selected, 'Underline');
    assert
      .dom('[role="menuitemradio"]:nth-child(1)', this.container)
      .hasAttribute('aria-checked', 'false');
    assert
      .dom('[role="menuitemradio"]:nth-child(2)', this.container)
      .hasAttribute('aria-checked', 'true');
  });

  test('a MenuItem with a submenu opens it on click and closes it on ArrowLeft', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
          <MenuItem @label='Share with'>
            <MenuItem @label='Product team' />
          </MenuItem>
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert
      .dom('[aria-haspopup="true"]', this.container)
      .hasAttribute('aria-expanded', 'false');
    assert
      .dom('.cds--menu-item .cds--menu', this.container)
      .doesNotHaveClass('cds--menu--open');

    await click(this.container.querySelector('[aria-haspopup="true"]')!);
    await waitForAnimationFrame();

    assert
      .dom('[aria-haspopup="true"]', this.container)
      .hasAttribute('aria-expanded', 'true');
    assert
      .dom('.cds--menu-item .cds--menu', this.container)
      .hasClass('cds--menu--open');
    assert.dom('[role="menuitem"]', this.container).exists({ count: 2 });

    await triggerKeyEvent(
      this.container.querySelector('.cds--menu-item .cds--menu')!,
      'keydown',
      'ArrowLeft',
    );

    assert
      .dom('.cds--menu-item .cds--menu', this.container)
      .doesNotHaveClass('cds--menu--open');
  });

  test('a submenu is positioned relative to its anchor even when @target has a transform', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    // A `transform` makes `target` the containing block for every
    // `position: fixed` menu rendered inside it (root and submenus alike),
    // which is what a shadow-DOM docs preview does. Offsetting the target
    // from the viewport origin makes a coordinate-space mismatch obvious.
    target.style.transform = 'translateZ(0)';
    target.style.marginInlineStart = '200px';
    target.style.marginBlockStart = '150px';

    await render(
      <template>
        <style>{{carbonStyle.default}}</style>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
          <MenuItem @label='Share with'>
            <MenuItem @label='Product team'>
              <MenuItem @label='Nested' />
            </MenuItem>
          </MenuItem>
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();
    await click(this.container.querySelector('[aria-haspopup="true"]')!);
    await waitForAnimationFrame();

    let anchor = this.container.querySelector('[aria-haspopup="true"]')!;
    let submenu = this.container.querySelector(
      '.cds--menu-item .cds--menu',
    )!;
    let anchorRect = anchor.getBoundingClientRect();
    let submenuRect = submenu.getBoundingClientRect();

    assert.ok(
      Math.abs(submenuRect.left - anchorRect.right) < 10,
      `submenu left (${submenuRect.left}) should be near anchor right (${anchorRect.right})`,
    );
    assert.ok(
      Math.abs(submenuRect.top - anchorRect.top) < 10,
      `submenu top (${submenuRect.top}) should be near anchor top (${anchorRect.top})`,
    );

    // Two levels deep, to exercise walking back up through an intermediate
    // (non-root) menu to find the root's target.
    await click(submenu.querySelector('[aria-haspopup="true"]')!);
    await waitForAnimationFrame();

    anchor = submenu.querySelector('[aria-haspopup="true"]')!;
    const nestedSubmenu = submenu.querySelector('.cds--menu-item .cds--menu')!;
    anchorRect = anchor.getBoundingClientRect();
    const nestedRect = nestedSubmenu.getBoundingClientRect();

    assert.ok(
      Math.abs(nestedRect.left - anchorRect.right) < 10,
      `nested submenu left (${nestedRect.left}) should be near anchor right (${anchorRect.right})`,
    );
    assert.ok(
      Math.abs(nestedRect.top - anchorRect.top) < 10,
      `nested submenu top (${nestedRect.top}) should be near anchor top (${anchorRect.top})`,
    );
  });

  test('pressing Escape calls @onClose', async function (this: {
    container: HTMLElement;
  }, assert) {
    let closed = false;
    const onClose = () => {
      closed = true;
    };

    const target = this.container;
    await render(
      <template>
        <Menu
          @label='Test menu'
          @open={{true}}
          @target={{target}}
          @onClose={{onClose}}
        >
          <MenuItem @label='Cut' />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();
    await triggerKeyEvent(
      this.container.querySelector('[role="menu"]')!,
      'keydown',
      'Escape',
    );

    assert.true(closed);
  });

  test('@size sets the size modifier class, defaulting to sm', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
          <MenuItem @label='Cut' />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();
    assert.dom('[role="menu"]', this.container).hasClass('cds--menu--sm');

    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}} @size='lg'>
          <MenuItem @label='Cut' />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();
    assert.dom('[role="menu"]', this.container).hasClass('cds--menu--lg');
  });

  test('@border, @backgroundToken, and @menuAlignment add their modifier classes', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <Menu
          @label='Test menu'
          @open={{true}}
          @target={{target}}
          @border={{true}}
          @backgroundToken='background'
          @menuAlignment='top-start'
        >
          <MenuItem @label='Cut' />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert.dom('[role="menu"]', this.container).hasClass('cds--menu--border');
    assert
      .dom('[role="menu"]', this.container)
      .hasClass('cds--menu--background-token__background');
    assert
      .dom('[role="menu"]', this.container)
      .hasClass('cds--menu--box-shadow-top');
  });

  test('ArrowDown/ArrowUp move roving focus between items and wrap around', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
          <MenuItem @label='Cut' />
          <MenuItem @label='Copy' />
          <MenuItem @label='Paste' />
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    const items = this.container.querySelectorAll('[role="menuitem"]');
    const menu = this.container.querySelector('[role="menu"]')!;

    assert.strictEqual(document.activeElement, items[0]);

    await triggerKeyEvent(menu, 'keydown', 'ArrowDown');
    assert.strictEqual(document.activeElement, items[1]);

    await triggerKeyEvent(menu, 'keydown', 'ArrowDown');
    assert.strictEqual(document.activeElement, items[2]);

    await triggerKeyEvent(menu, 'keydown', 'ArrowDown');
    assert.strictEqual(
      document.activeElement,
      items[0],
      'wraps around past the last item',
    );

    await triggerKeyEvent(menu, 'keydown', 'ArrowUp');
    assert.strictEqual(
      document.activeElement,
      items[2],
      'wraps around past the first item',
    );
  });

  test('@dangerDescription is only rendered for a danger item without a submenu', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
          <MenuItem
            @label='Delete'
            @kind='danger'
            @dangerDescription='This cannot be undone'
          />
          <MenuItem @label='Share with' @kind='danger'>
            <MenuItem @label='Product team' />
          </MenuItem>
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    assert
      .dom('.cds--visually-hidden', this.container)
      .exists({ count: 1 }, 'only the leaf danger item renders the hint');
    assert
      .dom('[role="menuitem"]:nth-child(1)', this.container)
      .hasClass('cds--menu-item--danger');
    assert
      .dom('[aria-haspopup="true"]', this.container)
      .doesNotHaveClass(
        'cds--menu-item--danger',
        'a submenu-parent item is never marked danger',
      );
  });

  test('a MenuItem with a submenu ignores @disabled since it cannot be individually disabled', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <Menu @label='Test menu' @open={{true}} @target={{target}}>
          <MenuItem @label='Share with' @disabled={{true}}>
            <MenuItem @label='Product team' />
          </MenuItem>
        </Menu>
      </template>,
    );

    await waitForAnimationFrame();

    const parent = this.container.querySelector('[aria-haspopup="true"]')!;
    assert.dom(parent).doesNotHaveClass('cds--menu-item--disabled');
    assert.dom(parent).hasAttribute('tabindex', '0');
    assert.dom(parent).doesNotHaveAttribute('aria-disabled');

    await click(parent);
    await waitForAnimationFrame();

    assert
      .dom('.cds--menu-item .cds--menu', this.container)
      .hasClass('cds--menu--open', 'the submenu still opens on click');
  });
});

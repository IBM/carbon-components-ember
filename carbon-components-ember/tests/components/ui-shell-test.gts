import { module, test } from 'qunit';
import { setupApplicationTest, setupRenderingTest } from 'ember-qunit';
import { render, click, find } from '@ember/test-helpers';
import UIShell from '#src/components/ui-shell.gts';
import { Notification } from '#src/icons.ts';
import { tracked } from '@glimmer/tracking';
import { setupRoutes, visitWith } from '../helpers';

module('Integration | Component | UIShell', (hooks) => {
  setupRenderingTest(hooks);

  test('renders header and main content regions', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header @title="IBM" @subtitle="Platform" />
          </:shell>
          <:content>
            <p>Page content</p>
          </:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--header').exists();
    assert.dom('.cds--header__name--prefix').hasText('IBM Platform');
    assert.dom('main.cds--content').exists();
    assert.dom('main.cds--content').hasText('Page content');
  });

  test('header menu toggle calls onToggle with the inverse of open', async function (assert) {
    const open = tracked(false);
    const onToggle = (value: boolean) => (open.value = value);

    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header
              @title="IBM"
              @subtitle="Platform"
              @open={{open.value}}
              @onToggle={{onToggle}}
            />
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--header__menu-toggle').exists();
    assert.dom('.cds--header__menu-toggle svg').exists();
    const beforeIcon = find('.cds--header__menu-toggle svg')?.innerHTML;

    await click('.cds--header__menu-toggle');
    assert.true(open.value);
    const afterIcon = find('.cds--header__menu-toggle svg')?.innerHTML;
    assert.notStrictEqual(
      beforeIcon,
      afterIcon,
      'icon swaps between Menu and Close based on @open',
    );
  });

  test('header global action renders a button and calls onClick', async function (assert) {
    const clicked = tracked(false);
    const onClick = () => (clicked.value = true);

    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header @title="IBM" @subtitle="Platform">
              <:headerGlobal as |GlobalAction|>
                <GlobalAction
                  @aria-label="Notifications"
                  @icon={{Notification}}
                  @onClick={{onClick}}
                />
              </:headerGlobal>
            </s.Header>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--header__global .cds--header__action').exists();
    assert
      .dom('.cds--header__global .cds--header__action')
      .hasClass('cds--btn--icon-only');
    assert.dom('.cds--header__global .cds--header__action svg').exists();
    await click('.cds--header__global .cds--header__action');
    assert.true(clicked.value);
  });

  test('sidenav renders a divider between yielded menus', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Sidenav @open={{true}}>
              <:default as |_Menu Divider|>
                <Divider />
                <Divider />
              </:default>
            </s.Sidenav>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--side-nav__divider').exists({ count: 2 });
  });

  test('sidenav menu with submenus expands and collapses on click', async function (assert) {
    const subLinks = [{ title: 'Sub-link 1' }, { title: 'Sub-link 2' }];
    const noop = () => {};

    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Sidenav @open={{true}}>
              <:default as |Menu|>
                <Menu @title="Category 1" @submenus={{subLinks}} as |Sub|>
                  {{#each subLinks as |link|}}
                    <Sub
                      @title={{link.title}}
                      @isCurrent={{false}}
                      @transitionTo={{noop}}
                    />
                  {{/each}}
                </Menu>
              </:default>
            </s.Sidenav>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--side-nav__submenu').hasText('Category 1');
    assert.dom('.cds--side-nav__menu').doesNotExist();

    await click('.cds--side-nav__submenu');
    assert.dom('.cds--side-nav__submenu').hasAria('expanded', 'true');
    assert
      .dom('.cds--side-nav__menu .cds--side-nav__menu-item')
      .exists({ count: 2 });
    // A navigation list, as in Carbon React: no menu roles.
    assert.dom('.cds--side-nav [role="menu"]').doesNotExist();
    assert.dom('.cds--side-nav [role="menuitem"]').doesNotExist();

    await click('.cds--side-nav__submenu');
    assert.dom('.cds--side-nav__submenu').hasAria('expanded', 'false');
    assert.dom('.cds--side-nav__menu').doesNotExist();
  });

  test('nav renders a HeaderMenu that expands to show HeaderMenuItems', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header @title="IBM" @subtitle="Platform">
              <:header>
                <s.Nav as |Item Menu|>
                  <Item>Link 1</Item>
                  <Menu @menuLinkName="Link 2" as |MenuItem|>
                    <MenuItem>Sub-link 1</MenuItem>
                    <MenuItem @isActive={{true}}>Sub-link 2</MenuItem>
                  </Menu>
                </s.Nav>
              </:header>
            </s.Header>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--header__submenu').exists();
    assert.dom('.cds--header__menu-title').hasAria('expanded', 'false');
    assert
      .dom('.cds--header__menu .cds--header__menu-item')
      .exists({ count: 2 });
    assert
      .dom('.cds--header__menu .cds--header__menu-item--current')
      .exists({ count: 1 })
      .hasAria('current', 'true');

    await click('.cds--header__menu-title');
    assert.dom('.cds--header__menu-title').hasAria('expanded', 'true');
  });

  test('header panel renders content and toggles the expanded class', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header @title="IBM" @subtitle="Platform">
              <:headerPanel as |Panel|>
                <Panel @expanded={{true}}>Panel content</Panel>
              </:headerPanel>
            </s.Header>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--header-panel').hasClass('cds--header-panel--expanded');
    assert.dom('.cds--header-panel').hasText('Panel content');
  });

  test('switcher renders items and a divider', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Switcher @aria-label="App switcher" as |Item Divider|>
              <Item @isSelected={{true}}>App 1</Item>
              <Divider />
              <Item>App 2</Item>
            </s.Switcher>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--switcher').exists();
    assert.dom('.cds--switcher__item').exists({ count: 2 });
    assert.dom('.cds--switcher__item-link--selected').hasText('App 1');
    assert.dom('.cds--switcher__item--divider').exists();
  });

  test('attributes go on the links and the divider, as in Carbon React, and @className on the list items', async function (assert) {
    const noop = () => {};
    // A link, not a menu: no submenus.
    const submenus: [] = [];
    const subLinks = [{ title: 'Sub-link' }];
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header @title="IBM" @subtitle="Platform">
              <:header>
                <s.Nav as |Item Menu|>
                  <Item @className="nav-item" data-test-nav-link>Link</Item>
                  <Menu @menuLinkName="More" as |MenuItem|>
                    <MenuItem @className="menu-item" data-test-menu-link>
                      Sub-link
                    </MenuItem>
                  </Menu>
                </s.Nav>
              </:header>
            </s.Header>
            <s.Sidenav @open={{true}}>
              <:default as |Menu|>
                <Menu
                  @title="Home"
                  @isCurrent={{false}}
                  @transitionTo={{noop}}
                  @submenus={{submenus}}
                  href="/home"
                  data-test-side-link
                />
                <Menu
                  @title="Category"
                  @open={{true}}
                  @submenus={{subLinks}}
                  as |Sub|
                >
                  <Sub
                    @title="Sub-link"
                    @isCurrent={{false}}
                    @transitionTo={{noop}}
                    @className="sub-item"
                    data-test-sub-link
                  />
                </Menu>
              </:default>
            </s.Sidenav>
            <s.Switcher @aria-label="App switcher" as |Item Divider|>
              <Item @className="switcher-item" data-test-switcher-link>
                App
              </Item>
              <Divider data-test-divider />
            </s.Switcher>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('li.nav-item > a[data-test-nav-link]').exists();
    assert.dom('li.menu-item > a[data-test-menu-link]').exists();
    assert
      .dom('a.cds--side-nav__link[data-test-side-link]')
      .hasAttribute('href', '/home');
    assert.dom('li.sub-item > a[data-test-sub-link]').exists();
    assert.dom('li.switcher-item > a[data-test-switcher-link]').exists();
    assert.dom('hr[data-test-divider]').exists();
  });

  test('sidenav renders SideNavHeader, SideNavDetails and HeaderSideNavItems', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Sidenav @open={{true}}>
              <:default
                as |_Menu _Divider SideNavHeader SideNavDetails _SideNavIcon HeaderSideNavItems|
              >
                <SideNavHeader @icon={{Notification}}>IBM</SideNavHeader>
                <SideNavDetails @title="Account">
                  <p>Account details</p>
                </SideNavDetails>
                <HeaderSideNavItems @hasDivider={{true}}>
                  <li>Mirrored link</li>
                </HeaderSideNavItems>
              </:default>
            </s.Sidenav>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--side-nav__header').exists();
    assert.dom('.cds--side-nav__header .cds--side-nav__icon').exists();
    assert
      .dom('.cds--side-nav__details .cds--side-nav__title')
      .hasText('Account');
    assert
      .dom('.cds--side-nav__header-navigation.cds--side-nav__header-divider')
      .exists();
    assert
      .dom('.cds--side-nav__items > li > .cds--side-nav__header')
      .exists('the header sits in a list item');
    assert
      .dom('.cds--side-nav__items > li > .cds--side-nav__details')
      .exists('the details sit in a list item');
  });

  test('HeaderContainer yields expansion state and a toggle action', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.HeaderContainer as |c|>
              <button type="button" {{on "click" c.onClickSideNavExpand}}>
                {{if c.isSideNavExpanded "expanded" "collapsed"}}
              </button>
            </s.HeaderContainer>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('button').hasText('collapsed');
    await click('button');
    assert.dom('button').hasText('expanded');
  });

  test('sidenav footer toggles open state', async function (assert) {
    const open = tracked(false);
    const onToggle = (value: boolean) => (open.value = value);

    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Sidenav @open={{open.value}}>
              <:footer as |SideNavFooter|>
                <SideNavFooter @open={{open.value}} @onToggle={{onToggle}} />
              </:footer>
            </s.Sidenav>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--side-nav__footer').exists();
    await click('.cds--side-nav__footer');
    assert.true(open.value);
  });
});

module('Integration | Component | UIShell > links', function (hooks) {
  setupApplicationTest(hooks);
  setupRoutes(hooks);

  test('the header name, nav items and switcher items link to @href or @route', async function (assert) {
    await visitWith(
      this,
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header @title="IBM" @subtitle="Platform" @href="/">
              <:header>
                <s.Nav as |Item|>
                  <Item @href="/docs" id="docs">Docs</Item>
                  <Item @route="settings" id="settings">Settings</Item>
                </s.Nav>
              </:header>
            </s.Header>
            <s.Switcher @aria-label="App switcher" as |Item|>
              <Item @route="settings" id="switch">Settings</Item>
            </s.Switcher>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--header__name').hasAttribute('href', '/');
    assert.dom('#docs').hasAttribute('href', '/docs');
    assert.dom('#settings').hasAttribute('href', '/settings');
    assert.dom('#switch').hasAttribute('href', '/settings');
    assert.dom('#settings').doesNotHaveClass('cds--header__menu-item--current');

    await click('#settings');
    assert
      .dom('#settings')
      .hasClass('cds--header__menu-item--current')
      .hasAria('current', 'true')
      .doesNotHaveClass('active');
    assert.dom('#docs').doesNotHaveAria('current');
  });

  test('a side nav link to the current route is the current link', async function (assert) {
    const subLinks = [{ title: 'Settings' }];
    const none: never[] = [];
    await visitWith(
      this,
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Sidenav @open={{true}}>
              <:default as |Menu|>
                <Menu
                  @title="Home"
                  @href="/home"
                  id="home"
                  @submenus={{none}}
                />
                <Menu
                  @title="Settings"
                  @route="settings"
                  id="top"
                  @submenus={{none}}
                />
                <Menu
                  @title="Category"
                  @open={{true}}
                  @submenus={{subLinks}}
                  as |Sub|
                >
                  <Sub @title="Settings" @route="settings" id="sub" />
                </Menu>
              </:default>
            </s.Sidenav>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert
      .dom('#home')
      .hasAttribute('href', '/home')
      .doesNotHaveAttribute('role');
    assert.dom('#top').hasAttribute('href', '/settings');

    await click('#top');
    for (const link of ['#top', '#sub']) {
      assert
        .dom(link)
        .hasClass('cds--side-nav__link--current')
        .hasAria('current', 'page');
    }
    assert.dom('#home').doesNotHaveClass('cds--side-nav__link--current');
  });

  test('a link is current only while its route, models included, is current', async function (assert) {
    const ada = ['ada'];
    const grace = ['grace'];
    await visitWith(
      this,
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header @title="IBM" @subtitle="Platform" @route="settings">
              <:header>
                <s.Nav as |Item|>
                  <Item @route="user" @models={{ada}} id="ada">Ada</Item>
                  <Item @route="user" @models={{grace}} id="grace">Grace</Item>
                </s.Nav>
              </:header>
            </s.Header>
            <s.Switcher @aria-label="Apps" as |Item|>
              <Item @route="user" @models={{ada}} id="app">Ada's app</Item>
            </s.Switcher>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );
    assert.dom('.cds--header__name').hasAttribute('href', '/settings');

    await click('#ada');
    assert.dom('#ada').hasClass('cds--header__menu-item--current');
    assert.dom('#grace').doesNotHaveClass('cds--header__menu-item--current');
    assert
      .dom('#app')
      .hasClass('cds--switcher__item-link--selected')
      .doesNotHaveClass('active');

    await click('#grace');
    assert
      .dom('#ada')
      .doesNotHaveClass('cds--header__menu-item--current')
      .doesNotHaveAria('current');
    assert.dom('#grace').hasClass('cds--header__menu-item--current');
    assert.dom('#app').doesNotHaveClass('cds--switcher__item-link--selected');
    assert.dom('.cds--header__name').doesNotHaveClass('active');
  });

  test('the data-driven side nav links its items, without @transitionTo', async function (assert) {
    const menuItems = [
      { title: 'Home', href: '/home', submenus: [] },
      {
        title: 'Account',
        submenus: [{ title: 'Settings', route: 'settings' }],
      },
    ];
    await visitWith(
      this,
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Sidenav @open={{true}} @menuItems={{menuItems}} />
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert
      .dom('.cds--side-nav__item > a.cds--side-nav__link')
      .hasAttribute('href', '/home');
    await click('.cds--side-nav__submenu');
    await click('.cds--side-nav__menu a');
    const router = this.owner.lookup('service:router');
    assert.strictEqual(router.currentRouteName, 'settings');
    assert
      .dom('.cds--side-nav__menu a')
      .hasAttribute('href', '/settings')
      .hasClass('cds--side-nav__link--current');
  });
});

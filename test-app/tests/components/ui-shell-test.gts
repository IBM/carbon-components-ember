import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, waitUntil } from '@ember/test-helpers';
import { on } from '@ember/modifier';
import UIShell from 'carbon-components-ember/components/ui-shell';
import { Notification } from 'carbon-components-ember/icons';
import { cell } from 'ember-resources';

module('Integration | Component | UIShell', (hooks) => {
  setupRenderingTest(hooks);

  test('renders header and main content regions', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header @title='IBM' @subtitle='Platform' />
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
    const open = cell(false);
    const onToggle = (value: boolean) => (open.current = value);

    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header
              @title='IBM'
              @subtitle='Platform'
              @open={{open.current}}
              @onToggle={{onToggle}}
            />
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--header__menu-toggle').exists();
    await waitUntil(() => find('.cds--header__menu-toggle svg'));
    assert.dom('.cds--header__menu-toggle svg').exists();
    const beforeIcon = find('.cds--header__menu-toggle svg')?.innerHTML;

    await click('.cds--header__menu-toggle');
    assert.true(open.current);
    await waitUntil(() => find('.cds--header__menu-toggle svg'));
    const afterIcon = find('.cds--header__menu-toggle svg')?.innerHTML;
    assert.notStrictEqual(
      beforeIcon,
      afterIcon,
      'icon swaps between Menu and Close based on @open',
    );
  });

  test('header global action renders a button and calls onClick', async function (assert) {
    const clicked = cell(false);
    const onClick = () => (clicked.current = true);

    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header @title='IBM' @subtitle='Platform'>
              <:headerGlobal as |GlobalAction|>
                <GlobalAction
                  @aria-label='Notifications'
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
    await waitUntil(() => find('.cds--header__global .cds--header__action svg'));
    assert.dom('.cds--header__global .cds--header__action svg').exists();
    await click('.cds--header__global .cds--header__action');
    assert.true(clicked.current);
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
                <Menu @title='Category 1' @submenus={{subLinks}} as |Sub|>
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
    assert.dom('.cds--side-nav__menu .cds--side-nav__menu-item').exists({ count: 2 });

    await click('.cds--side-nav__submenu');
    assert.dom('.cds--side-nav__submenu').hasAria('expanded', 'false');
    assert.dom('.cds--side-nav__menu').doesNotExist();
  });

  test('nav renders a HeaderMenu that expands to show HeaderMenuItems', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header @title='IBM' @subtitle='Platform'>
              <:header>
                <s.Nav as |Item Menu|>
                  <Item>Link 1</Item>
                  <Menu @menuLinkName='Link 2' as |MenuItem|>
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
    assert.dom('.cds--header__menu .cds--header__menu-item').exists({ count: 2 });
    assert
      .dom('.cds--header__menu .cds--header__menu-item--current')
      .exists({ count: 1 });

    await click('.cds--header__menu-title');
    assert.dom('.cds--header__menu-title').hasAria('expanded', 'true');
  });

  test('header panel renders content and toggles the expanded class', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Header @title='IBM' @subtitle='Platform'>
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
            <s.Switcher @aria-label='App switcher' as |Item Divider|>
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
    assert
      .dom('.cds--switcher__item-link--selected')
      .hasText('App 1');
    assert.dom('.cds--switcher__item--divider').exists();
  });

  test('sidenav renders SideNavHeader, SideNavDetails and HeaderSideNavItems', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Sidenav @open={{true}}>
              <:default as |_Menu _Divider SideNavHeader SideNavDetails _SideNavIcon HeaderSideNavItems|>
                <SideNavHeader @icon={{Notification}}>IBM</SideNavHeader>
                <SideNavDetails @title='Account'>
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
    assert.dom('.cds--side-nav__details .cds--side-nav__title').hasText('Account');
    assert
      .dom('.cds--side-nav__header-navigation.cds--side-nav__header-divider')
      .exists();
  });

  test('HeaderContainer yields expansion state and a toggle action', async function (assert) {
    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.HeaderContainer as |c|>
              <button type='button' {{on 'click' c.onClickSideNavExpand}}>
                {{if c.isSideNavExpanded 'expanded' 'collapsed'}}
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
    const open = cell(false);
    const onToggle = (value: boolean) => (open.current = value);

    await render(
      <template>
        <UIShell>
          <:shell as |s|>
            <s.Sidenav @open={{open.current}}>
              <:footer as |SideNavFooter|>
                <SideNavFooter @open={{open.current}} @onToggle={{onToggle}} />
              </:footer>
            </s.Sidenav>
          </:shell>
          <:content></:content>
        </UIShell>
      </template>,
    );

    assert.dom('.cds--side-nav__footer').exists();
    await click('.cds--side-nav__footer');
    assert.true(open.current);
  });
});

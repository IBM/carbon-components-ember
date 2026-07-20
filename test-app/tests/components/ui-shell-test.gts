import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
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
    await click('.cds--header__menu-toggle');
    assert.true(open.current);
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

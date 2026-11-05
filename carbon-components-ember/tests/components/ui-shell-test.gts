import { module, test } from 'qunit';
import { setupApplicationTest, setupRenderingTest } from 'ember-qunit';
import {
  blur,
  click,
  fillIn,
  focus,
  render,
  settled,
  triggerEvent,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import chevronRight from '@carbon/icons/es/chevron--right/32';
import close from '@carbon/icons/es/close/32';
import menu from '@carbon/icons/es/menu/20';
import Content from '#src/components/ui-shell/content.gts';
import Header from '#src/components/ui-shell/header.gts';
import HeaderContainer from '#src/components/ui-shell/header-container.gts';
import HeaderGlobalAction from '#src/components/ui-shell/header-global-action.gts';
import HeaderGlobalBar from '#src/components/ui-shell/header-global-bar.gts';
import HeaderMenu from '#src/components/ui-shell/header-menu.gts';
import HeaderMenuButton from '#src/components/ui-shell/header-menu-button.gts';
import HeaderMenuItem from '#src/components/ui-shell/header-menu-item.gts';
import HeaderName from '#src/components/ui-shell/header-name.gts';
import HeaderNavigation from '#src/components/ui-shell/header-navigation.gts';
import HeaderPanel from '#src/components/ui-shell/header-panel.gts';
import SideNav from '#src/components/ui-shell/side-nav.gts';
import SideNavDivider from '#src/components/ui-shell/side-nav-divider.gts';
import SideNavFooter from '#src/components/ui-shell/side-nav-footer.gts';
import SideNavSwitcher from '#src/components/ui-shell/side-nav-switcher.gts';
import SkipToContent from '#src/components/ui-shell/skip-to-content.gts';
import SwitcherDivider from '#src/components/ui-shell/switcher-divider.gts';
import Notification from '#src/components/icons/notification.ts';
import Fade from '#src/components/icons/fade.ts';
import { setupRoutes, visitWith } from '../helpers';

const pathOf = (icon: typeof close) => String(icon.content[0]?.attrs['d']);

module('Integration | Component | UI Shell | Header', function (hooks) {
  setupRenderingTest(hooks);

  test('the header holds its parts, the name has a prefix, and the page goes in Content', async function (assert) {
    await render(
      <template>
        <Header aria-label="IBM Platform">
          <SkipToContent />
          <HeaderName @href="/" data-test-name>[Platform]</HeaderName>
          <HeaderName @href="/" @prefix="" data-test-bare>Plain</HeaderName>
        </Header>
        <Content id="main-content">Page</Content>
        <Content @tagName="div" data-test-div>Other</Content>
      </template>,
    );

    assert.dom('header.cds--header').hasAria('label', 'IBM Platform');
    assert
      .dom('.cds--skip-to-content')
      .hasText('Skip to main content')
      .hasAttribute('href', '#main-content')
      .hasAttribute('tabindex', '0');
    assert
      .dom('[data-test-name]')
      .hasClass('cds--header__name')
      .hasAttribute('href', '/')
      .hasText('IBM [Platform]');
    assert.dom('[data-test-name] .cds--header__name--prefix').hasText('IBM');
    assert.dom('[data-test-bare] .cds--header__name--prefix').doesNotExist();
    assert.dom('[data-test-bare]').hasText('Plain');
    assert.dom('main.cds--content#main-content').hasText('Page');
    assert.dom('div.cds--content[data-test-div]').exists();
  });

  test('the menu button shows a close icon while active, and is hidden from lg unless collapsible', async function (assert) {
    const active = tracked(false);
    const toggle = () => (active.value = !active.value);
    await render(
      <template>
        <HeaderMenuButton
          @ariaLabel="Open menu"
          @isActive={{active.value}}
          data-test-toggle
          {{on "click" toggle}}
        />
        <HeaderMenuButton
          @ariaLabel="Menu"
          @isCollapsible={{true}}
          data-test-collapsible
        />
      </template>,
    );

    assert
      .dom('[data-test-toggle]')
      .hasClass('cds--header__menu-toggle')
      .hasClass('cds--header__menu-toggle__hidden')
      .hasAria('label', 'Open menu')
      .hasAttribute('title', 'Open menu')
      .doesNotHaveClass('cds--header__action--active');
    assert.dom('[data-test-toggle] svg path').hasAttribute('d', pathOf(menu));

    await click('[data-test-toggle]');
    assert.dom('[data-test-toggle]').hasClass('cds--header__action--active');
    assert.dom('[data-test-toggle] svg path').hasAttribute('d', pathOf(close));
    assert
      .dom('[data-test-collapsible]')
      .doesNotHaveClass('cds--header__menu-toggle__hidden');
  });

  test('a global action is an icon button in a tooltip that names it', async function (assert) {
    const clicked = tracked(0);
    const onClick = () => clicked.value++;
    await render(
      <template>
        <HeaderGlobalBar>
          <HeaderGlobalAction
            @ariaLabel="Notifications"
            @isActive={{true}}
            {{on "click" onClick}}
          >
            <Notification @size={{20}} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </template>,
    );

    assert
      .dom('.cds--header__global button')
      .hasClass('cds--header__action')
      .hasClass('cds--header__action--active')
      .hasClass('cds--btn--ghost')
      .hasClass('cds--btn--icon-only')
      .hasAria('label', 'Notifications');
    assert.dom('.cds--popover-content').hasText('Notifications');
    await click('.cds--header__action');
    assert.strictEqual(clicked.value, 1);
  });

  test('a header menu opens on a click, Enter or Space, and closes on Escape or when focus leaves it', async function (assert) {
    await render(
      <template>
        <HeaderNavigation aria-label="Platform">
          <HeaderMenuItem @href="#">Link</HeaderMenuItem>
          <HeaderMenu
            @ariaLabel="More"
            @menuLinkName="More"
            as |HeaderMenuItem|
          >
            <HeaderMenuItem @href="#" data-test-sub>Sub-link</HeaderMenuItem>
          </HeaderMenu>
        </HeaderNavigation>
      </template>,
    );

    const title = '.cds--header__menu-title';
    assert.dom('nav.cds--header__nav').hasAria('label', 'Platform');
    assert.dom(title).hasAria('expanded', 'false').hasAria('label', 'More');
    assert.dom('.cds--header__menu').hasAria('label', 'More');

    await click(title);
    assert.dom(title).hasAria('expanded', 'true');
    await click(title);
    assert.dom(title).hasAria('expanded', 'false');

    await triggerKeyEvent(title, 'keydown', 'Enter');
    assert.dom(title).hasAria('expanded', 'true');
    await triggerKeyEvent('[data-test-sub]', 'keydown', 'Escape');
    assert.dom(title).hasAria('expanded', 'false').isFocused();

    await triggerKeyEvent(title, 'keydown', ' ');
    assert.dom(title).hasAria('expanded', 'true');
    await blur(title);
    assert.dom(title).hasAria('expanded', 'false');
  });

  test('a header menu is current while closed when one of its items is', async function (assert) {
    const active = tracked(false);
    await render(
      <template>
        <HeaderNavigation aria-label="Platform">
          <HeaderMenu @menuLinkName="More" data-test-menu as |HeaderMenuItem|>
            <HeaderMenuItem @href="#" @isActive={{active.value}} data-test-sub>
              Sub-link
            </HeaderMenuItem>
          </HeaderMenu>
          <HeaderMenu
            @menuLinkName="Other"
            @isActive={{true}}
            data-test-other
          />
        </HeaderNavigation>
      </template>,
    );

    const title = '[data-test-menu] .cds--header__menu-title';
    assert.dom(title).doesNotHaveClass('cds--header__menu-item--current');
    active.value = true;
    await settled();
    assert.dom(title).hasClass('cds--header__menu-item--current');
    assert
      .dom('[data-test-sub]')
      .hasClass('cds--header__menu-item--current')
      .hasAria('current', 'true');

    await click(title);
    assert.dom(title).doesNotHaveClass('cds--header__menu-item--current');
    assert
      .dom('[data-test-other] .cds--header__menu-title')
      .hasClass('cds--header__menu-item--current');
  });

  test('attributes go on the links and the divider, as in Carbon React, and @className on the list items', async function (assert) {
    await render(
      <template>
        <HeaderNavigation aria-label="Platform">
          <HeaderMenuItem @className="nav-item" @role="none" data-test-nav-link>
            Link
          </HeaderMenuItem>
        </HeaderNavigation>
        <HeaderPanel @expanded={{true}} as |Switcher|>
          <Switcher aria-label="Apps" as |SwitcherItem|>
            <SwitcherItem @className="switcher-item" data-test-switcher-link>
              App
            </SwitcherItem>
            <SwitcherDivider data-test-divider />
          </Switcher>
        </HeaderPanel>
      </template>,
    );

    assert.dom('li.nav-item').hasAttribute('role', 'none');
    assert
      .dom('li.nav-item > a[data-test-nav-link]')
      .hasAttribute('tabindex', '0')
      .doesNotHaveAttribute('role');
    assert.dom('li.switcher-item > a[data-test-switcher-link]').exists();
    assert.dom('ul.cds--switcher').hasAria('label', 'Apps');
    assert
      .dom('hr[data-test-divider]')
      .hasClass('cds--switcher__item--divider');
  });

  test('HeaderContainer yields whether the side nav is open and a toggle, and Escape closes it', async function (assert) {
    await render(
      <template>
        <HeaderContainer as |container|>
          <HeaderMenuButton
            @ariaLabel="Menu"
            @isActive={{container.isSideNavExpanded}}
            {{on "click" container.onClickSideNavExpand}}
          />
          <SideNav
            aria-label="Side navigation"
            @expanded={{container.isSideNavExpanded}}
          />
        </HeaderContainer>
      </template>,
    );

    assert.dom('nav').doesNotHaveClass('cds--side-nav--expanded');
    await click('button');
    assert.dom('nav').hasClass('cds--side-nav--expanded');
    assert.dom('button').hasClass('cds--header__action--active');
    await triggerKeyEvent(document.body, 'keydown', 'Escape');
    assert.dom('nav').doesNotHaveClass('cds--side-nav--expanded');
  });
});

module(
  'Integration | Component | UI Shell | HeaderPanel and Switcher',
  function (hooks) {
    setupRenderingTest(hooks);

    test('the panel follows @expanded, and calls @onHeaderPanelFocus on Escape and when focus leaves it', async function (assert) {
      const expanded = tracked(true);
      const calls = tracked(0);
      const onFocus = () => calls.value++;
      await render(
        <template>
          <HeaderPanel
            @expanded={{expanded.value}}
            @onHeaderPanelFocus={{onFocus}}
          >
            <button type="button">Inside</button>
          </HeaderPanel>
        </template>,
      );

      assert.dom('.cds--header-panel').hasClass('cds--header-panel--expanded');
      await triggerKeyEvent('.cds--header-panel button', 'keydown', 'Escape');
      assert.strictEqual(calls.value, 1);

      await focus('.cds--header-panel button');
      await blur('.cds--header-panel button');
      assert.strictEqual(calls.value, 2);

      expanded.value = false;
      await focus('.cds--header-panel button');
      await blur('.cds--header-panel button');
      assert.strictEqual(calls.value, 2, 'not while closed');
      assert
        .dom('.cds--header-panel')
        .doesNotHaveClass('cds--header-panel--expanded');
    });

    test('a panel holding a switcher closes on a click outside it', async function (assert) {
      const expanded = tracked(true);
      const close = () => (expanded.value = false);
      await render(
        <template>
          <button type="button" data-test-outside>Outside</button>
          <HeaderPanel
            @expanded={{expanded.value}}
            @onHeaderPanelFocus={{close}}
            as |Switcher|
          >
            <Switcher
              aria-label="Apps"
              @expanded={{expanded.value}}
              as |SwitcherItem|
            >
              <SwitcherItem @href="#">App</SwitcherItem>
            </Switcher>
          </HeaderPanel>
        </template>,
      );

      await click('.cds--header-panel');
      assert.true(expanded.value, 'a click inside keeps it open');
      await click('[data-test-outside]');
      assert.false(expanded.value);
      assert
        .dom('.cds--header-panel')
        .doesNotHaveClass('cds--header-panel--expanded');
    });

    test("a switcher's items are focusable only while it's expanded, and the arrows move between them", async function (assert) {
      const expanded = tracked(false);
      await render(
        <template>
          <HeaderPanel @expanded={{expanded.value}} as |Switcher|>
            <Switcher
              aria-label="Apps"
              @expanded={{expanded.value}}
              as |SwitcherItem|
            >
              <SwitcherItem @href="#" @isSelected={{true}} data-test-item="1">
                One
              </SwitcherItem>
              <SwitcherDivider />
              <SwitcherItem @href="#" data-test-item="2">Two</SwitcherItem>
              <SwitcherItem @href="#" data-test-item="3">Three</SwitcherItem>
            </Switcher>
          </HeaderPanel>
        </template>,
      );

      assert.dom('[data-test-item="1"]').hasAttribute('tabindex', '-1');
      expanded.value = true;
      await focus('[data-test-item="1"]');
      assert
        .dom('[data-test-item="1"]')
        .hasAttribute('tabindex', '0')
        .hasClass('cds--switcher__item-link--selected');

      await triggerKeyEvent('[data-test-item="1"]', 'keydown', 'ArrowDown');
      assert.dom('[data-test-item="2"]').isFocused();
      await triggerKeyEvent('[data-test-item="2"]', 'keydown', 'ArrowUp');
      await triggerKeyEvent('[data-test-item="1"]', 'keydown', 'ArrowUp');
      assert.dom('[data-test-item="3"]').isFocused();
      await triggerKeyEvent('[data-test-item="3"]', 'keydown', 'ArrowDown');
      assert.dom('[data-test-item="1"]').isFocused();
    });
  },
);

module('Integration | Component | UI Shell | SideNav', function (hooks) {
  setupRenderingTest(hooks);

  test('its classes follow its args, and it has an overlay unless it is fixed', async function (assert) {
    await render(
      <template>
        <SideNav aria-label="Header nav" data-test-ux />
        <SideNav
          aria-label="Fixed nav"
          @isFixedNav={{true}}
          @isChildOfHeader={{false}}
          @expanded={{false}}
          data-test-fixed
        />
        <SideNav
          aria-label="Hidden nav"
          @isPersistent={{false}}
          @expanded={{true}}
          data-test-hidden
        />
        <SideNav aria-label="Rail" @isRail={{true}} data-test-rail />
      </template>,
    );

    assert
      .dom('[data-test-ux]')
      .hasClass('cds--side-nav')
      .hasClass('cds--side-nav__navigation')
      .hasClass('cds--side-nav--ux')
      .hasAttribute('tabindex', '-1')
      .doesNotHaveClass('cds--side-nav--expanded');
    assert
      .dom('[data-test-fixed]')
      .hasClass('cds--side-nav--collapsed')
      .doesNotHaveClass('cds--side-nav--ux')
      .hasAttribute('inert');
    assert
      .dom('[data-test-hidden]')
      .hasClass('cds--side-nav--hidden')
      .hasClass('cds--side-nav--expanded')
      .doesNotHaveAttribute('inert');
    assert
      .dom('[data-test-rail]')
      .hasClass('cds--side-nav--rail')
      .doesNotHaveAttribute('inert');
    assert.dom('.cds--side-nav__overlay').exists({ count: 3 });
    assert.dom('.cds--side-nav__overlay-active').exists({ count: 1 });
  });

  test('a click on the overlay calls @onOverlayClick, and Tab from the header menu button goes into the open side nav', async function (assert) {
    const clicks = tracked(0);
    const onOverlayClick = () => clicks.value++;
    await render(
      <template>
        {{! Collapsible, so it shows, and takes focus, at every width. }}
        <HeaderMenuButton @ariaLabel="Menu" @isCollapsible={{true}} />
        <SideNav
          aria-label="Side navigation"
          @expanded={{true}}
          @onOverlayClick={{onOverlayClick}}
          as |SideNavItems|
        >
          <SideNavItems as |SideNavLink|>
            <SideNavLink @href="#">Link</SideNavLink>
          </SideNavItems>
        </SideNav>
      </template>,
    );

    await click('.cds--side-nav__overlay');
    assert.strictEqual(clicks.value, 1);

    await focus('.cds--header__menu-toggle');
    await triggerKeyEvent('.cds--header__menu-toggle', 'keydown', 'Tab');
    assert.dom('nav').isFocused();
  });

  test('Escape and focus leaving it call @onToggle with false, and @onSideNavBlur while it is open', async function (assert) {
    const calls: [string, boolean][] = [];
    const blurs = tracked(0);
    const onToggle = (
      event: FocusEvent | KeyboardEvent | boolean,
      value: boolean,
    ) =>
      calls.push([typeof event === 'boolean' ? 'pointer' : event.type, value]);
    const onSideNavBlur = () => blurs.value++;
    await render(
      <template>
        <SideNav
          aria-label="Side navigation"
          @expanded={{true}}
          @onToggle={{onToggle}}
          @onSideNavBlur={{onSideNavBlur}}
          as |SideNavItems|
        >
          <SideNavItems as |SideNavLink|>
            <SideNavLink @href="#">Link</SideNavLink>
          </SideNavItems>
        </SideNav>
      </template>,
    );

    await triggerKeyEvent('.cds--side-nav__link', 'keydown', 'Escape');
    await focus('.cds--side-nav__link');
    await blur('.cds--side-nav__link');
    assert.deepEqual(calls, [
      ['keydown', false],
      ['focusout', false],
    ]);
    assert.strictEqual(blurs.value, 1);
  });

  test('without @expanded, it holds its own state, which changes after @enterDelayMs', async function (assert) {
    await render(
      <template>
        <SideNav
          aria-label="Side navigation"
          @defaultExpanded={{true}}
          @isFixedNav={{true}}
          @enterDelayMs={{10}}
          as |SideNavItems|
        >
          <SideNavItems as |SideNavLink|>
            <SideNavLink @href="#">Link</SideNavLink>
          </SideNavItems>
        </SideNav>
      </template>,
    );

    assert.dom('nav').doesNotHaveClass('cds--side-nav--collapsed');
    await triggerKeyEvent('.cds--side-nav__link', 'keydown', 'Escape');
    assert.dom('nav').hasClass('cds--side-nav--collapsed');
  });

  test('a rail opens while the pointer is over it, and its menus close while it is collapsed', async function (assert) {
    await render(
      <template>
        <SideNav
          aria-label="Side navigation"
          @isRail={{true}}
          @enterDelayMs={{0}}
          as |SideNavItems|
        >
          <SideNavItems as |SideNavLink SideNavMenu|>
            <SideNavMenu
              @title="Menu"
              @defaultExpanded={{true}}
              as |SideNavMenuItem|
            >
              <SideNavMenuItem @href="#">Item</SideNavMenuItem>
            </SideNavMenu>
            <SideNavLink @href="#" @renderIcon={{Fade}}>Link</SideNavLink>
          </SideNavItems>
        </SideNav>
      </template>,
    );

    assert.dom('nav').doesNotHaveClass('cds--side-nav--expanded');
    assert.dom('.cds--side-nav__submenu').hasAria('expanded', 'false');
    assert
      .dom('.cds--side-nav__item > .cds--side-nav__link')
      .hasAttribute('tabindex', '0', "a rail's links stay reachable");

    await triggerEvent('nav', 'mouseenter');
    assert.dom('nav').hasClass('cds--side-nav--expanded');
    assert.dom('.cds--side-nav__submenu').hasAria('expanded', 'true');

    await triggerEvent('nav', 'mouseleave');
    assert.dom('nav').doesNotHaveClass('cds--side-nav--expanded');
    assert.dom('.cds--side-nav__submenu').hasAria('expanded', 'false');
  });

  test('its links and menus leave the tab order while it is closed', async function (assert) {
    const expanded = tracked(false);
    await render(
      <template>
        <SideNav
          aria-label="Side navigation"
          @expanded={{expanded.value}}
          as |SideNavItems|
        >
          <SideNavItems as |SideNavLink SideNavMenu|>
            <SideNavLink @href="#" data-test-link>Link</SideNavLink>
            <SideNavMenu @title="Menu" data-test-menu />
            <SideNavMenu @title="Pinned" @tabIndex={{0}} data-test-pinned />
          </SideNavItems>
          <SideNavItems @isSideNavExpanded={{true}} as |SideNavLink|>
            <SideNavLink @href="#" data-test-override>Link</SideNavLink>
          </SideNavItems>
        </SideNav>
      </template>,
    );

    const menuButton = '[data-test-menu] .cds--side-nav__submenu';
    assert.dom('[data-test-link]').hasAttribute('tabindex', '-1');
    assert.dom(menuButton).hasAttribute('tabindex', '-1');
    assert
      .dom('[data-test-pinned] .cds--side-nav__submenu')
      .hasAttribute('tabindex', '0');
    assert.dom('[data-test-override]').hasAttribute('tabindex', '0');

    expanded.value = true;
    await settled();
    assert.dom('[data-test-link]').hasAttribute('tabindex', '0');
    assert.dom(menuButton).hasAttribute('tabindex', '0');
  });

  test('a menu opens on a click and closes on Escape, and is current while closed when one of its items is', async function (assert) {
    await render(
      <template>
        <SideNav
          aria-label="Side navigation"
          @expanded={{true}}
          as |SideNavItems|
        >
          <SideNavItems as |SideNavLink SideNavMenu|>
            <SideNavMenu
              @title="Menu"
              @renderIcon={{Fade}}
              @large={{true}}
              data-test-menu
              as |SideNavMenuItem|
            >
              <SideNavMenuItem
                @href="#"
                @isActive={{true}}
                @className="item"
              >Item</SideNavMenuItem>
            </SideNavMenu>
            <SideNavDivider />
            <SideNavLink @href="#" @isActive={{true}} @large={{true}}>
              Link
            </SideNavLink>
            <SideNavLink
              @href="#"
              @isActive={{true}}
              aria-current="true"
              data-test-own-current
            >
              Link
            </SideNavLink>
          </SideNavItems>
        </SideNav>
      </template>,
    );

    assert
      .dom('[data-test-menu]')
      .hasClass('cds--side-nav__item--active')
      .hasClass('cds--side-nav__item--icon')
      .hasClass('cds--side-nav__item--large');
    assert
      .dom('li.item > .cds--side-nav__link')
      .hasClass('cds--side-nav__link--current')
      .hasAria('current', 'page');
    assert.dom('.cds--side-nav__menu').exists('the list renders while closed');

    await click('.cds--side-nav__submenu');
    assert.dom('.cds--side-nav__submenu').hasAria('expanded', 'true');
    assert
      .dom('[data-test-menu]')
      .doesNotHaveClass('cds--side-nav__item--active');
    await triggerKeyEvent('li.item a', 'keydown', 'Escape');
    assert.dom('.cds--side-nav__submenu').hasAria('expanded', 'false');

    assert.dom('.cds--side-nav__divider > hr').exists();
    assert
      .dom('.cds--side-nav__item--large > .cds--side-nav__link')
      .hasClass('cds--side-nav__link--current')
      .hasAria('current', 'page');
    assert
      .dom('[data-test-own-current]')
      .hasAria('current', 'true', 'the caller’s aria-current wins');
  });

  test('a link or menu item can be a button', async function (assert) {
    const clicks = tracked(0);
    const onClick = () => clicks.value++;
    await render(
      <template>
        <SideNav
          aria-label="Side navigation"
          @expanded={{true}}
          as |SideNavItems|
        >
          <SideNavItems as |SideNavLink SideNavMenu|>
            <SideNavLink
              @as="button"
              @isActive={{true}}
              type="button"
              {{on "click" onClick}}
            >
              Release notes
            </SideNavLink>
            <SideNavLink @as="a" @href="/notes" data-test-as-link>
              Notes
            </SideNavLink>
            <SideNavMenu @title="Resources" as |SideNavMenuItem|>
              <SideNavMenuItem
                @as="button"
                type="button"
                {{on "click" onClick}}
              >
                Version
              </SideNavMenuItem>
            </SideNavMenu>
          </SideNavItems>
        </SideNav>
      </template>,
    );

    assert.dom('button.cds--side-nav__link').exists({ count: 2 });
    assert
      .dom('.cds--side-nav__item > button.cds--side-nav__link')
      .hasClass('cds--side-nav__link--current')
      .hasAria('current', 'page');
    assert.dom('[data-test-as-link]').hasAttribute('href', '/notes');
    await click('.cds--side-nav__item > button.cds--side-nav__link');
    await click('.cds--side-nav__menu-item > button');
    assert.strictEqual(clicks.value, 2);
  });

  test('the switcher shows its label until an option is chosen, and calls @onChange on change and blur', async function (assert) {
    const events: string[] = [];
    const onChange = (event: Event) => events.push(event.type);
    const options = ['Personal', 'Team'];
    await render(
      <template>
        <SideNavSwitcher
          @labelText="Switch account"
          @options={{options}}
          @onChange={{onChange}}
        />
      </template>,
    );

    assert.dom('select').hasValue('');
    assert.dom('label.cds--assistive-text').hasText('Switch account');
    assert.dom('option').exists({ count: 3 });
    await fillIn('select', 'Team');
    await blur('select');
    assert.deepEqual(events, ['change', 'blur']);
    assert.dom('select').hasValue('Team');
  });

  test('the footer toggle shows a close icon while open and calls @onToggle', async function (assert) {
    const expanded = tracked(false);
    const toggle = () => (expanded.value = !expanded.value);
    await render(
      <template>
        <SideNavFooter @expanded={{expanded.value}} @onToggle={{toggle}} />
      </template>,
    );

    assert
      .dom('footer.cds--side-nav__footer button.cds--side-nav__toggle')
      .hasAttribute('title', 'Toggle opening or closing the side navigation');
    assert.dom('svg path').hasAttribute('d', pathOf(chevronRight));
    await click('button');
    assert.dom('svg path').hasAttribute('d', pathOf(close));
  });
});

module('Integration | Component | UI Shell | links', function (hooks) {
  setupApplicationTest(hooks);
  setupRoutes(hooks);

  test('the header name, menu items and switcher items link to @href or @route', async function (assert) {
    await visitWith(
      this,
      <template>
        <Header aria-label="Platform">
          <HeaderName @href="/">Platform</HeaderName>
          <HeaderNavigation aria-label="Platform">
            <HeaderMenuItem @href="/docs" id="docs">Docs</HeaderMenuItem>
            <HeaderMenuItem @route="settings" id="settings">
              Settings
            </HeaderMenuItem>
          </HeaderNavigation>
          <HeaderPanel @expanded={{true}} as |Switcher|>
            <Switcher aria-label="Apps" as |SwitcherItem|>
              <SwitcherItem
                @route="settings"
                id="switch"
              >Settings</SwitcherItem>
            </Switcher>
          </HeaderPanel>
        </Header>
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
    assert
      .dom('#switch')
      .hasClass('cds--switcher__item-link--selected')
      .doesNotHaveClass('active');
  });

  test('a menu holding the link to the current route is current while closed', async function (assert) {
    await visitWith(
      this,
      <template>
        <HeaderNavigation aria-label="Platform">
          <HeaderMenu @menuLinkName="More" as |HeaderMenuItem|>
            <HeaderMenuItem @route="settings">Settings</HeaderMenuItem>
          </HeaderMenu>
        </HeaderNavigation>
        <SideNav
          aria-label="Side navigation"
          @expanded={{true}}
          as |SideNavItems|
        >
          <SideNavItems as |SideNavLink SideNavMenu|>
            <SideNavLink @href="/home" id="home">Home</SideNavLink>
            <SideNavLink @route="settings" id="top">Settings</SideNavLink>
            <SideNavMenu @title="Category" id="menu" as |SideNavMenuItem|>
              <SideNavMenuItem @route="settings" id="sub">
                Settings
              </SideNavMenuItem>
            </SideNavMenu>
          </SideNavItems>
        </SideNav>
      </template>,
    );

    assert.dom('#home').hasAttribute('href', '/home');
    assert.dom('#top').hasAttribute('href', '/settings');
    assert.dom('#menu').doesNotHaveClass('cds--side-nav__item--active');

    await click('#top');
    for (const link of ['#top', '#sub']) {
      assert
        .dom(link)
        .hasClass('cds--side-nav__link--current')
        .hasAria('current', 'page')
        .doesNotHaveClass('active');
    }
    assert.dom('#home').doesNotHaveClass('cds--side-nav__link--current');
    assert.dom('#menu').hasClass('cds--side-nav__item--active');
    assert
      .dom('.cds--header__menu-title')
      .hasClass('cds--header__menu-item--current');
  });

  test('a link is current only while its route, models included, is current', async function (assert) {
    const ada = ['ada'];
    const grace = ['grace'];
    await visitWith(
      this,
      <template>
        <HeaderName @route="settings">Platform</HeaderName>
        <HeaderNavigation aria-label="Platform">
          <HeaderMenuItem @route="user" @models={{ada}} id="ada">
            Ada
          </HeaderMenuItem>
          <HeaderMenuItem @route="user" @models={{grace}} id="grace">
            Grace
          </HeaderMenuItem>
        </HeaderNavigation>
      </template>,
    );
    assert.dom('.cds--header__name').hasAttribute('href', '/settings');

    await click('#ada');
    assert.dom('#ada').hasClass('cds--header__menu-item--current');
    assert.dom('#grace').doesNotHaveClass('cds--header__menu-item--current');

    await click('#grace');
    assert
      .dom('#ada')
      .doesNotHaveClass('cds--header__menu-item--current')
      .doesNotHaveAria('current');
    assert.dom('#grace').hasClass('cds--header__menu-item--current');
    assert.dom('.cds--header__name').doesNotHaveClass('active');
  });
});

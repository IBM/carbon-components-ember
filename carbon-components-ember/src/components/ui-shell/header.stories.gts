import { trackedObject } from '@ember/reactive/collections';
import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import {
  MENU_ITEMS,
  CURRENT,
  NO_ITEMS,
  HOME,
  noop,
  SMALL_FRAME,
  withShellFrame,
} from '#storybook/fixtures/ui-shell.gts';
import preview from '#storybook/preview.ts';
import UIShell from '../ui-shell.gts';
import Fade from '../icons/fade.ts';
import Notification from '../icons/notification.ts';
import Search from '../icons/search.ts';
import SwitcherIcon from '../icons/switcher.ts';
import UserAvatar from '../icons/user-avatar.ts';

import type { StoryArgs } from '#storybook/fixtures/ui-shell.gts';

// Carbon React's UI Shell story pages: Header (with the Ember-only Overview
// and HeaderContainer stories) and SideNav.
//
// Parity gaps:
// - `Side Nav Rail with Header`: no rail (`isRail`) mode.
// - `Side Nav with Large Side Nav Items`: no `large` side-nav items.
// - No `SkipToContent`/`HeaderName` `prefix`/`href` customization (the
//   header always renders "Skip to main content" and an `href="#"` name),
//   no `HeaderMenuButton` `isCollapsible`, and no `HeaderNavigation`
//   `aria-label` (it is always "IBM [Platform]").
// - Sidenav's signature requires `@menuItems`, `@currentMenu` and
//   `@transitionTo` even when it is composed through its block, and every
//   menu/submenu `icon` is required although the templates render fine
//   without one. The `Fixed Side Nav` story casts its icon-less items.

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/UI Shell/Header',
  component: UIShell,
  parameters: {
    docs: {
      description: {
        component:
          "The UI Shell is the structural framework of an application that houses navigational elements and page content, so users can move through an application consistently and predictably. Its `shell` block yields a `Header` (top bar with the product name, navigation, and global actions), a `Nav` (top-level navigation links and `HeaderMenu`s), a `Sidenav` (left-hand navigation panel), a `Switcher` and a `HeaderContainer`; the `content` block is the page content.\n\nThe `Header` yields a `GlobalAction` into its `headerGlobal` block (icon buttons for search, notifications, the app switcher, ...) and a `HeaderPanel` into its `headerPanel` block. The `Sidenav` block yields `Menu`, `Divider`, `SideNavHeader`, `SideNavDetails`, `SideNavIcon` and `HeaderSideNavItems`, and its `footer` block a `Footer` toggle; wire the toggle to the same `@open`/`@onToggle` state as the `Header`'s menu button (or use `HeaderContainer`, which manages it).",
      },
    },
  },
  args: {
    title: 'IBM',
    subtitle: '[Platform]',
    onAction: fn(),
  },
  decorators: [withShellFrame],
});

export const HeaderWNavigation = meta.story({
  name: 'Header with Navigation',
  render: (args: StoryArgs) => <template>
    <UIShell>
      <:shell as |s|>
        <s.Header @title={{args.title}} @subtitle={{args.subtitle}}>
          <:header>
            <s.Nav as |Item HeaderMenu|>
              <Item>Link 1</Item>
              <Item>Link 2</Item>
              <Item>Link 3</Item>
              <HeaderMenu @menuLinkName="Link 4" as |MenuItemLink|>
                <MenuItemLink>Sub-link 1</MenuItemLink>
                <MenuItemLink>Sub-link 2</MenuItemLink>
                <MenuItemLink>Sub-link 3</MenuItemLink>
              </HeaderMenu>
            </s.Nav>
          </:header>
        </s.Header>
      </:shell>
      <:content></:content>
    </UIShell>
  </template>,
});

HeaderWNavigation.test(
  'opens a header menu',
  async ({ canvas, canvasElement, userEvent }) => {
    // The menu title is an `href="#"` link; keep the test page in place.
    canvasElement.addEventListener('click', (e) => e.preventDefault());
    const menu = canvas.getByRole('link', { name: 'Link 4' });
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(menu);
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
  },
);

export const HeaderWNavigationAndActions = meta.story({
  name: 'Header with Navigation and Actions',
  render: (args: StoryArgs) => <template>
    <UIShell>
      <:shell as |s|>
        <s.Header @title={{args.title}} @subtitle={{args.subtitle}}>
          <:header>
            <s.Nav as |Item|>
              <Item>Link 1</Item>
              <Item>Link 2</Item>
              <Item>Link 3</Item>
            </s.Nav>
          </:header>
          <:headerGlobal as |GlobalAction|>
            <GlobalAction
              @aria-label="Search"
              @icon={{Search}}
              @onClick={{args.onAction}}
            />
            <GlobalAction
              @aria-label="Notifications"
              @icon={{Notification}}
              @onClick={{args.onAction}}
            />
            <GlobalAction
              @aria-label="App Switcher"
              @icon={{SwitcherIcon}}
              @onClick={{args.onAction}}
            />
          </:headerGlobal>
        </s.Header>
      </:shell>
      <:content></:content>
    </UIShell>
  </template>,
});

HeaderWNavigationAndActions.test(
  'global actions call their handler',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Notifications' }),
    );
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
);

// The header's menu button and the side nav share the `open` state.

export const HeaderWNavigationActionsAndSideNav = meta.story({
  name: 'Header with Navigation, Actions and Side Nav',
  render: (args: StoryArgs) => {
    const state = trackedObject({ open: false });
    const onToggle = (open: boolean) => {
      state.open = open;
    };

    return <template>
      <UIShell>
        <:shell as |s|>
          <s.Header
            @title={{args.title}}
            @subtitle={{args.subtitle}}
            @open={{state.open}}
            @onToggle={{onToggle}}
          >
            <:header>
              <s.Nav as |Item|>
                <Item>Link 1</Item>
                <Item>Link 2</Item>
                <Item>Link 3</Item>
              </s.Nav>
            </:header>
            <:headerGlobal as |GlobalAction|>
              <GlobalAction
                @aria-label="Search"
                @icon={{Search}}
                @onClick={{args.onAction}}
              />
              <GlobalAction
                @aria-label="Notifications"
                @icon={{Notification}}
                @onClick={{args.onAction}}
              />
            </:headerGlobal>
          </s.Header>
          <s.Sidenav
            @open={{state.open}}
            @menuItems={{MENU_ITEMS}}
            @currentMenu={{CURRENT}}
            @transitionTo={{noop}}
          >
            <:footer as |Footer|>
              <Footer @open={{state.open}} @onToggle={{onToggle}} />
            </:footer>
          </s.Sidenav>
        </:shell>
        <:content><p>Page content</p></:content>
      </UIShell>
    </template>;
  },
});

HeaderWNavigationActionsAndSideNav.test(
  'the menu button and the footer toggle the side nav',
  async ({ canvas, canvasElement, userEvent }) => {
    const sidenav = canvasElement.querySelector('.cds--side-nav')!;
    await expect(sidenav).not.toHaveClass('cds--side-nav--expanded');
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    await expect(sidenav).toHaveClass('cds--side-nav--expanded');
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse' }));
    await expect(sidenav).not.toHaveClass('cds--side-nav--expanded');
  },
);

export const HeaderWSideNav = meta.story({
  name: 'Header with Side Nav',
  render: (args: StoryArgs) => {
    const state = trackedObject({ open: true });
    const onToggle = (open: boolean) => {
      state.open = open;
    };

    return <template>
      <UIShell>
        <:shell as |s|>
          <s.Header
            @title={{args.title}}
            @subtitle={{args.subtitle}}
            @open={{state.open}}
            @onToggle={{onToggle}}
          />
          <s.Sidenav
            @open={{state.open}}
            @menuItems={{MENU_ITEMS}}
            @currentMenu={{CURRENT}}
            @transitionTo={{noop}}
          />
        </:shell>
        <:content><p>Page content</p></:content>
      </UIShell>
    </template>;
  },
});

// A GlobalAction toggles a HeaderPanel's `@expanded`.

export const HeaderWActionsAndRightPanel = meta.story({
  name: 'Header with Actions and Right Panel',
  render: (args: StoryArgs) => {
    const state = trackedObject({ expanded: false });
    const toggle = () => {
      state.expanded = !state.expanded;
      args.onAction();
    };
    const onToggle = (expanded: boolean) => {
      state.expanded = expanded;
    };

    return <template>
      <UIShell>
        <:shell as |s|>
          <s.Header @title={{args.title}} @subtitle={{args.subtitle}}>
            <:headerGlobal as |GlobalAction|>
              <GlobalAction
                @aria-label="Search"
                @icon={{Search}}
                @onClick={{args.onAction}}
              />
              <GlobalAction
                @aria-label="Notifications"
                @icon={{Notification}}
                @onClick={{toggle}}
              />
            </:headerGlobal>
            <:headerPanel as |HeaderPanel|>
              <HeaderPanel
                @expanded={{state.expanded}}
                @onToggle={{onToggle}}
                data-test-header-panel
              >
                <p style="padding: 1rem">Header panel content</p>
              </HeaderPanel>
            </:headerPanel>
          </s.Header>
        </:shell>
        <:content></:content>
      </UIShell>
    </template>;
  },
});

HeaderWActionsAndRightPanel.test(
  'a global action expands the header panel',
  async ({ canvas, canvasElement, userEvent }) => {
    const panel = canvasElement.querySelector('[data-test-header-panel]')!;
    await expect(panel).not.toHaveClass('cds--header-panel--expanded');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Notifications' }),
    );
    await expect(panel).toHaveClass('cds--header-panel--expanded');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Notifications' }),
    );
    await expect(panel).not.toHaveClass('cds--header-panel--expanded');
  },
);

// The top-level UIShell yields a Switcher (with Item and Divider) for the
// contents of an application switcher panel.

export const HeaderWActionsAndSwitcher = meta.story({
  name: 'Header with Actions and Switcher',
  render: (args: StoryArgs) => {
    const state = trackedObject({ expanded: false });
    const toggle = () => {
      state.expanded = !state.expanded;
    };
    const onToggle = (expanded: boolean) => {
      state.expanded = expanded;
    };

    return <template>
      <UIShell>
        <:shell as |s|>
          <s.Header @title={{args.title}} @subtitle={{args.subtitle}}>
            <:headerGlobal as |GlobalAction|>
              <GlobalAction
                @aria-label="Search"
                @icon={{Search}}
                @onClick={{args.onAction}}
              />
              <GlobalAction
                @aria-label="App Switcher"
                @icon={{SwitcherIcon}}
                @onClick={{toggle}}
              />
            </:headerGlobal>
            <:headerPanel as |HeaderPanel|>
              <HeaderPanel @expanded={{state.expanded}} @onToggle={{onToggle}}>
                <s.Switcher @aria-label="Switcher Container" as |Item Divider|>
                  <Item @aria-label="Link 1" @isSelected={{true}}>Link 1</Item>
                  <Divider />
                  <Item @aria-label="Link 2">Link 2</Item>
                  <Item @aria-label="Link 3">Link 3</Item>
                  <Item @aria-label="Link 4">Link 4</Item>
                  <Divider />
                  <Item @aria-label="Link 5">Link 5</Item>
                </s.Switcher>
              </HeaderPanel>
            </:headerPanel>
          </s.Header>
        </:shell>
        <:content></:content>
      </UIShell>
    </template>;
  },
});

export const Overview = meta.story({
  render: (args: StoryArgs) => {
    const state = trackedObject({ open: true });
    const onToggle = (open: boolean) => {
      state.open = open;
    };
    const subLinks = [
      { title: 'Sub-link 1', icon: Fade },
      { title: 'Sub-link 2', icon: Fade },
    ];

    return <template>
      <UIShell>
        <:shell as |s|>
          <s.Header
            @title="IBM"
            @subtitle="Platform"
            @open={{state.open}}
            @onToggle={{onToggle}}
          >
            <:header>
              <s.Nav as |Item|>
                <Item>Link 1</Item>
                <Item>Link 2</Item>
                <Item>Link 3</Item>
              </s.Nav>
            </:header>
            <:headerGlobal as |GlobalAction|>
              <GlobalAction
                @aria-label="Notifications"
                @icon={{Notification}}
                @onClick={{args.onAction}}
              />
              <GlobalAction
                @aria-label="User Avatar"
                @icon={{UserAvatar}}
                @onClick={{args.onAction}}
              />
            </:headerGlobal>
          </s.Header>
          <s.Sidenav
            @open={{state.open}}
            @menuItems={{NO_ITEMS}}
            @currentMenu={{HOME}}
            @transitionTo={{noop}}
          >
            <:default as |Menu Divider|>
              <Menu
                @title="Category 1"
                @icon={{Fade}}
                @isCurrent={{false}}
                @submenus={{subLinks}}
                @transitionTo={{noop}}
                as |Sub|
              >
                {{#each subLinks as |link|}}
                  <Sub
                    @title={{link.title}}
                    @icon={{link.icon}}
                    @isCurrent={{false}}
                    @transitionTo={{noop}}
                  />
                {{/each}}
              </Menu>
              <Divider />
              <Menu
                @title="Category 2"
                @icon={{Fade}}
                @isCurrent={{false}}
                @submenus={{NO_ITEMS}}
                @transitionTo={{noop}}
              />
            </:default>
            <:footer as |Footer|>
              <Footer @open={{state.open}} @onToggle={{onToggle}} />
            </:footer>
          </s.Sidenav>
        </:shell>
        <:content><p>Page content</p></:content>
      </UIShell>
    </template>;
  },
});

// The Sidenav block also yields SideNavHeader (an icon and heading for the
// rail), SideNavDetails (a titled block, e.g. for account info) and
// HeaderSideNavItems (mirrors the top Header nav items into the side nav on
// smaller viewports).

export const HeaderContainer = meta.story({
  decorators: [
    (Story, context) => <template>
      <div style={{SMALL_FRAME}}>
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  render: (args: StoryArgs) => <template>
    <UIShell>
      <:shell as |s|>
        <s.HeaderContainer as |c|>
          <s.Header
            @title={{args.title}}
            @subtitle={{args.subtitle}}
            @open={{c.isSideNavExpanded}}
            @onToggle={{c.onClickSideNavExpand}}
          />
          <s.Sidenav
            @open={{c.isSideNavExpanded}}
            @menuItems={{MENU_ITEMS}}
            @currentMenu={{CURRENT}}
            @transitionTo={{noop}}
          />
        </s.HeaderContainer>
      </:shell>
      <:content></:content>
    </UIShell>
  </template>,
});

HeaderContainer.test(
  'toggles the side nav and collapses it on Escape',
  async ({ canvas, canvasElement, userEvent }) => {
    const sidenav = canvasElement.querySelector('.cds--side-nav')!;
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    await expect(sidenav).toHaveClass('cds--side-nav--expanded');
    await userEvent.keyboard('{Escape}');
    await expect(sidenav).not.toHaveClass('cds--side-nav--expanded');
  },
);

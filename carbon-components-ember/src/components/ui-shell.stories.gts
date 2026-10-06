import { trackedObject } from '@ember/reactive/collections';
import { htmlSafe } from '@ember/template';
import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import UIShell from './ui-shell.gts';
import Fade from './icons/fade.ts';
import Notification from './icons/notification.ts';
import Search from './icons/search.ts';
import SwitcherIcon from './icons/switcher.ts';
import UserAvatar from './icons/user-avatar.ts';

import type { MenuItem } from './ui-shell/-sidenav.gts';

// Carbon React splits these into `Components/UI Shell/Header` and
// `Components/UI Shell/SideNav`; one Ember stories file has one meta, so
// both sets of story names live under `Components/UI Shell`.
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
//
// The shell's header and side nav are `position: fixed`; each story renders
// it inside a box whose `transform` makes it their containing block, so the
// shell stays inside the story instead of covering the page.

type StoryArgs = {
  title: string;
  subtitle: string;
  onAction: () => void;
};

const SUB_LINKS = [
  { title: 'Link', icon: Fade },
  { title: 'Link', icon: Fade },
  { title: 'Link', icon: Fade },
];

const MENU_ITEMS: MenuItem[] = [
  { title: 'Category title', icon: Fade, submenus: SUB_LINKS },
  { title: 'Category title', icon: Fade, submenus: SUB_LINKS },
  { title: 'Category title', icon: Fade, submenus: SUB_LINKS },
  { title: 'Link', icon: Fade, submenus: [] },
  { title: 'Link', icon: Fade, submenus: [] },
];

// The templates only render an icon when there is one; the cast is needed
// because MenuItem/SubMenu declare `icon` as required.
const MENU_ITEMS_WITHOUT_ICONS = MENU_ITEMS.map((item) => ({
  ...item,
  icon: undefined,
  submenus: item.submenus.map((sub) => ({ ...sub, icon: undefined })),
})) as unknown as MenuItem[];

const CURRENT = MENU_ITEMS[3]!;
const CURRENT_WITHOUT_ICONS = MENU_ITEMS_WITHOUT_ICONS[3]!;
const NO_ITEMS: MenuItem[] = [];
const HOME: MenuItem = { title: 'Home', icon: Fade, submenus: [] };
const noop = () => {};

const frame = (height: string) =>
  htmlSafe(
    `position: relative; height: ${height}; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);`,
  );
const FRAME = frame('26rem');
const SMALL_FRAME = frame('14rem');

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/UI Shell',
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
  decorators: [
    (Story, context) => <template>
      <div style={{FRAME}}>
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
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
  name: 'Header with Navigation, Actions and SideNav',
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

export const FixedSideNav = meta.story({
  name: 'Fixed Side Nav',
  render: () => <template>
    <UIShell>
      <:shell as |s|>
        <s.Sidenav
          @open={{true}}
          @menuItems={{MENU_ITEMS_WITHOUT_ICONS}}
          @currentMenu={{CURRENT_WITHOUT_ICONS}}
          @transitionTo={{noop}}
        />
      </:shell>
      <:content></:content>
    </UIShell>
  </template>,
});

export const FixedSideNavWIcons = meta.story({
  name: 'Fixed Side Nav with Icons',
  render: () => <template>
    <UIShell>
      <:shell as |s|>
        <s.Sidenav
          @open={{true}}
          @menuItems={{MENU_ITEMS}}
          @currentMenu={{CURRENT}}
          @transitionTo={{noop}}
        />
      </:shell>
      <:content></:content>
    </UIShell>
  </template>,
});

// The Sidenav block yields a Divider to separate groups of items.
export const FixedSideNavWDivider = meta.story({
  name: 'Fixed Side Nav with Divider',
  render: () => <template>
    <UIShell>
      <:shell as |s|>
        <s.Sidenav
          @open={{true}}
          @menuItems={{NO_ITEMS}}
          @currentMenu={{HOME}}
          @transitionTo={{noop}}
        >
          <:default as |Menu Divider|>
            <Menu
              @title="Category title"
              @icon={{Fade}}
              @isCurrent={{false}}
              @submenus={{SUB_LINKS}}
              @transitionTo={{noop}}
              as |Sub|
            >
              {{#each SUB_LINKS as |link|}}
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
              @title="Link"
              @icon={{Fade}}
              @isCurrent={{true}}
              @submenus={{NO_ITEMS}}
              @transitionTo={{noop}}
            />
            <Menu
              @title="Link"
              @icon={{Fade}}
              @isCurrent={{false}}
              @submenus={{NO_ITEMS}}
              @transitionTo={{noop}}
            />
          </:default>
        </s.Sidenav>
      </:shell>
      <:content></:content>
    </UIShell>
  </template>,
});

// The docs-app overview: header with navigation and global actions, and a
// side nav composed through its block, with a divider and a footer toggle.
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
export const SideNavHeaderAndDetails = meta.story({
  name: 'Side nav header, details and mirrored header items',
  render: () => <template>
    <UIShell>
      <:shell as |s|>
        <s.Sidenav
          @open={{true}}
          @menuItems={{NO_ITEMS}}
          @currentMenu={{HOME}}
          @transitionTo={{noop}}
        >
          <:default
            as |_Menu _Divider SideNavHeader SideNavDetails _SideNavIcon HeaderSideNavItems|
          >
            <SideNavHeader @icon={{UserAvatar}}>IBM</SideNavHeader>
            <SideNavDetails @title="Account">
              <p>jane.doe@example.com</p>
            </SideNavDetails>
            <HeaderSideNavItems @hasDivider={{true}}>
              <li>Mirrored link 1</li>
              <li>Mirrored link 2</li>
            </HeaderSideNavItems>
          </:default>
        </s.Sidenav>
      </:shell>
      <:content></:content>
    </UIShell>
  </template>,
});

// HeaderContainer manages the side nav's expanded state (and collapses it on
// Escape), yielding `isSideNavExpanded` and `onClickSideNavExpand`.
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

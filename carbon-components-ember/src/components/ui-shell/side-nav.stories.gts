import { fn } from 'storybook/test';

import {
  SUB_LINKS,
  MENU_ITEMS,
  MENU_ITEMS_WITHOUT_ICONS,
  CURRENT,
  CURRENT_WITHOUT_ICONS,
  NO_ITEMS,
  HOME,
  noop,
  withShellFrame,
} from '#storybook/fixtures/ui-shell.gts';
import preview from '#storybook/preview.ts';
import UIShell from '../ui-shell.gts';
import Fade from '../icons/fade.ts';
import UserAvatar from '../icons/user-avatar.ts';

import type { StoryArgs } from '#storybook/fixtures/ui-shell.gts';

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/UI Shell/SideNav',
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

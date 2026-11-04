import { expect, fn as spy, waitFor } from 'storybook/test';

import {
  StoryContent,
  headerArgs,
  sideNavArgs,
  withShellFrame,
} from '#storybook/fixtures/ui-shell.gts';
import preview from '#storybook/preview.ts';
import Header from './header.gts';
import HeaderContainer from './header-container.gts';
import HeaderGlobalAction from './header-global-action.gts';
import HeaderGlobalBar from './header-global-bar.gts';
import HeaderMenu from './header-menu.gts';
import HeaderMenuButton from './header-menu-button.gts';
import HeaderMenuItem from './header-menu-item.gts';
import HeaderName from './header-name.gts';
import HeaderNavigation from './header-navigation.gts';
import HeaderSideNavItems from './header-side-nav-items.gts';
import SideNav from './side-nav.gts';
import SideNavDetails from './side-nav-details.gts';
import SideNavDivider from './side-nav-divider.gts';
import SideNavFooter from './side-nav-footer.gts';
import SideNavHeader from './side-nav-header.gts';
import SideNavSwitcher from './side-nav-switcher.gts';
import SkipToContent from './skip-to-content.gts';
import Fade from '../icons/fade.ts';
import Notification from '../icons/notification.ts';
import Search from '../icons/search.ts';
import SwitcherIcon from '../icons/switcher.ts';
import UserAvatar from '../icons/user-avatar.ts';

import type { StoryArgs } from '#storybook/fixtures/ui-shell.gts';

// Carbon React's SideNav stories, and an Ember-only one for the parts they
// don't show: SideNavHeader, SideNavDetails, SideNavSwitcher and
// SideNavFooter.

type SideNavStoryArgs = StoryArgs & {
  expanded: boolean;
  isRail?: boolean;
  isFixedNav?: boolean;
  enterDelayMs?: number;
};

const meta = preview.type<{ args: SideNavStoryArgs }>().meta({
  title: 'Components/UI Shell/SideNav',
  component: SideNav,
  parameters: {
    docs: {
      description: {
        component:
          "The UI Shell's `SideNav` is the application's side navigation, in the `Header` or beside it, built from Carbon React's parts, each imported from `carbon-components-ember/components`. It yields `SideNavItems`, which yields `SideNavLink` and `SideNavMenu`: they follow whether the side nav is open, and leave the tab order while it's closed. A `SideNavMenu` yields its `SideNavMenuItem`. `SideNavDivider`, `SideNavItem` and `HeaderSideNavItems` (the header's links, for small screens) go in `SideNavItems` too, and `SideNavHeader`, `SideNavDetails`, `SideNavSwitcher` and `SideNavFooter` in the side nav.\n\n`@isFixedNav` keeps it beside the content, `@isRail` shows only its icons until the pointer or focus opens it, and `@large` makes an item taller. Links take `@href`, or one of the app's routes with `@route` (plus `@models` and `@query`), which marks the link to the current route as current, and the menu holding it while it's closed; `@as` renders another element, such as a `button`.",
      },
    },
  },
  args: {
    ...headerArgs,
    ...sideNavArgs,
    expanded: true,
    onAction: spy(),
  },
  decorators: [withShellFrame],
});

export const FixedSideNav = meta.story({
  name: 'Fixed Side Nav',
  render: (args: SideNavStoryArgs) => <template>
    <Header aria-label={{args.headerAriaLabel}}>
      <SkipToContent />
      <HeaderName @href="#" @prefix={{args.platformPrefix}}>
        {{args.platformName}}
      </HeaderName>
    </Header>
    <SideNav
      @isFixedNav={{true}}
      @expanded={{args.expanded}}
      @isChildOfHeader={{false}}
      aria-label={{args.sideNavAriaLabel}}
      as |SideNavItems|
    >
      <SideNavItems as |SideNavLink SideNavMenu|>
        <SideNavMenu @title="L0 menu" as |SideNavMenuItem|>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
        </SideNavMenu>
        <SideNavMenu @title="L0 menu" @isActive={{true}} as |SideNavMenuItem|>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
          <SideNavMenuItem
            aria-current="page"
            @href="https://www.carbondesignsystem.com/"
          >
            L0 menu item
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
        </SideNavMenu>
        <SideNavMenu @title="L0 menu" as |SideNavMenuItem|>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
        </SideNavMenu>
        <SideNavLink @href="https://www.carbondesignsystem.com/">
          L0 link
        </SideNavLink>
        <SideNavLink @href="https://www.carbondesignsystem.com/">
          L0 link
        </SideNavLink>
      </SideNavItems>
    </SideNav>
    <StoryContent @useResponsiveOffset={{false}} />
  </template>,
});

FixedSideNav.test(
  'an open side nav keeps its links in the tab order',
  async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Side navigation' });
    await expect(nav).toHaveClass('cds--side-nav--expanded');
    await expect(nav).not.toHaveAttribute('inert');
    const links = canvas.getAllByRole('link', { name: 'L0 link' });
    await expect(links[0]).toHaveAttribute('tabindex', '0');
  },
);

export const FixedSideNavWIcons = meta.story({
  name: 'Fixed Side Nav with Icons',
  render: (args: SideNavStoryArgs) => <template>
    <Header aria-label={{args.headerAriaLabel}}>
      <SkipToContent />
      <HeaderName @href="#" @prefix={{args.platformPrefix}}>
        {{args.platformName}}
      </HeaderName>
    </Header>
    <SideNav
      @isFixedNav={{true}}
      @expanded={{args.expanded}}
      @isChildOfHeader={{false}}
      aria-label={{args.sideNavAriaLabel}}
      as |SideNavItems|
    >
      <SideNavItems as |SideNavLink SideNavMenu|>
        <SideNavMenu
          @renderIcon={{Fade}}
          @title="Category title"
          as |SideNavMenuItem|
        >
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Link
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Link
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Link
          </SideNavMenuItem>
        </SideNavMenu>
        <SideNavMenu
          @renderIcon={{Fade}}
          @title="Category title"
          @isActive={{true}}
          as |SideNavMenuItem|
        >
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Link
          </SideNavMenuItem>
          <SideNavMenuItem
            aria-current="page"
            @href="https://www.carbondesignsystem.com/"
          >
            Link
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Link
          </SideNavMenuItem>
        </SideNavMenu>
        <SideNavMenu
          @renderIcon={{Fade}}
          @title="Category title"
          as |SideNavMenuItem|
        >
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Link
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Link
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Link
          </SideNavMenuItem>
        </SideNavMenu>
        <SideNavLink
          @renderIcon={{Fade}}
          @href="https://www.carbondesignsystem.com/"
        >
          Link
        </SideNavLink>
        <SideNavLink
          @renderIcon={{Fade}}
          @href="https://www.carbondesignsystem.com/"
        >
          Link
        </SideNavLink>
      </SideNavItems>
    </SideNav>
    <StoryContent @useResponsiveOffset={{false}} />
  </template>,
});

export const FixedSideNavWDivider = meta.story({
  name: 'Fixed Side Nav with Divider',
  render: (args: SideNavStoryArgs) => <template>
    <Header aria-label={{args.headerAriaLabel}}>
      <SkipToContent />
      <HeaderName @href="#" @prefix={{args.platformPrefix}}>
        {{args.platformName}}
      </HeaderName>
    </Header>
    <SideNav
      @isFixedNav={{true}}
      @expanded={{args.expanded}}
      @isChildOfHeader={{false}}
      aria-label={{args.sideNavAriaLabel}}
      as |SideNavItems|
    >
      <SideNavItems as |SideNavLink SideNavMenu|>
        <SideNavMenu @title="L0 menu" as |SideNavMenuItem|>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
        </SideNavMenu>
        <SideNavMenu @title="L0 menu" @isActive={{true}} as |SideNavMenuItem|>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
          <SideNavMenuItem
            aria-current="page"
            @href="https://www.carbondesignsystem.com/"
          >
            L0 menu item
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
        </SideNavMenu>
        <SideNavMenu @title="L0 menu" as |SideNavMenuItem|>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            L0 menu item
          </SideNavMenuItem>
        </SideNavMenu>
        <SideNavDivider />
        <SideNavLink @href="https://www.carbondesignsystem.com/">
          L0 link
        </SideNavLink>
        <SideNavLink @href="https://www.carbondesignsystem.com/">
          L0 link
        </SideNavLink>
      </SideNavItems>
    </SideNav>
    <StoryContent @useResponsiveOffset={{false}} />
  </template>,
});

export const FixedSideNavWMixedLinksAndButtons = meta.story({
  name: 'Fixed Side Nav with Mixed Buttons and Links',
  render: (args: SideNavStoryArgs) => <template>
    <Header aria-label={{args.headerAriaLabel}}>
      <SkipToContent />
      <HeaderName @href="/" @prefix={{args.platformPrefix}}>
        {{args.platformName}}
      </HeaderName>
    </Header>
    <SideNav
      @isFixedNav={{true}}
      @expanded={{args.expanded}}
      @isChildOfHeader={{false}}
      aria-label={{args.sideNavAriaLabel}}
      as |SideNavItems|
    >
      <SideNavItems as |SideNavLink SideNavMenu|>
        <SideNavLink @href="https://www.carbondesignsystem.com/">
          Overview
        </SideNavLink>
        <SideNavLink @as="button" type="button" {{on "click" args.onAction}}>
          Release notes
        </SideNavLink>
        <SideNavMenu @title="Resources" as |SideNavMenuItem|>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Documentation
          </SideNavMenuItem>
          <SideNavMenuItem
            @as="button"
            type="button"
            {{on "click" args.onAction}}
          >
            Version details
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Support
          </SideNavMenuItem>
        </SideNavMenu>
        <SideNavDivider />
        <SideNavLink
          @href="https://www.carbondesignsystem.com/"
          @isActive={{true}}
        >
          Settings
        </SideNavLink>
        <SideNavLink @as="button" type="button" {{on "click" args.onAction}}>
          Send feedback
        </SideNavLink>
      </SideNavItems>
    </SideNav>
    <StoryContent @useResponsiveOffset={{false}} />
  </template>,
});

FixedSideNavWMixedLinksAndButtons.test(
  'a side nav item can be a button',
  async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Release notes' });
    await expect(button).toHaveClass('cds--side-nav__link');
    await userEvent.click(button);
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
);

export const SideNavRailWHeader = meta.story({
  name: 'Side Nav Rail with Header',
  args: {
    enterDelayMs: 100,
    isFixedNav: false,
    isRail: true,
  },
  render: (args: SideNavStoryArgs) => <template>
    <HeaderContainer as |container|>
      <Header aria-label={{args.headerAriaLabel}}>
        <SkipToContent />
        <HeaderMenuButton
          @ariaLabel={{if container.isSideNavExpanded "Close menu" "Open menu"}}
          @isActive={{container.isSideNavExpanded}}
          aria-expanded={{if container.isSideNavExpanded "true" "false"}}
          {{on "click" container.onClickSideNavExpand}}
        />
        <HeaderName @href="#" @prefix={{args.platformPrefix}}>
          {{args.platformName}}
        </HeaderName>
        <HeaderNavigation aria-label={{args.headerAriaLabel}}>
          <HeaderMenuItem @href="#">Link 1</HeaderMenuItem>
          <HeaderMenuItem @href="#">Link 2</HeaderMenuItem>
          <HeaderMenuItem @href="#">Link 3</HeaderMenuItem>
          <HeaderMenu
            @ariaLabel="Link 4"
            @menuLinkName="Link 4"
            as |HeaderMenuItem|
          >
            <HeaderMenuItem @href="#">Sub-link 1</HeaderMenuItem>
            <HeaderMenuItem @href="#">Sub-link 2</HeaderMenuItem>
            <HeaderMenuItem @href="#">Sub-link 3</HeaderMenuItem>
          </HeaderMenu>
        </HeaderNavigation>
        <HeaderGlobalBar>
          <HeaderGlobalAction @ariaLabel="Search" {{on "click" args.onAction}}>
            <Search @size={{20}} />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            @ariaLabel="Notifications"
            {{on "click" args.onAction}}
          >
            <Notification @size={{20}} />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            @ariaLabel="App Switcher"
            @tooltipAlignment="end"
            {{on "click" args.onAction}}
          >
            <SwitcherIcon @size={{20}} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
        <SideNav
          aria-label={{args.sideNavAriaLabel}}
          @expanded={{container.isSideNavExpanded}}
          @onOverlayClick={{container.onClickSideNavExpand}}
          @href="#main-content"
          @onSideNavBlur={{container.onClickSideNavExpand}}
          @isRail={{args.isRail}}
          @isFixedNav={{args.isFixedNav}}
          @enterDelayMs={{args.enterDelayMs}}
          as |SideNavItems|
        >
          <SideNavItems as |SideNavLink SideNavMenu|>
            {{#if container.isSideNavExpanded}}
              <HeaderSideNavItems @hasDivider={{true}}>
                <HeaderMenuItem @href="#">Link 1</HeaderMenuItem>
                <HeaderMenuItem @href="#">Link 2</HeaderMenuItem>
                <HeaderMenuItem @href="#">Link 3</HeaderMenuItem>
                <HeaderMenu
                  @ariaLabel="Link 4"
                  @menuLinkName="Link 4"
                  as |HeaderMenuItem|
                >
                  <HeaderMenuItem @href="#">Sub-link 1</HeaderMenuItem>
                  <HeaderMenuItem @href="#">Sub-link 2</HeaderMenuItem>
                  <HeaderMenuItem @href="#">Sub-link 3</HeaderMenuItem>
                </HeaderMenu>
              </HeaderSideNavItems>
            {{/if}}
            <SideNavMenu
              @renderIcon={{Fade}}
              @title="Category title"
              as |SideNavMenuItem|
            >
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link
              </SideNavMenuItem>
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link
              </SideNavMenuItem>
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link
              </SideNavMenuItem>
            </SideNavMenu>
            <SideNavMenu
              @renderIcon={{Fade}}
              @title="Category title"
              as |SideNavMenuItem|
            >
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link
              </SideNavMenuItem>
              <SideNavMenuItem
                aria-current="page"
                @href="https://www.carbondesignsystem.com/"
              >
                Link
              </SideNavMenuItem>
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link
              </SideNavMenuItem>
            </SideNavMenu>
            <SideNavMenu
              @renderIcon={{Fade}}
              @title="Category title"
              as |SideNavMenuItem|
            >
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link
              </SideNavMenuItem>
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link
              </SideNavMenuItem>
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link
              </SideNavMenuItem>
            </SideNavMenu>
            <SideNavLink
              @renderIcon={{Fade}}
              @href="https://www.carbondesignsystem.com/"
            >
              Link
            </SideNavLink>
            <SideNavLink
              @renderIcon={{Fade}}
              @href="https://www.carbondesignsystem.com/"
            >
              Link
            </SideNavLink>
          </SideNavItems>
        </SideNav>
      </Header>
      <StoryContent />
    </HeaderContainer>
  </template>,
});

SideNavRailWHeader.test(
  'the rail opens while the pointer is over it',
  async ({ canvas, userEvent }) => {
    const nav = canvas.getByRole('navigation', { name: 'Side navigation' });
    await expect(nav).toHaveClass('cds--side-nav--rail');
    await expect(nav).not.toHaveClass('cds--side-nav--expanded');
    await userEvent.hover(nav);
    await waitFor(() => expect(nav).toHaveClass('cds--side-nav--expanded'));
    await userEvent.unhover(nav);
    await expect(nav).not.toHaveClass('cds--side-nav--expanded');
  },
);

export const SideNavWLargeSideNavItems = meta.story({
  name: 'Side Nav with Large Side Nav Items',
  render: (args: SideNavStoryArgs) => <template>
    <Header aria-label={{args.headerAriaLabel}}>
      <SkipToContent />
      <HeaderName @href="#" @prefix={{args.platformPrefix}}>
        {{args.platformName}}
      </HeaderName>
    </Header>
    <SideNav
      @expanded={{args.expanded}}
      @isChildOfHeader={{false}}
      aria-label={{args.sideNavAriaLabel}}
      as |SideNavItems|
    >
      <SideNavItems as |SideNavLink SideNavMenu|>
        <SideNavMenu @title="Large menu" @large={{true}} as |SideNavMenuItem|>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Menu 1
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Menu 2
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Menu 3
          </SideNavMenuItem>
        </SideNavMenu>
        <SideNavLink
          @href="https://www.carbondesignsystem.com/"
          @large={{true}}
        >
          Large link
        </SideNavLink>
        <SideNavMenu
          @renderIcon={{Fade}}
          @title="Large menu with icon"
          @large={{true}}
          as |SideNavMenuItem|
        >
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Menu 1
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Menu 2
          </SideNavMenuItem>
          <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
            Menu 3
          </SideNavMenuItem>
        </SideNavMenu>
        <SideNavLink
          @renderIcon={{Fade}}
          @href="https://www.carbondesignsystem.com/"
          @large={{true}}
        >
          Large link with icon
        </SideNavLink>
      </SideNavItems>
    </SideNav>
    <StoryContent />
  </template>,
});

const ACCOUNTS = ['Personal', 'Team', 'Organization'];

// Ember-only: the parts Carbon React's stories don't show. A fixed side nav
// is inert while collapsed, so here the footer only reports its clicks.
export const SideNavHeaderAndDetails = meta.story({
  name: 'Side Nav with Header, Details and Footer',
  render: (args: SideNavStoryArgs) => <template>
    <SideNav
      @isFixedNav={{true}}
      @expanded={{args.expanded}}
      @isChildOfHeader={{false}}
      aria-label={{args.sideNavAriaLabel}}
      as |SideNavItems|
    >
      <SideNavHeader @renderIcon={{UserAvatar}}>
        <SideNavDetails @title="Account">
          <SideNavSwitcher @labelText="Switch account" @options={{ACCOUNTS}} />
        </SideNavDetails>
      </SideNavHeader>
      <SideNavItems as |SideNavLink|>
        <SideNavLink @renderIcon={{Fade}} @href="#">Link</SideNavLink>
        <SideNavLink @renderIcon={{Fade}} @href="#">Link</SideNavLink>
      </SideNavItems>
      <SideNavFooter @expanded={{args.expanded}} @onToggle={{args.onAction}} />
    </SideNav>
    <StoryContent @useResponsiveOffset={{false}} />
  </template>,
});

SideNavHeaderAndDetails.test(
  'the switcher shows its label until an option is chosen, and the footer reports clicks',
  async ({ canvas, userEvent, args }) => {
    const select = canvas.getByRole('combobox', { name: 'Switch account' });
    await expect(select).toHaveValue('');
    await userEvent.selectOptions(select, 'Team');
    await expect(select).toHaveValue('Team');
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Toggle opening or closing the side navigation',
      }),
    );
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
);

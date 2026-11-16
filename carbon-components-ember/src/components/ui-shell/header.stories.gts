import { trackedObject } from '@ember/reactive/collections';
import { expect, fn as spy } from 'storybook/test';

import {
  StoryContent,
  headerArgs,
  navigationArgs,
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
import HeaderPanel from './header-panel.gts';
import HeaderSideNavItems from './header-side-nav-items.gts';
import SideNav from './side-nav.gts';
import SkipToContent from './skip-to-content.gts';
import SwitcherDivider from './switcher-divider.gts';
import Fade from '../icons/fade.ts';
import Notification from '../icons/notification.ts';
import Search from '../icons/search.ts';
import SwitcherIcon from '../icons/switcher.ts';

import type { StoryArgs } from '#storybook/fixtures/ui-shell.gts';

// Parity gaps with Carbon React's Header stories:
// - `Header with Actions and Right Panel`: no `badgeCount` on the
//   notifications action: no `IconButton` with a `badgeCount` yet (#454).

type HeaderStoryArgs = StoryArgs & {
  navigationAriaLabel: string;
  navigationMenuLabel: string;
};

const meta = preview.type<{ args: HeaderStoryArgs }>().meta({
  title: 'Components/UI Shell/Header',
  component: Header,
  parameters: {
    docs: {
      description: {
        component:
          "The UI Shell's `Header` is the application's top bar, built from Carbon React's parts, each imported from `carbon-components-ember/components`: `SkipToContent`, a `HeaderMenuButton` that opens the `SideNav` below `lg`, the `HeaderName`, `HeaderNavigation` with `HeaderMenuItem`s and `HeaderMenu`s, a `HeaderGlobalBar` of `HeaderGlobalAction`s, and a `HeaderPanel` they open. `HeaderContainer` yields `isSideNavExpanded` and `onClickSideNavExpand` for the menu button and the side nav, and the page goes in `Content`.\n\nA `HeaderMenu` yields its `HeaderMenuItem`, and a `HeaderPanel` yields a `Switcher`, which yields its `SwitcherItem`. The name and the items link to `@href`, or to one of the app's routes with `@route` (plus `@models` and `@query`), which marks the link to the current route as current, and the menu holding it while it's closed.",
      },
    },
  },
  args: {
    ...headerArgs,
    ...navigationArgs,
    ...sideNavArgs,
    onAction: spy(),
  },
  decorators: [withShellFrame],
});

export const HeaderWNavigation = meta.story({
  name: 'Header with Navigation',
  render: (args: HeaderStoryArgs) => <template>
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
        <HeaderNavigation aria-label={{args.navigationAriaLabel}}>
          <HeaderMenuItem @href="#">Link 1</HeaderMenuItem>
          <HeaderMenuItem @href="#">Link 2</HeaderMenuItem>
          <HeaderMenuItem @href="#">Link 3</HeaderMenuItem>
          <HeaderMenu
            @ariaLabel={{args.navigationMenuLabel}}
            @menuLinkName={{args.navigationMenuLabel}}
            as |HeaderMenuItem|
          >
            <HeaderMenuItem @href="#">Sub-link 1</HeaderMenuItem>
            <HeaderMenuItem @isActive={{true}} @href="#">Sub-link 2</HeaderMenuItem>
            <HeaderMenuItem @href="#">Sub-link 3</HeaderMenuItem>
          </HeaderMenu>
        </HeaderNavigation>
        <SideNav
          aria-label={{args.sideNavAriaLabel}}
          @expanded={{container.isSideNavExpanded}}
          @isPersistent={{false}}
          @onSideNavBlur={{container.onClickSideNavExpand}}
          as |SideNavItems|
        >
          <SideNavItems>
            <HeaderSideNavItems>
              <HeaderMenuItem @href="#">Link 1</HeaderMenuItem>
              <HeaderMenuItem @href="#">Link 2</HeaderMenuItem>
              <HeaderMenuItem @href="#">Link 3</HeaderMenuItem>
              <HeaderMenu
                @ariaLabel={{args.navigationMenuLabel}}
                @menuLinkName={{args.navigationMenuLabel}}
                as |HeaderMenuItem|
              >
                <HeaderMenuItem @href="#">Sub-link 1</HeaderMenuItem>
                <HeaderMenuItem @isActive={{true}} @href="#">Sub-link 2</HeaderMenuItem>
                <HeaderMenuItem @href="#">Sub-link 3</HeaderMenuItem>
              </HeaderMenu>
            </HeaderSideNavItems>
          </SideNavItems>
        </SideNav>
      </Header>
      <StoryContent />
    </HeaderContainer>
  </template>,
});

HeaderWNavigation.test(
  'a header menu opens, and shows its current item while closed',
  async ({ canvas, canvasElement, userEvent }) => {
    // The menu's button is an `href="#"` link; keep the test page in place.
    canvasElement.addEventListener('click', (e) => e.preventDefault());
    const nav = canvas.getByRole('navigation', { name: 'IBM [Platform]' });
    const menu = nav.querySelector('.cds--header__menu-title')!;
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toHaveClass('cds--header__menu-item--current');
    await userEvent.click(menu);
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).not.toHaveClass('cds--header__menu-item--current');
    await userEvent.keyboard('{Escape}');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toHaveFocus();
  },
);

export const HeaderWNavigationAndActions = meta.story({
  name: 'Header with Navigation and Actions',
  render: (args: HeaderStoryArgs) => <template>
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
        <HeaderNavigation aria-label={{args.navigationAriaLabel}}>
          <HeaderMenuItem @href="#">Link 1</HeaderMenuItem>
          <HeaderMenuItem @href="#">Link 2</HeaderMenuItem>
          <HeaderMenuItem @href="#">Link 3</HeaderMenuItem>
          <HeaderMenu
            @isActive={{true}}
            @ariaLabel={{args.navigationMenuLabel}}
            @menuLinkName={{args.navigationMenuLabel}}
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
          @isPersistent={{false}}
          @onSideNavBlur={{container.onClickSideNavExpand}}
          as |SideNavItems|
        >
          <SideNavItems>
            <HeaderSideNavItems>
              <HeaderMenuItem @href="#">Link 1</HeaderMenuItem>
              <HeaderMenuItem @href="#">Link 2</HeaderMenuItem>
              <HeaderMenuItem @href="#">Link 3</HeaderMenuItem>
              <HeaderMenu
                @ariaLabel={{args.navigationMenuLabel}}
                @menuLinkName={{args.navigationMenuLabel}}
                as |HeaderMenuItem|
              >
                <HeaderMenuItem @href="#">Sub-link 1</HeaderMenuItem>
                <HeaderMenuItem @href="#">Sub-link 2</HeaderMenuItem>
                <HeaderMenuItem @href="#">Sub-link 3</HeaderMenuItem>
              </HeaderMenu>
            </HeaderSideNavItems>
          </SideNavItems>
        </SideNav>
      </Header>
      <StoryContent />
    </HeaderContainer>
  </template>,
});

HeaderWNavigationAndActions.test(
  'a global action is a button named by its tooltip',
  async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button', { name: 'Notifications' });
    await expect(button).toHaveClass('cds--header__action');
    await userEvent.click(button);
    await expect(args.onAction).toHaveBeenCalledOnce();
  },
);

export const HeaderWNavigationActionsAndSideNav = meta.story({
  name: 'Header with Navigation, Actions and Side Nav',
  render: (args: HeaderStoryArgs) => <template>
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
        <HeaderNavigation aria-label={{args.navigationAriaLabel}}>
          <HeaderMenuItem @href="#">Link 1</HeaderMenuItem>
          <HeaderMenuItem @href="#">Link 2</HeaderMenuItem>
          <HeaderMenuItem @href="#">Link 3</HeaderMenuItem>
          <HeaderMenu
            @ariaLabel={{args.navigationMenuLabel}}
            @menuLinkName={{args.navigationMenuLabel}}
            as |HeaderMenuItem|
          >
            <HeaderMenuItem @href="#one">Sub-link 1</HeaderMenuItem>
            <HeaderMenuItem @href="#two">Sub-link 2</HeaderMenuItem>
            <HeaderMenuItem @href="#three">Sub-link 3</HeaderMenuItem>
          </HeaderMenu>
        </HeaderNavigation>
        <HeaderGlobalBar>
          <HeaderGlobalAction
            @ariaLabel="Search"
            @tooltipAlignment="start"
            {{on "click" args.onAction}}
          >
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
          @onSideNavBlur={{container.onClickSideNavExpand}}
          @href="#main-content"
          as |SideNavItems|
        >
          <SideNavItems as |SideNavLink SideNavMenu|>
            <HeaderSideNavItems @hasDivider={{true}}>
              <HeaderMenuItem @href="#">Link 1</HeaderMenuItem>
              <HeaderMenuItem @href="#">Link 2</HeaderMenuItem>
              <HeaderMenuItem @href="#">Link 3</HeaderMenuItem>
              <HeaderMenu
                @ariaLabel={{args.navigationMenuLabel}}
                @menuLinkName={{args.navigationMenuLabel}}
                as |HeaderMenuItem|
              >
                <HeaderMenuItem @href="#">Sub-link 1</HeaderMenuItem>
                <HeaderMenuItem @href="#">Sub-link 2</HeaderMenuItem>
                <HeaderMenuItem @href="#">Sub-link 3</HeaderMenuItem>
              </HeaderMenu>
            </HeaderSideNavItems>
            <SideNavMenu
              @renderIcon={{Fade}}
              @title="Category title"
              @tabIndex={{0}}
              as |SideNavMenuItem|
            >
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link 5
              </SideNavMenuItem>
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link 6
              </SideNavMenuItem>
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link 7
              </SideNavMenuItem>
            </SideNavMenu>
            <SideNavMenu
              @renderIcon={{Fade}}
              @title="Category title"
              @tabIndex={{0}}
              as |SideNavMenuItem|
            >
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link 8
              </SideNavMenuItem>
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link 9
              </SideNavMenuItem>
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link 10
              </SideNavMenuItem>
            </SideNavMenu>
            <SideNavMenu
              @renderIcon={{Fade}}
              @title="Category title"
              @isActive={{true}}
              @tabIndex={{0}}
              as |SideNavMenuItem|
            >
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link 11
              </SideNavMenuItem>
              <SideNavMenuItem
                aria-current="page"
                @href="https://www.carbondesignsystem.com/"
              >
                Link 12
              </SideNavMenuItem>
              <SideNavMenuItem @href="https://www.carbondesignsystem.com/">
                Link 13
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

export const HeaderWSideNav = meta.story({
  name: 'Header with Side Nav',
  render: (args: HeaderStoryArgs) => <template>
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
        <SideNav
          aria-label={{args.sideNavAriaLabel}}
          @expanded={{container.isSideNavExpanded}}
          @onSideNavBlur={{container.onClickSideNavExpand}}
          @href="#main-content"
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
      </Header>
      <StoryContent />
    </HeaderContainer>
  </template>,
});

export const HeaderWActionsAndRightPanel = meta.story({
  name: 'Header with Actions and Right Panel',
  render: (args: HeaderStoryArgs) => {
    const state = trackedObject({ expanded: false });
    const toggle = () => (state.expanded = !state.expanded);
    const close = () => (state.expanded = false);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    return <template>
      <Header aria-label={{args.headerAriaLabel}}>
        <HeaderName @href="#" @prefix={{args.platformPrefix}}>
          {{args.platformName}}
        </HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction @ariaLabel="Search" {{on "click" args.onAction}}>
            <Search @size={{20}} />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            @ariaLabel="Notifications"
            @isActive={{state.expanded}}
            @tooltipAlignment="center"
            id="notification-button"
            {{on "click" toggle}}
            {{on "blur" close}}
            {{on "keydown" closeOnEscape}}
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
        <HeaderPanel
          @expanded={{state.expanded}}
          @href="#notification-button"
          data-test-header-panel
        />
      </Header>
      <StoryContent />
    </template>;
  },
});

HeaderWActionsAndRightPanel.test(
  'a global action opens the header panel',
  async ({ canvas, canvasElement, userEvent }) => {
    const panel = canvasElement.querySelector('[data-test-header-panel]')!;
    const button = canvas.getByRole('button', { name: 'Notifications' });
    await expect(panel).not.toHaveClass('cds--header-panel--expanded');
    await userEvent.click(button);
    await expect(panel).toHaveClass('cds--header-panel--expanded');
    await expect(button).toHaveClass('cds--header__action--active');
    await userEvent.click(button);
    await expect(panel).not.toHaveClass('cds--header-panel--expanded');
  },
);

export const HeaderWActionsAndSwitcher = meta.story({
  name: 'Header with Actions and Switcher',
  render: (args: HeaderStoryArgs) => <template>
    <HeaderContainer as |container|>
      <Header aria-label={{args.headerAriaLabel}}>
        <HeaderName @href="#" @prefix={{args.platformPrefix}}>
          {{args.platformName}}
        </HeaderName>
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
            @ariaLabel={{if
              container.isSideNavExpanded
              "Close switcher"
              "Open switcher"
            }}
            @isActive={{container.isSideNavExpanded}}
            @tooltipAlignment="end"
            aria-expanded={{if container.isSideNavExpanded "true" "false"}}
            id="switcher-button"
            {{on "click" container.onClickSideNavExpand}}
          >
            <SwitcherIcon @size={{20}} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
        <HeaderPanel
          @expanded={{container.isSideNavExpanded}}
          @onHeaderPanelFocus={{container.onClickSideNavExpand}}
          @href="#switcher-button"
          as |Switcher|
        >
          <Switcher
            aria-label="Switcher Container"
            @expanded={{container.isSideNavExpanded}}
            as |SwitcherItem|
          >
            <SwitcherItem aria-label="Link 1" @href="#">Link 1</SwitcherItem>
            <SwitcherDivider />
            <SwitcherItem @href="#" aria-label="Link 2">Link 2</SwitcherItem>
            <SwitcherItem @href="#" aria-label="Link 3">Link 3</SwitcherItem>
            <SwitcherItem @href="#" aria-label="Link 4">Link 4</SwitcherItem>
            <SwitcherItem @href="#" aria-label="Link 5">Link 5</SwitcherItem>
            <SwitcherDivider />
            <SwitcherItem @href="#" aria-label="Link 6">Link 6</SwitcherItem>
          </Switcher>
        </HeaderPanel>
      </Header>
      <StoryContent />
    </HeaderContainer>
  </template>,
});

HeaderWActionsAndSwitcher.test(
  'the switcher opens, its arrow keys move between items, and a click outside closes it',
  async ({ canvas, canvasElement, userEvent }) => {
    const panel = canvasElement.querySelector('.cds--header-panel')!;
    await userEvent.click(
      canvas.getByRole('button', { name: 'Open switcher' }),
    );
    await expect(panel).toHaveClass('cds--header-panel--expanded');

    const first = canvas.getByRole('link', { name: 'Link 1' });
    await expect(first).toHaveAttribute('tabindex', '0');
    first.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('link', { name: 'Link 2' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    await expect(canvas.getByRole('link', { name: 'Link 6' })).toHaveFocus();

    await userEvent.click(canvasElement.querySelector('.cds--content')!);
    await expect(panel).not.toHaveClass('cds--header-panel--expanded');
  },
);

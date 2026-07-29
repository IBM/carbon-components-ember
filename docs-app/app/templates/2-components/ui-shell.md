<ThemeSwitcher />

# UI Shell

The UI Shell is the structural framework of an application that houses
navigational elements and page content, so users can move through an
application consistently and predictably. It composes a `Header` (top bar
with the product name, navigation, and global actions), an optional `Nav`
(top-level navigation links), a `Sidenav` (left-hand navigation panel), and
the page `content` region.

```gjs live preview
import { array } from '@ember/helper';
import { UIShell } from 'carbon-components-ember/components';
import { Notification, UserAvatar } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const sideNavOpen = cell(true);
const onToggle = (value) => (sideNavOpen.current = value);
const noop = () => {};
const subLinks = [{ title: 'Sub-link 1' }, { title: 'Sub-link 2' }];

<template>
  <ThemeSupport />
  {{! The wrapper's transform makes it the containing block for the
      shell's fixed-position header and side nav, so the preview stays
      inside this box instead of overlaying the whole page. }}
  <div
    style='position: relative; height: 26rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
  >
    <UIShell>
      <:shell as |s|>
        <s.Header @title='IBM' @subtitle='Platform' @open={{sideNavOpen.current}} @onToggle={{onToggle}}>
          <:header>
            <s.Nav as |Item|>
              <Item>Link 1</Item>
              <Item>Link 2</Item>
              <Item>Link 3</Item>
            </s.Nav>
          </:header>
          <:headerGlobal as |GlobalAction|>
            <GlobalAction @aria-label='Notifications' @icon={{Notification}} @onClick={{noop}} />
            <GlobalAction @aria-label='User Avatar' @icon={{UserAvatar}} @onClick={{noop}} />
          </:headerGlobal>
        </s.Header>
        <s.Sidenav @open={{sideNavOpen.current}}>
          <:default as |Menu Divider|>
            <Menu @title='Category 1' @submenus={{subLinks}} as |Sub|>
              {{#each subLinks as |link|}}
                <Sub @title={{link.title}} @transitionTo={{noop}} />
              {{/each}}
            </Menu>
            <Divider />
            <Menu @title='Category 2' @isCurrent={{false}} @transitionTo={{noop}} @submenus={{array}} />
          </:default>
          <:footer as |Footer|>
            <Footer @open={{sideNavOpen.current}} @onToggle={{onToggle}} />
          </:footer>
        </s.Sidenav>
      </:shell>
      <:content>
        <p>Page content</p>
      </:content>
    </UIShell>
  </div>
</template>
```

## Global header actions

Pass action buttons (search, notifications, user profile, app switcher, ...)
into the `headerGlobal` named block; each one is yielded a `GlobalAction`
component that renders an icon button in the header's global action bar.

## Side navigation dividers and footer

The `Sidenav` block yields a `Divider` component to separate groups of
navigation items, and a `footer` named block that yields a `Footer` toggle
control for expanding/collapsing the rail — wire both to the same
`@open`/`@onToggle` state used by the `Header`'s menu button.

## Header dropdown menus

The `Nav` block yields a second component, `Menu` (`HeaderMenu`), for
top-level items that expand to show a list of `HeaderMenuItem`s.

```gjs live preview
import { UIShell } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div
    style='position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
  >
    <UIShell>
      <:shell as |s|>
        <s.Header @title='IBM' @subtitle='Platform'>
          <:header>
            <s.Nav as |Item Menu|>
              <Item>Link 1</Item>
              <Menu @menuLinkName='Link 2' as |MenuItem|>
                <MenuItem @isActive={{true}}>Sub-link 1</MenuItem>
                <MenuItem>Sub-link 2</MenuItem>
              </Menu>
            </s.Nav>
          </:header>
        </s.Header>
      </:shell>
      <:content></:content>
    </UIShell>
  </div>
</template>
```

## Header panel and switcher

`Header` yields a `HeaderPanel` component into the `headerPanel` named
block for building panels such as an application switcher — toggle its
`@expanded` argument from a `GlobalAction`'s `onClick`. The top-level
`UIShell` yields a `Switcher` component (with `Item` and `Divider`) for
rendering the switcher's contents.

```gjs live preview
import { UIShell } from 'carbon-components-ember/components';
import { UserAvatar } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const switcherOpen = cell(false);
const toggleSwitcher = () => (switcherOpen.current = !switcherOpen.current);

<template>
  <ThemeSupport />
  <div
    style='position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
  >
    <UIShell>
      <:shell as |s|>
        <s.Header @title='IBM' @subtitle='Platform'>
          <:headerGlobal as |GlobalAction|>
            <GlobalAction
              @aria-label='App switcher'
              @icon={{UserAvatar}}
              @onClick={{toggleSwitcher}}
            />
          </:headerGlobal>
          <:headerPanel as |HeaderPanel|>
            <HeaderPanel @expanded={{switcherOpen.current}} @onToggle={{toggleSwitcher}}>
              <s.Switcher @aria-label='App switcher' as |Item Divider|>
                <Item @isSelected={{true}}>App 1</Item>
                <Item>App 2</Item>
                <Divider />
                <Item>App 3</Item>
              </s.Switcher>
            </HeaderPanel>
          </:headerPanel>
        </s.Header>
      </:shell>
      <:content></:content>
    </UIShell>
  </div>
</template>
```

## Side navigation header, details, and mirrored header items

The `Sidenav` block also yields `SideNavHeader` (an icon + heading for the
rail), `SideNavDetails` (a titled block, useful for account info), and
`HeaderSideNavItems` (mirrors top `Header` nav items into the rail for
smaller viewports).

```gjs live preview
import { UIShell } from 'carbon-components-ember/components';
import { UserAvatar } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div
    style='position: relative; height: 20rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
  >
    <UIShell>
      <:shell as |s|>
        <s.Sidenav @open={{true}}>
          <:default as |_Menu _Divider SideNavHeader SideNavDetails _SideNavIcon HeaderSideNavItems|>
            <SideNavHeader @icon={{UserAvatar}}>IBM</SideNavHeader>
            <SideNavDetails @title='Account'>
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
  </div>
</template>
```

## HeaderContainer

`HeaderContainer` (yielded from the top-level `shell` block) manages the
`isSideNavExpanded` state for you and collapses it when the user presses
<kbd>Escape</kbd>, so you don't have to keep your own `@open`/`@onToggle`
cell. It yields `isSideNavExpanded` and `onClickSideNavExpand` for wiring up
the `Header`'s menu toggle and the `Sidenav`'s `@open` argument.

```gjs live preview
import { UIShell } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div
    style='position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
  >
    <UIShell>
      <:shell as |s|>
        <s.HeaderContainer as |c|>
          <s.Header
            @title='IBM'
            @subtitle='Platform'
            @open={{c.isSideNavExpanded}}
            @onToggle={{c.onClickSideNavExpand}}
          />
          <s.Sidenav @open={{c.isSideNavExpanded}} />
        </s.HeaderContainer>
      </:shell>
      <:content></:content>
    </UIShell>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>UIShell</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ui-shell'
    @name='default'
  />
</template>
```
</details>

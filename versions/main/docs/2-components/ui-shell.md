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

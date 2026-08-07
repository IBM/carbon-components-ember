<ThemeSwitcher />

# Menu

Menu is a low-level building block for rendering a floating list of actions —
`OverflowMenu` and context menus are built on top of it. It's a controlled
component: pass `@open` and toggle it from `@onClose`/your own trigger.
Compose it out of `MenuItem`, `MenuItemDivider`, `MenuItemGroup`,
`MenuItemRadioGroup`, and `MenuItemSelectable`.

By default the Menu renders into `document.body`. Since these live previews
render in an isolated shadow DOM, the examples below pass a local element as
`@target` so the menu stays inside the preview instead of escaping into the
real page (where the preview's styles don't reach it). That element also
carries a `transform`, which makes it the containing block for the
fixed-position menu, so `@x`/`@y` below are relative to the dashed box rather
than to the viewport.

```gjs live preview
import { array } from '@ember/helper';
import { Menu, MenuItem, MenuItemDivider, MenuItemGroup, MenuItemRadioGroup, MenuItemSelectable } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { Copy, Cut, FolderShared, Paste, TextBold, TextItalic, TrashCan } from 'carbon-components-ember/icons';
import { ThemeSupport, didInsert } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj container=null) as |context|}}
    <div
      style='position: relative; transform: translateZ(0); min-block-size: 22rem; border: 1px dashed; padding: 1rem;'
      {{didInsert (set context 'container')}}
    >
      {{#if context.container}}
        <Menu
          @label='Menu'
          @open={{true}}
          @target={{context.container}}
          @x={{0}}
          @y={{0}}
        >
          <MenuItem @label='Share with' @renderIcon={{FolderShared}}>
            <MenuItemRadioGroup
              @label='Share with'
              @items={{array 'None' 'Product team' 'Organization' 'Company'}}
              @defaultSelectedItem='Product team'
            />
          </MenuItem>
          <MenuItemDivider />
          <MenuItem @label='Cut' @shortcut='⌘X' @renderIcon={{Cut}} />
          <MenuItem @label='Copy' @shortcut='⌘C' @renderIcon={{Copy}} />
          <MenuItem @label='Paste' @shortcut='⌘V' @disabled={{true}} @renderIcon={{Paste}} />
          <MenuItemDivider />
          <MenuItemGroup @label='Font style'>
            <MenuItemSelectable @label='Bold' @shortcut='⌘B' @defaultSelected={{true}} @renderIcon={{TextBold}} />
            <MenuItemSelectable @label='Italic' @shortcut='⌘I' @renderIcon={{TextItalic}} />
          </MenuItemGroup>
          <MenuItemDivider />
          <MenuItemRadioGroup
            @label='Text decoration'
            @items={{array 'None' 'Overline' 'Line-through' 'Underline'}}
            @defaultSelectedItem='None'
          />
          <MenuItemDivider />
          <MenuItem @label='Delete' @shortcut='⌫' @kind='danger' @renderIcon={{TrashCan}} />
        </Menu>
      {{/if}}
    </div>
  {{/let}}
</template>
```

## Opening from a trigger

In practice `@open` is toggled from a trigger element, and `@x`/`@y` are
computed from that trigger's position so the menu appears anchored to it.
Passing both edges of the trigger (`[x1, x2]`/`[y1, y2]`) lets the Menu flip
to the other side when it doesn't fit. Clicking a leaf item, pressing
<kbd>Escape</kbd>, or moving focus outside the menu all call `@onClose`.

```gjs live preview
import { on } from '@ember/modifier';
import { Menu, MenuItem, MenuItemDivider, Button } from 'carbon-components-ember/components';
import { trackedObject } from '@ember/reactive/collections';
import { ThemeSupport, didInsert } from 'docs-support';

const context = trackedObject({ open: false });

const setContainer = (element) => (context.container = element);

const openMenu = (event) => {
  const trigger = event.currentTarget.getBoundingClientRect();
  const box = context.container.getBoundingClientRect();
  // Subtracting the box here is only needed because the demo box below is
  // the containing block for the menu. Rendering into `document.body`, you
  // would pass the trigger's viewport coordinates as they are.
  context.x = [trigger.left - box.left, trigger.right - box.left];
  context.y = [trigger.top - box.top, trigger.bottom - box.top];
  context.open = true;
};

const closeMenu = () => (context.open = false);

<template>
  <ThemeSupport />
  <br />

  <div
    style='position: relative; transform: translateZ(0); min-block-size: 14rem; border: 1px dashed; padding: 1rem;'
    {{didInsert setContainer}}
  >
    <Button {{on 'click' openMenu}}>
      Open menu
    </Button>

    {{#if context.container}}
      <Menu
        @label='Menu'
        @open={{context.open}}
        @target={{context.container}}
        @x={{context.x}}
        @y={{context.y}}
        @onClose={{closeMenu}}
      >
        <MenuItem @label='Cut' @shortcut='⌘X' />
        <MenuItem @label='Copy' @shortcut='⌘C' />
        <MenuItemDivider />
        <MenuItem @label='Delete' @shortcut='⌫' @kind='danger' />
      </Menu>
    {{/if}}
  </div>
</template>
```

## Sizes

`@size` accepts `xs`, `sm` (default), `md`, or `lg`.

```gjs live preview
import { Menu, MenuItem, MenuItemDivider } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport, didInsert } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj container=null) as |context|}}
    <div
      style='position: relative; transform: translateZ(0); min-block-size: 10rem; border: 1px dashed; padding: 1rem;'
      {{didInsert (set context 'container')}}
    >
      {{#if context.container}}
        <Menu
          @label='Menu'
          @open={{true}}
          @target={{context.container}}
          @x={{0}}
          @y={{0}}
          @size='lg'
        >
          <MenuItem @label='Cut' @shortcut='⌘X' />
          <MenuItem @label='Copy' @shortcut='⌘C' />
          <MenuItemDivider />
          <MenuItem @label='Delete' @shortcut='⌫' @kind='danger' />
        </Menu>
      {{/if}}
    </div>
  {{/let}}
</template>
```

## API Reference

<details>
<summary><h3>Menu</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/menu'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>MenuItem</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/menu/menu-item'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>MenuItemSelectable</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/menu/menu-item-selectable'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>MenuItemGroup</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/menu/menu-item-group'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>MenuItemRadioGroup</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/menu/menu-item-radio-group'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>MenuItemDivider</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/menu/menu-item-divider'
    @name='default'
  />
</template>
```
</details>

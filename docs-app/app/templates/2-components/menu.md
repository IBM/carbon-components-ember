<ThemeSwitcher />

# Menu

Menu is a low-level building block for rendering a floating list of actions —
`OverflowMenu` and context menus are built on top of it. It's a controlled
component: pass `@open` and toggle it from `@onClose`/your own trigger.
Compose it out of `MenuItem`, `MenuItemDivider`, `MenuItemGroup`,
`MenuItemRadioGroup`, and `MenuItemSelectable`.

```gjs live preview
import { array } from '@ember/helper';
import { Menu, MenuItem, MenuItemDivider, MenuItemGroup, MenuItemRadioGroup, MenuItemSelectable } from 'carbon-components-ember/components';
import { Copy, Cut, FolderShared, Paste, TextBold, TextItalic, TrashCan } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <Menu @label='Menu' @open={{true}} @x={{0}} @y={{0}}>
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
</template>
```

## Opening from a trigger

In practice `@open` is toggled from a trigger element, and `@x`/`@y` are
computed from that trigger's position so the menu appears anchored to it.
Clicking a leaf item, pressing <kbd>Escape</kbd>, or moving focus outside the
menu all call `@onClose`.

```gjs live preview
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { Menu, MenuItem, MenuItemDivider, Button } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj open=false) as |context|}}
    <Button {{on 'click' (fn (set context 'open') true)}}>
      Open menu
    </Button>

    <Menu
      @label='Menu'
      @open={{context.open}}
      @x={{20}}
      @y={{60}}
      @onClose={{fn (set context 'open') false}}
    >
      <MenuItem @label='Cut' @shortcut='⌘X' />
      <MenuItem @label='Copy' @shortcut='⌘C' />
      <MenuItemDivider />
      <MenuItem @label='Delete' @shortcut='⌫' @kind='danger' />
    </Menu>
  {{/let}}
</template>
```

## Sizes

`@size` accepts `xs`, `sm` (default), `md`, or `lg`.

```gjs live preview
import { Menu, MenuItem, MenuItemDivider } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <Menu @label='Menu' @open={{true}} @x={{0}} @y={{0}} @size='lg'>
    <MenuItem @label='Cut' @shortcut='⌘X' />
    <MenuItem @label='Copy' @shortcut='⌘C' />
    <MenuItemDivider />
    <MenuItem @label='Delete' @shortcut='⌫' @kind='danger' />
  </Menu>
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

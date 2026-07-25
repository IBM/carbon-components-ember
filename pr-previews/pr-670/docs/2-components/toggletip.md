<ThemeSwitcher />

# Toggletip

A `Toggletip` is used to provide extra information about an element on the
page. It renders a button that, when clicked, shows a popover with additional
content. Unlike a `Tooltip`, its content can contain interactive elements
like links and buttons, since it stays open until the user dismisses it (by
clicking the button again, clicking outside, or pressing <kbd>Escape</kbd>).

`Toggletip` yields a `Button` and `Content` component that coordinate the
open/closed state and accessibility attributes between them.

```gjs live preview
import { Toggletip, ToggletipLabel, ToggletipActions, Button } from 'carbon-components-ember/components';
import { Information } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <ToggletipLabel>Toggletip label</ToggletipLabel>
  <Toggletip as |t|>
    <t.Button @label='Show information'>
      <Information />
    </t.Button>
    <t.Content>
      <p>
        Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
      </p>
      <ToggletipActions>
        <a class='cds--link' href='#'>Link action</a>
        <Button @size='sm'>Button</Button>
      </ToggletipActions>
    </t.Content>
  </Toggletip>
</template>
```

## Alignment

Pass `@align` to control which side of the button the popover renders on.
Supported values are `top`, `top-start`, `top-end`, `bottom`, `bottom-start`,
`bottom-end`, `left`, `left-start`, `left-end`, `right`, `right-start` and
`right-end`.

```gjs live preview
import { Toggletip, ToggletipLabel, ToggletipActions, Button } from 'carbon-components-ember/components';
import { Information } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />
  <br />

  <ToggletipLabel>Toggletip label</ToggletipLabel>
  <Toggletip @align='right' as |t|>
    <t.Button @label='Show information'>
      <Information />
    </t.Button>
    <t.Content>
      <p>
        This toggletip is aligned to the right of its trigger button instead
        of the default top alignment.
      </p>
      <ToggletipActions>
        <a class='cds--link' href='#'>Link action</a>
        <Button @size='sm'>Button</Button>
      </ToggletipActions>
    </t.Content>
  </Toggletip>
</template>
```

## Default open

Passing `@defaultOpen={{true}}` renders the toggletip open on initial render.
This only sets the initial state — the toggletip remains interactive and can
still be toggled or dismissed afterwards.

```gjs live preview
import { Toggletip, ToggletipLabel, ToggletipActions, Button } from 'carbon-components-ember/components';
import { Information } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />
  <br />

  <ToggletipLabel>Toggletip label</ToggletipLabel>
  <Toggletip @defaultOpen={{true}} as |t|>
    <t.Button @label='Show information'>
      <Information />
    </t.Button>
    <t.Content>
      <p>
        Scroll the container up, down, left or right to observe how the
        Toggletip stays anchored to its trigger button.
      </p>
      <ToggletipActions>
        <a class='cds--link' href='#'>Link action</a>
        <Button @size='sm'>Button</Button>
      </ToggletipActions>
    </t.Content>
  </Toggletip>
</template>
```

> The React implementation additionally supports an experimental `@autoAlign`
> prop that repositions the popover with `floating-ui` to stay within the
> viewport. That behavior is preview-only upstream and is not implemented
> here; use `@align` to pick a static position instead.

## API Reference

<details>
<summary><h3>Toggletip</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/toggletip'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>ToggletipButton</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/toggletip/button'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>ToggletipContent</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/toggletip/content'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>ToggletipLabel</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/toggletip/label'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>ToggletipActions</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/toggletip/actions'
    @name='default'
  />
</template>
```
</details>

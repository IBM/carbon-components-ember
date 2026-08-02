# Tooltip
<ThemeSwitcher />

Tooltips display additional information upon hover or focus. The
information should be contextual, useful, and nonessential. A tooltip is
attached to the element yielded in its default block and shows after a
short delay on hover, or immediately on keyboard focus. Pressing `Escape`
dismisses it.

Use `@label` when the tooltip names the trigger (exposed as
`aria-labelledby`), or `@description` when it adds extra information
(exposed as `aria-describedby`). For rich content, use the `:content`
block instead. Placement is controlled with `@align`.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Tooltip, Button } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <div style='display: flex; gap: 4rem; padding: 4rem 2rem;'>
    <Tooltip @label='Close'>
      <Button @type='secondary'>Hover me</Button>
    </Tooltip>

    <Tooltip
      @align='bottom'
      @description='Occasionally, services are updated in a specified time window to ensure no down time for customers.'
    >
      <Button @type='secondary'>Large text</Button>
    </Tooltip>

    <Tooltip @align='right' @dropShadow={{true}} @highContrast={{false}}>
      <:default><Button @type='secondary'>Low contrast</Button></:default>
      <:content><strong>Custom</strong> content</:content>
    </Tooltip>
  </div>
</template>
```

## Alignment

`@align` controls which side of the trigger the tooltip is rendered on.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Tooltip, Button } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <div style='display: flex; gap: 4rem; padding: 4rem 2rem;'>
    <Tooltip @label='Tooltip alignment' @align='bottom-left'>
      <Button @type='secondary'>This button has a tooltip</Button>
    </Tooltip>
  </div>
</template>
```

## Duration

`@enterDelayMs` and `@leaveDelayMs` control how long the tooltip waits
before showing and hiding on hover.

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Tooltip, Button } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <div style='display: flex; gap: 4rem; padding: 4rem 2rem;'>
    <Tooltip @label='Label one' @enterDelayMs={{0}} @leaveDelayMs={{300}}>
      <Button @type='secondary'>This button has a tooltip</Button>
    </Tooltip>
  </div>
</template>
```

## Auto align

When `@autoAlign` is set, the tooltip flips to the opposite side if it
would otherwise overflow the viewport (or `@autoAlignBoundary`, if
provided).

```gjs live preview
import { ThemeSupport } from 'docs-support';
import { Tooltip, Button } from 'carbon-components-ember/components';
<template>
  <ThemeSupport />
  <br>
  <div style='padding: 1rem 2rem 8rem;'>
    <Tooltip @label='This tooltip flips to stay in the viewport' @align='top' @autoAlign={{true}}>
      <Button @type='secondary'>Scroll me into view, near the bottom</Button>
    </Tooltip>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>Tooltip</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/tooltip' 
    @name='default' 
  />
</template>
```
</details>

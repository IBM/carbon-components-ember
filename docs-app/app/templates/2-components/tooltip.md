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

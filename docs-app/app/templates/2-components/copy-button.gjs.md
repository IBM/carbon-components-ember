<ThemeSwitcher />

# Copy Button

`CopyButton` is an icon-only button that copies text to the clipboard and
shows a "Copied!" tooltip as feedback. It is used internally by `CodeSnippet`,
but can also be used on its own — pass the text to copy as the block content,
or point it at another element via `@targetElement`/`@targetElementId`.

```gjs live preview
import { CopyButton } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <CopyButton>console.log('hello world');</CopyButton>
</template>
```

## Custom feedback and icon description

`@iconDescription` sets the accessible name and tooltip label shown before a
copy, defaulting to `'Copy to clipboard'`. `@feedback` sets the tooltip label
shown after a copy, defaulting to `'Copied!'`, and `@feedbackTimeout`
controls how long (in ms) it stays visible before reverting, defaulting to
`2000`.

```gjs live preview
import { CopyButton } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <CopyButton
    @iconDescription='Duplicate'
    @feedback='Duplicated!'
    @feedbackTimeout={{1000}}
  >console.log('hello world');</CopyButton>
</template>
```

## Alignment and disabled state

`@align` and `@autoAlign` behave the same as on `Popover`/`Tooltip`. Passing
`@disabled={{true}}` disables the button.

```gjs live preview
import { CopyButton } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <CopyButton @align='top'>console.log('hello world');</CopyButton>
  <CopyButton @disabled={{true}}>console.log('hello world');</CopyButton>
</template>
```

## API Reference

<details>
<summary><h3>CopyButton</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/copy-button'
    @name='default'
  />
</template>
```
</details>

<ThemeSwitcher />

# Link

Links are used as navigational elements. They may be used on their own, within
a sentence or paragraph, or directly following the content they are relevant to.

```gjs live preview
import { Link } from 'carbon-components-ember/components';
import { Add } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <Link @href="https://www.carbondesignsystem.com">Link</Link>
    <br />
    <br />
    <Link @href="https://www.carbondesignsystem.com" @size="sm">Small link</Link>
    <br />
    <br />
    <Link @href="https://www.carbondesignsystem.com" @size="lg">Large link</Link>
    <br />
    <br />
    <Link @href="https://www.carbondesignsystem.com" @visited={{true}}>Visited link</Link>
    <br />
    <br />
    <Link @href="https://www.carbondesignsystem.com" @disabled={{true}}>Disabled link</Link>
    <br />
    <br />
    <Link @href="https://www.carbondesignsystem.com" @renderIcon={{Add}}>Link with icon</Link>
    <br />
    <br />
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      <Link @href="https://www.carbondesignsystem.com" @inline={{true}}>Inline link</Link>
      is used within a paragraph of text.
    </p>
</template>
```

## API Reference

<details>
<summary><h3>Link</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/link'
    @name='default'
  />
</template>
```
</details>

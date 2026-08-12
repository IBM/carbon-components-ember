<ThemeSwitcher />

# Tags

```gjs live preview
import { Tag } from 'carbon-components-ember/components';
import { trackedObject } from '@ember/reactive/collections';
import { ThemeSupport } from 'docs-support';

const context = trackedObject({
  types: [
    'red',
    'magenta',
    'purple',
    'blue',
    'cyan',
    'teal',
    'green',
    'gray',
    'cool-gray',
    'warm-gray',
    'high-contrast',
    'outline',
  ]
});

<template>
    <ThemeSupport />
    <br>
      {{#each context.types as |type|}}
        <Tag @type={{type}}>
          {{type}}
        </Tag>
        <Tag @type={{type}}>
          {{type}}
        </Tag>
      {{/each}}
</template>
```

## Sizes

`@size` supports `sm`, `md` (default) or `lg`.

```gjs live preview
import { Tag } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br>
  <Tag @type='blue' @size='sm'>Small</Tag>
  <Tag @type='blue' @size='md'>Medium</Tag>
  <Tag @type='blue' @size='lg'>Large</Tag>
</template>
```

## Disabled

```gjs live preview
import { Tag } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br>
  <Tag @type='blue' @disabled={{true}}>Disabled</Tag>
</template>
```

## With icon

Provide a `@renderIcon` component to render an icon inside the tag. The icon
is hidden for the `sm` size.

```gjs live preview
import { Tag } from 'carbon-components-ember/components';
import { Asleep } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br>
  <Tag @type='blue' @renderIcon={{Asleep}}>With icon</Tag>
</template>
```

## With decorator

**Experimental:** Provide a `@decorator` (or the deprecated `@slug`) component
to render inside the Tag, such as an AILabel once it's available (see
[AILabel #406](https://github.com/IBM/carbon-components-ember/issues/406)).
In the meantime, any component can be used as a placeholder.

```gjs live preview
import { Tag } from 'carbon-components-ember/components';
import { Add } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br>
  <Tag @type='red' @renderIcon={{Add}} @decorator={{Add}}>With decorator</Tag>
</template>
```

## API Reference

<details>
<summary><h3>Tag</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/tag' 
    @name='default' 
  />
</template>
```
</details>

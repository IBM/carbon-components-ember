<ThemeSwitcher />

# Tags

```gjs live preview
import { Tag } from 'carbon-components-ember/components';
import { TrackedObject } from 'tracked-built-ins';
import { ThemeSupport } from 'docs-support';

const context = new TrackedObject({
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

<ThemeSwitcher />

# Portal

Helper component for rendering content within a portal. By default, the
portal renders into `document.body`. You can customize this behavior with
the `@container` argument. Any content yielded to this component will be
rendered inside of the container.

```gjs live preview
import { Portal } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <div>
      This content renders in place.
      <Portal>
        <div>This content is rendered into document.body via a Portal.</div>
      </Portal>
    </div>
</template>
```

## API Reference

<details>
<summary><h3>Portal</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/portal' 
    @name='default' 
  />
</template>
```
</details>

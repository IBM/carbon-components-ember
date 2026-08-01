<ThemeSwitcher />

# Portal

Helper component for rendering content within a portal. By default, the
portal renders into `document.body`. You can customize this behavior with
the `@container` argument. Any content yielded to this component will be
rendered inside of the container.

Since this live preview renders in an isolated shadow DOM, the example below
passes a local element as `@container` so the portaled content stays visible
inside the preview instead of escaping into the real page's `document.body`.

```gjs live preview
import { Portal } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport, didInsert } from 'docs-support';

<template>
    <ThemeSupport />
    {{#let (newObj container=null) as |context|}}
      <p>Portal target:</p>
      <div
        style='border: 1px dashed; padding: 1rem;'
        {{didInsert (set context 'container')}}
      ></div>

      <div>
        This content renders in place.
        {{#if context.container}}
          <Portal @container={{context.container}}>
            <div>This content is rendered into the target above via a Portal.</div>
          </Portal>
        {{/if}}
      </div>
    {{/let}}
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

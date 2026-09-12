<ThemeSwitcher />

# Toolbar

`Toolbar` renders a horizontal action bar: a navigation area, a title, and a
row of icon-button actions. Setting `@overflow` collapses actions that don't
fit the available width into an overflow menu.

```gjs live preview
import { array, hash } from '@ember/helper';
import { Toolbar } from 'carbon-components-ember/components';
import { Add, Renew, Settings, TrashCan } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

const noop = () => {};

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem; border: 1px solid var(--cds-border-subtle); border-radius: 0.5rem 0.5rem 0 0;'>
    <Toolbar
      @titleText='Conversation'
      @overflow={{true}}
      @actions={{array
        (hash text='Add' icon=Add onClick=noop)
        (hash text='Refresh' icon=Renew onClick=noop fixed=true)
        (hash text='Settings' icon=Settings onClick=noop)
        (hash text='Delete' icon=TrashCan danger=true onClick=noop)
      }}
    />
  </div>
</template>
```

## API Reference

<details>
<summary><h3>Toolbar</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/toolbar'
    @name='default'
  />
</template>
```
</details>

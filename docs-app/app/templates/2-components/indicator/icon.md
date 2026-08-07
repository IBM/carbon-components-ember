<ThemeSwitcher />

# IconIndicator

Icon indicators pair a status icon with a label to communicate the state of
an item. They support the kinds `failed`, `caution-major`, `caution-minor`,
`undefined`, `succeeded`, `normal`, `in-progress`, `incomplete`,
`not-started`, `pending`, `unknown`, and `informative`.

```gjs live preview
import { IconIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const kinds = [
  'failed',
  'caution-major',
  'caution-minor',
  'undefined',
  'succeeded',
  'normal',
  'in-progress',
  'incomplete',
  'not-started',
  'pending',
  'unknown',
  'informative',
];

<template>
  <ThemeSupport />
  <br>
  {{#each kinds as |kind|}}
    <div style="margin-bottom: .5rem;">
      <IconIndicator @kind={{kind}} @label={{kind}} />
    </div>
  {{/each}}
</template>
```

## Size 20 and auto-align

Icon indicators have two size options, 16 (default) and 20. `@autoAlign` can
be used to keep the compact-mode tooltip within the viewport, flipping to the
opposite side when it would otherwise overflow.

```gjs live preview
import { IconIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const kinds = [
  'failed',
  'caution-major',
  'caution-minor',
  'undefined',
  'succeeded',
  'normal',
  'in-progress',
  'incomplete',
  'not-started',
  'pending',
  'unknown',
  'informative',
];

<template>
  <ThemeSupport />
  <br>
  {{#each kinds as |kind|}}
    <div style="margin-bottom: .5rem;">
      <IconIndicator
        @kind={{kind}}
        @label={{kind}}
        @size={{20}}
        @align="top"
        @autoAlign={{true}}
      />
    </div>
  {{/each}}
</template>
```

## Compact mode

When the `@compact` argument is set to `true`, the icon indicator displays
only the icon, with the label shown in a tooltip on hover/focus. Use
`@iconDescription` to provide a different accessible name than `@label`.

```gjs live preview
import { IconIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br>
  <IconIndicator @kind="failed" @label="Failed" @compact={{true}} />
</template>
```

## API Reference

<details>
<summary><h3>IconIndicator</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/icon-indicator' 
    @name='default' 
  />
</template>
```
</details>

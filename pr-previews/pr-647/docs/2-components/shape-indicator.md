<ThemeSwitcher />

# ShapeIndicator

Shape indicators can take the form of failed, critical, high, medium, low,
cautious, undefined, stable, informative, incomplete, and draft. They are
useful for conveying status where color alone would not be accessible.

```gjs live preview
import { ShapeIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const kinds = [
  'failed',
  'critical',
  'high',
  'medium',
  'low',
  'cautious',
  'undefined',
  'stable',
  'informative',
  'incomplete',
  'draft',
];

<template>
  <ThemeSupport />
  <br>
  {{#each kinds as |kind|}}
    <div style="margin-bottom: .5rem;">
      <ShapeIndicator @kind={{kind}} @label={{kind}} />
    </div>
  {{/each}}
</template>
```

## Text size

Shape indicators have two text size options, 12 (default) and 14.

```gjs live preview
import { ShapeIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br>
  <div style="margin-bottom: .5rem;">
    <ShapeIndicator @kind="stable" @label="Stable" @textSize={{14}} />
  </div>
</template>
```

## Compact mode

When the `@compact` argument is set to `true`, the shape indicator displays
only the shape, with the label shown in a tooltip on hover/focus.

```gjs live preview
import { ShapeIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br>
  <ShapeIndicator @kind="failed" @label="Failed" @compact={{true}} />
</template>
```

## API Reference

<details>
<summary><h3>ShapeIndicator</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/shape-indicator' 
    @name='default' 
  />
</template>
```
</details>

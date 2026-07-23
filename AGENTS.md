# Agent Context and Development Guide

This document provides essential context and patterns for AI agents (like Bob Shell) working on the carbon-components-ember codebase.

## Project Overview

**carbon-components-ember** is an Ember.js implementation of IBM's Carbon Design System components, maintaining parity with the React implementation.

- **Repository**: https://github.com/IBM/carbon-components-ember
- **Carbon React Reference**: https://github.com/carbon-design-system/carbon/tree/main/packages/react
- **Carbon Storybook**: https://react.carbondesignsystem.com/
- **Technology**: Ember.js with Glimmer TypeScript (.gts files)

## Component Implementation Patterns

### 1. Basic Component Structure

All components follow this pattern:

```typescript
/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface ComponentNameSignature {
  Element: HTMLDivElement;
  Args: {
    argName?: string;
  };
  Blocks: {
    default: [];
  };
}

export default class ComponentName extends Component<ComponentNameSignature> {
  <template>
    <div class="cds--component-name" ...attributes>
      {{yield}}
    </div>
  </template>
}
```

### 2. CSS Class Naming Convention

**Always use `cds--` prefix** (Carbon Design System):

```typescript
// ✅ Correct
class="cds--btn-set"
class="cds--aspect-ratio--16x9"

// ❌ Wrong
class="btn-set"
class="carbon-btn-set"
```

### 3. Component Arguments vs Props

Ember uses `@args` instead of React props:

```typescript
// React
<Button size="lg" kind="primary" />

// Ember
<Button @size="lg" @kind="primary" />
```

### 4. Event Handling

Use `{{on}}` modifier instead of React's event props:

```typescript
// React
<button onClick={handler}>Click</button>

// Ember
<button {{on "click" handler}}>Click</button>
```

### 5. Dynamic Element Types

Use the `element` helper from `ember-element-helper`:

```typescript
import { element } from 'ember-element-helper';

<template>
  {{#let (element this.elementType) as |Tag|}}
    <Tag class="my-class">{{yield}}</Tag>
  {{/let}}
</template>
```

**Important**: `element` requires the `ember-element-helper` package. It is already installed in this project.

## Real Implementation Examples

### Example 1: AspectRatio (Simple Component)

```typescript
import Component from '@glimmer/component';
import { concat } from '@ember/helper';

export interface AspectRatioSignature {
  Element: HTMLDivElement;
  Args: {
    ratio?: '1x1' | '16x9' | '4x3';
  };
  Blocks: {
    default: [];
  };
}

export default class AspectRatio extends Component<AspectRatioSignature> {
  get ratio() {
    return this.args.ratio ?? '1x1';
  }

  <template>
    <div
      class={{concat "cds--aspect-ratio cds--aspect-ratio--" this.ratio}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
```

### Example 2: ButtonSet (Layout Component)

```typescript
import Component from '@glimmer/component';

export interface ButtonSetSignature {
  Element: HTMLDivElement;
  Args: {
    fluid?: boolean;
    stacked?: boolean;
  };
  Blocks: {
    default: [];
  };
}

export default class ButtonSet extends Component<ButtonSetSignature> {
  get classes() {
    const classes = ['cds--btn-set'];
    if (this.args.stacked) classes.push('cds--btn-set--stacked');
    if (this.args.fluid) classes.push('cds--btn-set--fluid');
    return classes.join(' ');
  }

  <template>
    <div class={{this.classes}} ...attributes>
      {{#if @fluid}}
        <div class="cds--btn-set__fluid-inner">{{yield}}</div>
      {{else}}
        {{yield}}
      {{/if}}
    </div>
  </template>
}
```

## Common Pitfalls and Solutions

### ❌ Pitfall 1: Forgetting to Import `element`

```typescript
// ❌ Wrong - element is not built-in
{{#let (element "div") as |Tag|}}
  <Tag>Content</Tag>
{{/let}}
```

**Solution**: Import from `ember-element-helper`:

```typescript
// ✅ Correct
import { element } from 'ember-element-helper';

<template>
  {{#let (element "div") as |Tag|}}
    <Tag>Content</Tag>
  {{/let}}
</template>
```

### ❌ Pitfall 2: Overcomplicating React Patterns

React's `useEffect`, `useRef`, `useState` often don't need direct equivalents in Ember.

**Solution**: Simplify - let Ember's reactivity and CSS handle it.

### ❌ Pitfall 3: Wrong CSS Prefix

```typescript
// ❌ Wrong
class="carbon--btn-set"

// ✅ Correct
class="cds--btn-set"
```

### ❌ Pitfall 4: Reusing a `.gts` filename that already exists elsewhere under `src/components/`

Nested "sub-component" files (e.g. `tile/group.gts`, `radio-button/group.gts`)
are easy to name generically (`group.gts`, `item.gts`, `row.gts`...). If a
**publicly exported** component (one re-exported from
`src/components/index.ts`) shares its exact filename with another publicly
exported component elsewhere in the tree — even in a different
directory — docs-app's production Vite build (which uses an aggressive
`treeshake: 'smallest'` rollup setting) has been observed to silently
mis-name one of the two exports in the generated component registry. The
addon's own build (`pnpm build:carbon`) looks completely correct and every
test/lint passes; the failure only shows up as a runtime
`TypeError: Cannot convert undefined or null to object` (at
`getPrototypeOf`) in the browser console on the deployed docs preview, where
the affected component's demo silently fails to render. This bit `TileGroup`
(`tile/group.gts`) because `radio-button/group.gts` already existed with the
same basename `group.gts` — renaming to `tile/tile-group.gts` fixed it.

**Solution**: Before finishing a new component, check for filename
collisions:

```bash
find carbon-components-ember/src/components -name "*.gts" -not -path "*/icons/*" \
  | sed 's#.*/##' | sort | uniq -d
```

If your new component's exported file shares a basename with another
exported component (private sub-components prefixed with `-`, e.g.
`-row.gts`, are not exported from `index.ts` and are unaffected), give it a
more specific name (e.g. `tile/tile-group.gts`, not `tile/group.gts`).

## Component Implementation Checklist

- [ ] Review React implementation at GitHub
- [ ] Check Storybook for visual reference
- [ ] Create `.gts` file in `carbon-components-ember/src/components/`
- [ ] Define TypeScript signature
- [ ] Use `cds--` prefix for CSS classes
- [ ] Match React prop names (as `@args`)
- [ ] Export in `carbon-components-ember/src/components/index.ts`
- [ ] Create test file in `test-app/tests/components/`
- [ ] Build: `cd carbon-components-ember && pnpm build`
- [ ] Test: `cd test-app && pnpm test`

## Simplification Guidelines

1. **State**: Use `@tracked` instead of `useState`
2. **Effects**: Often not needed - Ember's reactivity handles it
3. **Refs**: Usually not needed - use `{{on}}` modifiers
4. **Callbacks**: Use `@action` methods
5. **Children**: Use `{{yield}}` blocks
6. **Conditionals**: Use `{{#if}}` instead of `&&`
7. **Lists**: Use `{{#each}}` instead of `.map()`

## Key Resources

- **Carbon React**: https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components
- **Carbon Storybook**: https://react.carbondesignsystem.com/
- **Ember Guides**: https://guides.emberjs.com/

---

Last Updated: 2026-07-14

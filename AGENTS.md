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

## Idiomatic Ember Patterns (Prefer These Over Transliterating React)

Parity means matching Carbon React's **public API surface and behaviour**, not
its implementation strategy. React reaches for hooks, refs, context,
`React.Children.map` and `cloneElement` because that's what it has; a literal
transliteration of those into Ember produces components that are awkward to
call from a template and that fight the reactivity system.

Every pattern below is already used in this addon. Before writing a component,
map each React construct to its Ember counterpart here, and reach for the
closest existing pattern rather than inventing a new one.

### React → Ember Translation Table

| Carbon React construct | Idiomatic Ember equivalent | Live example in this repo |
| --- | --- | --- |
| `children` inspected/cloned via `React.Children.map` + `cloneElement` | Yield a contextual component with its wiring pre-bound (`WithBoundArgs`) | `components/data-table.gts`, `components/tree-view.gts`, `components/tabs.gts` (see caveat in §1) |
| Component passed as a prop (`renderIcon={Add}`, `slug={<AILabel />}`) | A `ComponentLike` arg, invoked as `<@renderIcon />` | `components/link.gts`, `components/text-area.gts` |
| `value` + `defaultValue` + `onChange` triple | Keep **both** args: `@defaultValue` seeds private `@tracked` state, `@value` wins whenever it is defined | `components/text-input.gts`, `components/number-input.gts` |
| A single prop that is both initial state and controllable (`isExpanded` + `onToggle`) | One arg plus a private `@tracked` fallback; the arg is the source of truth only when the change handler was also passed | `TreeNode.expanded` in `components/tree-view.gts` |
| `useRef` + `useEffect` to wire DOM listeners | A functional `modifier()` from `ember-modifier` that returns its teardown | `attachTrigger` in `components/-private/tooltip.gts` |
| `forwardRef` so a parent can attach behaviour to a child element | Yield a `ModifierLike` for the caller to apply to their own element | `Blocks.trigger` in `components/-private/tooltip.gts` |
| `createPortal` | `{{#in-element}}` — use the existing `<Portal>` component | `components/portal.gts` |
| React context / provider | A service, or the parent component instance yielded down to children | `services/notifications.ts`, `services/dialog-manager.ts` |
| `useId` | `guidFor(this)` | `components/tree-view.gts`, `components/tabs.gts` |
| Floating UI positioning hooks | The addon's own `<Popover>` / `<PopoverContent>`. Reach for `ember-primitives`' `Popover` only when building a *new* positioning primitive | consume: `components/popover.gts`'s exports; primitive: `components/-private/tooltip.gts` |
| Debounce via `useEffect` + `setTimeout` | `task({ restartable: true })` + `timeout()` from `ember-concurrency` | `runSearch` in `components/search.gts` (see caveat in §6) |
| `useEffect` cleanup return | `registerDestructor` (or the modifier's teardown function) | `TabPane` in `components/tabs.gts` |
| Lazily/asynchronously resolved value rendered in a template | `TrackedPromise` from `utils/tracked.ts` — re-renders once the promise settles | the generated `components/icons/*.ts` (each icon size is a lazy `import()`) |

### 1. Yield Contextual Components Instead of Inspecting Children

React parents commonly walk `children` and clone them to inject props. In
Ember, yield the child component with the parent-supplied args already bound —
the consumer gets a correctly-wired component and Glint type-checks it:

```typescript
export interface TabsComponentSignature {
  Args: Args;
  Element: HTMLDivElement;
  Blocks: {
    // `tab` is already bound, so the caller never wires it up by hand
    default: [WithBoundArgs<typeof TabPane, 'tab'>];
  };
}
```

```handlebars
<Tabs as |Pane|>
  <Pane @title="One">…</Pane>
  <Pane @title="Two">…</Pane>
</Tabs>
```

`DataTable` yields a whole namespace this way (`Toolbar`, `SearchInput`,
`Pagination`, `Table`, `EachBodyRows`, `Header`, plus `Column` and `Menu`),
each with the wiring that child actually needs already bound — the table
instance for `Toolbar`/`Header`/`EachBodyRows`, loading and paging state for
`SearchInput`/`Pagination`/`Table`, and nothing at all for `Column`/`Menu`,
which are yielded as a plain `typeof`. Bind what the child needs, not the
parent wholesale. That is all it demonstrates; it has no child→parent
registration.

`Tabs` goes one step further: because the parent needs to know which children
exist and in what order, its children register themselves with the parent on
construction and deregister via `registerDestructor`, so ordering and teardown
are handled by Ember rather than by an effect:

```typescript
import type Owner from '@ember/owner';
import { registerDestructor } from '@ember/destroyable';
// Defers the mutation to the next runloop so registering doesn't dirty the
// parent's tracked list during its own render (the backtracking-rerender
// assertion); `runTask` also cancels itself if this child is torn down first.
import { runTask } from 'ember-lifeline';

export default class TabPane extends Component<TabPaneSignature> {
  constructor(owner: Owner, args: TabPaneSignature['Args']) {
    super(owner, args);
    runTask(this, () => {
      if (this.isDestroyed) return;
      this.args.tab.registerTab(this);
      registerDestructor(this, () => this.args.tab.unregisterTab(this));
    });
  }
}
```

The parent keeps its children in a plain array reassigned through `@tracked`:

```typescript
@tracked tabs: TabPane[] = [];

registerTab(tab: TabPane) {
  this.tabs = [...this.tabs, tab];
}

unregisterTab(tab: TabPane) {
  this.tabs = this.tabs.filter((t) => t !== tab);
}
```

Caveat on the `tabs.gts` citation: copy its *yielding and registration shape*
only. Its actual `A()` / `pushObject` array is legacy — see the "What NOT to
Reach For" list below, which also covers the `constructor(owner: any, …)` it
shares with most other components here. For the yielding half of the pattern,
`data-table.gts` and `tree-view.gts` are the cleaner files to read first;
`tabs.gts` is the only one of the three that registers children at all.

### 2. Accept Components as Args via `ComponentLike`

Carbon React passes components through props (`renderIcon`, `decorator`,
`slug`). The Ember equivalent is a `ComponentLike` arg invoked directly in the
template — no wrapper component, no string-based lookup:

```typescript
import type { ComponentLike } from '@glint/template';

export interface LinkSignature {
  Args: {
    renderIcon?: ComponentLike;
  };
}

<template>
  {{#if @renderIcon}}
    <@renderIcon />
  {{/if}}
</template>
```

Callers pass the component itself: `<Link @renderIcon={{Add}} />`.

### 3. Model Controlled vs Uncontrolled Explicitly

Every component must offer *some* uncontrolled path. Which of the two shapes
below you use depends on what React exposes — and parity means matching
React's prop list, so don't collapse two React props into one Ember arg. In
Case A the uncontrolled path is `@defaultValue`; a bare `@value` is genuinely
controlled, and freezing the input until the consumer feeds a new `@value`
back is the correct behaviour, exactly as in React. In Case B there is no
second arg, so key on the handler instead — without that, a static
`@isExpanded={{true}}` would lock the component.

**Case A — React ships a `value` + `defaultValue` pair.** Keep both args.
`@defaultValue` seeds private tracked state; `@value` takes over whenever it
is defined. This is the convention across `text-input.gts`, `text-area.gts`,
`fluid-text-input.gts`, `password-input.gts`, `number-input.gts` and
`time-picker.gts` — follow it, and do **not** drop `@defaultValue` from the
public API:

```typescript
@tracked internalValue: string;

constructor(owner: Owner, args: Signature['Args']) {
  super(owner, args);
  this.internalValue = args.defaultValue ?? '';
}

get value() {
  return this.args.value ?? this.internalValue;   // `@value` wins when defined
}
```

**Case B — React ships *one* prop that is both the initial state and
controllable** (e.g. `isExpanded` with `onToggle`, no `defaultExpanded`).
There's no second arg to key on, so key on the change handler: the arg is the
source of truth only when the consumer also passed the handler that lets them
update it. Otherwise it just seeds tracked state — without this, a static
`@isExpanded={{true}}` would permanently lock the component open:

```typescript
@tracked uncontrolledExpanded = this.args.isExpanded ?? false;

get expanded() {
  if (this.args.onToggle) {
    return this.args.isExpanded ?? false;  // controlled
  }
  return this.uncontrolledExpanded;        // uncontrolled
}

setExpanded(expanded: boolean) {
  this.uncontrolledExpanded = expanded;
  this.args.onToggle?.(expanded, this);
}
```

Document which mode an arg is in, in its JSDoc — the docs example should show
both.

### 4. Use Modifiers for DOM Work, and Yield Them for "Refs"

A modifier is Ember's answer to `useRef` + `useEffect`: it receives the
element, sets things up, and returns a teardown function. It composes and is
applied declaratively, unlike `did-insert`/`did-update`:

```typescript
import { modifier as eModifier } from 'ember-modifier';

const attachTrigger = eModifier<{
  Element: HTMLElement | SVGElement;
  Args: { Named: { onShow: () => void; onHide: () => void } };
}>((element, _positional, { onShow, onHide }) => {
  element.addEventListener('mouseenter', onShow);
  element.addEventListener('focusin', onShow);

  return () => {
    element.removeEventListener('mouseenter', onShow);
    element.removeEventListener('focusin', onShow);
  };
});
```

When the *consumer* owns the element that needs the behaviour (React's
`forwardRef` case), yield the modifier to them and type it with
`ModifierLike`:

```typescript
Blocks: {
  trigger: [ModifierLike<{ Element: HTMLElement | SVGElement }>];
  content: [];
}
```

```handlebars
<Tooltip>
  <:trigger as |attach|>
    <button {{attach}}>Hover me</button>
  </:trigger>
  <:content>Help text</:content>
</Tooltip>
```

### 5. Render Out-of-Flow Content Through `<Portal>`

Overlays, tooltips and dialogs escape their container with `{{#in-element}}`,
already wrapped for you:

```typescript
export default class Portal extends Component<PortalSignature> {
  get destination() {
    return this.args.container ?? document.body;
  }

  <template>
    {{#in-element this.destination}}{{yield}}{{/in-element}}
  </template>
}
```

For positioned overlays, use the addon's own `<Popover>` / `<PopoverContent>`
(exported from `components/popover.gts`) — it is Carbon-styled and matches the
React API, so a new Carbon component should consume it rather than grow a
second popover of its own. Only when you're building a genuinely new
positioning *primitive* should you drop down to `ember-primitives`' `Popover`
(Floating UI plus native top-layer promotion), as `-private/tooltip.gts` does.
Either way, don't hand-roll position maths.

Note for tests: `assert.dom()`'s default root won't see portalled content —
point `@container` at an element you appended to `document.body` and scope
assertions to it (see `test-app/tests/components/portal-test.gts`).

### 6. Handle Timing With Tasks and Destructors, Not Bare Timers

`setTimeout` in a component leaks across teardown and can't be cancelled
coherently. Use a restartable `ember-concurrency` task — the previous run is
cancelled automatically on each new keystroke:

```typescript
runSearch = task({ restartable: true }, async () => {
  await timeout(200);
  return await this.args.onChange?.(this.value);
});
```

Caveat on the `search.gts` citation: copy only the shape of its `runSearch`
task. The rest of that file is legacy and contradicts this
document — it triggers the task with `{{didUpdate (perform …)}}` from
`@ember/render-modifiers`, mutates tracked state during render with
`{{this.setValue @value}}`, types `onChange?(value: any)` in its signature,
and adds a `document` `mousedown` listener in `activate()` that is only
removed from inside the listener itself, so it leaks when the component is
torn down while active. Drive the task from the input's own `input`/`change`
handler, and register any listener's removal with `registerDestructor`.

Anything else that must be cleaned up belongs in `registerDestructor` (or a
modifier teardown), never in an ad-hoc `willDestroy` re-implementation.

### 7. Type the Signature Fully

Glint types are part of the public API. Declare what the component actually
has — the entries are conditional, not a fixed set of three:

- `Args` — whenever the component takes any args (most do). Omit it entirely
  for argless wrappers (`form-item.gts`, `toggletip/label.gts`,
  `ui-shell/-sidenav/-divider.gts`, …) rather than declaring `Args: {}`.
- `Element` — when the component spreads `...attributes` onto an element, so
  the attributes are type-checked against the right element type.
- `Blocks` — only for blocks the component actually `{{yield}}`s. Adding
  `Blocks: { default: [] }` to a component with no `{{yield}}` is worse than
  omitting it: `<Icon>text</Icon>` then type-checks while rendering nothing.
  Roughly a third of the components here legitimately have no `Blocks`
  (`icon.gts`, `loading.gts`, `select-item.gts`, `shape-indicator.gts`, …)
  and several have no `Element`.

Yielded values use `WithBoundArgs` / `ComponentLike` / `ModifierLike` rather
than `any`; `any` doesn't belong anywhere in a signature. JSDoc on each arg
feeds the generated `ComponentSignature` API table in the docs, so write it
for the reader of the docs site, not for yourself.

### What NOT to Reach For

- **`@ember/render-modifiers`** (`did-insert`, `did-update`) in new code.
  Several older components still use it; it observes render rather than
  state, doesn't compose, and has no teardown story. Write a real modifier.
- **`A()` / `NativeArray` / `pushObject` / `removeObject`** and `set()` from
  `@ember/object`. Also present in older components. New code uses plain
  arrays/objects reassigned through `@tracked`.
- **Classic `Component` + separate `.hbs`** — everything here is `.gts` with
  `<template>`.
- **`this.element` / direct DOM queries from a getter** — Glimmer components
  have no element; go through a modifier.
- **Re-implementing an overlay primitive** — check the addon's own components
  first (`<Portal>`, `<Popover>` / `<PopoverContent>`), then `ember-primitives`
  for genuinely new primitives (focus trap, positioning). See §5.
- **`constructor(owner: any, args: any)`** — 13 existing components type the
  owner `any`, including the `text-input.gts` / `number-input.gts` exemplars
  §3 tells you to follow. New code writes
  `import type Owner from '@ember/owner'` and
  `constructor(owner: Owner, args: Signature['Args'])`; don't carry the `any`
  along when you copy one of those files.

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

### ❌ Pitfall 2: Transliterating React Patterns

React's `useEffect`, `useRef`, `useState` rarely need a direct equivalent.
Copying their *shape* into Ember produces a component that recomputes at the
wrong times and leaks on teardown.

**Solution**: translate the intent, not the code — often Ember's reactivity
and CSS already cover it, and where they don't there's a specific idiom for
it. See "Idiomatic Ember Patterns" above for the mapping.

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

### ❌ Pitfall 5: New Icons Used in Docs Examples Don't Render

`docs-app` live-preview examples (the `gjs live preview` code blocks under
`docs-app/app/templates/`) run through `kolay`, which resolves each import
specifier in the example's `<template>` against a **static** map built in
`docs-app/app/routes/application.ts` — it does not do real module resolution.
For `carbon-components-ember/icons`, that map only exposes the specific
icon components someone has explicitly imported and listed:

```typescript
// docs-app/app/routes/application.ts
import {
  Bookmark,
  Task,
  // ...
  Folder,
  Document,
} from 'carbon-components-ember/icons';

// ...
resolve: {
  'carbon-components-ember/icons': Promise.resolve({
    Bookmark,
    Task,
    // ...
    Folder,
    Document,
  }),
}
```

If a docs example imports an icon (e.g. `Folder`, `Document`) that isn't in
both places, the example renders with no visible error — the icon is simply
absent, which is easy to mistake for a CSS or component bug instead of a
missing registration.

**Solution**: whenever a new docs example introduces an icon that isn't
already in this map, add it to *both* the `import` and the `resolve` object
in `docs-app/app/routes/application.ts`. Actually load the docs page (or an
isolated render test asserting the icon's SVG is visible) to confirm — don't
rely on `pnpm build`/`pnpm lint`, since neither catches this.

## Component Implementation Checklist

- [ ] Review React implementation at GitHub
- [ ] Check Storybook for visual reference
- [ ] Map each React construct to its Ember idiom (see the translation table above)
- [ ] Create `.gts` file in `carbon-components-ember/src/components/`
- [ ] Define TypeScript signature — `Args` if it takes args, `Element` if it spreads `...attributes`, `Blocks` only for blocks it actually yields; no `any` anywhere in it
- [ ] Use `cds--` prefix for CSS classes
- [ ] Match React prop names (as `@args`)
- [ ] Export in `carbon-components-ember/src/components/index.ts`
- [ ] Create test file in `test-app/tests/components/`
- [ ] Build: `cd carbon-components-ember && pnpm build`
- [ ] Test: `cd test-app && pnpm test`
- [ ] If a docs example uses an icon, register it in `docs-app/app/routes/application.ts` (see Pitfall 4) and verify it actually renders

## Simplification Guidelines

The everyday translations. For the harder cases — contextual components,
components-as-args, controlled/uncontrolled, refs, portals, debouncing — see
"Idiomatic Ember Patterns" above.

1. **State**: Use `@tracked` instead of `useState`
2. **Effects**: Often not needed - Ember's reactivity handles it; when real
   DOM work is unavoidable, write a modifier
3. **Refs**: Usually not needed - use `{{on}}` and modifiers
4. **Callbacks**: Use `@action` methods
5. **Children**: Use `{{yield}}` blocks; yield contextual components rather
   than inspecting what was passed in
6. **Conditionals**: Use `{{#if}}` instead of `&&`
7. **Lists**: Use `{{#each}}` instead of `.map()`

"Simple" means *fewer moving parts for the consumer*, not fewer lines in the
component. Reaching for the right idiom (a modifier, a yielded component, a
restartable task) is a simplification even when it's more code than an
inline `setTimeout` — it's the ad-hoc version that ends up complicated, in
the form of teardown bugs and props that only work in one direction.

## Key Resources

- **Carbon React**: https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components
- **Carbon Storybook**: https://react.carbondesignsystem.com/
- **Ember Guides**: https://guides.emberjs.com/

---

Last Updated: 2026-08-06

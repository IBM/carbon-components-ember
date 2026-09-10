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
Reach For" list below. For the yielding half of the pattern,
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

**Gotcha: always pass `@size` (and an inert `@svgClass`) when invoking a
`renderIcon`-style arg.** This addon's `Icon` base component
(`components/icon.gts`) defaults to a 24px SVG and adds its own 5px margin
unless `@size`/`@svgClass` are passed — so a bare `<@renderIcon />` renders
oversized and misaligned inside whatever small (usually 16px) box the
surrounding component gives it. Carbon React always passes an explicit size
to these icons (e.g. Tabs' `Tab.tsx` does `<Icon size={16} />`); do the same
here:

```gts
{{! WRONG — renders a 24px icon with a stray 5px margin in a 16px box }}
<@renderIcon />

{{! RIGHT — matches Carbon's spec size and neutralizes the default margin }}
<@renderIcon @size='16' @svgClass='cds--component__icon-svg' />
```

The `@svgClass` only needs to be *some* class that isn't otherwise styled —
its job is to opt out of `Icon`'s default `.icon` class (which carries the
margin), not to add real styling. This exact bug has recurred more than
once (Tag's custom icon overflowing its box, Tabs' `renderIcon` rendering at
24px instead of 16px) — check icon size/alignment against real Carbon styles
whenever you add a `renderIcon`/`decorator`/`slug`-style arg.

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
task. The rest of that file still contradicts this document in places — it
mutates tracked state during render with `{{this.setValue @value}}`, types
`onChange?(value: any)` in its signature, and adds a `document` `mousedown`
listener in `activate()` that is only removed from inside the listener
itself, so it leaks when the component is torn down while active. (The task
is now driven directly from the input's own `input`/`change` handler rather
than a `did-update`, as this section already recommends — see "What NOT to
Reach For" below.)

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
  It observes render rather than state, doesn't compose, and has no teardown
  story. Write a real modifier instead (§4). As of the 2026-09-09 audit,
  13 components still imported it; `checkbox.gts`, `code-snippet.gts`,
  `list.gts`, `ordered-list.gts`, `search.gts`, `toggletip.gts`,
  `slider.gts`, `data-table.gts`, `pagination.gts`, `select.gts`, and
  `charts/-components/chart.gts` have since been migrated off it. 3
  components still import it: `popover.gts`, `select.gts`, `tooltip.gts`.
  Migrating one of these to a real modifier while you're already touching
  it for something else is in-scope cleanup, not scope creep — don't do a
  drive-by rewrite of an unrelated file just to cross it off this list.
- **An ad-hoc `willDestroy()` lifecycle override** instead of
  `registerDestructor` or a modifier's own teardown function (see §6). Two
  components did this; both are now fixed — `ordered-list.gts`'s was
  replaced with a modifier teardown, and `charts/-components/
  tabular-data.gts` moved its `removeDataset` cleanup into a
  `registerDestructor` call in its constructor.
- **`A()` / `NativeArray` / `pushObject` / `removeObject`** and `set()` from
  `@ember/object`. Also present in older components. New code uses plain
  arrays/objects reassigned through `@tracked`. The legacy `bxClassNames`
  class decorator (built on this — `A()` plus string-coerced `=== 'true'`
  boolean checks) has been retired as of the 2026-09-09 mechanical cleanup:
  `icon.gts` and `button.gts`, its last two callers, now each have a plain
  `get classes()` getter pushing onto an array and joining it, matching
  every other component that builds a conditional class list (see
  `tag.gts` for a representative example), and `bxClassNames`/`classPrefix`
  have been deleted from `utils/decorators.ts` entirely. Don't reach for
  either in new code.
- **Classic `Component` + separate `.hbs`** — everything here is `.gts` with
  `<template>`.
- **`this.element` / direct DOM queries from a getter** — Glimmer components
  have no element; go through a modifier.
- **Re-implementing an overlay primitive** — check the addon's own components
  first (`<Portal>`, `<Popover>` / `<PopoverContent>`), then `ember-primitives`
  for genuinely new primitives (focus trap, positioning). See §5.
- **Re-implementing "close on outside click"** — fixed (2026-09-09).
  `popover.gts` and `toggletip.gts` used to each independently wire their
  own `document.addEventListener('click', ...)` (plus, in `toggletip.gts`,
  a `window` `blur` listener), with subtly different semantics (capture
  phase vs. not). Both now use the shared `closeOnOutsideClick` modifier in
  `modifiers/close-on-outside-click.ts` (`{ capture, onWindowBlur }`
  options cover the two differing behaviors); reach for that modifier
  instead of adding a third bespoke copy elsewhere.
- **`constructor(owner: any, args: any)`** — as of the 2026-09-09 mechanical
  cleanup, no component in this codebase types the owner `any` anymore; the
  last 12 (`time-picker.gts`, `text-area.gts`, `slider.gts`, `popover.gts`,
  `fluid-text-input.gts`, `progress-indicator.gts`, `tooltip.gts`,
  `number-input.gts`, `password-input.gts`, `text-input.gts`,
  `time-picker/time-picker-select.gts`, `ui-shell/-header-container.gts`)
  were fixed to match the `text-input.gts` / `number-input.gts` exemplars §3
  tells you to follow. New code writes `import type Owner from
  '@ember/owner'` and `constructor(owner: Owner, args: Signature['Args'])`;
  don't reintroduce `any` here.

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

### ❌ Pitfall 5 (stale, kept for history): New Icons Used in Docs Examples Don't Render

This used to be a real trap: `docs-app/app/routes/application.ts` resolved
`carbon-components-ember/icons` in `kolay`'s `modules` map against a
hand-maintained list of explicitly imported icon components, so any icon a
docs example used but that list didn't mention silently rendered nothing.

As of the current `application.ts`, that hand-maintained list is gone —
icons resolve via a wildcard `import * as Icons from
'carbon-components-ember/icons'` (wrapped in `trackedObject(Icons)` and
handed to `kolay` as-is), so every exported icon component Just Works in a
docs example with no separate registration step. If you ever see this
per-icon-registration pattern reintroduced, treat it as a regression, not
something to imitate.

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
- [ ] If a docs example uses an icon, load the docs page (or an isolated render test) and confirm it actually renders — icons no longer need manual registration (see Pitfall 5), but this is still the only way to catch a genuinely missing/misnamed export

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

## Known Codebase Debt (audit, 2026-09-09)

An audit of `main` against this document's own rules — modifiers vs.
`did-insert`/`did-update`/ad-hoc `willDestroy`, dynamic `import()` hygiene,
duplication, and oversized functions/templates — found the codebase mostly
compliant, with a small number of concrete, named exceptions. Those are
folded into "What NOT to Reach For" and Pitfall 5 above rather than repeated
here; this section records the two findings that didn't fit either list, and
the overall verdict on the two clean areas so a future audit doesn't have to
re-derive them from scratch.

- **Dynamic `import()`: zero occurrences in tracked source.** The only
  `import()` calls in this addon are inside the generated, `.gitignore`d
  `src/components/icons/**/*.ts` files (one lazy import per icon size,
  loaded through `TrackedPromise` — see the translation table above) — those
  files don't exist in a fresh checkout until `createIconIndex()` runs (see
  `scripts/create-files.mjs`), so they won't show up in a plain `grep` of a
  clone. This is the *only* legitimate use of a dynamic import in this
  codebase; a hand-written component reaching for `import()` instead of a
  static import is not following an established pattern here and should be
  questioned.
- **`slider.gts`'s `<template>` block duplicated its lower/upper-handle
  markup wholesale — fixed (2026-09-09).** The two handle SVG pairs and the
  two text-input wrapper blocks differed only in a `--lower`/`--upper` class
  suffix and which arg each read, so they're now two private sub-components,
  `slider/-thumb.gts` and `slider/-text-input.gts`, each invoked twice from
  `slider.gts` with the differing bits already resolved into plain args —
  the same shape as `tree-view/-node.gts` or `data-table/-header.gts`.
- **Not a problem, checked directly rather than assumed:** the number of
  overly-long *methods* (as opposed to templates) is small. Several
  candidates that looked suspicious from a rough line-count scan turned out,
  on reading, to be either misattributed (a getter or arrow-function class
  property the scan's regex didn't recognize, inflating the apparent gap to
  the next method) or genuinely justified — e.g. `date-picker.gts`'s
  ~110-line `attachFlatpickr` modifier builds a real third-party widget's
  config across three date-picker modes and is already broken up with
  explanatory comments for each non-obvious branch, not accidental
  complexity. Don't trust a bare line-count heuristic here; read the
  candidate before flagging it.

None of the above were fixed in place as part of the audit itself —
migrating 13 components off `@ember/render-modifiers`, unifying the two
outside-click implementations, and de-duplicating `slider.gts`'s template
are each a real, independently-reviewable change, not something to bundle
into a documentation update. They're tracked as follow-up todos instead.
Retiring `bxClassNames` and fixing the 12 `constructor(owner: any)`
components were small enough, mechanical enough cleanups to do as their own
pair of dedicated follow-up PRs shortly after (2026-09-09, #842 and #843
respectively) — see the "What NOT to Reach For" entries above, now updated
to reflect both are done. The "simpler" half of the render-modifiers
migration (`checkbox.gts`, `code-snippet.gts`, `list.gts`,
`ordered-list.gts`, `search.gts`, `toggletip.gts`, plus `ordered-list.gts`'s
`willDestroy`) was also done as its own follow-up (2026-09-09) — see the
"What NOT to Reach For" entries above, now updated to reflect the remaining
counts. `slider.gts` was migrated off `@ember/render-modifiers` and had its
template de-duplicated in the same follow-up PR, since both changes touched
the same file — see the "What NOT to Reach For" entries above and the debt
bullet above, now updated to reflect both. `popover.gts` was migrated off
`@ember/render-modifiers` and its outside-click handling was unified with
`toggletip.gts`'s into the shared `closeOnOutsideClick` modifier in a
further follow-up PR, since both changes touched the same file — see the
two relevant "What NOT to Reach For" entries above, now updated to reflect
both.

## Porting Carbon AI Chat (`@carbon/ai-chat-components`)

Carbon AI Chat (https://github.com/carbon-design-system/carbon-ai-chat) is a
separate, much larger initiative from the Carbon React parity work above:
it's a ~3,000-file monorepo, not a single component. The **port target is
`@carbon/ai-chat-components`** — a framework-agnostic Lit widget library
under `packages/ai-chat-components/src/components` (~20 components:
`audio-player`, `card`, `carousel`, `chain-of-thought`, `chat-button`,
`chat-history`, `chat-shell`, `code-snippet`, `feedback`, `file-uploads`,
`launcher`, `markdown`, `processing`, `prompt-line`, `reasoning-steps`,
`table`, `toolbar`, `truncated-text`, `video-player`, `workspace-shell`) —
**not** `@carbon/ai-chat`'s React app or its `<cds-aichat-container>` Lit
shell, which mounts React into shadow DOM rather than providing a
framework-native implementation to build on.

`scripts/parity-check.mjs` tracks this as its own `carbon-ai-chat` source
(see the `SOURCES` array), independent of the `react` source. Its
`nameToEmberExport` maps upstream's kebab-case directory names to PascalCase
1:1 (`chat-shell` → `ChatShell`, no `AiChat`-prefix) — export new components
under exactly that name from `index.ts` or the tracker will report a false
"missing".

### Where to get the real API

Read the actual shipped **`custom-elements.json`** from the published npm
package (`@carbon/ai-chat-components`) — it's Lit's own auto-generated,
precise machine-readable manifest of every component's props/attributes/
events, far more reliable than Storybook or prose docs. It's easiest to get
at via `npm pack`, not `WebFetch`/unpkg (unpkg 404s on this package's
`dist/`):

```bash
npm pack @carbon/ai-chat-components@latest --registry https://registry.npmjs.org/
tar xzf carbon-ai-chat-components-*.tgz package/custom-elements.json
```

The manifest alone isn't enough for **styling** — the npm package's own
`scss/` folder only has shared tokens; each component's actual `.scss` is
pre-compiled into a minified `es-custom/components/*/src/*.scss.js` blob
(Lit `css` tagged template, common tokens duplicated into every file), not
usable as SCSS source. Fetch the real, human-authored `.scss` straight from
GitHub instead (`gh api repos/carbon-design-system/carbon-ai-chat/contents/
packages/ai-chat-components/src/components/<name>/src/<name>.scss`).

### Decisions made porting `launcher` + `chat-shell` (the first vertical slice)

1. **Location**: `carbon-components-ember/src/components/ai-chat/`. No new
   top-level package/directory — the root `.gitignore`'s `!carbon-components-ember`
   `/**/*` allowlist already covers it, so nothing extra was needed there
   (see the `.gitignore wildcard blocks new top-level dirs` gotcha, which
   *would* apply to a genuinely new top-level directory but doesn't here).
2. **Filename collisions**: checked with the `find ... | sort | uniq -d`
   command from Pitfall 4 before naming anything; `launcher.gts` and
   `chat-shell.gts` were both free. The same check will matter again for
   later batches — `card`, `table`, `toolbar`, and `code-snippet` (which
   already exists here as a Carbon React component) are flagged as future
   collision risks.
3. **Styling**: ported into this addon's own SCSS, the same way the
   existing `src/styles/index.scss` already patches gaps `@carbon/styles`
   doesn't cover (see its own comments) — new partials under
   `src/styles/ai-chat/`, `@use`d from `index.scss`, published the same way
   as everything else via the `carbon-components-ember/styles.scss`
   subpath export docs-app already consumes. Selectors are adapted from
   upstream's shadow-DOM `:host(...)` to plain classes (`.cds-aichat-shell`,
   `.cds-aichat-launcher`) since this addon renders in light DOM like every
   other component here; colors reference `@carbon/styles`' compiled
   `--cds-*` custom properties directly (the same fallback pattern
   upstream's own AI-shadow tokens use) rather than its Sass theme module,
   whose internal variable names have changed shape across versions. Only
   the structural/layout SCSS needed by what's actually rendered was
   ported — not upstream's responsive workspace-panel breakpoint rules or
   its per-instance dynamic corner stylesheet (see point 4). Upstream's
   further custom-property theming/override layer
   (`globals/scss/_tokens-layout.scss`'s `get-var()` indirection) was not
   reproduced; layout constants were hardcoded from its documented
   defaults instead — revisit if a later component needs runtime overrides.
4. **Controlled/uncontrolled state**: checked the actual manifest before
   assuming anything, and it settles the question cleanly — **neither
   component has an open/closed concept for §3's controlled/uncontrolled
   rule to apply to.** `cds-aichat-launcher` is stateless (fires a toggle
   event, has no `open` property at all); `cds-aichat-shell`'s
   `show-history`/`show-workspace` are plain reflected booleans with **no**
   `default-*` counterpart and **no** change event — the host application
   owns visibility entirely, always. Per §3's actual rule ("parity means
   matching React's prop list, don't collapse two props into one arg" /
   "don't invent state upstream doesn't have"), the right port is a plain
   always-controlled `@showHistory`/`@showWorkspace` boolean with **no**
   `@defaultShowHistory` — inventing one would add public API upstream
   doesn't have, not achieve parity with it.

### Translation notes worth reusing for later batches

- **Upstream's kebab-case slot names become camelCase named blocks**, not
  hyphenated ones (`header-after` slot → `<:headerAfter>` block) — this
  codebase has no existing precedent for a hyphenated Glimmer block name,
  so camelCase is the safe, idiomatic default. Document the upstream slot
  name in the block's JSDoc so the mapping is discoverable.
- **`{{has-block "name"}}` replaces Lit's `SlotObserver`.** Upstream detects
  slotted content with a `MutationObserver` to drive `has-content` layout
  classes; Ember doesn't need that — whether a caller passed a given named
  block is known at render time via `has-block`, no observer required.
- Where upstream's public API is simply incomplete or inconsistent (e.g.
  `cds-aichat-launcher`'s `open-label` attribute is declared but never
  actually read by its own computed aria-label, in every released version
  through 1.9.0), the port matches upstream's actual behavior rather than
  "fixing" it, and says so in a comment — same principle as matching
  Carbon React's behavior over its intent elsewhere in this doc.
- Port the component's **public surface**, not its internal managers.
  `chat-shell` alone pulls in `ResizeObserverManager`, `CornerManager`,
  `PanelManager`, `InitializationManager`, `WorkspaceManager` and
  `AriaAnnouncerManager` — none of those are part of the public API and
  none were ported. Their args are still accepted/typed where they're
  genuinely public props (e.g. the `@*Announcement` strings), even where
  the port doesn't yet wire real behavior to them, and the gap is
  documented in the component's own class doc, not just here.

### Batch 1 (`card`, `table`, `truncated-text`) — export-name collisions

`card`, `carousel`, `table`, `markdown` and `truncated-text` were the next
scheduled batch. `carousel` and `markdown` were split into their own
follow-up todos instead — each introduces a genuinely new runtime
dependency (`@carbon/utilities`'s `initCarousel`, and `markdown-it` +
`dompurify` respectively) that deserves its own review, the same reason
DatePicker's `flatpickr` dependency got split out earlier. `card` and
`truncated-text` shipped alongside `table`.

**The export-collision problem, and the fix:** `scripts/parity-check.mjs`
diffs each source against the *same* flat `index.ts` export list (see
`emberComponents` in the script) — so a plain PascalCase `nameToEmberExport`
for `carbon-ai-chat` isn't just a filename risk (Pitfall 4), it can silently
satisfy the **`react`** source's own "missing" check too. Exporting a plain
`Card` here would close out the react source's real, still-open `Card` issue
(#774) despite no React `Card` ever having been implemented — same for
`truncated-text` (#749) and `code-snippet` (already implemented as a real
Carbon React component, `CodeSnippet`). Checked each upstream `ai-chat-
components` directory name against Carbon React's live top-level component
list (`gh api repos/carbon-design-system/carbon/contents/packages/react/src/
components --jq '.[].name'`) before naming anything — `card` (`Card`),
`truncated-text` (`TruncatedText`) and `code-snippet` (`CodeSnippet`) collide;
`carousel`, `table` and `markdown` don't (checked ahead of time for the two
split-out todos too, so whoever picks them up doesn't have to re-derive this).

Fixed via a small override map, not a blanket prefix — `Launcher`/`ChatShell`
(#838) didn't collide and stay unprefixed so that PR's export names don't
churn:

```js
// scripts/parity-check.mjs
const AI_CHAT_EXPORT_OVERRIDES = {
  card: 'AiChatCard',
  'truncated-text': 'AiChatTruncatedText',
  'code-snippet': 'AiChatCodeSnippet', // reserved for the code-snippet batch
};
// ...
nameToEmberExport: (name) => AI_CHAT_EXPORT_OVERRIDES[name] ?? kebabToPascalCase(name),
```

Matching Ember export names: `AiChatCard` (`ai-chat/card.gts`),
`AiChatCardFooter` (`ai-chat/card-footer.gts`, upstream's `cds-aichat-card-
footer` sub-widget — no collision, but prefixed for family consistency with
`AiChatCard`), `AiChatCardSteps` (`ai-chat/card-steps.gts`, same reasoning),
`Table` (`ai-chat/table.gts`, no collision, stays unprefixed) and
`AiChatTruncatedText` (`ai-chat/truncated-text.gts`). Checked with Pitfall
4's `find ... | sort | uniq -d` command first — none of these five
basenames collided with anything else in the tree, so the export name and
the filename didn't need to diverge.

**`table` reuses this addon's own `Search`/`Pagination`, not upstream's DOM
tricks.** Upstream's Lit `cds-aichat-table` hand-toggles a `data-hidden`
attribute on rendered `cds-table-row` elements for pagination and does its
own filter/sort bookkeeping, because it renders through Carbon Web
Components' real custom elements. None of that DOM-poking is part of the
public surface; the port instead uses this addon's own `Search` (for
filtering) and `Pagination` (for paging) components and plain tracked
getters (`filteredRows` → `sortedRows` → `pagedRows`) for sort/filter/page
state — always-internal, since the manifest confirms upstream has no
`@onChange`-style callback for any of it either. One real trap hit wiring
`Pagination` in: its own `itemsPerPage` field defaults to a hardcoded `10`,
set on construction, *not* derived from `@state` — `@state` only syncs on
the `didUpdate` modifier, which never fires on initial insert. `Pagination`'s
own `didInsert`-triggered first `pageChanged()` call therefore always
reports `10` regardless of what's passed in initially, silently overriding
`AiChatTable`'s own `@defaultPageSize` (default `5`, since upstream's real
default is derived from a DOM-width measurement this port doesn't
reproduce). Fixed with a one-shot guard in `changePage` that corrects just
that first report back to the real default, then trusts every later call
(a genuine user page/size change) as-is — worth knowing about for any other
component that wires up `Pagination` with a non-default initial page size.

**Testing `AiChatTruncatedText`'s overflow detection needs its own inline
`-webkit-line-clamp` rule in the test, not just `@carbon/styles`.** The
component's real clamping CSS lives in this addon's own `src/styles/
ai-chat/_truncated-text.scss`, which isn't part of `@carbon/styles`'
prebuilt bundle (the one already `?inline`-imported elsewhere in this test
suite) and isn't reliably loaded by test-app's dev build either (per the
already-documented "test-app dev-mode build doesn't reliably load a new
component's real SCSS" gotcha) — so `scrollHeight`/`clientHeight` never
differ and `isOverflowing` never flips true. Rather than fight the addon's
own SCSS import path from test-app, the test defines the handful of rules
the component actually needs (`display: -webkit-box`, `-webkit-line-clamp:
var(--line-clamp-value, 1)`, `overflow: hidden`) directly in its own scoped
`<style>` block. See `test-app/tests/components/ai-chat/truncated-text-
test.gts`.

**Don't feed a component's own debounced `@onChange` value back into it as
a controlled `@value`, even when the underlying value is otherwise correct.**
`AiChatTable`'s search box originally passed both `@value={{this.filterTerm}}`
*and* `@onChange={{this.search}}` to `Search`. `Search`'s own template calls
`this.setValue(@value)` on every render to mirror the arg into its internal
`@tracked value`, and separately re-runs its 200ms-debounced `onChange` task
via `{{didUpdate (perform this.runSearch) this.value}}` whenever that
internal value changes — so a controlled `@value` that merely echoes back
what the user just typed adds an extra round trip through both of those on
every keystroke. It never actually diverged in manual testing here, but it
measurably slowed `fillIn`-based tests (one hit the harness's 60s timeout)
and left stray un-torn-down DOM behind that cascaded into an unrelated,
later `DataTable` test's failure (its `document.querySelectorAll` isn't
scoped to the test's own container). Fixed by dropping `@value` entirely —
`Search` already owns its own display value; the parent only needs
`@onChange`. `data-table.gts`'s own `-search-input.gts` wrapper appears to
control `@value` similarly and hasn't shown symptoms, but wasn't touched
here — out of scope for this batch.

**Review round 2 fixes (still batch 1):** two SCSS gaps found by diffing
against upstream's real `.scss` source (not caught by build/glint/tests,
which don't check CSS coverage at all).

- Upstream's `card.scss`/`card-footer.scss`/`table.scss` all
  `@include rounded-modifiers` (`globals/scss/_modifiers.scss`) — a generic
  mixin driving `[data-rounded="..."]` corner rounding across a full
  stacked/non-stacked/positional matrix. `AiChatCardFooter` already
  rendered `data-rounded='bottom'`/`'bottom-right'` (the only two values
  this port ever produces), but `_card.scss` had zero matching CSS, so
  those corners were never actually rounded. Rather than port the full
  generic mixin, `_card.scss` now hand-writes just those two concrete
  cases (rounding the footer's first/last action to match the card's own
  radius, both corners on the single last button once stacked). `AiChatCard`
  and `AiChatTable` themselves don't expose upstream's *externally-set*
  `data-rounded` attribute (used by an outer shell to override a nested
  card/table's corners) — documented as an intentional gap in both
  components' doc comments rather than silently missing, since nothing in
  this port provides that shell context yet.
- `AiChatTruncatedText`'s expand/collapse toggle (`tabindex="0"`,
  keyboard-operable) had no `:focus` style at all — a real a11y regression.
  Added a `2px solid var(--cds-focus)` outline directly (matching upstream's
  `@include focus-outline('outline')`) rather than importing the real Sass
  mixin, which needs `@carbon/styles`' Sass theme module and not just its
  compiled CSS custom properties, unlike everything else in this port. The
  tooltip-branch content div's matching upstream `:focus` rule was *not*
  reproduced — that div has no `tabindex` in upstream's own template
  either, so it's unreachable by keyboard there too (a pre-existing dead
  rule, same class as `_card.scss`'s already-documented
  `::slotted([slot='card-media'])`).

**Takeaway for later batches: build/glint/lint/tests passing does not mean
the ported SCSS actually matches upstream's CSS.** None of those checks
diff against the real stylesheet, so a batch can ship green and still be
missing real rules (dead attributes, missing focus states). Worth a
deliberate side-by-side read of each component's real `.scss` against the
ported partial before calling a batch done, not just after review flags it.

### PR #838 review follow-up: pagination dropdown padding, CSV export, ChatShell input

Three review comments on the `Launcher`/`ChatShell` PR (#838, which by then
also carried batch 1's `Card`/`Table`/`TruncatedText` — see above), all
verified with a real `DOCS_URL=versions/main pnpm build` + Playwright pass,
not just by reading code:

- **`AiChatTable`'s "Items per page" `Select` dropdown rendered with zero
  block padding on every option — a real, pre-existing `Select`/`Pagination`
  bug, not something this port introduced.** `.cds--list-box__menu-item__option`'s
  padding is computed from `--cds-layout-size-height-local`, a custom
  property `@carbon/styles` only ever sets on `.cds--list-box` (the trigger
  element). `Select` is built on `ember-power-select`, which wormholes its
  dropdown content out of that element's subtree into `document.body` by
  default (unless `@renderInPlace` is set) — so the portalled option rows
  never inherit the property, the `calc()` that depends on it is invalid,
  and every menu item renders with 0 block padding. Confirmed this
  reproduces identically on the plain `Pagination` docs page too (nothing
  ai-chat-specific), and confirmed it's unrelated to the docs site's shadow-
  DOM demo isolation (the property is simply absent from the wormhole's
  ancestor chain, shadow root or not). Fixed by re-declaring `.cds--list-
  box`'s own default (md) formula on `.ember-basic-dropdown-content
  .cds--list-box__menu` in `src/styles/index.scss` (right next to the
  existing `display: block` fix for the same selector) — `Select` never
  applies a `cds--list-box--<size>` variant class today, so the md default
  always matches what the trigger itself computes. Worth checking this fix
  still holds if `Select` ever grows real size-variant support.
- **CSV export ("all columns end up in first column") wasn't a formatting
  bug in `stringifyCSV` or `AiChatTable.download()` — both produce correct,
  RFC 4180 comma-delimited output**, confirmed byte-for-byte via a real
  Playwright download (no BOM, correct quoting, matches upstream's own
  `_handleDownload` exactly). The symptom is the classic Excel behavior:
  Excel picks a CSV's delimiter from the OS/Excel locale's list separator,
  not from the file's own content, so on any locale where that's a
  semicolon (common outside en-US), double-clicking a plain comma-delimited
  file dumps every column into column A. Fixed by prepending a `sep=,\n`
  line to the CSV content in `AiChatTable.download()` — Excel's own
  documented escape hatch to force comma parsing regardless of locale.
  Deliberately *not* added to `-csv.ts`'s `stringifyCSV` itself, which stays
  a byte-identical port of upstream's spec-compliant formatter (`sep=,` line
  isn't part of RFC 4180 and would corrupt output for any non-Excel CSV
  consumer) — the fix lives in the Ember-specific download glue instead.
- **ChatShell's input is deliberately out of scope, confirmed rather than
  assumed:** `ChatShell` owns no conversation/input state at all — the
  `input` named block is entirely caller-supplied, matching upstream, which
  has no `prompt-line` equivalent built into `cds-aichat-shell` either
  (`prompt-line` is its own separate, not-yet-ported ai-chat-components
  widget). No component-level change was needed or made. The docs demo
  *was* weak, though — its `<:input>` block was just a static `<p>Type a
  message…</p>`, not a real input — so it was upgraded to a real, typeable
  `TextInput` + `Button` (with a `trackedArray` message log in `<:messages>`
  to actually show sent messages appear), purely to make the demo honest
  about what a real integration looks like. This is a docs-only change; it
  doesn't imply `ChatShell` should grow its own input widget.

### `markdown` — dependency review and scope cuts

Split out from batch 1 (see above) for its own dependency review, the same
reason `carousel`'s `@carbon/utilities` dependency was split out. Shipped as
`Markdown` (`ai-chat/markdown.gts`) — no export-collision override needed,
confirmed via `gh api .../packages/react/src/components --jq '.[].name'`
(no React `Markdown`) and Pitfall 4's `find | uniq -d` (no filename
collision either).

**Dependency decision: real `markdown-it` + `dompurify`, not a pre-parsed-
HTML surface.** The alternative (accept already-parsed/sanitized HTML,
push sanitization onto the caller) was rejected: the task's own safety
requirement ("never render caller-supplied content without a sanitizer")
means an HTML-accepting surface still needs `dompurify` as a dependency, so
that option only saves `markdown-it` while deleting `markdown` — the
component's single central public prop, which §3 forbids collapsing away.
Matches the precedent already set by `flatpickr` (`DatePicker`) and
`@carbon/utilities` (`Carousel`): add the real dependency, reproduce
upstream's actual pipeline. `markdown-it-attrs`/`markdown-it-highlight`/
`markdown-it-task-lists` are **not** npm dependencies — they're upstream's
own vendored/forked plugin files at that path (`markdown-it-attrs` is
itself a from-scratch, deliberately restricted fork of a third-party MIT
plugin, allow-listing only `target`/`rel`/`class`/`id`), so they're ported
as source too (`-markdown-it-attrs.ts` etc.), matching `-csv.ts`'s existing
precedent for vendored non-dependency upstream source.

**Sanitization is unconditional — a deliberate divergence from upstream's
actual default, not a faithfulness gap.** Reading upstream's real
`createMarkdownIt` (not just the manifest) shows `html: !removeHTML`
(raw HTML parsing is *on* by default) combined with `sanitizeHTML`
defaulting to `false` — upstream's own default configuration renders raw
HTML found in the markdown source completely unsanitized. That's a real
XSS hole for the untrusted (user- or LLM-generated) chat content this
widget exists to render, and the task explicitly overrides faithfulness
here. This port always runs parsed output through `DOMPurify.sanitize()`
before injecting it (`-markdown-render.ts`'s `renderMarkdown`), regardless
of `@sanitizeHTML` — the arg is still accepted (for API parity) but is a
no-op; it does not gate the sanitizer. `@removeHTML` is unaffected and
matches upstream exactly (disables raw-HTML parsing at the markdown-it
level, on top of the sanitizer that always runs anyway). Verified with
tests that inject `<script>`, an `onerror` handler, and a `javascript:`
link — asserting the dangerous content/attribute is *absent*, not just
that the component renders — since build/glint/lint prove nothing about
sanitization.

**Scope cut, same "public surface, not internal managers" call as
`ChatShell`/`AiChatTable`:** upstream's real renderer
(`markdown-renderer.ts` + `markdown-token-tree.ts`, ~1,200 lines combined)
builds a diffed token tree and renders fenced code blocks and tables as
upstream's own not-yet-ported `cds-aichat-code-snippet`/`cds-aichat-table`
custom elements (copy/show-more/sort/filter/page behavior), plus exposes
`markdownItPlugins`/`customRenderers` extension points and ~15
`codeSnippet*`/`table*` label args. None of that is ported: fenced code
renders as plain `<pre><code>`, markdown tables as plain `<table>`
(styled via `_markdown.scss`), and the label/extensibility args aren't
accepted at all — they'd be dead public API with nothing to label. GFM
task-list checkboxes and `==highlight==` syntax *are* ported (both are
plain markup, not widgets); checkboxes render read-only (`disabled`) since
there's no `checklist.onToggle`-equivalent callback to wire an interactive
one to — upstream's own `cds-checkbox` tag is swapped for a plain
`<input type="checkbox">` via a markdown-it renderer-rule override, not
reproduced as an unstyled custom element. `@streaming` **is** made real
(a 100ms leading+trailing throttle via an `ember-modifier`, not
`did-update`), since upstream's own default streaming throttle is cheap
to reproduce without the diffing machinery behind it. A follow-up todo for
`markdownItPlugins`/`customRenderers` extensibility was deliberately not
scheduled inline here — pick it up if/when a real consumer needs it.

**Strict-mode TS note for anyone porting more upstream markdown-it code:**
upstream's own plugin/renderer TS isn't written against
`noUncheckedIndexedAccess` (which this repo's `tsconfig` enables) — expect
a wave of `TS18048`/`TS2532` "possibly undefined" errors on every
`tokens[i]`-style array index when porting more of it, fixed with `!`
non-null assertions at each site (already used elsewhere in this codebase,
e.g. `copy-button.gts`) rather than restructuring the ported logic.

### Batch 2 (`chain-of-thought`, `reasoning-steps`, `feedback`, `prompt-line`) — split, controlled/uncontrolled, and scope cuts

The originally-scoped batch also included `chat-history`, which was split
into its own follow-up todo instead: its manifest has ~10 sub-elements
(`history-shell`/`-header`/`-toolbar`/`-panel`/`-panel-items`/`-panel-item`/
`-panel-item-input`/`-panel-menu`/`-search-item`/`-loading`/`-delete-panel`),
materially larger than any single "component" shipped so far (batch 1's
`card`/`card-footer`/`card-steps` was 3 elements) and it wraps
`CDSSideNav`/`CDSSideNavItems` plus a real overflow-menu repositioning
concern — a dependency question worth its own review, not a size call made
lightly. None of `chain-of-thought`, `reasoning-steps`, `feedback`, or
`prompt-line` collide with a Carbon React component name or an existing
filename (checked both, per the batch-1 precedent above) — all four stay
unprefixed, no `AI_CHAT_EXPORT_OVERRIDES` entries needed.

**`chain-of-thought` and `reasoning-steps` are genuine controlled/
uncontrolled components, unlike `chat-shell`.** Unlike the launcher/
chat-shell slice (where §3's rule resolved to "always controlled" because
upstream had *no* open/closed concept at all), these two upstream widgets
implement their own real controlled/uncontrolled mechanism per step
(`open` + `controlled`, self-toggling on click unless `controlled` is set,
in which case a click only calls the toggle callback). Ported 1:1: each
step is a private sub-component (`ChainOfThoughtStep`/`ReasoningStep`,
same shape as `Accordion`'s `Item`) with `@open ?? internalTracked` as the
effective state and an internal write gated on `!@controlled` — and the
container yields the step pre-bound with `@controlled` via `WithBoundArgs`
(the `Layer` #460 pattern), so `<ChainOfThought @controlled={{true}} as
|Step|>` propagates to every step without the container needing to know
how many there are. Upstream's own `ChainOfThought`/`ReasoningSteps`
containers, by contrast, really are "always controlled" the same way
`chat-shell` is (no self-toggle logic at all, just a plain `@open` the
host sets) — the controlled/uncontrolled question only applies one level
down, at the step.

**Static vs. interactive header is resolved with `{{has-block}}`, not
upstream's live slot-occupancy sniffing.** Both step components render a
non-interactive (`&mdash;`) header when they have no body content, and
upstream decides that by inspecting live slotted DOM nodes (and auto-
closing an uncontrolled step whose content just got removed). `{{has-block}}`
is static per invocation in Ember, so that auto-close-on-empty behavior
has no equivalent here and isn't reproduced — a step either has a body
block or it doesn't, for its whole lifetime.

**Real gaps, documented in each component's own class doc, not silently
dropped:** `ChainOfThought`'s upstream `@onStepToggle` aggregates a
`chain-of-thought-step-toggled` DOM event bubbling up from *any* child
step — that relies on DOM-tree event bubbling with no clean equivalent for
a block-yielded child in Ember, so it's not reproduced; pass a step-level
`@onToggle` to each step instead. `ReasoningSteps`' `reasoning-animation-
start`/`-end` events and `markLastVisibleStep()` exist purely to feed
upstream's own (unported) message-list scroll manager and `data-last-item`
CSS hook — the latter has no matching CSS rule in upstream's own fetched
`.scss` either, a pre-existing dead hook, not something this port broke.

**`feedback`/`feedback-buttons` — plain-button category chips, disclaimer
via `Markdown`, and a constructor-seeded initial-render gotcha.** Upstream's
`cds-aichat-feedback` category chips are `cds-selectable-tag`, a variant
this addon has no equivalent for (Carbon React's own `Tag` has no
selectable state either) — ported as plain `<button>`s toggling a
`--selected` modifier class rather than introducing a new shared
`SelectableTag` component for a single caller. The disclaimer string
renders through this same initiative's own `Markdown` port
(`ai-chat/markdown.gts`), matching upstream's use of its sibling
`cds-aichat-markdown` custom element rather than a raw `{{@disclaimer}}`
interpolation. The submit button is disabled from the start only when
`@disclaimerCheckbox` is passed (gating submission on that checkbox); when
omitted, no checkbox renders and submit is enabled immediately, matching
upstream's own default. `FeedbackButtons` drops upstream's
direction-based tooltip alignment flip (`top-start`/`top-end` depending on
document direction) since this addon's `Tooltip` already has an
`@autoAlign` that repositions to stay in-viewport regardless of direction,
making the upstream flip redundant here.

`@initialValues` seeds (and, on later identity change, resets) `Feedback`'s
text area and selected categories. The first version wired this seeding
*only* through `{{didUpdate this.applyInitialValues @initialValues}}` —
missed that `@ember/render-modifiers`' `did-update` explicitly never runs
on initial render, so a consumer passing `@initialValues` at mount (e.g. a
read-only panel showing previously-submitted feedback, exactly the shipped
docs demo's second example) rendered an empty, unselected panel instead.
Fixed by also calling `applyInitialValues()` once from the constructor;
`didUpdate` is kept for the "reset on a later identity change" behavior
only. Worth checking for the same gap in any other component here that
uses `did-update` to seed from an arg rather than purely to react to
changes after mount — `did-update`-only initialization is a recurring trap
worth grepping for.

**`prompt-line` is textarea-mode only — the Tiptap rich editor is left for
a follow-up, same reasoning as `flatpickr`/`@carbon/utilities`/
`markdown-it`.** Confirmed from the real source (not just the manifest)
that `rich: false` is the actual default and the textarea surface is a
fully separate, Tiptap-free code path (`TextareaController` in upstream's
`prompt-line-textarea-runtime.ts`) — only loaded into Tiptap when `rich` is
set or `ensureEditor()` is called. This port implements exactly that
default textarea path as a plain `.gts` component: a `<textarea>` +
hidden-mirror auto-grow trick (ported as static SCSS instead of upstream's
runtime CSSOM-injection helper, which exists only for its shadow-DOM/CSP
constraint — irrelevant in this addon's light-DOM rendering), an
`ember-modifier`-driven `@content` sync (mirroring `DatePicker`'s
`syncValue` pattern: only re-runs when the tracked `@content` positional
arg actually changes, so it can't clobber the caret while the user is
mid-keystroke), and the same Enter/Shift-Enter/Mod-Enter/Escape keymap.
Deliberately **not** accepted as no-op args (unlike `chat-shell`'s benign
unwired `@*Announcement` strings — see the translation notes above):
`@rich`, `@extensions`, `getEditor()`/`ensureEditor()`, `undo()`/`redo()`,
`insertContent()`, `setTextSelection()`. An arg that silently does nothing
is worse API than one that doesn't exist; all of it is left for whoever
picks up the rich-mode follow-up. Also not reproduced: the keyboard-vs-
pointer focus-ring distinction (`cds-aichat-prompt-focus`'s `keyboard`
detail, which `PromptLineShell`'s own CSS keys off of) and the
`cds-aichat-prompt-typing`/`cds-aichat-prompt-keydown` events — both exist
upstream to keep a typing indicator and the textarea↔rich transfer
contract in sync, and there's nothing to keep in sync with only one
editing surface. A native `autofocus` attribute is disallowed by this repo's own
`ember-template-lint` config (`no-autofocus-attribute`) — reproduced
upstream's actual behavior instead (a deferred microtask `focus()` call
after mount, not the native attribute) via a small modifier.

**`PromptLineShell`'s five kebab-case upstream slots become six camelCase
named blocks** (the extra one, `editor`, is unnamed in upstream's own
JSDoc but is a real slot in its implementation) — `<:messageActions>`,
`<:fileUploads>`, `<:autocompleteContent>`, `<:fieldMessaging>`,
`<:sendControl>`. `_hasMessageActions`'s slot-occupancy check becomes
`{{has-block "messageActions"}}`; `_hasFileUploads` (which upstream derives
from a `MutationObserver` watching the slotted file-uploads element's own
`has-uploads` attribute — genuinely dynamic content a block-presence check
can't see) becomes a plain `@hasFileUploads` arg instead, passed straight
through from whatever tracks the upload list.

## Key Resources

- **Carbon React**: https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components
- **Carbon Storybook**: https://react.carbondesignsystem.com/
- **Carbon AI Chat**: https://github.com/carbon-design-system/carbon-ai-chat
- **Ember Guides**: https://guides.emberjs.com/

---

Last Updated: 2026-09-09

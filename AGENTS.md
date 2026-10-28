# Agent Context and Development Guide

This document provides essential context and patterns for AI agents (like Bob Shell) working on the carbon-components-ember codebase.

## Project Overview

**carbon-components-ember** is an Ember.js implementation of IBM's Carbon Design System components, maintaining parity with the React implementation.

- **Repository**: <https://github.com/IBM/carbon-components-ember>
- **Carbon React Reference**: <https://github.com/carbon-design-system/carbon/tree/main/packages/react>
- **Carbon Storybook**: <https://react.carbondesignsystem.com/>
- **Technology**: Ember.js with Glimmer TypeScript (.gts files)
- **Skills for this repo**: procedures for one kind of task live in `.claude/skills/<name>/SKILL.md`; agents that support skills load them when relevant, and any agent can read them. `implement-component` (add or align a component), `upgrade-carbon`, `port-ai-chat-component`. (The skill under `carbon-components-ember/skills/` is a different one: it ships to apps.)

---

## Component Implementation Patterns

### 1. Basic Component Structure

All components follow this pattern. The license header is always the first thing in the file; new imports go below it.

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

### 3. Component Styles

Styles Carbon doesn't provide live next to the component (`icon.scss` beside `icon.gts`), and every component that uses them imports them explicitly (`import './icon.scss';`). Name their classes `cds--ember-<component>`. The build compiles every imported stylesheet into `dist/styles.css` (rollup-plugin-sass), the one stylesheet apps load after Carbon's, and leaves the imports out of the published JS and types, so apps need no Sass.

### 4. Component Arguments vs Props

Ember uses `@args` instead of React props:

```typescript
// React
<Button size="lg" kind="primary" />

// Ember
<Button @size="lg" @kind="primary" />
```

Keep Carbon React's prop names and values. Props React inherits from the HTML element (`type`, `onClick`, ...) are plain attributes and `{{on}}` through `...attributes`; take one as an argument only when the component needs its value, as Button does `disabled`. `pnpm --filter dom-parity args --component <Name>` lists a component's differences from React's props, and CI fails on new ones (see `dom-parity/known-arg-differences.json`). Record a deliberate one, such as an attribute Carbon re-declares that the component doesn't need, with its reason in `dom-parity/accepted-arg-differences.json`.

### 5. Event Handling

Use `{{on}}` instead of React's event props, on components too. A component passes it on through `...attributes`, which must sit on the element Carbon React spreads its rest props onto, where React puts the handler:

```typescript
// React
<Button onClick={save}>Save</Button>

// Ember
<Button {{on "click" this.save}}>Save</Button>
```

Take a callback argument such as `@onClick` only when the component calls it itself: with a payload (NumberInput's steppers, Modal's secondary buttons, AI Chat's FeedbackButtons), from another element or event (FileUploader's remove buttons, MenuItem on Enter and Space), or holding it back (Link while disabled). The arg check skips React's event props that take the event; one it still flags, typed without the event like FileUploaderDropContainer's `onClick`, goes in `dom-parity/accepted-arg-differences.json` with its reason.

### 6. Dynamic Element Types

Use the built-in `element` keyword (Ember 7.1+); it needs no import:

```gts
<template>
  {{#let (element this.elementType) as |Tag|}}
    <Tag class="my-class">{{yield}}</Tag>
  {{/let}}
</template>
```

---

## Idiomatic Ember Patterns (Prefer These Over Transliterating React)

Parity means matching Carbon React's **public API surface and behaviour**, not its implementation strategy.

| Carbon React construct | Idiomatic Ember equivalent | Live example in this repo |
| --- | --- | --- |
| `children` inspected/cloned | Yield a contextual component pre-bound (`WithBoundArgs`) or typed subcomponent (`typeof SubComponent`) | `components/data-table.gts`, `components/tree-view.gts` |
| Component passed as a prop | A `ComponentLike` arg, invoked as `<@renderIcon />` | `components/link.gts` |
| A router `Link` passed as `as`/`element` | `@route`, `@models` and `@query`, rendered through `-private/router-link.gts` (Ember's `LinkTo`, else `<a href>`) | `components/link.gts` |
| Component slot (`decorator`, `slug`) | A named block yielding the component pre-bound for the host: `<:decorator as \|AILabel\|>` | `components/tag.gts` |
| `value` + `defaultValue` + `onChange` | Keep both: `@defaultValue` seeds `@tracked` state, `@value` wins whenever defined | `components/text-input.gts` |
| `useNormalizedInputProps` and the helper, invalid and warning `Text` | `fieldState()` and `<FieldMessage>` from `components/-private/field.gts`, with the control's `aria-*` attributes as that React component sets them | `components/text-input.gts` |
| State/controllable single prop | One arg plus a private `@tracked` fallback; arg is source of truth only when change handler is passed | `components/tree-view.gts` |
| `useRef` + `useEffect` DOM listeners | A functional `modifier()` from `ember-modifier` returning its teardown | `modifiers/close-on-outside-click.ts` |
| `forwardRef` | Yield a `ModifierLike` for the caller to apply to their own element | none yet |
| `createPortal` | `{{#in-element}}` — use the existing `<Portal>` component, which renders into the topmost open Modal (the `carbon.layers` service), as nothing outside it works. A layer that must keep its state as modals open and close moves its element instead | `components/portal.gts`, `notification/toast-notification-list.gts` |
| A modal over the page | A native `<dialog>` opened with `showModal()`, rendered in place: the top layer needs no portal or target element. A component inside one that closes on Escape stops the event, so the modal stays open | `components/modal.gts` |
| React context / provider | A service, or the parent component instance yielded down to children | `services/notifications.ts` |
| `useId` | `guidFor(this)` | `components/tree-view.gts` |
| Floating UI positioning hooks | The addon's own `<Popover>` / `<PopoverContent>` | `components/popover.gts` |
| Debounce/timing | `task({ restartable: true })` + `timeout()` from `ember-concurrency` | `components/data-table/-search-input.gts` |
| `useMatchMedia` with `@carbon/layout`'s `breakpoints` | `mediaQuery(this, minWidth('lg'))` from `utils/media-query.ts`; never copy a breakpoint's value | `components/tabs.gts` |
| `useEffect` cleanup return | `registerDestructor` (or the modifier's teardown function) | `components/tabs.gts` |
| Arrow-key navigation (roving `tabIndex`) | `RovingFocus` from `utils/roving-focus.ts`: its `container` modifier on the list, its `item` modifier on each item; items keep their DOM order | `components/tree-view.gts` |

### 1. Yield Contextual Components instead of Inspecting Children

Yield child components pre-bound with parent-supplied args using `WithBoundArgs`. If the parent needs ordering or child lists (e.g. `Tabs`), let children register themselves with the parent on construction and deregister via `registerDestructor`:

```typescript
import type Owner from '@ember/owner';
import { registerDestructor } from '@ember/destroyable';
import { afterRender } from '../utils/after-render.ts';

export default class TabPane extends Component<TabPaneSignature> {
  constructor(owner: Owner, args: TabPaneSignature['Args']) {
    super(owner, args);
    // The parent read its children during this render; register after it.
    afterRender(this, () => {
      this.args.tab.registerTab(this);
      registerDestructor(this, () => this.args.tab.unregisterTab(this));
    });
  }
}
```

A yielded child that renders its parent again, as a MenuItem renders its submenu, can't import the parent, which imports it (rollup warns on the cycle): the parent hands over its own class (`<@menu.Submenu>`).

For a cleaner registration example, read the charts: every yielded part extends `charts/-components/chart-part.ts`, which registers with the chart this way, and the chart derives its options and data from the registered parts' args with plain getters. Don't write a template helper that exists for its side effect.

### 2. Accept Components as Args

Invoke a `renderIcon`-style `ComponentLike` arg as Carbon React does, passing a `@size` only where React passes `size`: icons are 16px by default and render a bare `<svg>`, as `@carbon/icons-react`'s do. `@svgClass` is `@carbon/icons-react`'s `className`: pass the class Carbon React (or, for AI Chat, upstream) passes there, and nothing else.

```gts
<@renderIcon />
```

### 3. Model Controlled vs Uncontrolled Explicitly

- **Case A (React `value` + `defaultValue`):** Keep both args. `@defaultValue` seeds private tracked state; `@value` wins whenever defined.
- **Case B (React has single controllable prop):** Key on the change handler: the arg is the source of truth only when the change handler was also passed; otherwise it just seeds tracked state so the control isn't locked.

### 4. Use Modifiers for DOM Work and Refs

Functional or class-based modifiers are Ember's replacement for `useRef` + `useEffect`. When the consumer owns the element that needs the behavior, yield a `ModifierLike` modifier to them.
A function modifier re-runs only for the arguments it reads, since ember-modifier passes it Glimmer's lazy arguments. Destructure every positional it should follow, and `void` one nothing else uses.

### 5. Timing and Destructors

Never use bare `setTimeout`. Use `ember-concurrency` restartable tasks which auto-cancel on component destruction; lint enforces this outside stories. A plain class can hold tasks too: `destroy(this)` from `@ember/destroyable` cancels them, as the AI Chat media providers' `teardown()` does. `settled()` waits for a timer only once it has started, so wrap native async that leads to one (a dynamic `import()`, a fetch) in `waitForPromise` from `@ember/test-waiters`. To defer work past the current render (writing state the render read), use `afterRender` from `utils/after-render.ts`, not the run loop. Anything else that must be cleaned up belongs in `registerDestructor` or a modifier teardown.
`settled()` waits for `timeout()`, so a timer tests shouldn't wait out, such as a toast closing itself, uses `rawTimeout()`.

### 6. Signatures

Signatures follow the [Ember guides](https://guides.emberjs.com/release/typescript/core-concepts/invokables/) and [Glint](https://typed-ember.gitbook.io/glint/environments/ember/component-signatures), and must match what the template does. Lint enforces the mechanical parts.

- **Name:** `export interface <Name>Signature`, where `<Name>` is the component's public export name. The class or `TOC` const is named the same. A signature is never a `type` alias.
- **`Args`:** written inline in the signature, after any shared args it intersects (`Args: SharedArgs & { … }`). Code elsewhere refers to them as `<Name>Signature['Args']`; there is no separate `Args` type for one component.
- **Declare each arg, type and helper once.** Copies drift: one gains a value or a doc the others lack. Before writing one, search `src` for it, and import what exists.
  - A group of args several components take is an exported interface, which each signature intersects: `Args: SharedArgs & { … }`.
  - A part, variant or skeleton takes its component's type: `size?: ButtonSignature['Args']['size']`.
  - A union of values follows Carbon React: one type where React declares one (`ListBoxSize`), separate ones where React's values differ.
  - A helper or modifier two components need goes in `utils/` or `-private/`, not in each component.
- **`Element`:** the element `...attributes` is spread on.
  - A DOM element gets its own type, a union when branches differ.
  - When spreading onto another component, derive it: `Element: ButtonSignature['Element']`.
  - No `...attributes`, no `Element`. Never write `Element: null`.
- **`...attributes`:** every component spreads it on the element Carbon React spreads its rest props onto (TextInput's `<input>`, Slider's track), or on its root where React spreads none. Where React's `className` styles a different element, take it as `@className`; where it styles that same element, as PasswordInput's does, `class` covers it. Before `...attributes`, an attribute is a default the caller can override; after it, the component's value wins, and an undefined one removes the caller's. So only what the component must control, such as an `id` its label points at, goes after it; anything a caller may also set, such as TextArea's `maxlength`, goes before. A component with no element of its own opts out of `ember/template-require-splattributes` inline, with the reason.
- **`Blocks`:** only the blocks the template yields.
  - Label positional params: `default: [TabPane: WithBoundArgs<typeof TabPane, 'tab'>]`. The label becomes the block param name in editors and Storybook's "Show code".
  - A yielded hash stays unlabelled, since its keys name its entries.
- **Yielded components:** `typeof X` when yielding the class itself, `WithBoundArgs<typeof X, 'a'>` for `(component X a=…)`.
- **Template-only components:** `const X: TOC<XSignature> = <template>…`.
- **Helpers and modifiers:** helpers are plain functions. Modifiers use `modifier()` with the types written on the function's parameters. Neither needs a signature interface.
- **No `any`, and no YUIDoc tags** (`@argument`, `@type`, `@class`): the types document themselves.

### 7. What NOT to Reach For

- **Referring to a component, icon or modifier by name** (`<Carbon::Tag>`, `{{component "carbon/tag"}}`) - only `services/**` is re-exported into the app tree (`appReexports` in rollup.config.mjs), so import everything else into strict-mode templates.
- **`@ember/render-modifiers`** (`did-insert`, `did-update`) - write a real functional modifier instead.
- **`MutationObserver`** on child DOM nodes - yield contextual components or a `ModifierLike` instead.
- **A `ResizeObserver` per component** - use `observeResize` from `utils/resize-observer.ts`: one shared observer, calling back in the next animation frame, so no callback runs inside the observer's own notification.
- **`willDestroy()` overrides** - use `registerDestructor` or modifier teardowns.
- **`A()`, `NativeArray`, `pushObject`, `removeObject`, or `set()`** - use plain arrays/objects reassigned through `@tracked`.
- **Classic `Component` + separate `.hbs`** - always use GTS files with `<template>` tags.
- **`this.element`** - go through a modifier.
- **The package's barrels inside `src`** (`icons.ts`, `components.ts`, `ai-chat.ts`, `charts.ts`, `ibm-products.ts`) - they're the public entry points for apps. Inside `src`, import the module itself (`import CheckmarkFilled from './icons/checkmark-filled.ts'`): in dev every module a barrel pulls in is its own request, and `icons.ts` alone re-exports 2,760 icons. Lint enforces this.
- **Importing a module only for its side effects** (`import './setup.ts';`) - package.json declares only stylesheets and the tests as side effects, so bundlers drop the import, in apps and in the Storybook and test builds. Export a function and call it. Lint enforces this in `src` and `.storybook`.
- **`style` attributes**, static or bound (`trustHTML`, formerly `htmlSafe`, only silences Ember's warning) - strict CSPs block them. Use a class; for values computed from args, return them from a getter and apply it with the `{{style}}` modifier (`ember-style-modifier`), which writes through CSSOM. A modifier runs after the modifiers of the elements inside it, so a component measuring or positioning itself on render won't see its container's `{{style}}` yet: fixed values must be classes. Write vendor-prefixed properties hyphenated (`'-webkit-line-clamp'`); the modifier drops camelCase ones. Both test suites block style attributes (`style-src-attr 'none'`) and fail on a violation. The QUnit tests also block `<style>` elements without the page's nonce: pass `cspNonce()` (src/utils/csp-nonce.ts) to any library that injects them, and give a test template's `<style>` `nonce={{nonce}}` from tests/helpers.

---

## Common Pitfalls and Solutions

### ❌ Pitfall 1: Shadowing a Built-in Keyword

Template keywords such as `fn`, `on`, `eq`, and `element` resolve to a same-named JavaScript binding in scope. Alias such imports when using the template keyword: import Storybook's spy as `fn as spy`. Never import `fn` or `on` from Ember (`ember/no-legacy-helper-imports`). Lowercase tags resolve the same way: importing the `{{style}}` modifier as `style` turns that file's `<style>` elements into invocations of it, so alias it there (`styleModifier`).

### ❌ Pitfall 2: Naming a File Differently from Its Export

File names are kebab-case, and `pnpm generate` names each export of the `carbon-components-ember/components`, `/ai-chat`, `/charts` and `/ibm-products` barrels after its file: `text-input.gts` exports `TextInput`, and a top-level `ai-` or `ui-` file spells the acronym (`AILabel`, `UIShell`). It fails when two files would export the same name from one barrel. So name a file after its export in full: `toggletip/toggletip-button.gts`, not `toggletip/button.gts`. Two files sharing a basename (`tile/group.gts` and `radio-button/group.gts`) once made the production rollup build mis-name exports.

### ❌ Pitfall 3: MutationObservers to inspect Child DOM Nodes

Fights the Glimmer render pipeline. Instead, use contextual components so children render with correct classes/attributes declaratively.

### ❌ Pitfall 4: Backticks in Handlebars Template Comments

A backtick inside HBS comments (``{{! ... `word` ... }}``) breaks the Glint build step. Use single/double quotes instead.

### ❌ Pitfall 5: Generic `<Icon @icon='some-string'>` Path is Dead Code

Nothing registers icons with `IconMap` in app code, so string-based icon lookups render nothing. Always import and use the specific per-icon components (e.g., `import CheckmarkFilled from './icons/checkmark-filled.ts'`, then `<CheckmarkFilled />`).

### ❌ Pitfall 6: An Attribute the Element Doesn't Define

Glint types each element's attributes, so one HTML doesn't define for that element fails type-checking, even where Carbon's CSS selects it (`disabled` on a list box `<li>`). Set it from a modifier with `element.toggleAttribute()`, as `-private/list-box/list-box-menu-item.gts` does.

### ❌ Pitfall 7: Binding `value` on a `<select>`

Glimmer sets a `<select>`'s `value` before its options render, so `<select value={{x}}>` selects nothing on the first render. Select the value from a modifier once the options are in, and again when they change: `Select` does both, as the `SelectItem` it yields tells it when an option renders, goes or changes value.

### ❌ Pitfall 8: Floating Content inside a Modal

A Modal's `<dialog>` is in the top layer, out of everything around it, but Floating UI still counts the trigger's overflow ancestors outside it as clipping the trigger, so `hide()` hides what floats from inside it. With `utils/floating.ts`, give `hide()` `() => ({ boundary: clippingBoundary(reference) })`, derived so a Modal opening in the same render counts. Focus inside floating content with `{ preventScroll: true }`: until Floating UI places it, Carbon's styles can leave it at the top of the page.

### ❌ Pitfall 9: A Modifier That Reads Too Little, or Too Much

A function modifier tracks only what its body reads before returning. An argument it ignores, or reads only after an `await` or in a callback, never re-runs it, so destructure each one (lint flags a signature's arguments the callback doesn't take). Tracked state it reads on the way, even inside a method it calls, re-runs it on every change. Where something else already handles that state, compare the arguments with the last run's and read the state only when they changed, as `PromptLineAutocomplete`'s `watchConfigs` does.

---

## Tests

- **Carbon's stylesheet loads globally** in `tests/test-helper.ts`, ahead of the components' own stylesheets (which they import), as in an app. Never inline Carbon's CSS in a test.
- **Style snapshots** record the diff from an unstyled baseline: call `disableCarbonStyles()` before rendering, capture the baseline, then `enableCarbonStyles()` and `waitForAnimationFrame()` (from `tests/helpers`) so Carbon's transitions finish. A global hook re-enables Carbon after every test.

---

## Upgrading Carbon and TypeScript

`pnpm-workspace.yaml`'s catalogs pin the dependencies we upgrade by hand (`catalog:carbon`, `catalog:typescript`). Dependabot ignores them; never bump one on its own, and keep TypeScript on 6.0 until Glint supports TypeScript 7 ([#948](https://github.com/IBM/carbon-components-ember/pull/948)). The upgrade procedure is in [.claude/skills/upgrade-carbon/SKILL.md](.claude/skills/upgrade-carbon/SKILL.md).

---

## Storybook Conventions

Stories live as `src/components/**/<name>.stories.gts` next to their components.

- **One name per component**: its file, its export, its stories file and its page title agree. `radio-button/radio-button-group.gts` exports `RadioButtonGroup`, its stories are `radio-button-group.stories.gts`, and its page title is `Components/RadioButton/RadioButtonGroup`, unless the upstream Storybook (Carbon React's, or Carbon AI Chat's for its components) titles the page otherwise. A component that React splits into pages keeps them in a folder named after it (`data-table/selection.stories.gts`).
- **CSF Next**: Use CSF Next format (`preview.meta()`, `meta.story()`).
- **React Parity**: Mirror [Carbon React's Storybook](https://react.carbondesignsystem.com/) (its `index.json` lists every title and story):
  - Use its titles, story export names (`Default`, `WithLayer`) and variants.
  - Where React splits a component into pages (`Notifications/Toast`, `DataTable/Selection`), use one story file per page.
  - Keep useful Ember-only stories.
  - List the React stories that can't be ported, and why, in a "parity gaps" comment at the top of the file.
- **Shared story code** lives in `.storybook/`, imported through `#storybook/*`: fixtures in `.storybook/fixtures/<component>.gts`, decorators such as `withLayer` in `.storybook/decorators.gts`. Never put it in `src/`, which ships.
- **Styles**: lay demos out with classes in `.storybook/styles/<path>.css`, mirroring the story's path under `src/components` and imported as `#storybook/styles/<path>.css`. Prefix its classes with that path, `/` as `-`, then `-story__` (`ai-chat-toolbar-story__frame`), so same-named stories in different folders don't collide. Use `{{style}}` only for values computed from args.
- **Descriptions and args**:
  - Every story file sets `parameters.docs.description.component`; it introduces the docs page and is what AI agents read about the component.
  - Write story `args` as plain values (strings, numbers, booleans, arrays and objects of those). "Show code" and the agent-facing snippets fill them in; computed values show up as `{{@name}}`.
- **Controlled Components**: Keep state in a `trackedObject` in `render` and forward changes to `fn()` spy args.
- **Axe/a11y**: Axe violations fail Storybook tests (`pnpm test:storybook`). Set `parameters: { a11y: { test: 'todo' } }` only with a comment explaining the rules to fix.
- **Screenshots**: CI fails a story whose screenshot differs from main's, unless the PR has the `preview` label, and a story that never holds still, new or not, whatever the labels. A story renders the same every time: fixed data and dates, nothing on a timer or waiting on media when it renders. Otherwise opt it out with `parameters: { screenshot: { disable: true } }` and a comment saying why.

---

## Component Docs for Agents (Storybook MCP)

- `pnpm storybook` serves an MCP endpoint at `http://localhost:6006/mcp` (`@storybook/addon-mcp`). Use its `docs-list`, `docs-show` and `docs-show-story` tools for a component's API and examples rather than reading its source. The repo's `.mcp.json` registers it for Claude Code; it connects while Storybook runs.
- Its manifest is generated from component signatures and stories (the ember-storybook patch). An argument's JSDoc, a block's labelled params and a story's description are what agents read, so keep them accurate.
- `.storybook/manifests.ts` then points each component's import at its barrel: `carbon-components-ember/components`, `/ai-chat`, `/charts` or `/ibm-products`. It's a preset in `addons` because ember-storybook's `StorybookConfig` type rejects `experimental_manifests` in `defineMain`.
- `/manifests/components.html` on the running Storybook shows what agents get.
- Apps get the same tools from `carbon-components-ember-mcp`, which reads the manifest published with each release's docs. Try changes to it against your running Storybook with `node carbon-components-ember-mcp/bin.mjs --manifests http://localhost:6006`.
- `carbon-components-ember/skills/carbon-components-ember/` is the agent skill apps install with the package, and that server sends its `SKILL.md` as instructions. Update it when a setup step or app-facing convention changes (imports, icons, the toast list). Its `references/components*` are written from the Storybook manifest when the package is packed (`pnpm build:skill`), so they're not committed; each page is named after its component, as `SKILL.md` tells agents. CI checks this skill and `.claude/skills` with the [Agent Skills specification](https://agentskills.io/specification)'s validator (`.github/skills-ref-requirements.txt`).

---

## Linting

- **Templates are linted by ESLint**, not ember-template-lint (being deprecated, emberjs/rfcs#1214): `eslint.config.mjs` spreads `eslint-plugin-ember`'s `template-lint-migration` config, so `pnpm lint:js` covers both.
- Silence a template rule with `{{! eslint-disable-next-line ember/template-<rule> }}` directly above the line, with a comment saying why. A bare `{{! eslint-disable ... }}` disables the rule for the rest of the file.
- **Stylesheets are linted by Stylelint** (`pnpm lint:css`, `stylelint.config.mjs`, on `stylelint-config-standard`, and its `-scss` variant for SCSS); Prettier still formats them. Class names are BEM, like Carbon's. Silence a rule with `/* stylelint-disable-next-line <rule> */` (plain CSS has no `//` comments) and a comment saying why.
- **Markdown is linted by markdownlint** (`pnpm lint:md` at the root, with `.markdownlint-cli2.mjs`: its defaults without line length). `pnpm lint:md --fix` fixes most findings.
- **Markdown's spelling is checked by cspell** (`pnpm lint:spelling`, with `cspell.config.mjs`), in US or British English. Add a real term to its `words`; reword a coined word.

---

## Porting Carbon AI Chat (`@carbon/ai-chat-components`)

The port target is the Lit-based framework-agnostic widget library `@carbon/ai-chat-components`, **not** the React shell application. Its components live in `src/components/ai-chat/` and are exported from their own barrel, `carbon-components-ember/ai-chat`, under upstream's names. Before porting or changing one, read [.claude/skills/port-ai-chat-component/SKILL.md](.claude/skills/port-ai-chat-component/SKILL.md): slots, styling, and the autotracking and modifier gotchas.

---

## Carbon for IBM Products

Components Carbon for IBM Products (`@carbon/ibm-products`) defines live in `src/components/ibm-products/` and are exported from `carbon-components-ember/ibm-products` under upstream's names.

- Render IBM Products' markup and `c4p--` classes.
- Each component imports a stylesheet that `@use`s its component's SCSS from `@carbon/ibm-products-styles` (`@use '@carbon/ibm-products-styles/scss/components/EmptyStates';`). The build compiles that into `styles.css`, so apps load nothing new.
- Their DOM-parity fixtures render `@carbon/ibm-products` (entries marked `ibmProducts: true` in `dom-parity/lib/components.mjs`), and the argument check compares them with its props.
- A component upstream exports under a namespace (`preview__PageHeader`) keeps its name here (`PageHeader`, `PageHeaderContent`). `dom-parity/ibm-products-types.ts` points the argument check at the namespace, and its fixtures render `IBMProducts.preview__PageHeader`.
- Story titles are upstream's, prefixed with `IBM Products/`.

## Component Implementation Checklist

Adding a component, or aligning one with Carbon React? Follow [.claude/skills/implement-component/SKILL.md](.claude/skills/implement-component/SKILL.md).

## Issues, Pull Requests and the Roadmap

Every PR gets one release label (release-plan needs it), `Closes #N` and a roadmap item; work before the stable release also gets the `Stable` milestone. Issues go under their epic, with "blocked by" links for order. Follow [.claude/skills/track-work/SKILL.md](.claude/skills/track-work/SKILL.md).

## Guidelines for Updating This Document

This document is a living resource for AI agents and developers. **You are strongly encouraged and expected to actively update this document whenever you discover a new undocumented gotcha, generalizable pitfall, or core architectural constraint.**

To maintain the high quality of this guide and prevent future bloat, adhere to these strict rules when making updates:

- **Do add newly discovered technical gotchas or constraints.** Focus on high-value, reusable patterns.
- **Put a procedure for one kind of task in a skill** under `.claude/skills/`, and point to it from here. Rules that apply to every change stay in this file.
- **Keep additions extremely concise, structured, and immediately actionable.** Frame issues as general rules (e.g., "Always do X because of Y") rather than stories (e.g., "In PR #123, we found...").
- **Do not write chronological logs, PR-specific histories, diaries, progress logs, or review-round narratives.** Keep the history in git, and the guidelines in this file.

---

## Key Resources

- **Carbon React**: <https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components>
- **Carbon Storybook**: <https://react.carbondesignsystem.com/>
- **Carbon AI Chat**: <https://github.com/carbon-design-system/carbon-ai-chat>
- **Ember Guides**: <https://guides.emberjs.com/>

---

Last Updated: 2026-10-20

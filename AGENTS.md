# Agent Context and Development Guide

This document provides essential context and patterns for AI agents (like Bob Shell) working on the carbon-components-ember codebase.

## Project Overview

**carbon-components-ember** is an Ember.js implementation of IBM's Carbon Design System components, maintaining parity with the React implementation.

- **Repository**: https://github.com/IBM/carbon-components-ember
- **Carbon React Reference**: https://github.com/carbon-design-system/carbon/tree/main/packages/react
- **Carbon Storybook**: https://react.carbondesignsystem.com/
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
Use `{{on}}` modifier instead of React's event props:
```typescript
// React
<button onClick={handler}>Click</button>

// Ember
<button {{on "click" handler}}>Click</button>
```

### 6. Dynamic Element Types
Use the built-in `element` keyword (Ember 7.1+); it needs no import:

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
| Component slot (`decorator`, `slug`) | A named block yielding the component pre-bound for the host: `<:decorator as \|AILabel\|>` | `components/tag.gts` |
| `value` + `defaultValue` + `onChange` | Keep both: `@defaultValue` seeds `@tracked` state, `@value` wins whenever defined | `components/text-input.gts` |
| State/controllable single prop | One arg plus a private `@tracked` fallback; arg is source of truth only when change handler is passed | `components/tree-view.gts` |
| `useRef` + `useEffect` DOM listeners | A functional `modifier()` from `ember-modifier` returning its teardown | `components/-private/tooltip.gts` |
| `forwardRef` | Yield a `ModifierLike` for the caller to apply to their own element | `components/-private/tooltip.gts` |
| `createPortal` | `{{#in-element}}` — use the existing `<Portal>` component | `components/portal.gts` |
| React context / provider | A service, or the parent component instance yielded down to children | `services/notifications.ts` |
| `useId` | `guidFor(this)` | `components/tree-view.gts` |
| Floating UI positioning hooks | The addon's own `<Popover>` / `<PopoverContent>` | `components/popover.gts` |
| Debounce/timing | `task({ restartable: true })` + `timeout()` from `ember-concurrency` | `components/search.gts` |
| `useEffect` cleanup return | `registerDestructor` (or the modifier's teardown function) | `components/tabs.gts` |
| Lazily resolved value in template | `TrackedPromise` from `utils/tracked.ts` — re-renders once promise settles | `components/icons/*.ts` (lazy icons) |

### 1. Yield Contextual Components instead of Inspecting Children
Yield child components pre-bound with parent-supplied args using `WithBoundArgs`. If the parent needs ordering or child lists (e.g. `Tabs`), let children register themselves with the parent on construction and deregister via `registerDestructor`:
```typescript
import type Owner from '@ember/owner';
import { registerDestructor } from '@ember/destroyable';
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
For a cleaner registration example, read the charts: every yielded part extends `charts/-components/chart-part.ts`, which registers with the chart this way, and the chart derives its options and data from the registered parts' args with plain getters. Don't write a template helper that exists for its side effect.

### 2. Accept Components as Args & Icon Size Gotcha
When invoking a `renderIcon`-style `ComponentLike` arg, **always pass `@size` (and an inert `@svgClass`)**. The base `Icon` component defaults to a 24px SVG with 5px margins unless `@size` and `@svgClass` are passed, causing alignment/overflow issues:
```gts
{{! RIGHT — matches Carbon's spec size and neutralizes the default margin }}
<@renderIcon @size='16' @svgClass='cds--component__icon-svg' />
```

### 3. Model Controlled vs Uncontrolled Explicitly
- **Case A (React `value` + `defaultValue`):** Keep both args. `@defaultValue` seeds private tracked state; `@value` wins whenever defined.
- **Case B (React has single controllable prop):** Key on the change handler: the arg is the source of truth only when the change handler was also passed; otherwise it just seeds tracked state so the control isn't locked.

### 4. Use Modifiers for DOM Work and Refs
Functional or class-based modifiers are Ember's replacement for `useRef` + `useEffect`. When the consumer owns the element that needs the behavior, yield a `ModifierLike` modifier to them.

### 5. Timing and Destructors
Never use bare `setTimeout`. Use `ember-concurrency` restartable tasks which auto-cancel on component destruction. Anything else that must be cleaned up belongs in `registerDestructor` or a modifier teardown.
`settled()` waits for `timeout()`, so a timer tests shouldn't wait out, such as a toast closing itself, uses `rawTimeout()`.

### 6. Signatures
Signatures follow the [Ember guides](https://guides.emberjs.com/release/typescript/core-concepts/invokables/) and [Glint](https://typed-ember.gitbook.io/glint/environments/ember/component-signatures), and must match what the template does. Lint enforces the mechanical parts.
- **Name:** `export interface <Name>Signature`, where `<Name>` is the component's public export name. The class or `TOC` const is named the same. A signature is never a `type` alias.
- **`Args`:** written inline in the signature. Code elsewhere refers to them as `<Name>Signature['Args']`; there is no separate `Args` type.
- **`Element`:** the element `...attributes` is spread on.
  - A DOM element gets its own type, a union when branches differ.
  - When spreading onto another component, derive it: `Element: ButtonSignature['Element']`.
  - No `...attributes`, no `Element`. Never write `Element: null`.
- **`...attributes`:** every component spreads it, on its root or on the element Carbon React spreads its rest props onto (Toggle's `<button>`). A component with no element of its own opts out of `ember/template-require-splattributes` inline, with the reason.
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
- **The package's barrels inside `src`** (`icons.ts`, `components.ts`, `ai-chat.ts`, `charts.ts`) - they're the public entry points for apps. Inside `src`, import the module itself (`import CheckmarkFilled from './icons/checkmark-filled.ts'`): in dev every module a barrel pulls in is its own request, and `icons.ts` alone re-exports 2,760 icons. Lint enforces this.
- **`style` attributes**, static or bound (`trustHTML`, formerly `htmlSafe`, only silences Ember's warning) - strict CSPs block them. Use a class; for values computed from args, return them from a getter and apply it with the `{{style}}` modifier (`ember-style-modifier`), which writes through CSSOM. A modifier runs after the modifiers of the elements inside it, so a component measuring or positioning itself on render won't see its container's `{{style}}` yet: fixed values must be classes. Write vendor-prefixed properties hyphenated (`'-webkit-line-clamp'`); the modifier drops camelCase ones. Both test suites block style attributes (`style-src-attr 'none'`) and fail on a violation. The QUnit tests also block `<style>` elements without the page's nonce: pass `cspNonce()` (src/utils/csp-nonce.ts) to any library that injects them, and give a test template's `<style>` `nonce={{nonce}}` from tests/helpers.

---

## Common Pitfalls and Solutions

### ❌ Pitfall 1: Shadowing a Built-in Keyword
Template keywords such as `fn`, `on`, `eq`, and `element` resolve to a same-named JavaScript binding in scope. Alias such imports when using the template keyword: import Storybook's spy as `fn as spy`. Never import `fn` or `on` from Ember (`ember/no-legacy-helper-imports`). Lowercase tags resolve the same way: importing the `{{style}}` modifier as `style` turns that file's `<style>` elements into invocations of it, so alias it there (`styleModifier`).

### ❌ Pitfall 2: Naming a File Differently from Its Export
File names are kebab-case, and `pnpm generate` names each export of the `carbon-components-ember/components`, `/ai-chat` and `/charts` barrels after its file: `text-input.gts` exports `TextInput`, and a top-level `ai-` or `ui-` file spells the acronym (`AILabel`, `UIShell`). It fails when two files would export the same name from one barrel. So name a file after its export in full: `toggletip/toggletip-button.gts`, not `toggletip/button.gts`. Two files sharing a basename (`tile/group.gts` and `radio-button/group.gts`) once made the production rollup build mis-name exports.

### ❌ Pitfall 3: MutationObservers to inspect Child DOM Nodes
Fights the Glimmer render pipeline. Instead, use contextual components so children render with correct classes/attributes declaratively.

### ❌ Pitfall 4: Backticks in Handlebars Template Comments
A backtick inside HBS comments (`{{! ... `word` ... }}`) breaks the Glint build step. Use single/double quotes instead.

### ❌ Pitfall 5: Generic `<Icon @icon='some-string'>` Path is Dead Code
Nothing registers icons with `IconMap` in app code, so string-based icon lookups render nothing. Always import and use the specific per-icon components (e.g., `import CheckmarkFilled from './icons/checkmark-filled.ts'`, then `<CheckmarkFilled @size="16" />`).

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

---

## Component Docs for Agents (Storybook MCP)
- `pnpm storybook` serves an MCP endpoint at `http://localhost:6006/mcp` (`@storybook/addon-mcp`). Use its `docs-list`, `docs-show` and `docs-show-story` tools for a component's API and examples rather than reading its source. The repo's `.mcp.json` registers it for Claude Code; it connects while Storybook runs.
- Its manifest is generated from component signatures and stories (the ember-storybook patch). An argument's JSDoc, a block's labelled params and a story's description are what agents read, so keep them accurate.
- `.storybook/manifests.ts` then points each component's import at its barrel: `carbon-components-ember/components`, `/ai-chat` or `/charts`. It's a preset in `addons` because ember-storybook's `StorybookConfig` type rejects `experimental_manifests` in `defineMain`.
- `/manifests/components.html` on the running Storybook shows what agents get.
- Apps get the same tools from `carbon-components-ember-mcp`, which reads the manifest published with each release's docs. Try changes to it against your running Storybook with `node carbon-components-ember-mcp/bin.mjs --manifests http://localhost:6006`.
- `carbon-components-ember/skills/carbon-components-ember/` is the agent skill apps install with the package, and that server sends its `SKILL.md` as instructions. Update it when a setup step or app-facing convention changes (imports, icons, the wormhole elements). Its `references/components*` are written from the Storybook manifest when the package is packed (`pnpm build:skill`), so they're not committed.

---

## Linting
- **Templates are linted by ESLint**, not ember-template-lint (being deprecated, emberjs/rfcs#1214): `eslint.config.mjs` spreads `eslint-plugin-ember`'s `template-lint-migration` config, so `pnpm lint:js` covers both.
- Silence a template rule with `{{! eslint-disable-next-line ember/template-<rule> }}` directly above the line, with a comment saying why. A bare `{{! eslint-disable ... }}` disables the rule for the rest of the file.
- **Stylesheets are linted by Stylelint** (`pnpm lint:css`, `stylelint.config.mjs`, on `stylelint-config-standard`, and its `-scss` variant for SCSS); Prettier still formats them. Class names are BEM, like Carbon's. Silence a rule with `/* stylelint-disable-next-line <rule> */` (plain CSS has no `//` comments) and a comment saying why.

---

## Porting Carbon AI Chat (`@carbon/ai-chat-components`)

The port target is the Lit-based framework-agnostic widget library `@carbon/ai-chat-components`, **not** the React shell application. Its components live in `src/components/ai-chat/` and are exported from their own barrel, `carbon-components-ember/ai-chat`, under upstream's names. Before porting or changing one, read [.claude/skills/port-ai-chat-component/SKILL.md](.claude/skills/port-ai-chat-component/SKILL.md): slots, styling, and the autotracking and modifier gotchas.

---

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

- **Carbon React**: https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components
- **Carbon Storybook**: https://react.carbondesignsystem.com/
- **Carbon AI Chat**: https://github.com/carbon-design-system/carbon-ai-chat
- **Ember Guides**: https://guides.emberjs.com/

---

Last Updated: 2026-10-14

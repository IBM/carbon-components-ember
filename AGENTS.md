# Agent Context and Development Guide

This document provides essential context and patterns for AI agents (like Bob Shell) working on the carbon-components-ember codebase.

## Project Overview

**carbon-components-ember** is an Ember.js implementation of IBM's Carbon Design System components, maintaining parity with the React implementation.

- **Repository**: https://github.com/IBM/carbon-components-ember
- **Carbon React Reference**: https://github.com/carbon-design-system/carbon/tree/main/packages/react
- **Carbon Storybook**: https://react.carbondesignsystem.com/
- **Technology**: Ember.js with Glimmer TypeScript (.gts files)

---

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
| Component passed as a prop | A `ComponentLike` arg, invoked as `<@renderIcon />` | `components/link.gts`, `components/text-area.gts` |
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

### 6. Type Signatures Fully
Fully type Glint signatures. Declare `Args`, `Element` (for `...attributes`), and `Blocks`. Do not use `any` anywhere in a signature.

### 7. What NOT to Reach For
- **`@ember/render-modifiers`** (`did-insert`, `did-update`) - write a real functional modifier instead.
- **`MutationObserver`** on child DOM nodes - yield contextual components or a `ModifierLike` instead.
- **`willDestroy()` overrides** - use `registerDestructor` or modifier teardowns.
- **`A()`, `NativeArray`, `pushObject`, `removeObject`, or `set()`** - use plain arrays/objects reassigned through `@tracked`.
- **Classic `Component` + separate `.hbs`** - always use GTS files with `<template>` tags.
- **`this.element`** - go through a modifier.

---

## Common Pitfalls and Solutions

### ❌ Pitfall 1: Shadowing a Built-in Keyword
Template keywords such as `fn`, `on`, `eq`, and `element` resolve to a same-named JavaScript binding in scope. Alias such imports (for example Storybook's `fn` spy) when using the template keyword.

### ❌ Pitfall 2: Reusing a `.gts` Basename in Public Exports
If two publicly exported components share an exact basename (e.g. `tile/group.gts` vs `radio-button/group.gts`), the production rollup build can silently mis-name exports, causing runtime errors. **Solution**: Use specific names (e.g. `tile/tile-group.gts`).

### ❌ Pitfall 3: MutationObservers to inspect Child DOM Nodes
Fights the Glimmer render pipeline. Instead, use contextual components so children render with correct classes/attributes declaratively.

### ❌ Pitfall 4: Backticks in Handlebars Template Comments
A backtick inside HBS comments (`{{! ... `word` ... }}`) breaks the Glint build step. Use single/double quotes instead.

### ❌ Pitfall 5: Generic `<Icon @icon='some-string'>` Path is Dead Code
Nothing registers icons with `IconMap` in app code, so string-based icon lookups render nothing. Always import and use the specific per-icon components (e.g., `<CheckmarkFilled @size="16" />`).

---

## Storybook Conventions
Stories live as `src/components/**/<name>.stories.gts` next to their components.
- **CSF Next**: Use CSF Next format (`preview.meta()`, `meta.story()`).
- **React Parity**: Mirror upstream story structures, titles, names, and variants.
- **Controlled Components**: Keep state in a `trackedObject` in `render` and forward changes to `fn()` spy args.
- **Axe/a11y**: Axe violations fail Storybook tests (`pnpm test:storybook`). Set `parameters: { a11y: { test: 'todo' } }` only with a comment explaining the rules to fix.

---

## Porting Carbon AI Chat (`@carbon/ai-chat-components`)

The port target is the Lit-based framework-agnostic widget library `@carbon/ai-chat-components`, **not** the React shell application.

### 1. Naming & Export Collisions
To prevent collisions with React parity components, the following AI Chat components are explicitly prefixed in public exports:
- `card` -> `AiChatCard` (and `AiChatCardFooter`, `AiChatCardSteps`)
- `truncated-text` -> `AiChatTruncatedText`
- `code-snippet` -> `AiChatCodeSnippet`
- `chat-button` -> `AiChatChatButton` (and `AiChatChatButtonSkeleton`)

Other components (like `Launcher`, `ChatShell`, `Table`, `Toolbar`, `WorkspaceShell`) stay unprefixed.

### 2. Slots and Block Mappings
- Upstream kebab-case slots become camelCase named blocks (e.g. `header-after` -> `<:headerAfter>`).
- Use `{{has-block "name"}}` instead of Lit `SlotObserver` MutationObservers.

### 3. Styling Guidelines
- Adapt upstream shadow-DOM `:host(...)` selectors to plain light-DOM classes.
- Reference `@carbon/styles` compiled CSS custom properties directly (`var(--cds-*)`) rather than theme Sass variables.
- Prefer static SCSS for layout over upstream's shadow-DOM-specific runtime CSSOM-injection helpers.

### 4. Technical Gotchas for AI Chat Components
- **Avoid `@tracked` on internal lazy caches**: If you lazily create or cache values (e.g. `URL.createObjectURL`), use plain private fields rather than `@tracked` properties if they are read and written in the same computation. Reading a tracked field in a getter and modifying it in the same pass triggers Ember's backtracking-rerender assertion.
- **Announcer Region Tracking**: Do not use `@tracked` on the active announcer region index if multiple updates occur synchronously in a single runloop. Keep as plain private state to prevent re-entrant writes.
- **Autotracking in Mount Modifiers**: A modifier's install function must never read a tracked `@arg` directly in its body if you don't want it to teardown and rebuild on every keystroke (e.g., streaming `@content`). Capture initial arguments in the constructor as plain fields, and use separate narrow modifiers (`syncArgs`, `syncValue`) to handle updates.
- **Modifier Rerun Idempotency**: Glimmer can re-evaluate and rerun modifiers even if their declared args haven't changed. For modifiers with destructive or expensive side-effects (like loading a player/editor), use an internal shadow field (e.g. `lastLoadedSource`) to diff before executing.
- **`.module.scss?inline` Imports in Theme Support**: Vite returns classname maps, not CSS text, for CSS Modules imported with `?inline`. Do not interpolate raw style exports into `<style>` blocks; instead, reference target classnames via properties (e.g., `.{{xStyle.default.className}}`).
- **Markdown Sanitization**: Always run markdown parsed output through `DOMPurify.sanitize()` unconditionally.
- **Tiptap Rich Text & Textarea Swap**: The textarea is upgraded to a Tiptap rich-text editor on the fly. We use `@onReady` callback returning a stable API object whose methods delegate to whichever controller is live.
- **Same-transaction Race on Autocomplete triggers**: Autocomplete triggers can trigger synchronously in a single ProseMirror transaction. Batch events using microtasks (`Promise.resolve().then()`) to resolve the last non-null detail.

### 5. State Management & Persistence
- **Storage**: Default to `window.sessionStorage` rather than `localStorage` to avoid cookie policy requirements in the EU.
- **Rehydration Sanitization**: Sanitize state when loading (e.g., force `streaming: false` on loaded messages, and advance the message ID counter past the highest loaded message ID to avoid key collisions).

---

## Component Implementation Checklist

- [ ] Review React implementation at GitHub
- [ ] Check Storybook for visual reference
- [ ] Map each React construct to its Ember idiom
- [ ] Create `.gts` file in `carbon-components-ember/src/components/`
- [ ] Define TypeScript signature — fully typed, no `any`
- [ ] Use `cds--` prefix for CSS classes
- [ ] Export it: run `pnpm create-autogenerated-files` to regenerate public barrel exports
- [ ] Create test file in `tests/components/`
- [ ] Add a colocated `<name>.stories.gts` mirroring Carbon React's stories
- [ ] Validate locally: `pnpm build && pnpm test && pnpm test:storybook`

## Guidelines for Updating This Document

This document is a living resource for AI agents and developers. **You are strongly encouraged and expected to actively update this document whenever you discover a new undocumented gotcha, generalizable pitfall, or core architectural constraint.**

To maintain the high quality of this guide and prevent future bloat, adhere to these strict rules when making updates:
- **Do add newly discovered technical gotchas or constraints.** Focus on high-value, reusable patterns.
- **Keep additions extremely concise, structured, and immediately actionable.** Frame issues as general rules (e.g., "Always do X because of Y") rather than stories (e.g., "In PR #123, we found...").
- **Do not write chronological logs, PR-specific histories, diaries, progress logs, or review-round narratives.** Keep the history in git, and the guidelines in this file.

---

## Key Resources

- **Carbon React**: https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components
- **Carbon Storybook**: https://react.carbondesignsystem.com/
- **Carbon AI Chat**: https://github.com/carbon-design-system/carbon-ai-chat
- **Ember Guides**: https://guides.emberjs.com/

---

Last Updated: 2026-10-03

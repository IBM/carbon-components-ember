---
name: port-ai-chat-component
description: Port a Carbon AI Chat component from `@carbon/ai-chat-components` (the Lit widget library) to Ember in this repo, or change one under `src/components/ai-chat/`. Covers names and the ai-chat barrel, slots, styling, and the autotracking and modifier gotchas these components hit.
---

# Porting Carbon AI Chat

The port target is the Lit-based framework-agnostic widget library `@carbon/ai-chat-components`, **not** the React shell application.

## 1. Names and the AI Chat Barrel

AI Chat's components live in `src/components/ai-chat/` and are exported from their own barrel, `carbon-components-ember/ai-chat`, as upstream's are from a package of their own. So they take upstream's names even where Carbon React has a component of the same name: `ai-chat/code-snippet.gts` exports `CodeSnippet` from `carbon-components-ember/ai-chat`, next to Carbon's `CodeSnippet` in `carbon-components-ember/components`. The parity check compares each source with its own barrel.

## 2. Slots and Block Mappings

- Upstream kebab-case slots become camelCase named blocks (e.g. `header-after` -> `<:headerAfter>`).
- Use `{{has-block "name"}}` instead of Lit `SlotObserver` MutationObservers.

## 3. Styling Guidelines

- Adapt upstream shadow-DOM `:host(...)` selectors to plain light-DOM classes.
- Reference `@carbon/styles` compiled CSS custom properties directly (`var(--cds-*)`) rather than theme Sass variables.
- Prefer static SCSS for layout over upstream's shadow-DOM-specific runtime CSSOM-injection helpers.

## 4. Technical Gotchas for AI Chat Components

- **Avoid `@tracked` on internal lazy caches**: If you lazily create or cache values (e.g. `URL.createObjectURL`), use plain private fields rather than `@tracked` properties if they are read and written in the same computation. Reading a tracked field in a getter and modifying it in the same pass triggers Ember's backtracking-rerender assertion.
- **Announcer Region Tracking**: Do not use `@tracked` on the active announcer region index if multiple updates occur synchronously in a single runloop. Keep as plain private state to prevent re-entrant writes.
- **Autotracking in Mount Modifiers**: A modifier's install function must never read a tracked `@arg` directly in its body if you don't want it to teardown and rebuild on every keystroke (e.g., streaming `@content`). Capture initial arguments in the constructor as plain fields, and use separate narrow modifiers (`syncArgs`, `syncValue`) to handle updates.
- **Modifier Rerun Idempotency**: Glimmer can re-evaluate and rerun modifiers even if their declared args haven't changed. For modifiers with destructive or expensive side-effects (like loading a player/editor), use an internal shadow field (e.g. `lastLoadedSource`) to diff before executing.
- **Markdown Sanitization**: Always run markdown parsed output through `DOMPurify.sanitize()` unconditionally.
- **Tiptap Rich Text & Textarea Swap**: The textarea is upgraded to a Tiptap rich-text editor on the fly. We use `@onReady` callback returning a stable API object whose methods delegate to whichever controller is live.
- **Same-transaction Race on Autocomplete triggers**: Autocomplete triggers can trigger synchronously in a single ProseMirror transaction. Batch events using microtasks (`Promise.resolve().then()`) to resolve the last non-null detail.

## 5. State Management & Persistence

- **Storage**: Default to `window.sessionStorage` rather than `localStorage` to avoid cookie policy requirements in the EU.
- **Rehydration Sanitization**: Sanitize state when loading (e.g., force `streaming: false` on loaded messages, and advance the message ID counter past the highest loaded message ID to avoid key collisions).

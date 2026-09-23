# dom-parity

DOM-level parity fixtures for `carbon-components-ember`.

Renders a pinned `@carbon/react` release with `react-dom/client` (in jsdom,
via `act()` so post-effect DOM is captured, not `renderToStaticMarkup`'s
pre-effect markup) and normalizes the result (tag, sorted classes,
attributes, inline style, text) into a JSON fixture per component - see
`lib/normalize-dom.mjs`.

Each component is covered by multiple **variants** - one per distinct value
of each arg it takes (and a handful of realistic combinations), not just a
single default render - so a regression in a specific `size`/`kind`/`type`
value is caught even when the default variant still passes. A component's
fixture (`fixtures/<Name>.json`) is one file containing all of its variants,
keyed by variant name, each with the exact `props` it was rendered with
recorded alongside its normalized `dom` - see `lib/components.mjs`.

The comparison itself lives in test-app's QUnit suite
(`test-app/tests/components/dom-parity-test.gts`), which renders the Ember
component for each variant and diffs its normalized DOM against the
matching fixture entry. This package is only the offline fixture generator -
the QUnit suite never runs it itself, it only reads `fixtures/*.json`. A
dedicated "every fixture variant is covered" test in that file guards
against a variant being added to `lib/components.mjs` (and regenerated)
with no matching Ember render case - it fails loudly instead of the new
variant silently going untested.

## Regenerating fixtures

```sh
pnpm --filter dom-parity generate
```

Rerun this after bumping the pinned `@carbon/react` version in
`package.json`, or after adding/changing a variant in `lib/components.mjs`.

This is currently a manual step - there is no scheduled CI job that reruns
`generate` against a newer `@carbon/react` release and diffs the result, so
fixture drift is only caught the next time someone runs this by hand. Wiring
that into CI (e.g. alongside `.github/workflows/parity-check-weekly.yml`) is
tracked as a follow-up, not something this package does today.

## Adding a component or variant

Coverage is scoped to args both sides actually implement and that produce
comparable DOM - skip an Ember-only arg with no React counterpart, a
React-only prop Ember never ported, and a React prop that switches to an
entirely different component (e.g. Button's `hasIconOnly`, which renders
`IconButton`) rather than toggling a class on the same root element. See the
comment at the top of `lib/components.mjs` for the reasoning already
recorded per component.

1. Add a component entry (or a new variant to an existing one) to
   `lib/components.mjs`, describing how to render the `@carbon/react`
   component for that variant.
2. Run `pnpm --filter dom-parity generate` to (re)write its fixture.
3. Add a matching render case to
   `test-app/tests/components/dom-parity-test.gts`, passing the same props
   on the Ember side, and add the variant's name to that component's
   "every fixture variant is covered" list.
4. Run the test-app suite. Genuine, intentional gaps (not test bugs) go in
   `known-differences.json` with a `path` (matching the diff output's
   `path`) and a `reason` - don't silently drop a real difference just to
   get a green suite. An entry applies to every variant of the component by
   default; add a `variant` field to scope it to just one when the gap only
   reproduces there (e.g. a class name that embeds the variant's own arg
   value, like `cds--btn--lg`, only needs one entry per distinct value, not
   one per variant that happens to use that value).

## Version pinning

`@carbon/react`'s version should track the `@carbon/styles` range this
addon itself already depends on (see `carbon-components-ember/package.json`),
since that's the class/markup generation these components share - not
just "latest". Check with:

```sh
npm view @carbon/react@<candidate> dependencies.@carbon/styles
```

## A second, live path: `@carbon/ai-chat-components`

Everything above covers only the `react` parity source. The Ember port
target for the `carbon-ai-chat` source is `@carbon/ai-chat-components` - a
framework-agnostic **Lit** widget library rendering into real shadow DOM
(see `scripts/parity-check.mjs`'s `SOURCES` comment and AGENTS.md's
"Porting Carbon AI Chat" section).

`@carbon/ai-chat-components` *does* also publish `@lit/react`-based React
wrapper components (`es/react/*.js`, e.g. `es/react/markdown.js`,
`es/react/file-uploads.js` - checked directly against the published 1.10.0
package and its GitHub source, not assumed absent). They don't help here,
though: each one is `createComponent({ tagName: '...', elementClass:
SameLitClass, ... })` around the *identical* Lit custom element the plain
Lit path already registers - same shadow DOM, same `elementClass` - not an
independent React implementation with its own DOM the way `@carbon/react`'s
components are. Mounting one via `react-dom/client` in jsdom would still be
mounting that same Lit custom element underneath, hitting the exact same
"jsdom doesn't faithfully reproduce Lit's shadow-DOM/custom-element upgrade
timing" problem #2 below already documents as the reason this path runs
live in real Chromium instead of as an offline fixture - so the React
wrapper doesn't open a new `generate.mjs`-style coverage path, and doesn't
change `FileUploads`' multi-root-shadow-DOM situation either (still the same
underlying `FileUploadsElement`).

That source is instead compared by a **second, independent** test module,
`test-app/tests/components/ai-chat/dom-parity-test.gts`, with two real
architectural differences from the path above - both explained in that
file's own module doc, summarized here:

1. **Live, not fixture-based.** Lit depends on real shadow DOM/custom-
   element upgrade timing that jsdom doesn't faithfully reproduce, so this
   path mounts the real, pinned `@carbon/ai-chat-components` custom
   elements directly in test-app's own real-Chromium (Playwright) QUnit
   run and compares live, every run - no `fixtures/*.json`, no `generate`
   step, no fixture-drift risk (the version pinned in
   `test-app/package.json` is the only source of truth).
2. **Class names are excluded from the comparison.** `@carbon/react` and
   Ember are both meant to emit the same `cds--*` classes; `@carbon/ai-
   chat-components` renders into shadow DOM and styles itself with plain,
   shadow-scoped class names, while the Ember port deliberately uses
   unrelated, globally-scoped BEM names instead (it has no shadow boundary
   to scope styles within) - see AGENTS.md, "Porting Carbon AI Chat", §3.
   A literal class diff would flag that intentional translation as a
   failure on every element, so this path strips `classes` from both
   normalized trees before diffing (`dom-parity/lib/strip-classes.mjs`)
   and asserts tag structure, semantic attributes (role, aria-\*, id
   references, disabled/hidden/inert, ...), text, and SVG geometry
   instead. A regression in the Ember port's own class names is covered by
   that component's own rendering/style-snapshot tests, not by this
   harness.

This path still reuses `normalize-dom.mjs` and `diff-normalized.mjs`
completely unmodified, and the same `dom-parity/known-differences.json`
allowlist (component names are namespaced with an `AiChat` prefix there,
e.g. `AiChatProcessing`, to keep them visually distinct from `react`-source
entries even though nothing stops the two namespaces from colliding).
What's new is `dom-parity/lib/flatten-composed-tree.mjs`, which resolves a
real custom element's shadow DOM/`<slot>` content into a plain, detached
DOM subtree first, since `normalizeElement` only ever walks
`.childNodes`/`.classList` and can't cross a shadow boundary on its own -
see that file's own doc comment for the "unwrap every nested custom-
element boundary, not just the outermost one" design decision.

**Adding a component to this path** means adding a `test`/`module` to
`ai-chat/dom-parity-test.gts` directly (mounting the real custom element
via plain DOM APIs, per `mountUpstream`) - there's no `lib/components.mjs`-
style registry to extend and no `generate` step to rerun. Before picking a
component to add, check `es/components/<name>/src/*.js` in the real
package (`npm pack @carbon/ai-chat-components@<version>` into a scratch
dir) for how deeply it composes `@carbon/web-components` custom elements
(`cds-button`, `cds-tooltip`, ...) or extends one via subclassing
(`chat-button` extends `CDSButton` directly) - those are real, in scope,
and `flattenComposedTree` handles them structurally, but the Ember port
frequently reuses this addon's *own* components instead of a 1:1 port of
the nested web-component (e.g. `Toolbar` reuses `Tooltip`/`OverflowMenu`,
`FileUploads` renders its own markup instead of `cds-file-uploader-item`),
so expect real, legitimate structural differences there that need their
own `known-differences.json` reasoning per component - it isn't only a
copy-paste of the `Processing`/`ReasoningSteps` pattern already in the
suite. Also check whether the shadow template is mostly `<slot>`s: if so,
the flattened tree is dominated by caller-supplied content and the
comparison won't say much about the component's own markup - pick a
different variant/component, or accept the weaker coverage and say so.

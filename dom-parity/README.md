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

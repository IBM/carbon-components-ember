# dom-parity

DOM-level parity fixtures for `carbon-components-ember`.

Renders a pinned `@carbon/react` release with `react-dom/client` (in jsdom,
via `act()` so post-effect DOM is captured, not `renderToStaticMarkup`'s
pre-effect markup) and normalizes the result (tag, sorted classes,
attributes, inline style, text) into a JSON fixture per component - see
`lib/normalize-dom.mjs`.

The comparison itself lives in test-app's QUnit suite
(`test-app/tests/components/dom-parity-test.gts`), which renders the Ember
component and diffs its normalized DOM against the committed fixture. This
package is only the offline fixture generator - the QUnit suite never runs
it itself, it only reads `fixtures/*.json`.

## Regenerating fixtures

```sh
pnpm --filter dom-parity generate
```

Rerun this after bumping the pinned `@carbon/react` version in
`package.json`, or after adding a new entry to `lib/components.mjs`.

## Adding a component

1. Add an entry to `lib/components.mjs` describing how to render the
   `@carbon/react` component.
2. Run `pnpm --filter dom-parity generate` to write its fixture.
3. Add a matching render case to
   `test-app/tests/components/dom-parity-test.gts`, passing the same props
   on the Ember side.
4. Run the test-app suite. Genuine, intentional gaps (not test bugs) go in
   `known-differences.json` with a `path` (matching the diff output's
   `path`) and a `reason` - don't silently drop a real difference just to
   get a green suite.

## Version pinning

`@carbon/react`'s version should track the `@carbon/styles` range this
addon itself already depends on (see `carbon-components-ember/package.json`),
since that's the class/markup generation these components share - not
just "latest". Check with:

```sh
npm view @carbon/react@<candidate> dependencies.@carbon/styles
```

# How To Contribute

## Installation

- `git clone <repository-url>`
- `cd carbon-components-ember`
- `pnpm install` – the pnpm version is pinned in `package.json#packageManager`;
  pnpm switches to it automatically (or run `corepack enable` once). Node is
  pinned in `package.json#devEngines.runtime`: pnpm downloads that version and
  runs every script with it, whatever Node you have installed.
- `pnpm --filter carbon-components-ember generate` – generates the icon components and the barrels

## Linting

- `pnpm lint`
- `pnpm lint:fix`

## Building the addon

- `pnpm build:carbon`

## Running tests

The tests live in `carbon-components-ember/tests` and run against the addon's
source, following the [`@ember/addon-blueprint`](https://github.com/ember-cli/ember-addon-blueprint) layout.

- `pnpm test` – runs the whole suite in Playwright's pinned Chromium
  (`pnpm --filter carbon-components-ember exec playwright install chromium` once first)
- `pnpm start` – starts the Vite dev server; open `/tests/` to run the tests in your
  browser (e.g. `/tests/?filter=Button` for a subset)
- `pnpm --filter carbon-components-ember test:update-snapshots` – re-records the style
  snapshots in `carbon-components-ember/tests/__snapshots__`

## Docs (Storybook)

The documentation site is a Storybook: each component has a colocated
`*.stories.gts` file, and its docs page is generated from the component's Glint
signature and JSDoc.

- `pnpm storybook` – starts Storybook on <http://localhost:6006>
- `pnpm --filter carbon-components-ember test:storybook` – runs every story as a
  browser test, axe accessibility checks included
- `pnpm build:storybook` – builds the static site (published at
  `versions/<version>/` on GitHub Pages)

CI also compares each story with its screenshot from main and fails on a
difference unless the PR has the `preview` label, for visual changes. A comment
on the PR lists the stories that differ, each with what changed in it, and the
run's artifacts hold their images. CI takes the screenshots on Linux, so locally there's nothing to compare
with until you take your own: run `test:storybook --update` on main, then
`test:storybook` on your branch.

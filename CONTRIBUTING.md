# Contributing

This is a pnpm workspace. The addon is in [`carbon-components-ember/`](carbon-components-ember), [`dom-parity/`](dom-parity) compares it with Carbon React, [`scripts/`](scripts) holds the parity checks, and [`carbon-components-ember-mcp/`](carbon-components-ember-mcp) is the MCP server apps install.

The conventions the code follows are in [AGENTS.md](AGENTS.md), for people and AI agents alike: read it before your first component. Step-by-step procedures are skills in [`.claude/skills/`](.claude/skills). Agents load them, and they read as plain docs too.

## Setup

1. Clone the repository, or your fork if you can't push to it: `git clone https://github.com/IBM/carbon-components-ember.git`, then `cd carbon-components-ember`.
2. Install pnpm 10 or later if you don't have it ([pnpm.io/installation](https://pnpm.io/installation)). Here it switches itself to the version `package.json#packageManager` pins, downloads the Node that `devEngines.runtime` pins, and runs every script with that Node, whatever Node you have. npm and npx refuse to run in the repository unless your Node matches, so use `pnpm exec` and `pnpm dlx`.
3. `pnpm install`. It also downloads the Chromium the tests run in. Its warning about peer dependencies is expected.
4. `pnpm --filter carbon-components-ember generate`. It writes the icon components, which aren't committed, and the barrels (`src/components.ts` and the others), which are. Run it again when you pull a Carbon upgrade, and after you add a component, then commit the barrel it changed.

The root `package.json` has the scripts that run from the root, such as `pnpm test`, `pnpm lint` and `pnpm storybook`. The addon's others, such as `generate`, run as `pnpm --filter carbon-components-ember <script>`, or as `pnpm <script>` inside `carbon-components-ember/`.

## The dev loop

- `pnpm storybook` serves Storybook on <http://localhost:6006>, where you see your work. A component's stories sit next to it (`tag.stories.gts`), and its docs page is generated from its signature, JSDoc and stories.
- `pnpm start` serves the tests: <http://localhost:4200/tests/?filter=Tag> runs a component's tests in your browser.
- `pnpm --filter carbon-components-ember test:storybook src/components/tag.stories.gts` runs a story file as browser tests, with axe's accessibility checks.
- `pnpm lint` runs every linter, type-checking included, in about a minute, and `pnpm lint:fix` fixes what it can.

Locally, run the tests and stories of what you changed, and lint; CI runs everything. The full suites are `pnpm test`, in Playwright's Chromium, and `pnpm --filter carbon-components-ember test:storybook`, for every story. `pnpm build:carbon` builds the addon into `carbon-components-ember/dist`, and `pnpm build:storybook` builds the Storybook that's published on GitHub Pages.

The style snapshots in `carbon-components-ember/tests/__snapshots__` record components' computed styles ([Tests](AGENTS.md#tests) in AGENTS.md). After a change to a component's styles, `pnpm --filter carbon-components-ember test:update-snapshots` records them again; commit the ones that changed.

If the tests can't find Chromium, run `pnpm --filter carbon-components-ember exec playwright install chromium`. If stories stop loading in Storybook after you pull, switch branches or regenerate, with a 500 or 504 in the browser's console, stop it, delete `carbon-components-ember/node_modules/.cache/storybook` and start it again.

## Building or aligning a component

The weekly parity check files an issue for each gap with Carbon React: `[Parity Check] Investigate X component` for a component we don't have, `[Parity Check] Update X component` for upstream changes to one we have. Pick one, and assign it to yourself or say on it that you're taking it.

Then follow the [implement-component](.claude/skills/implement-component/SKILL.md) steps. For Tag, which we have, they lead to these:

| Step | For Tag |
| --- | --- |
| Carbon React's source, stories and tests | [`packages/react/src/components/Tag`](https://github.com/carbon-design-system/carbon/tree/v11.114.0/packages/react/src/components/Tag) at `v11.114.0`, the tag of the `@carbon/react` 1.114.0 we pin, and its [live stories](https://react.carbondesignsystem.com/?path=/docs/components-tag--overview) |
| React's constructs as Ember idioms | React's `decorator` prop is a `<:decorator>` block that yields an `AILabel`, and its `as` is `@href` or `@route`, through `-private/router-link.gts` |
| The component | [`tag.gts`](carbon-components-ember/src/components/tag.gts), with the styles Carbon doesn't provide in [`tag.scss`](carbon-components-ember/src/components/tag.scss) |
| Its arguments against React's | `as` is in [`known-arg-differences.json`](dom-parity/known-arg-differences.json), still to do, and `@href` and `@route` are in [`accepted-arg-differences.json`](dom-parity/accepted-arg-differences.json), with the reasons |
| Its DOM against React's | its variants in [`lib/components.mjs`](dom-parity/lib/components.mjs), the fixture they generate in [`fixtures/Tag.json`](dom-parity/fixtures/Tag.json), and the same variants in [`dom-parity-test.gts`](carbon-components-ember/tests/components/dom-parity-test.gts) |
| Tests | [`tag-test.gts`](carbon-components-ember/tests/components/tag-test.gts) |
| Stories | [`tag.stories.gts`](carbon-components-ember/src/components/tag.stories.gts), with React's stories it doesn't have (Dismissible, Operational and Selectable) listed as parity gaps at the top |
| Its parity issue | [#825](https://github.com/IBM/carbon-components-ember/issues/825), "Update Tag component" |

Carbon AI Chat's components follow [port-ai-chat-component](.claude/skills/port-ai-chat-component/SKILL.md) instead, and a Carbon upgrade follows [upgrade-carbon](.claude/skills/upgrade-carbon/SKILL.md).

## Opening a pull request

1. Push a branch and open the pull request against `main`. Sign off each commit (`git commit -s`), or the DCO check fails.
2. Title it as a Conventional Commit, such as `feat: add ButtonSet, as in Carbon React`, with a `!` for a breaking change (`fix!: …`). Pull requests are squash-merged, and the release notes use their titles.
3. In the template, say what changed and why, with `Closes #N` for the issue it finishes. For an "Update" parity issue, mark the component synced on your branch first (step 11 of implement-component).
4. Give it the labels and milestone [track-work](.claude/skills/track-work/SKILL.md#pull-requests) lists, `preview` included if it changes what renders. Without write access, a maintainer adds them.

CI runs on every push, and `main` needs Lint, Test, ember-latest and Docs to pass, and an approval. CI also compares each story with its screenshot from main, and fails on a difference unless the pull request has the `preview` label, which says the change is meant. A comment on the pull request then lists the stories that differ, each with what changed in it, and the label deploys a preview of the branch's Storybook. CI takes the screenshots on Linux, so locally there's nothing to compare with until you take your own: run `pnpm --filter carbon-components-ember test:storybook --update` on main, then `test:storybook` on your branch.

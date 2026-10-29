---
name: implement-component
description: Add a Carbon component to this addon, or bring an existing one to parity with Carbon React. The steps from reading the React source to the signature, barrel export, argument and DOM parity, tests, stories and the pull request.
---

# Building or Aligning a Component

AGENTS.md's patterns, conventions and pitfalls apply at every step. [CONTRIBUTING.md](../../../CONTRIBUTING.md) says how to run things, and shows where these steps lead for Tag. Commands run from the repository root.

1. Read Carbon React's component, its stories and its tests at the version we pin: `@carbon/react` in `pnpm-workspace.yaml`'s `carbon` catalog. Carbon tags `@carbon/react` 1.N as `v11.N`, so 1.114.0 is `https://github.com/carbon-design-system/carbon/tree/v11.114.0/packages/react/src/components/<Name>`. Parity issues link `main`, which can be ahead. See it in [Carbon React's Storybook](https://react.carbondesignsystem.com/) too.
2. Map each React construct to its Ember idiom ([Idiomatic Ember Patterns](../../../AGENTS.md#idiomatic-ember-patterns-prefer-these-over-transliterating-react)).
3. Write `carbon-components-ember/src/components/<name>.gts`, named after its export (Pitfall 2 in [Common Pitfalls](../../../AGENTS.md#common-pitfalls-and-solutions)), with the license header first and Carbon's `cds--` classes ([Component Implementation Patterns](../../../AGENTS.md#component-implementation-patterns)). Styles Carbon doesn't provide go in `<name>.scss` beside it.
4. Type its signature ([Signatures](../../../AGENTS.md#6-signatures)). Reuse the args, types and helpers that exist instead of copying them.
5. `pnpm --filter carbon-components-ember generate` exports it from its barrel (`src/components.ts`); commit the barrel.
6. Compare its arguments with React's props: `pnpm --filter dom-parity args --component <Name>`. Match React, or record a deliberate difference, with its reason, in `dom-parity/accepted-arg-differences.json`. CI runs `pnpm --filter dom-parity args --check`. The check only knows the components React exports under the same name, not ones it exports only as `preview__<Name>`, such as IconIndicator.
7. Compare its DOM with React's, as most components do: add its variants to `dom-parity/lib/components.mjs`, run `pnpm --filter dom-parity generate` (it rewrites every fixture, so commit only your component's), and render the same variants in `carbon-components-ember/tests/components/dom-parity-test.gts` ([dom-parity's README](../../../dom-parity/README.md#adding-a-component-or-variant)).
8. Test it in `carbon-components-ember/tests/components/<name>-test.gts` ([Tests](../../../AGENTS.md#tests)).
9. Write `<name>.stories.gts` beside it, mirroring Carbon React's stories ([Storybook Conventions](../../../AGENTS.md#storybook-conventions)). With `pnpm storybook` running, `node scripts/story-parity.mjs --ember http://localhost:6006/index.json --title "Components/<Name>"` lists React's stories it doesn't have. Without `--ember`, it reads main's deployed Storybook.
10. Run its tests and stories, and lint ([the dev loop](../../../CONTRIBUTING.md#the-dev-loop)).
11. Settle its parity issue on the branch. An "Investigate" issue needs nothing. An "Update" issue closes only once each upstream commit it lists is ported or doesn't apply (say which in the pull request). Then `node scripts/parity-check.mjs --mark-synced <Name>` records it in `.parity-check-data.json`, which you commit, or the weekly check reopens the issue; it needs a `GITHUB_TOKEN` only if GitHub's rate limit stops it. A React directory with no export of the same name is excluded instead: with `GITHUB_TOKEN` set, `node scripts/parity-check.mjs --exclude <Name> --reason "..." --issue <N>` records it in `.parity-check-exclusions.json` and closes the issue with the reason.
12. Open the pull request with `Closes #N` for its parity issue ([Opening a pull request](../../../CONTRIBUTING.md#opening-a-pull-request)).

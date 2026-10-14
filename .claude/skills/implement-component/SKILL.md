---
name: implement-component
description: Add a Carbon component to this addon, or bring an existing one to parity with Carbon React. The checklist from reading the React source to the signature, barrel export, prop parity, tests and stories.
---

# Component Implementation Checklist

Follow AGENTS.md's patterns, conventions and pitfalls at each step.

- [ ] Review React implementation at GitHub
- [ ] Check Storybook for visual reference
- [ ] Map each React construct to its Ember idiom
- [ ] Create `.gts` file in `carbon-components-ember/src/components/`
- [ ] Define TypeScript signature — fully typed, no `any`
- [ ] Use `cds--` prefix for CSS classes
- [ ] Export it: run `pnpm generate` to regenerate public barrel exports
- [ ] Match React's props: `pnpm --filter dom-parity args --component <Name>`
- [ ] When the PR closes a `[Parity Check]` issue, run `node scripts/parity-check.mjs --mark-synced <Component>` (with `GITHUB_TOKEN`) and commit `.parity-check-data.json`, or the weekly check reopens it; a React directory with no same-named export needs `--exclude <Name> --reason "..."`
- [ ] Create test file in `tests/components/`
- [ ] Add a colocated `<name>.stories.gts` mirroring Carbon React's stories; `node scripts/story-parity.mjs --title "Components/<Name>"` lists the ones it's missing
- [ ] Validate locally: `pnpm build && pnpm test && pnpm test:storybook`

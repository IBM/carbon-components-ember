---
name: upgrade-carbon
description: Upgrade the Carbon packages (the `carbon` catalog in pnpm-workspace.yaml, led by `@carbon/react`) or TypeScript in this repo, then regenerate the dom-parity fixtures and compare arguments with Carbon React's.
---

# Upgrading Carbon and TypeScript

- `pnpm-workspace.yaml`'s catalogs pin the dependencies we upgrade by hand, referenced as `catalog:carbon` and `catalog:typescript`. Dependabot ignores them; never bump one on its own.
- **Carbon:** upgrade the `carbon` catalog in one change, led by `@carbon/react`. `@carbon/styles` and `@carbon/layout` follow its dependencies, `@carbon/grid` and `@carbon/themes` follow `@carbon/styles`'s, and `@carbon/icons` and `@carbon/icon-helpers` follow `@carbon/icons-react`'s (`@carbon/icons` shares its version). `@carbon/utilities` may run ahead when the addon needs a newer API (0.25 for Carousel), and `@carbon/ai-chat-components` follows its own releases, with `markdown-it` kept on its major (Dependabot skips markdown-it majors). Then regenerate the dom-parity fixtures (`pnpm --filter dom-parity generate`) and compare arguments (`pnpm --filter dom-parity args`). Fix what changed, or record it: DOM differences in `dom-parity/known-differences.json`, argument differences with `args --update`.
- **Watched releases:** check whether the new versions ship what an open `upstream-watch` issue waits for (`gh issue list --label upstream-watch`), such as Carbon React exporting SidePanel (#748), and move that issue to Ready.
- **TypeScript:** stays on 6.0 until Glint supports TypeScript 7; [#948](https://github.com/IBM/carbon-components-ember/pull/948) tracks the upgrade.

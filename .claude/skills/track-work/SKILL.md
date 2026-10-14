---
name: track-work
description: File and update this repo's issues, pull requests and roadmap projects - labels, milestone, sub-issues, "blocked by" links and project fields. Use when opening an issue or pull request, finishing one, or changing what's planned.
---

# Tracking Work

Planning lives in two GitHub Projects owned by the IBM org and linked to this repo:

- [carbon-components-ember roadmap](https://github.com/orgs/IBM/projects/166): everything before the stable release. Its criteria are in the pinned issue #1018.
- [carbon components ember - carbonv12](https://github.com/orgs/IBM/projects/167): what Carbon v12 means for the addon, after the stable release.

## Pull Requests

- **One release label:** `breaking`, `enhancement`, `bug`, `documentation` or `internal`. release-plan won't plan a release while a merged PR has none.
- **`preview`** for visual changes; it deploys a Storybook preview.
- **Milestone `Stable`** for work before the stable release.
- **`Closes #N`** for the issue it finishes. A parity-check issue also needs `--mark-synced` (see [implement-component](../implement-component/SKILL.md)).
- **A roadmap item** with Phase, Area and Size, Status "In review".

## Issues

- Describe the problem and the goal in terms of Carbon React's behaviour and this addon's code.
- File each under its epic as a sub-issue: #1018 release, #1021 Carbon React's API on existing components, #1031 shared building blocks, #1041 missing components, #1043 bugs and robustness, #1061 agent tooling (MCP server, skills, agent docs), #1087 docs parity with Carbon React's Storybook, #1055 Carbon v12. Missing components reuse the parity check's "Investigate" issues.
- Record the order of work with "blocked by" links.
- Labels besides the release ones: `a11y`, `i18n`, `primitive`, `new-component`, `api-parity`, `tooling`, `upstream-watch`, `needs-decision`.
- The issue forms add new issues to the roadmap when their author can write to it.

## Roadmap Fields

- **Status:** Todo → Ready (scoped and unblocked) → In progress → In review → Done.
- **Phase:** 1 Finish in-flight · 2 API parity · 3 Building blocks · 4 New components · 5 Tooling & docs · Watching (upstream changes).
- **Area:** Forms · Overlays · Navigation · Data · Feedback · Infrastructure · Agent tooling.
- **Size:** S · M · L. Epics have neither Area nor Size.
- Draft items are ideas. Convert one to an issue when it moves to Ready.

## With `gh`

Projects need the token's `project` scope: `gh auth refresh -s project`.

- Open a PR: `gh pr create --label internal --milestone Stable --assignee @me …`.
- Sub-issue: `gh api -X POST repos/IBM/carbon-components-ember/issues/<parent>/sub_issues -F sub_issue_id=<child id>`.
- Blocked by: `gh api -X POST repos/IBM/carbon-components-ember/issues/<n>/dependencies/blocked_by -F issue_id=<blocker id>`.
  - Both take the issue's database id: `gh api repos/IBM/carbon-components-ember/issues/<n> --jq .id`.
- Add to the roadmap: `gh project item-add 166 --owner IBM --url <issue or PR url>`.
- Set a field: `gh project item-edit --project-id <project id> --id <item id> --field-id <field id> --single-select-option-id <option id>`.
  - Project id (`PVT_…`): `gh project view 166 --owner IBM --format json --jq .id`.
  - Item id (`PVTI_…`): from `gh project item-add … --format json --jq .id`, or `gh project item-list 166 --owner IBM --format json`.
  - Field and option ids: `gh project field-list 166 --owner IBM --format json`.
- Post a status update: GraphQL `createProjectV2StatusUpdate`.

## Gotchas

- Workflows (closed → Done, merged → Done, auto-add, auto-archive) can only be switched on in the project's settings. The API lists and deletes them.
- Views: `POST /orgs/IBM/projectsV2/<n>/views` creates one (`filter`, `group_by`, `sort_by` and `visible_fields`, by field database id). GraphQL's `updateProjectV2View` renames one and `deleteProjectV2View` deletes one. Views can't be reordered.
- Replacing a single-select field's options gives them new ids, and workflows that set the old ones stop working. Add or rename options in the UI.
- A new draft item can take a minute to appear in `gh project item-list`.

# Carbon Components Ember

An Ember implementation of IBM's [Carbon Design System](https://carbondesignsystem.com), kept in parity with [`@carbon/react`](https://react.carbondesignsystem.com): the same components, arguments and behaviour, written as idiomatic Ember with fully typed Glint signatures.

**[Browse the components →](https://ibm.github.io/carbon-components-ember/)** Every component has live stories, a generated API table and copyable code.

## Install

```sh
pnpm add carbon-components-ember @carbon/styles
pnpm add -D sass
```

It's a v2 addon for strict-mode templates (`.gts` and `.gjs`). Embroider and Vite apps work as they are; classic ember-cli apps need `ember-auto-import` 2 and `ember-template-imports`. Tested against `ember-source` 7, and in CI against its beta and alpha channels.

pnpm 12 stops the first install at dependencies' build scripts. Carbon's packages (`@carbon/*` and `@ibm/plex*`) only send IBM's install telemetry, and `@parcel/watcher` (from `sass`) ships prebuilt, so deny them with [`pnpm approve`](https://pnpm.io/cli/permissions) or [`allowBuilds`](https://pnpm.io/settings/build#allowbuilds).

## Set Up

Load Carbon's styles, then the addon's own, once in your app's entry point:

```ts
import '@carbon/styles/css/styles.css';
import 'carbon-components-ember/styles.scss';
```

Add the two elements some components render into to your application template:

```gts
<template>
  {{outlet}}

  {{! Dropdown, Select and OverflowMenu menus }}
  <div id="ember-basic-dropdown-wormhole"></div>
  {{! The confirmation dialog of a @danger Button or Icon }}
  <div id="carbon-components-dialog-id"></div>
</template>
```

## Use

Import components into your `.gts` templates, from the package or from each component's own module:

```gts
import { Button, TextInput } from 'carbon-components-ember/components';
import Add from 'carbon-components-ember/components/icons/add';

<template>
  <TextInput @labelText="Name" />
  <Button @type="primary">Save</Button>
  <Button @iconOnly={{true}} aria-label="Add">
    <Add @size="16" />
  </Button>
</template>
```

Icons are components too: import each one from `carbon-components-ember/components/icons/<name>` and give it a `@size`. The [Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat) components come from `carbon-components-ember/ai-chat`, under upstream's names (`ChatShell`, `CodeSnippet`), and the charts from `carbon-components-ember/charts`, under [`@carbon/charts-react`](https://charts.carbondesignsystem.com/react)'s names (`SimpleBarChart`, `LineChart`, `PieChart`).

> [!IMPORTANT]
> **Strict mode only.** Import components, icons and modifiers as above. Loose-mode `.hbs` templates can't resolve them by name: `<Carbon::TextInput>` and `{{component "carbon/text-input"}}` don't work. Write the templates that use them as `.gts` or `.gjs`.

Components forward `...attributes` to their main element, so `class`, `id`, ARIA attributes and modifiers work on them, and Glint type-checks every argument, block and attribute.

Components don't render `style` attributes, which a Content Security Policy without `'unsafe-inline'` blocks. They set inline styles through CSSOM instead, with the `{{style}}` modifier from [ember-style-modifier](https://github.com/jelhan/ember-style-modifier), and their tests run under `style-src-attr 'none'`. Under such a policy, style them with classes rather than `style="..."`, and set values you compute with `{{style}}` (add ember-style-modifier to your app's dependencies).

Unlike components, services are looked up by name, under `carbon.`:

```ts
import Component from '@glimmer/component';
import { service } from '@ember/service';
import type NotificationService from 'carbon-components-ember/services/notifications';

class Save extends Component {
  @service('carbon.notifications') declare notifications: NotificationService;
}
```

## Use with AI agents

The package ships an [agent skill](https://agentskills.io) for coding agents. It tells them to look each component up rather than guess, how Carbon's docs and Figma designs, written for React, carry over to Ember, and to type-check what they write with Glint. It also carries every component's import, arguments, blocks and examples. All of it comes with the version your app has installed, so it updates with the package and works offline.

Install it with one of these:

- **pnpm 12.11 or later:** run `pnpm approve carbon-components-ember` once and commit the change it makes to `pnpm-workspace.yaml`. Every install then links the skill into an agent skills folder: one your project has, such as `.claude/skills`, the one of an agent running the install, or one named in `skills.dirs`. See pnpm's [Agent Skills](https://pnpm.io/agent-skills).
- **[TanStack Intent](https://tanstack.com/intent/latest/docs/getting-started/quick-start-consumers),** with any package manager: once it's set up, agents load the skill as `carbon-components-ember#carbon-components-ember`.
- **[skills-npm](https://github.com/antfu/skills-npm),** for npm and Yarn: it links the skill on every install.
- **No tool:** tell your agent, in your `AGENTS.md`, to read `node_modules/carbon-components-ember/skills/carbon-components-ember/SKILL.md` before working on the UI.

[`carbon-components-ember-mcp`](https://github.com/IBM/carbon-components-ember/tree/main/carbon-components-ember-mcp#readme) serves the same docs over MCP, and gives agents the skill's instructions when they connect. Add it from your app's directory, for example in Claude Code:

```sh
claude mcp add carbon-components-ember -- npx -y carbon-components-ember-mcp
```

Its README covers VS Code and Cursor.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). [AGENTS.md](AGENTS.md) holds the conventions the codebase follows, for people and AI agents alike.

## License

[Apache License 2.0](LICENSE.md).

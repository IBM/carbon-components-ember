# Carbon Components Ember

An Ember implementation of IBM's [Carbon Design System](https://carbondesignsystem.com), kept in parity with [`@carbon/react`](https://react.carbondesignsystem.com): the same components, arguments and behaviour, written as idiomatic Ember with fully typed Glint signatures.

**[Browse the components →](https://ibm.github.io/carbon-components-ember/)** Every component has live stories, a generated API table and copyable code.

## Install

```sh
pnpm add carbon-components-ember @carbon/styles
pnpm add -D sass
```

It's a v2 addon. Embroider and Vite apps work as they are; classic ember-cli apps need `ember-auto-import` 2. Tested against `ember-source` 7, and in CI against its beta and alpha channels.

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

Icons are components too: import each one from `carbon-components-ember/components/icons/<name>` and give it a `@size`.

Components forward `...attributes` to their main element, so `class`, `id`, ARIA attributes and modifiers work on them, and Glint type-checks every argument, block and attribute.

Services are namespaced under `carbon.`:

```ts
import Component from '@glimmer/component';
import { service } from '@ember/service';
import type NotificationService from 'carbon-components-ember/services/notifications';

class Save extends Component {
  @service('carbon.notifications') declare notifications: NotificationService;
}
```

## Use with AI agents

[`carbon-components-ember-mcp`](https://github.com/IBM/carbon-components-ember/tree/main/carbon-components-ember-mcp#readme) gives coding agents the docs for the version your app has installed: each component's import, arguments, blocks and examples. Add it from your app's directory, for example in Claude Code:

```sh
claude mcp add carbon-components-ember -- npx -y carbon-components-ember-mcp
```

Its README covers VS Code and Cursor, and the [instructions](https://github.com/IBM/carbon-components-ember/blob/main/carbon-components-ember-mcp/instructions.md) the server gives agents: look components up rather than guess, and type-check what they write with Glint. Copy them into your `AGENTS.md` to give them to every agent.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). [AGENTS.md](AGENTS.md) holds the conventions the codebase follows, for people and AI agents alike.

## License

[Apache License 2.0](LICENSE.md).

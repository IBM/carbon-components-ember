---
name: carbon-components-ember
description: Build Ember UIs with carbon-components-ember, IBM's Carbon Design System as Ember components. Use when writing or changing templates that use its components (Button, TextInput, DataTable, Dropdown, Tabs, Notification and the rest), when choosing a Carbon component for a piece of UI, or when working from Carbon's docs or a Figma design.
---

# carbon-components-ember

This app's UI uses carbon-components-ember: IBM's Carbon Design System as Ember components. These docs ship with the version the app has installed.

- **Look components up before using them.** [references/components.md](references/components.md) lists every component, and each entry links to its import, arguments, blocks and examples. Use only what they document. A component that isn't listed still has its signature in `node_modules/carbon-components-ember/declarations/components/<name>.d.ts`.
- **Templates.** Components are invoked with angle brackets in `.gts` templates. They take `@` arguments, callbacks included (`@onChange`), and blocks for their content. They forward `...attributes`, so `class`, `aria-*` and modifiers such as `{{on "click"}}` go on the component itself.
- **Icons are components.** Import each one from `carbon-components-ember/components/icons/<name>` and give it a `@size`: `import CheckmarkFilled from 'carbon-components-ember/components/icons/checkmark-filled'`, then `<CheckmarkFilled @size="16" />`.
- **Carbon's docs describe React.** Carbon's website, its Figma kits and most of what you know about Carbon are written for `@carbon/react`, and the API here follows it: a prop is an `@` argument with the same name and values (`labelText` is `@labelText`), `children` are blocks, and an icon's module is its `@carbon/icons-react` name in kebab case. A few components don't match React yet, so check their reference rather than assume. [references/react-api.md](references/react-api.md) covers the rest: element props, render props, state and events.
- **Type-check what you write.** After editing `.gts` files, run the app's Glint check (`ember-tsc --noEmit`, often the `lint:types` script) and fix every error. Glint checks each component's arguments, blocks and attributes, so an error there usually means a wrong or misspelled argument. Look the component up again rather than casting the error away.
- **Setup.** The app loads `@carbon/styles/css/styles.css` and `carbon-components-ember/styles.scss` once, and its application template renders `<div id="ember-basic-dropdown-wormhole"></div>` and `<div id="carbon-components-dialog-id"></div>`. If a Dropdown's menu or a confirmation dialog doesn't appear, check these first.

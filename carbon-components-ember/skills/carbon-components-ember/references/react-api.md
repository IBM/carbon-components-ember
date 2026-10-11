# Carbon's React API in Ember

Carbon's website, its Figma kits and most of what agents know about Carbon describe `@carbon/react`. The components here follow its API, so what those sources say carries over with Ember's syntax. Look up each component in [components.md](components.md) for its exact arguments and blocks, because a few don't match React yet.

- **Imports.** `import { TextInput } from '@carbon/react'` becomes `import { TextInput } from 'carbon-components-ember/components'`. Each component's reference shows its import.
- **Props** become arguments with the same names and values: `labelText="Name"` is `@labelText="Name"`. Booleans and numbers go in curlies: `disabled` is `@disabled={{true}}`, `max={10}` is `@max={{10}}`.
- **`className` and pass-through attributes** (`aria-*`, `data-*`) are plain attributes on the component: `class="wide"`. A prop the component declares, such as TextInput's `id`, stays an argument (`@id`).
- **`children`** are the default block: `<Tag>Beta</Tag>`.
- **Parts used as children**, such as `AccordionItem` or `AILabelContent`, are usually yielded by their parent, already wired to it: `<Accordion as |Item|><Item @title="Plan">…</Item></Accordion>`.
- **A prop that takes an element**, such as `decorator={<AILabel>…</AILabel>}`, is a named block that yields the part: `<:decorator as |AILabel|><AILabel as |label|><label.Content>…</label.Content></AILabel></:decorator>`.
- **A prop that takes a component**, such as `renderIcon={Add}`, takes it as an argument: `@renderIcon={{Add}}`.
- **Icons.** `import { Add } from '@carbon/icons-react'` and `<Add size={16} />` become `import Add from 'carbon-components-ember/components/icons/add'` and `<Add @size="16" />`. The module is the React name in kebab case.
- **Render props**, such as DataTable's `{({ rows, headers, getTableProps }) => …}`, are yielded components: `<DataTable as |table|>` yields `<table.Table>`, `<table.Header>` and `<table.EachBodyRows>`. The component's reference shows its arguments and how the parts fit together.
- **Callbacks**: `onChange={handler}` is `@onChange={{this.handler}}`. Check the argument's type in the reference for what the callback receives.
- **Controlled and uncontrolled** components take the same arguments as in React, where they have them: `@value` with `@onChange`, or `@defaultValue`.
- **`useState`** is a `@tracked` property on a Glimmer component class.
- **`useRef` and `useEffect`** on an element become a modifier on the component, which `...attributes` forwards to its element.
- **Conditionals and lists**: `{isOpen && <X />}` is `{{#if this.isOpen}}<X />{{/if}}`, and `items.map((item) => …)` is `{{#each this.items as |item|}}…{{/each}}`.

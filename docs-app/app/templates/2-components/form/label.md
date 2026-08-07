<ThemeSwitcher />

# FormLabel

`FormLabel` renders a standalone `<label>` element styled to match the rest
of the Carbon form controls. It is useful when you need a label that is not
already built into a form control, such as when labeling a custom or
composite widget.

```gjs live preview
import { FormLabel } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <FormLabel>Form label</FormLabel>
</template>
```

## With a Toggletip

It is not recommended to include interactive items, such as links or
tooltips, inside a form label for accessibility reasons. Instead, place a
`Toggletip` (or `Tooltip`) as a sibling of the `FormLabel`.

```gjs live preview
import { FormLabel, Toggletip, ToggletipContent } from 'carbon-components-ember/components';
import { Information } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <div>
      <FormLabel>Form label with Toggletip</FormLabel>
      <Toggletip as |t|>
        <t.Button @label='Show information'>
          <Information />
        </t.Button>
        <t.Content>
          This can be used to provide more information about a field.
        </t.Content>
      </Toggletip>
    </div>
</template>
```

## Associating with a form control

Pass `@id` to associate the label with a form control via the `for`
attribute.

```gjs live preview
import { FormLabel } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <FormLabel @id="my-input">Name</FormLabel>
    <br />
    <input id="my-input" class="cds--text-input" type="text" />
</template>
```

## API Reference

<details>
<summary><h3>FormLabel</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/form-label'
    @name='default'
  />
</template>
```
</details>

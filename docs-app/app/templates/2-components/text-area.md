<ThemeSwitcher />

# TextArea

TextArea allows the user to enter multiple lines of text.

```gjs live preview
import { TextArea } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject();

const update = (value) => {
  context.value = value;
}

<template>
    <ThemeSupport />
    <TextArea @labelText="Comments" @placeholder="Enter your comments" @helperText="Optional" />
    <br />
    <TextArea @labelText="Controlled" @value={{context.value}} @onChange={{update}} />
    <br/>
    value: {{context.value}}
    <br />
    <TextArea @labelText="With a counter" @enableCounter={{true}} @maxCount={{100}} @helperText="Up to 100 characters" />
    <br />
    <TextArea @labelText="With a word counter" @enableCounter={{true}} @maxCount={{20}} @counterMode="word" @helperText="Up to 20 words" />
    <br />
    <TextArea @labelText="Invalid" @invalid={{true}} @invalidText="A valid value is required" />
    <br />
    <TextArea @labelText="Warning" @warn={{true}} @warnText="This value may cause issues" />
    <br />
    <TextArea @labelText="Disabled" @disabled={{true}} @value="Can't touch this" />
    <br />
    <TextArea @labelText="Read-only" @readOnly={{true}} @value="Read-only value" />
    <br />
    <TextArea @labelText="Fixed size" @cols={{50}} @rows={{6}} @helperText="Not resizable horizontally" />
</template>
```

## Decorator

**Experimental**: Provide a `@decorator` (or the deprecated `@slug`) component
to render inside the TextArea, such as an AILabel once it's available (see
[#406](https://github.com/IBM/carbon-components-ember/issues/406)). Any
component can be used in the meantime; this example uses an icon as a
stand-in.

```gjs live preview
import { TextArea } from 'carbon-components-ember/components';
import { Add } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <TextArea @labelText="With a decorator" @helperText="Optional helper text" @decorator={{Add}} />
</template>
```

## Skeleton

```gjs live preview
import { TextAreaSkeleton } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <TextAreaSkeleton />
</template>
```

## API Reference

<details>
<summary><h3>TextArea</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/text-area'
    @name='default'
  />
</template>
```
</details>

<details>
<summary><h3>TextAreaSkeleton</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/text-area-skeleton'
    @name='default'
  />
</template>
```
</details>

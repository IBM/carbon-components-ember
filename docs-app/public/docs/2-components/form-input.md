<ThemeSwitcher />

# Form Input

```gjs live preview
import { FormInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { TrackedObject } from 'tracked-built-ins';
import { fn } from '@ember/helper';
import { not } from 'ember-truth-helpers';
const context = new TrackedObject({});

<template>
    <ThemeSupport />
    <br>
    <FormInput @label="some label" />
    <br>
    <FormInput @help="some help" />
    <br>
    <FormInput @errors="some error" @help="some help" />
</template>
```

## API Reference

<details>
<summary><h3>Form Input</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/form-input' 
    @name='default' 
  />
</template>
```
</details>

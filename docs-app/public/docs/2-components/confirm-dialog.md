<ThemeSwitcher />

# Confirm Dialog


```gjs live preview
import { fn } from '@ember/helper';
import { cell } from 'ember-resources';
import { ConfirmDialog, Button } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const context = cell('N/A');

<template>
    <ThemeSupport />
    <Button @onClick={{fn (mut context.current) ''}}>ask</Button>
    {{#unless context.current}}
      <ConfirmDialog
        @type='info'
        @body='are you sure?'
        @onCancel={{fn (mut context.current) 'no'}}
        @onAccept={{fn (mut context.current) 'yes'}}
      />
    {{/unless}}
      <br>
        answer: {{context.current}}
</template>
```
## API Reference

<details>
<summary><h3>Confirm Dialog</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/dialogs/confirm' 
    @name='default' 
  />
</template>
```
</details>

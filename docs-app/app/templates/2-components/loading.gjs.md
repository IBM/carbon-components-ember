<ThemeSwitcher />

# Loading

```gjs live preview
import { fn } from '@ember/helper';
import { cell } from 'ember-resources';
import { Loading, Button } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const showOver = cell();
const not = (x) => !x;

function showWithOverlay() {
  showOver.current = true;
  setTimeout(() => {
    showOver.current = false;
  }, 3000);
}

<template>
    <ThemeSupport />
    <p>loading</p>
    <Loading @withOverlay={{false}} @description='loading' />
    <br>
    <Loading @inline={{true}} @description='inline loading' />
    <br>
    <p>loading active=false</p>
    <Loading @withOverlay={{false}} @active={{false}} />
    <br>
    <p>loading small=false</p>
    <Loading @withOverlay={{false}} @small={{true}} />
    <br>
    {{#if showOver.current}}
        <Loading @withOverlay={{true}} />
    {{/if}}
    <br>
    <Button
        @type='primary'
        @onClick={{showWithOverlay}}
    >
        show with overlay
    </Button>
</template>
```
## API Reference

<details>
<summary><h3>Loading</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/loading' 
    @name='default' 
  />
</template>
```
</details>

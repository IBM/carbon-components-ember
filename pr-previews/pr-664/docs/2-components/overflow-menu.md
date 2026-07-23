<ThemeSwitcher />

# OverflowMenu

```gjs live preview
import { fn } from '@ember/helper';
import { Button, Checkbox, OverflowMenu } from 'carbon-components-ember/components';
import { set } from 'carbon-components-ember/helpers';
import { TrackedObject } from 'tracked-built-ins';
import { ThemeSupport } from 'docs-support';

const context = new TrackedObject();
const not = (x) => !x;

<template>
    <ThemeSupport />
    <Checkbox @checked={{context.danger}} @onChange={{fn (set context 'danger') (not context.danger)}}> danger </Checkbox>
    <Checkbox @checked={{context.disabled}} @onChange={{fn (set context 'disabled') (not context.disabled)}}> disabled </Checkbox>
    <br />
    <OverflowMenu
        @tooltip='Options'
        @direction='bottom'
        @danger={{context.danger}}
        @disabled={{context.disabled}}
        as |Item|
    >
        <Item>option 1</Item>
        <Item
            @tooltip='Option 2 is an example of a really long string and how we recommend handling this'
        >
            Option 2 is an example of a really long string and how we
            recommend handling this
        </Item>
        <Item @onClick={{fn (set context 'selected') 'option 3'}}>option 3</Item>
        <Item @isDanger={{true}}>delete</Item>
        <Item @isDisabled={{true}}>disabled</Item>
        <Item @isDivider={{true}}>option 4</Item>
    </OverflowMenu>
    <br>
    selected: {{context.selected}}
</template>
```
## API Reference

<details>
<summary><h3>OverflowMenu</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/overflow-menu' 
    @name='default' 
  />
</template>
```
</details>

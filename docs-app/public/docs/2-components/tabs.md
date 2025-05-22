<ThemeSwitcher />

# Tabs

```gjs live preview
import { Tabs } from 'carbon-components-ember/components';
import { fn } from '@ember/helper';
import { TrackedObject } from 'tracked-built-ins';
import { ThemeSupport } from 'docs-support';

const context = new TrackedObject({});

<template>
    <ThemeSupport />
    <br>
    <Tabs @loading={{true}} />

    <br />

    <Tabs
        @selectedTab={{context.selected}}
        @tabSelected={{fn (mut context.selected)}}
        as |TabPane|
    >
        <TabPane @title='Tab Label 1' @isDefault={{true}}>
            title:
            {{context.selected}}
        </TabPane>
        <TabPane @title='Tab Label 2' @disabled={{true}}>
            title:
            {{context.selected}}
        </TabPane>
        <TabPane @title='Tab Label 4 with a very long long label'>
            title:
            {{context.selected}}
        </TabPane>
    </Tabs>
</template>
```

## API Reference

<details>
<summary><h3>Tabs</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/tabs' 
    @name='default' 
  />
</template>
```
</details>

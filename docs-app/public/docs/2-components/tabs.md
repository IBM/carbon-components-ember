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

## TabContent

`TabContent` is a standalone panel component for cases where tab selection is
managed outside of `Tabs`, such as a custom tab list.

```gjs live preview
import { TabContent } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { TrackedObject } from 'tracked-built-ins';

const eq = (a, b) => a === b;
const context = new TrackedObject({ selected: 'a' });

<template>
    <ThemeSupport />
    <br>
    <TabContent @selected={{eq context.selected 'a'}}>
        Content A
    </TabContent>
    <TabContent @selected={{eq context.selected 'b'}}>
        Content B
    </TabContent>
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

<details>
<summary><h3>TabContent</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/tab-content' 
    @name='default' 
  />
</template>
```
</details>

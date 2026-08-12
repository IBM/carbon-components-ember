<ThemeSwitcher />

# Tabs

`Tabs` yields a bound `TabPane` component for each tab. The active tab can be
uncontrolled (via `@isDefault`) or controlled with `@selectedTab` /
`@tabSelected`.

```gjs live preview
import { Tabs } from 'carbon-components-ember/components';
import { fn } from '@ember/helper';
import { trackedObject } from '@ember/reactive/collections';
import { ThemeSupport } from 'docs-support';

const context = trackedObject({});

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

## Contained

`@contained` renders the boxed variant instead of the default line style.
`@fullWidth` (contained only) stretches the tabs to fill the available width
in equal shares, and `@secondaryLabel` on a `TabPane` adds a subtitle
(contained only).

```gjs live preview
import { Tabs } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <Tabs @contained={{true}} as |TabPane|>
        <TabPane @title='Tab Label 1' @isDefault={{true}} @secondaryLabel='Additional item information'>
            Content for first tab goes here.
        </TabPane>
        <TabPane @title='Tab Label 2' @secondaryLabel='Additional item information'>
            Content for second tab goes here.
        </TabPane>
        <TabPane @title='Tab Label 3' @disabled={{true}} @secondaryLabel='Additional item information'>
            Content for third tab goes here.
        </TabPane>
    </Tabs>

    <br />

    <Tabs @contained={{true}} @fullWidth={{true}} as |TabPane|>
        <TabPane @title='Tab Label 1' @isDefault={{true}}>
            Content for first tab goes here.
        </TabPane>
        <TabPane @title='Tab Label 2'>
            Content for second tab goes here.
        </TabPane>
    </Tabs>
</template>
```

## Sizes

`@size` accepts `sm`, `md`, `lg`, or (contained only) `xl`.

```gjs live preview
import { Tabs } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <Tabs @size='sm' as |TabPane|>
        <TabPane @title='Tab Label 1' @isDefault={{true}}>Content 1</TabPane>
        <TabPane @title='Tab Label 2'>Content 2</TabPane>
    </Tabs>
    <br />
    <Tabs @contained={{true}} @size='xl' as |TabPane|>
        <TabPane @title='Tab Label 1' @isDefault={{true}}>Content 1</TabPane>
        <TabPane @title='Tab Label 2'>Content 2</TabPane>
    </Tabs>
</template>
```

## With icons

Pass a component to `@renderIcon` on a `TabPane` to render an icon alongside
its label.

```gjs live preview
import { Tabs } from 'carbon-components-ember/components';
import { Star, UserAvatar } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <Tabs as |TabPane|>
        <TabPane @title='Tab Label 1' @isDefault={{true}} @renderIcon={{Star}}>
            Content for first tab goes here.
        </TabPane>
        <TabPane @title='Tab Label 2' @renderIcon={{UserAvatar}}>
            Content for second tab goes here.
        </TabPane>
    </Tabs>
</template>
```

## Dismissable

`@dismissable` renders a close button on every tab; `@onTabCloseRequest` is
called with the closed tab's title, and is responsible for actually removing
it (e.g. by filtering it out of the list passed to `Tabs`).

```gjs live preview
import { Tabs } from 'carbon-components-ember/components';
import { trackedObject } from '@ember/reactive/collections';
import { ThemeSupport } from 'docs-support';

const context = trackedObject({
    tabs: ['Tab Label 1', 'Tab Label 2', 'Tab Label 3'],
});
const close = (title) => {
    context.tabs = context.tabs.filter((t) => t !== title);
};
const isFirst = (index) => index === 0;

<template>
    <ThemeSupport />
    <br>
    <Tabs @dismissable={{true}} @onTabCloseRequest={{close}} as |TabPane|>
        {{#each context.tabs as |title index|}}
            <TabPane @title={{title}} @isDefault={{isFirst index}}>
                Content for {{title}}.
            </TabPane>
        {{/each}}
    </Tabs>
</template>
```

## Keyboard navigation

By default (`@activation="automatic"`), moving focus with the arrow keys also
selects the tab. `@activation="manual"` only moves focus; the tab is selected
by pressing <kbd>Enter</kbd> or <kbd>Space</kbd>.

```gjs live preview
import { Tabs } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <br>
    <Tabs @activation='manual' as |TabPane|>
        <TabPane @title='Tab Label 1' @isDefault={{true}}>Content 1</TabPane>
        <TabPane @title='Tab Label 2'>Content 2</TabPane>
        <TabPane @title='Tab Label 3'>Content 3</TabPane>
    </Tabs>
</template>
```

## TabContent

`TabContent` is a standalone panel component for cases where tab selection is
managed outside of `Tabs`, such as a custom tab list.

```gjs live preview
import { TabContent } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const eq = (a, b) => a === b;
const context = trackedObject({ selected: 'a' });

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

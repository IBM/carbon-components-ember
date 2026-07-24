<ThemeSwitcher />

# TreeView

TreeView is used to render a hierarchical list of nested items that can be
expanded or collapsed. Each node yields a bound `TreeNode` component that can
be nested arbitrarily deep to build out the tree, and select or activate a
node by clicking on it.

```gjs live preview
import { TreeView } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <TreeView @label='Tree View' as |Node|>
    <Node @id='ai' @label='Artificial intelligence' as |Child|>
      <Child @id='machine-learning' @label='Machine learning' as |GrandChild|>
        <GrandChild @id='supervised' @label='Supervised learning' />
        <GrandChild @id='unsupervised' @label='Unsupervised learning' />
      </Child>
      <Child @id='nlp' @label='Natural language processing' />
    </Node>
    <Node @id='cloud' @label='Cloud computing' @isExpanded={{true}} as |Child|>
      <Child @id='iaas' @label='IaaS' />
      <Child @id='paas' @label='PaaS' />
      <Child @id='saas' @label='SaaS' @disabled={{true}} />
    </Node>
    <Node @id='security' @label='Security' />
  </TreeView>
</template>
```

## Selection

By default only a single node can be selected at a time. Passing
`@multiselect={{true}}` allows selecting additional nodes by clicking
while holding the <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> key. The `@onSelect`
argument is called with the array of currently selected node ids and the
node that triggered the change, and `@onActivate` is called with the id of
the node that received keyboard/click focus.

```gjs live preview
import { fn } from '@ember/helper';
import { TreeView, Checkbox, RadioButtonGroup } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj) as |context|}}
    <Checkbox
      @name='multiselect'
      @label='multiselect'
      @checked={{context.multiselect}}
      @onChange={{fn (set context 'multiselect')}}
    />
    <RadioButtonGroup @onChange={{fn (set context 'size')}}>
      <:heading>size</:heading>
      <:default as |Radio|>
        <Radio @defaultChecked={{true}} @value='sm'>sm</Radio>
        <Radio @value='xs'>xs</Radio>
      </:default>
    </RadioButtonGroup>
    <br />

    <TreeView
      @label='Tree View'
      @multiselect={{context.multiselect}}
      @size={{context.size}}
      @onSelect={{fn (set context 'selected')}}
      as |Node|
    >
      <Node @id='ai' @label='Artificial intelligence' as |Child|>
        <Child @id='machine-learning' @label='Machine learning' />
        <Child @id='nlp' @label='Natural language processing' />
      </Node>
      <Node @id='cloud' @label='Cloud computing' @isExpanded={{true}} as |Child|>
        <Child @id='iaas' @label='IaaS' />
        <Child @id='paas' @label='PaaS' />
      </Node>
      <Node @id='security' @label='Security' />
    </TreeView>
    <p>Selected: {{context.selected}}</p>
  {{/let}}
</template>
```

## With icons

Passing `@icon` (any of the icon components exported from
`carbon-components-ember/icons`) renders it before the node's label.

```gjs live preview
import { TreeView } from 'carbon-components-ember/components';
import { Folder, Document } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <TreeView @label='Tree View' as |Node|>
    <Node @id='ai' @label='Artificial intelligence' @icon={{Folder}} as |Child|>
      <Child @id='machine-learning' @label='Machine learning' @icon={{Document}} />
      <Child @id='nlp' @label='Natural language processing' @icon={{Document}} />
    </Node>
    <Node @id='cloud' @label='Cloud computing' @icon={{Folder}} @isExpanded={{true}} as |Child|>
      <Child @id='iaas' @label='IaaS' @icon={{Document}} />
      <Child @id='paas' @label='PaaS' @icon={{Document}} />
    </Node>
    <Node @id='security' @label='Security' @icon={{Document}} />
  </TreeView>
</template>
```

## Controlled expansion

`@isExpanded` is uncontrolled by default (it only sets the node's initial
state). Passing `@onToggle` alongside a bound `@isExpanded` makes the node
fully controlled — its expansion always reflects `@isExpanded`, so it stays
in sync with whatever else drives that value (like the button below), not
just clicks on its own toggle caret.

```gjs live preview
import { fn } from '@ember/helper';
import { not } from 'ember-truth-helpers';
import { TreeView, Button } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  {{#let (newObj cloudExpanded=true) as |context|}}
    <Button @onClick={{fn (set context 'cloudExpanded') (not context.cloudExpanded)}}>
      Toggle "Cloud computing"
    </Button>
    <br />
    <br />

    <TreeView @label='Tree View' as |Node|>
      <Node
        @id='cloud'
        @label='Cloud computing'
        @isExpanded={{context.cloudExpanded}}
        @onToggle={{fn (set context 'cloudExpanded')}}
        as |Child|
      >
        <Child @id='iaas' @label='IaaS' />
        <Child @id='paas' @label='PaaS' />
      </Node>
      <Node @id='security' @label='Security' />
    </TreeView>
  {{/let}}
</template>
```

## Disabled state

Passing `@disabled={{true}}` on a node prevents it from being selected or
receiving keyboard focus (it's removed from the tab order), while it still
renders in place, dimmed. On a parent node, its toggle caret stays usable so
its descendants remain reachable.

```gjs live preview
import { TreeView } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <br />

  <TreeView @label='Tree View' as |Node|>
    <Node @id='ai' @label='Artificial intelligence' @disabled={{true}} as |Child|>
      <Child @id='machine-learning' @label='Machine learning' />
      <Child @id='nlp' @label='Natural language processing' />
    </Node>
    <Node @id='cloud' @label='Cloud computing' @isExpanded={{true}} as |Child|>
      <Child @id='iaas' @label='IaaS' />
      <Child @id='paas' @label='PaaS' @disabled={{true}} />
    </Node>
    <Node @id='security' @label='Security' />
  </TreeView>
</template>
```

## API Reference

<details>
<summary><h3>TreeView</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/tree-view'
    @name='default'
  />
</template>
```
</details>

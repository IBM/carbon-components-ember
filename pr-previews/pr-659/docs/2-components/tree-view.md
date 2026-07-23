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

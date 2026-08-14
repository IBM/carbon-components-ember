import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, ar as SelectComponent, j as fn, as as TagComponent, t as templateOnly, af as trackedObject, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const context = trackedObject({
  options: ['first', 'second', 'a', 'b']
});
const join = (...args) => args.join(' ');
const repl_165 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Select
    @onSelect={{fn (mut context.selected)}}
    @selected={{context.selected}}
    @options={{context.options}}
    @multiple={{false}}
    as |item|
>
    {{item}}
</Select>
<Tag @type='blue'>
    {{context.selected}}
</Tag>

<Select
    @selected={{context.selectedMultiple}}
    @options={{context.options}}
    @multiple={{true}}
    @onSelect={{fn (mut context.selectedMultiple)}}
/>
<Tag @type='blue'>
    {{join context.selectedMultiple}}
</Tag>
*/
{
  "id": "6mVDYvF5",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@onSelect\",\"@selected\",\"@options\",\"@multiple\"],[[28,[32,2],[[28,[31,0],[[32,3,[\"selected\"]]],null]],null],[32,3,[\"selected\"]],[32,3,[\"options\"]],false]],[[\"default\"],[[[[1,\"\\n    \"],[1,[30,1]],[1,\"\\n\"]],[1]]]]],[1,\"\\n\"],[8,[32,4],null,[[\"@type\"],[\"blue\"]],[[\"default\"],[[[[1,\"\\n    \"],[1,[32,3,[\"selected\"]]],[1,\"\\n\"]],[]]]]],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@selected\",\"@options\",\"@multiple\",\"@onSelect\"],[[32,3,[\"selectedMultiple\"]],[32,3,[\"options\"]],true,[28,[32,2],[[28,[31,0],[[32,3,[\"selectedMultiple\"]]],null]],null]]],null],[1,\"\\n\"],[8,[32,4],null,[[\"@type\"],[\"blue\"]],[[\"default\"],[[[[1,\"\\n    \"],[1,[28,[32,5],[[32,3,[\"selectedMultiple\"]]],null]],[1,\"\\n\"]],[]]]]]],[\"item\"],[\"mut\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, SelectComponent, fn, context, TagComponent, join],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

const repl_166 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/select' 
  @name='default' 
/>
*/
{
  "id": "HO/E0aZ3",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/select\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

const index_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="select">Select</h1>
<carbon-shadow-demo id="repl_165" class="repl-sdk__demo"><div><repl_165></repl_165></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Select, Tag } from 'carbon-components-ember/components';
import { fn } from '@ember/helper';
import { trackedObject } from '@ember/reactive/collections';
import { ThemeSupport } from 'docs-support';

const context = trackedObject({
  options: ['first', 'second', 'a', 'b']
});
const join = (...args) => args.join(' ');

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;Select
        @onSelect=\{{fn (mut context.selected)}}
        @selected=\{{context.selected}}
        @options=\{{context.options}}
        @multiple=\{{false}}
        as |item|
    >
        \{{item}}
    &#x3C;/Select>
    &#x3C;Tag @type='blue'>
        \{{context.selected}}
    &#x3C;/Tag>

    &#x3C;Select
        @selected=\{{context.selectedMultiple}}
        @options=\{{context.options}}
        @multiple=\{{true}}
        @onSelect=\{{fn (mut context.selectedMultiple)}}
    />
    &#x3C;Tag @type='blue'>
        \{{join context.selectedMultiple}}
    &#x3C;/Tag>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Select</h3></summary>
<div id="repl_166" class="repl-sdk__demo"><repl_166></repl_166></div>
</details>
*/
{
  "id": "69ug87cL",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"select\"],[12],[1,\"Select\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_165\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Select, Tag } from 'carbon-components-ember/components';\\nimport { fn } from '@ember/helper';\\nimport { trackedObject } from '@ember/reactive/collections';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst context = trackedObject({\\n  options: ['first', 'second', 'a', 'b']\\n});\\nconst join = (...args) => args.join(' ');\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <Select\\n        @onSelect=\"],[1,\"{{fn (mut context.selected)}}\\n        @selected=\"],[1,\"{{context.selected}}\\n        @options=\"],[1,\"{{context.options}}\\n        @multiple=\"],[1,\"{{false}}\\n        as |item|\\n    >\\n        \"],[1,\"{{item}}\\n    </Select>\\n    <Tag @type='blue'>\\n        \"],[1,\"{{context.selected}}\\n    </Tag>\\n\\n    <Select\\n        @selected=\"],[1,\"{{context.selectedMultiple}}\\n        @options=\"],[1,\"{{context.options}}\\n        @multiple=\"],[1,\"{{true}}\\n        @onSelect=\"],[1,\"{{fn (mut context.selectedMultiple)}}\\n    />\\n    <Tag @type='blue'>\\n        \"],[1,\"{{join context.selectedMultiple}}\\n    </Tag>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Select\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_166\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_165, repl_166],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

export { index_gjs as default };

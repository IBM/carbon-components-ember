import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, Y as UnorderedList, Z as ListItem, t as templateOnly, $ as OrderedList, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-B9pK-aqg.js';

const repl_7 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<UnorderedList>
  <ListItem>Item 1</ListItem>
  <ListItem>Item 2</ListItem>
  <ListItem>Item 3</ListItem>
</UnorderedList>
*/
{
  "id": "dzGAVBt9",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Item 1\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Item 2\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Item 3\"]],[]]]]],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, UnorderedList, ListItem],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

const repl_8 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<OrderedList>
  <ListItem>Ordered List level 1</ListItem>
  <ListItem>Ordered List level 1</ListItem>
  <ListItem>Ordered List level 1</ListItem>
</OrderedList>
*/
{
  "id": "FX1nvMkt",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 1\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 1\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 1\"]],[]]]]],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, OrderedList, ListItem],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

const repl_9 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<OrderedList>
  <ListItem>
    Ordered List level 1
    <OrderedList @nested={{true}}>
      <ListItem>Ordered List level 2</ListItem>
      <ListItem>
        Ordered List level 2
        <OrderedList @nested={{true}}>
          <ListItem>Ordered List level 3</ListItem>
          <ListItem>Ordered List level 3</ListItem>
        </OrderedList>
      </ListItem>
    </OrderedList>
  </ListItem>
  <ListItem>Ordered List level 1</ListItem>
  <ListItem>Ordered List level 1</ListItem>
</OrderedList>
*/
{
  "id": "K+eFTbrj",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"\\n    Ordered List level 1\\n    \"],[8,[32,1],null,[[\"@nested\"],[true]],[[\"default\"],[[[[1,\"\\n      \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 2\"]],[]]]]],[1,\"\\n      \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"\\n        Ordered List level 2\\n        \"],[8,[32,1],null,[[\"@nested\"],[true]],[[\"default\"],[[[[1,\"\\n          \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 3\"]],[]]]]],[1,\"\\n          \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 3\"]],[]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n      \"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 1\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 1\"]],[]]]]],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, OrderedList, ListItem],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

const repl_10 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/list-item' 
  @name='default' 
/>
*/
{
  "id": "Digp1MBW",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/list-item\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

const item_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="list-item">ListItem</h1>
<p>A <code>ListItem</code> renders a single <code>&#x3C;li></code> element with the styles needed for it to
work as a child of <a href="./ordered.md"><code>OrderedList</code></a> or
<a href="./unordered.md"><code>UnorderedList</code></a>. It has no arguments of its own</p>
<ul>
<li>any attributes passed to it (<code>id</code>, <code>class</code>, etc.) are applied to the
underlying <code>&#x3C;li></code>.</li>
</ul>
<carbon-shadow-demo id="repl_7" class="repl-sdk__demo"><div><repl_7></repl_7></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { ListItem, UnorderedList } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;UnorderedList>
    &#x3C;ListItem>Item 1&#x3C;/ListItem>
    &#x3C;ListItem>Item 2&#x3C;/ListItem>
    &#x3C;ListItem>Item 3&#x3C;/ListItem>
  &#x3C;/UnorderedList>
&#x3C;/template>
</code></pre></div>
<h2 id="within-an-ordered-list">Within an OrderedList</h2>
<carbon-shadow-demo id="repl_8" class="repl-sdk__demo"><div><repl_8></repl_8></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { ListItem, OrderedList } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;OrderedList>
    &#x3C;ListItem>Ordered List level 1&#x3C;/ListItem>
    &#x3C;ListItem>Ordered List level 1&#x3C;/ListItem>
    &#x3C;ListItem>Ordered List level 1&#x3C;/ListItem>
  &#x3C;/OrderedList>
&#x3C;/template>
</code></pre></div>
<h2 id="nested">Nested</h2>
<p><code>ListItem</code> can contain a nested <code>OrderedList</code> or <code>UnorderedList</code> to build
multi-level lists.</p>
<carbon-shadow-demo id="repl_9" class="repl-sdk__demo"><div><repl_9></repl_9></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { ListItem, OrderedList } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;OrderedList>
    &#x3C;ListItem>
      Ordered List level 1
      &#x3C;OrderedList @nested=\{{true}}>
        &#x3C;ListItem>Ordered List level 2&#x3C;/ListItem>
        &#x3C;ListItem>
          Ordered List level 2
          &#x3C;OrderedList @nested=\{{true}}>
            &#x3C;ListItem>Ordered List level 3&#x3C;/ListItem>
            &#x3C;ListItem>Ordered List level 3&#x3C;/ListItem>
          &#x3C;/OrderedList>
        &#x3C;/ListItem>
      &#x3C;/OrderedList>
    &#x3C;/ListItem>
    &#x3C;ListItem>Ordered List level 1&#x3C;/ListItem>
    &#x3C;ListItem>Ordered List level 1&#x3C;/ListItem>
  &#x3C;/OrderedList>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>ListItem</h3></summary>
<div id="repl_10" class="repl-sdk__demo"><repl_10></repl_10></div>
</details>
*/
{
  "id": "LYd5CkLX",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"list-item\"],[12],[1,\"ListItem\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"A \"],[10,\"code\"],[12],[1,\"ListItem\"],[13],[1,\" renders a single \"],[10,\"code\"],[12],[1,\"<li>\"],[13],[1,\" element with the styles needed for it to\\nwork as a child of \"],[10,3],[14,6,\"./ordered.md\"],[12],[10,\"code\"],[12],[1,\"OrderedList\"],[13],[13],[1,\" or\\n\"],[10,3],[14,6,\"./unordered.md\"],[12],[10,\"code\"],[12],[1,\"UnorderedList\"],[13],[13],[1,\". It has no arguments of its own\"],[13],[1,\"\\n\"],[10,\"ul\"],[12],[1,\"\\n\"],[10,\"li\"],[12],[1,\"any attributes passed to it (\"],[10,\"code\"],[12],[1,\"id\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"class\"],[13],[1,\", etc.) are applied to the\\nunderlying \"],[10,\"code\"],[12],[1,\"<li>\"],[13],[1,\".\"],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_7\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { ListItem, UnorderedList } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <UnorderedList>\\n    <ListItem>Item 1</ListItem>\\n    <ListItem>Item 2</ListItem>\\n    <ListItem>Item 3</ListItem>\\n  </UnorderedList>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"within-an-ordered-list\"],[12],[1,\"Within an OrderedList\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_8\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { ListItem, OrderedList } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <OrderedList>\\n    <ListItem>Ordered List level 1</ListItem>\\n    <ListItem>Ordered List level 1</ListItem>\\n    <ListItem>Ordered List level 1</ListItem>\\n  </OrderedList>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"nested\"],[12],[1,\"Nested\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"ListItem\"],[13],[1,\" can contain a nested \"],[10,\"code\"],[12],[1,\"OrderedList\"],[13],[1,\" or \"],[10,\"code\"],[12],[1,\"UnorderedList\"],[13],[1,\" to build\\nmulti-level lists.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_9\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { ListItem, OrderedList } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <OrderedList>\\n    <ListItem>\\n      Ordered List level 1\\n      <OrderedList @nested=\"],[1,\"{{true}}>\\n        <ListItem>Ordered List level 2</ListItem>\\n        <ListItem>\\n          Ordered List level 2\\n          <OrderedList @nested=\"],[1,\"{{true}}>\\n            <ListItem>Ordered List level 3</ListItem>\\n            <ListItem>Ordered List level 3</ListItem>\\n          </OrderedList>\\n        </ListItem>\\n      </OrderedList>\\n    </ListItem>\\n    <ListItem>Ordered List level 1</ListItem>\\n    <ListItem>Ordered List level 1</ListItem>\\n  </OrderedList>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"ListItem\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_10\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_7, repl_8, repl_9, repl_10],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

export { item_gjs as default };

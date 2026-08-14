import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aQ as OrderedList, ay as ListItem, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_183 = setComponentTemplate(templateFactory(
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
}), templateOnly(undefined, "ordered.gjs"));

const repl_184 = setComponentTemplate(templateFactory(
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
}), templateOnly(undefined, "ordered.gjs"));

const repl_185 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<OrderedList @native={{true}}>
  <ListItem>Ordered List level 1</ListItem>
  <ListItem>Ordered List level 1</ListItem>
  <ListItem>Ordered List level 1</ListItem>
  <ListItem>
    Ordered List level 1
    <OrderedList @nested={{true}}>
      <ListItem>Ordered List level 2</ListItem>
      <ListItem>Ordered List level 2</ListItem>
      <ListItem>Ordered List level 2</ListItem>
      <ListItem>Ordered List level 2</ListItem>
    </OrderedList>
  </ListItem>
  <ListItem>Ordered List level 1</ListItem>
  <ListItem>Ordered List level 1</ListItem>
</OrderedList>
*/
{
  "id": "8fWP39H6",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@native\"],[true]],[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 1\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 1\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 1\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"\\n    Ordered List level 1\\n    \"],[8,[32,1],null,[[\"@nested\"],[true]],[[\"default\"],[[[[1,\"\\n      \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 2\"]],[]]]]],[1,\"\\n      \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 2\"]],[]]]]],[1,\"\\n      \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 2\"]],[]]]]],[1,\"\\n      \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 2\"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 1\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Ordered List level 1\"]],[]]]]],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, OrderedList, ListItem],
  "isStrictMode": true
}), templateOnly(undefined, "ordered.gjs"));

const repl_186 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/ordered-list' 
  @name='default' 
/>
*/
{
  "id": "kTNBCORU",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/ordered-list\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "ordered.gjs"));

const ordered_gjs = setComponentTemplate(templateFactory(
/*
  <h1 id="ordered-list">OrderedList</h1>
<ThemeSwitcher />
<p>Ordered lists are groupings of related content where the order of the items within the group is meaningful.</p>
<carbon-shadow-demo id="repl_183" class="repl-sdk__demo"><div><repl_183></repl_183></div></carbon-shadow-demo>
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
<p>Ordered lists can be nested inside of each other using the <code>@nested</code> argument.</p>
<carbon-shadow-demo id="repl_184" class="repl-sdk__demo"><div><repl_184></repl_184></div></carbon-shadow-demo>
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
<h2 id="native-list-styles">Native list styles</h2>
<p>Use the <code>@native</code> argument to render the list using the browser's native ordered list numbering instead of the custom Carbon counter.</p>
<carbon-shadow-demo id="repl_185" class="repl-sdk__demo"><div><repl_185></repl_185></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { ListItem, OrderedList } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;OrderedList @native=\{{true}}>
    &#x3C;ListItem>Ordered List level 1&#x3C;/ListItem>
    &#x3C;ListItem>Ordered List level 1&#x3C;/ListItem>
    &#x3C;ListItem>Ordered List level 1&#x3C;/ListItem>
    &#x3C;ListItem>
      Ordered List level 1
      &#x3C;OrderedList @nested=\{{true}}>
        &#x3C;ListItem>Ordered List level 2&#x3C;/ListItem>
        &#x3C;ListItem>Ordered List level 2&#x3C;/ListItem>
        &#x3C;ListItem>Ordered List level 2&#x3C;/ListItem>
        &#x3C;ListItem>Ordered List level 2&#x3C;/ListItem>
      &#x3C;/OrderedList>
    &#x3C;/ListItem>
    &#x3C;ListItem>Ordered List level 1&#x3C;/ListItem>
    &#x3C;ListItem>Ordered List level 1&#x3C;/ListItem>
  &#x3C;/OrderedList>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>OrderedList</h3></summary>
<div id="repl_186" class="repl-sdk__demo"><repl_186></repl_186></div>
</details>
*/
{
  "id": "2tQSr+VK",
  "block": "[[[10,\"h1\"],[14,1,\"ordered-list\"],[12],[1,\"OrderedList\"],[13],[1,\"\\n\"],[8,[32,0],null,null,null],[1,\"\\n\"],[10,2],[12],[1,\"Ordered lists are groupings of related content where the order of the items within the group is meaningful.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_183\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { ListItem, OrderedList } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <OrderedList>\\n    <ListItem>Ordered List level 1</ListItem>\\n    <ListItem>Ordered List level 1</ListItem>\\n    <ListItem>Ordered List level 1</ListItem>\\n  </OrderedList>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"nested\"],[12],[1,\"Nested\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Ordered lists can be nested inside of each other using the \"],[10,\"code\"],[12],[1,\"@nested\"],[13],[1,\" argument.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_184\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { ListItem, OrderedList } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <OrderedList>\\n    <ListItem>\\n      Ordered List level 1\\n      <OrderedList @nested=\"],[1,\"{{true}}>\\n        <ListItem>Ordered List level 2</ListItem>\\n        <ListItem>\\n          Ordered List level 2\\n          <OrderedList @nested=\"],[1,\"{{true}}>\\n            <ListItem>Ordered List level 3</ListItem>\\n            <ListItem>Ordered List level 3</ListItem>\\n          </OrderedList>\\n        </ListItem>\\n      </OrderedList>\\n    </ListItem>\\n    <ListItem>Ordered List level 1</ListItem>\\n    <ListItem>Ordered List level 1</ListItem>\\n  </OrderedList>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"native-list-styles\"],[12],[1,\"Native list styles\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Use the \"],[10,\"code\"],[12],[1,\"@native\"],[13],[1,\" argument to render the list using the browser's native ordered list numbering instead of the custom Carbon counter.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_185\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { ListItem, OrderedList } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <OrderedList @native=\"],[1,\"{{true}}>\\n    <ListItem>Ordered List level 1</ListItem>\\n    <ListItem>Ordered List level 1</ListItem>\\n    <ListItem>Ordered List level 1</ListItem>\\n    <ListItem>\\n      Ordered List level 1\\n      <OrderedList @nested=\"],[1,\"{{true}}>\\n        <ListItem>Ordered List level 2</ListItem>\\n        <ListItem>Ordered List level 2</ListItem>\\n        <ListItem>Ordered List level 2</ListItem>\\n        <ListItem>Ordered List level 2</ListItem>\\n      </OrderedList>\\n    </ListItem>\\n    <ListItem>Ordered List level 1</ListItem>\\n    <ListItem>Ordered List level 1</ListItem>\\n  </OrderedList>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"OrderedList\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_186\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_183, repl_184, repl_185, repl_186],
  "isStrictMode": true
}), templateOnly(undefined, "ordered.gjs"));

export { ordered_gjs as default };

import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, ax as UnorderedList, ay as ListItem, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_193 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<UnorderedList>
  <ListItem>Item 1</ListItem>
  <ListItem>Item 2</ListItem>
  <ListItem>Item 3</ListItem>
</UnorderedList>

<br />
<br />

<UnorderedList @nested>
  <ListItem>Item 1</ListItem>
  <ListItem>
    Item 2
    <UnorderedList @nested>
      <ListItem>Nested item 1</ListItem>
      <ListItem>Nested item 2</ListItem>
    </UnorderedList>
  </ListItem>
  <ListItem>Item 3</ListItem>
</UnorderedList>
*/
{
  "id": "xBNveij9",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Item 1\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Item 2\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Item 3\"]],[]]]]],[1,\"\\n\"]],[]]]]],[1,\"\\n\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@nested\"],[\"\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Item 1\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"\\n    Item 2\\n    \"],[8,[32,1],null,[[\"@nested\"],[\"\"]],[[\"default\"],[[[[1,\"\\n      \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Nested item 1\"]],[]]]]],[1,\"\\n      \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Nested item 2\"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Item 3\"]],[]]]]],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, UnorderedList, ListItem],
  "isStrictMode": true
}), templateOnly(undefined, "unordered.gjs"));

const repl_194 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/unordered-list' 
  @name='default' 
/>
*/
{
  "id": "xuM/aurb",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/unordered-list\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "unordered.gjs"));

const unordered_gjs = setComponentTemplate(templateFactory(
/*
  <h1 id="unordered-list">UnorderedList</h1>
<ThemeSwitcher />
<p>Unordered lists are groupings of related content that have no priority.</p>
<carbon-shadow-demo id="repl_193" class="repl-sdk__demo"><div><repl_193></repl_193></div></carbon-shadow-demo>
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

  &#x3C;br />
  &#x3C;br />

  &#x3C;UnorderedList @nested>
    &#x3C;ListItem>Item 1&#x3C;/ListItem>
    &#x3C;ListItem>
      Item 2
      &#x3C;UnorderedList @nested>
        &#x3C;ListItem>Nested item 1&#x3C;/ListItem>
        &#x3C;ListItem>Nested item 2&#x3C;/ListItem>
      &#x3C;/UnorderedList>
    &#x3C;/ListItem>
    &#x3C;ListItem>Item 3&#x3C;/ListItem>
  &#x3C;/UnorderedList>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>UnorderedList</h3></summary>
<div id="repl_194" class="repl-sdk__demo"><repl_194></repl_194></div>
</details>
*/
{
  "id": "mP6X4O3h",
  "block": "[[[10,\"h1\"],[14,1,\"unordered-list\"],[12],[1,\"UnorderedList\"],[13],[1,\"\\n\"],[8,[32,0],null,null,null],[1,\"\\n\"],[10,2],[12],[1,\"Unordered lists are groupings of related content that have no priority.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_193\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { ListItem, UnorderedList } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <UnorderedList>\\n    <ListItem>Item 1</ListItem>\\n    <ListItem>Item 2</ListItem>\\n    <ListItem>Item 3</ListItem>\\n  </UnorderedList>\\n\\n  <br />\\n  <br />\\n\\n  <UnorderedList @nested>\\n    <ListItem>Item 1</ListItem>\\n    <ListItem>\\n      Item 2\\n      <UnorderedList @nested>\\n        <ListItem>Nested item 1</ListItem>\\n        <ListItem>Nested item 2</ListItem>\\n      </UnorderedList>\\n    </ListItem>\\n    <ListItem>Item 3</ListItem>\\n  </UnorderedList>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"UnorderedList\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_194\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_193, repl_194],
  "isStrictMode": true
}), templateOnly(undefined, "unordered.gjs"));

export { unordered_gjs as default };

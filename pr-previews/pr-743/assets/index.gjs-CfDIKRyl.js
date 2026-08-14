import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, av as ListComponent, aw as array, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_177 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<List @loading={{true}}>
    Loading
</List>

<br />
<br />

<List @items={{array 'a' 'b' 'c'}} as |list|>
    <list.SearchInput />
    <list.Header @headers={{array '#' 'item' 'name'}} />
    <list.BodyRows as |row|>
        <row.Row>
            <list.Column>
                {{row.item}}
            </list.Column>
          <list.Column>
            item
          </list.Column>
          <list.Column>
            stock
          </list.Column>
        </row.Row>
    </list.BodyRows>
    <list.Pagination />
</List>
*/
{
  "id": "L3Sq5sOs",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@loading\"],[true]],[[\"default\"],[[[[1,\"\\n    Loading\\n\"]],[]]]]],[1,\"\\n\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@items\"],[[28,[32,2],[\"a\",\"b\",\"c\"],null]]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"SearchInput\"]],null,null,null],[1,\"\\n    \"],[8,[30,1,[\"Header\"]],null,[[\"@headers\"],[[28,[32,2],[\"#\",\"item\",\"name\"],null]]],null],[1,\"\\n    \"],[8,[30,1,[\"BodyRows\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,2,[\"Row\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"Column\"]],null,null,[[\"default\"],[[[[1,\"\\n                \"],[1,[30,2,[\"item\"]]],[1,\"\\n            \"]],[]]]]],[1,\"\\n          \"],[8,[30,1,[\"Column\"]],null,null,[[\"default\"],[[[[1,\"\\n            item\\n          \"]],[]]]]],[1,\"\\n          \"],[8,[30,1,[\"Column\"]],null,null,[[\"default\"],[[[[1,\"\\n            stock\\n          \"]],[]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n    \"]],[2]]]]],[1,\"\\n    \"],[8,[30,1,[\"Pagination\"]],null,null,null],[1,\"\\n\"]],[1]]]]]],[\"list\",\"row\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, ListComponent, array],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

const repl_178 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/list' 
  @name='default' 
/>
*/
{
  "id": "Xx8y3Qsq",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/list\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

const index_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="list">List</h1>
<carbon-shadow-demo id="repl_177" class="repl-sdk__demo"><div><repl_177></repl_177></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { array } from '@ember/helper';
import { List } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;List @loading=\{{true}}>
        Loading
    &#x3C;/List>

    &#x3C;br />
    &#x3C;br />

    &#x3C;List @items=\{{array 'a' 'b' 'c'}} as |list|>
        &#x3C;list.SearchInput />
        &#x3C;list.Header @headers=\{{array '#' 'item' 'name'}} />
        &#x3C;list.BodyRows as |row|>
            &#x3C;row.Row>
                &#x3C;list.Column>
                    \{{row.item}}
                &#x3C;/list.Column>
              &#x3C;list.Column>
                item
              &#x3C;/list.Column>
              &#x3C;list.Column>
                stock
              &#x3C;/list.Column>
            &#x3C;/row.Row>
        &#x3C;/list.BodyRows>
        &#x3C;list.Pagination />
    &#x3C;/List>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>List</h3></summary>
<div id="repl_178" class="repl-sdk__demo"><repl_178></repl_178></div>
</details>
*/
{
  "id": "OlgZAxKU",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"list\"],[12],[1,\"List\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_177\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { array } from '@ember/helper';\\nimport { List } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <List @loading=\"],[1,\"{{true}}>\\n        Loading\\n    </List>\\n\\n    <br />\\n    <br />\\n\\n    <List @items=\"],[1,\"{{array 'a' 'b' 'c'}} as |list|>\\n        <list.SearchInput />\\n        <list.Header @headers=\"],[1,\"{{array '#' 'item' 'name'}} />\\n        <list.BodyRows as |row|>\\n            <row.Row>\\n                <list.Column>\\n                    \"],[1,\"{{row.item}}\\n                </list.Column>\\n              <list.Column>\\n                item\\n              </list.Column>\\n              <list.Column>\\n                stock\\n              </list.Column>\\n            </row.Row>\\n        </list.BodyRows>\\n        <list.Pagination />\\n    </List>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"List\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_178\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_177, repl_178],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

export { index_gjs as default };

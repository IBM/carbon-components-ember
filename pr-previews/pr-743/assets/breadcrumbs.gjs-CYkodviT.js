import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, a2 as CarbonBreadcrumb, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_6 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Breadcrumbs @crumbs={{Array 'a' 'b' 'c'}} @current='b' />
*/
{
  "id": "t9NDCder",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@crumbs\",\"@current\"],[[28,[32,2],[\"a\",\"b\",\"c\"],null],\"b\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonBreadcrumb, Array],
  "isStrictMode": true
}), templateOnly(undefined, "breadcrumbs.gjs"));

const repl_7 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/breadcrumbs' 
  @name='default' 
/>
*/
{
  "id": "mduATZkz",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/breadcrumbs\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "breadcrumbs.gjs"));

const breadcrumbs_gjs = setComponentTemplate(templateFactory(
/*
  <h1 id="breadcrumbs">Breadcrumbs</h1>
<ThemeSwitcher />
<p>The breadcrumb is a secondary navigation pattern that helps a user understand the hierarchy among levels and navigate back through them.</p>
<carbon-shadow-demo id="repl_6" class="repl-sdk__demo"><div><repl_6></repl_6></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Breadcrumbs } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Breadcrumbs @crumbs=\{{Array 'a' 'b' 'c'}} @current='b' />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Breadcrumbs</h3></summary>
<div id="repl_7" class="repl-sdk__demo"><repl_7></repl_7></div>
</details>
*/
{
  "id": "KVrtUUZ5",
  "block": "[[[10,\"h1\"],[14,1,\"breadcrumbs\"],[12],[1,\"Breadcrumbs\"],[13],[1,\"\\n\"],[8,[32,0],null,null,null],[1,\"\\n\"],[10,2],[12],[1,\"The breadcrumb is a secondary navigation pattern that helps a user understand the hierarchy among levels and navigate back through them.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_6\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Breadcrumbs } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Breadcrumbs @crumbs=\"],[1,\"{{Array 'a' 'b' 'c'}} @current='b' />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Breadcrumbs\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_7\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_6, repl_7],
  "isStrictMode": true
}), templateOnly(undefined, "breadcrumbs.gjs"));

export { breadcrumbs_gjs as default };

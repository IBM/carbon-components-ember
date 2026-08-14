import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, ai as SearchComponent, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_82 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Search @labelText="Search" /><br>
<Search @labelText="Search" @placeholder="search something" /><br>
<Search @labelText="Search" @value="my search" /><br>
<Search @labelText="Small search" @size="sm" /><br>
<Search @labelText="Disabled search" @disabled={{true}} /><br>
*/
{
  "id": "mChlK3Bs",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\"],[\"Search\"]],null],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@placeholder\"],[\"Search\",\"search something\"]],null],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@value\"],[\"Search\",\"my search\"]],null],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@size\"],[\"Small search\",\"sm\"]],null],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@disabled\"],[\"Disabled search\",true]],null],[10,\"br\"],[12],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, SearchComponent],
  "isStrictMode": true
}), templateOnly(undefined, "search.gjs"));

const repl_83 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/search' 
  @name='default' 
/>
*/
{
  "id": "DlBGYxRd",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/search\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "search.gjs"));

const search_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="search">Search</h1>
<p>Search allows users to enter a term to be used to find specific content, filtering out results that don't match.</p>
<carbon-shadow-demo id="repl_82" class="repl-sdk__demo"><div><repl_82></repl_82></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Search } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;Search @labelText="Search" />&#x3C;br>
    &#x3C;Search @labelText="Search" @placeholder="search something" />&#x3C;br>
    &#x3C;Search @labelText="Search" @value="my search" />&#x3C;br>
    &#x3C;Search @labelText="Small search" @size="sm" />&#x3C;br>
    &#x3C;Search @labelText="Disabled search" @disabled=\{{true}} />&#x3C;br>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Search</h3></summary>
<div id="repl_83" class="repl-sdk__demo"><repl_83></repl_83></div>
</details>
*/
{
  "id": "f3rBn1Ng",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"search\"],[12],[1,\"Search\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Search allows users to enter a term to be used to find specific content, filtering out results that don't match.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_82\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Search } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <Search @labelText=\\\"Search\\\" /><br>\\n    <Search @labelText=\\\"Search\\\" @placeholder=\\\"search something\\\" /><br>\\n    <Search @labelText=\\\"Search\\\" @value=\\\"my search\\\" /><br>\\n    <Search @labelText=\\\"Small search\\\" @size=\\\"sm\\\" /><br>\\n    <Search @labelText=\\\"Disabled search\\\" @disabled=\"],[1,\"{{true}} /><br>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Search\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_83\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_82, repl_83],
  "isStrictMode": true
}), templateOnly(undefined, "search.gjs"));

export { search_gjs as default };

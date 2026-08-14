import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aq as SkeletonText, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_167 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<SkeletonText />
<SkeletonText @heading={{true}} />
<SkeletonText @paragraph={{true}} @lineCount={{3}} />
*/
{
  "id": "XY0cNvZ7",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@heading\"],[true]],null],[1,\"\\n\"],[8,[32,1],null,[[\"@paragraph\",\"@lineCount\"],[true,3]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, SkeletonText],
  "isStrictMode": true
}), templateOnly(undefined, "text.gjs"));

const repl_168 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/skeleton-text' 
  @name='default' 
/>
*/
{
  "id": "DPCpV+n8",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/skeleton-text\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "text.gjs"));

const text_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="skeleton-text">SkeletonText</h1>
<carbon-shadow-demo id="repl_167" class="repl-sdk__demo"><div><repl_167></repl_167></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { SkeletonText } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;SkeletonText />
    &#x3C;SkeletonText @heading=\{{true}} />
    &#x3C;SkeletonText @paragraph=\{{true}} @lineCount=\{{3}} />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>SkeletonText</h3></summary>
<div id="repl_168" class="repl-sdk__demo"><repl_168></repl_168></div>
</details>
*/
{
  "id": "3SlmbmNp",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"skeleton-text\"],[12],[1,\"SkeletonText\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_167\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { SkeletonText } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <SkeletonText />\\n    <SkeletonText @heading=\"],[1,\"{{true}} />\\n    <SkeletonText @paragraph=\"],[1,\"{{true}} @lineCount=\"],[1,\"{{3}} />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"SkeletonText\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_168\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_167, repl_168],
  "isStrictMode": true
}), templateOnly(undefined, "text.gjs"));

export { text_gjs as default };

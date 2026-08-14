import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, ao as SkeletonIcon, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_161 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<SkeletonIcon style='margin: 50px' />
<SkeletonIcon style='margin: 50px; width: 24px; height: 24px;' />
*/
{
  "id": "RZRtuoIm",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],[[24,5,\"margin: 50px\"]],null,null],[1,\"\\n\"],[8,[32,1],[[24,5,\"margin: 50px; width: 24px; height: 24px;\"]],null,null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, SkeletonIcon],
  "isStrictMode": true
}), templateOnly(undefined, "icon.gjs"));

const repl_162 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/skeleton-icon' 
  @name='default' 
/>
*/
{
  "id": "t5gtGdNZ",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/skeleton-icon\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "icon.gjs"));

const icon_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="skeleton-icon">SkeletonIcon</h1>
<carbon-shadow-demo id="repl_161" class="repl-sdk__demo"><div><repl_161></repl_161></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { SkeletonIcon } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;SkeletonIcon style='margin: 50px' />
    &#x3C;SkeletonIcon style='margin: 50px; width: 24px; height: 24px;' />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>SkeletonIcon</h3></summary>
<div id="repl_162" class="repl-sdk__demo"><repl_162></repl_162></div>
</details>
*/
{
  "id": "oNDtHXop",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"skeleton-icon\"],[12],[1,\"SkeletonIcon\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_161\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { SkeletonIcon } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <SkeletonIcon style='margin: 50px' />\\n    <SkeletonIcon style='margin: 50px; width: 24px; height: 24px;' />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"SkeletonIcon\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_162\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_161, repl_162],
  "isStrictMode": true
}), templateOnly(undefined, "icon.gjs"));

export { icon_gjs as default };

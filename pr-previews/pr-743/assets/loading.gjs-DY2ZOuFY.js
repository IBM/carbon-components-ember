import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, ad as LoadingComponent, a4 as CarbonButton, t as templateOnly, a6 as cell, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const showOver = cell();
function showWithOverlay() {
  showOver.current = true;
  setTimeout(() => {
    showOver.current = false;
  }, 3000);
}
const repl_50 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<p>loading</p>
<Loading @title='loading'/>
<br>
<Loading @inline={{true}} @title='inline loading' />
<br>
<p>loading active=false</p>
<Loading @active={{false}} />
<br>
<p>loading small=false</p>
<Loading @small={{true}} />
<br>
{{#if showOver.current}}
    <Loading @overlay={{true}} />
{{/if}}
<br>
<Button
    @type='primary'
    @onClick={{showWithOverlay}}
>
    show with overlay
</Button>
*/
{
  "id": "iGpy7q8+",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,2],[12],[1,\"loading\"],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@title\"],[\"loading\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@inline\",\"@title\"],[true,\"inline loading\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,2],[12],[1,\"loading active=false\"],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@active\"],[false]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,2],[12],[1,\"loading small=false\"],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@small\"],[true]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[41,[32,2,[\"current\"]],[[[1,\"    \"],[8,[32,1],null,[[\"@overlay\"],[true]],null],[1,\"\\n\"]],[]],null],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,3],null,[[\"@type\",\"@onClick\"],[\"primary\",[32,4]]],[[\"default\"],[[[[1,\"\\n    show with overlay\\n\"]],[]]]]]],[],[\"if\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, LoadingComponent, showOver, CarbonButton, showWithOverlay],
  "isStrictMode": true
}), templateOnly(undefined, "loading.gjs"));

const repl_51 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/loading' 
  @name='default' 
/>
*/
{
  "id": "vLX7Y81O",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/loading\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "loading.gjs"));

const loading_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="loading">Loading</h1>
<carbon-shadow-demo id="repl_50" class="repl-sdk__demo"><div><repl_50></repl_50></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { fn } from '@ember/helper';
import { cell } from 'ember-resources';
import { Loading, Button } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const showOver = cell();
const not = (x) => !x;

function showWithOverlay() {
  showOver.current = true;
  setTimeout(() => {
    showOver.current = false;
  }, 3000);
}

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;p>loading&#x3C;/p>
    &#x3C;Loading @title='loading'/>
    &#x3C;br>
    &#x3C;Loading @inline=\{{true}} @title='inline loading' />
    &#x3C;br>
    &#x3C;p>loading active=false&#x3C;/p>
    &#x3C;Loading @active=\{{false}} />
    &#x3C;br>
    &#x3C;p>loading small=false&#x3C;/p>
    &#x3C;Loading @small=\{{true}} />
    &#x3C;br>
    \{{#if showOver.current}}
        &#x3C;Loading @overlay=\{{true}} />
    \{{/if}}
    &#x3C;br>
    &#x3C;Button
        @type='primary'
        @onClick=\{{showWithOverlay}}
    >
        show with overlay
    &#x3C;/Button>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Loading</h3></summary>
<div id="repl_51" class="repl-sdk__demo"><repl_51></repl_51></div>
</details>
*/
{
  "id": "ztKkZi/B",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"loading\"],[12],[1,\"Loading\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_50\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { fn } from '@ember/helper';\\nimport { cell } from 'ember-resources';\\nimport { Loading, Button } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst showOver = cell();\\nconst not = (x) => !x;\\n\\nfunction showWithOverlay() {\\n  showOver.current = true;\\n  setTimeout(() => {\\n    showOver.current = false;\\n  }, 3000);\\n}\\n\\n<template>\\n    <ThemeSupport />\\n    <p>loading</p>\\n    <Loading @title='loading'/>\\n    <br>\\n    <Loading @inline=\"],[1,\"{{true}} @title='inline loading' />\\n    <br>\\n    <p>loading active=false</p>\\n    <Loading @active=\"],[1,\"{{false}} />\\n    <br>\\n    <p>loading small=false</p>\\n    <Loading @small=\"],[1,\"{{true}} />\\n    <br>\\n    \"],[1,\"{{#if showOver.current}}\\n        <Loading @overlay=\"],[1,\"{{true}} />\\n    \"],[1,\"{{/if}}\\n    <br>\\n    <Button\\n        @type='primary'\\n        @onClick=\"],[1,\"{{showWithOverlay}}\\n    >\\n        show with overlay\\n    </Button>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Loading\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_51\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_50, repl_51],
  "isStrictMode": true
}), templateOnly(undefined, "loading.gjs"));

export { loading_gjs as default };

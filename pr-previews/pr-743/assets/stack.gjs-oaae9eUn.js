import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aj as Stack, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

const repl_91 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Stack @gap={{6}} @orientation='horizontal'>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

<br />
<br />

<Stack @gap={{6}}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>
*/
{
  "id": "YmfQ0aPW",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@gap\",\"@orientation\"],[6,\"horizontal\"]],[[\"default\"],[[[[1,\"\\n  \"],[10,0],[12],[1,\"Item 1\"],[13],[1,\"\\n  \"],[10,0],[12],[1,\"Item 2\"],[13],[1,\"\\n  \"],[10,0],[12],[1,\"Item 3\"],[13],[1,\"\\n\"]],[]]]]],[1,\"\\n\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@gap\"],[6]],[[\"default\"],[[[[1,\"\\n  \"],[10,0],[12],[1,\"Item 1\"],[13],[1,\"\\n  \"],[10,0],[12],[1,\"Item 2\"],[13],[1,\"\\n  \"],[10,0],[12],[1,\"Item 3\"],[13],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Stack],
  "isStrictMode": true
}), templateOnly(undefined, "stack.gjs"));

const repl_92 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/stack'
  @name='default'
/>
*/
{
  "id": "Se9YUdFO",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/stack\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "stack.gjs"));

const stack_gjs = setComponentTemplate(templateFactory(
/*
  <h1 id="stack">Stack</h1>
<ThemeSwitcher />
<p>The Stack component is a useful layout utility in a component-based model.
This allows components to not use margin and instead delegate the
responsibility of positioning and layout to parent components.</p>
<p>Stack uses the spacing scale from the Design Language in order to determine
how much space there should be between items rendered by the Stack
component. It also supports a custom <code>gap</code> argument which will allow a
user to provide a custom value for the gap of the layout. This component
supports both horizontal and vertical orientations.</p>
<carbon-shadow-demo id="repl_91" class="repl-sdk__demo"><div><repl_91></repl_91></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Stack } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Stack @gap=\{{6}} @orientation='horizontal'>
    &#x3C;div>Item 1&#x3C;/div>
    &#x3C;div>Item 2&#x3C;/div>
    &#x3C;div>Item 3&#x3C;/div>
  &#x3C;/Stack>

  &#x3C;br />
  &#x3C;br />

  &#x3C;Stack @gap=\{{6}}>
    &#x3C;div>Item 1&#x3C;/div>
    &#x3C;div>Item 2&#x3C;/div>
    &#x3C;div>Item 3&#x3C;/div>
  &#x3C;/Stack>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Stack</h3></summary>
<div id="repl_92" class="repl-sdk__demo"><repl_92></repl_92></div>
</details>
*/
{
  "id": "y7CMtAGI",
  "block": "[[[10,\"h1\"],[14,1,\"stack\"],[12],[1,\"Stack\"],[13],[1,\"\\n\"],[8,[32,0],null,null,null],[1,\"\\n\"],[10,2],[12],[1,\"The Stack component is a useful layout utility in a component-based model.\\nThis allows components to not use margin and instead delegate the\\nresponsibility of positioning and layout to parent components.\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Stack uses the spacing scale from the Design Language in order to determine\\nhow much space there should be between items rendered by the Stack\\ncomponent. It also supports a custom \"],[10,\"code\"],[12],[1,\"gap\"],[13],[1,\" argument which will allow a\\nuser to provide a custom value for the gap of the layout. This component\\nsupports both horizontal and vertical orientations.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_91\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Stack } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Stack @gap=\"],[1,\"{{6}} @orientation='horizontal'>\\n    <div>Item 1</div>\\n    <div>Item 2</div>\\n    <div>Item 3</div>\\n  </Stack>\\n\\n  <br />\\n  <br />\\n\\n  <Stack @gap=\"],[1,\"{{6}}>\\n    <div>Item 1</div>\\n    <div>Item 2</div>\\n    <div>Item 3</div>\\n  </Stack>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Stack\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_92\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_91, repl_92],
  "isStrictMode": true
}), templateOnly(undefined, "stack.gjs"));

export { stack_gjs as default };

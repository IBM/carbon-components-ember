import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, d as helper, ag as DidInsertModifier, f as helper$1, ah as Portal, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_77 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
{{#let (newObj container=null) as |context|}}
  <p>Portal target:</p>
  <div
    style='border: 1px dashed; padding: 1rem;'
    {{didInsert (set context 'container')}}
  ></div>

  <div>
    This content renders in place.
    {{#if context.container}}
      <Portal @container={{context.container}}>
        <div>This content is rendered into the target above via a Portal.</div>
      </Portal>
    {{/if}}
  </div>
{{/let}}
*/
{
  "id": "vELzPqkr",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[44,[[28,[32,1],null,[[\"container\"],[null]]]],[[[1,\"  \"],[10,2],[12],[1,\"Portal target:\"],[13],[1,\"\\n  \"],[11,0],[24,5,\"border: 1px dashed; padding: 1rem;\"],[4,[32,2],[[28,[32,3],[[30,1],\"container\"],null]],null],[12],[13],[1,\"\\n\\n  \"],[10,0],[12],[1,\"\\n    This content renders in place.\\n\"],[41,[30,1,[\"container\"]],[[[1,\"      \"],[8,[32,4],null,[[\"@container\"],[[30,1,[\"container\"]]]],[[\"default\"],[[[[1,\"\\n        \"],[10,0],[12],[1,\"This content is rendered into the target above via a Portal.\"],[13],[1,\"\\n      \"]],[]]]]],[1,\"\\n\"]],[]],null],[1,\"  \"],[13],[1,\"\\n\"]],[1]]]],[\"context\"],[\"let\",\"if\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, DidInsertModifier, helper$1, Portal],
  "isStrictMode": true
}), templateOnly(undefined, "portal.gjs"));

const repl_78 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/portal' 
  @name='default' 
/>
*/
{
  "id": "UV7T1agS",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/portal\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "portal.gjs"));

const portal_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="portal">Portal</h1>
<p>Helper component for rendering content within a portal. By default, the
portal renders into <code>document.body</code>. You can customize this behavior with
the <code>@container</code> argument. Any content yielded to this component will be
rendered inside of the container.</p>
<p>Since this live preview renders in an isolated shadow DOM, the example below
passes a local element as <code>@container</code> so the portaled content stays visible
inside the preview instead of escaping into the real page's <code>document.body</code>.</p>
<carbon-shadow-demo id="repl_77" class="repl-sdk__demo"><div><repl_77></repl_77></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Portal } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport, didInsert } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    \{{#let (newObj container=null) as |context|}}
      &#x3C;p>Portal target:&#x3C;/p>
      &#x3C;div
        style='border: 1px dashed; padding: 1rem;'
        \{{didInsert (set context 'container')}}
      >&#x3C;/div>

      &#x3C;div>
        This content renders in place.
        \{{#if context.container}}
          &#x3C;Portal @container=\{{context.container}}>
            &#x3C;div>This content is rendered into the target above via a Portal.&#x3C;/div>
          &#x3C;/Portal>
        \{{/if}}
      &#x3C;/div>
    \{{/let}}
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Portal</h3></summary>
<div id="repl_78" class="repl-sdk__demo"><repl_78></repl_78></div>
</details>
*/
{
  "id": "bCbxF+l8",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"portal\"],[12],[1,\"Portal\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Helper component for rendering content within a portal. By default, the\\nportal renders into \"],[10,\"code\"],[12],[1,\"document.body\"],[13],[1,\". You can customize this behavior with\\nthe \"],[10,\"code\"],[12],[1,\"@container\"],[13],[1,\" argument. Any content yielded to this component will be\\nrendered inside of the container.\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Since this live preview renders in an isolated shadow DOM, the example below\\npasses a local element as \"],[10,\"code\"],[12],[1,\"@container\"],[13],[1,\" so the portaled content stays visible\\ninside the preview instead of escaping into the real page's \"],[10,\"code\"],[12],[1,\"document.body\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_77\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Portal } from 'carbon-components-ember/components';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { ThemeSupport, didInsert } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    \"],[1,\"{{#let (newObj container=null) as |context|}}\\n      <p>Portal target:</p>\\n      <div\\n        style='border: 1px dashed; padding: 1rem;'\\n        \"],[1,\"{{didInsert (set context 'container')}}\\n      ></div>\\n\\n      <div>\\n        This content renders in place.\\n        \"],[1,\"{{#if context.container}}\\n          <Portal @container=\"],[1,\"{{context.container}}>\\n            <div>This content is rendered into the target above via a Portal.</div>\\n          </Portal>\\n        \"],[1,\"{{/if}}\\n      </div>\\n    \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Portal\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_78\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_77, repl_78],
  "isStrictMode": true
}), templateOnly(undefined, "portal.gjs"));

export { portal_gjs as default };

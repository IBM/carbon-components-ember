import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, ak as ToggleComponent, j as fn, al as not, t as templateOnly, af as trackedObject, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

const context = trackedObject({});
const repl_127 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Toggle @name='toggle is off' @value={{false}} /><br>
<Toggle @name='toggle is on' @value={{true}} /><br>
<Toggle @name='toggle is disabled' @disabled={{true}} /><br>
<Toggle @name='toggle is readonly' @readonly={{true}} /><br>
<Toggle
  @name='toggle with click'
  @value={{context.checked}}
  @onChange={{fn (mut context.checked) (not context.checked)}}
/>
*/
{
  "id": "SXRvEYqe",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@name\",\"@value\"],[\"toggle is off\",false]],null],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@name\",\"@value\"],[\"toggle is on\",true]],null],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@name\",\"@disabled\"],[\"toggle is disabled\",true]],null],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@name\",\"@readonly\"],[\"toggle is readonly\",true]],null],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@name\",\"@value\",\"@onChange\"],[\"toggle with click\",[32,2,[\"checked\"]],[28,[32,3],[[28,[31,0],[[32,2,[\"checked\"]]],null],[28,[32,4],[[32,2,[\"checked\"]]],null]],null]]],null]],[],[\"mut\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, ToggleComponent, context, fn, not],
  "isStrictMode": true
}), templateOnly(undefined, "toggle.gjs"));

const repl_128 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/toggle' 
  @name='default' 
/>
*/
{
  "id": "pN0W85Bx",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/toggle\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "toggle.gjs"));

const toggle_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="toggle">Toggle</h1>
<carbon-shadow-demo id="repl_127" class="repl-sdk__demo"><div><repl_127></repl_127></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Toggle } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';
import { fn } from '@ember/helper';
import { not } from 'ember-truth-helpers';
const context = trackedObject({});

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;Toggle @name='toggle is off' @value=\{{false}} />&#x3C;br>
    &#x3C;Toggle @name='toggle is on' @value=\{{true}} />&#x3C;br>
    &#x3C;Toggle @name='toggle is disabled' @disabled=\{{true}} />&#x3C;br>
    &#x3C;Toggle @name='toggle is readonly' @readonly=\{{true}} />&#x3C;br>
    &#x3C;Toggle
      @name='toggle with click'
      @value=\{{context.checked}}
      @onChange=\{{fn (mut context.checked) (not context.checked)}}
    />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Toggle</h3></summary>
<div id="repl_128" class="repl-sdk__demo"><repl_128></repl_128></div>
</details>
*/
{
  "id": "rILpoU/7",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"toggle\"],[12],[1,\"Toggle\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_127\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Toggle } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { trackedObject } from '@ember/reactive/collections';\\nimport { fn } from '@ember/helper';\\nimport { not } from 'ember-truth-helpers';\\nconst context = trackedObject({});\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <Toggle @name='toggle is off' @value=\"],[1,\"{{false}} /><br>\\n    <Toggle @name='toggle is on' @value=\"],[1,\"{{true}} /><br>\\n    <Toggle @name='toggle is disabled' @disabled=\"],[1,\"{{true}} /><br>\\n    <Toggle @name='toggle is readonly' @readonly=\"],[1,\"{{true}} /><br>\\n    <Toggle\\n      @name='toggle with click'\\n      @value=\"],[1,\"{{context.checked}}\\n      @onChange=\"],[1,\"{{fn (mut context.checked) (not context.checked)}}\\n    />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Toggle\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_128\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_127, repl_128],
  "isStrictMode": true
}), templateOnly(undefined, "toggle.gjs"));

export { toggle_gjs as default };

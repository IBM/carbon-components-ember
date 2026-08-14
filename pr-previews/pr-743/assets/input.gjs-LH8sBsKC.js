import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, az as FormInput, t as templateOnly, af as trackedObject, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

trackedObject({});
const repl_223 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<FormInput @label="some label" />
<br>
<FormInput @help="some help" />
<br>
<FormInput @errors="some error" @help="some help" />
*/
{
  "id": "JDWWpxBp",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@label\"],[\"some label\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@help\"],[\"some help\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@errors\",\"@help\"],[\"some error\",\"some help\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, FormInput],
  "isStrictMode": true
}), templateOnly(undefined, "input.gjs"));

const repl_224 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/form-input' 
  @name='default' 
/>
*/
{
  "id": "0XA2uKuO",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/form-input\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "input.gjs"));

const input_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="form-input">Form Input</h1>
<carbon-shadow-demo id="repl_223" class="repl-sdk__demo"><div><repl_223></repl_223></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { FormInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';
import { fn } from '@ember/helper';
import { not } from 'ember-truth-helpers';
const context = trackedObject({});

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;FormInput @label="some label" />
    &#x3C;br>
    &#x3C;FormInput @help="some help" />
    &#x3C;br>
    &#x3C;FormInput @errors="some error" @help="some help" />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Form Input</h3></summary>
<div id="repl_224" class="repl-sdk__demo"><repl_224></repl_224></div>
</details>
*/
{
  "id": "+9A9WbDv",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"form-input\"],[12],[1,\"Form Input\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_223\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { FormInput } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { trackedObject } from '@ember/reactive/collections';\\nimport { fn } from '@ember/helper';\\nimport { not } from 'ember-truth-helpers';\\nconst context = trackedObject({});\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <FormInput @label=\\\"some label\\\" />\\n    <br>\\n    <FormInput @help=\\\"some help\\\" />\\n    <br>\\n    <FormInput @errors=\\\"some error\\\" @help=\\\"some help\\\" />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Form Input\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_224\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_223, repl_224],
  "isStrictMode": true
}), templateOnly(undefined, "input.gjs"));

export { input_gjs as default };

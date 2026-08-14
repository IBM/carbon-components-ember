import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aJ as FormItem, aK as FormLabel, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_216 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<FormItem>
  <FormLabel @id="name-input">Name</FormLabel>
  <input id="name-input" class="cds--text-input" type="text" />
</FormItem>
*/
{
  "id": "NuPnlQgy",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@id\"],[\"name-input\"]],[[\"default\"],[[[[1,\"Name\"]],[]]]]],[1,\"\\n  \"],[10,\"input\"],[14,1,\"name-input\"],[14,0,\"cds--text-input\"],[14,4,\"text\"],[12],[13],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, FormItem, FormLabel],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

const repl_217 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<FormItem class="custom-form-item">
  <FormLabel @id="email-input">Email</FormLabel>
  <input id="email-input" class="cds--text-input" type="email" />
</FormItem>
*/
{
  "id": "Yj4vVrWh",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],[[24,0,\"custom-form-item\"]],null,[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@id\"],[\"email-input\"]],[[\"default\"],[[[[1,\"Email\"]],[]]]]],[1,\"\\n  \"],[10,\"input\"],[14,1,\"email-input\"],[14,0,\"cds--text-input\"],[14,4,\"email\"],[12],[13],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, FormItem, FormLabel],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

const repl_218 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/form-item'
  @name='default'
/>
*/
{
  "id": "aZleUI2P",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/form-item\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

const item_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="form-item">FormItem</h1>
<p><code>FormItem</code> is a simple layout wrapper that provides consistent spacing
between a form control and its label/helper text. It renders a <code>&#x3C;div></code> with
the <code>cds--form-item</code> class around its contents and passes through any HTML
attributes.</p>
<carbon-shadow-demo id="repl_216" class="repl-sdk__demo"><div><repl_216></repl_216></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { FormItem, FormLabel } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;FormItem>
      &#x3C;FormLabel @id="name-input">Name&#x3C;/FormLabel>
      &#x3C;input id="name-input" class="cds--text-input" type="text" />
    &#x3C;/FormItem>
&#x3C;/template>
</code></pre></div>
<h2 id="custom-attributes">Custom attributes</h2>
<p>Any HTML attributes, including <code>class</code>, passed to <code>FormItem</code> are applied to
the rendered <code>&#x3C;div></code>.</p>
<carbon-shadow-demo id="repl_217" class="repl-sdk__demo"><div><repl_217></repl_217></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { FormItem, FormLabel } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;FormItem class="custom-form-item">
      &#x3C;FormLabel @id="email-input">Email&#x3C;/FormLabel>
      &#x3C;input id="email-input" class="cds--text-input" type="email" />
    &#x3C;/FormItem>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>FormItem</h3></summary>
<div id="repl_218" class="repl-sdk__demo"><repl_218></repl_218></div>
</details>
*/
{
  "id": "eaQ5to1R",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"form-item\"],[12],[1,\"FormItem\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"FormItem\"],[13],[1,\" is a simple layout wrapper that provides consistent spacing\\nbetween a form control and its label/helper text. It renders a \"],[10,\"code\"],[12],[1,\"<div>\"],[13],[1,\" with\\nthe \"],[10,\"code\"],[12],[1,\"cds--form-item\"],[13],[1,\" class around its contents and passes through any HTML\\nattributes.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_216\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { FormItem, FormLabel } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <FormItem>\\n      <FormLabel @id=\\\"name-input\\\">Name</FormLabel>\\n      <input id=\\\"name-input\\\" class=\\\"cds--text-input\\\" type=\\\"text\\\" />\\n    </FormItem>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"custom-attributes\"],[12],[1,\"Custom attributes\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Any HTML attributes, including \"],[10,\"code\"],[12],[1,\"class\"],[13],[1,\", passed to \"],[10,\"code\"],[12],[1,\"FormItem\"],[13],[1,\" are applied to\\nthe rendered \"],[10,\"code\"],[12],[1,\"<div>\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_217\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { FormItem, FormLabel } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <FormItem class=\\\"custom-form-item\\\">\\n      <FormLabel @id=\\\"email-input\\\">Email</FormLabel>\\n      <input id=\\\"email-input\\\" class=\\\"cds--text-input\\\" type=\\\"email\\\" />\\n    </FormItem>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"FormItem\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_218\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_216, repl_217, repl_218],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

export { item_gjs as default };

import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, at as SelectItemGroup, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_169 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<select class="cds--select-input">
  <SelectItemGroup @label="Group 1">
    <option value="option-1">Option 1</option>
    <option value="option-2">Option 2</option>
  </SelectItemGroup>
  <SelectItemGroup @label="Group 2" @disabled={{true}}>
    <option value="option-3">Option 3</option>
    <option value="option-4">Option 4</option>
  </SelectItemGroup>
</select>
*/
{
  "id": "yIMsES13",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"select\"],[14,0,\"cds--select-input\"],[12],[1,\"\\n  \"],[8,[32,1],null,[[\"@label\"],[\"Group 1\"]],[[\"default\"],[[[[1,\"\\n    \"],[10,\"option\"],[14,2,\"option-1\"],[12],[1,\"Option 1\"],[13],[1,\"\\n    \"],[10,\"option\"],[14,2,\"option-2\"],[12],[1,\"Option 2\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[32,1],null,[[\"@label\",\"@disabled\"],[\"Group 2\",true]],[[\"default\"],[[[[1,\"\\n    \"],[10,\"option\"],[14,2,\"option-3\"],[12],[1,\"Option 3\"],[13],[1,\"\\n    \"],[10,\"option\"],[14,2,\"option-4\"],[12],[1,\"Option 4\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, SelectItemGroup],
  "isStrictMode": true
}), templateOnly(undefined, "item-group.gjs"));

const repl_170 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/select-item-group'
  @name='default'
/>
*/
{
  "id": "AZtgeeHA",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/select-item-group\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "item-group.gjs"));

const itemGroup_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="select-item-group">SelectItemGroup</h1>
<p><code>SelectItemGroup</code> renders a native <code>&#x3C;optgroup></code> element, used to group
related <code>&#x3C;option></code> elements together inside a native <code>&#x3C;select></code>.</p>
<carbon-shadow-demo id="repl_169" class="repl-sdk__demo"><div><repl_169></repl_169></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { SelectItemGroup } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;select class="cds--select-input">
    &#x3C;SelectItemGroup @label="Group 1">
      &#x3C;option value="option-1">Option 1&#x3C;/option>
      &#x3C;option value="option-2">Option 2&#x3C;/option>
    &#x3C;/SelectItemGroup>
    &#x3C;SelectItemGroup @label="Group 2" @disabled=\{{true}}>
      &#x3C;option value="option-3">Option 3&#x3C;/option>
      &#x3C;option value="option-4">Option 4&#x3C;/option>
    &#x3C;/SelectItemGroup>
  &#x3C;/select>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>SelectItemGroup</h3></summary>
<div id="repl_170" class="repl-sdk__demo"><repl_170></repl_170></div>
</details>
*/
{
  "id": "5yhoriH3",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"select-item-group\"],[12],[1,\"SelectItemGroup\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"SelectItemGroup\"],[13],[1,\" renders a native \"],[10,\"code\"],[12],[1,\"<optgroup>\"],[13],[1,\" element, used to group\\nrelated \"],[10,\"code\"],[12],[1,\"<option>\"],[13],[1,\" elements together inside a native \"],[10,\"code\"],[12],[1,\"<select>\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_169\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { SelectItemGroup } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <select class=\\\"cds--select-input\\\">\\n    <SelectItemGroup @label=\\\"Group 1\\\">\\n      <option value=\\\"option-1\\\">Option 1</option>\\n      <option value=\\\"option-2\\\">Option 2</option>\\n    </SelectItemGroup>\\n    <SelectItemGroup @label=\\\"Group 2\\\" @disabled=\"],[1,\"{{true}}>\\n      <option value=\\\"option-3\\\">Option 3</option>\\n      <option value=\\\"option-4\\\">Option 4</option>\\n    </SelectItemGroup>\\n  </select>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"SelectItemGroup\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_170\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_169, repl_170],
  "isStrictMode": true
}), templateOnly(undefined, "item-group.gjs"));

export { itemGroup_gjs as default };

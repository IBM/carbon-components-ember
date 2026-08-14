import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aP as SelectItem, t as templateOnly, at as SelectItemGroup, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_171 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<select class="cds--select-input">
  <SelectItem @value="option-1" @text="Option 1" />
  <SelectItem @value="option-2" @text="Option 2" />
  <SelectItem @value="option-3" @text="Option 3" />
</select>
*/
{
  "id": "S4/Dvjjo",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"select\"],[14,0,\"cds--select-input\"],[12],[1,\"\\n  \"],[8,[32,1],null,[[\"@value\",\"@text\"],[\"option-1\",\"Option 1\"]],null],[1,\"\\n  \"],[8,[32,1],null,[[\"@value\",\"@text\"],[\"option-2\",\"Option 2\"]],null],[1,\"\\n  \"],[8,[32,1],null,[[\"@value\",\"@text\"],[\"option-3\",\"Option 3\"]],null],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, SelectItem],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

const repl_172 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<select class="cds--select-input">
  <SelectItem @value="option-1" @text="Option 1" />
  <SelectItem @value="option-2" @text="Option 2" @disabled={{true}} />
</select>
*/
{
  "id": "DLf8oKHS",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"select\"],[14,0,\"cds--select-input\"],[12],[1,\"\\n  \"],[8,[32,1],null,[[\"@value\",\"@text\"],[\"option-1\",\"Option 1\"]],null],[1,\"\\n  \"],[8,[32,1],null,[[\"@value\",\"@text\",\"@disabled\"],[\"option-2\",\"Option 2\",true]],null],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, SelectItem],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

const repl_173 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<select class="cds--select-input">
  <SelectItemGroup @label="Group 1">
    <SelectItem @value="option-1" @text="Option 1" />
    <SelectItem @value="option-2" @text="Option 2" />
  </SelectItemGroup>
  <SelectItemGroup @label="Group 2" @disabled={{true}}>
    <SelectItem @value="option-3" @text="Option 3" />
    <SelectItem @value="option-4" @text="Option 4" />
  </SelectItemGroup>
</select>
*/
{
  "id": "QgJmD2tM",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"select\"],[14,0,\"cds--select-input\"],[12],[1,\"\\n  \"],[8,[32,1],null,[[\"@label\"],[\"Group 1\"]],[[\"default\"],[[[[1,\"\\n    \"],[8,[32,2],null,[[\"@value\",\"@text\"],[\"option-1\",\"Option 1\"]],null],[1,\"\\n    \"],[8,[32,2],null,[[\"@value\",\"@text\"],[\"option-2\",\"Option 2\"]],null],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[32,1],null,[[\"@label\",\"@disabled\"],[\"Group 2\",true]],[[\"default\"],[[[[1,\"\\n    \"],[8,[32,2],null,[[\"@value\",\"@text\"],[\"option-3\",\"Option 3\"]],null],[1,\"\\n    \"],[8,[32,2],null,[[\"@value\",\"@text\"],[\"option-4\",\"Option 4\"]],null],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, SelectItemGroup, SelectItem],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

const repl_174 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/select-item'
  @name='default'
/>
*/
{
  "id": "gKaLMZyU",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/select-item\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

const item_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="select-item">SelectItem</h1>
<p><code>SelectItem</code> renders a native <code>&#x3C;option></code> element for use inside a native
<code>&#x3C;select></code> (or <a href="./index.md"><code>Select</code></a>).</p>
<carbon-shadow-demo id="repl_171" class="repl-sdk__demo"><div><repl_171></repl_171></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { SelectItem } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;select class="cds--select-input">
    &#x3C;SelectItem @value="option-1" @text="Option 1" />
    &#x3C;SelectItem @value="option-2" @text="Option 2" />
    &#x3C;SelectItem @value="option-3" @text="Option 3" />
  &#x3C;/select>
&#x3C;/template>
</code></pre></div>
<h2 id="disabled">Disabled</h2>
<carbon-shadow-demo id="repl_172" class="repl-sdk__demo"><div><repl_172></repl_172></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { SelectItem } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;select class="cds--select-input">
    &#x3C;SelectItem @value="option-1" @text="Option 1" />
    &#x3C;SelectItem @value="option-2" @text="Option 2" @disabled=\{{true}} />
  &#x3C;/select>
&#x3C;/template>
</code></pre></div>
<h2 id="grouped-with-select-item-group">Grouped with SelectItemGroup</h2>
<carbon-shadow-demo id="repl_173" class="repl-sdk__demo"><div><repl_173></repl_173></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { SelectItem, SelectItemGroup } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;select class="cds--select-input">
    &#x3C;SelectItemGroup @label="Group 1">
      &#x3C;SelectItem @value="option-1" @text="Option 1" />
      &#x3C;SelectItem @value="option-2" @text="Option 2" />
    &#x3C;/SelectItemGroup>
    &#x3C;SelectItemGroup @label="Group 2" @disabled=\{{true}}>
      &#x3C;SelectItem @value="option-3" @text="Option 3" />
      &#x3C;SelectItem @value="option-4" @text="Option 4" />
    &#x3C;/SelectItemGroup>
  &#x3C;/select>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>SelectItem</h3></summary>
<div id="repl_174" class="repl-sdk__demo"><repl_174></repl_174></div>
</details>
*/
{
  "id": "iBXSxuPj",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"select-item\"],[12],[1,\"SelectItem\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"SelectItem\"],[13],[1,\" renders a native \"],[10,\"code\"],[12],[1,\"<option>\"],[13],[1,\" element for use inside a native\\n\"],[10,\"code\"],[12],[1,\"<select>\"],[13],[1,\" (or \"],[10,3],[14,6,\"./index.md\"],[12],[10,\"code\"],[12],[1,\"Select\"],[13],[13],[1,\").\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_171\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { SelectItem } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <select class=\\\"cds--select-input\\\">\\n    <SelectItem @value=\\\"option-1\\\" @text=\\\"Option 1\\\" />\\n    <SelectItem @value=\\\"option-2\\\" @text=\\\"Option 2\\\" />\\n    <SelectItem @value=\\\"option-3\\\" @text=\\\"Option 3\\\" />\\n  </select>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"disabled\"],[12],[1,\"Disabled\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_172\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { SelectItem } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <select class=\\\"cds--select-input\\\">\\n    <SelectItem @value=\\\"option-1\\\" @text=\\\"Option 1\\\" />\\n    <SelectItem @value=\\\"option-2\\\" @text=\\\"Option 2\\\" @disabled=\"],[1,\"{{true}} />\\n  </select>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"grouped-with-select-item-group\"],[12],[1,\"Grouped with SelectItemGroup\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_173\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { SelectItem, SelectItemGroup } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <select class=\\\"cds--select-input\\\">\\n    <SelectItemGroup @label=\\\"Group 1\\\">\\n      <SelectItem @value=\\\"option-1\\\" @text=\\\"Option 1\\\" />\\n      <SelectItem @value=\\\"option-2\\\" @text=\\\"Option 2\\\" />\\n    </SelectItemGroup>\\n    <SelectItemGroup @label=\\\"Group 2\\\" @disabled=\"],[1,\"{{true}}>\\n      <SelectItem @value=\\\"option-3\\\" @text=\\\"Option 3\\\" />\\n      <SelectItem @value=\\\"option-4\\\" @text=\\\"Option 4\\\" />\\n    </SelectItemGroup>\\n  </select>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"SelectItem\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_174\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_171, repl_172, repl_173, repl_174],
  "isStrictMode": true
}), templateOnly(undefined, "item.gjs"));

export { item_gjs as default };

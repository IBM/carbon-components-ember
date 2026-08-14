import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aK as FormLabel, t as templateOnly, aH as ToggletipComponent, aI as Information, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_219 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<FormLabel>Form label</FormLabel>
*/
{
  "id": "auGmFZM0",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"Form label\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, FormLabel],
  "isStrictMode": true
}), templateOnly(undefined, "label.gjs"));

const repl_220 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<div>
  <FormLabel>Form label with Toggletip</FormLabel>
  <Toggletip as |t|>
    <t.Button @label='Show information'>
      <Information />
    </t.Button>
    <t.Content>
      This can be used to provide more information about a field.
    </t.Content>
  </Toggletip>
</div>
*/
{
  "id": "Bni54qUO",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,0],[12],[1,\"\\n  \"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"Form label with Toggletip\"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Button\"]],null,[[\"@label\"],[\"Show information\"]],[[\"default\"],[[[[1,\"\\n      \"],[8,[32,3],null,null,null],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Content\"]],null,null,[[\"default\"],[[[[1,\"\\n      This can be used to provide more information about a field.\\n    \"]],[]]]]],[1,\"\\n  \"]],[1]]]]],[1,\"\\n\"],[13]],[\"t\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, FormLabel, ToggletipComponent, Information],
  "isStrictMode": true
}), templateOnly(undefined, "label.gjs"));

const repl_221 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<FormLabel @id="my-input">Name</FormLabel>
<br />
<input id="my-input" class="cds--text-input" type="text" />
*/
{
  "id": "ujFu7wyx",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@id\"],[\"my-input\"]],[[\"default\"],[[[[1,\"Name\"]],[]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"input\"],[14,1,\"my-input\"],[14,0,\"cds--text-input\"],[14,4,\"text\"],[12],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, FormLabel],
  "isStrictMode": true
}), templateOnly(undefined, "label.gjs"));

const repl_222 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/form-label'
  @name='default'
/>
*/
{
  "id": "RILaMC9m",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/form-label\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "label.gjs"));

const label_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="form-label">FormLabel</h1>
<p><code>FormLabel</code> renders a standalone <code>&#x3C;label></code> element styled to match the rest
of the Carbon form controls. It is useful when you need a label that is not
already built into a form control, such as when labeling a custom or
composite widget.</p>
<carbon-shadow-demo id="repl_219" class="repl-sdk__demo"><div><repl_219></repl_219></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { FormLabel } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;FormLabel>Form label&#x3C;/FormLabel>
&#x3C;/template>
</code></pre></div>
<h2 id="with-a-toggletip">With a Toggletip</h2>
<p>It is not recommended to include interactive items, such as links or
tooltips, inside a form label for accessibility reasons. Instead, place a
<code>Toggletip</code> (or <code>Tooltip</code>) as a sibling of the <code>FormLabel</code>.</p>
<carbon-shadow-demo id="repl_220" class="repl-sdk__demo"><div><repl_220></repl_220></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { FormLabel, Toggletip, ToggletipContent } from 'carbon-components-ember/components';
import { Information } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;div>
      &#x3C;FormLabel>Form label with Toggletip&#x3C;/FormLabel>
      &#x3C;Toggletip as |t|>
        &#x3C;t.Button @label='Show information'>
          &#x3C;Information />
        &#x3C;/t.Button>
        &#x3C;t.Content>
          This can be used to provide more information about a field.
        &#x3C;/t.Content>
      &#x3C;/Toggletip>
    &#x3C;/div>
&#x3C;/template>
</code></pre></div>
<h2 id="associating-with-a-form-control">Associating with a form control</h2>
<p>Pass <code>@id</code> to associate the label with a form control via the <code>for</code>
attribute.</p>
<carbon-shadow-demo id="repl_221" class="repl-sdk__demo"><div><repl_221></repl_221></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { FormLabel } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;FormLabel @id="my-input">Name&#x3C;/FormLabel>
    &#x3C;br />
    &#x3C;input id="my-input" class="cds--text-input" type="text" />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>FormLabel</h3></summary>
<div id="repl_222" class="repl-sdk__demo"><repl_222></repl_222></div>
</details>
*/
{
  "id": "82BDD1yU",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"form-label\"],[12],[1,\"FormLabel\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"FormLabel\"],[13],[1,\" renders a standalone \"],[10,\"code\"],[12],[1,\"<label>\"],[13],[1,\" element styled to match the rest\\nof the Carbon form controls. It is useful when you need a label that is not\\nalready built into a form control, such as when labeling a custom or\\ncomposite widget.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_219\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { FormLabel } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <FormLabel>Form label</FormLabel>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"with-a-toggletip\"],[12],[1,\"With a Toggletip\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"It is not recommended to include interactive items, such as links or\\ntooltips, inside a form label for accessibility reasons. Instead, place a\\n\"],[10,\"code\"],[12],[1,\"Toggletip\"],[13],[1,\" (or \"],[10,\"code\"],[12],[1,\"Tooltip\"],[13],[1,\") as a sibling of the \"],[10,\"code\"],[12],[1,\"FormLabel\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_220\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { FormLabel, Toggletip, ToggletipContent } from 'carbon-components-ember/components';\\nimport { Information } from 'carbon-components-ember/icons';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <div>\\n      <FormLabel>Form label with Toggletip</FormLabel>\\n      <Toggletip as |t|>\\n        <t.Button @label='Show information'>\\n          <Information />\\n        </t.Button>\\n        <t.Content>\\n          This can be used to provide more information about a field.\\n        </t.Content>\\n      </Toggletip>\\n    </div>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"associating-with-a-form-control\"],[12],[1,\"Associating with a form control\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Pass \"],[10,\"code\"],[12],[1,\"@id\"],[13],[1,\" to associate the label with a form control via the \"],[10,\"code\"],[12],[1,\"for\"],[13],[1,\"\\nattribute.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_221\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { FormLabel } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <FormLabel @id=\\\"my-input\\\">Name</FormLabel>\\n    <br />\\n    <input id=\\\"my-input\\\" class=\\\"cds--text-input\\\" type=\\\"text\\\" />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"FormLabel\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_222\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_219, repl_220, repl_221, repl_222],
  "isStrictMode": true
}), templateOnly(undefined, "label.gjs"));

export { label_gjs as default };

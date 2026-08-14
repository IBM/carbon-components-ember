import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, d as helper, Z as CarbonCheckbox, j as fn, f as helper$1, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_8 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
{{#let (newObj) as |context|}}
    <Checkbox
        @disabled={{true}}
        @checked={{true}}
        @onChange={{fn (set context 'checked')}}
        @label='disabled'
    />
    <Checkbox
        @disabled={{true}}
        @checked={{false}}
        @onChange={{fn (set context 'checked')}}
        @label='disabled and not checked'
    />
    <Checkbox
        @checked={{context.checked}}
        @onChange={{fn (set context 'checked')}}
    >
        Label in block
    </Checkbox>
    <p>
        checked:
        {{context.checked}}
    </p>
{{/let}}
*/
{
  "id": "1ndn+jQe",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[44,[[28,[32,1],null,null]],[[[1,\"    \"],[8,[32,2],null,[[\"@disabled\",\"@checked\",\"@onChange\",\"@label\"],[true,true,[28,[32,3],[[28,[32,4],[[30,1],\"checked\"],null]],null],\"disabled\"]],null],[1,\"\\n    \"],[8,[32,2],null,[[\"@disabled\",\"@checked\",\"@onChange\",\"@label\"],[true,false,[28,[32,3],[[28,[32,4],[[30,1],\"checked\"],null]],null],\"disabled and not checked\"]],null],[1,\"\\n    \"],[8,[32,2],null,[[\"@checked\",\"@onChange\"],[[30,1,[\"checked\"]],[28,[32,3],[[28,[32,4],[[30,1],\"checked\"],null]],null]]],[[\"default\"],[[[[1,\"\\n        Label in block\\n    \"]],[]]]]],[1,\"\\n    \"],[10,2],[12],[1,\"\\n        checked:\\n        \"],[1,[30,1,[\"checked\"]]],[1,\"\\n    \"],[13],[1,\"\\n\"]],[1]]]],[\"context\"],[\"let\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, CarbonCheckbox, fn, helper$1],
  "isStrictMode": true
}), templateOnly(undefined, "checkbox.gjs"));

const repl_9 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/checkbox' 
  @name='default' 
/>
*/
{
  "id": "eY57LVya",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/checkbox\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "checkbox.gjs"));

const checkbox_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="checkbox">Checkbox</h1>
<p>Checkboxes are used when there are multiple items to select in a list. Users can select zero, one, or any number of items.</p>
<carbon-shadow-demo id="repl_8" class="repl-sdk__demo"><div><repl_8></repl_8></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { fn } from '@ember/helper';
import { Accordion, Checkbox } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

const eq = (a, b) => a === b;

&#x3C;template>
    &#x3C;ThemeSupport />
    \{{#let (newObj) as |context|}}
        &#x3C;Checkbox
            @disabled=\{{true}}
            @checked=\{{true}}
            @onChange=\{{fn (set context 'checked')}}
            @label='disabled'
        />
        &#x3C;Checkbox
            @disabled=\{{true}}
            @checked=\{{false}}
            @onChange=\{{fn (set context 'checked')}}
            @label='disabled and not checked'
        />
        &#x3C;Checkbox
            @checked=\{{context.checked}}
            @onChange=\{{fn (set context 'checked')}}
        >
            Label in block
        &#x3C;/Checkbox>
        &#x3C;p>
            checked:
            \{{context.checked}}
        &#x3C;/p>
    \{{/let}}
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Checkbox</h3></summary>
<div id="repl_9" class="repl-sdk__demo"><repl_9></repl_9></div>
</details>
*/
{
  "id": "nnUPwiS1",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"checkbox\"],[12],[1,\"Checkbox\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Checkboxes are used when there are multiple items to select in a list. Users can select zero, one, or any number of items.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_8\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { fn } from '@ember/helper';\\nimport { Accordion, Checkbox } from 'carbon-components-ember/components';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst eq = (a, b) => a === b;\\n\\n<template>\\n    <ThemeSupport />\\n    \"],[1,\"{{#let (newObj) as |context|}}\\n        <Checkbox\\n            @disabled=\"],[1,\"{{true}}\\n            @checked=\"],[1,\"{{true}}\\n            @onChange=\"],[1,\"{{fn (set context 'checked')}}\\n            @label='disabled'\\n        />\\n        <Checkbox\\n            @disabled=\"],[1,\"{{true}}\\n            @checked=\"],[1,\"{{false}}\\n            @onChange=\"],[1,\"{{fn (set context 'checked')}}\\n            @label='disabled and not checked'\\n        />\\n        <Checkbox\\n            @checked=\"],[1,\"{{context.checked}}\\n            @onChange=\"],[1,\"{{fn (set context 'checked')}}\\n        >\\n            Label in block\\n        </Checkbox>\\n        <p>\\n            checked:\\n            \"],[1,\"{{context.checked}}\\n        </p>\\n    \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Checkbox\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_9\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_8, repl_9],
  "isStrictMode": true
}), templateOnly(undefined, "checkbox.gjs"));

export { checkbox_gjs as default };

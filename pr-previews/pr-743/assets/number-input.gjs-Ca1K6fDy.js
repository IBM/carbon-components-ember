import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, ae as NumberInput, t as templateOnly, af as trackedObject, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

const context = trackedObject();
const update = value => {
  context.value = value;
};
const repl_61 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<NumberInput @label="Quantity" @helperText="Optional" />
<br />
<NumberInput @label="Controlled" @value={{context.value}} @onChange={{update}} />
<br/>
value: {{context.value}}
<br />
<NumberInput @label="Small" @size="sm" />
<br />
<NumberInput @label="Large" @size="lg" />
<br />
<NumberInput @label="Min/max" @min={{0}} @max={{10}} @defaultValue={{5}} @helperText="Between 0 and 10" />
<br />
<NumberInput @label="Step by 5" @step={{5}} @defaultValue={{10}} />
<br />
<NumberInput @label="Without steppers" @hideSteppers={{true}} />
<br />
<NumberInput @label="Invalid" @defaultValue={{20}} @max={{10}} @invalidText="Value must be 10 or less" />
<br />
<NumberInput @label="Warning" @warn={{true}} @warnText="This value may cause issues" />
<br />
<NumberInput @label="Disabled" @disabled={{true}} @defaultValue={{42}} />
<br />
<NumberInput @label="Read-only" @readOnly={{true}} @defaultValue={{42}} />
*/
{
  "id": "vgkZUaXd",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@label\",\"@helperText\"],[\"Quantity\",\"Optional\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@label\",\"@value\",\"@onChange\"],[\"Controlled\",[32,2,[\"value\"]],[32,3]]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\nvalue: \"],[1,[32,2,[\"value\"]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@label\",\"@size\"],[\"Small\",\"sm\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@label\",\"@size\"],[\"Large\",\"lg\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@label\",\"@min\",\"@max\",\"@defaultValue\",\"@helperText\"],[\"Min/max\",0,10,5,\"Between 0 and 10\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@label\",\"@step\",\"@defaultValue\"],[\"Step by 5\",5,10]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@label\",\"@hideSteppers\"],[\"Without steppers\",true]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@label\",\"@defaultValue\",\"@max\",\"@invalidText\"],[\"Invalid\",20,10,\"Value must be 10 or less\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@label\",\"@warn\",\"@warnText\"],[\"Warning\",true,\"This value may cause issues\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@label\",\"@disabled\",\"@defaultValue\"],[\"Disabled\",true,42]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@label\",\"@readOnly\",\"@defaultValue\"],[\"Read-only\",true,42]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, NumberInput, context, update],
  "isStrictMode": true
}), templateOnly(undefined, "number-input.gjs"));

const repl_62 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/number-input'
  @name='default'
/>
*/
{
  "id": "nt87a6JO",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/number-input\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "number-input.gjs"));

const numberInput_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="number-input">NumberInput</h1>
<p>NumberInput allows the user to enter a number, and to increment/decrement the value using stepper buttons.</p>
<carbon-shadow-demo id="repl_61" class="repl-sdk__demo"><div><repl_61></repl_61></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { NumberInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject();

const update = (value) => {
  context.value = value;
}

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;NumberInput @label="Quantity" @helperText="Optional" />
    &#x3C;br />
    &#x3C;NumberInput @label="Controlled" @value=\{{context.value}} @onChange=\{{update}} />
    &#x3C;br/>
    value: \{{context.value}}
    &#x3C;br />
    &#x3C;NumberInput @label="Small" @size="sm" />
    &#x3C;br />
    &#x3C;NumberInput @label="Large" @size="lg" />
    &#x3C;br />
    &#x3C;NumberInput @label="Min/max" @min=\{{0}} @max=\{{10}} @defaultValue=\{{5}} @helperText="Between 0 and 10" />
    &#x3C;br />
    &#x3C;NumberInput @label="Step by 5" @step=\{{5}} @defaultValue=\{{10}} />
    &#x3C;br />
    &#x3C;NumberInput @label="Without steppers" @hideSteppers=\{{true}} />
    &#x3C;br />
    &#x3C;NumberInput @label="Invalid" @defaultValue=\{{20}} @max=\{{10}} @invalidText="Value must be 10 or less" />
    &#x3C;br />
    &#x3C;NumberInput @label="Warning" @warn=\{{true}} @warnText="This value may cause issues" />
    &#x3C;br />
    &#x3C;NumberInput @label="Disabled" @disabled=\{{true}} @defaultValue=\{{42}} />
    &#x3C;br />
    &#x3C;NumberInput @label="Read-only" @readOnly=\{{true}} @defaultValue=\{{42}} />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>NumberInput</h3></summary>
<div id="repl_62" class="repl-sdk__demo"><repl_62></repl_62></div>
</details>
*/
{
  "id": "XWhgxXVT",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"number-input\"],[12],[1,\"NumberInput\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"NumberInput allows the user to enter a number, and to increment/decrement the value using stepper buttons.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_61\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { NumberInput } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { trackedObject } from '@ember/reactive/collections';\\n\\nconst context = trackedObject();\\n\\nconst update = (value) => {\\n  context.value = value;\\n}\\n\\n<template>\\n    <ThemeSupport />\\n    <NumberInput @label=\\\"Quantity\\\" @helperText=\\\"Optional\\\" />\\n    <br />\\n    <NumberInput @label=\\\"Controlled\\\" @value=\"],[1,\"{{context.value}} @onChange=\"],[1,\"{{update}} />\\n    <br/>\\n    value: \"],[1,\"{{context.value}}\\n    <br />\\n    <NumberInput @label=\\\"Small\\\" @size=\\\"sm\\\" />\\n    <br />\\n    <NumberInput @label=\\\"Large\\\" @size=\\\"lg\\\" />\\n    <br />\\n    <NumberInput @label=\\\"Min/max\\\" @min=\"],[1,\"{{0}} @max=\"],[1,\"{{10}} @defaultValue=\"],[1,\"{{5}} @helperText=\\\"Between 0 and 10\\\" />\\n    <br />\\n    <NumberInput @label=\\\"Step by 5\\\" @step=\"],[1,\"{{5}} @defaultValue=\"],[1,\"{{10}} />\\n    <br />\\n    <NumberInput @label=\\\"Without steppers\\\" @hideSteppers=\"],[1,\"{{true}} />\\n    <br />\\n    <NumberInput @label=\\\"Invalid\\\" @defaultValue=\"],[1,\"{{20}} @max=\"],[1,\"{{10}} @invalidText=\\\"Value must be 10 or less\\\" />\\n    <br />\\n    <NumberInput @label=\\\"Warning\\\" @warn=\"],[1,\"{{true}} @warnText=\\\"This value may cause issues\\\" />\\n    <br />\\n    <NumberInput @label=\\\"Disabled\\\" @disabled=\"],[1,\"{{true}} @defaultValue=\"],[1,\"{{42}} />\\n    <br />\\n    <NumberInput @label=\\\"Read-only\\\" @readOnly=\"],[1,\"{{true}} @defaultValue=\"],[1,\"{{42}} />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"NumberInput\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_62\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_61, repl_62],
  "isStrictMode": true
}), templateOnly(undefined, "number-input.gjs"));

export { numberInput_gjs as default };

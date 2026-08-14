import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aB as RadioButton, Y as RadioButtonGroup, t as templateOnly, af as trackedObject, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const context = trackedObject();
const update = value => {
  context.checked = value;
};
const updateSelected = value => {
  context.selected = value;
};
const repl_79 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />
<RadioButton @checked={{false}} @labelText="radio" />
<br/>
<RadioButton @checked={{true}} @labelText="radio is checked" />
<br/>
<RadioButton @checked={{context.checked}} @onChange={{update}} @labelText="click me" />
<br/>
is checked: {{context.checked}}
<br/>
<RadioButton @disabled={{true}} @labelText="disabled" />
<br/>
<RadioButtonGroup @legendText="Radio button group" as |Radio|>
    <Radio @value="option-1" @defaultChecked={{true}} @labelText="Option 1 is default" />
    <Radio @value="option-2" @labelText="Option 2" />
</RadioButtonGroup>
<br/>
<RadioButtonGroup @legendText="Vertical group" @orientation="vertical" as |Radio|>
    <Radio @value="option-1" @defaultChecked={{true}} @labelText="Vertical option 1 is default" />
    <Radio @value="option-2" @labelText="Option 2" />
</RadioButtonGroup>
<br/>
selected: {{context.selected}}
<br/>
<RadioButtonGroup @onChange={{updateSelected}} @orientation="vertical">
  <:heading>Radio button group with a custom heading</:heading>
  <:default as |Radio|>
    <Radio @value="a" @labelText="Option A" />
    <Radio @value="b" @labelText="Option B" />
  </:default>
</RadioButtonGroup>
*/
{
  "id": "h0dirMWk",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@checked\",\"@labelText\"],[false,\"radio\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@checked\",\"@labelText\"],[true,\"radio is checked\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@checked\",\"@onChange\",\"@labelText\"],[[32,2,[\"checked\"]],[32,3],\"click me\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\nis checked: \"],[1,[32,2,[\"checked\"]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@disabled\",\"@labelText\"],[true,\"disabled\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,4],null,[[\"@legendText\"],[\"Radio button group\"]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1],null,[[\"@value\",\"@defaultChecked\",\"@labelText\"],[\"option-1\",true,\"Option 1 is default\"]],null],[1,\"\\n    \"],[8,[30,1],null,[[\"@value\",\"@labelText\"],[\"option-2\",\"Option 2\"]],null],[1,\"\\n\"]],[1]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,4],null,[[\"@legendText\",\"@orientation\"],[\"Vertical group\",\"vertical\"]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,2],null,[[\"@value\",\"@defaultChecked\",\"@labelText\"],[\"option-1\",true,\"Vertical option 1 is default\"]],null],[1,\"\\n    \"],[8,[30,2],null,[[\"@value\",\"@labelText\"],[\"option-2\",\"Option 2\"]],null],[1,\"\\n\"]],[2]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\nselected: \"],[1,[32,2,[\"selected\"]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,4],null,[[\"@onChange\",\"@orientation\"],[[32,5],\"vertical\"]],[[\"heading\",\"default\"],[[[[1,\"Radio button group with a custom heading\"]],[]],[[[1,\"\\n    \"],[8,[30,3],null,[[\"@value\",\"@labelText\"],[\"a\",\"Option A\"]],null],[1,\"\\n    \"],[8,[30,3],null,[[\"@value\",\"@labelText\"],[\"b\",\"Option B\"]],null],[1,\"\\n  \"]],[3]]]]]],[\"Radio\",\"Radio\",\"Radio\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, RadioButton, context, update, RadioButtonGroup, updateSelected],
  "isStrictMode": true
}), templateOnly(undefined, "radio-button.gjs"));

const repl_80 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/radio-button'
  @name='default'
/>
*/
{
  "id": "FJfRhu09",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/radio-button\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "radio-button.gjs"));

const repl_81 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/radio-button/group'
  @name='default'
/>
*/
{
  "id": "ejrY76om",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/radio-button/group\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "radio-button.gjs"));

const radioButton_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="radio-button">RadioButton</h1>
<p>Radio buttons are used when there is a list of two or more options that are mutually exclusive and the user must select exactly one choice.</p>
<carbon-shadow-demo id="repl_79" class="repl-sdk__demo"><div><repl_79></repl_79></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { RadioButton, RadioButtonGroup } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject();

const update = (value) => {
  context.checked = value;
}

const updateSelected = (value) => {
  context.selected = value;
}

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br />
    &#x3C;RadioButton @checked=\{{false}} @labelText="radio" />
    &#x3C;br/>
    &#x3C;RadioButton @checked=\{{true}} @labelText="radio is checked" />
    &#x3C;br/>
    &#x3C;RadioButton @checked=\{{context.checked}} @onChange=\{{update}} @labelText="click me" />
    &#x3C;br/>
    is checked: \{{context.checked}}
    &#x3C;br/>
    &#x3C;RadioButton @disabled=\{{true}} @labelText="disabled" />
    &#x3C;br/>
    &#x3C;RadioButtonGroup @legendText="Radio button group" as |Radio|>
        &#x3C;Radio @value="option-1" @defaultChecked=\{{true}} @labelText="Option 1 is default" />
        &#x3C;Radio @value="option-2" @labelText="Option 2" />
    &#x3C;/RadioButtonGroup>
    &#x3C;br/>
    &#x3C;RadioButtonGroup @legendText="Vertical group" @orientation="vertical" as |Radio|>
        &#x3C;Radio @value="option-1" @defaultChecked=\{{true}} @labelText="Vertical option 1 is default" />
        &#x3C;Radio @value="option-2" @labelText="Option 2" />
    &#x3C;/RadioButtonGroup>
    &#x3C;br/>
    selected: \{{context.selected}}
    &#x3C;br/>
    &#x3C;RadioButtonGroup @onChange=\{{updateSelected}} @orientation="vertical">
      &#x3C;:heading>Radio button group with a custom heading&#x3C;/:heading>
      &#x3C;:default as |Radio|>
        &#x3C;Radio @value="a" @labelText="Option A" />
        &#x3C;Radio @value="b" @labelText="Option B" />
      &#x3C;/:default>
    &#x3C;/RadioButtonGroup>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>RadioButton</h3></summary>
<div id="repl_80" class="repl-sdk__demo"><repl_80></repl_80></div>
</details>
<details>
<summary><h3>RadioButtonGroup</h3></summary>
<div id="repl_81" class="repl-sdk__demo"><repl_81></repl_81></div>
</details>
*/
{
  "id": "yJi2M/i/",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"radio-button\"],[12],[1,\"RadioButton\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Radio buttons are used when there is a list of two or more options that are mutually exclusive and the user must select exactly one choice.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_79\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { RadioButton, RadioButtonGroup } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { trackedObject } from '@ember/reactive/collections';\\n\\nconst context = trackedObject();\\n\\nconst update = (value) => {\\n  context.checked = value;\\n}\\n\\nconst updateSelected = (value) => {\\n  context.selected = value;\\n}\\n\\n<template>\\n    <ThemeSupport />\\n    <br />\\n    <RadioButton @checked=\"],[1,\"{{false}} @labelText=\\\"radio\\\" />\\n    <br/>\\n    <RadioButton @checked=\"],[1,\"{{true}} @labelText=\\\"radio is checked\\\" />\\n    <br/>\\n    <RadioButton @checked=\"],[1,\"{{context.checked}} @onChange=\"],[1,\"{{update}} @labelText=\\\"click me\\\" />\\n    <br/>\\n    is checked: \"],[1,\"{{context.checked}}\\n    <br/>\\n    <RadioButton @disabled=\"],[1,\"{{true}} @labelText=\\\"disabled\\\" />\\n    <br/>\\n    <RadioButtonGroup @legendText=\\\"Radio button group\\\" as |Radio|>\\n        <Radio @value=\\\"option-1\\\" @defaultChecked=\"],[1,\"{{true}} @labelText=\\\"Option 1 is default\\\" />\\n        <Radio @value=\\\"option-2\\\" @labelText=\\\"Option 2\\\" />\\n    </RadioButtonGroup>\\n    <br/>\\n    <RadioButtonGroup @legendText=\\\"Vertical group\\\" @orientation=\\\"vertical\\\" as |Radio|>\\n        <Radio @value=\\\"option-1\\\" @defaultChecked=\"],[1,\"{{true}} @labelText=\\\"Vertical option 1 is default\\\" />\\n        <Radio @value=\\\"option-2\\\" @labelText=\\\"Option 2\\\" />\\n    </RadioButtonGroup>\\n    <br/>\\n    selected: \"],[1,\"{{context.selected}}\\n    <br/>\\n    <RadioButtonGroup @onChange=\"],[1,\"{{updateSelected}} @orientation=\\\"vertical\\\">\\n      <:heading>Radio button group with a custom heading</:heading>\\n      <:default as |Radio|>\\n        <Radio @value=\\\"a\\\" @labelText=\\\"Option A\\\" />\\n        <Radio @value=\\\"b\\\" @labelText=\\\"Option B\\\" />\\n      </:default>\\n    </RadioButtonGroup>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"RadioButton\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_80\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"RadioButtonGroup\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_81\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_79, repl_80, repl_81],
  "isStrictMode": true
}), templateOnly(undefined, "radio-button.gjs"));

export { radioButton_gjs as default };

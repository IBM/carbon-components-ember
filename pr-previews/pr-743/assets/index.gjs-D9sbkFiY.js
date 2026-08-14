import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, am as TextInput, t as templateOnly, af as trackedObject, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const context = trackedObject();
const update = value => {
  context.value = value;
};
const repl_154 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<TextInput @labelText="Name" @placeholder="Enter your name" @helperText="Optional" />
<br />
<TextInput @labelText="Controlled" @value={{context.value}} @onChange={{update}} />
<br/>
value: {{context.value}}
<br />
<TextInput @labelText="Small" @size="sm" />
<br />
<TextInput @labelText="Large" @size="lg" />
<br />
<TextInput @labelText="With a counter" @enableCounter={{true}} @maxCount={{20}} @helperText="Up to 20 characters" />
<br />
<TextInput @labelText="Invalid" @invalid={{true}} @invalidText="A valid value is required" />
<br />
<TextInput @labelText="Warning" @warn={{true}} @warnText="This value may cause issues" />
<br />
<TextInput @labelText="Disabled" @disabled={{true}} @value="Can't touch this" />
<br />
<TextInput @labelText="Read-only" @readOnly={{true}} @value="Read-only value" />
*/
{
  "id": "kcYc8pLo",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@placeholder\",\"@helperText\"],[\"Name\",\"Enter your name\",\"Optional\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@value\",\"@onChange\"],[\"Controlled\",[32,2,[\"value\"]],[32,3]]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\nvalue: \"],[1,[32,2,[\"value\"]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@size\"],[\"Small\",\"sm\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@size\"],[\"Large\",\"lg\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@enableCounter\",\"@maxCount\",\"@helperText\"],[\"With a counter\",true,20,\"Up to 20 characters\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@invalid\",\"@invalidText\"],[\"Invalid\",true,\"A valid value is required\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@warn\",\"@warnText\"],[\"Warning\",true,\"This value may cause issues\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@disabled\",\"@value\"],[\"Disabled\",true,\"Can't touch this\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@readOnly\",\"@value\"],[\"Read-only\",true,\"Read-only value\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TextInput, context, update],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

const repl_155 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/text-input'
  @name='default'
/>
*/
{
  "id": "gBVDwyjS",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/text-input\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

const index_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="text-input">TextInput</h1>
<p>TextInput allows the user to enter a single line of text.</p>
<carbon-shadow-demo id="repl_154" class="repl-sdk__demo"><div><repl_154></repl_154></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TextInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject();

const update = (value) => {
  context.value = value;
}

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;TextInput @labelText="Name" @placeholder="Enter your name" @helperText="Optional" />
    &#x3C;br />
    &#x3C;TextInput @labelText="Controlled" @value=\{{context.value}} @onChange=\{{update}} />
    &#x3C;br/>
    value: \{{context.value}}
    &#x3C;br />
    &#x3C;TextInput @labelText="Small" @size="sm" />
    &#x3C;br />
    &#x3C;TextInput @labelText="Large" @size="lg" />
    &#x3C;br />
    &#x3C;TextInput @labelText="With a counter" @enableCounter=\{{true}} @maxCount=\{{20}} @helperText="Up to 20 characters" />
    &#x3C;br />
    &#x3C;TextInput @labelText="Invalid" @invalid=\{{true}} @invalidText="A valid value is required" />
    &#x3C;br />
    &#x3C;TextInput @labelText="Warning" @warn=\{{true}} @warnText="This value may cause issues" />
    &#x3C;br />
    &#x3C;TextInput @labelText="Disabled" @disabled=\{{true}} @value="Can't touch this" />
    &#x3C;br />
    &#x3C;TextInput @labelText="Read-only" @readOnly=\{{true}} @value="Read-only value" />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>TextInput</h3></summary>
<div id="repl_155" class="repl-sdk__demo"><repl_155></repl_155></div>
</details>
*/
{
  "id": "CFwDUKSA",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"text-input\"],[12],[1,\"TextInput\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"TextInput allows the user to enter a single line of text.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_154\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TextInput } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { trackedObject } from '@ember/reactive/collections';\\n\\nconst context = trackedObject();\\n\\nconst update = (value) => {\\n  context.value = value;\\n}\\n\\n<template>\\n    <ThemeSupport />\\n    <TextInput @labelText=\\\"Name\\\" @placeholder=\\\"Enter your name\\\" @helperText=\\\"Optional\\\" />\\n    <br />\\n    <TextInput @labelText=\\\"Controlled\\\" @value=\"],[1,\"{{context.value}} @onChange=\"],[1,\"{{update}} />\\n    <br/>\\n    value: \"],[1,\"{{context.value}}\\n    <br />\\n    <TextInput @labelText=\\\"Small\\\" @size=\\\"sm\\\" />\\n    <br />\\n    <TextInput @labelText=\\\"Large\\\" @size=\\\"lg\\\" />\\n    <br />\\n    <TextInput @labelText=\\\"With a counter\\\" @enableCounter=\"],[1,\"{{true}} @maxCount=\"],[1,\"{{20}} @helperText=\\\"Up to 20 characters\\\" />\\n    <br />\\n    <TextInput @labelText=\\\"Invalid\\\" @invalid=\"],[1,\"{{true}} @invalidText=\\\"A valid value is required\\\" />\\n    <br />\\n    <TextInput @labelText=\\\"Warning\\\" @warn=\"],[1,\"{{true}} @warnText=\\\"This value may cause issues\\\" />\\n    <br />\\n    <TextInput @labelText=\\\"Disabled\\\" @disabled=\"],[1,\"{{true}} @value=\\\"Can't touch this\\\" />\\n    <br />\\n    <TextInput @labelText=\\\"Read-only\\\" @readOnly=\"],[1,\"{{true}} @value=\\\"Read-only value\\\" />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"TextInput\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_155\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_154, repl_155],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

export { index_gjs as default };

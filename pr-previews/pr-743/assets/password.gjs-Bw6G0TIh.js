import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, an as PasswordInput, t as templateOnly, af as trackedObject, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const context = trackedObject();
const update = value => {
  context.value = value;
};
const repl_159 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<PasswordInput @labelText="Password" @placeholder="Enter your password" @helperText="Optional help text" />
<br />
<PasswordInput @labelText="Controlled" @value={{context.value}} @onChange={{update}} />
<br/>
value: {{context.value}}
<br />
<PasswordInput @labelText="Extra small" @size="xs" />
<br />
<PasswordInput @labelText="Small" @size="sm" />
<br />
<PasswordInput @labelText="Large" @size="lg" />
<br />
<PasswordInput @labelText="Invalid" @invalid={{true}} @invalidText="A valid password is required" />
<br />
<PasswordInput @labelText="Warning" @warn={{true}} @warnText="This password may cause issues" />
<br />
<PasswordInput @labelText="Disabled" @disabled={{true}} @value="Can't touch this" />
<br />
<PasswordInput @labelText="Read-only" @readOnly={{true}} @value="Read-only value" />
<br />
<PasswordInput @labelText="Inline" @inline={{true}} @helperText="Optional help text" />
<br />
<PasswordInput
  @labelText="Custom toggle labels"
  @showPasswordLabel="Reveal password"
  @hidePasswordLabel="Conceal password"
/>
<br />
<PasswordInput
  @labelText="Visible by default"
  @type="text"
  @helperText="Starts with the value shown"
/>
*/
{
  "id": "5+XdQmRS",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@placeholder\",\"@helperText\"],[\"Password\",\"Enter your password\",\"Optional help text\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@value\",\"@onChange\"],[\"Controlled\",[32,2,[\"value\"]],[32,3]]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\nvalue: \"],[1,[32,2,[\"value\"]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@size\"],[\"Extra small\",\"xs\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@size\"],[\"Small\",\"sm\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@size\"],[\"Large\",\"lg\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@invalid\",\"@invalidText\"],[\"Invalid\",true,\"A valid password is required\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@warn\",\"@warnText\"],[\"Warning\",true,\"This password may cause issues\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@disabled\",\"@value\"],[\"Disabled\",true,\"Can't touch this\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@readOnly\",\"@value\"],[\"Read-only\",true,\"Read-only value\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@inline\",\"@helperText\"],[\"Inline\",true,\"Optional help text\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@showPasswordLabel\",\"@hidePasswordLabel\"],[\"Custom toggle labels\",\"Reveal password\",\"Conceal password\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@type\",\"@helperText\"],[\"Visible by default\",\"text\",\"Starts with the value shown\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, PasswordInput, context, update],
  "isStrictMode": true
}), templateOnly(undefined, "password.gjs"));

const repl_160 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/password-input'
  @name='default'
/>
*/
{
  "id": "fjrVXNiZ",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/password-input\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "password.gjs"));

const password_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="password-input">PasswordInput</h1>
<p>PasswordInput allows the user to enter a single line of text that is masked
by default, with a toggle button to reveal or hide the value.</p>
<carbon-shadow-demo id="repl_159" class="repl-sdk__demo"><div><repl_159></repl_159></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { PasswordInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject();

const update = (value) => {
  context.value = value;
}

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;PasswordInput @labelText="Password" @placeholder="Enter your password" @helperText="Optional help text" />
    &#x3C;br />
    &#x3C;PasswordInput @labelText="Controlled" @value=\{{context.value}} @onChange=\{{update}} />
    &#x3C;br/>
    value: \{{context.value}}
    &#x3C;br />
    &#x3C;PasswordInput @labelText="Extra small" @size="xs" />
    &#x3C;br />
    &#x3C;PasswordInput @labelText="Small" @size="sm" />
    &#x3C;br />
    &#x3C;PasswordInput @labelText="Large" @size="lg" />
    &#x3C;br />
    &#x3C;PasswordInput @labelText="Invalid" @invalid=\{{true}} @invalidText="A valid password is required" />
    &#x3C;br />
    &#x3C;PasswordInput @labelText="Warning" @warn=\{{true}} @warnText="This password may cause issues" />
    &#x3C;br />
    &#x3C;PasswordInput @labelText="Disabled" @disabled=\{{true}} @value="Can't touch this" />
    &#x3C;br />
    &#x3C;PasswordInput @labelText="Read-only" @readOnly=\{{true}} @value="Read-only value" />
    &#x3C;br />
    &#x3C;PasswordInput @labelText="Inline" @inline=\{{true}} @helperText="Optional help text" />
    &#x3C;br />
    &#x3C;PasswordInput
      @labelText="Custom toggle labels"
      @showPasswordLabel="Reveal password"
      @hidePasswordLabel="Conceal password"
    />
    &#x3C;br />
    &#x3C;PasswordInput
      @labelText="Visible by default"
      @type="text"
      @helperText="Starts with the value shown"
    />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>PasswordInput</h3></summary>
<div id="repl_160" class="repl-sdk__demo"><repl_160></repl_160></div>
</details>
<h2 id="references">References</h2>
<ul>
<li><a href="https://carbondesignsystem.com/components/text-input/usage/">Carbon Design System: Password input</a></li>
<li><a href="https://react.carbondesignsystem.com/?path=/docs/components-passwordinput--overview">React Storybook</a></li>
</ul>
*/
{
  "id": "k1f88zKo",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"password-input\"],[12],[1,\"PasswordInput\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"PasswordInput allows the user to enter a single line of text that is masked\\nby default, with a toggle button to reveal or hide the value.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_159\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { PasswordInput } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { trackedObject } from '@ember/reactive/collections';\\n\\nconst context = trackedObject();\\n\\nconst update = (value) => {\\n  context.value = value;\\n}\\n\\n<template>\\n    <ThemeSupport />\\n    <PasswordInput @labelText=\\\"Password\\\" @placeholder=\\\"Enter your password\\\" @helperText=\\\"Optional help text\\\" />\\n    <br />\\n    <PasswordInput @labelText=\\\"Controlled\\\" @value=\"],[1,\"{{context.value}} @onChange=\"],[1,\"{{update}} />\\n    <br/>\\n    value: \"],[1,\"{{context.value}}\\n    <br />\\n    <PasswordInput @labelText=\\\"Extra small\\\" @size=\\\"xs\\\" />\\n    <br />\\n    <PasswordInput @labelText=\\\"Small\\\" @size=\\\"sm\\\" />\\n    <br />\\n    <PasswordInput @labelText=\\\"Large\\\" @size=\\\"lg\\\" />\\n    <br />\\n    <PasswordInput @labelText=\\\"Invalid\\\" @invalid=\"],[1,\"{{true}} @invalidText=\\\"A valid password is required\\\" />\\n    <br />\\n    <PasswordInput @labelText=\\\"Warning\\\" @warn=\"],[1,\"{{true}} @warnText=\\\"This password may cause issues\\\" />\\n    <br />\\n    <PasswordInput @labelText=\\\"Disabled\\\" @disabled=\"],[1,\"{{true}} @value=\\\"Can't touch this\\\" />\\n    <br />\\n    <PasswordInput @labelText=\\\"Read-only\\\" @readOnly=\"],[1,\"{{true}} @value=\\\"Read-only value\\\" />\\n    <br />\\n    <PasswordInput @labelText=\\\"Inline\\\" @inline=\"],[1,\"{{true}} @helperText=\\\"Optional help text\\\" />\\n    <br />\\n    <PasswordInput\\n      @labelText=\\\"Custom toggle labels\\\"\\n      @showPasswordLabel=\\\"Reveal password\\\"\\n      @hidePasswordLabel=\\\"Conceal password\\\"\\n    />\\n    <br />\\n    <PasswordInput\\n      @labelText=\\\"Visible by default\\\"\\n      @type=\\\"text\\\"\\n      @helperText=\\\"Starts with the value shown\\\"\\n    />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"PasswordInput\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_160\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"references\"],[12],[1,\"References\"],[13],[1,\"\\n\"],[10,\"ul\"],[12],[1,\"\\n\"],[10,\"li\"],[12],[10,3],[14,6,\"https://carbondesignsystem.com/components/text-input/usage/\"],[12],[1,\"Carbon Design System: Password input\"],[13],[13],[1,\"\\n\"],[10,\"li\"],[12],[10,3],[14,6,\"https://react.carbondesignsystem.com/?path=/docs/components-passwordinput--overview\"],[12],[1,\"React Storybook\"],[13],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_159, repl_160],
  "isStrictMode": true
}), templateOnly(undefined, "password.gjs"));

export { password_gjs as default };

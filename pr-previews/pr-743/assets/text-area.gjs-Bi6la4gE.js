import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, b3 as TextArea, t as templateOnly, af as trackedObject, ac as Add, b4 as TextAreaSkeleton, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const context = trackedObject();
const update = value => {
  context.value = value;
};
const repl_103 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<TextArea @labelText="Comments" @placeholder="Enter your comments" @helperText="Optional" />
<br />
<TextArea @labelText="Controlled" @value={{context.value}} @onChange={{update}} />
<br/>
value: {{context.value}}
<br />
<TextArea @labelText="With a counter" @enableCounter={{true}} @maxCount={{100}} @helperText="Up to 100 characters" />
<br />
<TextArea @labelText="With a word counter" @enableCounter={{true}} @maxCount={{20}} @counterMode="word" @helperText="Up to 20 words" />
<br />
<TextArea @labelText="Invalid" @invalid={{true}} @invalidText="A valid value is required" />
<br />
<TextArea @labelText="Warning" @warn={{true}} @warnText="This value may cause issues" />
<br />
<TextArea @labelText="Disabled" @disabled={{true}} @value="Can't touch this" />
<br />
<TextArea @labelText="Read-only" @readOnly={{true}} @value="Read-only value" />
<br />
<TextArea @labelText="Fixed size" @cols={{50}} @rows={{6}} @helperText="Not resizable horizontally" />
*/
{
  "id": "SKvwGgje",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@placeholder\",\"@helperText\"],[\"Comments\",\"Enter your comments\",\"Optional\"]],null],[1,\"\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@value\",\"@onChange\"],[\"Controlled\",[32,2,[\"value\"]],[32,3]]],null],[1,\"\"],[10,\"br\"],[12],[13],[1,\"\\nvalue: \"],[1,[32,2,[\"value\"]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@enableCounter\",\"@maxCount\",\"@helperText\"],[\"With a counter\",true,100,\"Up to 100 characters\"]],null],[1,\"\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@enableCounter\",\"@maxCount\",\"@counterMode\",\"@helperText\"],[\"With a word counter\",true,20,\"word\",\"Up to 20 words\"]],null],[1,\"\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@invalid\",\"@invalidText\"],[\"Invalid\",true,\"A valid value is required\"]],null],[1,\"\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@warn\",\"@warnText\"],[\"Warning\",true,\"This value may cause issues\"]],null],[1,\"\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@disabled\",\"@value\"],[\"Disabled\",true,\"Can't touch this\"]],null],[1,\"\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@readOnly\",\"@value\"],[\"Read-only\",true,\"Read-only value\"]],null],[1,\"\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@cols\",\"@rows\",\"@helperText\"],[\"Fixed size\",50,6,\"Not resizable horizontally\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TextArea, context, update],
  "isStrictMode": true
}), templateOnly(undefined, "text-area.gjs"));

const repl_104 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<TextArea @labelText="With a decorator" @helperText="Optional helper text" @decorator={{Add}} />
*/
{
  "id": "/w1YH/YO",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@helperText\",\"@decorator\"],[\"With a decorator\",\"Optional helper text\",[32,2]]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TextArea, Add],
  "isStrictMode": true
}), templateOnly(undefined, "text-area.gjs"));

const repl_105 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<TextAreaSkeleton />
*/
{
  "id": "HkMPlIgP",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,null,null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TextAreaSkeleton],
  "isStrictMode": true
}), templateOnly(undefined, "text-area.gjs"));

const repl_106 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/text-area'
  @name='default'
/>
*/
{
  "id": "+Nsy6J8J",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/text-area\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "text-area.gjs"));

const repl_107 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/text-area-skeleton'
  @name='default'
/>
*/
{
  "id": "SbrYd7Um",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/text-area-skeleton\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "text-area.gjs"));

const textArea_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="text-area">TextArea</h1>
<p>TextArea allows the user to enter multiple lines of text.</p>
<carbon-shadow-demo id="repl_103" class="repl-sdk__demo"><div><repl_103></repl_103></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TextArea } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject();

const update = (value) => {
  context.value = value;
}

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;TextArea @labelText="Comments" @placeholder="Enter your comments" @helperText="Optional" />
    &#x3C;br />
    &#x3C;TextArea @labelText="Controlled" @value=\{{context.value}} @onChange=\{{update}} />
    &#x3C;br/>
    value: \{{context.value}}
    &#x3C;br />
    &#x3C;TextArea @labelText="With a counter" @enableCounter=\{{true}} @maxCount=\{{100}} @helperText="Up to 100 characters" />
    &#x3C;br />
    &#x3C;TextArea @labelText="With a word counter" @enableCounter=\{{true}} @maxCount=\{{20}} @counterMode="word" @helperText="Up to 20 words" />
    &#x3C;br />
    &#x3C;TextArea @labelText="Invalid" @invalid=\{{true}} @invalidText="A valid value is required" />
    &#x3C;br />
    &#x3C;TextArea @labelText="Warning" @warn=\{{true}} @warnText="This value may cause issues" />
    &#x3C;br />
    &#x3C;TextArea @labelText="Disabled" @disabled=\{{true}} @value="Can't touch this" />
    &#x3C;br />
    &#x3C;TextArea @labelText="Read-only" @readOnly=\{{true}} @value="Read-only value" />
    &#x3C;br />
    &#x3C;TextArea @labelText="Fixed size" @cols=\{{50}} @rows=\{{6}} @helperText="Not resizable horizontally" />
&#x3C;/template>
</code></pre></div>
<h2 id="decorator">Decorator</h2>
<p><strong>Experimental</strong>: Provide a <code>@decorator</code> (or the deprecated <code>@slug</code>) component
to render inside the TextArea, such as an AILabel once it's available (see
<a href="https://github.com/IBM/carbon-components-ember/issues/406">#406</a>). Any
component can be used in the meantime; this example uses an icon as a
stand-in.</p>
<carbon-shadow-demo id="repl_104" class="repl-sdk__demo"><div><repl_104></repl_104></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TextArea } from 'carbon-components-ember/components';
import { Add } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;TextArea @labelText="With a decorator" @helperText="Optional helper text" @decorator=\{{Add}} />
&#x3C;/template>
</code></pre></div>
<h2 id="skeleton">Skeleton</h2>
<carbon-shadow-demo id="repl_105" class="repl-sdk__demo"><div><repl_105></repl_105></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TextAreaSkeleton } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;TextAreaSkeleton />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>TextArea</h3></summary>
<div id="repl_106" class="repl-sdk__demo"><repl_106></repl_106></div>
</details>
<details>
<summary><h3>TextAreaSkeleton</h3></summary>
<div id="repl_107" class="repl-sdk__demo"><repl_107></repl_107></div>
</details>
*/
{
  "id": "xYkp8i3r",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"text-area\"],[12],[1,\"TextArea\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"TextArea allows the user to enter multiple lines of text.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_103\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TextArea } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { trackedObject } from '@ember/reactive/collections';\\n\\nconst context = trackedObject();\\n\\nconst update = (value) => {\\n  context.value = value;\\n}\\n\\n<template>\\n    <ThemeSupport />\\n    <TextArea @labelText=\\\"Comments\\\" @placeholder=\\\"Enter your comments\\\" @helperText=\\\"Optional\\\" />\\n    <br />\\n    <TextArea @labelText=\\\"Controlled\\\" @value=\"],[1,\"{{context.value}} @onChange=\"],[1,\"{{update}} />\\n    <br/>\\n    value: \"],[1,\"{{context.value}}\\n    <br />\\n    <TextArea @labelText=\\\"With a counter\\\" @enableCounter=\"],[1,\"{{true}} @maxCount=\"],[1,\"{{100}} @helperText=\\\"Up to 100 characters\\\" />\\n    <br />\\n    <TextArea @labelText=\\\"With a word counter\\\" @enableCounter=\"],[1,\"{{true}} @maxCount=\"],[1,\"{{20}} @counterMode=\\\"word\\\" @helperText=\\\"Up to 20 words\\\" />\\n    <br />\\n    <TextArea @labelText=\\\"Invalid\\\" @invalid=\"],[1,\"{{true}} @invalidText=\\\"A valid value is required\\\" />\\n    <br />\\n    <TextArea @labelText=\\\"Warning\\\" @warn=\"],[1,\"{{true}} @warnText=\\\"This value may cause issues\\\" />\\n    <br />\\n    <TextArea @labelText=\\\"Disabled\\\" @disabled=\"],[1,\"{{true}} @value=\\\"Can't touch this\\\" />\\n    <br />\\n    <TextArea @labelText=\\\"Read-only\\\" @readOnly=\"],[1,\"{{true}} @value=\\\"Read-only value\\\" />\\n    <br />\\n    <TextArea @labelText=\\\"Fixed size\\\" @cols=\"],[1,\"{{50}} @rows=\"],[1,\"{{6}} @helperText=\\\"Not resizable horizontally\\\" />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"decorator\"],[12],[1,\"Decorator\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"strong\"],[12],[1,\"Experimental\"],[13],[1,\": Provide a \"],[10,\"code\"],[12],[1,\"@decorator\"],[13],[1,\" (or the deprecated \"],[10,\"code\"],[12],[1,\"@slug\"],[13],[1,\") component\\nto render inside the TextArea, such as an AILabel once it's available (see\\n\"],[10,3],[14,6,\"https://github.com/IBM/carbon-components-ember/issues/406\"],[12],[1,\"#406\"],[13],[1,\"). Any\\ncomponent can be used in the meantime; this example uses an icon as a\\nstand-in.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_104\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TextArea } from 'carbon-components-ember/components';\\nimport { Add } from 'carbon-components-ember/icons';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <TextArea @labelText=\\\"With a decorator\\\" @helperText=\\\"Optional helper text\\\" @decorator=\"],[1,\"{{Add}} />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"skeleton\"],[12],[1,\"Skeleton\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_105\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TextAreaSkeleton } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <TextAreaSkeleton />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"TextArea\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_106\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"TextAreaSkeleton\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_107\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_103, repl_104, repl_105, repl_106, repl_107],
  "isStrictMode": true
}), templateOnly(undefined, "text-area.gjs"));

export { textArea_gjs as default };

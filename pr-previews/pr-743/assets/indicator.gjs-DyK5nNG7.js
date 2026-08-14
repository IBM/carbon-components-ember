import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, au as ProgressIndicator, t as templateOnly, a6 as cell, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const currentIndex = cell(1);
const onChange = index => currentIndex.current = index;
const repl_175 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<ProgressIndicator @currentIndex={{currentIndex.current}} @onChange={{onChange}} as |Step|>
    <Step @label='First step' @description='Step 1: getting started' />
    <Step @label='Second step' @secondaryLabel='Optional' @description='Step 2: getting started' />
    <Step @label='Third step' @invalid={{true}} @description='Step 3: invalid step' />
    <Step @label='Fourth step' @disabled={{true}} @description='Step 4: disabled step' />
</ProgressIndicator>

<br>

<ProgressIndicator @currentIndex={{1}} @vertical={{true}} as |Step|>
    <Step @label='First step' />
    <Step @label='Second step' />
    <Step @label='Third step' />
</ProgressIndicator>
*/
{
  "id": "0HdoILBD",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@currentIndex\",\"@onChange\"],[[32,2,[\"current\"]],[32,3]]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1],null,[[\"@label\",\"@description\"],[\"First step\",\"Step 1: getting started\"]],null],[1,\"\\n    \"],[8,[30,1],null,[[\"@label\",\"@secondaryLabel\",\"@description\"],[\"Second step\",\"Optional\",\"Step 2: getting started\"]],null],[1,\"\\n    \"],[8,[30,1],null,[[\"@label\",\"@invalid\",\"@description\"],[\"Third step\",true,\"Step 3: invalid step\"]],null],[1,\"\\n    \"],[8,[30,1],null,[[\"@label\",\"@disabled\",\"@description\"],[\"Fourth step\",true,\"Step 4: disabled step\"]],null],[1,\"\\n\"]],[1]]]]],[1,\"\\n\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@currentIndex\",\"@vertical\"],[1,true]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,2],null,[[\"@label\"],[\"First step\"]],null],[1,\"\\n    \"],[8,[30,2],null,[[\"@label\"],[\"Second step\"]],null],[1,\"\\n    \"],[8,[30,2],null,[[\"@label\"],[\"Third step\"]],null],[1,\"\\n\"]],[2]]]]]],[\"Step\",\"Step\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, ProgressIndicator, currentIndex, onChange],
  "isStrictMode": true
}), templateOnly(undefined, "indicator.gjs"));

const repl_176 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/progress-indicator'
  @name='default'
/>
*/
{
  "id": "/VP9i5tQ",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/progress-indicator\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "indicator.gjs"));

const indicator_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="progress-indicator">ProgressIndicator</h1>
<carbon-shadow-demo id="repl_175" class="repl-sdk__demo"><div><repl_175></repl_175></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ProgressIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const currentIndex = cell(1);
const onChange = (index) => (currentIndex.current = index);

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;ProgressIndicator @currentIndex=\{{currentIndex.current}} @onChange=\{{onChange}} as |Step|>
        &#x3C;Step @label='First step' @description='Step 1: getting started' />
        &#x3C;Step @label='Second step' @secondaryLabel='Optional' @description='Step 2: getting started' />
        &#x3C;Step @label='Third step' @invalid=\{{true}} @description='Step 3: invalid step' />
        &#x3C;Step @label='Fourth step' @disabled=\{{true}} @description='Step 4: disabled step' />
    &#x3C;/ProgressIndicator>

    &#x3C;br>

    &#x3C;ProgressIndicator @currentIndex=\{{1}} @vertical=\{{true}} as |Step|>
        &#x3C;Step @label='First step' />
        &#x3C;Step @label='Second step' />
        &#x3C;Step @label='Third step' />
    &#x3C;/ProgressIndicator>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>ProgressIndicator</h3></summary>
<div id="repl_176" class="repl-sdk__demo"><repl_176></repl_176></div>
</details>
*/
{
  "id": "NxlYk+Cf",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"progress-indicator\"],[12],[1,\"ProgressIndicator\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_175\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ProgressIndicator } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { cell } from 'ember-resources';\\n\\nconst currentIndex = cell(1);\\nconst onChange = (index) => (currentIndex.current = index);\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <ProgressIndicator @currentIndex=\"],[1,\"{{currentIndex.current}} @onChange=\"],[1,\"{{onChange}} as |Step|>\\n        <Step @label='First step' @description='Step 1: getting started' />\\n        <Step @label='Second step' @secondaryLabel='Optional' @description='Step 2: getting started' />\\n        <Step @label='Third step' @invalid=\"],[1,\"{{true}} @description='Step 3: invalid step' />\\n        <Step @label='Fourth step' @disabled=\"],[1,\"{{true}} @description='Step 4: disabled step' />\\n    </ProgressIndicator>\\n\\n    <br>\\n\\n    <ProgressIndicator @currentIndex=\"],[1,\"{{1}} @vertical=\"],[1,\"{{true}} as |Step|>\\n        <Step @label='First step' />\\n        <Step @label='Second step' />\\n        <Step @label='Third step' />\\n    </ProgressIndicator>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"ProgressIndicator\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_176\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_175, repl_176],
  "isStrictMode": true
}), templateOnly(undefined, "indicator.gjs"));

export { indicator_gjs as default };

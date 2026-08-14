import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, bl as Slider, t as templateOnly, a6 as cell, bm as SliderSkeleton, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const value$1 = cell(50);
const onChange$2 = data => value$1.current = data.value;
const repl_84 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Slider
  @labelText='Slider label'
  @min={{0}}
  @max={{100}}
  @step={{5}}
  @value={{value.current}}
  @onChange={{onChange}}
/>
*/
{
  "id": "ZUsZzVD3",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@min\",\"@max\",\"@step\",\"@value\",\"@onChange\"],[\"Slider label\",0,100,5,[32,2,[\"current\"]],[32,3]]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Slider, value$1, onChange$2],
  "isStrictMode": true
}), templateOnly(undefined, "slider.gjs"));

const lower = cell(10);
const upper = cell(90);
const onChange$1 = data => {
  lower.current = data.value;
  upper.current = data.valueUpper;
};
const repl_85 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Slider
  @ariaLabelInput='Lower bound'
  @ariaLabelInputUpper='Upper bound'
  @labelText='Slider label'
  @min={{0}}
  @max={{100}}
  @value={{lower.current}}
  @valueUpper={{upper.current}}
  @onChange={{onChange}}
/>
*/
{
  "id": "r7NtLvut",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@ariaLabelInput\",\"@ariaLabelInputUpper\",\"@labelText\",\"@min\",\"@max\",\"@value\",\"@valueUpper\",\"@onChange\"],[\"Lower bound\",\"Upper bound\",\"Slider label\",0,100,[32,2,[\"current\"]],[32,3,[\"current\"]],[32,4]]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Slider, lower, upper, onChange$1],
  "isStrictMode": true
}), templateOnly(undefined, "slider.gjs"));

const value = cell(50);
const onChange = data => value.current = data.value;
const formatLabel = val => {
  if (val < 25) return 'Low';
  if (val > 75) return 'High';
  return 'Medium';
};
const repl_86 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Slider
  @labelText='Slider label with low/medium/high'
  @min={{0}}
  @max={{100}}
  @value={{value.current}}
  @onChange={{onChange}}
  @hideTextInput={{true}}
  @formatLabel={{formatLabel}}
/>
*/
{
  "id": "yDeHkIuK",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@min\",\"@max\",\"@value\",\"@onChange\",\"@hideTextInput\",\"@formatLabel\"],[\"Slider label with low/medium/high\",0,100,[32,2,[\"current\"]],[32,3],true,[32,4]]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Slider, value, onChange, formatLabel],
  "isStrictMode": true
}), templateOnly(undefined, "slider.gjs"));

const repl_87 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Slider @labelText='Disabled' @min={{0}} @max={{100}} @value={{50}} @disabled={{true}} />
<br>
<Slider
  @labelText='Invalid'
  @min={{0}}
  @max={{100}}
  @value={{50}}
  @invalid={{true}}
  @invalidText='Invalid message goes here'
/>
<br>
<Slider
  @labelText='Warning'
  @min={{0}}
  @max={{100}}
  @value={{50}}
  @warn={{true}}
  @warnText='Warning message goes here'
/>
*/
{
  "id": "uWNnZpqE",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@min\",\"@max\",\"@value\",\"@disabled\"],[\"Disabled\",0,100,50,true]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@min\",\"@max\",\"@value\",\"@invalid\",\"@invalidText\"],[\"Invalid\",0,100,50,true,\"Invalid message goes here\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@min\",\"@max\",\"@value\",\"@warn\",\"@warnText\"],[\"Warning\",0,100,50,true,\"Warning message goes here\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Slider],
  "isStrictMode": true
}), templateOnly(undefined, "slider.gjs"));

const repl_88 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<SliderSkeleton />
<br>
<SliderSkeleton @twoHandles={{true}} />
*/
{
  "id": "K5g4g3Zy",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@twoHandles\"],[true]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, SliderSkeleton],
  "isStrictMode": true
}), templateOnly(undefined, "slider.gjs"));

const repl_89 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/slider' 
  @name='default' 
/>
*/
{
  "id": "zQqXz3Bn",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/slider\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "slider.gjs"));

const repl_90 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/slider-skeleton' 
  @name='default' 
/>
*/
{
  "id": "GuOnTUHQ",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/slider-skeleton\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "slider.gjs"));

const slider_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="slider">Slider</h1>
<carbon-shadow-demo id="repl_84" class="repl-sdk__demo"><div><repl_84></repl_84></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Slider } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const value = cell(50);
const onChange = (data) => (value.current = data.value);

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;Slider
      @labelText='Slider label'
      @min=\{{0}}
      @max=\{{100}}
      @step=\{{5}}
      @value=\{{value.current}}
      @onChange=\{{onChange}}
    />
&#x3C;/template>
</code></pre></div>
<h2 id="two-handles">Two handles</h2>
<carbon-shadow-demo id="repl_85" class="repl-sdk__demo"><div><repl_85></repl_85></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Slider } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const lower = cell(10);
const upper = cell(90);
const onChange = (data) => {
  lower.current = data.value;
  upper.current = data.valueUpper;
};

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;Slider
      @ariaLabelInput='Lower bound'
      @ariaLabelInputUpper='Upper bound'
      @labelText='Slider label'
      @min=\{{0}}
      @max=\{{100}}
      @value=\{{lower.current}}
      @valueUpper=\{{upper.current}}
      @onChange=\{{onChange}}
    />
&#x3C;/template>
</code></pre></div>
<h2 id="hidden-text-input-custom-value-label">Hidden text input &#x26; custom value label</h2>
<carbon-shadow-demo id="repl_86" class="repl-sdk__demo"><div><repl_86></repl_86></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Slider } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const value = cell(50);
const onChange = (data) => (value.current = data.value);
const formatLabel = (val) => {
  if (val &#x3C; 25) return 'Low';
  if (val > 75) return 'High';
  return 'Medium';
};

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;Slider
      @labelText='Slider label with low/medium/high'
      @min=\{{0}}
      @max=\{{100}}
      @value=\{{value.current}}
      @onChange=\{{onChange}}
      @hideTextInput=\{{true}}
      @formatLabel=\{{formatLabel}}
    />
&#x3C;/template>
</code></pre></div>
<h2 id="disabled-invalid-and-warning-states">Disabled, invalid and warning states</h2>
<carbon-shadow-demo id="repl_87" class="repl-sdk__demo"><div><repl_87></repl_87></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Slider } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;Slider @labelText='Disabled' @min=\{{0}} @max=\{{100}} @value=\{{50}} @disabled=\{{true}} />
    &#x3C;br>
    &#x3C;Slider
      @labelText='Invalid'
      @min=\{{0}}
      @max=\{{100}}
      @value=\{{50}}
      @invalid=\{{true}}
      @invalidText='Invalid message goes here'
    />
    &#x3C;br>
    &#x3C;Slider
      @labelText='Warning'
      @min=\{{0}}
      @max=\{{100}}
      @value=\{{50}}
      @warn=\{{true}}
      @warnText='Warning message goes here'
    />
&#x3C;/template>
</code></pre></div>
<h2 id="skeleton">Skeleton</h2>
<carbon-shadow-demo id="repl_88" class="repl-sdk__demo"><div><repl_88></repl_88></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { SliderSkeleton } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;SliderSkeleton />
    &#x3C;br>
    &#x3C;SliderSkeleton @twoHandles=\{{true}} />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Slider</h3></summary>
<div id="repl_89" class="repl-sdk__demo"><repl_89></repl_89></div>
</details>
<details>
<summary><h3>SliderSkeleton</h3></summary>
<div id="repl_90" class="repl-sdk__demo"><repl_90></repl_90></div>
</details>
*/
{
  "id": "wdS6lpdc",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"slider\"],[12],[1,\"Slider\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_84\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Slider } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { cell } from 'ember-resources';\\n\\nconst value = cell(50);\\nconst onChange = (data) => (value.current = data.value);\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <Slider\\n      @labelText='Slider label'\\n      @min=\"],[1,\"{{0}}\\n      @max=\"],[1,\"{{100}}\\n      @step=\"],[1,\"{{5}}\\n      @value=\"],[1,\"{{value.current}}\\n      @onChange=\"],[1,\"{{onChange}}\\n    />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"two-handles\"],[12],[1,\"Two handles\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_85\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Slider } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { cell } from 'ember-resources';\\n\\nconst lower = cell(10);\\nconst upper = cell(90);\\nconst onChange = (data) => {\\n  lower.current = data.value;\\n  upper.current = data.valueUpper;\\n};\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <Slider\\n      @ariaLabelInput='Lower bound'\\n      @ariaLabelInputUpper='Upper bound'\\n      @labelText='Slider label'\\n      @min=\"],[1,\"{{0}}\\n      @max=\"],[1,\"{{100}}\\n      @value=\"],[1,\"{{lower.current}}\\n      @valueUpper=\"],[1,\"{{upper.current}}\\n      @onChange=\"],[1,\"{{onChange}}\\n    />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"hidden-text-input-custom-value-label\"],[12],[1,\"Hidden text input & custom value label\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_86\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Slider } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { cell } from 'ember-resources';\\n\\nconst value = cell(50);\\nconst onChange = (data) => (value.current = data.value);\\nconst formatLabel = (val) => {\\n  if (val < 25) return 'Low';\\n  if (val > 75) return 'High';\\n  return 'Medium';\\n};\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <Slider\\n      @labelText='Slider label with low/medium/high'\\n      @min=\"],[1,\"{{0}}\\n      @max=\"],[1,\"{{100}}\\n      @value=\"],[1,\"{{value.current}}\\n      @onChange=\"],[1,\"{{onChange}}\\n      @hideTextInput=\"],[1,\"{{true}}\\n      @formatLabel=\"],[1,\"{{formatLabel}}\\n    />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"disabled-invalid-and-warning-states\"],[12],[1,\"Disabled, invalid and warning states\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_87\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Slider } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <Slider @labelText='Disabled' @min=\"],[1,\"{{0}} @max=\"],[1,\"{{100}} @value=\"],[1,\"{{50}} @disabled=\"],[1,\"{{true}} />\\n    <br>\\n    <Slider\\n      @labelText='Invalid'\\n      @min=\"],[1,\"{{0}}\\n      @max=\"],[1,\"{{100}}\\n      @value=\"],[1,\"{{50}}\\n      @invalid=\"],[1,\"{{true}}\\n      @invalidText='Invalid message goes here'\\n    />\\n    <br>\\n    <Slider\\n      @labelText='Warning'\\n      @min=\"],[1,\"{{0}}\\n      @max=\"],[1,\"{{100}}\\n      @value=\"],[1,\"{{50}}\\n      @warn=\"],[1,\"{{true}}\\n      @warnText='Warning message goes here'\\n    />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"skeleton\"],[12],[1,\"Skeleton\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_88\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { SliderSkeleton } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <SliderSkeleton />\\n    <br>\\n    <SliderSkeleton @twoHandles=\"],[1,\"{{true}} />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Slider\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_89\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,6],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"SliderSkeleton\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_90\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,7],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_84, repl_85, repl_86, repl_87, repl_88, repl_89, repl_90],
  "isStrictMode": true
}), templateOnly(undefined, "slider.gjs"));

export { slider_gjs as default };

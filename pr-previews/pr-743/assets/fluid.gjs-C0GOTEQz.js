import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aF as FluidTextInput, t as templateOnly, a6 as cell, aG as ToggletipLabelComponent, aH as ToggletipComponent, aI as Information, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const value = cell('');
const update = newValue => value.current = newValue;
const repl_156 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<div style="max-width: 400px">
  <FluidTextInput @labelText="Label" @placeholder="Placeholder text" />
  <br />
  <FluidTextInput @labelText="Controlled" @value={{value.current}} @onChange={{update}} />
  <br/>
  value: {{value.current}}
  <br />
  <FluidTextInput @labelText="With a counter" @enableCounter={{true}} @maxCount={{20}} />
  <br />
  <FluidTextInput @labelText="Invalid" @invalid={{true}} @invalidText="A valid value is required" />
  <br />
  <FluidTextInput @labelText="Warning" @warn={{true}} @warnText="This value may cause issues" />
  <br />
  <FluidTextInput @labelText="Disabled" @disabled={{true}} @value="Can't touch this" />
  <br />
  <FluidTextInput @labelText="Read-only" @readOnly={{true}} @value="Read-only value" />
  <br />
  <FluidTextInput @labelText="Password" @isPassword={{true}} @placeholder="Enter your password" />
</div>
*/
{
  "id": "EwXlapCi",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,0],[14,5,\"max-width: 400px\"],[12],[1,\"\\n  \"],[8,[32,1],null,[[\"@labelText\",\"@placeholder\"],[\"Label\",\"Placeholder text\"]],null],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  \"],[8,[32,1],null,[[\"@labelText\",\"@value\",\"@onChange\"],[\"Controlled\",[32,2,[\"current\"]],[32,3]]],null],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  value: \"],[1,[32,2,[\"current\"]]],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  \"],[8,[32,1],null,[[\"@labelText\",\"@enableCounter\",\"@maxCount\"],[\"With a counter\",true,20]],null],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  \"],[8,[32,1],null,[[\"@labelText\",\"@invalid\",\"@invalidText\"],[\"Invalid\",true,\"A valid value is required\"]],null],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  \"],[8,[32,1],null,[[\"@labelText\",\"@warn\",\"@warnText\"],[\"Warning\",true,\"This value may cause issues\"]],null],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  \"],[8,[32,1],null,[[\"@labelText\",\"@disabled\",\"@value\"],[\"Disabled\",true,\"Can't touch this\"]],null],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  \"],[8,[32,1],null,[[\"@labelText\",\"@readOnly\",\"@value\"],[\"Read-only\",true,\"Read-only value\"]],null],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  \"],[8,[32,1],null,[[\"@labelText\",\"@isPassword\",\"@placeholder\"],[\"Password\",true,\"Enter your password\"]],null],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, FluidTextInput, value, update],
  "isStrictMode": true
}), templateOnly(undefined, "fluid.gjs"));

const repl_157 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<div style="max-width: 400px">
  <FluidTextInput @placeholder="Placeholder text">
    <:labelText>
      <ToggletipLabel>Label</ToggletipLabel>
      <Toggletip @align="top-left" as |t|>
        <t.Button @label="Show information">
          <Information />
        </t.Button>
        <t.Content>
          <p>Additional field information here.</p>
        </t.Content>
      </Toggletip>
    </:labelText>
  </FluidTextInput>
</div>
*/
{
  "id": "4VfH4zBg",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,0],[14,5,\"max-width: 400px\"],[12],[1,\"\\n  \"],[8,[32,1],null,[[\"@placeholder\"],[\"Placeholder text\"]],[[\"labelText\"],[[[[1,\"\\n      \"],[8,[32,2],null,null,[[\"default\"],[[[[1,\"Label\"]],[]]]]],[1,\"\\n      \"],[8,[32,3],null,[[\"@align\"],[\"top-left\"]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Button\"]],null,[[\"@label\"],[\"Show information\"]],[[\"default\"],[[[[1,\"\\n          \"],[8,[32,4],null,null,null],[1,\"\\n        \"]],[]]]]],[1,\"\\n        \"],[8,[30,1,[\"Content\"]],null,null,[[\"default\"],[[[[1,\"\\n          \"],[10,2],[12],[1,\"Additional field information here.\"],[13],[1,\"\\n        \"]],[]]]]],[1,\"\\n      \"]],[1]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n\"],[13]],[\"t\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, FluidTextInput, ToggletipLabelComponent, ToggletipComponent, Information],
  "isStrictMode": true
}), templateOnly(undefined, "fluid.gjs"));

const repl_158 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/fluid-text-input'
  @name='default'
/>
*/
{
  "id": "X7h09zKL",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/fluid-text-input\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "fluid.gjs"));

const fluid_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="fluid-text-input">FluidTextInput</h1>
<p>FluidTextInput is a text input variant with fluid styling - a full-width
bottom divider and inline validation message, intended for use in fluid
forms.</p>
<carbon-shadow-demo id="repl_156" class="repl-sdk__demo"><div><repl_156></repl_156></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { FluidTextInput } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const value = cell('');
const update = (newValue) => (value.current = newValue);

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;div style="max-width: 400px">
      &#x3C;FluidTextInput @labelText="Label" @placeholder="Placeholder text" />
      &#x3C;br />
      &#x3C;FluidTextInput @labelText="Controlled" @value=\{{value.current}} @onChange=\{{update}} />
      &#x3C;br/>
      value: \{{value.current}}
      &#x3C;br />
      &#x3C;FluidTextInput @labelText="With a counter" @enableCounter=\{{true}} @maxCount=\{{20}} />
      &#x3C;br />
      &#x3C;FluidTextInput @labelText="Invalid" @invalid=\{{true}} @invalidText="A valid value is required" />
      &#x3C;br />
      &#x3C;FluidTextInput @labelText="Warning" @warn=\{{true}} @warnText="This value may cause issues" />
      &#x3C;br />
      &#x3C;FluidTextInput @labelText="Disabled" @disabled=\{{true}} @value="Can't touch this" />
      &#x3C;br />
      &#x3C;FluidTextInput @labelText="Read-only" @readOnly=\{{true}} @value="Read-only value" />
      &#x3C;br />
      &#x3C;FluidTextInput @labelText="Password" @isPassword=\{{true}} @placeholder="Enter your password" />
    &#x3C;/div>
&#x3C;/template>
</code></pre></div>
<h2 id="with-toggletip">With Toggletip</h2>
<carbon-shadow-demo id="repl_157" class="repl-sdk__demo"><div><repl_157></repl_157></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { FluidTextInput, ToggletipLabel, Toggletip } from 'carbon-components-ember/components';
import { Information } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;div style="max-width: 400px">
      &#x3C;FluidTextInput @placeholder="Placeholder text">
        &#x3C;:labelText>
          &#x3C;ToggletipLabel>Label&#x3C;/ToggletipLabel>
          &#x3C;Toggletip @align="top-left" as |t|>
            &#x3C;t.Button @label="Show information">
              &#x3C;Information />
            &#x3C;/t.Button>
            &#x3C;t.Content>
              &#x3C;p>Additional field information here.&#x3C;/p>
            &#x3C;/t.Content>
          &#x3C;/Toggletip>
        &#x3C;/:labelText>
      &#x3C;/FluidTextInput>
    &#x3C;/div>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>FluidTextInput</h3></summary>
<div id="repl_158" class="repl-sdk__demo"><repl_158></repl_158></div>
</details>
*/
{
  "id": "/RwDm1co",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"fluid-text-input\"],[12],[1,\"FluidTextInput\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"FluidTextInput is a text input variant with fluid styling - a full-width\\nbottom divider and inline validation message, intended for use in fluid\\nforms.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_156\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { FluidTextInput } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { cell } from 'ember-resources';\\n\\nconst value = cell('');\\nconst update = (newValue) => (value.current = newValue);\\n\\n<template>\\n    <ThemeSupport />\\n    <div style=\\\"max-width: 400px\\\">\\n      <FluidTextInput @labelText=\\\"Label\\\" @placeholder=\\\"Placeholder text\\\" />\\n      <br />\\n      <FluidTextInput @labelText=\\\"Controlled\\\" @value=\"],[1,\"{{value.current}} @onChange=\"],[1,\"{{update}} />\\n      <br/>\\n      value: \"],[1,\"{{value.current}}\\n      <br />\\n      <FluidTextInput @labelText=\\\"With a counter\\\" @enableCounter=\"],[1,\"{{true}} @maxCount=\"],[1,\"{{20}} />\\n      <br />\\n      <FluidTextInput @labelText=\\\"Invalid\\\" @invalid=\"],[1,\"{{true}} @invalidText=\\\"A valid value is required\\\" />\\n      <br />\\n      <FluidTextInput @labelText=\\\"Warning\\\" @warn=\"],[1,\"{{true}} @warnText=\\\"This value may cause issues\\\" />\\n      <br />\\n      <FluidTextInput @labelText=\\\"Disabled\\\" @disabled=\"],[1,\"{{true}} @value=\\\"Can't touch this\\\" />\\n      <br />\\n      <FluidTextInput @labelText=\\\"Read-only\\\" @readOnly=\"],[1,\"{{true}} @value=\\\"Read-only value\\\" />\\n      <br />\\n      <FluidTextInput @labelText=\\\"Password\\\" @isPassword=\"],[1,\"{{true}} @placeholder=\\\"Enter your password\\\" />\\n    </div>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"with-toggletip\"],[12],[1,\"With Toggletip\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_157\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { FluidTextInput, ToggletipLabel, Toggletip } from 'carbon-components-ember/components';\\nimport { Information } from 'carbon-components-ember/icons';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <div style=\\\"max-width: 400px\\\">\\n      <FluidTextInput @placeholder=\\\"Placeholder text\\\">\\n        <:labelText>\\n          <ToggletipLabel>Label</ToggletipLabel>\\n          <Toggletip @align=\\\"top-left\\\" as |t|>\\n            <t.Button @label=\\\"Show information\\\">\\n              <Information />\\n            </t.Button>\\n            <t.Content>\\n              <p>Additional field information here.</p>\\n            </t.Content>\\n          </Toggletip>\\n        </:labelText>\\n      </FluidTextInput>\\n    </div>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"FluidTextInput\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_158\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_156, repl_157, repl_158],
  "isStrictMode": true
}), templateOnly(undefined, "fluid.gjs"));

export { fluid_gjs as default };

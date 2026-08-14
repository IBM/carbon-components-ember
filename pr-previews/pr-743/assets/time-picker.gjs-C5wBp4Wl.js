import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, bq as TimePicker, br as TimePickerSelect, t as templateOnly, d as helper, j as fn, f as helper$1, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_119 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

<TimePicker @id='time-picker' @labelText='Select a time'>
  <TimePickerSelect @id='time-picker-select-1'>
    <option value='AM'>AM</option>
    <option value='PM'>PM</option>
  </TimePickerSelect>
  <TimePickerSelect @id='time-picker-select-2'>
    <option value='Time zone 1'>Time zone 1</option>
    <option value='Time zone 2'>Time zone 2</option>
  </TimePickerSelect>
</TimePicker>
*/
{
  "id": "Jj2Q2/QQ",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@id\",\"@labelText\"],[\"time-picker\",\"Select a time\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@id\"],[\"time-picker-select-1\"]],[[\"default\"],[[[[1,\"\\n    \"],[10,\"option\"],[14,2,\"AM\"],[12],[1,\"AM\"],[13],[1,\"\\n    \"],[10,\"option\"],[14,2,\"PM\"],[12],[1,\"PM\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[8,[32,2],null,[[\"@id\"],[\"time-picker-select-2\"]],[[\"default\"],[[[[1,\"\\n    \"],[10,\"option\"],[14,2,\"Time zone 1\"],[12],[1,\"Time zone 1\"],[13],[1,\"\\n    \"],[10,\"option\"],[14,2,\"Time zone 2\"],[12],[1,\"Time zone 2\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TimePicker, TimePickerSelect],
  "isStrictMode": true
}), templateOnly(undefined, "time-picker.gjs"));

const repl_120 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

{{#let (newObj value='11:00') as |context|}}
  <TimePicker
    @labelText='Select a time'
    @value={{context.value}}
    @onChange={{fn (set context 'value')}}
  />
  <p>value: {{context.value}}</p>
{{/let}}
*/
{
  "id": "+gyrJaZV",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[44,[[28,[32,1],null,[[\"value\"],[\"11:00\"]]]],[[[1,\"  \"],[8,[32,2],null,[[\"@labelText\",\"@value\",\"@onChange\"],[\"Select a time\",[30,1,[\"value\"]],[28,[32,3],[[28,[32,4],[[30,1],\"value\"],null]],null]]],null],[1,\"\\n  \"],[10,2],[12],[1,\"value: \"],[1,[30,1,[\"value\"]]],[13],[1,\"\\n\"]],[1]]]],[\"context\"],[\"let\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, TimePicker, fn, helper$1],
  "isStrictMode": true
}), templateOnly(undefined, "time-picker.gjs"));

const repl_121 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

<TimePicker @labelText='Small' @size='sm' />
<br />
<TimePicker @labelText='Medium' @size='md' />
<br />
<TimePicker @labelText='Large' @size='lg' />
*/
{
  "id": "G1i4fXv8",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@labelText\",\"@size\"],[\"Small\",\"sm\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@size\"],[\"Medium\",\"md\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@size\"],[\"Large\",\"lg\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TimePicker],
  "isStrictMode": true
}), templateOnly(undefined, "time-picker.gjs"));

const repl_122 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

<TimePicker
  @labelText='Invalid'
  @invalid={{true}}
  @invalidText='Enter a valid time'
/>
<br />
<TimePicker
  @labelText='Warning'
  @warning={{true}}
  @warningText='This value may cause issues'
/>
*/
{
  "id": "asOLCEoq",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@labelText\",\"@invalid\",\"@invalidText\"],[\"Invalid\",true,\"Enter a valid time\"]],null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@warning\",\"@warningText\"],[\"Warning\",true,\"This value may cause issues\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TimePicker],
  "isStrictMode": true
}), templateOnly(undefined, "time-picker.gjs"));

const repl_123 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

<TimePicker @labelText='Disabled' @disabled={{true}} @value='11:00'>
  <TimePickerSelect @id='disabled-select-1'>
    <option value='AM'>AM</option>
    <option value='PM'>PM</option>
  </TimePickerSelect>
</TimePicker>
<br />
<TimePicker @labelText='Read-only' @readOnly={{true}} @value='11:00' />
*/
{
  "id": "ltRGCaYm",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@labelText\",\"@disabled\",\"@value\"],[\"Disabled\",true,\"11:00\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@id\"],[\"disabled-select-1\"]],[[\"default\"],[[[[1,\"\\n    \"],[10,\"option\"],[14,2,\"AM\"],[12],[1,\"AM\"],[13],[1,\"\\n    \"],[10,\"option\"],[14,2,\"PM\"],[12],[1,\"PM\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@labelText\",\"@readOnly\",\"@value\"],[\"Read-only\",true,\"11:00\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TimePicker, TimePickerSelect],
  "isStrictMode": true
}), templateOnly(undefined, "time-picker.gjs"));

const repl_124 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

<TimePicker @labelText='Select a time' @hideLabel={{true}} />
*/
{
  "id": "oewV/vOA",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@labelText\",\"@hideLabel\"],[\"Select a time\",true]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TimePicker],
  "isStrictMode": true
}), templateOnly(undefined, "time-picker.gjs"));

const repl_125 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/time-picker'
  @name='default'
/>
*/
{
  "id": "0GEA8Zgj",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/time-picker\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "time-picker.gjs"));

const repl_126 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/time-picker/time-picker-select'
  @name='default'
/>
*/
{
  "id": "7lrw7l3t",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/time-picker/time-picker-select\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "time-picker.gjs"));

const timePicker_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="time-picker">TimePicker</h1>
<p><code>TimePicker</code> renders a text <code>&#x3C;input></code> for entering a time, optionally paired
with one or more <code>TimePickerSelect</code> components (e.g. for AM/PM and time
zone) rendered next to it.</p>
<carbon-shadow-demo id="repl_119" class="repl-sdk__demo"><div><repl_119></repl_119></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TimePicker, TimePickerSelect } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  &#x3C;TimePicker @id='time-picker' @labelText='Select a time'>
    &#x3C;TimePickerSelect @id='time-picker-select-1'>
      &#x3C;option value='AM'>AM&#x3C;/option>
      &#x3C;option value='PM'>PM&#x3C;/option>
    &#x3C;/TimePickerSelect>
    &#x3C;TimePickerSelect @id='time-picker-select-2'>
      &#x3C;option value='Time zone 1'>Time zone 1&#x3C;/option>
      &#x3C;option value='Time zone 2'>Time zone 2&#x3C;/option>
    &#x3C;/TimePickerSelect>
  &#x3C;/TimePicker>
&#x3C;/template>
</code></pre></div>
<h2 id="controlled">Controlled</h2>
<p>Passing <code>@value</code> alongside <code>@onChange</code> makes the <code>&#x3C;input></code> fully controlled.</p>
<carbon-shadow-demo id="repl_120" class="repl-sdk__demo"><div><repl_120></repl_120></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TimePicker } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { fn } from '@ember/helper';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  \{{#let (newObj value='11:00') as |context|}}
    &#x3C;TimePicker
      @labelText='Select a time'
      @value=\{{context.value}}
      @onChange=\{{fn (set context 'value')}}
    />
    &#x3C;p>value: \{{context.value}}&#x3C;/p>
  \{{/let}}
&#x3C;/template>
</code></pre></div>
<h2 id="sizes">Sizes</h2>
<p><code>@size</code> accepts <code>sm</code>, <code>md</code> (the default), or <code>lg</code>.</p>
<carbon-shadow-demo id="repl_121" class="repl-sdk__demo"><div><repl_121></repl_121></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TimePicker } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  &#x3C;TimePicker @labelText='Small' @size='sm' />
  &#x3C;br />
  &#x3C;TimePicker @labelText='Medium' @size='md' />
  &#x3C;br />
  &#x3C;TimePicker @labelText='Large' @size='lg' />
&#x3C;/template>
</code></pre></div>
<h2 id="invalid-and-warning-states">Invalid and warning states</h2>
<carbon-shadow-demo id="repl_122" class="repl-sdk__demo"><div><repl_122></repl_122></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TimePicker } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  &#x3C;TimePicker
    @labelText='Invalid'
    @invalid=\{{true}}
    @invalidText='Enter a valid time'
  />
  &#x3C;br />
  &#x3C;TimePicker
    @labelText='Warning'
    @warning=\{{true}}
    @warningText='This value may cause issues'
  />
&#x3C;/template>
</code></pre></div>
<h2 id="disabled-and-read-only">Disabled and read-only</h2>
<carbon-shadow-demo id="repl_123" class="repl-sdk__demo"><div><repl_123></repl_123></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TimePicker, TimePickerSelect } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  &#x3C;TimePicker @labelText='Disabled' @disabled=\{{true}} @value='11:00'>
    &#x3C;TimePickerSelect @id='disabled-select-1'>
      &#x3C;option value='AM'>AM&#x3C;/option>
      &#x3C;option value='PM'>PM&#x3C;/option>
    &#x3C;/TimePickerSelect>
  &#x3C;/TimePicker>
  &#x3C;br />
  &#x3C;TimePicker @labelText='Read-only' @readOnly=\{{true}} @value='11:00' />
&#x3C;/template>
</code></pre></div>
<h2 id="hidden-label">Hidden label</h2>
<carbon-shadow-demo id="repl_124" class="repl-sdk__demo"><div><repl_124></repl_124></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TimePicker } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  &#x3C;TimePicker @labelText='Select a time' @hideLabel=\{{true}} />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>TimePicker</h3></summary>
<div id="repl_125" class="repl-sdk__demo"><repl_125></repl_125></div>
</details>
<details>
<summary><h3>TimePickerSelect</h3></summary>
<div id="repl_126" class="repl-sdk__demo"><repl_126></repl_126></div>
</details>
*/
{
  "id": "mVfDj2Id",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"time-picker\"],[12],[1,\"TimePicker\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"TimePicker\"],[13],[1,\" renders a text \"],[10,\"code\"],[12],[1,\"<input>\"],[13],[1,\" for entering a time, optionally paired\\nwith one or more \"],[10,\"code\"],[12],[1,\"TimePickerSelect\"],[13],[1,\" components (e.g. for AM/PM and time\\nzone) rendered next to it.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_119\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TimePicker, TimePickerSelect } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  <TimePicker @id='time-picker' @labelText='Select a time'>\\n    <TimePickerSelect @id='time-picker-select-1'>\\n      <option value='AM'>AM</option>\\n      <option value='PM'>PM</option>\\n    </TimePickerSelect>\\n    <TimePickerSelect @id='time-picker-select-2'>\\n      <option value='Time zone 1'>Time zone 1</option>\\n      <option value='Time zone 2'>Time zone 2</option>\\n    </TimePickerSelect>\\n  </TimePicker>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"controlled\"],[12],[1,\"Controlled\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Passing \"],[10,\"code\"],[12],[1,\"@value\"],[13],[1,\" alongside \"],[10,\"code\"],[12],[1,\"@onChange\"],[13],[1,\" makes the \"],[10,\"code\"],[12],[1,\"<input>\"],[13],[1,\" fully controlled.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_120\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TimePicker } from 'carbon-components-ember/components';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { fn } from '@ember/helper';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  \"],[1,\"{{#let (newObj value='11:00') as |context|}}\\n    <TimePicker\\n      @labelText='Select a time'\\n      @value=\"],[1,\"{{context.value}}\\n      @onChange=\"],[1,\"{{fn (set context 'value')}}\\n    />\\n    <p>value: \"],[1,\"{{context.value}}</p>\\n  \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"sizes\"],[12],[1,\"Sizes\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"@size\"],[13],[1,\" accepts \"],[10,\"code\"],[12],[1,\"sm\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"md\"],[13],[1,\" (the default), or \"],[10,\"code\"],[12],[1,\"lg\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_121\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TimePicker } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  <TimePicker @labelText='Small' @size='sm' />\\n  <br />\\n  <TimePicker @labelText='Medium' @size='md' />\\n  <br />\\n  <TimePicker @labelText='Large' @size='lg' />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"invalid-and-warning-states\"],[12],[1,\"Invalid and warning states\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_122\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TimePicker } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  <TimePicker\\n    @labelText='Invalid'\\n    @invalid=\"],[1,\"{{true}}\\n    @invalidText='Enter a valid time'\\n  />\\n  <br />\\n  <TimePicker\\n    @labelText='Warning'\\n    @warning=\"],[1,\"{{true}}\\n    @warningText='This value may cause issues'\\n  />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"disabled-and-read-only\"],[12],[1,\"Disabled and read-only\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_123\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TimePicker, TimePickerSelect } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  <TimePicker @labelText='Disabled' @disabled=\"],[1,\"{{true}} @value='11:00'>\\n    <TimePickerSelect @id='disabled-select-1'>\\n      <option value='AM'>AM</option>\\n      <option value='PM'>PM</option>\\n    </TimePickerSelect>\\n  </TimePicker>\\n  <br />\\n  <TimePicker @labelText='Read-only' @readOnly=\"],[1,\"{{true}} @value='11:00' />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"hidden-label\"],[12],[1,\"Hidden label\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_124\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,6],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TimePicker } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  <TimePicker @labelText='Select a time' @hideLabel=\"],[1,\"{{true}} />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"TimePicker\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_125\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,7],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"TimePickerSelect\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_126\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,8],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_119, repl_120, repl_121, repl_122, repl_123, repl_124, repl_125, repl_126],
  "isStrictMode": true
}), templateOnly(undefined, "time-picker.gjs"));

export { timePicker_gjs as default };

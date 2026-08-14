import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, bn as CarbonBarChart, aw as array, t as templateOnly, bo as CarbonLineChart, bp as CarbonPieChart, a6 as cell, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_10 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<BarChart
    style='height: 600px; width: 600px; display: inline-block'
    as |chart|
>
    <chart.Axis
        @axis='left'
        @title='2018 Annual Sales'
        @primary={{true}}
    />
    <chart.Axis
        @axis='bottom'
        @title='Figures'
        @secondary={{true}}
        @scaleType='labels'
    />
    <chart.TabularData
        @group='Name'
        @keys={{array 'Quantity' 'Leads' 'Sold' 'Restocking' 'Misc'}}
        @values={{array 65000 29123 35213 51213 16932}}
    />
</BarChart>
*/
{
  "id": "WeEPYj0c",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],[[24,5,\"height: 600px; width: 600px; display: inline-block\"]],null,[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Axis\"]],null,[[\"@axis\",\"@title\",\"@primary\"],[\"left\",\"2018 Annual Sales\",true]],null],[1,\"\\n    \"],[8,[30,1,[\"Axis\"]],null,[[\"@axis\",\"@title\",\"@secondary\",\"@scaleType\"],[\"bottom\",\"Figures\",true,\"labels\"]],null],[1,\"\\n    \"],[8,[30,1,[\"TabularData\"]],null,[[\"@group\",\"@keys\",\"@values\"],[\"Name\",[28,[32,2],[\"Quantity\",\"Leads\",\"Sold\",\"Restocking\",\"Misc\"],null],[28,[32,2],[65000,29123,35213,51213,16932],null]]],null],[1,\"\\n\"]],[1]]]]]],[\"chart\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonBarChart, array],
  "isStrictMode": true
}), templateOnly(undefined, "charts.gjs"));

const repl_11 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<LineChart
  style='height: 600px; width: 600px; display: inline-block'
  as |chart|
>
  <chart.Axis
    @axis='left'
    @title='2018 Annual Sales'
    @primary={{true}}
  />
  <chart.Axis
    @axis='bottom'
    @title='Figures'
    @secondary={{true}}
    @scaleType='labels'
  />
  <chart.TabularData
    @group='Name'
    @keys={{array 'Quantity' 'Leads' 'Sold' 'Restocking' 'Misc'}}
    @values={{array 65000 29123 35213 51213 16932}}
  />
</LineChart>
*/
{
  "id": "J/lDKcDK",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],[[24,5,\"height: 600px; width: 600px; display: inline-block\"]],null,[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1,[\"Axis\"]],null,[[\"@axis\",\"@title\",\"@primary\"],[\"left\",\"2018 Annual Sales\",true]],null],[1,\"\\n  \"],[8,[30,1,[\"Axis\"]],null,[[\"@axis\",\"@title\",\"@secondary\",\"@scaleType\"],[\"bottom\",\"Figures\",true,\"labels\"]],null],[1,\"\\n  \"],[8,[30,1,[\"TabularData\"]],null,[[\"@group\",\"@keys\",\"@values\"],[\"Name\",[28,[32,2],[\"Quantity\",\"Leads\",\"Sold\",\"Restocking\",\"Misc\"],null],[28,[32,2],[65000,29123,35213,51213,16932],null]]],null],[1,\"\\n\"]],[1]]]]]],[\"chart\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonLineChart, array],
  "isStrictMode": true
}), templateOnly(undefined, "charts.gjs"));

const repl_12 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<PieChart
      style='height: 600px; width: 600px; display: inline-block'
      as |chart|
    >
      <chart.Axis @axis='left' @title='2018 Annual Sales' />
      <chart.Axis @axis='bottom' @title='Figures' @scaleType='labels' />
      <chart.TabularData @group='Quantity' @values={{array 65000}} />
      <chart.TabularData @group='Leads' @values={{array 29123}} />
      <chart.TabularData @group='Sold' @values={{array 35213}} />
      <chart.TabularData @group='Restocking' @values={{array 51213}} />
      <chart.TabularData @group='Misc' @values={{array 16932}} />
</PieChart>
*/
{
  "id": "OJbNGInC",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],[[24,5,\"height: 600px; width: 600px; display: inline-block\"]],null,[[\"default\"],[[[[1,\"\\n      \"],[8,[30,1,[\"Axis\"]],null,[[\"@axis\",\"@title\"],[\"left\",\"2018 Annual Sales\"]],null],[1,\"\\n      \"],[8,[30,1,[\"Axis\"]],null,[[\"@axis\",\"@title\",\"@scaleType\"],[\"bottom\",\"Figures\",\"labels\"]],null],[1,\"\\n      \"],[8,[30,1,[\"TabularData\"]],null,[[\"@group\",\"@values\"],[\"Quantity\",[28,[32,2],[65000],null]]],null],[1,\"\\n      \"],[8,[30,1,[\"TabularData\"]],null,[[\"@group\",\"@values\"],[\"Leads\",[28,[32,2],[29123],null]]],null],[1,\"\\n      \"],[8,[30,1,[\"TabularData\"]],null,[[\"@group\",\"@values\"],[\"Sold\",[28,[32,2],[35213],null]]],null],[1,\"\\n      \"],[8,[30,1,[\"TabularData\"]],null,[[\"@group\",\"@values\"],[\"Restocking\",[28,[32,2],[51213],null]]],null],[1,\"\\n      \"],[8,[30,1,[\"TabularData\"]],null,[[\"@group\",\"@values\"],[\"Misc\",[28,[32,2],[16932],null]]],null],[1,\"\\n\"]],[1]]]]]],[\"chart\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonPieChart, array],
  "isStrictMode": true
}), templateOnly(undefined, "charts.gjs"));

const start = cell(0);
setInterval(() => {
  start.current += 1;
  if (start.current === 200) {
    start.current = 0;
  }
}, 1000);
function sinus() {
  const values = [];
  const s = start.current * 2 * Math.PI / 100;
  let c = 0;
  for (let i = s; i < s + 2 * Math.PI; i += Math.PI / 50) {
    c++;
    values.push({
      date: c,
      value: Math.sin(i)
    });
  }
  return values;
}
const repl_13 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<LineChart
    style='height: 600px; width: 600px; display: inline-block'
    as |chart|
  >
  <chart.Axis @axis='left' @title='y' />
  <chart.Axis @axis='bottom' @title='x' @scaleType='time' />
  <chart.TabularData @group='sinus' @data={{(sinus)}} />
</LineChart>
*/
{
  "id": "Ew44D5fU",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],[[24,5,\"height: 600px; width: 600px; display: inline-block\"]],null,[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1,[\"Axis\"]],null,[[\"@axis\",\"@title\"],[\"left\",\"y\"]],null],[1,\"\\n  \"],[8,[30,1,[\"Axis\"]],null,[[\"@axis\",\"@title\",\"@scaleType\"],[\"bottom\",\"x\",\"time\"]],null],[1,\"\\n  \"],[8,[30,1,[\"TabularData\"]],null,[[\"@group\",\"@data\"],[\"sinus\",[28,[32,2],null,null]]],null],[1,\"\\n\"]],[1]]]]]],[\"chart\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonLineChart, sinus],
  "isStrictMode": true
}), templateOnly(undefined, "charts.gjs"));

const repl_14 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/charts/bar' 
  @name='default' 
/>
*/
{
  "id": "Lwuyc/cu",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/charts/bar\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "charts.gjs"));

const repl_15 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/charts/line' 
  @name='default' 
/>
*/
{
  "id": "8PsS80WR",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/charts/line\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "charts.gjs"));

const repl_16 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/charts/pie' 
  @name='default' 
/>
*/
{
  "id": "zZxpqrcN",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/charts/pie\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "charts.gjs"));

const repl_17 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/charts/-components/color/pairing' 
  @name='default' 
/>
*/
{
  "id": "C5viWnsz",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/charts/-components/color/pairing\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "charts.gjs"));

const charts_gjs = setComponentTemplate(templateFactory(
/*
  <h1 id="charts">Charts</h1>
<ThemeSwitcher />
<details open><summary><h3>Bar Chart</h3></summary>
<carbon-shadow-demo id="repl_10" class="repl-sdk__demo"><div><repl_10></repl_10></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { BarChart } from 'carbon-components-ember/components';
import { array } from '@ember/helper';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;BarChart
        style='height: 600px; width: 600px; display: inline-block'
        as |chart|
    >
        &#x3C;chart.Axis
            @axis='left'
            @title='2018 Annual Sales'
            @primary=\{{true}}
        />
        &#x3C;chart.Axis
            @axis='bottom'
            @title='Figures'
            @secondary=\{{true}}
            @scaleType='labels'
        />
        &#x3C;chart.TabularData
            @group='Name'
            @keys=\{{array 'Quantity' 'Leads' 'Sold' 'Restocking' 'Misc'}}
            @values=\{{array 65000 29123 35213 51213 16932}}
        />
    &#x3C;/BarChart>
&#x3C;/template>
</code></pre></div>
</details>
<details open><summary><h3>Line Chart</h3></summary>
<carbon-shadow-demo id="repl_11" class="repl-sdk__demo"><div><repl_11></repl_11></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { LineChart } from 'carbon-components-ember/components';
import { array } from '@ember/helper';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;LineChart
    style='height: 600px; width: 600px; display: inline-block'
    as |chart|
  >
    &#x3C;chart.Axis
      @axis='left'
      @title='2018 Annual Sales'
      @primary=\{{true}}
    />
    &#x3C;chart.Axis
      @axis='bottom'
      @title='Figures'
      @secondary=\{{true}}
      @scaleType='labels'
    />
    &#x3C;chart.TabularData
      @group='Name'
      @keys=\{{array 'Quantity' 'Leads' 'Sold' 'Restocking' 'Misc'}}
      @values=\{{array 65000 29123 35213 51213 16932}}
    />
  &#x3C;/LineChart>
&#x3C;/template>
</code></pre></div>
</details>
<details open><summary>Pie Chart</summary>
<carbon-shadow-demo id="repl_12" class="repl-sdk__demo"><div><repl_12></repl_12></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { PieChart } from 'carbon-components-ember/components';
import { array } from '@ember/helper';
&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;PieChart
          style='height: 600px; width: 600px; display: inline-block'
          as |chart|
        >
          &#x3C;chart.Axis @axis='left' @title='2018 Annual Sales' />
          &#x3C;chart.Axis @axis='bottom' @title='Figures' @scaleType='labels' />
          &#x3C;chart.TabularData @group='Quantity' @values=\{{array 65000}} />
          &#x3C;chart.TabularData @group='Leads' @values=\{{array 29123}} />
          &#x3C;chart.TabularData @group='Sold' @values=\{{array 35213}} />
          &#x3C;chart.TabularData @group='Restocking' @values=\{{array 51213}} />
          &#x3C;chart.TabularData @group='Misc' @values=\{{array 16932}} />
    &#x3C;/PieChart>
&#x3C;/template>
</code></pre></div>
</details>
<details open><summary>Sinus Chart</summary>
<carbon-shadow-demo id="repl_13" class="repl-sdk__demo"><div><repl_13></repl_13></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { LineChart } from 'carbon-components-ember/components';
import { cell } from 'ember-resources';

const start = cell(0);
setInterval(() => {
  start.current += 1;
  if (start.current === 200) {
    start.current = 0;
  }
}, 1000);

function sinus() {
  const values = [];
  const s = (start.current * 2 * Math.PI) / 100;
  let c = 0;
  for (let i = s; i &#x3C; s + 2 * Math.PI; i += Math.PI / 50) {
    c++;
    values.push({
      date: c,
      value: Math.sin(i),
    });
  }
  return values
};

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;LineChart
      style='height: 600px; width: 600px; display: inline-block'
      as |chart|
    >
    &#x3C;chart.Axis @axis='left' @title='y' />
    &#x3C;chart.Axis @axis='bottom' @title='x' @scaleType='time' />
    &#x3C;chart.TabularData @group='sinus' @data=\{{(sinus)}} />
  &#x3C;/LineChart>
&#x3C;/template>
</code></pre></div>
</details>
<h2 id="api-reference">API Reference</h2>
<details><summary><h3>Bar Chart</h3></summary>
<div id="repl_14" class="repl-sdk__demo"><repl_14></repl_14></div>
</details>
<details><summary><h3>Line Chart</h3></summary>
<div id="repl_15" class="repl-sdk__demo"><repl_15></repl_15></div>
</details>
<details><summary><h3>Pie Chart</h3></summary>
<div id="repl_16" class="repl-sdk__demo"><repl_16></repl_16></div>
</details>
<details><summary><h3>Colour Pairing</h3></summary>
<div id="repl_17" class="repl-sdk__demo"><repl_17></repl_17></div>
</details>
*/
{
  "id": "8A0gHv13",
  "block": "[[[10,\"h1\"],[14,1,\"charts\"],[12],[1,\"Charts\"],[13],[1,\"\\n\"],[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"details\"],[14,\"open\",\"\"],[12],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Bar Chart\"],[13],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_10\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { BarChart } from 'carbon-components-ember/components';\\nimport { array } from '@ember/helper';\\n\\n<template>\\n    <ThemeSupport />\\n    <BarChart\\n        style='height: 600px; width: 600px; display: inline-block'\\n        as |chart|\\n    >\\n        <chart.Axis\\n            @axis='left'\\n            @title='2018 Annual Sales'\\n            @primary=\"],[1,\"{{true}}\\n        />\\n        <chart.Axis\\n            @axis='bottom'\\n            @title='Figures'\\n            @secondary=\"],[1,\"{{true}}\\n            @scaleType='labels'\\n        />\\n        <chart.TabularData\\n            @group='Name'\\n            @keys=\"],[1,\"{{array 'Quantity' 'Leads' 'Sold' 'Restocking' 'Misc'}}\\n            @values=\"],[1,\"{{array 65000 29123 35213 51213 16932}}\\n        />\\n    </BarChart>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[14,\"open\",\"\"],[12],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Line Chart\"],[13],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_11\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { LineChart } from 'carbon-components-ember/components';\\nimport { array } from '@ember/helper';\\n\\n<template>\\n  <ThemeSupport />\\n  <LineChart\\n    style='height: 600px; width: 600px; display: inline-block'\\n    as |chart|\\n  >\\n    <chart.Axis\\n      @axis='left'\\n      @title='2018 Annual Sales'\\n      @primary=\"],[1,\"{{true}}\\n    />\\n    <chart.Axis\\n      @axis='bottom'\\n      @title='Figures'\\n      @secondary=\"],[1,\"{{true}}\\n      @scaleType='labels'\\n    />\\n    <chart.TabularData\\n      @group='Name'\\n      @keys=\"],[1,\"{{array 'Quantity' 'Leads' 'Sold' 'Restocking' 'Misc'}}\\n      @values=\"],[1,\"{{array 65000 29123 35213 51213 16932}}\\n    />\\n  </LineChart>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[14,\"open\",\"\"],[12],[10,\"summary\"],[12],[1,\"Pie Chart\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_12\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { PieChart } from 'carbon-components-ember/components';\\nimport { array } from '@ember/helper';\\n<template>\\n    <ThemeSupport />\\n    <PieChart\\n          style='height: 600px; width: 600px; display: inline-block'\\n          as |chart|\\n        >\\n          <chart.Axis @axis='left' @title='2018 Annual Sales' />\\n          <chart.Axis @axis='bottom' @title='Figures' @scaleType='labels' />\\n          <chart.TabularData @group='Quantity' @values=\"],[1,\"{{array 65000}} />\\n          <chart.TabularData @group='Leads' @values=\"],[1,\"{{array 29123}} />\\n          <chart.TabularData @group='Sold' @values=\"],[1,\"{{array 35213}} />\\n          <chart.TabularData @group='Restocking' @values=\"],[1,\"{{array 51213}} />\\n          <chart.TabularData @group='Misc' @values=\"],[1,\"{{array 16932}} />\\n    </PieChart>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[14,\"open\",\"\"],[12],[10,\"summary\"],[12],[1,\"Sinus Chart\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_13\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { LineChart } from 'carbon-components-ember/components';\\nimport { cell } from 'ember-resources';\\n\\nconst start = cell(0);\\nsetInterval(() => {\\n  start.current += 1;\\n  if (start.current === 200) {\\n    start.current = 0;\\n  }\\n}, 1000);\\n\\nfunction sinus() {\\n  const values = [];\\n  const s = (start.current * 2 * Math.PI) / 100;\\n  let c = 0;\\n  for (let i = s; i < s + 2 * Math.PI; i += Math.PI / 50) {\\n    c++;\\n    values.push({\\n      date: c,\\n      value: Math.sin(i),\\n    });\\n  }\\n  return values\\n};\\n\\n<template>\\n  <ThemeSupport />\\n  <LineChart\\n      style='height: 600px; width: 600px; display: inline-block'\\n      as |chart|\\n    >\\n    <chart.Axis @axis='left' @title='y' />\\n    <chart.Axis @axis='bottom' @title='x' @scaleType='time' />\\n    <chart.TabularData @group='sinus' @data=\"],[1,\"{{(sinus)}} />\\n  </LineChart>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Bar Chart\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_14\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Line Chart\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_15\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,6],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Pie Chart\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_16\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,7],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Colour Pairing\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_17\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,8],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_10, repl_11, repl_12, repl_13, repl_14, repl_15, repl_16, repl_17],
  "isStrictMode": true
}), templateOnly(undefined, "charts.gjs"));

export { charts_gjs as default };

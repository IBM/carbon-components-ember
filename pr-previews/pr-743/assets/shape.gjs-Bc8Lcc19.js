import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aU as ShapeIndicator, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const kinds = ['failed', 'critical', 'high', 'medium', 'low', 'cautious', 'undefined', 'stable', 'informative', 'incomplete', 'draft'];
const repl_208 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
{{#each kinds as |kind|}}
  <div style="margin-bottom: .5rem;">
    <ShapeIndicator @kind={{kind}} @label={{kind}} />
  </div>
{{/each}}
*/
{
  "id": "H5ZQof2T",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[42,[28,[31,1],[[28,[31,1],[[32,1]],null]],null],null,[[[1,\"  \"],[10,0],[14,5,\"margin-bottom: .5rem;\"],[12],[1,\"\\n    \"],[8,[32,2],null,[[\"@kind\",\"@label\"],[[30,1],[30,1]]],null],[1,\"\\n  \"],[13],[1,\"\\n\"]],[1]],null]],[\"kind\"],[\"each\",\"-track-array\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, kinds, ShapeIndicator],
  "isStrictMode": true
}), templateOnly(undefined, "shape.gjs"));

const repl_209 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<div style="margin-bottom: .5rem;">
  <ShapeIndicator @kind="stable" @label="Stable" @textSize={{14}} />
</div>
*/
{
  "id": "Risy3AGG",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,0],[14,5,\"margin-bottom: .5rem;\"],[12],[1,\"\\n  \"],[8,[32,1],null,[[\"@kind\",\"@label\",\"@textSize\"],[\"stable\",\"Stable\",14]],null],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, ShapeIndicator],
  "isStrictMode": true
}), templateOnly(undefined, "shape.gjs"));

const repl_210 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<ShapeIndicator @kind="failed" @label="Failed" @compact={{true}} />
*/
{
  "id": "mRGJ75X1",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@kind\",\"@label\",\"@compact\"],[\"failed\",\"Failed\",true]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, ShapeIndicator],
  "isStrictMode": true
}), templateOnly(undefined, "shape.gjs"));

const repl_211 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/shape-indicator' 
  @name='default' 
/>
*/
{
  "id": "frkfrcs6",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/shape-indicator\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "shape.gjs"));

const shape_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="shape-indicator">ShapeIndicator</h1>
<p>Shape indicators can take the form of failed, critical, high, medium, low,
cautious, undefined, stable, informative, incomplete, and draft. They are
useful for conveying status where color alone would not be accessible.</p>
<carbon-shadow-demo id="repl_208" class="repl-sdk__demo"><div><repl_208></repl_208></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ShapeIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const kinds = [
  'failed',
  'critical',
  'high',
  'medium',
  'low',
  'cautious',
  'undefined',
  'stable',
  'informative',
  'incomplete',
  'draft',
];

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  \{{#each kinds as |kind|}}
    &#x3C;div style="margin-bottom: .5rem;">
      &#x3C;ShapeIndicator @kind=\{{kind}} @label=\{{kind}} />
    &#x3C;/div>
  \{{/each}}
&#x3C;/template>
</code></pre></div>
<h2 id="text-size">Text size</h2>
<p>Shape indicators have two text size options, 12 (default) and 14.</p>
<carbon-shadow-demo id="repl_209" class="repl-sdk__demo"><div><repl_209></repl_209></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ShapeIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;div style="margin-bottom: .5rem;">
    &#x3C;ShapeIndicator @kind="stable" @label="Stable" @textSize=\{{14}} />
  &#x3C;/div>
&#x3C;/template>
</code></pre></div>
<h2 id="compact-mode">Compact mode</h2>
<p>When the <code>@compact</code> argument is set to <code>true</code>, the shape indicator displays
only the shape, with the label shown in a tooltip on hover/focus.</p>
<carbon-shadow-demo id="repl_210" class="repl-sdk__demo"><div><repl_210></repl_210></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ShapeIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;ShapeIndicator @kind="failed" @label="Failed" @compact=\{{true}} />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>ShapeIndicator</h3></summary>
<div id="repl_211" class="repl-sdk__demo"><repl_211></repl_211></div>
</details>
*/
{
  "id": "x7T4fHMH",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"shape-indicator\"],[12],[1,\"ShapeIndicator\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Shape indicators can take the form of failed, critical, high, medium, low,\\ncautious, undefined, stable, informative, incomplete, and draft. They are\\nuseful for conveying status where color alone would not be accessible.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_208\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ShapeIndicator } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst kinds = [\\n  'failed',\\n  'critical',\\n  'high',\\n  'medium',\\n  'low',\\n  'cautious',\\n  'undefined',\\n  'stable',\\n  'informative',\\n  'incomplete',\\n  'draft',\\n];\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  \"],[1,\"{{#each kinds as |kind|}}\\n    <div style=\\\"margin-bottom: .5rem;\\\">\\n      <ShapeIndicator @kind=\"],[1,\"{{kind}} @label=\"],[1,\"{{kind}} />\\n    </div>\\n  \"],[1,\"{{/each}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"text-size\"],[12],[1,\"Text size\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Shape indicators have two text size options, 12 (default) and 14.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_209\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ShapeIndicator } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <div style=\\\"margin-bottom: .5rem;\\\">\\n    <ShapeIndicator @kind=\\\"stable\\\" @label=\\\"Stable\\\" @textSize=\"],[1,\"{{14}} />\\n  </div>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"compact-mode\"],[12],[1,\"Compact mode\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"When the \"],[10,\"code\"],[12],[1,\"@compact\"],[13],[1,\" argument is set to \"],[10,\"code\"],[12],[1,\"true\"],[13],[1,\", the shape indicator displays\\nonly the shape, with the label shown in a tooltip on hover/focus.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_210\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ShapeIndicator } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <ShapeIndicator @kind=\\\"failed\\\" @label=\\\"Failed\\\" @compact=\"],[1,\"{{true}} />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"ShapeIndicator\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_211\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_208, repl_209, repl_210, repl_211],
  "isStrictMode": true
}), templateOnly(undefined, "shape.gjs"));

export { shape_gjs as default };

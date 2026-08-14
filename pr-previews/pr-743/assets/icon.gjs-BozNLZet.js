import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aT as IconIndicator, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const kinds$1 = ['failed', 'caution-major', 'caution-minor', 'undefined', 'succeeded', 'normal', 'in-progress', 'incomplete', 'not-started', 'pending', 'unknown', 'informative'];
const repl_204 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
{{#each kinds as |kind|}}
  <div style="margin-bottom: .5rem;">
    <IconIndicator @kind={{kind}} @label={{kind}} />
  </div>
{{/each}}
*/
{
  "id": "H5ZQof2T",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[42,[28,[31,1],[[28,[31,1],[[32,1]],null]],null],null,[[[1,\"  \"],[10,0],[14,5,\"margin-bottom: .5rem;\"],[12],[1,\"\\n    \"],[8,[32,2],null,[[\"@kind\",\"@label\"],[[30,1],[30,1]]],null],[1,\"\\n  \"],[13],[1,\"\\n\"]],[1]],null]],[\"kind\"],[\"each\",\"-track-array\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, kinds$1, IconIndicator],
  "isStrictMode": true
}), templateOnly(undefined, "icon.gjs"));

const kinds = ['failed', 'caution-major', 'caution-minor', 'undefined', 'succeeded', 'normal', 'in-progress', 'incomplete', 'not-started', 'pending', 'unknown', 'informative'];
const repl_205 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
{{#each kinds as |kind|}}
  <div style="margin-bottom: .5rem;">
    <IconIndicator
      @kind={{kind}}
      @label={{kind}}
      @size={{20}}
      @align="top"
      @autoAlign={{true}}
    />
  </div>
{{/each}}
*/
{
  "id": "QQQuT4Zx",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[42,[28,[31,1],[[28,[31,1],[[32,1]],null]],null],null,[[[1,\"  \"],[10,0],[14,5,\"margin-bottom: .5rem;\"],[12],[1,\"\\n    \"],[8,[32,2],null,[[\"@kind\",\"@label\",\"@size\",\"@align\",\"@autoAlign\"],[[30,1],[30,1],20,\"top\",true]],null],[1,\"\\n  \"],[13],[1,\"\\n\"]],[1]],null]],[\"kind\"],[\"each\",\"-track-array\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, kinds, IconIndicator],
  "isStrictMode": true
}), templateOnly(undefined, "icon.gjs"));

const repl_206 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<IconIndicator @kind="failed" @label="Failed" @compact={{true}} />
*/
{
  "id": "mRGJ75X1",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@kind\",\"@label\",\"@compact\"],[\"failed\",\"Failed\",true]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, IconIndicator],
  "isStrictMode": true
}), templateOnly(undefined, "icon.gjs"));

const repl_207 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/icon-indicator' 
  @name='default' 
/>
*/
{
  "id": "XeUa4lUZ",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/icon-indicator\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "icon.gjs"));

const icon_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="icon-indicator">IconIndicator</h1>
<p>Icon indicators pair a status icon with a label to communicate the state of
an item. They support the kinds <code>failed</code>, <code>caution-major</code>, <code>caution-minor</code>,
<code>undefined</code>, <code>succeeded</code>, <code>normal</code>, <code>in-progress</code>, <code>incomplete</code>,
<code>not-started</code>, <code>pending</code>, <code>unknown</code>, and <code>informative</code>.</p>
<carbon-shadow-demo id="repl_204" class="repl-sdk__demo"><div><repl_204></repl_204></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { IconIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const kinds = [
  'failed',
  'caution-major',
  'caution-minor',
  'undefined',
  'succeeded',
  'normal',
  'in-progress',
  'incomplete',
  'not-started',
  'pending',
  'unknown',
  'informative',
];

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  \{{#each kinds as |kind|}}
    &#x3C;div style="margin-bottom: .5rem;">
      &#x3C;IconIndicator @kind=\{{kind}} @label=\{{kind}} />
    &#x3C;/div>
  \{{/each}}
&#x3C;/template>
</code></pre></div>
<h2 id="size-20-and-auto-align">Size 20 and auto-align</h2>
<p>Icon indicators have two size options, 16 (default) and 20. <code>@autoAlign</code> can
be used to keep the compact-mode tooltip within the viewport, flipping to the
opposite side when it would otherwise overflow.</p>
<carbon-shadow-demo id="repl_205" class="repl-sdk__demo"><div><repl_205></repl_205></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { IconIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const kinds = [
  'failed',
  'caution-major',
  'caution-minor',
  'undefined',
  'succeeded',
  'normal',
  'in-progress',
  'incomplete',
  'not-started',
  'pending',
  'unknown',
  'informative',
];

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  \{{#each kinds as |kind|}}
    &#x3C;div style="margin-bottom: .5rem;">
      &#x3C;IconIndicator
        @kind=\{{kind}}
        @label=\{{kind}}
        @size=\{{20}}
        @align="top"
        @autoAlign=\{{true}}
      />
    &#x3C;/div>
  \{{/each}}
&#x3C;/template>
</code></pre></div>
<h2 id="compact-mode">Compact mode</h2>
<p>When the <code>@compact</code> argument is set to <code>true</code>, the icon indicator displays
only the icon, with the label shown in a tooltip on hover/focus. Use
<code>@iconDescription</code> to provide a different accessible name than <code>@label</code>.</p>
<carbon-shadow-demo id="repl_206" class="repl-sdk__demo"><div><repl_206></repl_206></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { IconIndicator } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;IconIndicator @kind="failed" @label="Failed" @compact=\{{true}} />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>IconIndicator</h3></summary>
<div id="repl_207" class="repl-sdk__demo"><repl_207></repl_207></div>
</details>
*/
{
  "id": "iRbG11EK",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"icon-indicator\"],[12],[1,\"IconIndicator\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Icon indicators pair a status icon with a label to communicate the state of\\nan item. They support the kinds \"],[10,\"code\"],[12],[1,\"failed\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"caution-major\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"caution-minor\"],[13],[1,\",\\n\"],[10,\"code\"],[12],[1,\"undefined\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"succeeded\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"normal\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"in-progress\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"incomplete\"],[13],[1,\",\\n\"],[10,\"code\"],[12],[1,\"not-started\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"pending\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"unknown\"],[13],[1,\", and \"],[10,\"code\"],[12],[1,\"informative\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_204\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { IconIndicator } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst kinds = [\\n  'failed',\\n  'caution-major',\\n  'caution-minor',\\n  'undefined',\\n  'succeeded',\\n  'normal',\\n  'in-progress',\\n  'incomplete',\\n  'not-started',\\n  'pending',\\n  'unknown',\\n  'informative',\\n];\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  \"],[1,\"{{#each kinds as |kind|}}\\n    <div style=\\\"margin-bottom: .5rem;\\\">\\n      <IconIndicator @kind=\"],[1,\"{{kind}} @label=\"],[1,\"{{kind}} />\\n    </div>\\n  \"],[1,\"{{/each}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"size-20-and-auto-align\"],[12],[1,\"Size 20 and auto-align\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Icon indicators have two size options, 16 (default) and 20. \"],[10,\"code\"],[12],[1,\"@autoAlign\"],[13],[1,\" can\\nbe used to keep the compact-mode tooltip within the viewport, flipping to the\\nopposite side when it would otherwise overflow.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_205\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { IconIndicator } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst kinds = [\\n  'failed',\\n  'caution-major',\\n  'caution-minor',\\n  'undefined',\\n  'succeeded',\\n  'normal',\\n  'in-progress',\\n  'incomplete',\\n  'not-started',\\n  'pending',\\n  'unknown',\\n  'informative',\\n];\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  \"],[1,\"{{#each kinds as |kind|}}\\n    <div style=\\\"margin-bottom: .5rem;\\\">\\n      <IconIndicator\\n        @kind=\"],[1,\"{{kind}}\\n        @label=\"],[1,\"{{kind}}\\n        @size=\"],[1,\"{{20}}\\n        @align=\\\"top\\\"\\n        @autoAlign=\"],[1,\"{{true}}\\n      />\\n    </div>\\n  \"],[1,\"{{/each}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"compact-mode\"],[12],[1,\"Compact mode\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"When the \"],[10,\"code\"],[12],[1,\"@compact\"],[13],[1,\" argument is set to \"],[10,\"code\"],[12],[1,\"true\"],[13],[1,\", the icon indicator displays\\nonly the icon, with the label shown in a tooltip on hover/focus. Use\\n\"],[10,\"code\"],[12],[1,\"@iconDescription\"],[13],[1,\" to provide a different accessible name than \"],[10,\"code\"],[12],[1,\"@label\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_206\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { IconIndicator } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <IconIndicator @kind=\\\"failed\\\" @label=\\\"Failed\\\" @compact=\"],[1,\"{{true}} />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"IconIndicator\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_207\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_204, repl_205, repl_206, repl_207],
  "isStrictMode": true
}), templateOnly(undefined, "icon.gjs"));

export { icon_gjs as default };

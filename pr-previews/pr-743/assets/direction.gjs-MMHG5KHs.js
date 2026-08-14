import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, b8 as LayoutDirection, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_195 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<LayoutDirection @dir='rtl'>
  <p>مرحبا بالعالم</p>
</LayoutDirection>
*/
{
  "id": "hi4h3zu4",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@dir\"],[\"rtl\"]],[[\"default\"],[[[[1,\"\\n  \"],[10,2],[12],[1,\"مرحبا بالعالم\"],[13],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, LayoutDirection],
  "isStrictMode": true
}), templateOnly(undefined, "direction.gjs"));

const repl_196 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<LayoutDirection @as='span' @dir='ltr'>
  Hello world
</LayoutDirection>
*/
{
  "id": "jXiXdEE+",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@as\",\"@dir\"],[\"span\",\"ltr\"]],[[\"default\"],[[[[1,\"\\n  Hello world\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, LayoutDirection],
  "isStrictMode": true
}), templateOnly(undefined, "direction.gjs"));

const repl_197 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<LayoutDirection @dir='ltr'>
  <p>
    Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime
    ratione nobis voluptatibus facilis nostrum.
  </p>
  <LayoutDirection @dir='rtl'>
    <p>
      المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك
      التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.
    </p>
  </LayoutDirection>
  <p>
    Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime
    ratione nobis voluptatibus facilis nostrum.
  </p>
</LayoutDirection>
*/
{
  "id": "BBpTI216",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@dir\"],[\"ltr\"]],[[\"default\"],[[[[1,\"\\n  \"],[10,2],[12],[1,\"\\n    Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime\\n    ratione nobis voluptatibus facilis nostrum.\\n  \"],[13],[1,\"\\n  \"],[8,[32,1],null,[[\"@dir\"],[\"rtl\"]],[[\"default\"],[[[[1,\"\\n    \"],[10,2],[12],[1,\"\\n      المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك\\n      التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.\\n    \"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n  \"],[10,2],[12],[1,\"\\n    Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime\\n    ratione nobis voluptatibus facilis nostrum.\\n  \"],[13],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, LayoutDirection],
  "isStrictMode": true
}), templateOnly(undefined, "direction.gjs"));

const repl_198 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<LayoutDirection @dir='rtl' as |ctx|>
  <p>Current direction: {{ctx.dir}} ({{if ctx.isRTL 'RTL' 'LTR'}})</p>
</LayoutDirection>
*/
{
  "id": "grOhfVv9",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@dir\"],[\"rtl\"]],[[\"default\"],[[[[1,\"\\n  \"],[10,2],[12],[1,\"Current direction: \"],[1,[30,1,[\"dir\"]]],[1,\" (\"],[1,[52,[30,1,[\"isRTL\"]],\"RTL\",\"LTR\"]],[1,\")\"],[13],[1,\"\\n\"]],[1]]]]]],[\"ctx\"],[\"if\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, LayoutDirection],
  "isStrictMode": true
}), templateOnly(undefined, "direction.gjs"));

const repl_199 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/layout-direction'
  @name='default'
/>
*/
{
  "id": "rbklSaNv",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/layout-direction\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "direction.gjs"));

const direction_gjs = setComponentTemplate(templateFactory(
/*
  <h1 id="layout-direction">LayoutDirection</h1>
<ThemeSwitcher />
<p>The <code>LayoutDirection</code> component sets the reading direction (<code>ltr</code> or <code>rtl</code>)
for a part of the page. It renders a wrapper element with a <code>dir</code> attribute,
which the browser natively cascades to descendant elements. <code>LayoutDirection</code>
components can be nested to override the direction for a specific section of
content.</p>
<p>The block receives <code>dir</code> and <code>isRTL</code> so nested content can react to the
active direction, mirroring React's <code>useLayoutDirection</code> hook.</p>
<carbon-shadow-demo id="repl_195" class="repl-sdk__demo"><div><repl_195></repl_195></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { LayoutDirection } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;LayoutDirection @dir='rtl'>
    &#x3C;p>مرحبا بالعالم&#x3C;/p>
  &#x3C;/LayoutDirection>
&#x3C;/template>
</code></pre></div>
<h2 id="custom-element-type">Custom element type</h2>
<p>Use <code>@as</code> to change the element type used to render the wrapper (defaults to
<code>div</code>).</p>
<carbon-shadow-demo id="repl_196" class="repl-sdk__demo"><div><repl_196></repl_196></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { LayoutDirection } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;LayoutDirection @as='span' @dir='ltr'>
    Hello world
  &#x3C;/LayoutDirection>
&#x3C;/template>
</code></pre></div>
<h2 id="nesting">Nesting</h2>
<p>Nest <code>LayoutDirection</code> components to switch direction for part of a larger,
oppositely-directioned block of content.</p>
<carbon-shadow-demo id="repl_197" class="repl-sdk__demo"><div><repl_197></repl_197></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { LayoutDirection } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;LayoutDirection @dir='ltr'>
    &#x3C;p>
      Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime
      ratione nobis voluptatibus facilis nostrum.
    &#x3C;/p>
    &#x3C;LayoutDirection @dir='rtl'>
      &#x3C;p>
        المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك
        التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.
      &#x3C;/p>
    &#x3C;/LayoutDirection>
    &#x3C;p>
      Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime
      ratione nobis voluptatibus facilis nostrum.
    &#x3C;/p>
  &#x3C;/LayoutDirection>
&#x3C;/template>
</code></pre></div>
<h2 id="reading-the-current-direction">Reading the current direction</h2>
<carbon-shadow-demo id="repl_198" class="repl-sdk__demo"><div><repl_198></repl_198></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { LayoutDirection } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;LayoutDirection @dir='rtl' as |ctx|>
    &#x3C;p>Current direction: \{{ctx.dir}} (\{{if ctx.isRTL 'RTL' 'LTR'}})&#x3C;/p>
  &#x3C;/LayoutDirection>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>LayoutDirection</h3></summary>
<div id="repl_199" class="repl-sdk__demo"><repl_199></repl_199></div>
</details>
<h2 id="references">References</h2>
<ul>
<li><a href="https://react.carbondesignsystem.com/?path=/docs/components-layoutdirection--overview">Carbon Design System - LayoutDirection</a></li>
<li><a href="https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/LayoutDirection">Carbon React source</a></li>
</ul>
*/
{
  "id": "qcriwe9B",
  "block": "[[[10,\"h1\"],[14,1,\"layout-direction\"],[12],[1,\"LayoutDirection\"],[13],[1,\"\\n\"],[8,[32,0],null,null,null],[1,\"\\n\"],[10,2],[12],[1,\"The \"],[10,\"code\"],[12],[1,\"LayoutDirection\"],[13],[1,\" component sets the reading direction (\"],[10,\"code\"],[12],[1,\"ltr\"],[13],[1,\" or \"],[10,\"code\"],[12],[1,\"rtl\"],[13],[1,\")\\nfor a part of the page. It renders a wrapper element with a \"],[10,\"code\"],[12],[1,\"dir\"],[13],[1,\" attribute,\\nwhich the browser natively cascades to descendant elements. \"],[10,\"code\"],[12],[1,\"LayoutDirection\"],[13],[1,\"\\ncomponents can be nested to override the direction for a specific section of\\ncontent.\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"The block receives \"],[10,\"code\"],[12],[1,\"dir\"],[13],[1,\" and \"],[10,\"code\"],[12],[1,\"isRTL\"],[13],[1,\" so nested content can react to the\\nactive direction, mirroring React's \"],[10,\"code\"],[12],[1,\"useLayoutDirection\"],[13],[1,\" hook.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_195\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { LayoutDirection } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <LayoutDirection @dir='rtl'>\\n    <p>مرحبا بالعالم</p>\\n  </LayoutDirection>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"custom-element-type\"],[12],[1,\"Custom element type\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Use \"],[10,\"code\"],[12],[1,\"@as\"],[13],[1,\" to change the element type used to render the wrapper (defaults to\\n\"],[10,\"code\"],[12],[1,\"div\"],[13],[1,\").\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_196\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { LayoutDirection } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <LayoutDirection @as='span' @dir='ltr'>\\n    Hello world\\n  </LayoutDirection>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"nesting\"],[12],[1,\"Nesting\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Nest \"],[10,\"code\"],[12],[1,\"LayoutDirection\"],[13],[1,\" components to switch direction for part of a larger,\\noppositely-directioned block of content.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_197\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { LayoutDirection } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <LayoutDirection @dir='ltr'>\\n    <p>\\n      Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime\\n      ratione nobis voluptatibus facilis nostrum.\\n    </p>\\n    <LayoutDirection @dir='rtl'>\\n      <p>\\n        المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك\\n        التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.\\n      </p>\\n    </LayoutDirection>\\n    <p>\\n      Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime\\n      ratione nobis voluptatibus facilis nostrum.\\n    </p>\\n  </LayoutDirection>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"reading-the-current-direction\"],[12],[1,\"Reading the current direction\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_198\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { LayoutDirection } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <LayoutDirection @dir='rtl' as |ctx|>\\n    <p>Current direction: \"],[1,\"{{ctx.dir}} (\"],[1,\"{{if ctx.isRTL 'RTL' 'LTR'}})</p>\\n  </LayoutDirection>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"LayoutDirection\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_199\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"references\"],[12],[1,\"References\"],[13],[1,\"\\n\"],[10,\"ul\"],[12],[1,\"\\n\"],[10,\"li\"],[12],[10,3],[14,6,\"https://react.carbondesignsystem.com/?path=/docs/components-layoutdirection--overview\"],[12],[1,\"Carbon Design System - LayoutDirection\"],[13],[13],[1,\"\\n\"],[10,\"li\"],[12],[10,3],[14,6,\"https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/LayoutDirection\"],[12],[1,\"Carbon React source\"],[13],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_195, repl_196, repl_197, repl_198, repl_199],
  "isStrictMode": true
}), templateOnly(undefined, "direction.gjs"));

export { direction_gjs as default };

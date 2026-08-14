import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aR as Layout, am as TextInput, t as templateOnly, aS as LayoutConstraint, aM as hash, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_200 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Layout @size='sm' @density='condensed'>
  <TextInput @labelText='Label' @placeholder='Placeholder' />
</Layout>
*/
{
  "id": "ue6UzepC",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@size\",\"@density\"],[\"sm\",\"condensed\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[32,2],null,[[\"@labelText\",\"@placeholder\"],[\"Label\",\"Placeholder\"]],null],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Layout, TextInput],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

const repl_201 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<LayoutConstraint @size={{hash default='sm' min='sm' max='lg'}}>
  <TextInput @labelText='Label' @placeholder='Placeholder' />
</LayoutConstraint>
*/
{
  "id": "5kkBggQw",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@size\"],[[28,[32,2],null,[[\"default\",\"min\",\"max\"],[\"sm\",\"sm\",\"lg\"]]]]],[[\"default\"],[[[[1,\"\\n  \"],[8,[32,3],null,[[\"@labelText\",\"@placeholder\"],[\"Label\",\"Placeholder\"]],null],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, LayoutConstraint, hash, TextInput],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

const repl_202 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/layout'
  @name='default'
/>
*/
{
  "id": "Z4lEpE3C",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/layout\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

const repl_203 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/layout'
  @name='LayoutConstraint'
/>
*/
{
  "id": "hQ2XoFg1",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/layout\",\"LayoutConstraint\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

const index_gjs = setComponentTemplate(templateFactory(
/*
  <h1 id="layout">Layout</h1>
<ThemeSwitcher />
<p>The <code>Layout</code> component provides a way to set layout contexts for specific
parts of an application. It uses Carbon's experimental <code>layout</code> Sass module to
control layout-related settings like size and density for all components
rendered within it that support these options.</p>
<p>All children components that support it will react to the <code>size</code> and
<code>density</code> you pass to <code>Layout</code>. Note that not all components support the
entire spectrum of options available; in these cases a component will
typically cap out at the maximum or minimum size it supports. If a component
is outside of a layout context, or <code>size</code> / <code>density</code> isn't set, it falls back
to its default rendering.</p>
<carbon-shadow-demo id="repl_200" class="repl-sdk__demo"><div><repl_200></repl_200></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Layout } from 'carbon-components-ember/components';
import { TextInput } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Layout @size='sm' @density='condensed'>
    &#x3C;TextInput @labelText='Label' @placeholder='Placeholder' />
  &#x3C;/Layout>
&#x3C;/template>
</code></pre></div>
<h2 id="layout-constraint">LayoutConstraint</h2>
<p>In order to apply specific constraints to children components that might
differ from their own preference, the <code>LayoutConstraint</code> utility component
can be used. The constraints for a group (<code>size</code> and <code>density</code>) are passed as
an object with any of these keys: <code>min</code>, <code>default</code>, <code>max</code>.</p>
<carbon-shadow-demo id="repl_201" class="repl-sdk__demo"><div><repl_201></repl_201></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { LayoutConstraint } from 'carbon-components-ember/components';
import { TextInput } from 'carbon-components-ember/components';
import { hash } from '@ember/helper';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;LayoutConstraint @size=\{{hash default='sm' min='sm' max='lg'}}>
    &#x3C;TextInput @labelText='Label' @placeholder='Placeholder' />
  &#x3C;/LayoutConstraint>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Layout</h3></summary>
<div id="repl_202" class="repl-sdk__demo"><repl_202></repl_202></div>
</details>
<details>
<summary><h3>LayoutConstraint</h3></summary>
<div id="repl_203" class="repl-sdk__demo"><repl_203></repl_203></div>
</details>
*/
{
  "id": "vO94Fo9G",
  "block": "[[[10,\"h1\"],[14,1,\"layout\"],[12],[1,\"Layout\"],[13],[1,\"\\n\"],[8,[32,0],null,null,null],[1,\"\\n\"],[10,2],[12],[1,\"The \"],[10,\"code\"],[12],[1,\"Layout\"],[13],[1,\" component provides a way to set layout contexts for specific\\nparts of an application. It uses Carbon's experimental \"],[10,\"code\"],[12],[1,\"layout\"],[13],[1,\" Sass module to\\ncontrol layout-related settings like size and density for all components\\nrendered within it that support these options.\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"All children components that support it will react to the \"],[10,\"code\"],[12],[1,\"size\"],[13],[1,\" and\\n\"],[10,\"code\"],[12],[1,\"density\"],[13],[1,\" you pass to \"],[10,\"code\"],[12],[1,\"Layout\"],[13],[1,\". Note that not all components support the\\nentire spectrum of options available; in these cases a component will\\ntypically cap out at the maximum or minimum size it supports. If a component\\nis outside of a layout context, or \"],[10,\"code\"],[12],[1,\"size\"],[13],[1,\" / \"],[10,\"code\"],[12],[1,\"density\"],[13],[1,\" isn't set, it falls back\\nto its default rendering.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_200\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Layout } from 'carbon-components-ember/components';\\nimport { TextInput } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Layout @size='sm' @density='condensed'>\\n    <TextInput @labelText='Label' @placeholder='Placeholder' />\\n  </Layout>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"layout-constraint\"],[12],[1,\"LayoutConstraint\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"In order to apply specific constraints to children components that might\\ndiffer from their own preference, the \"],[10,\"code\"],[12],[1,\"LayoutConstraint\"],[13],[1,\" utility component\\ncan be used. The constraints for a group (\"],[10,\"code\"],[12],[1,\"size\"],[13],[1,\" and \"],[10,\"code\"],[12],[1,\"density\"],[13],[1,\") are passed as\\nan object with any of these keys: \"],[10,\"code\"],[12],[1,\"min\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"default\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"max\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_201\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { LayoutConstraint } from 'carbon-components-ember/components';\\nimport { TextInput } from 'carbon-components-ember/components';\\nimport { hash } from '@ember/helper';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <LayoutConstraint @size=\"],[1,\"{{hash default='sm' min='sm' max='lg'}}>\\n    <TextInput @labelText='Label' @placeholder='Placeholder' />\\n  </LayoutConstraint>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Layout\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_202\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"LayoutConstraint\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_203\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_200, repl_201, repl_202, repl_203],
  "isStrictMode": true
}), templateOnly(undefined, "index.gjs"));

export { index_gjs as default };

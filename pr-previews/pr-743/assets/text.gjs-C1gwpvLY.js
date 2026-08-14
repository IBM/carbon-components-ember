import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aC as Text, aD as TextDirection, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_108 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<p>
  <Text>Hello world</Text>
</p>
<p>
  <Text>لكن لا بد أن أوضح لك أن كل</Text>
</p>

<br />

<TextDirection @dir='rtl'>
  <Text @as='p'>
    المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك
    التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.
  </Text>
</TextDirection>
*/
{
  "id": "Tx51OhC/",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,2],[12],[1,\"\\n  \"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"Hello world\"]],[]]]]],[1,\"\\n\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"\\n  \"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"لكن لا بد أن أوضح لك أن كل\"]],[]]]]],[1,\"\\n\"],[13],[1,\"\\n\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,2],null,[[\"@dir\"],[\"rtl\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[32,1],null,[[\"@as\"],[\"p\"]],[[\"default\"],[[[[1,\"\\n    المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك\\n    التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.\\n  \"]],[]]]]],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Text, TextDirection],
  "isStrictMode": true
}), templateOnly(undefined, "text.gjs"));

const repl_109 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/text' 
  @name='default' 
/>
*/
{
  "id": "/Ib0rlJm",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/text\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "text.gjs"));

const repl_110 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/text-direction' 
  @name='default' 
/>
*/
{
  "id": "CK/QKD3X",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/text-direction\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "text.gjs"));

const text_gjs = setComponentTemplate(templateFactory(
/*
  <h1 id="text">Text</h1>
<ThemeSwitcher />
<p><code>Text</code> renders content wrapped in an element with the appropriate <code>dir</code>
attribute set, so that bidirectional text (mixing left-to-right and
right-to-left scripts) is displayed and aligned correctly.</p>
<p><code>TextDirection</code> sets a text direction for all of the content rendered inside
of it, which is useful for wrapping a subtree that should use a fixed or
auto-detected direction.</p>
<carbon-shadow-demo id="repl_108" class="repl-sdk__demo"><div><repl_108></repl_108></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Text, TextDirection } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;p>
    &#x3C;Text>Hello world&#x3C;/Text>
  &#x3C;/p>
  &#x3C;p>
    &#x3C;Text>لكن لا بد أن أوضح لك أن كل&#x3C;/Text>
  &#x3C;/p>

  &#x3C;br />

  &#x3C;TextDirection @dir='rtl'>
    &#x3C;Text @as='p'>
      المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك
      التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.
    &#x3C;/Text>
  &#x3C;/TextDirection>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Text</h3></summary>
<div id="repl_109" class="repl-sdk__demo"><repl_109></repl_109></div>
</details>
<details>
<summary><h3>TextDirection</h3></summary>
<div id="repl_110" class="repl-sdk__demo"><repl_110></repl_110></div>
</details>
*/
{
  "id": "A4LUXUhM",
  "block": "[[[10,\"h1\"],[14,1,\"text\"],[12],[1,\"Text\"],[13],[1,\"\\n\"],[8,[32,0],null,null,null],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"Text\"],[13],[1,\" renders content wrapped in an element with the appropriate \"],[10,\"code\"],[12],[1,\"dir\"],[13],[1,\"\\nattribute set, so that bidirectional text (mixing left-to-right and\\nright-to-left scripts) is displayed and aligned correctly.\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"TextDirection\"],[13],[1,\" sets a text direction for all of the content rendered inside\\nof it, which is useful for wrapping a subtree that should use a fixed or\\nauto-detected direction.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_108\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Text, TextDirection } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <p>\\n    <Text>Hello world</Text>\\n  </p>\\n  <p>\\n    <Text>لكن لا بد أن أوضح لك أن كل</Text>\\n  </p>\\n\\n  <br />\\n\\n  <TextDirection @dir='rtl'>\\n    <Text @as='p'>\\n      المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك\\n      التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.\\n    </Text>\\n  </TextDirection>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Text\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_109\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"TextDirection\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_110\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_108, repl_109, repl_110],
  "isStrictMode": true
}), templateOnly(undefined, "text.gjs"));

export { text_gjs as default };

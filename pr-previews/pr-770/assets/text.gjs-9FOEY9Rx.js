import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aF as Text, aG as TextDirection, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-DZin9OFc.js';

const repl_119 = setComponentTemplate(templateFactory(
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

const repl_120 = setComponentTemplate(templateFactory(
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

const repl_121 = setComponentTemplate(templateFactory(
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
<carbon-shadow-demo id="repl_119" class="repl-sdk__demo"><div><repl_119></repl_119></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { ThemeSupport } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'docs-support'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { Text, TextDirection } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'carbon-components-ember/components'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">ThemeSupport</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> /></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">br</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">Text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>Hello world&#x3C;/</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">Text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">Text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>لكن لا بد أن أوضح لك أن كل&#x3C;/</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">Text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">br</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> /></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">TextDirection</span><span style="--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">dir</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'rtl'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">Text</span><span style="--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'p'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;/</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">Text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">TextDirection</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Text</h3></summary>
<div id="repl_120" class="repl-sdk__demo"><repl_120></repl_120></div>
</details>
<details>
<summary><h3>TextDirection</h3></summary>
<div id="repl_121" class="repl-sdk__demo"><repl_121></repl_121></div>
</details>
*/
{
  "id": "1+oU05au",
  "block": "[[[10,\"h1\"],[14,1,\"text\"],[12],[1,\"Text\"],[13],[1,\"\\n\"],[8,[32,0],null,null,null],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"Text\"],[13],[1,\" renders content wrapped in an element with the appropriate \"],[10,\"code\"],[12],[1,\"dir\"],[13],[1,\"\\nattribute set, so that bidirectional text (mixing left-to-right and\\nright-to-left scripts) is displayed and aligned correctly.\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"TextDirection\"],[13],[1,\" sets a text direction for all of the content rendered inside\\nof it, which is useful for wrapping a subtree that should use a fixed or\\nauto-detected direction.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_119\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[14,0,\"shiki shiki-themes github-light github-dark\"],[14,5,\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\"],[14,\"tabindex\",\"0\"],[12],[10,\"code\"],[12],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"import\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" { ThemeSupport } \"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"from\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\" 'docs-support'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"import\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" { Text, TextDirection } \"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"from\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\" 'carbon-components-ember/components'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"<\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"template\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"ThemeSupport\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" />\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"br\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"p\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"    <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"Text\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">Hello world</\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"Text\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  </\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"p\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"p\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"    <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"Text\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">لكن لا بد أن أوضح لك أن كل</\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"Text\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  </\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"p\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"br\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" />\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"TextDirection\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic\"],[12],[1,\" @\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"dir\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"=\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"'rtl'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"    <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"Text\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic\"],[12],[1,\" @\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"as\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"=\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"'p'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"      المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"      التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"    </\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"Text\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  </\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"TextDirection\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"</\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"template\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Text\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_120\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"TextDirection\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_121\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_119, repl_120, repl_121],
  "isStrictMode": true
}), templateOnly(undefined, "text.gjs"));

export { text_gjs as default };

import { s as setComponentTemplate, i as templateFactory, Y as ThemeSwitcher, aV as Processing, t as templateOnly, a1 as ComponentSignature, a2 as ThemeSwitcher$1 } from './main-DD4_jcpP.js';

const repl_295 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<div style='display: flex; gap: 2rem;'>
  <Processing />
  <Processing @loop={{true}} />
  <Processing @quickLoad={{true}} />
</div>
*/
{
  "id": "shIdetpJ",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,0],[14,5,\"display: flex; gap: 2rem;\"],[12],[1,\"\\n  \"],[8,[32,1],null,null,null],[1,\"\\n  \"],[8,[32,1],null,[[\"@loop\"],[true]],null],[1,\"\\n  \"],[8,[32,1],null,[[\"@quickLoad\"],[true]],null],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Processing],
  "isStrictMode": true
}), templateOnly(undefined, "processing.gjs"));

const repl_296 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/ai-chat/processing'
  @name='default'
/>
*/
{
  "id": "Z91Vxwx2",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/ai-chat/processing\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "processing.gjs"));

const processing_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="processing">Processing</h1>
<p><code>Processing</code> renders a three-dot "processing"/"thinking" animation, used to
indicate an in-progress assistant response.</p>
<carbon-shadow-demo id="repl_295" class="repl-sdk__demo"><div><repl_295></repl_295></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { Processing } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'carbon-components-ember/components'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { ThemeSupport } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'docs-support'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">ThemeSupport</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> /></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> style</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'display: flex; gap: 2rem;'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">Processing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> /></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">Processing</span><span style="--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">loop</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">\{{</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF">true</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> /></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">Processing</span><span style="--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">quickLoad</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">\{{</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF">true</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> /></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Processing</h3></summary>
<div id="repl_296" class="repl-sdk__demo"><repl_296></repl_296></div>
</details>
*/
{
  "id": "VYGsZs+K",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"processing\"],[12],[1,\"Processing\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"Processing\"],[13],[1,\" renders a three-dot \\\"processing\\\"/\\\"thinking\\\" animation, used to\\nindicate an in-progress assistant response.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_295\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[14,0,\"shiki shiki-themes github-light github-dark\"],[14,5,\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\"],[14,\"tabindex\",\"0\"],[12],[10,\"code\"],[12],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"import\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" { Processing } \"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"from\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\" 'carbon-components-ember/components'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"import\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" { ThemeSupport } \"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"from\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\" 'docs-support'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"<\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"template\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"ThemeSupport\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" />\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"div\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\" style\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"=\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"'display: flex; gap: 2rem;'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"    <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"Processing\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" />\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"    <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"Processing\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic\"],[12],[1,\" @\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"loop\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"=\"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"{{\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#DBEDFF\"],[12],[1,\"true\"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"}}\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" />\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"    <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"Processing\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic\"],[12],[1,\" @\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"quickLoad\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"=\"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"{{\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#DBEDFF\"],[12],[1,\"true\"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"}}\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" />\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  </\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"div\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"</\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"template\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Processing\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_296\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_295, repl_296],
  "isStrictMode": true
}), templateOnly(undefined, "processing.gjs"));

export { processing_gjs as default };

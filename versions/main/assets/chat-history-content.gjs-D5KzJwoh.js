import { s as setComponentTemplate, i as templateFactory, Y as ThemeSwitcher, aO as ChatHistoryContent, t as templateOnly, a1 as ComponentSignature, a2 as ThemeSwitcher$1 } from './main-CP8t2Ac4.js';

const repl_279 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<div style='max-inline-size: 20rem; block-size: 8rem;'>
  <ChatHistoryContent @resultsCount={{3}}>
    <p style='padding-inline-start: 1rem;'>list content goes here</p>
  </ChatHistoryContent>
</div>
*/
{
  "id": "cvOtcruq",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,0],[14,5,\"max-inline-size: 20rem; block-size: 8rem;\"],[12],[1,\"\\n  \"],[8,[32,1],null,[[\"@resultsCount\"],[3]],[[\"default\"],[[[[1,\"\\n    \"],[10,2],[14,5,\"padding-inline-start: 1rem;\"],[12],[1,\"list content goes here\"],[13],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, ChatHistoryContent],
  "isStrictMode": true
}), templateOnly(undefined, "chat-history-content.gjs"));

const repl_280 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/ai-chat/chat-history-content'
  @name='default'
/>
*/
{
  "id": "5KXjMbaF",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/ai-chat/chat-history-content\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "chat-history-content.gjs"));

const chatHistoryContent_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="chat-history-content">ChatHistoryContent</h1>
<p>Scroll container for a <a href="./chat-history-panel.md"><code>ChatHistoryPanel</code></a> (or a
<a href="./chat-history-loading.md"><code>ChatHistoryLoading</code></a>), showing an optional
live-announced results count above the list.</p>
<carbon-shadow-demo id="repl_279" class="repl-sdk__demo"><div><repl_279></repl_279></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { ChatHistoryContent } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'carbon-components-ember/components'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { ThemeSupport } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'docs-support'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">ThemeSupport</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> /></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> style</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'max-inline-size: 20rem; block-size: 8rem;'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">ChatHistoryContent</span><span style="--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">resultsCount</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">\{{</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF">3</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">p</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> style</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'padding-inline-start: 1rem;'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>list content goes here&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;/</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">ChatHistoryContent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>ChatHistoryContent</h3></summary>
<div id="repl_280" class="repl-sdk__demo"><repl_280></repl_280></div>
</details>
*/
{
  "id": "2+YEfWJK",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"chat-history-content\"],[12],[1,\"ChatHistoryContent\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Scroll container for a \"],[10,3],[14,6,\"./chat-history-panel.md\"],[12],[10,\"code\"],[12],[1,\"ChatHistoryPanel\"],[13],[13],[1,\" (or a\\n\"],[10,3],[14,6,\"./chat-history-loading.md\"],[12],[10,\"code\"],[12],[1,\"ChatHistoryLoading\"],[13],[13],[1,\"), showing an optional\\nlive-announced results count above the list.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_279\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[14,0,\"shiki shiki-themes github-light github-dark\"],[14,5,\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\"],[14,\"tabindex\",\"0\"],[12],[10,\"code\"],[12],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"import\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" { ChatHistoryContent } \"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"from\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\" 'carbon-components-ember/components'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"import\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" { ThemeSupport } \"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"from\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\" 'docs-support'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"<\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"template\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"ThemeSupport\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" />\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"div\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\" style\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"=\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"'max-inline-size: 20rem; block-size: 8rem;'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"    <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"ChatHistoryContent\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic\"],[12],[1,\" @\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"resultsCount\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"=\"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"{{\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#DBEDFF\"],[12],[1,\"3\"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"}}\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"      <\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"p\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\" style\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"=\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"'padding-inline-start: 1rem;'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">list content goes here</\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"p\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"    </\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"ChatHistoryContent\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  </\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"div\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"</\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"template\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"ChatHistoryContent\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_280\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_279, repl_280],
  "isStrictMode": true
}), templateOnly(undefined, "chat-history-content.gjs"));

export { chatHistoryContent_gjs as default };

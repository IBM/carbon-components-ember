import { s as setComponentTemplate, i as templateFactory, Y as ThemeSwitcher, aK as AiChatMarkdown, t as templateOnly, a1 as ComponentSignature, a2 as ThemeSwitcher$1 } from './main-C29ju28T.js';

const sample = `# Markdown demo

Renders **CommonMark** with a few extensions: ==highlighted text==, GFM
task lists, and tables.

- [x] Parses markdown-it syntax
- [ ] Renders an interactive checklist (read-only in this port)

| Feature | Status |
| --- | --- |
| Tables | ✅ |
| Task lists | ✅ |
| Fenced code | ✅ |

\`\`\`js
const greet = (name) => \`Hello, \${name}!\`;
\`\`\`

Raw HTML in the source (e.g. \`<script>alert(1)</script>\`) is always
sanitized before rendering, even without \`@sanitizeHTML\`.
`;
const repl_269 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<Markdown @markdown={{sample}} />
*/
{
  "id": "sKCvEpV6",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@markdown\"],[[32,2]]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, AiChatMarkdown, sample],
  "isStrictMode": true
}), templateOnly(undefined, "markdown.gjs"));

const repl_270 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/ai-chat/markdown'
  @name='default'
/>
*/
{
  "id": "KzIs2D7m",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/ai-chat/markdown\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "markdown.gjs"));

const markdown_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="markdown">Markdown</h1>
<p><code>Markdown</code> parses <code>@markdown</code> with <code>markdown-it</code> (CommonMark, plus tables,
strikethrough, autolinking, GFM task lists, and <code>==highlight==</code> extended
syntax) and renders it as sanitized, Carbon-styled HTML. Unlike upstream's
<code>cds-aichat-markdown</code>, rendered HTML is <strong>always</strong> run through DOMPurify
before being injected, regardless of <code>@sanitizeHTML</code> — see the component's
class doc (<code>declarations/components/ai-chat/markdown</code>) for the full
reasoning. Set <code>@removeHTML=\{{true}}</code> to strip raw HTML from the source
entirely instead of just sanitizing it.</p>
<carbon-shadow-demo id="repl_269" class="repl-sdk__demo"><div><repl_269></repl_269></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { Markdown } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'carbon-components-ember/components'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { ThemeSupport } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'docs-support'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> sample</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> `# Markdown demo</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">Renders **CommonMark** with a few extensions: ==highlighted text==, GFM</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">task lists, and tables.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">- [x] Parses markdown-it syntax</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">- [ ] Renders an interactive checklist (read-only in this port)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">| Feature | Status |</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">| --- | --- |</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">| Tables | ✅ |</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">| Task lists | ✅ |</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">| Fenced code | ✅ |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\`\`\`</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">js</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">const greet = (name) => </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\`</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">Hello, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">{name}!</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\`</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\`\`\`</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">Raw HTML in the source (e.g. </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\`</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">&#x3C;script>alert(1)&#x3C;/script></span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\`</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">) is always</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">sanitized before rendering, even without </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\`</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">@sanitizeHTML</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\`</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">.</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">ThemeSupport</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> /></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">Markdown</span><span style="--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">markdown</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">\{{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">sample</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> /></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Markdown</h3></summary>
<div id="repl_270" class="repl-sdk__demo"><repl_270></repl_270></div>
</details>
*/
{
  "id": "LVzFEmKc",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"markdown\"],[12],[1,\"Markdown\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"Markdown\"],[13],[1,\" parses \"],[10,\"code\"],[12],[1,\"@markdown\"],[13],[1,\" with \"],[10,\"code\"],[12],[1,\"markdown-it\"],[13],[1,\" (CommonMark, plus tables,\\nstrikethrough, autolinking, GFM task lists, and \"],[10,\"code\"],[12],[1,\"==highlight==\"],[13],[1,\" extended\\nsyntax) and renders it as sanitized, Carbon-styled HTML. Unlike upstream's\\n\"],[10,\"code\"],[12],[1,\"cds-aichat-markdown\"],[13],[1,\", rendered HTML is \"],[10,\"strong\"],[12],[1,\"always\"],[13],[1,\" run through DOMPurify\\nbefore being injected, regardless of \"],[10,\"code\"],[12],[1,\"@sanitizeHTML\"],[13],[1,\" — see the component's\\nclass doc (\"],[10,\"code\"],[12],[1,\"declarations/components/ai-chat/markdown\"],[13],[1,\") for the full\\nreasoning. Set \"],[10,\"code\"],[12],[1,\"@removeHTML=\"],[1,\"{{true}}\"],[13],[1,\" to strip raw HTML from the source\\nentirely instead of just sanitizing it.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_269\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[14,0,\"shiki shiki-themes github-light github-dark\"],[14,5,\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\"],[14,\"tabindex\",\"0\"],[12],[10,\"code\"],[12],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"import\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" { Markdown } \"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"from\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\" 'carbon-components-ember/components'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"import\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" { ThemeSupport } \"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"from\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\" 'docs-support'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"const\"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\" sample\"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\" =\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\" `# Markdown demo\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"Renders **CommonMark** with a few extensions: ==highlighted text==, GFM\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"task lists, and tables.\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"- [x] Parses markdown-it syntax\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"- [ ] Renders an interactive checklist (read-only in this port)\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"| Feature | Status |\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"| --- | --- |\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"| Tables | ✅ |\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"| Task lists | ✅ |\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"| Fenced code | ✅ |\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\\\\`\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"js\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"const greet = (name) => \"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"Hello, \"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\$\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"{name}!\"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\\\\`\\\\`\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"Raw HTML in the source (e.g. \"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"<script>alert(1)</script>\"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\") is always\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"sanitized before rendering, even without \"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"@sanitizeHTML\"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\".\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"`\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"<\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"template\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"ThemeSupport\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" />\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"Markdown\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic\"],[12],[1,\" @\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"markdown\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"=\"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"{{\"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"sample\"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"}}\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" />\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"</\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"template\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Markdown\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_270\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_269, repl_270],
  "isStrictMode": true
}), templateOnly(undefined, "markdown.gjs"));

export { markdown_gjs as default };

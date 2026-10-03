import { c as templateFactory } from "./index-kwuZeaNz-Cy7yDahE.js";
import { n as setComponentTemplate } from "./template-Dc_cBOoX-MskviGdB.js";
import { Yn as AiChatMarkdown, _ as ThemeSwitcher, y as ThemeSwitcher$1 } from "./dist-B5zbKBdo.js";
import { t as templateOnly } from "./template-only-CiCtiipS.js";
import "./browser-DDUCC5ap.js";
import { i as ComponentSignature } from "./modifier-B5bTsLNB-BMXRJ0Hy.js";
//#region kolay/virtual:live:repl_163.gjs?from=/home/runner/work/carbon-components-ember/carbon-components-ember/docs-app/app/templates/2-components/ai-chat/markdown.gjs.md
var sample = `# Markdown demo

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

Raw HTML in the source (e.g. \`<script>alert(1)<\/script>\`) is always
sanitized before rendering, even without \`@sanitizeHTML\`.
`;
var markdown_gjs_default$2 = setComponentTemplate(templateFactory({
	"id": null,
	"block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@markdown\"],[[32,2]]],null]],[],[]]",
	"moduleName": "(unknown template module)",
	"scope": () => ({
		ThemeSupport: ThemeSwitcher,
		Markdown: AiChatMarkdown,
		sample
	}),
	"isStrictMode": true
}), templateOnly(void 0, "markdown.gjs"));
//#endregion
//#region kolay/virtual:live:repl_164.gjs?from=/home/runner/work/carbon-components-ember/carbon-components-ember/docs-app/app/templates/2-components/ai-chat/markdown.gjs.md
var markdown_gjs_default$1 = setComponentTemplate(templateFactory({
	"id": null,
	"block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/ai-chat/markdown\",\"default\"]],null]],[],[]]",
	"moduleName": "(unknown template module)",
	"scope": () => ({ ComponentSignature }),
	"isStrictMode": true
}), templateOnly(void 0, "markdown.gjs"));
//#endregion
//#region app/templates/2-components/ai-chat/markdown.gjs.md
var markdown_gjs_default = setComponentTemplate(templateFactory({
	"id": null,
	"block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"markdown\"],[12],[1,\"Markdown\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"Markdown\"],[13],[1,\" parses \"],[10,\"code\"],[12],[1,\"@markdown\"],[13],[1,\" with \"],[10,\"code\"],[12],[1,\"markdown-it\"],[13],[1,\" (CommonMark, plus tables,\\nstrikethrough, autolinking, GFM task lists, and \"],[10,\"code\"],[12],[1,\"==highlight==\"],[13],[1,\" extended\\nsyntax) and renders it as sanitized, Carbon-styled HTML. Unlike upstream's\\n\"],[10,\"code\"],[12],[1,\"cds-aichat-markdown\"],[13],[1,\", rendered HTML is \"],[10,\"strong\"],[12],[1,\"always\"],[13],[1,\" run through DOMPurify\\nbefore being injected, regardless of \"],[10,\"code\"],[12],[1,\"@sanitizeHTML\"],[13],[1,\" — see the component's\\nclass doc (\"],[10,\"code\"],[12],[1,\"declarations/components/ai-chat/markdown\"],[13],[1,\") for the full\\nreasoning. Set \"],[10,\"code\"],[12],[1,\"@removeHTML=\"],[1,\"{{true}}\"],[13],[1,\" to strip raw HTML from the source\\nentirely instead of just sanitizing it.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_163\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[14,0,\"shiki shiki-themes github-light github-dark\"],[14,5,\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\"],[14,\"tabindex\",\"0\"],[12],[10,\"code\"],[12],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"import\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" { Markdown } \"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"from\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\" 'carbon-components-ember/components'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"import\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" { ThemeSupport } \"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"from\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\" 'docs-support'\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"const\"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\" sample\"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\" =\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\" `# Markdown demo\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"Renders **CommonMark** with a few extensions: ==highlighted text==, GFM\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"task lists, and tables.\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"- [x] Parses markdown-it syntax\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"- [ ] Renders an interactive checklist (read-only in this port)\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"| Feature | Status |\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"| --- | --- |\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"| Tables | ✅ |\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"| Task lists | ✅ |\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"| Fenced code | ✅ |\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\\\\`\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"js\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"const greet = (name) => \"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"Hello, \"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\$\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"{name}!\"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\\\\`\\\\`\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"Raw HTML in the source (e.g. \"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"<script>alert(1)<\/script>\"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\") is always\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"sanitized before rendering, even without \"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"@sanitizeHTML\"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"\\\\`\"],[13],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\".\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"],[12],[1,\"`\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\";\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"<\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"template\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"ThemeSupport\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" />\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"  <\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"Markdown\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-light-font-style:italic;--shiki-dark:#E1E4E8;--shiki-dark-font-style:italic\"],[12],[1,\" @\"],[13],[10,1],[14,5,\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"],[12],[1,\"markdown\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"=\"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"{{\"],[13],[10,1],[14,5,\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"],[12],[1,\"sample\"],[13],[10,1],[14,5,\"--shiki-light:#D73A49;--shiki-dark:#F97583\"],[12],[1,\"}}\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\" />\"],[13],[13],[1,\"\\n\"],[10,1],[14,0,\"line\"],[12],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\"</\"],[13],[10,1],[14,5,\"--shiki-light:#22863A;--shiki-dark:#85E89D\"],[12],[1,\"template\"],[13],[10,1],[14,5,\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"],[12],[1,\">\"],[13],[13],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Markdown\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_164\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
	"moduleName": "(unknown template module)",
	"scope": () => ({
		ThemeSwitcher: ThemeSwitcher$1,
		repl_163: markdown_gjs_default$2,
		repl_164: markdown_gjs_default$1
	}),
	"isStrictMode": true
}), templateOnly(void 0, "markdown.gjs"));
//#endregion
export { markdown_gjs_default as default };

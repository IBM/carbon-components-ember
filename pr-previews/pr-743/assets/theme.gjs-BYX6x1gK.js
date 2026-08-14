import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aE as Theme, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_111 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<Theme @theme='g100'>
  <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
    g100
  </section>
</Theme>
<Theme @theme='g90'>
  <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
    g90
  </section>
</Theme>
<Theme @theme='g10'>
  <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
    g10
  </section>
</Theme>
<Theme @theme='white'>
  <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
    white
  </section>
</Theme>
*/
{
  "id": "2hyMuVPE",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@theme\"],[\"g100\"]],[[\"default\"],[[[[1,\"\\n  \"],[10,\"section\"],[14,5,\"background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem\"],[12],[1,\"\\n    g100\\n  \"],[13],[1,\"\\n\"]],[]]]]],[1,\"\\n\"],[8,[32,1],null,[[\"@theme\"],[\"g90\"]],[[\"default\"],[[[[1,\"\\n  \"],[10,\"section\"],[14,5,\"background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem\"],[12],[1,\"\\n    g90\\n  \"],[13],[1,\"\\n\"]],[]]]]],[1,\"\\n\"],[8,[32,1],null,[[\"@theme\"],[\"g10\"]],[[\"default\"],[[[[1,\"\\n  \"],[10,\"section\"],[14,5,\"background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem\"],[12],[1,\"\\n    g10\\n  \"],[13],[1,\"\\n\"]],[]]]]],[1,\"\\n\"],[8,[32,1],null,[[\"@theme\"],[\"white\"]],[[\"default\"],[[[[1,\"\\n  \"],[10,\"section\"],[14,5,\"background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem\"],[12],[1,\"\\n    white\\n  \"],[13],[1,\"\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Theme],
  "isStrictMode": true
}), templateOnly(undefined, "theme.gjs"));

const repl_112 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<Theme @theme='g90' as |ctx|>
  <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
    Current theme: {{ctx.theme}} ({{if ctx.isDark 'dark' 'light'}})
  </section>
</Theme>
*/
{
  "id": "MJHYshJO",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@theme\"],[\"g90\"]],[[\"default\"],[[[[1,\"\\n  \"],[10,\"section\"],[14,5,\"background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem\"],[12],[1,\"\\n    Current theme: \"],[1,[30,1,[\"theme\"]]],[1,\" (\"],[1,[52,[30,1,[\"isDark\"]],\"dark\",\"light\"]],[1,\")\\n  \"],[13],[1,\"\\n\"]],[1]]]]]],[\"ctx\"],[\"if\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Theme],
  "isStrictMode": true
}), templateOnly(undefined, "theme.gjs"));

const repl_113 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/theme' 
  @name='default' 
/>
*/
{
  "id": "KUS7lyKu",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/theme\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "theme.gjs"));

const theme_gjs = setComponentTemplate(templateFactory(
/*
  <h1 id="theme">Theme</h1>
<ThemeSwitcher />
<p>The Theme component applies one of the Carbon themes (<code>white</code>, <code>g10</code>,
<code>g90</code>, <code>g100</code>) to a section of your page. It renders a wrapper element
with the corresponding Carbon zone class, which re-emits the theme's CSS
custom properties scoped to that element — everything inside picks up the
selected theme's tokens.</p>
<p>The block receives <code>theme</code> and <code>isDark</code> so nested content can react to
the active theme, mirroring React's <code>useTheme</code> hook.</p>
<carbon-shadow-demo id="repl_111" class="repl-sdk__demo"><div><repl_111></repl_111></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Theme } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;Theme @theme='g100'>
    &#x3C;section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
      g100
    &#x3C;/section>
  &#x3C;/Theme>
  &#x3C;Theme @theme='g90'>
    &#x3C;section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
      g90
    &#x3C;/section>
  &#x3C;/Theme>
  &#x3C;Theme @theme='g10'>
    &#x3C;section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
      g10
    &#x3C;/section>
  &#x3C;/Theme>
  &#x3C;Theme @theme='white'>
    &#x3C;section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
      white
    &#x3C;/section>
  &#x3C;/Theme>
&#x3C;/template>
</code></pre></div>
<h2 id="reading-the-current-theme">Reading the current theme</h2>
<carbon-shadow-demo id="repl_112" class="repl-sdk__demo"><div><repl_112></repl_112></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { ThemeSupport } from 'docs-support';
import { Theme } from 'carbon-components-ember/components';
&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;Theme @theme='g90' as |ctx|>
    &#x3C;section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>
      Current theme: \{{ctx.theme}} (\{{if ctx.isDark 'dark' 'light'}})
    &#x3C;/section>
  &#x3C;/Theme>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Theme</h3></summary>
<div id="repl_113" class="repl-sdk__demo"><repl_113></repl_113></div>
</details>
*/
{
  "id": "G6Jb/qRN",
  "block": "[[[10,\"h1\"],[14,1,\"theme\"],[12],[1,\"Theme\"],[13],[1,\"\\n\"],[8,[32,0],null,null,null],[1,\"\\n\"],[10,2],[12],[1,\"The Theme component applies one of the Carbon themes (\"],[10,\"code\"],[12],[1,\"white\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"g10\"],[13],[1,\",\\n\"],[10,\"code\"],[12],[1,\"g90\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"g100\"],[13],[1,\") to a section of your page. It renders a wrapper element\\nwith the corresponding Carbon zone class, which re-emits the theme's CSS\\ncustom properties scoped to that element — everything inside picks up the\\nselected theme's tokens.\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"The block receives \"],[10,\"code\"],[12],[1,\"theme\"],[13],[1,\" and \"],[10,\"code\"],[12],[1,\"isDark\"],[13],[1,\" so nested content can react to\\nthe active theme, mirroring React's \"],[10,\"code\"],[12],[1,\"useTheme\"],[13],[1,\" hook.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_111\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Theme } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <Theme @theme='g100'>\\n    <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>\\n      g100\\n    </section>\\n  </Theme>\\n  <Theme @theme='g90'>\\n    <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>\\n      g90\\n    </section>\\n  </Theme>\\n  <Theme @theme='g10'>\\n    <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>\\n      g10\\n    </section>\\n  </Theme>\\n  <Theme @theme='white'>\\n    <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>\\n      white\\n    </section>\\n  </Theme>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"reading-the-current-theme\"],[12],[1,\"Reading the current theme\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_112\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { ThemeSupport } from 'docs-support';\\nimport { Theme } from 'carbon-components-ember/components';\\n<template>\\n  <ThemeSupport />\\n  <Theme @theme='g90' as |ctx|>\\n    <section style='background: var(--cds-background); color: var(--cds-text-primary); padding: 1rem'>\\n      Current theme: \"],[1,\"{{ctx.theme}} (\"],[1,\"{{if ctx.isDark 'dark' 'light'}})\\n    </section>\\n  </Theme>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Theme\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_113\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_111, repl_112, repl_113],
  "isStrictMode": true
}), templateOnly(undefined, "theme.gjs"));

export { theme_gjs as default };

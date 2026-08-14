import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, ab as Link, ac as Add, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_48 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<Link @href="https://www.carbondesignsystem.com">Link</Link>
<br />
<br />
<Link @href="https://www.carbondesignsystem.com" @size="sm">Small link</Link>
<br />
<br />
<Link @href="https://www.carbondesignsystem.com" @size="lg">Large link</Link>
<br />
<br />
<Link @href="https://www.carbondesignsystem.com" @visited={{true}}>Visited link</Link>
<br />
<br />
<Link @href="https://www.carbondesignsystem.com" @disabled={{true}}>Disabled link</Link>
<br />
<br />
<Link @href="https://www.carbondesignsystem.com" @renderIcon={{Add}}>Link with icon</Link>
<br />
<br />
<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  <Link @href="https://www.carbondesignsystem.com" @inline={{true}}>Inline link</Link>
  is used within a paragraph of text.
</p>
*/
{
  "id": "S//O+1d9",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@href\"],[\"https://www.carbondesignsystem.com\"]],[[\"default\"],[[[[1,\"Link\"]],[]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@href\",\"@size\"],[\"https://www.carbondesignsystem.com\",\"sm\"]],[[\"default\"],[[[[1,\"Small link\"]],[]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@href\",\"@size\"],[\"https://www.carbondesignsystem.com\",\"lg\"]],[[\"default\"],[[[[1,\"Large link\"]],[]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@href\",\"@visited\"],[\"https://www.carbondesignsystem.com\",true]],[[\"default\"],[[[[1,\"Visited link\"]],[]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@href\",\"@disabled\"],[\"https://www.carbondesignsystem.com\",true]],[[\"default\"],[[[[1,\"Disabled link\"]],[]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@href\",\"@renderIcon\"],[\"https://www.carbondesignsystem.com\",[32,2]]],[[\"default\"],[[[[1,\"Link with icon\"]],[]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[10,2],[12],[1,\"\\n  Lorem ipsum dolor sit amet, consectetur adipiscing elit.\\n  \"],[8,[32,1],null,[[\"@href\",\"@inline\"],[\"https://www.carbondesignsystem.com\",true]],[[\"default\"],[[[[1,\"Inline link\"]],[]]]]],[1,\"\\n  is used within a paragraph of text.\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, Link, Add],
  "isStrictMode": true
}), templateOnly(undefined, "link.gjs"));

const repl_49 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/link'
  @name='default'
/>
*/
{
  "id": "6mTwVF0k",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/link\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "link.gjs"));

const link_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="link">Link</h1>
<p>Links are used as navigational elements. They may be used on their own, within
a sentence or paragraph, or directly following the content they are relevant to.</p>
<carbon-shadow-demo id="repl_48" class="repl-sdk__demo"><div><repl_48></repl_48></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Link } from 'carbon-components-ember/components';
import { Add } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;Link @href="https://www.carbondesignsystem.com">Link&#x3C;/Link>
    &#x3C;br />
    &#x3C;br />
    &#x3C;Link @href="https://www.carbondesignsystem.com" @size="sm">Small link&#x3C;/Link>
    &#x3C;br />
    &#x3C;br />
    &#x3C;Link @href="https://www.carbondesignsystem.com" @size="lg">Large link&#x3C;/Link>
    &#x3C;br />
    &#x3C;br />
    &#x3C;Link @href="https://www.carbondesignsystem.com" @visited=\{{true}}>Visited link&#x3C;/Link>
    &#x3C;br />
    &#x3C;br />
    &#x3C;Link @href="https://www.carbondesignsystem.com" @disabled=\{{true}}>Disabled link&#x3C;/Link>
    &#x3C;br />
    &#x3C;br />
    &#x3C;Link @href="https://www.carbondesignsystem.com" @renderIcon=\{{Add}}>Link with icon&#x3C;/Link>
    &#x3C;br />
    &#x3C;br />
    &#x3C;p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      &#x3C;Link @href="https://www.carbondesignsystem.com" @inline=\{{true}}>Inline link&#x3C;/Link>
      is used within a paragraph of text.
    &#x3C;/p>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Link</h3></summary>
<div id="repl_49" class="repl-sdk__demo"><repl_49></repl_49></div>
</details>
*/
{
  "id": "xT4NTjQp",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"link\"],[12],[1,\"Link\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Links are used as navigational elements. They may be used on their own, within\\na sentence or paragraph, or directly following the content they are relevant to.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_48\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Link } from 'carbon-components-ember/components';\\nimport { Add } from 'carbon-components-ember/icons';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <Link @href=\\\"https://www.carbondesignsystem.com\\\">Link</Link>\\n    <br />\\n    <br />\\n    <Link @href=\\\"https://www.carbondesignsystem.com\\\" @size=\\\"sm\\\">Small link</Link>\\n    <br />\\n    <br />\\n    <Link @href=\\\"https://www.carbondesignsystem.com\\\" @size=\\\"lg\\\">Large link</Link>\\n    <br />\\n    <br />\\n    <Link @href=\\\"https://www.carbondesignsystem.com\\\" @visited=\"],[1,\"{{true}}>Visited link</Link>\\n    <br />\\n    <br />\\n    <Link @href=\\\"https://www.carbondesignsystem.com\\\" @disabled=\"],[1,\"{{true}}>Disabled link</Link>\\n    <br />\\n    <br />\\n    <Link @href=\\\"https://www.carbondesignsystem.com\\\" @renderIcon=\"],[1,\"{{Add}}>Link with icon</Link>\\n    <br />\\n    <br />\\n    <p>\\n      Lorem ipsum dolor sit amet, consectetur adipiscing elit.\\n      <Link @href=\\\"https://www.carbondesignsystem.com\\\" @inline=\"],[1,\"{{true}}>Inline link</Link>\\n      is used within a paragraph of text.\\n    </p>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Link\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_49\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_48, repl_49],
  "isStrictMode": true
}), templateOnly(undefined, "link.gjs"));

export { link_gjs as default };

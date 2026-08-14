import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, as as TagComponent, t as templateOnly, af as trackedObject, bd as Asleep, ac as Add, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const context = trackedObject({
  types: ['red', 'magenta', 'purple', 'blue', 'cyan', 'teal', 'green', 'gray', 'cool-gray', 'warm-gray', 'high-contrast', 'outline']
});
const repl_97 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
  {{#each context.types as |type|}}
    <Tag @type={{type}}>
      {{type}}
    </Tag>
    <Tag @type={{type}}>
      {{type}}
    </Tag>
  {{/each}}
*/
{
  "id": "aC7Ziwsf",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[42,[28,[31,1],[[28,[31,1],[[32,1,[\"types\"]]],null]],null],null,[[[1,\"    \"],[8,[32,2],null,[[\"@type\"],[[30,1]]],[[\"default\"],[[[[1,\"\\n      \"],[1,[30,1]],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[32,2],null,[[\"@type\"],[[30,1]]],[[\"default\"],[[[[1,\"\\n      \"],[1,[30,1]],[1,\"\\n    \"]],[]]]]],[1,\"\\n\"]],[1]],null]],[\"type\"],[\"each\",\"-track-array\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, context, TagComponent],
  "isStrictMode": true
}), templateOnly(undefined, "tags.gjs"));

const repl_98 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Tag @type='blue' @size='sm'>Small</Tag>
<Tag @type='blue' @size='md'>Medium</Tag>
<Tag @type='blue' @size='lg'>Large</Tag>
*/
{
  "id": "12ECXXKd",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@type\",\"@size\"],[\"blue\",\"sm\"]],[[\"default\"],[[[[1,\"Small\"]],[]]]]],[1,\"\\n\"],[8,[32,1],null,[[\"@type\",\"@size\"],[\"blue\",\"md\"]],[[\"default\"],[[[[1,\"Medium\"]],[]]]]],[1,\"\\n\"],[8,[32,1],null,[[\"@type\",\"@size\"],[\"blue\",\"lg\"]],[[\"default\"],[[[[1,\"Large\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TagComponent],
  "isStrictMode": true
}), templateOnly(undefined, "tags.gjs"));

const repl_99 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Tag @type='blue' @disabled={{true}}>Disabled</Tag>
*/
{
  "id": "R6YqwHde",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@type\",\"@disabled\"],[\"blue\",true]],[[\"default\"],[[[[1,\"Disabled\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TagComponent],
  "isStrictMode": true
}), templateOnly(undefined, "tags.gjs"));

const repl_100 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Tag @type='blue' @renderIcon={{Asleep}}>With icon</Tag>
*/
{
  "id": "dubndBWT",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@type\",\"@renderIcon\"],[\"blue\",[32,2]]],[[\"default\"],[[[[1,\"With icon\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TagComponent, Asleep],
  "isStrictMode": true
}), templateOnly(undefined, "tags.gjs"));

const repl_101 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Tag
  @type='red'
  @renderIcon={{Add}}
  @decorator={{component Add size='16'}}
>With decorator</Tag>
*/
{
  "id": "aID7Q8x4",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@type\",\"@renderIcon\",\"@decorator\"],[\"red\",[32,2],[50,[32,2],0,null,[[\"size\"],[\"16\"]]]]],[[\"default\"],[[[[1,\"With decorator\"]],[]]]]]],[],[\"component\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TagComponent, Add],
  "isStrictMode": true
}), templateOnly(undefined, "tags.gjs"));

const repl_102 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/tag' 
  @name='default' 
/>
*/
{
  "id": "v4cfptlU",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/tag\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "tags.gjs"));

const tags_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="tags">Tags</h1>
<carbon-shadow-demo id="repl_97" class="repl-sdk__demo"><div><repl_97></repl_97></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Tag } from 'carbon-components-ember/components';
import { trackedObject } from '@ember/reactive/collections';
import { ThemeSupport } from 'docs-support';

const context = trackedObject({
  types: [
    'red',
    'magenta',
    'purple',
    'blue',
    'cyan',
    'teal',
    'green',
    'gray',
    'cool-gray',
    'warm-gray',
    'high-contrast',
    'outline',
  ]
});

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
      \{{#each context.types as |type|}}
        &#x3C;Tag @type=\{{type}}>
          \{{type}}
        &#x3C;/Tag>
        &#x3C;Tag @type=\{{type}}>
          \{{type}}
        &#x3C;/Tag>
      \{{/each}}
&#x3C;/template>
</code></pre></div>
<h2 id="sizes">Sizes</h2>
<p><code>@size</code> supports <code>sm</code>, <code>md</code> (default) or <code>lg</code>.</p>
<carbon-shadow-demo id="repl_98" class="repl-sdk__demo"><div><repl_98></repl_98></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Tag } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Tag @type='blue' @size='sm'>Small&#x3C;/Tag>
  &#x3C;Tag @type='blue' @size='md'>Medium&#x3C;/Tag>
  &#x3C;Tag @type='blue' @size='lg'>Large&#x3C;/Tag>
&#x3C;/template>
</code></pre></div>
<h2 id="disabled">Disabled</h2>
<carbon-shadow-demo id="repl_99" class="repl-sdk__demo"><div><repl_99></repl_99></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Tag } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Tag @type='blue' @disabled=\{{true}}>Disabled&#x3C;/Tag>
&#x3C;/template>
</code></pre></div>
<h2 id="with-icon">With icon</h2>
<p>Provide a <code>@renderIcon</code> component to render an icon inside the tag. The icon
is hidden for the <code>sm</code> size.</p>
<carbon-shadow-demo id="repl_100" class="repl-sdk__demo"><div><repl_100></repl_100></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Tag } from 'carbon-components-ember/components';
import { Asleep } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Tag @type='blue' @renderIcon=\{{Asleep}}>With icon&#x3C;/Tag>
&#x3C;/template>
</code></pre></div>
<h2 id="with-decorator">With decorator</h2>
<p><strong>Experimental:</strong> Provide a <code>@decorator</code> (or the deprecated <code>@slug</code>) component
to render inside the Tag, such as an AILabel once it's available (see
<a href="https://github.com/IBM/carbon-components-ember/issues/406">AILabel #406</a>).
In the meantime, any component can be used as a placeholder.</p>
<carbon-shadow-demo id="repl_101" class="repl-sdk__demo"><div><repl_101></repl_101></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Tag } from 'carbon-components-ember/components';
import { Add } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br>
  &#x3C;Tag
    @type='red'
    @renderIcon=\{{Add}}
    @decorator=\{{component Add size='16'}}
  >With decorator&#x3C;/Tag>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Tag</h3></summary>
<div id="repl_102" class="repl-sdk__demo"><repl_102></repl_102></div>
</details>
*/
{
  "id": "snXzvAI4",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"tags\"],[12],[1,\"Tags\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_97\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Tag } from 'carbon-components-ember/components';\\nimport { trackedObject } from '@ember/reactive/collections';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst context = trackedObject({\\n  types: [\\n    'red',\\n    'magenta',\\n    'purple',\\n    'blue',\\n    'cyan',\\n    'teal',\\n    'green',\\n    'gray',\\n    'cool-gray',\\n    'warm-gray',\\n    'high-contrast',\\n    'outline',\\n  ]\\n});\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n      \"],[1,\"{{#each context.types as |type|}}\\n        <Tag @type=\"],[1,\"{{type}}>\\n          \"],[1,\"{{type}}\\n        </Tag>\\n        <Tag @type=\"],[1,\"{{type}}>\\n          \"],[1,\"{{type}}\\n        </Tag>\\n      \"],[1,\"{{/each}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"sizes\"],[12],[1,\"Sizes\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"@size\"],[13],[1,\" supports \"],[10,\"code\"],[12],[1,\"sm\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"md\"],[13],[1,\" (default) or \"],[10,\"code\"],[12],[1,\"lg\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_98\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Tag } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Tag @type='blue' @size='sm'>Small</Tag>\\n  <Tag @type='blue' @size='md'>Medium</Tag>\\n  <Tag @type='blue' @size='lg'>Large</Tag>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"disabled\"],[12],[1,\"Disabled\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_99\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Tag } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Tag @type='blue' @disabled=\"],[1,\"{{true}}>Disabled</Tag>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"with-icon\"],[12],[1,\"With icon\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Provide a \"],[10,\"code\"],[12],[1,\"@renderIcon\"],[13],[1,\" component to render an icon inside the tag. The icon\\nis hidden for the \"],[10,\"code\"],[12],[1,\"sm\"],[13],[1,\" size.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_100\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Tag } from 'carbon-components-ember/components';\\nimport { Asleep } from 'carbon-components-ember/icons';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Tag @type='blue' @renderIcon=\"],[1,\"{{Asleep}}>With icon</Tag>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"with-decorator\"],[12],[1,\"With decorator\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"strong\"],[12],[1,\"Experimental:\"],[13],[1,\" Provide a \"],[10,\"code\"],[12],[1,\"@decorator\"],[13],[1,\" (or the deprecated \"],[10,\"code\"],[12],[1,\"@slug\"],[13],[1,\") component\\nto render inside the Tag, such as an AILabel once it's available (see\\n\"],[10,3],[14,6,\"https://github.com/IBM/carbon-components-ember/issues/406\"],[12],[1,\"AILabel #406\"],[13],[1,\").\\nIn the meantime, any component can be used as a placeholder.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_101\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Tag } from 'carbon-components-ember/components';\\nimport { Add } from 'carbon-components-ember/icons';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br>\\n  <Tag\\n    @type='red'\\n    @renderIcon=\"],[1,\"{{Add}}\\n    @decorator=\"],[1,\"{{component Add size='16'}}\\n  >With decorator</Tag>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Tag\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_102\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,6],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_97, repl_98, repl_99, repl_100, repl_101, repl_102],
  "isStrictMode": true
}), templateOnly(undefined, "tags.gjs"));

export { tags_gjs as default };

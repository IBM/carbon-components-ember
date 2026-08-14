import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, a7 as CarbonIcon, a8 as Task, j as fn, t as templateOnly, a9 as registerIcon, aa as _32_default, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

registerIcon('bookmark', _32_default);
function noop() {}
const repl_46 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<Icon @icon='bookmark' />
<Task @onClick={{fn (noop)}} />
*/
{
  "id": "xBbhNdOO",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@icon\"],[\"bookmark\"]],null],[1,\"\\n\"],[8,[32,2],null,[[\"@onClick\"],[[28,[32,3],[[28,[32,4],null,null]],null]]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonIcon, Task, fn, noop],
  "isStrictMode": true
}), templateOnly(undefined, "icon.gjs"));

const repl_47 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/icon' 
  @name='default' 
/>
*/
{
  "id": "y4FVv9uD",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/icon\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "icon.gjs"));

const icon_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="icon">Icon</h1>
<carbon-shadow-demo id="repl_46" class="repl-sdk__demo"><div><repl_46></repl_46></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { fn } from '@ember/helper';
import { Bookmark32 as BookmarkSvgInfo } from '@carbon/icons/es/index.js';
import { Bookmark, Task } from 'carbon-components-ember/icons';
import { Icon } from 'carbon-components-ember/components';
import { registerIcon } from 'carbon-components-ember/components/icon';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

registerIcon('bookmark', BookmarkSvgInfo);

function noop() {};

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;Icon @icon='bookmark' />
    &#x3C;Task @onClick=\{{fn (noop)}} />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Icon</h3></summary>
<div id="repl_47" class="repl-sdk__demo"><repl_47></repl_47></div>
</details>
*/
{
  "id": "m0YzWOGj",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"icon\"],[12],[1,\"Icon\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_46\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { fn } from '@ember/helper';\\nimport { Bookmark32 as BookmarkSvgInfo } from '@carbon/icons/es/index.js';\\nimport { Bookmark, Task } from 'carbon-components-ember/icons';\\nimport { Icon } from 'carbon-components-ember/components';\\nimport { registerIcon } from 'carbon-components-ember/components/icon';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { ThemeSupport } from 'docs-support';\\n\\nregisterIcon('bookmark', BookmarkSvgInfo);\\n\\nfunction noop() {};\\n\\n<template>\\n    <ThemeSupport />\\n    <Icon @icon='bookmark' />\\n    <Task @onClick=\"],[1,\"{{fn (noop)}} />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Icon\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_47\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_46, repl_47],
  "isStrictMode": true
}), templateOnly(undefined, "icon.gjs"));

export { icon_gjs as default };

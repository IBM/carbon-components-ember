import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aN as TabsComponent, j as fn, t as templateOnly, af as trackedObject, aO as TabContent, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const context$1 = trackedObject({});
const repl_93 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Tabs @loading={{true}} />

<br />

<Tabs
    @selectedTab={{context.selected}}
    @tabSelected={{fn (mut context.selected)}}
    as |TabPane|
>
    <TabPane @title='Tab Label 1' @isDefault={{true}}>
        title:
        {{context.selected}}
    </TabPane>
    <TabPane @title='Tab Label 2' @disabled={{true}}>
        title:
        {{context.selected}}
    </TabPane>
    <TabPane @title='Tab Label 4 with a very long long label'>
        title:
        {{context.selected}}
    </TabPane>
</Tabs>
*/
{
  "id": "MbcbM7ry",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@loading\"],[true]],null],[1,\"\\n\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@selectedTab\",\"@tabSelected\"],[[32,2,[\"selected\"]],[28,[32,3],[[28,[31,0],[[32,2,[\"selected\"]]],null]],null]]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1],null,[[\"@title\",\"@isDefault\"],[\"Tab Label 1\",true]],[[\"default\"],[[[[1,\"\\n        title:\\n        \"],[1,[32,2,[\"selected\"]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1],null,[[\"@title\",\"@disabled\"],[\"Tab Label 2\",true]],[[\"default\"],[[[[1,\"\\n        title:\\n        \"],[1,[32,2,[\"selected\"]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1],null,[[\"@title\"],[\"Tab Label 4 with a very long long label\"]],[[\"default\"],[[[[1,\"\\n        title:\\n        \"],[1,[32,2,[\"selected\"]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"TabPane\"],[\"mut\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TabsComponent, context$1, fn],
  "isStrictMode": true
}), templateOnly(undefined, "tabs.gjs"));

const eq = (a, b) => a === b;
const context = trackedObject({
  selected: 'a'
});
const repl_94 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<TabContent @selected={{eq context.selected 'a'}}>
    Content A
</TabContent>
<TabContent @selected={{eq context.selected 'b'}}>
    Content B
</TabContent>
*/
{
  "id": "WLrKQ108",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@selected\"],[[28,[32,2],[[32,3,[\"selected\"]],\"a\"],null]]],[[\"default\"],[[[[1,\"\\n    Content A\\n\"]],[]]]]],[1,\"\\n\"],[8,[32,1],null,[[\"@selected\"],[[28,[32,2],[[32,3,[\"selected\"]],\"b\"],null]]],[[\"default\"],[[[[1,\"\\n    Content B\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TabContent, eq, context],
  "isStrictMode": true
}), templateOnly(undefined, "tabs.gjs"));

const repl_95 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/tabs' 
  @name='default' 
/>
*/
{
  "id": "tMsDBiGy",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/tabs\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "tabs.gjs"));

const repl_96 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/tab-content' 
  @name='default' 
/>
*/
{
  "id": "O6w65vCt",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/tab-content\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "tabs.gjs"));

const tabs_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="tabs">Tabs</h1>
<carbon-shadow-demo id="repl_93" class="repl-sdk__demo"><div><repl_93></repl_93></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Tabs } from 'carbon-components-ember/components';
import { fn } from '@ember/helper';
import { trackedObject } from '@ember/reactive/collections';
import { ThemeSupport } from 'docs-support';

const context = trackedObject({});

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;Tabs @loading=\{{true}} />

    &#x3C;br />

    &#x3C;Tabs
        @selectedTab=\{{context.selected}}
        @tabSelected=\{{fn (mut context.selected)}}
        as |TabPane|
    >
        &#x3C;TabPane @title='Tab Label 1' @isDefault=\{{true}}>
            title:
            \{{context.selected}}
        &#x3C;/TabPane>
        &#x3C;TabPane @title='Tab Label 2' @disabled=\{{true}}>
            title:
            \{{context.selected}}
        &#x3C;/TabPane>
        &#x3C;TabPane @title='Tab Label 4 with a very long long label'>
            title:
            \{{context.selected}}
        &#x3C;/TabPane>
    &#x3C;/Tabs>
&#x3C;/template>
</code></pre></div>
<h2 id="tab-content">TabContent</h2>
<p><code>TabContent</code> is a standalone panel component for cases where tab selection is
managed outside of <code>Tabs</code>, such as a custom tab list.</p>
<carbon-shadow-demo id="repl_94" class="repl-sdk__demo"><div><repl_94></repl_94></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TabContent } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const eq = (a, b) => a === b;
const context = trackedObject({ selected: 'a' });

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;TabContent @selected=\{{eq context.selected 'a'}}>
        Content A
    &#x3C;/TabContent>
    &#x3C;TabContent @selected=\{{eq context.selected 'b'}}>
        Content B
    &#x3C;/TabContent>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Tabs</h3></summary>
<div id="repl_95" class="repl-sdk__demo"><repl_95></repl_95></div>
</details>
<details>
<summary><h3>TabContent</h3></summary>
<div id="repl_96" class="repl-sdk__demo"><repl_96></repl_96></div>
</details>
*/
{
  "id": "dKT4Fe0e",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"tabs\"],[12],[1,\"Tabs\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_93\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Tabs } from 'carbon-components-ember/components';\\nimport { fn } from '@ember/helper';\\nimport { trackedObject } from '@ember/reactive/collections';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst context = trackedObject({});\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <Tabs @loading=\"],[1,\"{{true}} />\\n\\n    <br />\\n\\n    <Tabs\\n        @selectedTab=\"],[1,\"{{context.selected}}\\n        @tabSelected=\"],[1,\"{{fn (mut context.selected)}}\\n        as |TabPane|\\n    >\\n        <TabPane @title='Tab Label 1' @isDefault=\"],[1,\"{{true}}>\\n            title:\\n            \"],[1,\"{{context.selected}}\\n        </TabPane>\\n        <TabPane @title='Tab Label 2' @disabled=\"],[1,\"{{true}}>\\n            title:\\n            \"],[1,\"{{context.selected}}\\n        </TabPane>\\n        <TabPane @title='Tab Label 4 with a very long long label'>\\n            title:\\n            \"],[1,\"{{context.selected}}\\n        </TabPane>\\n    </Tabs>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"tab-content\"],[12],[1,\"TabContent\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"TabContent\"],[13],[1,\" is a standalone panel component for cases where tab selection is\\nmanaged outside of \"],[10,\"code\"],[12],[1,\"Tabs\"],[13],[1,\", such as a custom tab list.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_94\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TabContent } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { trackedObject } from '@ember/reactive/collections';\\n\\nconst eq = (a, b) => a === b;\\nconst context = trackedObject({ selected: 'a' });\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <TabContent @selected=\"],[1,\"{{eq context.selected 'a'}}>\\n        Content A\\n    </TabContent>\\n    <TabContent @selected=\"],[1,\"{{eq context.selected 'b'}}>\\n        Content B\\n    </TabContent>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Tabs\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_95\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"TabContent\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_96\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_93, repl_94, repl_95, repl_96],
  "isStrictMode": true
}), templateOnly(undefined, "tabs.gjs"));

export { tabs_gjs as default };

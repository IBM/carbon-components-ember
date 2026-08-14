import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, b5 as TileComponent, t as templateOnly, b6 as TileGroup, af as trackedObject, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_114 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<Tile>
    <:content>
        Some Content
    </:content>
</Tile>

<br />

<Tile @expandable={{true}}>
    <:above>
        Title
        <p>
            Some Content
        </p>
    </:above>
    <:below>
        test
        <div style='height: 150px;'>test height</div>
        footer
    </:below>
</Tile>

<br />

<Tile @clickable={{true}}>
    <:above>
        Title
    </:above>
    <:content>
        Some clickable Content
    </:content>
    <:below>
        footer
    </:below>
</Tile>
*/
{
  "id": "S/j0phve",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,null,[[\"content\"],[[[[1,\"\\n        Some Content\\n    \"]],[]]]]],[1,\"\\n\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@expandable\"],[true]],[[\"above\",\"below\"],[[[[1,\"\\n        Title\\n        \"],[10,2],[12],[1,\"\\n            Some Content\\n        \"],[13],[1,\"\\n    \"]],[]],[[[1,\"\\n        test\\n        \"],[10,0],[14,5,\"height: 150px;\"],[12],[1,\"test height\"],[13],[1,\"\\n        footer\\n    \"]],[]]]]],[1,\"\\n\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@clickable\"],[true]],[[\"above\",\"content\",\"below\"],[[[[1,\"\\n        Title\\n    \"]],[]],[[[1,\"\\n        Some clickable Content\\n    \"]],[]],[[[1,\"\\n        footer\\n    \"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TileComponent],
  "isStrictMode": true
}), templateOnly(undefined, "tile.gjs"));

const context = trackedObject();
const updateSelected = value => {
  context.selected = value;
};
const repl_115 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />
<TileGroup @name="tile-group" @legend="Choose one" @defaultSelected="standard" @onChange={{updateSelected}} as |Tile|>
    <Tile @value="standard">Option 1</Tile>
    <Tile @value="all">Option 2</Tile>
    <Tile @value="custom">Option 3</Tile>
</TileGroup>
<br/>
selected: {{context.selected}}
*/
{
  "id": "hqanStB4",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@name\",\"@legend\",\"@defaultSelected\",\"@onChange\"],[\"tile-group\",\"Choose one\",\"standard\",[32,2]]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1],null,[[\"@value\"],[\"standard\"]],[[\"default\"],[[[[1,\"Option 1\"]],[]]]]],[1,\"\\n    \"],[8,[30,1],null,[[\"@value\"],[\"all\"]],[[\"default\"],[[[[1,\"Option 2\"]],[]]]]],[1,\"\\n    \"],[8,[30,1],null,[[\"@value\"],[\"custom\"]],[[\"default\"],[[[[1,\"Option 3\"]],[]]]]],[1,\"\\n\"]],[1]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\nselected: \"],[1,[32,3,[\"selected\"]]]],[\"Tile\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TileGroup, updateSelected, context],
  "isStrictMode": true
}), templateOnly(undefined, "tile.gjs"));

const repl_116 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/tile' 
  @name='default' 
/>
*/
{
  "id": "qpYYdRoU",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/tile\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "tile.gjs"));

const repl_117 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/radio-tile'
  @name='default'
/>
*/
{
  "id": "4/Eu5tkA",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/radio-tile\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "tile.gjs"));

const repl_118 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/tile/tile-group'
  @name='default'
/>
*/
{
  "id": "AXQ9Nn5O",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/tile/tile-group\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "tile.gjs"));

const tile_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="tile">Tile</h1>
<carbon-shadow-demo id="repl_114" class="repl-sdk__demo"><div><repl_114></repl_114></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Tile } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';


&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;Tile>
        &#x3C;:content>
            Some Content
        &#x3C;/:content>
    &#x3C;/Tile>

    &#x3C;br />

    &#x3C;Tile @expandable=\{{true}}>
        &#x3C;:above>
            Title
            &#x3C;p>
                Some Content
            &#x3C;/p>
        &#x3C;/:above>
        &#x3C;:below>
            test
            &#x3C;div style='height: 150px;'>test height&#x3C;/div>
            footer
        &#x3C;/:below>
    &#x3C;/Tile>

    &#x3C;br />

    &#x3C;Tile @clickable=\{{true}}>
        &#x3C;:above>
            Title
        &#x3C;/:above>
        &#x3C;:content>
            Some clickable Content
        &#x3C;/:content>
        &#x3C;:below>
            footer
        &#x3C;/:below>
    &#x3C;/Tile>
&#x3C;/template>
</code></pre></div>
<h2 id="tile-group">TileGroup</h2>
<p>Use <code>TileGroup</code> together with <code>RadioTile</code> to build a group of tiles where
only one tile can be selected at a time.</p>
<carbon-shadow-demo id="repl_115" class="repl-sdk__demo"><div><repl_115></repl_115></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TileGroup } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { trackedObject } from '@ember/reactive/collections';

const context = trackedObject();

const updateSelected = (value) => {
  context.selected = value;
}

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br />
    &#x3C;TileGroup @name="tile-group" @legend="Choose one" @defaultSelected="standard" @onChange=\{{updateSelected}} as |Tile|>
        &#x3C;Tile @value="standard">Option 1&#x3C;/Tile>
        &#x3C;Tile @value="all">Option 2&#x3C;/Tile>
        &#x3C;Tile @value="custom">Option 3&#x3C;/Tile>
    &#x3C;/TileGroup>
    &#x3C;br/>
    selected: \{{context.selected}}
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Tile</h3></summary>
<div id="repl_116" class="repl-sdk__demo"><repl_116></repl_116></div>
</details>
<details>
<summary><h3>RadioTile</h3></summary>
<div id="repl_117" class="repl-sdk__demo"><repl_117></repl_117></div>
</details>
<details>
<summary><h3>TileGroup</h3></summary>
<div id="repl_118" class="repl-sdk__demo"><repl_118></repl_118></div>
</details>
*/
{
  "id": "v8bOhZV4",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"tile\"],[12],[1,\"Tile\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_114\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Tile } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <Tile>\\n        <:content>\\n            Some Content\\n        </:content>\\n    </Tile>\\n\\n    <br />\\n\\n    <Tile @expandable=\"],[1,\"{{true}}>\\n        <:above>\\n            Title\\n            <p>\\n                Some Content\\n            </p>\\n        </:above>\\n        <:below>\\n            test\\n            <div style='height: 150px;'>test height</div>\\n            footer\\n        </:below>\\n    </Tile>\\n\\n    <br />\\n\\n    <Tile @clickable=\"],[1,\"{{true}}>\\n        <:above>\\n            Title\\n        </:above>\\n        <:content>\\n            Some clickable Content\\n        </:content>\\n        <:below>\\n            footer\\n        </:below>\\n    </Tile>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"tile-group\"],[12],[1,\"TileGroup\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Use \"],[10,\"code\"],[12],[1,\"TileGroup\"],[13],[1,\" together with \"],[10,\"code\"],[12],[1,\"RadioTile\"],[13],[1,\" to build a group of tiles where\\nonly one tile can be selected at a time.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_115\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TileGroup } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { trackedObject } from '@ember/reactive/collections';\\n\\nconst context = trackedObject();\\n\\nconst updateSelected = (value) => {\\n  context.selected = value;\\n}\\n\\n<template>\\n    <ThemeSupport />\\n    <br />\\n    <TileGroup @name=\\\"tile-group\\\" @legend=\\\"Choose one\\\" @defaultSelected=\\\"standard\\\" @onChange=\"],[1,\"{{updateSelected}} as |Tile|>\\n        <Tile @value=\\\"standard\\\">Option 1</Tile>\\n        <Tile @value=\\\"all\\\">Option 2</Tile>\\n        <Tile @value=\\\"custom\\\">Option 3</Tile>\\n    </TileGroup>\\n    <br/>\\n    selected: \"],[1,\"{{context.selected}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Tile\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_116\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"RadioTile\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_117\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"TileGroup\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_118\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_114, repl_115, repl_116, repl_117, repl_118],
  "isStrictMode": true
}), templateOnly(undefined, "tile.gjs"));

export { tile_gjs as default };

import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, Z as CarbonCheckbox, j as fn, f as helper, aA as OverflowMenuComponent, t as templateOnly, af as trackedObject, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const context = trackedObject();
const not = x => !x;
const repl_63 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<Checkbox @checked={{context.danger}} @onChange={{fn (set context 'danger') (not context.danger)}}> danger </Checkbox>
<Checkbox @checked={{context.disabled}} @onChange={{fn (set context 'disabled') (not context.disabled)}}> disabled </Checkbox>
<br />
<OverflowMenu
    @tooltip='Options'
    @direction='bottom'
    @danger={{context.danger}}
    @disabled={{context.disabled}}
    as |Item|
>
    <Item @itemText='option 1' />
    <Item
        @itemText='Option 2 is an example of a really long string and how we recommend handling this'
        @requireTitle={{true}}
    />
    <Item @itemText='option 3' @onClick={{fn (set context 'selected') 'option 3'}} />
    <Item @itemText='delete' @isDelete={{true}} @dangerDescription='delete this item' />
    <Item @itemText='disabled' @disabled={{true}} />
    <Item @itemText='option 4' @hasDivider={{true}} />
    <Item @itemText='link item' @href='https://carbondesignsystem.com' />
</OverflowMenu>
<br>
selected: {{context.selected}}
*/
{
  "id": "/zMIsF0x",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@checked\",\"@onChange\"],[[32,2,[\"danger\"]],[28,[32,3],[[28,[32,4],[[32,2],\"danger\"],null],[28,[32,5],[[32,2,[\"danger\"]]],null]],null]]],[[\"default\"],[[[[1,\" danger \"]],[]]]]],[1,\"\\n\"],[8,[32,1],null,[[\"@checked\",\"@onChange\"],[[32,2,[\"disabled\"]],[28,[32,3],[[28,[32,4],[[32,2],\"disabled\"],null],[28,[32,5],[[32,2,[\"disabled\"]]],null]],null]]],[[\"default\"],[[[[1,\" disabled \"]],[]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,6],null,[[\"@tooltip\",\"@direction\",\"@danger\",\"@disabled\"],[\"Options\",\"bottom\",[32,2,[\"danger\"]],[32,2,[\"disabled\"]]]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1],null,[[\"@itemText\"],[\"option 1\"]],null],[1,\"\\n    \"],[8,[30,1],null,[[\"@itemText\",\"@requireTitle\"],[\"Option 2 is an example of a really long string and how we recommend handling this\",true]],null],[1,\"\\n    \"],[8,[30,1],null,[[\"@itemText\",\"@onClick\"],[\"option 3\",[28,[32,3],[[28,[32,4],[[32,2],\"selected\"],null],\"option 3\"],null]]],null],[1,\"\\n    \"],[8,[30,1],null,[[\"@itemText\",\"@isDelete\",\"@dangerDescription\"],[\"delete\",true,\"delete this item\"]],null],[1,\"\\n    \"],[8,[30,1],null,[[\"@itemText\",\"@disabled\"],[\"disabled\",true]],null],[1,\"\\n    \"],[8,[30,1],null,[[\"@itemText\",\"@hasDivider\"],[\"option 4\",true]],null],[1,\"\\n    \"],[8,[30,1],null,[[\"@itemText\",\"@href\"],[\"link item\",\"https://carbondesignsystem.com\"]],null],[1,\"\\n\"]],[1]]]]],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\nselected: \"],[1,[32,2,[\"selected\"]]]],[\"Item\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonCheckbox, context, fn, helper, not, OverflowMenuComponent],
  "isStrictMode": true
}), templateOnly(undefined, "overflow-menu.gjs"));

const repl_64 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/overflow-menu' 
  @name='default' 
/>
*/
{
  "id": "s5DRhm1v",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/overflow-menu\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "overflow-menu.gjs"));

const repl_65 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/overflow-menu/item' 
  @name='default' 
/>
*/
{
  "id": "mvAK1O0T",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/overflow-menu/item\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "overflow-menu.gjs"));

const overflowMenu_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="overflow-menu">OverflowMenu</h1>
<carbon-shadow-demo id="repl_63" class="repl-sdk__demo"><div><repl_63></repl_63></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { fn } from '@ember/helper';
import { Button, Checkbox, OverflowMenu } from 'carbon-components-ember/components';
import { set } from 'carbon-components-ember/helpers';
import { trackedObject } from '@ember/reactive/collections';
import { ThemeSupport } from 'docs-support';

const context = trackedObject();
const not = (x) => !x;

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;Checkbox @checked=\{{context.danger}} @onChange=\{{fn (set context 'danger') (not context.danger)}}> danger &#x3C;/Checkbox>
    &#x3C;Checkbox @checked=\{{context.disabled}} @onChange=\{{fn (set context 'disabled') (not context.disabled)}}> disabled &#x3C;/Checkbox>
    &#x3C;br />
    &#x3C;OverflowMenu
        @tooltip='Options'
        @direction='bottom'
        @danger=\{{context.danger}}
        @disabled=\{{context.disabled}}
        as |Item|
    >
        &#x3C;Item @itemText='option 1' />
        &#x3C;Item
            @itemText='Option 2 is an example of a really long string and how we recommend handling this'
            @requireTitle=\{{true}}
        />
        &#x3C;Item @itemText='option 3' @onClick=\{{fn (set context 'selected') 'option 3'}} />
        &#x3C;Item @itemText='delete' @isDelete=\{{true}} @dangerDescription='delete this item' />
        &#x3C;Item @itemText='disabled' @disabled=\{{true}} />
        &#x3C;Item @itemText='option 4' @hasDivider=\{{true}} />
        &#x3C;Item @itemText='link item' @href='https://carbondesignsystem.com' />
    &#x3C;/OverflowMenu>
    &#x3C;br>
    selected: \{{context.selected}}
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>OverflowMenu</h3></summary>
<div id="repl_64" class="repl-sdk__demo"><repl_64></repl_64></div>
</details>
<details>
<summary><h3>OverflowMenuItem</h3></summary>
<div id="repl_65" class="repl-sdk__demo"><repl_65></repl_65></div>
</details>
*/
{
  "id": "ufzWA/jA",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"overflow-menu\"],[12],[1,\"OverflowMenu\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_63\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { fn } from '@ember/helper';\\nimport { Button, Checkbox, OverflowMenu } from 'carbon-components-ember/components';\\nimport { set } from 'carbon-components-ember/helpers';\\nimport { trackedObject } from '@ember/reactive/collections';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst context = trackedObject();\\nconst not = (x) => !x;\\n\\n<template>\\n    <ThemeSupport />\\n    <Checkbox @checked=\"],[1,\"{{context.danger}} @onChange=\"],[1,\"{{fn (set context 'danger') (not context.danger)}}> danger </Checkbox>\\n    <Checkbox @checked=\"],[1,\"{{context.disabled}} @onChange=\"],[1,\"{{fn (set context 'disabled') (not context.disabled)}}> disabled </Checkbox>\\n    <br />\\n    <OverflowMenu\\n        @tooltip='Options'\\n        @direction='bottom'\\n        @danger=\"],[1,\"{{context.danger}}\\n        @disabled=\"],[1,\"{{context.disabled}}\\n        as |Item|\\n    >\\n        <Item @itemText='option 1' />\\n        <Item\\n            @itemText='Option 2 is an example of a really long string and how we recommend handling this'\\n            @requireTitle=\"],[1,\"{{true}}\\n        />\\n        <Item @itemText='option 3' @onClick=\"],[1,\"{{fn (set context 'selected') 'option 3'}} />\\n        <Item @itemText='delete' @isDelete=\"],[1,\"{{true}} @dangerDescription='delete this item' />\\n        <Item @itemText='disabled' @disabled=\"],[1,\"{{true}} />\\n        <Item @itemText='option 4' @hasDivider=\"],[1,\"{{true}} />\\n        <Item @itemText='link item' @href='https://carbondesignsystem.com' />\\n    </OverflowMenu>\\n    <br>\\n    selected: \"],[1,\"{{context.selected}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"OverflowMenu\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_64\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"OverflowMenuItem\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_65\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_63, repl_64, repl_65],
  "isStrictMode": true
}), templateOnly(undefined, "overflow-menu.gjs"));

export { overflowMenu_gjs as default };

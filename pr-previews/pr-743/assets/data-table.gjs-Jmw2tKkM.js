import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, as as DataTableComponent, at as array, au as hash, t as templateOnly, j as fn, a4 as CarbonButton, a6 as cell, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

const repl_22 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<DataTable
    @title='Table title'
    @items={{array (hash name='a' b='c') (hash name='John' b='asd')}}
    as |table|
>
    <table.Toolbar as |toolbar|>
        <toolbar.Content>
            <table.SearchInput @expandable={{true}} />
        </toolbar.Content>
    </table.Toolbar>
    <table.Table>
        <table.Header
            @headers={{array (hash label='Name') (hash label='details') null}}
        />
        <table.EachBodyRows as |row|>
            <row.Row>
                <table.Column>
                    {{row.item.name}}
                </table.Column>
                <table.Column>
                    {{row.item.b}}
                </table.Column>
                <table.Menu as |Item|>
                    <Item>
                        Edit
                    </Item>
                </table.Menu>
            </row.Row>
        </table.EachBodyRows>
    </table.Table>
    <table.Pagination />
</DataTable>
*/
{
  "id": "VPIHrtDN",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@title\",\"@items\"],[\"Table title\",[28,[32,2],[[28,[32,3],null,[[\"name\",\"b\"],[\"a\",\"c\"]]],[28,[32,3],null,[[\"name\",\"b\"],[\"John\",\"asd\"]]]],null]]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Toolbar\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,2,[\"Content\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"SearchInput\"]],null,[[\"@expandable\"],[true]],null],[1,\"\\n        \"]],[]]]]],[1,\"\\n    \"]],[2]]]]],[1,\"\\n    \"],[8,[30,1,[\"Table\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Header\"]],null,[[\"@headers\"],[[28,[32,2],[[28,[32,3],null,[[\"label\"],[\"Name\"]]],[28,[32,3],null,[[\"label\"],[\"details\"]]],null],null]]],null],[1,\"\\n        \"],[8,[30,1,[\"EachBodyRows\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,3,[\"Row\"]],null,null,[[\"default\"],[[[[1,\"\\n                \"],[8,[30,1,[\"Column\"]],null,null,[[\"default\"],[[[[1,\"\\n                    \"],[1,[30,3,[\"item\",\"name\"]]],[1,\"\\n                \"]],[]]]]],[1,\"\\n                \"],[8,[30,1,[\"Column\"]],null,null,[[\"default\"],[[[[1,\"\\n                    \"],[1,[30,3,[\"item\",\"b\"]]],[1,\"\\n                \"]],[]]]]],[1,\"\\n                \"],[8,[30,1,[\"Menu\"]],null,null,[[\"default\"],[[[[1,\"\\n                    \"],[8,[30,4],null,null,[[\"default\"],[[[[1,\"\\n                        Edit\\n                    \"]],[]]]]],[1,\"\\n                \"]],[4]]]]],[1,\"\\n            \"]],[]]]]],[1,\"\\n        \"]],[3]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Pagination\"]],null,null,null],[1,\"\\n\"]],[1]]]]]],[\"table\",\"toolbar\",\"row\",\"Item\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, DataTableComponent, array, hash],
  "isStrictMode": true
}), templateOnly(undefined, "data-table.gjs"));

const state = cell();
const repl_23 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
{{#let
    (array (hash name='a' b='c') (hash name='John' b='asd'))
as |items|
}}
    <DataTable
        @title='Table title'
        @registerState={{fn (mut state.current)}}
        @items={{items}}
        as |table|
    >
        <table.Toolbar as |toolbar|>
            <toolbar.Content>
                <table.SearchInput />
            </toolbar.Content>
            <toolbar.Actions>
                <Button @type='primary'>
                    Save
                </Button>
            </toolbar.Actions>
        </table.Toolbar>
        <table.Table>
            <table.Header
                @isCheckable={{true}}
                @headers={{array
                (hash label='Name')
                (hash label='details')
                null
            }}
            />
            <table.EachBodyRows as |row|>
                <row.Row @item={{row.item}}>
                    <table.Column>
                        {{row.item.name}}
                    </table.Column>
                    <table.Column>
                        {{row.item.b}}
                    </table.Column>
                    <table.Menu as |Item|>
                        <Item>
                            Edit
                        </Item>
                    </table.Menu>
                </row.Row>
            </table.EachBodyRows>
        </table.Table>
        <table.Pagination />
    </DataTable>

    <DataTable
        @state={{state.current}}
        @title='Table Copy'
        @items={{items}}
        as |table|
    >
        <table.Toolbar as |toolbar|>
            <toolbar.Content>
                <table.SearchInput />
            </toolbar.Content>
            <toolbar.Actions>
                <Button @type='primary'>
                    Save
                </Button>
            </toolbar.Actions>
        </table.Toolbar>
        <table.Table>
            <table.Header
                @isCheckable={{true}}
                @headers={{array
                (hash label='Name')
                (hash label='details')
                null
            }}
            />
            <table.EachBodyRows as |row|>
                <row.Row @item={{row.item}}>
                    <table.Column>
                        {{row.item.name}}
                    </table.Column>
                    <table.Column>
                        {{row.item.b}}
                    </table.Column>
                    <table.Menu as |Item|>
                        <Item>
                            Edit
                        </Item>
                    </table.Menu>
                </row.Row>
            </table.EachBodyRows>
        </table.Table>
        <table.Pagination />
    </DataTable>
{{/let}}
*/
{
  "id": "DzH4zf4/",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[44,[[28,[32,1],[[28,[32,2],null,[[\"name\",\"b\"],[\"a\",\"c\"]]],[28,[32,2],null,[[\"name\",\"b\"],[\"John\",\"asd\"]]]],null]],[[[1,\"    \"],[8,[32,3],null,[[\"@title\",\"@registerState\",\"@items\"],[\"Table title\",[28,[32,4],[[28,[31,1],[[32,5,[\"current\"]]],null]],null],[30,1]]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,2,[\"Toolbar\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,3,[\"Content\"]],null,null,[[\"default\"],[[[[1,\"\\n                \"],[8,[30,2,[\"SearchInput\"]],null,null,null],[1,\"\\n            \"]],[]]]]],[1,\"\\n            \"],[8,[30,3,[\"Actions\"]],null,null,[[\"default\"],[[[[1,\"\\n                \"],[8,[32,6],null,[[\"@type\"],[\"primary\"]],[[\"default\"],[[[[1,\"\\n                    Save\\n                \"]],[]]]]],[1,\"\\n            \"]],[]]]]],[1,\"\\n        \"]],[3]]]]],[1,\"\\n        \"],[8,[30,2,[\"Table\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,2,[\"Header\"]],null,[[\"@isCheckable\",\"@headers\"],[true,[28,[32,1],[[28,[32,2],null,[[\"label\"],[\"Name\"]]],[28,[32,2],null,[[\"label\"],[\"details\"]]],null],null]]],null],[1,\"\\n            \"],[8,[30,2,[\"EachBodyRows\"]],null,null,[[\"default\"],[[[[1,\"\\n                \"],[8,[30,4,[\"Row\"]],null,[[\"@item\"],[[30,4,[\"item\"]]]],[[\"default\"],[[[[1,\"\\n                    \"],[8,[30,2,[\"Column\"]],null,null,[[\"default\"],[[[[1,\"\\n                        \"],[1,[30,4,[\"item\",\"name\"]]],[1,\"\\n                    \"]],[]]]]],[1,\"\\n                    \"],[8,[30,2,[\"Column\"]],null,null,[[\"default\"],[[[[1,\"\\n                        \"],[1,[30,4,[\"item\",\"b\"]]],[1,\"\\n                    \"]],[]]]]],[1,\"\\n                    \"],[8,[30,2,[\"Menu\"]],null,null,[[\"default\"],[[[[1,\"\\n                        \"],[8,[30,5],null,null,[[\"default\"],[[[[1,\"\\n                            Edit\\n                        \"]],[]]]]],[1,\"\\n                    \"]],[5]]]]],[1,\"\\n                \"]],[]]]]],[1,\"\\n            \"]],[4]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n        \"],[8,[30,2,[\"Pagination\"]],null,null,null],[1,\"\\n    \"]],[2]]]]],[1,\"\\n\\n    \"],[8,[32,3],null,[[\"@state\",\"@title\",\"@items\"],[[32,5,[\"current\"]],\"Table Copy\",[30,1]]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,6,[\"Toolbar\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,7,[\"Content\"]],null,null,[[\"default\"],[[[[1,\"\\n                \"],[8,[30,6,[\"SearchInput\"]],null,null,null],[1,\"\\n            \"]],[]]]]],[1,\"\\n            \"],[8,[30,7,[\"Actions\"]],null,null,[[\"default\"],[[[[1,\"\\n                \"],[8,[32,6],null,[[\"@type\"],[\"primary\"]],[[\"default\"],[[[[1,\"\\n                    Save\\n                \"]],[]]]]],[1,\"\\n            \"]],[]]]]],[1,\"\\n        \"]],[7]]]]],[1,\"\\n        \"],[8,[30,6,[\"Table\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,6,[\"Header\"]],null,[[\"@isCheckable\",\"@headers\"],[true,[28,[32,1],[[28,[32,2],null,[[\"label\"],[\"Name\"]]],[28,[32,2],null,[[\"label\"],[\"details\"]]],null],null]]],null],[1,\"\\n            \"],[8,[30,6,[\"EachBodyRows\"]],null,null,[[\"default\"],[[[[1,\"\\n                \"],[8,[30,8,[\"Row\"]],null,[[\"@item\"],[[30,8,[\"item\"]]]],[[\"default\"],[[[[1,\"\\n                    \"],[8,[30,6,[\"Column\"]],null,null,[[\"default\"],[[[[1,\"\\n                        \"],[1,[30,8,[\"item\",\"name\"]]],[1,\"\\n                    \"]],[]]]]],[1,\"\\n                    \"],[8,[30,6,[\"Column\"]],null,null,[[\"default\"],[[[[1,\"\\n                        \"],[1,[30,8,[\"item\",\"b\"]]],[1,\"\\n                    \"]],[]]]]],[1,\"\\n                    \"],[8,[30,6,[\"Menu\"]],null,null,[[\"default\"],[[[[1,\"\\n                        \"],[8,[30,9],null,null,[[\"default\"],[[[[1,\"\\n                            Edit\\n                        \"]],[]]]]],[1,\"\\n                    \"]],[9]]]]],[1,\"\\n                \"]],[]]]]],[1,\"\\n            \"]],[8]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n        \"],[8,[30,6,[\"Pagination\"]],null,null,null],[1,\"\\n    \"]],[6]]]]],[1,\"\\n\"]],[1]]]],[\"items\",\"table\",\"toolbar\",\"row\",\"Item\",\"table\",\"toolbar\",\"row\",\"Item\"],[\"let\",\"mut\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, array, hash, DataTableComponent, fn, state, CarbonButton],
  "isStrictMode": true
}), templateOnly(undefined, "data-table.gjs"));

const repl_24 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<DataTable
    @title='Table title'
    @items={{array (hash name='a' b='c') (hash name='John' b='asd')}}
    as |table|
>
    <table.Toolbar @size='xs' as |toolbar|>
        <toolbar.Content>
            <table.SearchInput @size='xs' @expandable={{true}} />
        </toolbar.Content>
    </table.Toolbar>
    <table.Table @size='xs'>
        <table.Header
            @headers={{array (hash label='Name') (hash label='details') null}}
        />
        <table.EachBodyRows as |row|>
            <row.Row>
                <table.Column>
                    {{row.item.name}}
                </table.Column>
                <table.Column>
                    {{row.item.b}}
                </table.Column>
                <table.Menu as |Item|>
                    <Item>
                        Edit
                    </Item>
                </table.Menu>
            </row.Row>
        </table.EachBodyRows>
    </table.Table>
    <table.Pagination @size='xs' />
</DataTable>
*/
{
  "id": "yb7h8JeV",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@title\",\"@items\"],[\"Table title\",[28,[32,2],[[28,[32,3],null,[[\"name\",\"b\"],[\"a\",\"c\"]]],[28,[32,3],null,[[\"name\",\"b\"],[\"John\",\"asd\"]]]],null]]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Toolbar\"]],null,[[\"@size\"],[\"xs\"]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,2,[\"Content\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"SearchInput\"]],null,[[\"@size\",\"@expandable\"],[\"xs\",true]],null],[1,\"\\n        \"]],[]]]]],[1,\"\\n    \"]],[2]]]]],[1,\"\\n    \"],[8,[30,1,[\"Table\"]],null,[[\"@size\"],[\"xs\"]],[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Header\"]],null,[[\"@headers\"],[[28,[32,2],[[28,[32,3],null,[[\"label\"],[\"Name\"]]],[28,[32,3],null,[[\"label\"],[\"details\"]]],null],null]]],null],[1,\"\\n        \"],[8,[30,1,[\"EachBodyRows\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,3,[\"Row\"]],null,null,[[\"default\"],[[[[1,\"\\n                \"],[8,[30,1,[\"Column\"]],null,null,[[\"default\"],[[[[1,\"\\n                    \"],[1,[30,3,[\"item\",\"name\"]]],[1,\"\\n                \"]],[]]]]],[1,\"\\n                \"],[8,[30,1,[\"Column\"]],null,null,[[\"default\"],[[[[1,\"\\n                    \"],[1,[30,3,[\"item\",\"b\"]]],[1,\"\\n                \"]],[]]]]],[1,\"\\n                \"],[8,[30,1,[\"Menu\"]],null,null,[[\"default\"],[[[[1,\"\\n                    \"],[8,[30,4],null,null,[[\"default\"],[[[[1,\"\\n                        Edit\\n                    \"]],[]]]]],[1,\"\\n                \"]],[4]]]]],[1,\"\\n            \"]],[]]]]],[1,\"\\n        \"]],[3]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Pagination\"]],null,[[\"@size\"],[\"xs\"]],null],[1,\"\\n\"]],[1]]]]]],[\"table\",\"toolbar\",\"row\",\"Item\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, DataTableComponent, array, hash],
  "isStrictMode": true
}), templateOnly(undefined, "data-table.gjs"));

const repl_25 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/data-table' 
  @name='default' 
/>
*/
{
  "id": "uG703qrA",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/data-table\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "data-table.gjs"));

const dataTable_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="data-table">Data Table</h1>
<p>Data tables are used to organize and display data efficiently.
The data table component allows for customization with additional functionality, as needed by your product’s users.</p>
<carbon-shadow-demo id="repl_22" class="repl-sdk__demo"><div><repl_22></repl_22></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { array, hash } from '@ember/helper';
import { DataTable } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;DataTable
        @title='Table title'
        @items=\{{array (hash name='a' b='c') (hash name='John' b='asd')}}
        as |table|
    >
        &#x3C;table.Toolbar as |toolbar|>
            &#x3C;toolbar.Content>
                &#x3C;table.SearchInput @expandable=\{{true}} />
            &#x3C;/toolbar.Content>
        &#x3C;/table.Toolbar>
        &#x3C;table.Table>
            &#x3C;table.Header
                @headers=\{{array (hash label='Name') (hash label='details') null}}
            />
            &#x3C;table.EachBodyRows as |row|>
                &#x3C;row.Row>
                    &#x3C;table.Column>
                        \{{row.item.name}}
                    &#x3C;/table.Column>
                    &#x3C;table.Column>
                        \{{row.item.b}}
                    &#x3C;/table.Column>
                    &#x3C;table.Menu as |Item|>
                        &#x3C;Item>
                            Edit
                        &#x3C;/Item>
                    &#x3C;/table.Menu>
                &#x3C;/row.Row>
            &#x3C;/table.EachBodyRows>
        &#x3C;/table.Table>
        &#x3C;table.Pagination />
    &#x3C;/DataTable>
&#x3C;/template>
</code></pre></div>
<details open><summary>state</summary>
The state of the table could be registerd on the controller to resume to
the same state. E.g. when clicking on a list item and then go back
<carbon-shadow-demo id="repl_23" class="repl-sdk__demo"><div><repl_23></repl_23></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { array, hash, fn } from '@ember/helper';
import { cell } from 'ember-resources';
import { DataTable, Button } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const state = cell();

&#x3C;template>
    &#x3C;ThemeSupport />
    \{{#let
        (array (hash name='a' b='c') (hash name='John' b='asd'))
    as |items|
    }}
        &#x3C;DataTable
            @title='Table title'
            @registerState=\{{fn (mut state.current)}}
            @items=\{{items}}
            as |table|
        >
            &#x3C;table.Toolbar as |toolbar|>
                &#x3C;toolbar.Content>
                    &#x3C;table.SearchInput />
                &#x3C;/toolbar.Content>
                &#x3C;toolbar.Actions>
                    &#x3C;Button @type='primary'>
                        Save
                    &#x3C;/Button>
                &#x3C;/toolbar.Actions>
            &#x3C;/table.Toolbar>
            &#x3C;table.Table>
                &#x3C;table.Header
                    @isCheckable=\{{true}}
                    @headers=\{{array
                    (hash label='Name')
                    (hash label='details')
                    null
                }}
                />
                &#x3C;table.EachBodyRows as |row|>
                    &#x3C;row.Row @item=\{{row.item}}>
                        &#x3C;table.Column>
                            \{{row.item.name}}
                        &#x3C;/table.Column>
                        &#x3C;table.Column>
                            \{{row.item.b}}
                        &#x3C;/table.Column>
                        &#x3C;table.Menu as |Item|>
                            &#x3C;Item>
                                Edit
                            &#x3C;/Item>
                        &#x3C;/table.Menu>
                    &#x3C;/row.Row>
                &#x3C;/table.EachBodyRows>
            &#x3C;/table.Table>
            &#x3C;table.Pagination />
        &#x3C;/DataTable>

        &#x3C;DataTable
            @state=\{{state.current}}
            @title='Table Copy'
            @items=\{{items}}
            as |table|
        >
            &#x3C;table.Toolbar as |toolbar|>
                &#x3C;toolbar.Content>
                    &#x3C;table.SearchInput />
                &#x3C;/toolbar.Content>
                &#x3C;toolbar.Actions>
                    &#x3C;Button @type='primary'>
                        Save
                    &#x3C;/Button>
                &#x3C;/toolbar.Actions>
            &#x3C;/table.Toolbar>
            &#x3C;table.Table>
                &#x3C;table.Header
                    @isCheckable=\{{true}}
                    @headers=\{{array
                    (hash label='Name')
                    (hash label='details')
                    null
                }}
                />
                &#x3C;table.EachBodyRows as |row|>
                    &#x3C;row.Row @item=\{{row.item}}>
                        &#x3C;table.Column>
                            \{{row.item.name}}
                        &#x3C;/table.Column>
                        &#x3C;table.Column>
                            \{{row.item.b}}
                        &#x3C;/table.Column>
                        &#x3C;table.Menu as |Item|>
                            &#x3C;Item>
                                Edit
                            &#x3C;/Item>
                        &#x3C;/table.Menu>
                    &#x3C;/row.Row>
                &#x3C;/table.EachBodyRows>
            &#x3C;/table.Table>
            &#x3C;table.Pagination />
        &#x3C;/DataTable>
    \{{/let}}
&#x3C;/template>
</code></pre></div>
</details>
<details><summary>xs toolbar and pagination</summary>
The Toolbar, its Search and the Pagination each accept their own `@size`
argument (`xs`, `sm`, `md` or `lg`, depending on the sub-component). Every
`` is also automatically linked to its column's `` via the `headers`
attribute for screen-reader users.
<carbon-shadow-demo id="repl_24" class="repl-sdk__demo"><div><repl_24></repl_24></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { array, hash } from '@ember/helper';
import { DataTable } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;DataTable
        @title='Table title'
        @items=\{{array (hash name='a' b='c') (hash name='John' b='asd')}}
        as |table|
    >
        &#x3C;table.Toolbar @size='xs' as |toolbar|>
            &#x3C;toolbar.Content>
                &#x3C;table.SearchInput @size='xs' @expandable=\{{true}} />
            &#x3C;/toolbar.Content>
        &#x3C;/table.Toolbar>
        &#x3C;table.Table @size='xs'>
            &#x3C;table.Header
                @headers=\{{array (hash label='Name') (hash label='details') null}}
            />
            &#x3C;table.EachBodyRows as |row|>
                &#x3C;row.Row>
                    &#x3C;table.Column>
                        \{{row.item.name}}
                    &#x3C;/table.Column>
                    &#x3C;table.Column>
                        \{{row.item.b}}
                    &#x3C;/table.Column>
                    &#x3C;table.Menu as |Item|>
                        &#x3C;Item>
                            Edit
                        &#x3C;/Item>
                    &#x3C;/table.Menu>
                &#x3C;/row.Row>
            &#x3C;/table.EachBodyRows>
        &#x3C;/table.Table>
        &#x3C;table.Pagination @size='xs' />
    &#x3C;/DataTable>
&#x3C;/template>
</code></pre></div>
</details>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Data Table</h3></summary>
<div id="repl_25" class="repl-sdk__demo"><repl_25></repl_25></div>
</details>
*/
{
  "id": "6xgjESgN",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"data-table\"],[12],[1,\"Data Table\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Data tables are used to organize and display data efficiently.\\nThe data table component allows for customization with additional functionality, as needed by your product’s users.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_22\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { array, hash } from '@ember/helper';\\nimport { DataTable } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <DataTable\\n        @title='Table title'\\n        @items=\"],[1,\"{{array (hash name='a' b='c') (hash name='John' b='asd')}}\\n        as |table|\\n    >\\n        <table.Toolbar as |toolbar|>\\n            <toolbar.Content>\\n                <table.SearchInput @expandable=\"],[1,\"{{true}} />\\n            </toolbar.Content>\\n        </table.Toolbar>\\n        <table.Table>\\n            <table.Header\\n                @headers=\"],[1,\"{{array (hash label='Name') (hash label='details') null}}\\n            />\\n            <table.EachBodyRows as |row|>\\n                <row.Row>\\n                    <table.Column>\\n                        \"],[1,\"{{row.item.name}}\\n                    </table.Column>\\n                    <table.Column>\\n                        \"],[1,\"{{row.item.b}}\\n                    </table.Column>\\n                    <table.Menu as |Item|>\\n                        <Item>\\n                            Edit\\n                        </Item>\\n                    </table.Menu>\\n                </row.Row>\\n            </table.EachBodyRows>\\n        </table.Table>\\n        <table.Pagination />\\n    </DataTable>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"details\"],[14,\"open\",\"\"],[12],[10,\"summary\"],[12],[1,\"state\"],[13],[1,\"\\nThe state of the table could be registerd on the controller to resume to\\nthe same state. E.g. when clicking on a list item and then go back\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_23\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { array, hash, fn } from '@ember/helper';\\nimport { cell } from 'ember-resources';\\nimport { DataTable, Button } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst state = cell();\\n\\n<template>\\n    <ThemeSupport />\\n    \"],[1,\"{{#let\\n        (array (hash name='a' b='c') (hash name='John' b='asd'))\\n    as |items|\\n    }}\\n        <DataTable\\n            @title='Table title'\\n            @registerState=\"],[1,\"{{fn (mut state.current)}}\\n            @items=\"],[1,\"{{items}}\\n            as |table|\\n        >\\n            <table.Toolbar as |toolbar|>\\n                <toolbar.Content>\\n                    <table.SearchInput />\\n                </toolbar.Content>\\n                <toolbar.Actions>\\n                    <Button @type='primary'>\\n                        Save\\n                    </Button>\\n                </toolbar.Actions>\\n            </table.Toolbar>\\n            <table.Table>\\n                <table.Header\\n                    @isCheckable=\"],[1,\"{{true}}\\n                    @headers=\"],[1,\"{{array\\n                    (hash label='Name')\\n                    (hash label='details')\\n                    null\\n                }}\\n                />\\n                <table.EachBodyRows as |row|>\\n                    <row.Row @item=\"],[1,\"{{row.item}}>\\n                        <table.Column>\\n                            \"],[1,\"{{row.item.name}}\\n                        </table.Column>\\n                        <table.Column>\\n                            \"],[1,\"{{row.item.b}}\\n                        </table.Column>\\n                        <table.Menu as |Item|>\\n                            <Item>\\n                                Edit\\n                            </Item>\\n                        </table.Menu>\\n                    </row.Row>\\n                </table.EachBodyRows>\\n            </table.Table>\\n            <table.Pagination />\\n        </DataTable>\\n\\n        <DataTable\\n            @state=\"],[1,\"{{state.current}}\\n            @title='Table Copy'\\n            @items=\"],[1,\"{{items}}\\n            as |table|\\n        >\\n            <table.Toolbar as |toolbar|>\\n                <toolbar.Content>\\n                    <table.SearchInput />\\n                </toolbar.Content>\\n                <toolbar.Actions>\\n                    <Button @type='primary'>\\n                        Save\\n                    </Button>\\n                </toolbar.Actions>\\n            </table.Toolbar>\\n            <table.Table>\\n                <table.Header\\n                    @isCheckable=\"],[1,\"{{true}}\\n                    @headers=\"],[1,\"{{array\\n                    (hash label='Name')\\n                    (hash label='details')\\n                    null\\n                }}\\n                />\\n                <table.EachBodyRows as |row|>\\n                    <row.Row @item=\"],[1,\"{{row.item}}>\\n                        <table.Column>\\n                            \"],[1,\"{{row.item.name}}\\n                        </table.Column>\\n                        <table.Column>\\n                            \"],[1,\"{{row.item.b}}\\n                        </table.Column>\\n                        <table.Menu as |Item|>\\n                            <Item>\\n                                Edit\\n                            </Item>\\n                        </table.Menu>\\n                    </row.Row>\\n                </table.EachBodyRows>\\n            </table.Table>\\n            <table.Pagination />\\n        </DataTable>\\n    \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[10,\"summary\"],[12],[1,\"xs toolbar and pagination\"],[13],[1,\"\\nThe Toolbar, its Search and the Pagination each accept their own `@size`\\nargument (`xs`, `sm`, `md` or `lg`, depending on the sub-component). Every\\n`` is also automatically linked to its column's `` via the `headers`\\nattribute for screen-reader users.\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_24\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { array, hash } from '@ember/helper';\\nimport { DataTable } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <DataTable\\n        @title='Table title'\\n        @items=\"],[1,\"{{array (hash name='a' b='c') (hash name='John' b='asd')}}\\n        as |table|\\n    >\\n        <table.Toolbar @size='xs' as |toolbar|>\\n            <toolbar.Content>\\n                <table.SearchInput @size='xs' @expandable=\"],[1,\"{{true}} />\\n            </toolbar.Content>\\n        </table.Toolbar>\\n        <table.Table @size='xs'>\\n            <table.Header\\n                @headers=\"],[1,\"{{array (hash label='Name') (hash label='details') null}}\\n            />\\n            <table.EachBodyRows as |row|>\\n                <row.Row>\\n                    <table.Column>\\n                        \"],[1,\"{{row.item.name}}\\n                    </table.Column>\\n                    <table.Column>\\n                        \"],[1,\"{{row.item.b}}\\n                    </table.Column>\\n                    <table.Menu as |Item|>\\n                        <Item>\\n                            Edit\\n                        </Item>\\n                    </table.Menu>\\n                </row.Row>\\n            </table.EachBodyRows>\\n        </table.Table>\\n        <table.Pagination @size='xs' />\\n    </DataTable>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Data Table\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_25\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_22, repl_23, repl_24, repl_25],
  "isStrictMode": true
}), templateOnly(undefined, "data-table.gjs"));

export { dataTable_gjs as default };

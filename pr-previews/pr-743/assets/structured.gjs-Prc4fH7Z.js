import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, bk as StructuredList, t as templateOnly, aw as array, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_187 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<StructuredList as |SL|>
    <SL.Head>
        <SL.Row @head={{true}}>
            <SL.Cell @head={{true}}>ColumnA</SL.Cell>
            <SL.Cell @head={{true}}>ColumnB</SL.Cell>
            <SL.Cell @head={{true}}>ColumnC</SL.Cell>
        </SL.Row>
    </SL.Head>
    <SL.Body>
        <SL.Row>
            <SL.Cell @noWrap={{true}}>Row 1</SL.Cell>
            <SL.Cell>Row 1</SL.Cell>
            <SL.Cell>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nunc dui magna, finibus id tortor sed, aliquet bibendum
                augue.
            </SL.Cell>
        </SL.Row>
        <SL.Row>
            <SL.Cell @noWrap={{true}}>Row 2</SL.Cell>
            <SL.Cell>Row 2</SL.Cell>
            <SL.Cell>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nunc dui magna, finibus id tortor sed, aliquet bibendum
                augue.
            </SL.Cell>
        </SL.Row>
    </SL.Body>
</StructuredList>
*/
{
  "id": "X3lHQTck",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,null,[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Head\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"ColumnA\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"ColumnB\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"ColumnC\"]],[]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Body\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@noWrap\"],[true]],[[\"default\"],[[[[1,\"Row 1\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Row 1\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"\\n                Lorem ipsum dolor sit amet, consectetur adipiscing elit.\\n                Nunc dui magna, finibus id tortor sed, aliquet bibendum\\n                augue.\\n            \"]],[]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@noWrap\"],[true]],[[\"default\"],[[[[1,\"Row 2\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Row 2\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"\\n                Lorem ipsum dolor sit amet, consectetur adipiscing elit.\\n                Nunc dui magna, finibus id tortor sed, aliquet bibendum\\n                augue.\\n            \"]],[]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"SL\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, StructuredList],
  "isStrictMode": true
}), templateOnly(undefined, "structured.gjs"));

const repl_188 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<StructuredList @selection={{true}} @selectedInitialRow="row-1" as |SL|>
    <SL.Head>
        <SL.Row @head={{true}}>
            <SL.Cell @head={{true}}>ColumnA</SL.Cell>
            <SL.Cell @head={{true}}>ColumnB</SL.Cell>
        </SL.Row>
    </SL.Head>
    <SL.Body>
        <SL.Row @id="row-1" as |Row|>
            <Row @name="structured-list-demo" />
            <SL.Cell>Row 1</SL.Cell>
            <SL.Cell>Option 1</SL.Cell>
        </SL.Row>
        <SL.Row @id="row-2" as |Row|>
            <Row @name="structured-list-demo" />
            <SL.Cell>Row 2</SL.Cell>
            <SL.Cell>Option 2</SL.Cell>
        </SL.Row>
    </SL.Body>
</StructuredList>
*/
{
  "id": "wU3h7sFu",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@selection\",\"@selectedInitialRow\"],[true,\"row-1\"]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Head\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"ColumnA\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"ColumnB\"]],[]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Body\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,[[\"@id\"],[\"row-1\"]],[[\"default\"],[[[[1,\"\\n            \"],[8,[30,2],null,[[\"@name\"],[\"structured-list-demo\"]],null],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Row 1\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Option 1\"]],[]]]]],[1,\"\\n        \"]],[2]]]]],[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,[[\"@id\"],[\"row-2\"]],[[\"default\"],[[[[1,\"\\n            \"],[8,[30,3],null,[[\"@name\"],[\"structured-list-demo\"]],null],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Row 2\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Option 2\"]],[]]]]],[1,\"\\n        \"]],[3]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"SL\",\"Row\",\"Row\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, StructuredList],
  "isStrictMode": true
}), templateOnly(undefined, "structured.gjs"));

const repl_189 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<StructuredList
  @selection={{true}}
  @multiSelection={{true}}
  @selectedInitialRows={{array "row-1"}}
  as |SL|
>
    <SL.Head>
        <SL.Row @head={{true}}>
            <SL.Cell @head={{true}}>ColumnA</SL.Cell>
            <SL.Cell @head={{true}}>ColumnB</SL.Cell>
        </SL.Row>
    </SL.Head>
    <SL.Body>
        <SL.Row @id="row-1" as |Row|>
            <Row @name="structured-list-multi-demo" />
            <SL.Cell>Row 1</SL.Cell>
            <SL.Cell>Option 1</SL.Cell>
        </SL.Row>
        <SL.Row @id="row-2" as |Row|>
            <Row @name="structured-list-multi-demo" />
            <SL.Cell>Row 2</SL.Cell>
            <SL.Cell>Option 2</SL.Cell>
        </SL.Row>
    </SL.Body>
</StructuredList>
*/
{
  "id": "tOYfO7FV",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@selection\",\"@multiSelection\",\"@selectedInitialRows\"],[true,true,[28,[32,2],[\"row-1\"],null]]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Head\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"ColumnA\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"ColumnB\"]],[]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Body\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,[[\"@id\"],[\"row-1\"]],[[\"default\"],[[[[1,\"\\n            \"],[8,[30,2],null,[[\"@name\"],[\"structured-list-multi-demo\"]],null],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Row 1\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Option 1\"]],[]]]]],[1,\"\\n        \"]],[2]]]]],[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,[[\"@id\"],[\"row-2\"]],[[\"default\"],[[[[1,\"\\n            \"],[8,[30,3],null,[[\"@name\"],[\"structured-list-multi-demo\"]],null],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Row 2\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Option 2\"]],[]]]]],[1,\"\\n        \"]],[3]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"SL\",\"Row\",\"Row\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, StructuredList, array],
  "isStrictMode": true
}), templateOnly(undefined, "structured.gjs"));

const repl_190 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<StructuredList @isCondensed={{true}} as |SL|>
    <SL.Head>
        <SL.Row @head={{true}}>
            <SL.Cell @head={{true}}>ColumnA</SL.Cell>
            <SL.Cell @head={{true}}>ColumnB</SL.Cell>
        </SL.Row>
    </SL.Head>
    <SL.Body>
        <SL.Row>
            <SL.Cell>Row 1</SL.Cell>
            <SL.Cell>Row 1</SL.Cell>
        </SL.Row>
    </SL.Body>
</StructuredList>
*/
{
  "id": "Z6aWTfAk",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@isCondensed\"],[true]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Head\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"ColumnA\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"ColumnB\"]],[]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Body\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Row 1\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Row 1\"]],[]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"SL\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, StructuredList],
  "isStrictMode": true
}), templateOnly(undefined, "structured.gjs"));

const repl_191 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br>
<StructuredList @isFlush={{true}} as |SL|>
    <SL.Head>
        <SL.Row @head={{true}}>
            <SL.Cell @head={{true}}>ColumnA</SL.Cell>
            <SL.Cell @head={{true}}>ColumnB</SL.Cell>
        </SL.Row>
    </SL.Head>
    <SL.Body>
        <SL.Row>
            <SL.Cell>Row 1</SL.Cell>
            <SL.Cell>Row 1</SL.Cell>
        </SL.Row>
    </SL.Body>
</StructuredList>
*/
{
  "id": "u8R7uRWT",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,1],null,[[\"@isFlush\"],[true]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,1,[\"Head\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"ColumnA\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,[[\"@head\"],[true]],[[\"default\"],[[[[1,\"ColumnB\"]],[]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n    \"],[8,[30,1,[\"Body\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Row\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Row 1\"]],[]]]]],[1,\"\\n            \"],[8,[30,1,[\"Cell\"]],null,null,[[\"default\"],[[[[1,\"Row 1\"]],[]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n    \"]],[]]]]],[1,\"\\n\"]],[1]]]]]],[\"SL\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, StructuredList],
  "isStrictMode": true
}), templateOnly(undefined, "structured.gjs"));

const repl_192 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/structured-list' 
  @name='default' 
/>
*/
{
  "id": "3OrkE750",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/structured-list\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "structured.gjs"));

const structured_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="structured-list">StructuredList</h1>
<p>Structured Lists group content that is similar or related, such as terms
or definitions. Compose a list from <code>SL.Head</code>, <code>SL.Body</code>, <code>SL.Row</code>, and
<code>SL.Cell</code> yielded by <code>StructuredList</code>.</p>
<carbon-shadow-demo id="repl_187" class="repl-sdk__demo"><div><repl_187></repl_187></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { StructuredList } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;StructuredList as |SL|>
        &#x3C;SL.Head>
            &#x3C;SL.Row @head=\{{true}}>
                &#x3C;SL.Cell @head=\{{true}}>ColumnA&#x3C;/SL.Cell>
                &#x3C;SL.Cell @head=\{{true}}>ColumnB&#x3C;/SL.Cell>
                &#x3C;SL.Cell @head=\{{true}}>ColumnC&#x3C;/SL.Cell>
            &#x3C;/SL.Row>
        &#x3C;/SL.Head>
        &#x3C;SL.Body>
            &#x3C;SL.Row>
                &#x3C;SL.Cell @noWrap=\{{true}}>Row 1&#x3C;/SL.Cell>
                &#x3C;SL.Cell>Row 1&#x3C;/SL.Cell>
                &#x3C;SL.Cell>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc dui magna, finibus id tortor sed, aliquet bibendum
                    augue.
                &#x3C;/SL.Cell>
            &#x3C;/SL.Row>
            &#x3C;SL.Row>
                &#x3C;SL.Cell @noWrap=\{{true}}>Row 2&#x3C;/SL.Cell>
                &#x3C;SL.Cell>Row 2&#x3C;/SL.Cell>
                &#x3C;SL.Cell>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nunc dui magna, finibus id tortor sed, aliquet bibendum
                    augue.
                &#x3C;/SL.Cell>
            &#x3C;/SL.Row>
        &#x3C;/SL.Body>
    &#x3C;/StructuredList>
&#x3C;/template>
</code></pre></div>
<h2 id="selection">Selection</h2>
<p>Passing <code>@selection=\{{true}}</code> turns each row into a radio-style selectable
item. Give each <code>SL.Row</code> a stable <code>@id</code> and render the row-bound <code>Row</code>
input component (yielded from <code>SL.Row</code>) to make it selectable; clicking
anywhere in the row, or the input itself, selects it.</p>
<p>By default selection state is managed internally, optionally seeded with
<code>@selectedInitialRow</code>. Pass <code>@onSelectionChange</code> to be notified whenever the
selected row changes, and/or <code>@selectedRow</code> to fully control the selection
from outside the component (for example to drive it from route or query
param state):</p>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">&#x3C;StructuredList
  @selection=\{{true}}
  @selectedRow=\{{this.selectedRow}}
  @onSelectionChange=\{{this.handleSelectionChange}}
  as |SL|
>
  ...
&#x3C;/StructuredList>
</code></pre></div>
<carbon-shadow-demo id="repl_188" class="repl-sdk__demo"><div><repl_188></repl_188></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { StructuredList } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;StructuredList @selection=\{{true}} @selectedInitialRow="row-1" as |SL|>
        &#x3C;SL.Head>
            &#x3C;SL.Row @head=\{{true}}>
                &#x3C;SL.Cell @head=\{{true}}>ColumnA&#x3C;/SL.Cell>
                &#x3C;SL.Cell @head=\{{true}}>ColumnB&#x3C;/SL.Cell>
            &#x3C;/SL.Row>
        &#x3C;/SL.Head>
        &#x3C;SL.Body>
            &#x3C;SL.Row @id="row-1" as |Row|>
                &#x3C;Row @name="structured-list-demo" />
                &#x3C;SL.Cell>Row 1&#x3C;/SL.Cell>
                &#x3C;SL.Cell>Option 1&#x3C;/SL.Cell>
            &#x3C;/SL.Row>
            &#x3C;SL.Row @id="row-2" as |Row|>
                &#x3C;Row @name="structured-list-demo" />
                &#x3C;SL.Cell>Row 2&#x3C;/SL.Cell>
                &#x3C;SL.Cell>Option 2&#x3C;/SL.Cell>
            &#x3C;/SL.Row>
        &#x3C;/SL.Body>
    &#x3C;/StructuredList>
&#x3C;/template>
</code></pre></div>
<h2 id="multi-selection">Multi-selection</h2>
<p>Carbon React's <code>StructuredListWrapper</code> only ever supports single (radio-style)
selection. As an Ember-specific addition, passing <code>@multiSelection=\{{true}}</code>
alongside <code>@selection=\{{true}}</code> turns each row into a checkbox-style
selectable item instead, allowing more than one row to be selected at once.</p>
<p>The API mirrors the single-selection one: <code>@selectedInitialRows</code> seeds the
internal state, <code>@onMultiSelectionChange</code> is called with the full array of
selected row ids whenever it changes, and <code>@selectedRows</code> lets you fully
control selection from outside the component.</p>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">&#x3C;StructuredList
  @selection=\{{true}}
  @multiSelection=\{{true}}
  @selectedRows=\{{this.selectedRows}}
  @onMultiSelectionChange=\{{this.handleSelectionChange}}
  as |SL|
>
  ...
&#x3C;/StructuredList>
</code></pre></div>
<carbon-shadow-demo id="repl_189" class="repl-sdk__demo"><div><repl_189></repl_189></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { array } from '@ember/helper';
import { StructuredList } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;StructuredList
      @selection=\{{true}}
      @multiSelection=\{{true}}
      @selectedInitialRows=\{{array "row-1"}}
      as |SL|
    >
        &#x3C;SL.Head>
            &#x3C;SL.Row @head=\{{true}}>
                &#x3C;SL.Cell @head=\{{true}}>ColumnA&#x3C;/SL.Cell>
                &#x3C;SL.Cell @head=\{{true}}>ColumnB&#x3C;/SL.Cell>
            &#x3C;/SL.Row>
        &#x3C;/SL.Head>
        &#x3C;SL.Body>
            &#x3C;SL.Row @id="row-1" as |Row|>
                &#x3C;Row @name="structured-list-multi-demo" />
                &#x3C;SL.Cell>Row 1&#x3C;/SL.Cell>
                &#x3C;SL.Cell>Option 1&#x3C;/SL.Cell>
            &#x3C;/SL.Row>
            &#x3C;SL.Row @id="row-2" as |Row|>
                &#x3C;Row @name="structured-list-multi-demo" />
                &#x3C;SL.Cell>Row 2&#x3C;/SL.Cell>
                &#x3C;SL.Cell>Option 2&#x3C;/SL.Cell>
            &#x3C;/SL.Row>
        &#x3C;/SL.Body>
    &#x3C;/StructuredList>
&#x3C;/template>
</code></pre></div>
<h2 id="condensed">Condensed</h2>
<carbon-shadow-demo id="repl_190" class="repl-sdk__demo"><div><repl_190></repl_190></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { StructuredList } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;StructuredList @isCondensed=\{{true}} as |SL|>
        &#x3C;SL.Head>
            &#x3C;SL.Row @head=\{{true}}>
                &#x3C;SL.Cell @head=\{{true}}>ColumnA&#x3C;/SL.Cell>
                &#x3C;SL.Cell @head=\{{true}}>ColumnB&#x3C;/SL.Cell>
            &#x3C;/SL.Row>
        &#x3C;/SL.Head>
        &#x3C;SL.Body>
            &#x3C;SL.Row>
                &#x3C;SL.Cell>Row 1&#x3C;/SL.Cell>
                &#x3C;SL.Cell>Row 1&#x3C;/SL.Cell>
            &#x3C;/SL.Row>
        &#x3C;/SL.Body>
    &#x3C;/StructuredList>
&#x3C;/template>
</code></pre></div>
<h2 id="flush">Flush</h2>
<p><code>@isFlush</code> removes the left/right padding on the outer columns. It has no
effect when <code>@selection</code> is enabled.</p>
<carbon-shadow-demo id="repl_191" class="repl-sdk__demo"><div><repl_191></repl_191></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { StructuredList } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;br>
    &#x3C;StructuredList @isFlush=\{{true}} as |SL|>
        &#x3C;SL.Head>
            &#x3C;SL.Row @head=\{{true}}>
                &#x3C;SL.Cell @head=\{{true}}>ColumnA&#x3C;/SL.Cell>
                &#x3C;SL.Cell @head=\{{true}}>ColumnB&#x3C;/SL.Cell>
            &#x3C;/SL.Row>
        &#x3C;/SL.Head>
        &#x3C;SL.Body>
            &#x3C;SL.Row>
                &#x3C;SL.Cell>Row 1&#x3C;/SL.Cell>
                &#x3C;SL.Cell>Row 1&#x3C;/SL.Cell>
            &#x3C;/SL.Row>
        &#x3C;/SL.Body>
    &#x3C;/StructuredList>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>StructuredList</h3></summary>
<div id="repl_192" class="repl-sdk__demo"><repl_192></repl_192></div>
</details>
*/
{
  "id": "2xTD9e5e",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"structured-list\"],[12],[1,\"StructuredList\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Structured Lists group content that is similar or related, such as terms\\nor definitions. Compose a list from \"],[10,\"code\"],[12],[1,\"SL.Head\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"SL.Body\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"SL.Row\"],[13],[1,\", and\\n\"],[10,\"code\"],[12],[1,\"SL.Cell\"],[13],[1,\" yielded by \"],[10,\"code\"],[12],[1,\"StructuredList\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_187\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { StructuredList } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <StructuredList as |SL|>\\n        <SL.Head>\\n            <SL.Row @head=\"],[1,\"{{true}}>\\n                <SL.Cell @head=\"],[1,\"{{true}}>ColumnA</SL.Cell>\\n                <SL.Cell @head=\"],[1,\"{{true}}>ColumnB</SL.Cell>\\n                <SL.Cell @head=\"],[1,\"{{true}}>ColumnC</SL.Cell>\\n            </SL.Row>\\n        </SL.Head>\\n        <SL.Body>\\n            <SL.Row>\\n                <SL.Cell @noWrap=\"],[1,\"{{true}}>Row 1</SL.Cell>\\n                <SL.Cell>Row 1</SL.Cell>\\n                <SL.Cell>\\n                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.\\n                    Nunc dui magna, finibus id tortor sed, aliquet bibendum\\n                    augue.\\n                </SL.Cell>\\n            </SL.Row>\\n            <SL.Row>\\n                <SL.Cell @noWrap=\"],[1,\"{{true}}>Row 2</SL.Cell>\\n                <SL.Cell>Row 2</SL.Cell>\\n                <SL.Cell>\\n                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.\\n                    Nunc dui magna, finibus id tortor sed, aliquet bibendum\\n                    augue.\\n                </SL.Cell>\\n            </SL.Row>\\n        </SL.Body>\\n    </StructuredList>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"selection\"],[12],[1,\"Selection\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Passing \"],[10,\"code\"],[12],[1,\"@selection=\"],[1,\"{{true}}\"],[13],[1,\" turns each row into a radio-style selectable\\nitem. Give each \"],[10,\"code\"],[12],[1,\"SL.Row\"],[13],[1,\" a stable \"],[10,\"code\"],[12],[1,\"@id\"],[13],[1,\" and render the row-bound \"],[10,\"code\"],[12],[1,\"Row\"],[13],[1,\"\\ninput component (yielded from \"],[10,\"code\"],[12],[1,\"SL.Row\"],[13],[1,\") to make it selectable; clicking\\nanywhere in the row, or the input itself, selects it.\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"By default selection state is managed internally, optionally seeded with\\n\"],[10,\"code\"],[12],[1,\"@selectedInitialRow\"],[13],[1,\". Pass \"],[10,\"code\"],[12],[1,\"@onSelectionChange\"],[13],[1,\" to be notified whenever the\\nselected row changes, and/or \"],[10,\"code\"],[12],[1,\"@selectedRow\"],[13],[1,\" to fully control the selection\\nfrom outside the component (for example to drive it from route or query\\nparam state):\"],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"<StructuredList\\n  @selection=\"],[1,\"{{true}}\\n  @selectedRow=\"],[1,\"{{this.selectedRow}}\\n  @onSelectionChange=\"],[1,\"{{this.handleSelectionChange}}\\n  as |SL|\\n>\\n  ...\\n</StructuredList>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_188\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { StructuredList } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <StructuredList @selection=\"],[1,\"{{true}} @selectedInitialRow=\\\"row-1\\\" as |SL|>\\n        <SL.Head>\\n            <SL.Row @head=\"],[1,\"{{true}}>\\n                <SL.Cell @head=\"],[1,\"{{true}}>ColumnA</SL.Cell>\\n                <SL.Cell @head=\"],[1,\"{{true}}>ColumnB</SL.Cell>\\n            </SL.Row>\\n        </SL.Head>\\n        <SL.Body>\\n            <SL.Row @id=\\\"row-1\\\" as |Row|>\\n                <Row @name=\\\"structured-list-demo\\\" />\\n                <SL.Cell>Row 1</SL.Cell>\\n                <SL.Cell>Option 1</SL.Cell>\\n            </SL.Row>\\n            <SL.Row @id=\\\"row-2\\\" as |Row|>\\n                <Row @name=\\\"structured-list-demo\\\" />\\n                <SL.Cell>Row 2</SL.Cell>\\n                <SL.Cell>Option 2</SL.Cell>\\n            </SL.Row>\\n        </SL.Body>\\n    </StructuredList>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"multi-selection\"],[12],[1,\"Multi-selection\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Carbon React's \"],[10,\"code\"],[12],[1,\"StructuredListWrapper\"],[13],[1,\" only ever supports single (radio-style)\\nselection. As an Ember-specific addition, passing \"],[10,\"code\"],[12],[1,\"@multiSelection=\"],[1,\"{{true}}\"],[13],[1,\"\\nalongside \"],[10,\"code\"],[12],[1,\"@selection=\"],[1,\"{{true}}\"],[13],[1,\" turns each row into a checkbox-style\\nselectable item instead, allowing more than one row to be selected at once.\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"The API mirrors the single-selection one: \"],[10,\"code\"],[12],[1,\"@selectedInitialRows\"],[13],[1,\" seeds the\\ninternal state, \"],[10,\"code\"],[12],[1,\"@onMultiSelectionChange\"],[13],[1,\" is called with the full array of\\nselected row ids whenever it changes, and \"],[10,\"code\"],[12],[1,\"@selectedRows\"],[13],[1,\" lets you fully\\ncontrol selection from outside the component.\"],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"<StructuredList\\n  @selection=\"],[1,\"{{true}}\\n  @multiSelection=\"],[1,\"{{true}}\\n  @selectedRows=\"],[1,\"{{this.selectedRows}}\\n  @onMultiSelectionChange=\"],[1,\"{{this.handleSelectionChange}}\\n  as |SL|\\n>\\n  ...\\n</StructuredList>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_189\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { array } from '@ember/helper';\\nimport { StructuredList } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <StructuredList\\n      @selection=\"],[1,\"{{true}}\\n      @multiSelection=\"],[1,\"{{true}}\\n      @selectedInitialRows=\"],[1,\"{{array \\\"row-1\\\"}}\\n      as |SL|\\n    >\\n        <SL.Head>\\n            <SL.Row @head=\"],[1,\"{{true}}>\\n                <SL.Cell @head=\"],[1,\"{{true}}>ColumnA</SL.Cell>\\n                <SL.Cell @head=\"],[1,\"{{true}}>ColumnB</SL.Cell>\\n            </SL.Row>\\n        </SL.Head>\\n        <SL.Body>\\n            <SL.Row @id=\\\"row-1\\\" as |Row|>\\n                <Row @name=\\\"structured-list-multi-demo\\\" />\\n                <SL.Cell>Row 1</SL.Cell>\\n                <SL.Cell>Option 1</SL.Cell>\\n            </SL.Row>\\n            <SL.Row @id=\\\"row-2\\\" as |Row|>\\n                <Row @name=\\\"structured-list-multi-demo\\\" />\\n                <SL.Cell>Row 2</SL.Cell>\\n                <SL.Cell>Option 2</SL.Cell>\\n            </SL.Row>\\n        </SL.Body>\\n    </StructuredList>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"condensed\"],[12],[1,\"Condensed\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_190\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { StructuredList } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <StructuredList @isCondensed=\"],[1,\"{{true}} as |SL|>\\n        <SL.Head>\\n            <SL.Row @head=\"],[1,\"{{true}}>\\n                <SL.Cell @head=\"],[1,\"{{true}}>ColumnA</SL.Cell>\\n                <SL.Cell @head=\"],[1,\"{{true}}>ColumnB</SL.Cell>\\n            </SL.Row>\\n        </SL.Head>\\n        <SL.Body>\\n            <SL.Row>\\n                <SL.Cell>Row 1</SL.Cell>\\n                <SL.Cell>Row 1</SL.Cell>\\n            </SL.Row>\\n        </SL.Body>\\n    </StructuredList>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"flush\"],[12],[1,\"Flush\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"@isFlush\"],[13],[1,\" removes the left/right padding on the outer columns. It has no\\neffect when \"],[10,\"code\"],[12],[1,\"@selection\"],[13],[1,\" is enabled.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_191\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { StructuredList } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <br>\\n    <StructuredList @isFlush=\"],[1,\"{{true}} as |SL|>\\n        <SL.Head>\\n            <SL.Row @head=\"],[1,\"{{true}}>\\n                <SL.Cell @head=\"],[1,\"{{true}}>ColumnA</SL.Cell>\\n                <SL.Cell @head=\"],[1,\"{{true}}>ColumnB</SL.Cell>\\n            </SL.Row>\\n        </SL.Head>\\n        <SL.Body>\\n            <SL.Row>\\n                <SL.Cell>Row 1</SL.Cell>\\n                <SL.Cell>Row 1</SL.Cell>\\n            </SL.Row>\\n        </SL.Body>\\n    </StructuredList>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"StructuredList\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_192\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,6],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_187, repl_188, repl_189, repl_190, repl_191, repl_192],
  "isStrictMode": true
}), templateOnly(undefined, "structured.gjs"));

export { structured_gjs as default };

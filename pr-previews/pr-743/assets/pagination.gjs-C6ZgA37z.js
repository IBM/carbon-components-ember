import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aI as CarbonPagination, f as helper, Z as CarbonCheckbox, j as fn, am as FormInput, t as templateOnly, af as trackedObject, o as on, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

const context = trackedObject({
  paginationLength: 100
});
const split = (char, text) => text?.split(char);
const not = x => !x;
const repl_66 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<Pagination
    @disabled={{context.disabled}}
    @isLoading={{context.isLoading}}
    @length={{context.paginationLength}}
    @itemsPerPageOptions={{split ' ' context.itemsPerPageOptions}}
    @onPageChanged={{set context 'currentSlice'}}
    @state={{context.currentSlice}}
/>

<label>
    currentSlice
</label>
page:
{{context.currentSlice.page}}<br />
start:
{{context.currentSlice.start}}<br />
end:
{{context.currentSlice.end}}<br />
<Checkbox
    @label="disabled"
    @checked={{context.disabled}}
    @onChange={{fn
    (set context 'disabled')
    (not context.disabled)
}}
/>
<Checkbox
    @label="is loading"
    @checked={{context.isLoading}}
    @onChange={{fn
    (set context 'isLoading')
    (not context.isLoading)
}}
/>
<label>
    itemsPerPage
</label>
<FormInput @onChange={{fn (set context 'itemsPerPageOptions')}} />
<label>
    paginationLength
</label>
<FormInput @onChange={{fn (set context 'paginationLength')}} />
*/
{
  "id": "93n+CzzU",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@disabled\",\"@isLoading\",\"@length\",\"@itemsPerPageOptions\",\"@onPageChanged\",\"@state\"],[[32,2,[\"disabled\"]],[32,2,[\"isLoading\"]],[32,2,[\"paginationLength\"]],[28,[32,3],[\" \",[32,2,[\"itemsPerPageOptions\"]]],null],[28,[32,4],[[32,2],\"currentSlice\"],null],[32,2,[\"currentSlice\"]]]],null],[1,\"\\n\\n\"],[10,\"label\"],[12],[1,\"\\n    currentSlice\\n\"],[13],[1,\"\\npage:\\n\"],[1,[32,2,[\"currentSlice\",\"page\"]]],[10,\"br\"],[12],[13],[1,\"\\nstart:\\n\"],[1,[32,2,[\"currentSlice\",\"start\"]]],[10,\"br\"],[12],[13],[1,\"\\nend:\\n\"],[1,[32,2,[\"currentSlice\",\"end\"]]],[10,\"br\"],[12],[13],[1,\"\\n\"],[8,[32,5],null,[[\"@label\",\"@checked\",\"@onChange\"],[\"disabled\",[32,2,[\"disabled\"]],[28,[32,6],[[28,[32,4],[[32,2],\"disabled\"],null],[28,[32,7],[[32,2,[\"disabled\"]]],null]],null]]],null],[1,\"\\n\"],[8,[32,5],null,[[\"@label\",\"@checked\",\"@onChange\"],[\"is loading\",[32,2,[\"isLoading\"]],[28,[32,6],[[28,[32,4],[[32,2],\"isLoading\"],null],[28,[32,7],[[32,2,[\"isLoading\"]]],null]],null]]],null],[1,\"\\n\"],[10,\"label\"],[12],[1,\"\\n    itemsPerPage\\n\"],[13],[1,\"\\n\"],[8,[32,8],null,[[\"@onChange\"],[[28,[32,6],[[28,[32,4],[[32,2],\"itemsPerPageOptions\"],null]],null]]],null],[1,\"\\n\"],[10,\"label\"],[12],[1,\"\\n    paginationLength\\n\"],[13],[1,\"\\n\"],[8,[32,8],null,[[\"@onChange\"],[[28,[32,6],[[28,[32,4],[[32,2],\"paginationLength\"],null]],null]]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonPagination, context, split, helper, CarbonCheckbox, fn, not, FormInput],
  "isStrictMode": true
}), templateOnly(undefined, "pagination.gjs"));

const noop$2 = () => null;
const repl_67 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<Pagination @size='xs' @length={{100}} @onPageChanged={{noop}} />
<Pagination @size='sm' @length={{100}} @onPageChanged={{noop}} />
<Pagination @size='md' @length={{100}} @onPageChanged={{noop}} />
<Pagination @size='lg' @length={{100}} @onPageChanged={{noop}} />
*/
{
  "id": "ADO9haNC",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@size\",\"@length\",\"@onPageChanged\"],[\"xs\",100,[32,2]]],null],[1,\"\\n\"],[8,[32,1],null,[[\"@size\",\"@length\",\"@onPageChanged\"],[\"sm\",100,[32,2]]],null],[1,\"\\n\"],[8,[32,1],null,[[\"@size\",\"@length\",\"@onPageChanged\"],[\"md\",100,[32,2]]],null],[1,\"\\n\"],[8,[32,1],null,[[\"@size\",\"@length\",\"@onPageChanged\"],[\"lg\",100,[32,2]]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonPagination, noop$2],
  "isStrictMode": true
}), templateOnly(undefined, "pagination.gjs"));

const noop$1 = () => null;
const repl_68 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<Pagination
    @length={{50}}
    @onPageChanged={{noop}}
    @backwardText='Prior page'
    @forwardText='Later page'
    @backwardTextTooltipPosition='bottom'
    @forwardTextTooltipPosition='bottom'
/>
*/
{
  "id": "9NuxAxl+",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@length\",\"@onPageChanged\",\"@backwardText\",\"@forwardText\",\"@backwardTextTooltipPosition\",\"@forwardTextTooltipPosition\"],[50,[32,2],\"Prior page\",\"Later page\",\"bottom\",\"bottom\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonPagination, noop$1],
  "isStrictMode": true
}), templateOnly(undefined, "pagination.gjs"));

const noop = () => null;
const CustomPageSelect = setComponentTemplate(templateFactory(
/*
  <span aria-label={{@pageSelectLabelText}}>
    Page
    <button type='button' {{on 'click' (fn @onSetPage 1)}}>1</button>
    of
    {{@totalPages}}
</span>
*/
{
  "id": "/lxUo9Bb",
  "block": "[[[10,1],[15,\"aria-label\",[30,1]],[12],[1,\"\\n    Page\\n    \"],[11,\"button\"],[24,4,\"button\"],[4,[32,0],[\"click\",[28,[32,1],[[30,2],1],null]],null],[12],[1,\"1\"],[13],[1,\"\\n    of\\n    \"],[1,[30,3]],[1,\"\\n\"],[13]],[\"@pageSelectLabelText\",\"@onSetPage\",\"@totalPages\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [on, fn],
  "isStrictMode": true
}), templateOnly(undefined, "pagination.gjs:CustomPageSelect"));
const repl_69 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<Pagination
    @length={{100}}
    @onPageChanged={{noop}}
    @renderPageSelect={{CustomPageSelect}}
/>
*/
{
  "id": "U9Df+I2y",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@length\",\"@onPageChanged\",\"@renderPageSelect\"],[100,[32,2],[32,3]]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonPagination, noop, CustomPageSelect],
  "isStrictMode": true
}), templateOnly(undefined, "pagination.gjs"));

const repl_70 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/pagination' 
  @name='default' 
/>
*/
{
  "id": "Vt9OA29w",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/pagination\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "pagination.gjs"));

const pagination_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="pagination">Pagination</h1>
<carbon-shadow-demo id="repl_66" class="repl-sdk__demo"><div><repl_66></repl_66></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Pagination, FormInput, Checkbox } from 'carbon-components-ember/components';
import { set } from 'carbon-components-ember/helpers';
import { fn } from '@ember/helper';
import { trackedObject } from '@ember/reactive/collections';
import { ThemeSupport } from 'docs-support';

const context = trackedObject({
    paginationLength: 100,
});

const split = (char, text) => text?.split(char);
const not = (x) => !x;

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;Pagination
        @disabled=\{{context.disabled}}
        @isLoading=\{{context.isLoading}}
        @length=\{{context.paginationLength}}
        @itemsPerPageOptions=\{{split ' ' context.itemsPerPageOptions}}
        @onPageChanged=\{{set context 'currentSlice'}}
        @state=\{{context.currentSlice}}
    />

    &#x3C;label>
        currentSlice
    &#x3C;/label>
    page:
    \{{context.currentSlice.page}}&#x3C;br />
    start:
    \{{context.currentSlice.start}}&#x3C;br />
    end:
    \{{context.currentSlice.end}}&#x3C;br />
    &#x3C;Checkbox
        @label="disabled"
        @checked=\{{context.disabled}}
        @onChange=\{{fn
        (set context 'disabled')
        (not context.disabled)
    }}
    />
    &#x3C;Checkbox
        @label="is loading"
        @checked=\{{context.isLoading}}
        @onChange=\{{fn
        (set context 'isLoading')
        (not context.isLoading)
    }}
    />
    &#x3C;label>
        itemsPerPage
    &#x3C;/label>
    &#x3C;FormInput @onChange=\{{fn (set context 'itemsPerPageOptions')}} />
    &#x3C;label>
        paginationLength
    &#x3C;/label>
    &#x3C;FormInput @onChange=\{{fn (set context 'paginationLength')}} />
&#x3C;/template>
</code></pre></div>
<details><summary>sizes</summary>
Pagination supports `xs`, `sm`, `md` and `lg` sizes via the `@size` argument.
<carbon-shadow-demo id="repl_67" class="repl-sdk__demo"><div><repl_67></repl_67></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Pagination } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const noop = () => null;

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;Pagination @size='xs' @length=\{{100}} @onPageChanged=\{{noop}} />
    &#x3C;Pagination @size='sm' @length=\{{100}} @onPageChanged=\{{noop}} />
    &#x3C;Pagination @size='md' @length=\{{100}} @onPageChanged=\{{noop}} />
    &#x3C;Pagination @size='lg' @length=\{{100}} @onPageChanged=\{{noop}} />
&#x3C;/template>
</code></pre></div>
</details>
<h2 id="customizing-the-navigation-button-text-and-tooltips">Customizing the navigation button text and tooltips</h2>
<p>Use <code>@backwardText</code>/<code>@forwardText</code> to customize the accessible label and
tooltip content of the navigation buttons, and
<code>@backwardTextTooltipPosition</code>/<code>@forwardTextTooltipPosition</code> to control where
the tooltip is placed.</p>
<carbon-shadow-demo id="repl_68" class="repl-sdk__demo"><div><repl_68></repl_68></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Pagination } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const noop = () => null;

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;Pagination
        @length=\{{50}}
        @onPageChanged=\{{noop}}
        @backwardText='Prior page'
        @forwardText='Later page'
        @backwardTextTooltipPosition='bottom'
        @forwardTextTooltipPosition='bottom'
    />
&#x3C;/template>
</code></pre></div>
<h2 id="custom-page-selection-control">Custom page-selection control</h2>
<p>Use <code>@renderPageSelect</code> to replace the default page-select control with a
custom component. It receives <code>@currentPage</code>, <code>@totalPages</code>,
<code>@currentPageSize</code>, <code>@pageSelectLabelText</code> and <code>@onSetPage</code>.</p>
<carbon-shadow-demo id="repl_69" class="repl-sdk__demo"><div><repl_69></repl_69></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Pagination } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

const noop = () => null;

const CustomPageSelect = &#x3C;template>
    &#x3C;span aria-label=\{{@pageSelectLabelText}}>
        Page
        &#x3C;button type='button' \{{on 'click' (fn @onSetPage 1)}}>1&#x3C;/button>
        of
        \{{@totalPages}}
    &#x3C;/span>
&#x3C;/template>;

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;Pagination
        @length=\{{100}}
        @onPageChanged=\{{noop}}
        @renderPageSelect=\{{CustomPageSelect}}
    />
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Pagination</h3></summary>
<div id="repl_70" class="repl-sdk__demo"><repl_70></repl_70></div>
</details>
*/
{
  "id": "kH06EYAo",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"pagination\"],[12],[1,\"Pagination\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_66\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Pagination, FormInput, Checkbox } from 'carbon-components-ember/components';\\nimport { set } from 'carbon-components-ember/helpers';\\nimport { fn } from '@ember/helper';\\nimport { trackedObject } from '@ember/reactive/collections';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst context = trackedObject({\\n    paginationLength: 100,\\n});\\n\\nconst split = (char, text) => text?.split(char);\\nconst not = (x) => !x;\\n\\n<template>\\n    <ThemeSupport />\\n    <Pagination\\n        @disabled=\"],[1,\"{{context.disabled}}\\n        @isLoading=\"],[1,\"{{context.isLoading}}\\n        @length=\"],[1,\"{{context.paginationLength}}\\n        @itemsPerPageOptions=\"],[1,\"{{split ' ' context.itemsPerPageOptions}}\\n        @onPageChanged=\"],[1,\"{{set context 'currentSlice'}}\\n        @state=\"],[1,\"{{context.currentSlice}}\\n    />\\n\\n    <label>\\n        currentSlice\\n    </label>\\n    page:\\n    \"],[1,\"{{context.currentSlice.page}}<br />\\n    start:\\n    \"],[1,\"{{context.currentSlice.start}}<br />\\n    end:\\n    \"],[1,\"{{context.currentSlice.end}}<br />\\n    <Checkbox\\n        @label=\\\"disabled\\\"\\n        @checked=\"],[1,\"{{context.disabled}}\\n        @onChange=\"],[1,\"{{fn\\n        (set context 'disabled')\\n        (not context.disabled)\\n    }}\\n    />\\n    <Checkbox\\n        @label=\\\"is loading\\\"\\n        @checked=\"],[1,\"{{context.isLoading}}\\n        @onChange=\"],[1,\"{{fn\\n        (set context 'isLoading')\\n        (not context.isLoading)\\n    }}\\n    />\\n    <label>\\n        itemsPerPage\\n    </label>\\n    <FormInput @onChange=\"],[1,\"{{fn (set context 'itemsPerPageOptions')}} />\\n    <label>\\n        paginationLength\\n    </label>\\n    <FormInput @onChange=\"],[1,\"{{fn (set context 'paginationLength')}} />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"details\"],[12],[10,\"summary\"],[12],[1,\"sizes\"],[13],[1,\"\\nPagination supports `xs`, `sm`, `md` and `lg` sizes via the `@size` argument.\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_67\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Pagination } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst noop = () => null;\\n\\n<template>\\n    <ThemeSupport />\\n    <Pagination @size='xs' @length=\"],[1,\"{{100}} @onPageChanged=\"],[1,\"{{noop}} />\\n    <Pagination @size='sm' @length=\"],[1,\"{{100}} @onPageChanged=\"],[1,\"{{noop}} />\\n    <Pagination @size='md' @length=\"],[1,\"{{100}} @onPageChanged=\"],[1,\"{{noop}} />\\n    <Pagination @size='lg' @length=\"],[1,\"{{100}} @onPageChanged=\"],[1,\"{{noop}} />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"customizing-the-navigation-button-text-and-tooltips\"],[12],[1,\"Customizing the navigation button text and tooltips\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Use \"],[10,\"code\"],[12],[1,\"@backwardText\"],[13],[1,\"/\"],[10,\"code\"],[12],[1,\"@forwardText\"],[13],[1,\" to customize the accessible label and\\ntooltip content of the navigation buttons, and\\n\"],[10,\"code\"],[12],[1,\"@backwardTextTooltipPosition\"],[13],[1,\"/\"],[10,\"code\"],[12],[1,\"@forwardTextTooltipPosition\"],[13],[1,\" to control where\\nthe tooltip is placed.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_68\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Pagination } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\nconst noop = () => null;\\n\\n<template>\\n    <ThemeSupport />\\n    <Pagination\\n        @length=\"],[1,\"{{50}}\\n        @onPageChanged=\"],[1,\"{{noop}}\\n        @backwardText='Prior page'\\n        @forwardText='Later page'\\n        @backwardTextTooltipPosition='bottom'\\n        @forwardTextTooltipPosition='bottom'\\n    />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"custom-page-selection-control\"],[12],[1,\"Custom page-selection control\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Use \"],[10,\"code\"],[12],[1,\"@renderPageSelect\"],[13],[1,\" to replace the default page-select control with a\\ncustom component. It receives \"],[10,\"code\"],[12],[1,\"@currentPage\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"@totalPages\"],[13],[1,\",\\n\"],[10,\"code\"],[12],[1,\"@currentPageSize\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"@pageSelectLabelText\"],[13],[1,\" and \"],[10,\"code\"],[12],[1,\"@onSetPage\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_69\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Pagination } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\nimport { on } from '@ember/modifier';\\nimport { fn } from '@ember/helper';\\n\\nconst noop = () => null;\\n\\nconst CustomPageSelect = <template>\\n    <span aria-label=\"],[1,\"{{@pageSelectLabelText}}>\\n        Page\\n        <button type='button' \"],[1,\"{{on 'click' (fn @onSetPage 1)}}>1</button>\\n        of\\n        \"],[1,\"{{@totalPages}}\\n    </span>\\n</template>;\\n\\n<template>\\n    <ThemeSupport />\\n    <Pagination\\n        @length=\"],[1,\"{{100}}\\n        @onPageChanged=\"],[1,\"{{noop}}\\n        @renderPageSelect=\"],[1,\"{{CustomPageSelect}}\\n    />\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Pagination\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_70\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_66, repl_67, repl_68, repl_69, repl_70],
  "isStrictMode": true
}), templateOnly(undefined, "pagination.gjs"));

export { pagination_gjs as default };

import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aU as TreeView, t as templateOnly, d as helper, Z as CarbonCheckbox, j as fn, f as helper$1, Y as RadioButtonGroup, aV as Folder, aW as Document, a4 as CarbonButton, al as not, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

const repl_148 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

<TreeView @label='Tree View' as |Node|>
  <Node @id='ai' @label='Artificial intelligence' as |Child|>
    <Child @id='machine-learning' @label='Machine learning' as |GrandChild|>
      <GrandChild @id='supervised' @label='Supervised learning' />
      <GrandChild @id='unsupervised' @label='Unsupervised learning' />
    </Child>
    <Child @id='nlp' @label='Natural language processing' />
  </Node>
  <Node @id='cloud' @label='Cloud computing' @isExpanded={{true}} as |Child|>
    <Child @id='iaas' @label='IaaS' />
    <Child @id='paas' @label='PaaS' />
    <Child @id='saas' @label='SaaS' @disabled={{true}} />
  </Node>
  <Node @id='security' @label='Security' />
</TreeView>
*/
{
  "id": "lU2JHIw1",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@label\"],[\"Tree View\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1],null,[[\"@id\",\"@label\"],[\"ai\",\"Artificial intelligence\"]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,2],null,[[\"@id\",\"@label\"],[\"machine-learning\",\"Machine learning\"]],[[\"default\"],[[[[1,\"\\n      \"],[8,[30,3],null,[[\"@id\",\"@label\"],[\"supervised\",\"Supervised learning\"]],null],[1,\"\\n      \"],[8,[30,3],null,[[\"@id\",\"@label\"],[\"unsupervised\",\"Unsupervised learning\"]],null],[1,\"\\n    \"]],[3]]]]],[1,\"\\n    \"],[8,[30,2],null,[[\"@id\",\"@label\"],[\"nlp\",\"Natural language processing\"]],null],[1,\"\\n  \"]],[2]]]]],[1,\"\\n  \"],[8,[30,1],null,[[\"@id\",\"@label\",\"@isExpanded\"],[\"cloud\",\"Cloud computing\",true]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,4],null,[[\"@id\",\"@label\"],[\"iaas\",\"IaaS\"]],null],[1,\"\\n    \"],[8,[30,4],null,[[\"@id\",\"@label\"],[\"paas\",\"PaaS\"]],null],[1,\"\\n    \"],[8,[30,4],null,[[\"@id\",\"@label\",\"@disabled\"],[\"saas\",\"SaaS\",true]],null],[1,\"\\n  \"]],[4]]]]],[1,\"\\n  \"],[8,[30,1],null,[[\"@id\",\"@label\"],[\"security\",\"Security\"]],null],[1,\"\\n\"]],[1]]]]]],[\"Node\",\"Child\",\"GrandChild\",\"Child\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TreeView],
  "isStrictMode": true
}), templateOnly(undefined, "tree-view.gjs"));

const repl_149 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

{{#let (newObj) as |context|}}
  <Checkbox
    @name='multiselect'
    @label='multiselect'
    @checked={{context.multiselect}}
    @onChange={{fn (set context 'multiselect')}}
  />
  <RadioButtonGroup @onChange={{fn (set context 'size')}}>
    <:heading>size</:heading>
    <:default as |Radio|>
      <Radio @defaultChecked={{true}} @value='sm'>sm</Radio>
      <Radio @value='xs'>xs</Radio>
    </:default>
  </RadioButtonGroup>
  <br />

  <TreeView
    @label='Tree View'
    @multiselect={{context.multiselect}}
    @size={{context.size}}
    @onSelect={{fn (set context 'selected')}}
    as |Node|
  >
    <Node @id='ai' @label='Artificial intelligence' as |Child|>
      <Child @id='machine-learning' @label='Machine learning' />
      <Child @id='nlp' @label='Natural language processing' />
    </Node>
    <Node @id='cloud' @label='Cloud computing' @isExpanded={{true}} as |Child|>
      <Child @id='iaas' @label='IaaS' />
      <Child @id='paas' @label='PaaS' />
    </Node>
    <Node @id='security' @label='Security' />
  </TreeView>
  <p>Selected: {{context.selected}}</p>
{{/let}}
*/
{
  "id": "UagOg7kG",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[44,[[28,[32,1],null,null]],[[[1,\"  \"],[8,[32,2],null,[[\"@name\",\"@label\",\"@checked\",\"@onChange\"],[\"multiselect\",\"multiselect\",[30,1,[\"multiselect\"]],[28,[32,3],[[28,[32,4],[[30,1],\"multiselect\"],null]],null]]],null],[1,\"\\n  \"],[8,[32,5],null,[[\"@onChange\"],[[28,[32,3],[[28,[32,4],[[30,1],\"size\"],null]],null]]],[[\"heading\",\"default\"],[[[[1,\"size\"]],[]],[[[1,\"\\n      \"],[8,[30,2],null,[[\"@defaultChecked\",\"@value\"],[true,\"sm\"]],[[\"default\"],[[[[1,\"sm\"]],[]]]]],[1,\"\\n      \"],[8,[30,2],null,[[\"@value\"],[\"xs\"]],[[\"default\"],[[[[1,\"xs\"]],[]]]]],[1,\"\\n    \"]],[2]]]]],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n\\n  \"],[8,[32,6],null,[[\"@label\",\"@multiselect\",\"@size\",\"@onSelect\"],[\"Tree View\",[30,1,[\"multiselect\"]],[30,1,[\"size\"]],[28,[32,3],[[28,[32,4],[[30,1],\"selected\"],null]],null]]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,3],null,[[\"@id\",\"@label\"],[\"ai\",\"Artificial intelligence\"]],[[\"default\"],[[[[1,\"\\n      \"],[8,[30,4],null,[[\"@id\",\"@label\"],[\"machine-learning\",\"Machine learning\"]],null],[1,\"\\n      \"],[8,[30,4],null,[[\"@id\",\"@label\"],[\"nlp\",\"Natural language processing\"]],null],[1,\"\\n    \"]],[4]]]]],[1,\"\\n    \"],[8,[30,3],null,[[\"@id\",\"@label\",\"@isExpanded\"],[\"cloud\",\"Cloud computing\",true]],[[\"default\"],[[[[1,\"\\n      \"],[8,[30,5],null,[[\"@id\",\"@label\"],[\"iaas\",\"IaaS\"]],null],[1,\"\\n      \"],[8,[30,5],null,[[\"@id\",\"@label\"],[\"paas\",\"PaaS\"]],null],[1,\"\\n    \"]],[5]]]]],[1,\"\\n    \"],[8,[30,3],null,[[\"@id\",\"@label\"],[\"security\",\"Security\"]],null],[1,\"\\n  \"]],[3]]]]],[1,\"\\n  \"],[10,2],[12],[1,\"Selected: \"],[1,[30,1,[\"selected\"]]],[13],[1,\"\\n\"]],[1]]]],[\"context\",\"Radio\",\"Node\",\"Child\",\"Child\"],[\"let\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, CarbonCheckbox, fn, helper$1, RadioButtonGroup, TreeView],
  "isStrictMode": true
}), templateOnly(undefined, "tree-view.gjs"));

const repl_150 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

<TreeView @label='Tree View' as |Node|>
  <Node @id='ai' @label='Artificial intelligence' @icon={{Folder}} as |Child|>
    <Child @id='machine-learning' @label='Machine learning' @icon={{Document}} />
    <Child @id='nlp' @label='Natural language processing' @icon={{Document}} />
  </Node>
  <Node @id='cloud' @label='Cloud computing' @icon={{Folder}} @isExpanded={{true}} as |Child|>
    <Child @id='iaas' @label='IaaS' @icon={{Document}} />
    <Child @id='paas' @label='PaaS' @icon={{Document}} />
  </Node>
  <Node @id='security' @label='Security' @icon={{Document}} />
</TreeView>
*/
{
  "id": "/NZvNVVM",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@label\"],[\"Tree View\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1],null,[[\"@id\",\"@label\",\"@icon\"],[\"ai\",\"Artificial intelligence\",[32,2]]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,2],null,[[\"@id\",\"@label\",\"@icon\"],[\"machine-learning\",\"Machine learning\",[32,3]]],null],[1,\"\\n    \"],[8,[30,2],null,[[\"@id\",\"@label\",\"@icon\"],[\"nlp\",\"Natural language processing\",[32,3]]],null],[1,\"\\n  \"]],[2]]]]],[1,\"\\n  \"],[8,[30,1],null,[[\"@id\",\"@label\",\"@icon\",\"@isExpanded\"],[\"cloud\",\"Cloud computing\",[32,2],true]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,3],null,[[\"@id\",\"@label\",\"@icon\"],[\"iaas\",\"IaaS\",[32,3]]],null],[1,\"\\n    \"],[8,[30,3],null,[[\"@id\",\"@label\",\"@icon\"],[\"paas\",\"PaaS\",[32,3]]],null],[1,\"\\n  \"]],[3]]]]],[1,\"\\n  \"],[8,[30,1],null,[[\"@id\",\"@label\",\"@icon\"],[\"security\",\"Security\",[32,3]]],null],[1,\"\\n\"]],[1]]]]]],[\"Node\",\"Child\",\"Child\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TreeView, Folder, Document],
  "isStrictMode": true
}), templateOnly(undefined, "tree-view.gjs"));

const repl_151 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

{{#let (newObj cloudExpanded=true) as |context|}}
  <Button @onClick={{fn (set context 'cloudExpanded') (not context.cloudExpanded)}}>
    Toggle "Cloud computing"
  </Button>
  <br />
  <br />

  <TreeView @label='Tree View' as |Node|>
    <Node
      @id='cloud'
      @label='Cloud computing'
      @isExpanded={{context.cloudExpanded}}
      @onToggle={{fn (set context 'cloudExpanded')}}
      as |Child|
    >
      <Child @id='iaas' @label='IaaS' />
      <Child @id='paas' @label='PaaS' />
    </Node>
    <Node @id='security' @label='Security' />
  </TreeView>
{{/let}}
*/
{
  "id": "BT4f+6Om",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[44,[[28,[32,1],null,[[\"cloudExpanded\"],[true]]]],[[[1,\"  \"],[8,[32,2],null,[[\"@onClick\"],[[28,[32,3],[[28,[32,4],[[30,1],\"cloudExpanded\"],null],[28,[32,5],[[30,1,[\"cloudExpanded\"]]],null]],null]]],[[\"default\"],[[[[1,\"\\n    Toggle \\\"Cloud computing\\\"\\n  \"]],[]]]]],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n\\n  \"],[8,[32,6],null,[[\"@label\"],[\"Tree View\"]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,2],null,[[\"@id\",\"@label\",\"@isExpanded\",\"@onToggle\"],[\"cloud\",\"Cloud computing\",[30,1,[\"cloudExpanded\"]],[28,[32,3],[[28,[32,4],[[30,1],\"cloudExpanded\"],null]],null]]],[[\"default\"],[[[[1,\"\\n      \"],[8,[30,3],null,[[\"@id\",\"@label\"],[\"iaas\",\"IaaS\"]],null],[1,\"\\n      \"],[8,[30,3],null,[[\"@id\",\"@label\"],[\"paas\",\"PaaS\"]],null],[1,\"\\n    \"]],[3]]]]],[1,\"\\n    \"],[8,[30,2],null,[[\"@id\",\"@label\"],[\"security\",\"Security\"]],null],[1,\"\\n  \"]],[2]]]]],[1,\"\\n\"]],[1]]]],[\"context\",\"Node\",\"Child\"],[\"let\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, CarbonButton, fn, helper$1, not, TreeView],
  "isStrictMode": true
}), templateOnly(undefined, "tree-view.gjs"));

const repl_152 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

<TreeView @label='Tree View' as |Node|>
  <Node @id='ai' @label='Artificial intelligence' @disabled={{true}} as |Child|>
    <Child @id='machine-learning' @label='Machine learning' />
    <Child @id='nlp' @label='Natural language processing' />
  </Node>
  <Node @id='cloud' @label='Cloud computing' @isExpanded={{true}} as |Child|>
    <Child @id='iaas' @label='IaaS' />
    <Child @id='paas' @label='PaaS' @disabled={{true}} />
  </Node>
  <Node @id='security' @label='Security' />
</TreeView>
*/
{
  "id": "CMKW4nl4",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@label\"],[\"Tree View\"]],[[\"default\"],[[[[1,\"\\n  \"],[8,[30,1],null,[[\"@id\",\"@label\",\"@disabled\"],[\"ai\",\"Artificial intelligence\",true]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,2],null,[[\"@id\",\"@label\"],[\"machine-learning\",\"Machine learning\"]],null],[1,\"\\n    \"],[8,[30,2],null,[[\"@id\",\"@label\"],[\"nlp\",\"Natural language processing\"]],null],[1,\"\\n  \"]],[2]]]]],[1,\"\\n  \"],[8,[30,1],null,[[\"@id\",\"@label\",\"@isExpanded\"],[\"cloud\",\"Cloud computing\",true]],[[\"default\"],[[[[1,\"\\n    \"],[8,[30,3],null,[[\"@id\",\"@label\"],[\"iaas\",\"IaaS\"]],null],[1,\"\\n    \"],[8,[30,3],null,[[\"@id\",\"@label\",\"@disabled\"],[\"paas\",\"PaaS\",true]],null],[1,\"\\n  \"]],[3]]]]],[1,\"\\n  \"],[8,[30,1],null,[[\"@id\",\"@label\"],[\"security\",\"Security\"]],null],[1,\"\\n\"]],[1]]]]]],[\"Node\",\"Child\",\"Child\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, TreeView],
  "isStrictMode": true
}), templateOnly(undefined, "tree-view.gjs"));

const repl_153 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/tree-view'
  @name='default'
/>
*/
{
  "id": "iQpnqEsH",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/tree-view\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "tree-view.gjs"));

const treeView_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="tree-view">TreeView</h1>
<p>TreeView is used to render a hierarchical list of nested items that can be
expanded or collapsed. Each node yields a bound <code>TreeNode</code> component that can
be nested arbitrarily deep to build out the tree, and select or activate a
node by clicking on it.</p>
<carbon-shadow-demo id="repl_148" class="repl-sdk__demo"><div><repl_148></repl_148></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TreeView } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  &#x3C;TreeView @label='Tree View' as |Node|>
    &#x3C;Node @id='ai' @label='Artificial intelligence' as |Child|>
      &#x3C;Child @id='machine-learning' @label='Machine learning' as |GrandChild|>
        &#x3C;GrandChild @id='supervised' @label='Supervised learning' />
        &#x3C;GrandChild @id='unsupervised' @label='Unsupervised learning' />
      &#x3C;/Child>
      &#x3C;Child @id='nlp' @label='Natural language processing' />
    &#x3C;/Node>
    &#x3C;Node @id='cloud' @label='Cloud computing' @isExpanded=\{{true}} as |Child|>
      &#x3C;Child @id='iaas' @label='IaaS' />
      &#x3C;Child @id='paas' @label='PaaS' />
      &#x3C;Child @id='saas' @label='SaaS' @disabled=\{{true}} />
    &#x3C;/Node>
    &#x3C;Node @id='security' @label='Security' />
  &#x3C;/TreeView>
&#x3C;/template>
</code></pre></div>
<h2 id="selection">Selection</h2>
<p>By default only a single node can be selected at a time. Passing
<code>@multiselect=\{{true}}</code> allows selecting additional nodes by clicking
while holding the <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> key. The <code>@onSelect</code>
argument is called with the array of currently selected node ids and the
node that triggered the change, and <code>@onActivate</code> is called with the id of
the node that received keyboard/click focus.</p>
<carbon-shadow-demo id="repl_149" class="repl-sdk__demo"><div><repl_149></repl_149></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { fn } from '@ember/helper';
import { TreeView, Checkbox, RadioButtonGroup } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  \{{#let (newObj) as |context|}}
    &#x3C;Checkbox
      @name='multiselect'
      @label='multiselect'
      @checked=\{{context.multiselect}}
      @onChange=\{{fn (set context 'multiselect')}}
    />
    &#x3C;RadioButtonGroup @onChange=\{{fn (set context 'size')}}>
      &#x3C;:heading>size&#x3C;/:heading>
      &#x3C;:default as |Radio|>
        &#x3C;Radio @defaultChecked=\{{true}} @value='sm'>sm&#x3C;/Radio>
        &#x3C;Radio @value='xs'>xs&#x3C;/Radio>
      &#x3C;/:default>
    &#x3C;/RadioButtonGroup>
    &#x3C;br />

    &#x3C;TreeView
      @label='Tree View'
      @multiselect=\{{context.multiselect}}
      @size=\{{context.size}}
      @onSelect=\{{fn (set context 'selected')}}
      as |Node|
    >
      &#x3C;Node @id='ai' @label='Artificial intelligence' as |Child|>
        &#x3C;Child @id='machine-learning' @label='Machine learning' />
        &#x3C;Child @id='nlp' @label='Natural language processing' />
      &#x3C;/Node>
      &#x3C;Node @id='cloud' @label='Cloud computing' @isExpanded=\{{true}} as |Child|>
        &#x3C;Child @id='iaas' @label='IaaS' />
        &#x3C;Child @id='paas' @label='PaaS' />
      &#x3C;/Node>
      &#x3C;Node @id='security' @label='Security' />
    &#x3C;/TreeView>
    &#x3C;p>Selected: \{{context.selected}}&#x3C;/p>
  \{{/let}}
&#x3C;/template>
</code></pre></div>
<h2 id="with-icons">With icons</h2>
<p>Passing <code>@icon</code> (any of the icon components exported from
<code>carbon-components-ember/icons</code>) renders it before the node's label.</p>
<carbon-shadow-demo id="repl_150" class="repl-sdk__demo"><div><repl_150></repl_150></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TreeView } from 'carbon-components-ember/components';
import { Folder, Document } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  &#x3C;TreeView @label='Tree View' as |Node|>
    &#x3C;Node @id='ai' @label='Artificial intelligence' @icon=\{{Folder}} as |Child|>
      &#x3C;Child @id='machine-learning' @label='Machine learning' @icon=\{{Document}} />
      &#x3C;Child @id='nlp' @label='Natural language processing' @icon=\{{Document}} />
    &#x3C;/Node>
    &#x3C;Node @id='cloud' @label='Cloud computing' @icon=\{{Folder}} @isExpanded=\{{true}} as |Child|>
      &#x3C;Child @id='iaas' @label='IaaS' @icon=\{{Document}} />
      &#x3C;Child @id='paas' @label='PaaS' @icon=\{{Document}} />
    &#x3C;/Node>
    &#x3C;Node @id='security' @label='Security' @icon=\{{Document}} />
  &#x3C;/TreeView>
&#x3C;/template>
</code></pre></div>
<h2 id="controlled-expansion">Controlled expansion</h2>
<p><code>@isExpanded</code> is uncontrolled by default (it only sets the node's initial
state). Passing <code>@onToggle</code> alongside a bound <code>@isExpanded</code> makes the node
fully controlled — its expansion always reflects <code>@isExpanded</code>, so it stays
in sync with whatever else drives that value (like the button below), not
just clicks on its own toggle caret.</p>
<carbon-shadow-demo id="repl_151" class="repl-sdk__demo"><div><repl_151></repl_151></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { fn } from '@ember/helper';
import { not } from 'ember-truth-helpers';
import { TreeView, Button } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  \{{#let (newObj cloudExpanded=true) as |context|}}
    &#x3C;Button @onClick=\{{fn (set context 'cloudExpanded') (not context.cloudExpanded)}}>
      Toggle "Cloud computing"
    &#x3C;/Button>
    &#x3C;br />
    &#x3C;br />

    &#x3C;TreeView @label='Tree View' as |Node|>
      &#x3C;Node
        @id='cloud'
        @label='Cloud computing'
        @isExpanded=\{{context.cloudExpanded}}
        @onToggle=\{{fn (set context 'cloudExpanded')}}
        as |Child|
      >
        &#x3C;Child @id='iaas' @label='IaaS' />
        &#x3C;Child @id='paas' @label='PaaS' />
      &#x3C;/Node>
      &#x3C;Node @id='security' @label='Security' />
    &#x3C;/TreeView>
  \{{/let}}
&#x3C;/template>
</code></pre></div>
<h2 id="disabled-state">Disabled state</h2>
<p>Passing <code>@disabled=\{{true}}</code> on a node prevents it from being selected or
receiving keyboard focus (it's removed from the tab order), while it still
renders in place, dimmed. On a parent node, its toggle caret stays usable so
its descendants remain reachable.</p>
<carbon-shadow-demo id="repl_152" class="repl-sdk__demo"><div><repl_152></repl_152></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { TreeView } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  &#x3C;TreeView @label='Tree View' as |Node|>
    &#x3C;Node @id='ai' @label='Artificial intelligence' @disabled=\{{true}} as |Child|>
      &#x3C;Child @id='machine-learning' @label='Machine learning' />
      &#x3C;Child @id='nlp' @label='Natural language processing' />
    &#x3C;/Node>
    &#x3C;Node @id='cloud' @label='Cloud computing' @isExpanded=\{{true}} as |Child|>
      &#x3C;Child @id='iaas' @label='IaaS' />
      &#x3C;Child @id='paas' @label='PaaS' @disabled=\{{true}} />
    &#x3C;/Node>
    &#x3C;Node @id='security' @label='Security' />
  &#x3C;/TreeView>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>TreeView</h3></summary>
<div id="repl_153" class="repl-sdk__demo"><repl_153></repl_153></div>
</details>
*/
{
  "id": "BrDj64hI",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"tree-view\"],[12],[1,\"TreeView\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"TreeView is used to render a hierarchical list of nested items that can be\\nexpanded or collapsed. Each node yields a bound \"],[10,\"code\"],[12],[1,\"TreeNode\"],[13],[1,\" component that can\\nbe nested arbitrarily deep to build out the tree, and select or activate a\\nnode by clicking on it.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_148\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TreeView } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  <TreeView @label='Tree View' as |Node|>\\n    <Node @id='ai' @label='Artificial intelligence' as |Child|>\\n      <Child @id='machine-learning' @label='Machine learning' as |GrandChild|>\\n        <GrandChild @id='supervised' @label='Supervised learning' />\\n        <GrandChild @id='unsupervised' @label='Unsupervised learning' />\\n      </Child>\\n      <Child @id='nlp' @label='Natural language processing' />\\n    </Node>\\n    <Node @id='cloud' @label='Cloud computing' @isExpanded=\"],[1,\"{{true}} as |Child|>\\n      <Child @id='iaas' @label='IaaS' />\\n      <Child @id='paas' @label='PaaS' />\\n      <Child @id='saas' @label='SaaS' @disabled=\"],[1,\"{{true}} />\\n    </Node>\\n    <Node @id='security' @label='Security' />\\n  </TreeView>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"selection\"],[12],[1,\"Selection\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"By default only a single node can be selected at a time. Passing\\n\"],[10,\"code\"],[12],[1,\"@multiselect=\"],[1,\"{{true}}\"],[13],[1,\" allows selecting additional nodes by clicking\\nwhile holding the \"],[10,\"kbd\"],[12],[1,\"Cmd\"],[13],[1,\"/\"],[10,\"kbd\"],[12],[1,\"Ctrl\"],[13],[1,\" key. The \"],[10,\"code\"],[12],[1,\"@onSelect\"],[13],[1,\"\\nargument is called with the array of currently selected node ids and the\\nnode that triggered the change, and \"],[10,\"code\"],[12],[1,\"@onActivate\"],[13],[1,\" is called with the id of\\nthe node that received keyboard/click focus.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_149\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { fn } from '@ember/helper';\\nimport { TreeView, Checkbox, RadioButtonGroup } from 'carbon-components-ember/components';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  \"],[1,\"{{#let (newObj) as |context|}}\\n    <Checkbox\\n      @name='multiselect'\\n      @label='multiselect'\\n      @checked=\"],[1,\"{{context.multiselect}}\\n      @onChange=\"],[1,\"{{fn (set context 'multiselect')}}\\n    />\\n    <RadioButtonGroup @onChange=\"],[1,\"{{fn (set context 'size')}}>\\n      <:heading>size</:heading>\\n      <:default as |Radio|>\\n        <Radio @defaultChecked=\"],[1,\"{{true}} @value='sm'>sm</Radio>\\n        <Radio @value='xs'>xs</Radio>\\n      </:default>\\n    </RadioButtonGroup>\\n    <br />\\n\\n    <TreeView\\n      @label='Tree View'\\n      @multiselect=\"],[1,\"{{context.multiselect}}\\n      @size=\"],[1,\"{{context.size}}\\n      @onSelect=\"],[1,\"{{fn (set context 'selected')}}\\n      as |Node|\\n    >\\n      <Node @id='ai' @label='Artificial intelligence' as |Child|>\\n        <Child @id='machine-learning' @label='Machine learning' />\\n        <Child @id='nlp' @label='Natural language processing' />\\n      </Node>\\n      <Node @id='cloud' @label='Cloud computing' @isExpanded=\"],[1,\"{{true}} as |Child|>\\n        <Child @id='iaas' @label='IaaS' />\\n        <Child @id='paas' @label='PaaS' />\\n      </Node>\\n      <Node @id='security' @label='Security' />\\n    </TreeView>\\n    <p>Selected: \"],[1,\"{{context.selected}}</p>\\n  \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"with-icons\"],[12],[1,\"With icons\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Passing \"],[10,\"code\"],[12],[1,\"@icon\"],[13],[1,\" (any of the icon components exported from\\n\"],[10,\"code\"],[12],[1,\"carbon-components-ember/icons\"],[13],[1,\") renders it before the node's label.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_150\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TreeView } from 'carbon-components-ember/components';\\nimport { Folder, Document } from 'carbon-components-ember/icons';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  <TreeView @label='Tree View' as |Node|>\\n    <Node @id='ai' @label='Artificial intelligence' @icon=\"],[1,\"{{Folder}} as |Child|>\\n      <Child @id='machine-learning' @label='Machine learning' @icon=\"],[1,\"{{Document}} />\\n      <Child @id='nlp' @label='Natural language processing' @icon=\"],[1,\"{{Document}} />\\n    </Node>\\n    <Node @id='cloud' @label='Cloud computing' @icon=\"],[1,\"{{Folder}} @isExpanded=\"],[1,\"{{true}} as |Child|>\\n      <Child @id='iaas' @label='IaaS' @icon=\"],[1,\"{{Document}} />\\n      <Child @id='paas' @label='PaaS' @icon=\"],[1,\"{{Document}} />\\n    </Node>\\n    <Node @id='security' @label='Security' @icon=\"],[1,\"{{Document}} />\\n  </TreeView>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"controlled-expansion\"],[12],[1,\"Controlled expansion\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"@isExpanded\"],[13],[1,\" is uncontrolled by default (it only sets the node's initial\\nstate). Passing \"],[10,\"code\"],[12],[1,\"@onToggle\"],[13],[1,\" alongside a bound \"],[10,\"code\"],[12],[1,\"@isExpanded\"],[13],[1,\" makes the node\\nfully controlled — its expansion always reflects \"],[10,\"code\"],[12],[1,\"@isExpanded\"],[13],[1,\", so it stays\\nin sync with whatever else drives that value (like the button below), not\\njust clicks on its own toggle caret.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_151\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { fn } from '@ember/helper';\\nimport { not } from 'ember-truth-helpers';\\nimport { TreeView, Button } from 'carbon-components-ember/components';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  \"],[1,\"{{#let (newObj cloudExpanded=true) as |context|}}\\n    <Button @onClick=\"],[1,\"{{fn (set context 'cloudExpanded') (not context.cloudExpanded)}}>\\n      Toggle \\\"Cloud computing\\\"\\n    </Button>\\n    <br />\\n    <br />\\n\\n    <TreeView @label='Tree View' as |Node|>\\n      <Node\\n        @id='cloud'\\n        @label='Cloud computing'\\n        @isExpanded=\"],[1,\"{{context.cloudExpanded}}\\n        @onToggle=\"],[1,\"{{fn (set context 'cloudExpanded')}}\\n        as |Child|\\n      >\\n        <Child @id='iaas' @label='IaaS' />\\n        <Child @id='paas' @label='PaaS' />\\n      </Node>\\n      <Node @id='security' @label='Security' />\\n    </TreeView>\\n  \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"disabled-state\"],[12],[1,\"Disabled state\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Passing \"],[10,\"code\"],[12],[1,\"@disabled=\"],[1,\"{{true}}\"],[13],[1,\" on a node prevents it from being selected or\\nreceiving keyboard focus (it's removed from the tab order), while it still\\nrenders in place, dimmed. On a parent node, its toggle caret stays usable so\\nits descendants remain reachable.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_152\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { TreeView } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  <TreeView @label='Tree View' as |Node|>\\n    <Node @id='ai' @label='Artificial intelligence' @disabled=\"],[1,\"{{true}} as |Child|>\\n      <Child @id='machine-learning' @label='Machine learning' />\\n      <Child @id='nlp' @label='Natural language processing' />\\n    </Node>\\n    <Node @id='cloud' @label='Cloud computing' @isExpanded=\"],[1,\"{{true}} as |Child|>\\n      <Child @id='iaas' @label='IaaS' />\\n      <Child @id='paas' @label='PaaS' @disabled=\"],[1,\"{{true}} />\\n    </Node>\\n    <Node @id='security' @label='Security' />\\n  </TreeView>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"TreeView\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_153\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,6],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_148, repl_149, repl_150, repl_151, repl_152, repl_153],
  "isStrictMode": true
}), templateOnly(undefined, "tree-view.gjs"));

export { treeView_gjs as default };

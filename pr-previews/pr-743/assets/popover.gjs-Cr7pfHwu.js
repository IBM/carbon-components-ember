import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, d as helper, b9 as Popover, j as fn, f as helper$1, o as on, al as not, ba as Checkbox, bb as PopoverContent, t as templateOnly, Z as CarbonCheckbox, bc as Settings, Y as RadioButtonGroup, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_71 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

{{#let (newObj open=true) as |context|}}
  <Popover
    @open={{context.open}}
    @onRequestClose={{fn (set context 'open') false}}
  >
    <button
      type='button'
      aria-label='Available storage'
      aria-expanded={{context.open}}
      {{on 'click' (fn (set context 'open') (not context.open))}}
    >
      <CheckboxIcon />
    </button>
    <PopoverContent style='padding: 1rem;'>
      <h4>Available storage</h4>
      <p>This server has 150 GB of block storage remaining.</p>
    </PopoverContent>
  </Popover>
{{/let}}
*/
{
  "id": "2Zwh3WuH",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[44,[[28,[32,1],null,[[\"open\"],[true]]]],[[[1,\"  \"],[8,[32,2],null,[[\"@open\",\"@onRequestClose\"],[[30,1,[\"open\"]],[28,[32,3],[[28,[32,4],[[30,1],\"open\"],null],false],null]]],[[\"default\"],[[[[1,\"\\n    \"],[11,\"button\"],[24,\"aria-label\",\"Available storage\"],[16,\"aria-expanded\",[30,1,[\"open\"]]],[24,4,\"button\"],[4,[32,5],[\"click\",[28,[32,3],[[28,[32,4],[[30,1],\"open\"],null],[28,[32,6],[[30,1,[\"open\"]]],null]],null]],null],[12],[1,\"\\n      \"],[8,[32,7],null,null,null],[1,\"\\n    \"],[13],[1,\"\\n    \"],[8,[32,8],[[24,5,\"padding: 1rem;\"]],null,[[\"default\"],[[[[1,\"\\n      \"],[10,\"h4\"],[12],[1,\"Available storage\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"This server has 150 GB of block storage remaining.\"],[13],[1,\"\\n    \"]],[]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]],[\"context\"],[\"let\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, Popover, fn, helper$1, on, not, Checkbox, PopoverContent],
  "isStrictMode": true
}), templateOnly(undefined, "popover.gjs"));

const repl_72 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

{{#let
  (newObj
    open=true
    caret=true
    dropShadow=true
    border=false
    highContrast=false
  )
  as |context|
}}
  <Checkbox
    @label='caret'
    @checked={{context.caret}}
    @onChange={{fn (set context 'caret')}}
  />
  <Checkbox
    @label='dropShadow'
    @checked={{context.dropShadow}}
    @onChange={{fn (set context 'dropShadow')}}
  />
  <Checkbox
    @label='border'
    @checked={{context.border}}
    @onChange={{fn (set context 'border')}}
  />
  <Checkbox
    @label='highContrast'
    @checked={{context.highContrast}}
    @onChange={{fn (set context 'highContrast')}}
  />
  <br />
  <br />

  <Popover
    @open={{context.open}}
    @caret={{context.caret}}
    @dropShadow={{context.dropShadow}}
    @border={{context.border}}
    @highContrast={{context.highContrast}}
    @onRequestClose={{fn (set context 'open') false}}
  >
    <button
      type='button'
      aria-label='Available storage'
      aria-expanded={{context.open}}
      {{on 'click' (fn (set context 'open') (not context.open))}}
    >
      <CheckboxIcon />
    </button>
    <PopoverContent style='padding: 1rem;'>
      <h4>Available storage</h4>
      <p>This server has 150 GB of block storage remaining.</p>
    </PopoverContent>
  </Popover>
{{/let}}
*/
{
  "id": "YKCQyRpt",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[44,[[28,[32,1],null,[[\"open\",\"caret\",\"dropShadow\",\"border\",\"highContrast\"],[true,true,true,false,false]]]],[[[1,\"  \"],[8,[32,2],null,[[\"@label\",\"@checked\",\"@onChange\"],[\"caret\",[30,1,[\"caret\"]],[28,[32,3],[[28,[32,4],[[30,1],\"caret\"],null]],null]]],null],[1,\"\\n  \"],[8,[32,2],null,[[\"@label\",\"@checked\",\"@onChange\"],[\"dropShadow\",[30,1,[\"dropShadow\"]],[28,[32,3],[[28,[32,4],[[30,1],\"dropShadow\"],null]],null]]],null],[1,\"\\n  \"],[8,[32,2],null,[[\"@label\",\"@checked\",\"@onChange\"],[\"border\",[30,1,[\"border\"]],[28,[32,3],[[28,[32,4],[[30,1],\"border\"],null]],null]]],null],[1,\"\\n  \"],[8,[32,2],null,[[\"@label\",\"@checked\",\"@onChange\"],[\"highContrast\",[30,1,[\"highContrast\"]],[28,[32,3],[[28,[32,4],[[30,1],\"highContrast\"],null]],null]]],null],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n  \"],[10,\"br\"],[12],[13],[1,\"\\n\\n  \"],[8,[32,5],null,[[\"@open\",\"@caret\",\"@dropShadow\",\"@border\",\"@highContrast\",\"@onRequestClose\"],[[30,1,[\"open\"]],[30,1,[\"caret\"]],[30,1,[\"dropShadow\"]],[30,1,[\"border\"]],[30,1,[\"highContrast\"]],[28,[32,3],[[28,[32,4],[[30,1],\"open\"],null],false],null]]],[[\"default\"],[[[[1,\"\\n    \"],[11,\"button\"],[24,\"aria-label\",\"Available storage\"],[16,\"aria-expanded\",[30,1,[\"open\"]]],[24,4,\"button\"],[4,[32,6],[\"click\",[28,[32,3],[[28,[32,4],[[30,1],\"open\"],null],[28,[32,7],[[30,1,[\"open\"]]],null]],null]],null],[12],[1,\"\\n      \"],[8,[32,8],null,null,null],[1,\"\\n    \"],[13],[1,\"\\n    \"],[8,[32,9],[[24,5,\"padding: 1rem;\"]],null,[[\"default\"],[[[[1,\"\\n      \"],[10,\"h4\"],[12],[1,\"Available storage\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"This server has 150 GB of block storage remaining.\"],[13],[1,\"\\n    \"]],[]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]],[\"context\"],[\"let\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, CarbonCheckbox, fn, helper$1, Popover, on, not, Checkbox, PopoverContent],
  "isStrictMode": true
}), templateOnly(undefined, "popover.gjs"));

const repl_73 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

{{#let (newObj open=true) as |context|}}
  <Popover
    @open={{context.open}}
    @isTabTip={{true}}
    @onRequestClose={{fn (set context 'open') false}}
  >
    <button
      type='button'
      aria-label='Settings'
      aria-expanded={{context.open}}
      {{on 'click' (fn (set context 'open') (not context.open))}}
    >
      <Settings />
    </button>
    <PopoverContent style='padding: 1rem;'>
      <RadioButtonGroup @name='row-height' @defaultSelected='small'>
        <:heading>Row height</:heading>
        <:default as |Radio|>
          <Radio @value='small'>Small</Radio>
          <Radio @value='large'>Large</Radio>
        </:default>
      </RadioButtonGroup>
      <hr />
      <fieldset class='cds--fieldset'>
        <legend class='cds--label'>Edit columns</legend>
        <Checkbox @label='Name' @checked={{true}} />
        <Checkbox @label='Type' @checked={{true}} />
        <Checkbox @label='Location' @checked={{true}} />
      </fieldset>
    </PopoverContent>
  </Popover>
{{/let}}
*/
{
  "id": "lX4NQ6GS",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[44,[[28,[32,1],null,[[\"open\"],[true]]]],[[[1,\"  \"],[8,[32,2],null,[[\"@open\",\"@isTabTip\",\"@onRequestClose\"],[[30,1,[\"open\"]],true,[28,[32,3],[[28,[32,4],[[30,1],\"open\"],null],false],null]]],[[\"default\"],[[[[1,\"\\n    \"],[11,\"button\"],[24,\"aria-label\",\"Settings\"],[16,\"aria-expanded\",[30,1,[\"open\"]]],[24,4,\"button\"],[4,[32,5],[\"click\",[28,[32,3],[[28,[32,4],[[30,1],\"open\"],null],[28,[32,6],[[30,1,[\"open\"]]],null]],null]],null],[12],[1,\"\\n      \"],[8,[32,7],null,null,null],[1,\"\\n    \"],[13],[1,\"\\n    \"],[8,[32,8],[[24,5,\"padding: 1rem;\"]],null,[[\"default\"],[[[[1,\"\\n      \"],[8,[32,9],null,[[\"@name\",\"@defaultSelected\"],[\"row-height\",\"small\"]],[[\"heading\",\"default\"],[[[[1,\"Row height\"]],[]],[[[1,\"\\n          \"],[8,[30,2],null,[[\"@value\"],[\"small\"]],[[\"default\"],[[[[1,\"Small\"]],[]]]]],[1,\"\\n          \"],[8,[30,2],null,[[\"@value\"],[\"large\"]],[[\"default\"],[[[[1,\"Large\"]],[]]]]],[1,\"\\n        \"]],[2]]]]],[1,\"\\n      \"],[10,\"hr\"],[12],[13],[1,\"\\n      \"],[10,\"fieldset\"],[14,0,\"cds--fieldset\"],[12],[1,\"\\n        \"],[10,\"legend\"],[14,0,\"cds--label\"],[12],[1,\"Edit columns\"],[13],[1,\"\\n        \"],[8,[32,10],null,[[\"@label\",\"@checked\"],[\"Name\",true]],null],[1,\"\\n        \"],[8,[32,10],null,[[\"@label\",\"@checked\"],[\"Type\",true]],null],[1,\"\\n        \"],[8,[32,10],null,[[\"@label\",\"@checked\"],[\"Location\",true]],null],[1,\"\\n      \"],[13],[1,\"\\n    \"]],[]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]],[\"context\",\"Radio\"],[\"let\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, Popover, fn, helper$1, on, not, Settings, PopoverContent, RadioButtonGroup, CarbonCheckbox],
  "isStrictMode": true
}), templateOnly(undefined, "popover.gjs"));

const repl_74 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />

{{#let (newObj open=true) as |context|}}
  <Popover
    @open={{context.open}}
    @align='top'
    @autoAlign={{true}}
    @onRequestClose={{fn (set context 'open') false}}
  >
    <button
      type='button'
      aria-label='Available storage'
      aria-expanded={{context.open}}
      {{on 'click' (fn (set context 'open') (not context.open))}}
    >
      <CheckboxIcon />
    </button>
    <PopoverContent style='padding: 1rem;'>
      <h4>This popover uses autoAlign</h4>
      <p>
        It was requested to align on top, but flips to bottom when there
        isn't enough room above it in the viewport.
      </p>
    </PopoverContent>
  </Popover>
{{/let}}
*/
{
  "id": "7QTjyYuG",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\\n\"],[44,[[28,[32,1],null,[[\"open\"],[true]]]],[[[1,\"  \"],[8,[32,2],null,[[\"@open\",\"@align\",\"@autoAlign\",\"@onRequestClose\"],[[30,1,[\"open\"]],\"top\",true,[28,[32,3],[[28,[32,4],[[30,1],\"open\"],null],false],null]]],[[\"default\"],[[[[1,\"\\n    \"],[11,\"button\"],[24,\"aria-label\",\"Available storage\"],[16,\"aria-expanded\",[30,1,[\"open\"]]],[24,4,\"button\"],[4,[32,5],[\"click\",[28,[32,3],[[28,[32,4],[[30,1],\"open\"],null],[28,[32,6],[[30,1,[\"open\"]]],null]],null]],null],[12],[1,\"\\n      \"],[8,[32,7],null,null,null],[1,\"\\n    \"],[13],[1,\"\\n    \"],[8,[32,8],[[24,5,\"padding: 1rem;\"]],null,[[\"default\"],[[[[1,\"\\n      \"],[10,\"h4\"],[12],[1,\"This popover uses autoAlign\"],[13],[1,\"\\n      \"],[10,2],[12],[1,\"\\n        It was requested to align on top, but flips to bottom when there\\n        isn't enough room above it in the viewport.\\n      \"],[13],[1,\"\\n    \"]],[]]]]],[1,\"\\n  \"]],[]]]]],[1,\"\\n\"]],[1]]]],[\"context\"],[\"let\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, Popover, fn, helper$1, on, not, Checkbox, PopoverContent],
  "isStrictMode": true
}), templateOnly(undefined, "popover.gjs"));

const repl_75 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/popover'
  @name='default'
/>
*/
{
  "id": "Dtp6m6fd",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/popover\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "popover.gjs"));

const repl_76 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/popover'
  @name='PopoverContent'
/>
*/
{
  "id": "VIjq6FPO",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/popover\",\"PopoverContent\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "popover.gjs"));

const popover_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="popover">Popover</h1>
<p><code>Popover</code> is used for triggering a pop-up next to a trigger element, typically
a button, in a given direction. It is a controlled component: the consumer
owns the <code>@open</code> argument and toggles it (usually from the trigger's <code>@onClick</code>
handler), while <code>Popover</code> calls <code>@onRequestClose</code> whenever the user clicks
outside of the popover or presses <kbd>Escape</kbd> while focus is inside the
popover content.</p>
<p>The trigger element and <code>PopoverContent</code> are both yielded as plain children of
<code>Popover</code>.</p>
<carbon-shadow-demo id="repl_71" class="repl-sdk__demo"><div><repl_71></repl_71></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { not } from 'ember-truth-helpers';
import { Popover, PopoverContent } from 'carbon-components-ember/components';
import { Checkbox as CheckboxIcon } from 'carbon-components-ember/icons';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  \{{#let (newObj open=true) as |context|}}
    &#x3C;Popover
      @open=\{{context.open}}
      @onRequestClose=\{{fn (set context 'open') false}}
    >
      &#x3C;button
        type='button'
        aria-label='Available storage'
        aria-expanded=\{{context.open}}
        \{{on 'click' (fn (set context 'open') (not context.open))}}
      >
        &#x3C;CheckboxIcon />
      &#x3C;/button>
      &#x3C;PopoverContent style='padding: 1rem;'>
        &#x3C;h4>Available storage&#x3C;/h4>
        &#x3C;p>This server has 150 GB of block storage remaining.&#x3C;/p>
      &#x3C;/PopoverContent>
    &#x3C;/Popover>
  \{{/let}}
&#x3C;/template>
</code></pre></div>
<h2 id="caret-drop-shadow-border-and-high-contrast">Caret, drop shadow, border and high contrast</h2>
<p><code>@align</code> (not toggled in this example — see the API reference below for the
full list of accepted values) controls which side and edge of the trigger the
popover renders against. <code>@caret</code>, <code>@dropShadow</code>, <code>@border</code>, <code>@highContrast</code>
and <code>@backgroundToken</code> control its appearance.</p>
<carbon-shadow-demo id="repl_72" class="repl-sdk__demo"><div><repl_72></repl_72></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { not } from 'ember-truth-helpers';
import {
  Popover,
  PopoverContent,
  Checkbox,
} from 'carbon-components-ember/components';
import { Checkbox as CheckboxIcon } from 'carbon-components-ember/icons';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  \{{#let
    (newObj
      open=true
      caret=true
      dropShadow=true
      border=false
      highContrast=false
    )
    as |context|
  }}
    &#x3C;Checkbox
      @label='caret'
      @checked=\{{context.caret}}
      @onChange=\{{fn (set context 'caret')}}
    />
    &#x3C;Checkbox
      @label='dropShadow'
      @checked=\{{context.dropShadow}}
      @onChange=\{{fn (set context 'dropShadow')}}
    />
    &#x3C;Checkbox
      @label='border'
      @checked=\{{context.border}}
      @onChange=\{{fn (set context 'border')}}
    />
    &#x3C;Checkbox
      @label='highContrast'
      @checked=\{{context.highContrast}}
      @onChange=\{{fn (set context 'highContrast')}}
    />
    &#x3C;br />
    &#x3C;br />

    &#x3C;Popover
      @open=\{{context.open}}
      @caret=\{{context.caret}}
      @dropShadow=\{{context.dropShadow}}
      @border=\{{context.border}}
      @highContrast=\{{context.highContrast}}
      @onRequestClose=\{{fn (set context 'open') false}}
    >
      &#x3C;button
        type='button'
        aria-label='Available storage'
        aria-expanded=\{{context.open}}
        \{{on 'click' (fn (set context 'open') (not context.open))}}
      >
        &#x3C;CheckboxIcon />
      &#x3C;/button>
      &#x3C;PopoverContent style='padding: 1rem;'>
        &#x3C;h4>Available storage&#x3C;/h4>
        &#x3C;p>This server has 150 GB of block storage remaining.&#x3C;/p>
      &#x3C;/PopoverContent>
    &#x3C;/Popover>
  \{{/let}}
&#x3C;/template>
</code></pre></div>
<h2 id="tab-tip-variant">Tab tip variant</h2>
<p>Passing <code>@isTabTip=\{{true}}</code> renders the "tab tip" variant used by components
like <code>DataTable</code>'s column customization menu. It defaults <code>@align</code> to
<code>bottom-start</code>, disables the caret, and adds a <code>cds--popover--tab-tip__button</code>
class to the trigger.</p>
<carbon-shadow-demo id="repl_73" class="repl-sdk__demo"><div><repl_73></repl_73></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { not } from 'ember-truth-helpers';
import {
  Popover,
  PopoverContent,
  Checkbox,
  RadioButtonGroup,
} from 'carbon-components-ember/components';
import { Settings } from 'carbon-components-ember/icons';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  \{{#let (newObj open=true) as |context|}}
    &#x3C;Popover
      @open=\{{context.open}}
      @isTabTip=\{{true}}
      @onRequestClose=\{{fn (set context 'open') false}}
    >
      &#x3C;button
        type='button'
        aria-label='Settings'
        aria-expanded=\{{context.open}}
        \{{on 'click' (fn (set context 'open') (not context.open))}}
      >
        &#x3C;Settings />
      &#x3C;/button>
      &#x3C;PopoverContent style='padding: 1rem;'>
        &#x3C;RadioButtonGroup @name='row-height' @defaultSelected='small'>
          &#x3C;:heading>Row height&#x3C;/:heading>
          &#x3C;:default as |Radio|>
            &#x3C;Radio @value='small'>Small&#x3C;/Radio>
            &#x3C;Radio @value='large'>Large&#x3C;/Radio>
          &#x3C;/:default>
        &#x3C;/RadioButtonGroup>
        &#x3C;hr />
        &#x3C;fieldset class='cds--fieldset'>
          &#x3C;legend class='cds--label'>Edit columns&#x3C;/legend>
          &#x3C;Checkbox @label='Name' @checked=\{{true}} />
          &#x3C;Checkbox @label='Type' @checked=\{{true}} />
          &#x3C;Checkbox @label='Location' @checked=\{{true}} />
        &#x3C;/fieldset>
      &#x3C;/PopoverContent>
    &#x3C;/Popover>
  \{{/let}}
&#x3C;/template>
</code></pre></div>
<h2 id="auto-align">Auto align</h2>
<p><strong>Experimental:</strong> passing <code>@autoAlign=\{{true}}</code> checks, when the popover
opens, whether the popover content would render outside of the viewport (or
a boundary element passed as <code>@autoAlignBoundary</code>) and flips it to the
opposite side of the trigger if so. This is a lighter-weight approximation of
React's <code>floating-ui</code>-powered <code>autoAlign</code>: it re-checks once when the popover
opens rather than continuously tracking position, and picks from the same set
of alignment values rather than computing arbitrary pixel offsets.</p>
<p>Since this popover is requested to align <code>top</code> right at the top of the page,
there typically isn't enough room above it in the viewport, so <code>@autoAlign</code>
flips it to render <code>bottom</code> instead.</p>
<carbon-shadow-demo id="repl_74" class="repl-sdk__demo"><div><repl_74></repl_74></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { not } from 'ember-truth-helpers';
import { Popover, PopoverContent } from 'carbon-components-ember/components';
import { Checkbox as CheckboxIcon } from 'carbon-components-ember/icons';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />

  \{{#let (newObj open=true) as |context|}}
    &#x3C;Popover
      @open=\{{context.open}}
      @align='top'
      @autoAlign=\{{true}}
      @onRequestClose=\{{fn (set context 'open') false}}
    >
      &#x3C;button
        type='button'
        aria-label='Available storage'
        aria-expanded=\{{context.open}}
        \{{on 'click' (fn (set context 'open') (not context.open))}}
      >
        &#x3C;CheckboxIcon />
      &#x3C;/button>
      &#x3C;PopoverContent style='padding: 1rem;'>
        &#x3C;h4>This popover uses autoAlign&#x3C;/h4>
        &#x3C;p>
          It was requested to align on top, but flips to bottom when there
          isn't enough room above it in the viewport.
        &#x3C;/p>
      &#x3C;/PopoverContent>
    &#x3C;/Popover>
  \{{/let}}
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Popover</h3></summary>
<div id="repl_75" class="repl-sdk__demo"><repl_75></repl_75></div>
</details>
<details>
<summary><h3>PopoverContent</h3></summary>
<div id="repl_76" class="repl-sdk__demo"><repl_76></repl_76></div>
</details>
*/
{
  "id": "llYGflar",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"popover\"],[12],[1,\"Popover\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"Popover\"],[13],[1,\" is used for triggering a pop-up next to a trigger element, typically\\na button, in a given direction. It is a controlled component: the consumer\\nowns the \"],[10,\"code\"],[12],[1,\"@open\"],[13],[1,\" argument and toggles it (usually from the trigger's \"],[10,\"code\"],[12],[1,\"@onClick\"],[13],[1,\"\\nhandler), while \"],[10,\"code\"],[12],[1,\"Popover\"],[13],[1,\" calls \"],[10,\"code\"],[12],[1,\"@onRequestClose\"],[13],[1,\" whenever the user clicks\\noutside of the popover or presses \"],[10,\"kbd\"],[12],[1,\"Escape\"],[13],[1,\" while focus is inside the\\npopover content.\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"The trigger element and \"],[10,\"code\"],[12],[1,\"PopoverContent\"],[13],[1,\" are both yielded as plain children of\\n\"],[10,\"code\"],[12],[1,\"Popover\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_71\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { fn } from '@ember/helper';\\nimport { on } from '@ember/modifier';\\nimport { not } from 'ember-truth-helpers';\\nimport { Popover, PopoverContent } from 'carbon-components-ember/components';\\nimport { Checkbox as CheckboxIcon } from 'carbon-components-ember/icons';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  \"],[1,\"{{#let (newObj open=true) as |context|}}\\n    <Popover\\n      @open=\"],[1,\"{{context.open}}\\n      @onRequestClose=\"],[1,\"{{fn (set context 'open') false}}\\n    >\\n      <button\\n        type='button'\\n        aria-label='Available storage'\\n        aria-expanded=\"],[1,\"{{context.open}}\\n        \"],[1,\"{{on 'click' (fn (set context 'open') (not context.open))}}\\n      >\\n        <CheckboxIcon />\\n      </button>\\n      <PopoverContent style='padding: 1rem;'>\\n        <h4>Available storage</h4>\\n        <p>This server has 150 GB of block storage remaining.</p>\\n      </PopoverContent>\\n    </Popover>\\n  \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"caret-drop-shadow-border-and-high-contrast\"],[12],[1,\"Caret, drop shadow, border and high contrast\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"@align\"],[13],[1,\" (not toggled in this example — see the API reference below for the\\nfull list of accepted values) controls which side and edge of the trigger the\\npopover renders against. \"],[10,\"code\"],[12],[1,\"@caret\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"@dropShadow\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"@border\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"@highContrast\"],[13],[1,\"\\nand \"],[10,\"code\"],[12],[1,\"@backgroundToken\"],[13],[1,\" control its appearance.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_72\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { fn } from '@ember/helper';\\nimport { on } from '@ember/modifier';\\nimport { not } from 'ember-truth-helpers';\\nimport {\\n  Popover,\\n  PopoverContent,\\n  Checkbox,\\n} from 'carbon-components-ember/components';\\nimport { Checkbox as CheckboxIcon } from 'carbon-components-ember/icons';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  \"],[1,\"{{#let\\n    (newObj\\n      open=true\\n      caret=true\\n      dropShadow=true\\n      border=false\\n      highContrast=false\\n    )\\n    as |context|\\n  }}\\n    <Checkbox\\n      @label='caret'\\n      @checked=\"],[1,\"{{context.caret}}\\n      @onChange=\"],[1,\"{{fn (set context 'caret')}}\\n    />\\n    <Checkbox\\n      @label='dropShadow'\\n      @checked=\"],[1,\"{{context.dropShadow}}\\n      @onChange=\"],[1,\"{{fn (set context 'dropShadow')}}\\n    />\\n    <Checkbox\\n      @label='border'\\n      @checked=\"],[1,\"{{context.border}}\\n      @onChange=\"],[1,\"{{fn (set context 'border')}}\\n    />\\n    <Checkbox\\n      @label='highContrast'\\n      @checked=\"],[1,\"{{context.highContrast}}\\n      @onChange=\"],[1,\"{{fn (set context 'highContrast')}}\\n    />\\n    <br />\\n    <br />\\n\\n    <Popover\\n      @open=\"],[1,\"{{context.open}}\\n      @caret=\"],[1,\"{{context.caret}}\\n      @dropShadow=\"],[1,\"{{context.dropShadow}}\\n      @border=\"],[1,\"{{context.border}}\\n      @highContrast=\"],[1,\"{{context.highContrast}}\\n      @onRequestClose=\"],[1,\"{{fn (set context 'open') false}}\\n    >\\n      <button\\n        type='button'\\n        aria-label='Available storage'\\n        aria-expanded=\"],[1,\"{{context.open}}\\n        \"],[1,\"{{on 'click' (fn (set context 'open') (not context.open))}}\\n      >\\n        <CheckboxIcon />\\n      </button>\\n      <PopoverContent style='padding: 1rem;'>\\n        <h4>Available storage</h4>\\n        <p>This server has 150 GB of block storage remaining.</p>\\n      </PopoverContent>\\n    </Popover>\\n  \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"tab-tip-variant\"],[12],[1,\"Tab tip variant\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Passing \"],[10,\"code\"],[12],[1,\"@isTabTip=\"],[1,\"{{true}}\"],[13],[1,\" renders the \\\"tab tip\\\" variant used by components\\nlike \"],[10,\"code\"],[12],[1,\"DataTable\"],[13],[1,\"'s column customization menu. It defaults \"],[10,\"code\"],[12],[1,\"@align\"],[13],[1,\" to\\n\"],[10,\"code\"],[12],[1,\"bottom-start\"],[13],[1,\", disables the caret, and adds a \"],[10,\"code\"],[12],[1,\"cds--popover--tab-tip__button\"],[13],[1,\"\\nclass to the trigger.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_73\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { fn } from '@ember/helper';\\nimport { on } from '@ember/modifier';\\nimport { not } from 'ember-truth-helpers';\\nimport {\\n  Popover,\\n  PopoverContent,\\n  Checkbox,\\n  RadioButtonGroup,\\n} from 'carbon-components-ember/components';\\nimport { Settings } from 'carbon-components-ember/icons';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  \"],[1,\"{{#let (newObj open=true) as |context|}}\\n    <Popover\\n      @open=\"],[1,\"{{context.open}}\\n      @isTabTip=\"],[1,\"{{true}}\\n      @onRequestClose=\"],[1,\"{{fn (set context 'open') false}}\\n    >\\n      <button\\n        type='button'\\n        aria-label='Settings'\\n        aria-expanded=\"],[1,\"{{context.open}}\\n        \"],[1,\"{{on 'click' (fn (set context 'open') (not context.open))}}\\n      >\\n        <Settings />\\n      </button>\\n      <PopoverContent style='padding: 1rem;'>\\n        <RadioButtonGroup @name='row-height' @defaultSelected='small'>\\n          <:heading>Row height</:heading>\\n          <:default as |Radio|>\\n            <Radio @value='small'>Small</Radio>\\n            <Radio @value='large'>Large</Radio>\\n          </:default>\\n        </RadioButtonGroup>\\n        <hr />\\n        <fieldset class='cds--fieldset'>\\n          <legend class='cds--label'>Edit columns</legend>\\n          <Checkbox @label='Name' @checked=\"],[1,\"{{true}} />\\n          <Checkbox @label='Type' @checked=\"],[1,\"{{true}} />\\n          <Checkbox @label='Location' @checked=\"],[1,\"{{true}} />\\n        </fieldset>\\n      </PopoverContent>\\n    </Popover>\\n  \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"auto-align\"],[12],[1,\"Auto align\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"strong\"],[12],[1,\"Experimental:\"],[13],[1,\" passing \"],[10,\"code\"],[12],[1,\"@autoAlign=\"],[1,\"{{true}}\"],[13],[1,\" checks, when the popover\\nopens, whether the popover content would render outside of the viewport (or\\na boundary element passed as \"],[10,\"code\"],[12],[1,\"@autoAlignBoundary\"],[13],[1,\") and flips it to the\\nopposite side of the trigger if so. This is a lighter-weight approximation of\\nReact's \"],[10,\"code\"],[12],[1,\"floating-ui\"],[13],[1,\"-powered \"],[10,\"code\"],[12],[1,\"autoAlign\"],[13],[1,\": it re-checks once when the popover\\nopens rather than continuously tracking position, and picks from the same set\\nof alignment values rather than computing arbitrary pixel offsets.\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Since this popover is requested to align \"],[10,\"code\"],[12],[1,\"top\"],[13],[1,\" right at the top of the page,\\nthere typically isn't enough room above it in the viewport, so \"],[10,\"code\"],[12],[1,\"@autoAlign\"],[13],[1,\"\\nflips it to render \"],[10,\"code\"],[12],[1,\"bottom\"],[13],[1,\" instead.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_74\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { fn } from '@ember/helper';\\nimport { on } from '@ember/modifier';\\nimport { not } from 'ember-truth-helpers';\\nimport { Popover, PopoverContent } from 'carbon-components-ember/components';\\nimport { Checkbox as CheckboxIcon } from 'carbon-components-ember/icons';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n\\n  \"],[1,\"{{#let (newObj open=true) as |context|}}\\n    <Popover\\n      @open=\"],[1,\"{{context.open}}\\n      @align='top'\\n      @autoAlign=\"],[1,\"{{true}}\\n      @onRequestClose=\"],[1,\"{{fn (set context 'open') false}}\\n    >\\n      <button\\n        type='button'\\n        aria-label='Available storage'\\n        aria-expanded=\"],[1,\"{{context.open}}\\n        \"],[1,\"{{on 'click' (fn (set context 'open') (not context.open))}}\\n      >\\n        <CheckboxIcon />\\n      </button>\\n      <PopoverContent style='padding: 1rem;'>\\n        <h4>This popover uses autoAlign</h4>\\n        <p>\\n          It was requested to align on top, but flips to bottom when there\\n          isn't enough room above it in the viewport.\\n        </p>\\n      </PopoverContent>\\n    </Popover>\\n  \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Popover\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_75\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"PopoverContent\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_76\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,6],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_71, repl_72, repl_73, repl_74, repl_75, repl_76],
  "isStrictMode": true
}), templateOnly(undefined, "popover.gjs"));

export { popover_gjs as default };

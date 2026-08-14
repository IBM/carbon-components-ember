import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, d as helper, ag as DidInsertModifier, f as helper$1, b9 as Menu, ba as MenuItem, bb as FolderShared, bc as MenuItemRadioGroup, at as array, bd as MenuItemDivider, be as Cut, bf as Copy, bg as Paste, bh as MenuItemGroup, bi as MenuItemSelectable, bj as TextBold, bk as TextItalic, bl as TrashCan, t as templateOnly, a4 as CarbonButton, o as on, af as trackedObject, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

const repl_52 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

{{#let (newObj container=null) as |context|}}
  <div
    style='position: relative; transform: translateZ(0); min-block-size: 22rem; border: 1px dashed; padding: 1rem;'
    {{didInsert (set context 'container')}}
  >
    {{#if context.container}}
      <Menu
        @label='Menu'
        @open={{true}}
        @target={{context.container}}
        @x={{0}}
        @y={{0}}
      >
        <MenuItem @label='Share with' @renderIcon={{FolderShared}}>
          <MenuItemRadioGroup
            @label='Share with'
            @items={{array 'None' 'Product team' 'Organization' 'Company'}}
            @defaultSelectedItem='Product team'
          />
        </MenuItem>
        <MenuItemDivider />
        <MenuItem @label='Cut' @shortcut='⌘X' @renderIcon={{Cut}} />
        <MenuItem @label='Copy' @shortcut='⌘C' @renderIcon={{Copy}} />
        <MenuItem @label='Paste' @shortcut='⌘V' @disabled={{true}} @renderIcon={{Paste}} />
        <MenuItemDivider />
        <MenuItemGroup @label='Font style'>
          <MenuItemSelectable @label='Bold' @shortcut='⌘B' @defaultSelected={{true}} @renderIcon={{TextBold}} />
          <MenuItemSelectable @label='Italic' @shortcut='⌘I' @renderIcon={{TextItalic}} />
        </MenuItemGroup>
        <MenuItemDivider />
        <MenuItemRadioGroup
          @label='Text decoration'
          @items={{array 'None' 'Overline' 'Line-through' 'Underline'}}
          @defaultSelectedItem='None'
        />
        <MenuItemDivider />
        <MenuItem @label='Delete' @shortcut='⌫' @kind='danger' @renderIcon={{TrashCan}} />
      </Menu>
    {{/if}}
  </div>
{{/let}}
*/
{
  "id": "zmjSOzm6",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[44,[[28,[32,1],null,[[\"container\"],[null]]]],[[[1,\"  \"],[11,0],[24,5,\"position: relative; transform: translateZ(0); min-block-size: 22rem; border: 1px dashed; padding: 1rem;\"],[4,[32,2],[[28,[32,3],[[30,1],\"container\"],null]],null],[12],[1,\"\\n\"],[41,[30,1,[\"container\"]],[[[1,\"      \"],[8,[32,4],null,[[\"@label\",\"@open\",\"@target\",\"@x\",\"@y\"],[\"Menu\",true,[30,1,[\"container\"]],0,0]],[[\"default\"],[[[[1,\"\\n        \"],[8,[32,5],null,[[\"@label\",\"@renderIcon\"],[\"Share with\",[32,6]]],[[\"default\"],[[[[1,\"\\n          \"],[8,[32,7],null,[[\"@label\",\"@items\",\"@defaultSelectedItem\"],[\"Share with\",[28,[32,8],[\"None\",\"Product team\",\"Organization\",\"Company\"],null],\"Product team\"]],null],[1,\"\\n        \"]],[]]]]],[1,\"\\n        \"],[8,[32,9],null,null,null],[1,\"\\n        \"],[8,[32,5],null,[[\"@label\",\"@shortcut\",\"@renderIcon\"],[\"Cut\",\"⌘X\",[32,10]]],null],[1,\"\\n        \"],[8,[32,5],null,[[\"@label\",\"@shortcut\",\"@renderIcon\"],[\"Copy\",\"⌘C\",[32,11]]],null],[1,\"\\n        \"],[8,[32,5],null,[[\"@label\",\"@shortcut\",\"@disabled\",\"@renderIcon\"],[\"Paste\",\"⌘V\",true,[32,12]]],null],[1,\"\\n        \"],[8,[32,9],null,null,null],[1,\"\\n        \"],[8,[32,13],null,[[\"@label\"],[\"Font style\"]],[[\"default\"],[[[[1,\"\\n          \"],[8,[32,14],null,[[\"@label\",\"@shortcut\",\"@defaultSelected\",\"@renderIcon\"],[\"Bold\",\"⌘B\",true,[32,15]]],null],[1,\"\\n          \"],[8,[32,14],null,[[\"@label\",\"@shortcut\",\"@renderIcon\"],[\"Italic\",\"⌘I\",[32,16]]],null],[1,\"\\n        \"]],[]]]]],[1,\"\\n        \"],[8,[32,9],null,null,null],[1,\"\\n        \"],[8,[32,7],null,[[\"@label\",\"@items\",\"@defaultSelectedItem\"],[\"Text decoration\",[28,[32,8],[\"None\",\"Overline\",\"Line-through\",\"Underline\"],null],\"None\"]],null],[1,\"\\n        \"],[8,[32,9],null,null,null],[1,\"\\n        \"],[8,[32,5],null,[[\"@label\",\"@shortcut\",\"@kind\",\"@renderIcon\"],[\"Delete\",\"⌫\",\"danger\",[32,17]]],null],[1,\"\\n      \"]],[]]]]],[1,\"\\n\"]],[]],null],[1,\"  \"],[13],[1,\"\\n\"]],[1]]]],[\"context\"],[\"let\",\"if\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, DidInsertModifier, helper$1, Menu, MenuItem, FolderShared, MenuItemRadioGroup, array, MenuItemDivider, Cut, Copy, Paste, MenuItemGroup, MenuItemSelectable, TextBold, TextItalic, TrashCan],
  "isStrictMode": true
}), templateOnly(undefined, "menu.gjs"));

const context = trackedObject({
  open: false
});
const setContainer = element => context.container = element;
const openMenu = event => {
  const trigger = event.currentTarget.getBoundingClientRect();
  const box = context.container.getBoundingClientRect();
  // Subtracting the box here is only needed because the demo box below is
  // the containing block for the menu. Rendering into `document.body`, you
  // would pass the trigger's viewport coordinates as they are.
  context.x = [trigger.left - box.left, trigger.right - box.left];
  context.y = [trigger.top - box.top, trigger.bottom - box.top];
  context.open = true;
};
const closeMenu = () => context.open = false;
const repl_53 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

<div
  style='position: relative; transform: translateZ(0); min-block-size: 14rem; border: 1px dashed; padding: 1rem;'
  {{didInsert setContainer}}
>
  <Button {{on 'click' openMenu}}>
    Open menu
  </Button>

  {{#if context.container}}
    <Menu
      @label='Menu'
      @open={{context.open}}
      @target={{context.container}}
      @x={{context.x}}
      @y={{context.y}}
      @onClose={{closeMenu}}
    >
      <MenuItem @label='Cut' @shortcut='⌘X' />
      <MenuItem @label='Copy' @shortcut='⌘C' />
      <MenuItemDivider />
      <MenuItem @label='Delete' @shortcut='⌫' @kind='danger' />
    </Menu>
  {{/if}}
</div>
*/
{
  "id": "kT+piO2O",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[11,0],[24,5,\"position: relative; transform: translateZ(0); min-block-size: 14rem; border: 1px dashed; padding: 1rem;\"],[4,[32,1],[[32,2]],null],[12],[1,\"\\n  \"],[8,[32,3],[[4,[32,4],[\"click\",[32,5]],null]],null,[[\"default\"],[[[[1,\"\\n    Open menu\\n  \"]],[]]]]],[1,\"\\n\\n\"],[41,[32,6,[\"container\"]],[[[1,\"    \"],[8,[32,7],null,[[\"@label\",\"@open\",\"@target\",\"@x\",\"@y\",\"@onClose\"],[\"Menu\",[32,6,[\"open\"]],[32,6,[\"container\"]],[32,6,[\"x\"]],[32,6,[\"y\"]],[32,8]]],[[\"default\"],[[[[1,\"\\n      \"],[8,[32,9],null,[[\"@label\",\"@shortcut\"],[\"Cut\",\"⌘X\"]],null],[1,\"\\n      \"],[8,[32,9],null,[[\"@label\",\"@shortcut\"],[\"Copy\",\"⌘C\"]],null],[1,\"\\n      \"],[8,[32,10],null,null,null],[1,\"\\n      \"],[8,[32,9],null,[[\"@label\",\"@shortcut\",\"@kind\"],[\"Delete\",\"⌫\",\"danger\"]],null],[1,\"\\n    \"]],[]]]]],[1,\"\\n\"]],[]],null],[13]],[],[\"if\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, DidInsertModifier, setContainer, CarbonButton, on, openMenu, context, Menu, closeMenu, MenuItem, MenuItemDivider],
  "isStrictMode": true
}), templateOnly(undefined, "menu.gjs"));

const repl_54 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<br />

{{#let (newObj container=null) as |context|}}
  <div
    style='position: relative; transform: translateZ(0); min-block-size: 10rem; border: 1px dashed; padding: 1rem;'
    {{didInsert (set context 'container')}}
  >
    {{#if context.container}}
      <Menu
        @label='Menu'
        @open={{true}}
        @target={{context.container}}
        @x={{0}}
        @y={{0}}
        @size='lg'
      >
        <MenuItem @label='Cut' @shortcut='⌘X' />
        <MenuItem @label='Copy' @shortcut='⌘C' />
        <MenuItemDivider />
        <MenuItem @label='Delete' @shortcut='⌫' @kind='danger' />
      </Menu>
    {{/if}}
  </div>
{{/let}}
*/
{
  "id": "ynBSjuPQ",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"br\"],[12],[13],[1,\"\\n\\n\"],[44,[[28,[32,1],null,[[\"container\"],[null]]]],[[[1,\"  \"],[11,0],[24,5,\"position: relative; transform: translateZ(0); min-block-size: 10rem; border: 1px dashed; padding: 1rem;\"],[4,[32,2],[[28,[32,3],[[30,1],\"container\"],null]],null],[12],[1,\"\\n\"],[41,[30,1,[\"container\"]],[[[1,\"      \"],[8,[32,4],null,[[\"@label\",\"@open\",\"@target\",\"@x\",\"@y\",\"@size\"],[\"Menu\",true,[30,1,[\"container\"]],0,0,\"lg\"]],[[\"default\"],[[[[1,\"\\n        \"],[8,[32,5],null,[[\"@label\",\"@shortcut\"],[\"Cut\",\"⌘X\"]],null],[1,\"\\n        \"],[8,[32,5],null,[[\"@label\",\"@shortcut\"],[\"Copy\",\"⌘C\"]],null],[1,\"\\n        \"],[8,[32,6],null,null,null],[1,\"\\n        \"],[8,[32,5],null,[[\"@label\",\"@shortcut\",\"@kind\"],[\"Delete\",\"⌫\",\"danger\"]],null],[1,\"\\n      \"]],[]]]]],[1,\"\\n\"]],[]],null],[1,\"  \"],[13],[1,\"\\n\"]],[1]]]],[\"context\"],[\"let\",\"if\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, helper, DidInsertModifier, helper$1, Menu, MenuItem, MenuItemDivider],
  "isStrictMode": true
}), templateOnly(undefined, "menu.gjs"));

const repl_55 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/menu'
  @name='default'
/>
*/
{
  "id": "7+PIh0tj",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/menu\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "menu.gjs"));

const repl_56 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/menu/menu-item'
  @name='default'
/>
*/
{
  "id": "Vv9CDf9z",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/menu/menu-item\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "menu.gjs"));

const repl_57 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/menu/menu-item-selectable'
  @name='default'
/>
*/
{
  "id": "BEaBVm4R",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/menu/menu-item-selectable\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "menu.gjs"));

const repl_58 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/menu/menu-item-group'
  @name='default'
/>
*/
{
  "id": "D8pbY2Gc",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/menu/menu-item-group\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "menu.gjs"));

const repl_59 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/menu/menu-item-radio-group'
  @name='default'
/>
*/
{
  "id": "ZrkXdqQd",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/menu/menu-item-radio-group\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "menu.gjs"));

const repl_60 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/menu/menu-item-divider'
  @name='default'
/>
*/
{
  "id": "qViqPL5u",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/menu/menu-item-divider\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "menu.gjs"));

const menu_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="menu">Menu</h1>
<p>Menu is a low-level building block for rendering a floating list of actions —
<code>OverflowMenu</code> and context menus are built on top of it. It's a controlled
component: pass <code>@open</code> and toggle it from <code>@onClose</code>/your own trigger.
Compose it out of <code>MenuItem</code>, <code>MenuItemDivider</code>, <code>MenuItemGroup</code>,
<code>MenuItemRadioGroup</code>, and <code>MenuItemSelectable</code>.</p>
<p>By default the Menu renders into <code>document.body</code>. Since these live previews
render in an isolated shadow DOM, the examples below pass a local element as
<code>@target</code> so the menu stays inside the preview instead of escaping into the
real page (where the preview's styles don't reach it). That element also
carries a <code>transform</code>, which makes it the containing block for the
fixed-position menu, so <code>@x</code>/<code>@y</code> below are relative to the dashed box rather
than to the viewport.</p>
<carbon-shadow-demo id="repl_52" class="repl-sdk__demo"><div><repl_52></repl_52></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { array } from '@ember/helper';
import { Menu, MenuItem, MenuItemDivider, MenuItemGroup, MenuItemRadioGroup, MenuItemSelectable } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { Copy, Cut, FolderShared, Paste, TextBold, TextItalic, TrashCan } from 'carbon-components-ember/icons';
import { ThemeSupport, didInsert } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  \{{#let (newObj container=null) as |context|}}
    &#x3C;div
      style='position: relative; transform: translateZ(0); min-block-size: 22rem; border: 1px dashed; padding: 1rem;'
      \{{didInsert (set context 'container')}}
    >
      \{{#if context.container}}
        &#x3C;Menu
          @label='Menu'
          @open=\{{true}}
          @target=\{{context.container}}
          @x=\{{0}}
          @y=\{{0}}
        >
          &#x3C;MenuItem @label='Share with' @renderIcon=\{{FolderShared}}>
            &#x3C;MenuItemRadioGroup
              @label='Share with'
              @items=\{{array 'None' 'Product team' 'Organization' 'Company'}}
              @defaultSelectedItem='Product team'
            />
          &#x3C;/MenuItem>
          &#x3C;MenuItemDivider />
          &#x3C;MenuItem @label='Cut' @shortcut='⌘X' @renderIcon=\{{Cut}} />
          &#x3C;MenuItem @label='Copy' @shortcut='⌘C' @renderIcon=\{{Copy}} />
          &#x3C;MenuItem @label='Paste' @shortcut='⌘V' @disabled=\{{true}} @renderIcon=\{{Paste}} />
          &#x3C;MenuItemDivider />
          &#x3C;MenuItemGroup @label='Font style'>
            &#x3C;MenuItemSelectable @label='Bold' @shortcut='⌘B' @defaultSelected=\{{true}} @renderIcon=\{{TextBold}} />
            &#x3C;MenuItemSelectable @label='Italic' @shortcut='⌘I' @renderIcon=\{{TextItalic}} />
          &#x3C;/MenuItemGroup>
          &#x3C;MenuItemDivider />
          &#x3C;MenuItemRadioGroup
            @label='Text decoration'
            @items=\{{array 'None' 'Overline' 'Line-through' 'Underline'}}
            @defaultSelectedItem='None'
          />
          &#x3C;MenuItemDivider />
          &#x3C;MenuItem @label='Delete' @shortcut='⌫' @kind='danger' @renderIcon=\{{TrashCan}} />
        &#x3C;/Menu>
      \{{/if}}
    &#x3C;/div>
  \{{/let}}
&#x3C;/template>
</code></pre></div>
<h2 id="opening-from-a-trigger">Opening from a trigger</h2>
<p>In practice <code>@open</code> is toggled from a trigger element, and <code>@x</code>/<code>@y</code> are
computed from that trigger's position so the menu appears anchored to it.
Passing both edges of the trigger (<code>[x1, x2]</code>/<code>[y1, y2]</code>) lets the Menu flip
to the other side when it doesn't fit. Clicking a leaf item, pressing
<kbd>Escape</kbd>, or moving focus outside the menu all call <code>@onClose</code>.</p>
<carbon-shadow-demo id="repl_53" class="repl-sdk__demo"><div><repl_53></repl_53></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { on } from '@ember/modifier';
import { Menu, MenuItem, MenuItemDivider, Button } from 'carbon-components-ember/components';
import { trackedObject } from '@ember/reactive/collections';
import { ThemeSupport, didInsert } from 'docs-support';

const context = trackedObject({ open: false });

const setContainer = (element) => (context.container = element);

const openMenu = (event) => {
  const trigger = event.currentTarget.getBoundingClientRect();
  const box = context.container.getBoundingClientRect();
  // Subtracting the box here is only needed because the demo box below is
  // the containing block for the menu. Rendering into `document.body`, you
  // would pass the trigger's viewport coordinates as they are.
  context.x = [trigger.left - box.left, trigger.right - box.left];
  context.y = [trigger.top - box.top, trigger.bottom - box.top];
  context.open = true;
};

const closeMenu = () => (context.open = false);

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  &#x3C;div
    style='position: relative; transform: translateZ(0); min-block-size: 14rem; border: 1px dashed; padding: 1rem;'
    \{{didInsert setContainer}}
  >
    &#x3C;Button \{{on 'click' openMenu}}>
      Open menu
    &#x3C;/Button>

    \{{#if context.container}}
      &#x3C;Menu
        @label='Menu'
        @open=\{{context.open}}
        @target=\{{context.container}}
        @x=\{{context.x}}
        @y=\{{context.y}}
        @onClose=\{{closeMenu}}
      >
        &#x3C;MenuItem @label='Cut' @shortcut='⌘X' />
        &#x3C;MenuItem @label='Copy' @shortcut='⌘C' />
        &#x3C;MenuItemDivider />
        &#x3C;MenuItem @label='Delete' @shortcut='⌫' @kind='danger' />
      &#x3C;/Menu>
    \{{/if}}
  &#x3C;/div>
&#x3C;/template>
</code></pre></div>
<h2 id="sizes">Sizes</h2>
<p><code>@size</code> accepts <code>xs</code>, <code>sm</code> (default), <code>md</code>, or <code>lg</code>.</p>
<carbon-shadow-demo id="repl_54" class="repl-sdk__demo"><div><repl_54></repl_54></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { Menu, MenuItem, MenuItemDivider } from 'carbon-components-ember/components';
import { newObj, set } from 'carbon-components-ember/helpers';
import { ThemeSupport, didInsert } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;br />

  \{{#let (newObj container=null) as |context|}}
    &#x3C;div
      style='position: relative; transform: translateZ(0); min-block-size: 10rem; border: 1px dashed; padding: 1rem;'
      \{{didInsert (set context 'container')}}
    >
      \{{#if context.container}}
        &#x3C;Menu
          @label='Menu'
          @open=\{{true}}
          @target=\{{context.container}}
          @x=\{{0}}
          @y=\{{0}}
          @size='lg'
        >
          &#x3C;MenuItem @label='Cut' @shortcut='⌘X' />
          &#x3C;MenuItem @label='Copy' @shortcut='⌘C' />
          &#x3C;MenuItemDivider />
          &#x3C;MenuItem @label='Delete' @shortcut='⌫' @kind='danger' />
        &#x3C;/Menu>
      \{{/if}}
    &#x3C;/div>
  \{{/let}}
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Menu</h3></summary>
<div id="repl_55" class="repl-sdk__demo"><repl_55></repl_55></div>
</details>
<details>
<summary><h3>MenuItem</h3></summary>
<div id="repl_56" class="repl-sdk__demo"><repl_56></repl_56></div>
</details>
<details>
<summary><h3>MenuItemSelectable</h3></summary>
<div id="repl_57" class="repl-sdk__demo"><repl_57></repl_57></div>
</details>
<details>
<summary><h3>MenuItemGroup</h3></summary>
<div id="repl_58" class="repl-sdk__demo"><repl_58></repl_58></div>
</details>
<details>
<summary><h3>MenuItemRadioGroup</h3></summary>
<div id="repl_59" class="repl-sdk__demo"><repl_59></repl_59></div>
</details>
<details>
<summary><h3>MenuItemDivider</h3></summary>
<div id="repl_60" class="repl-sdk__demo"><repl_60></repl_60></div>
</details>
*/
{
  "id": "1fnVSqYC",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"menu\"],[12],[1,\"Menu\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Menu is a low-level building block for rendering a floating list of actions —\\n\"],[10,\"code\"],[12],[1,\"OverflowMenu\"],[13],[1,\" and context menus are built on top of it. It's a controlled\\ncomponent: pass \"],[10,\"code\"],[12],[1,\"@open\"],[13],[1,\" and toggle it from \"],[10,\"code\"],[12],[1,\"@onClose\"],[13],[1,\"/your own trigger.\\nCompose it out of \"],[10,\"code\"],[12],[1,\"MenuItem\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"MenuItemDivider\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"MenuItemGroup\"],[13],[1,\",\\n\"],[10,\"code\"],[12],[1,\"MenuItemRadioGroup\"],[13],[1,\", and \"],[10,\"code\"],[12],[1,\"MenuItemSelectable\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"By default the Menu renders into \"],[10,\"code\"],[12],[1,\"document.body\"],[13],[1,\". Since these live previews\\nrender in an isolated shadow DOM, the examples below pass a local element as\\n\"],[10,\"code\"],[12],[1,\"@target\"],[13],[1,\" so the menu stays inside the preview instead of escaping into the\\nreal page (where the preview's styles don't reach it). That element also\\ncarries a \"],[10,\"code\"],[12],[1,\"transform\"],[13],[1,\", which makes it the containing block for the\\nfixed-position menu, so \"],[10,\"code\"],[12],[1,\"@x\"],[13],[1,\"/\"],[10,\"code\"],[12],[1,\"@y\"],[13],[1,\" below are relative to the dashed box rather\\nthan to the viewport.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_52\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { array } from '@ember/helper';\\nimport { Menu, MenuItem, MenuItemDivider, MenuItemGroup, MenuItemRadioGroup, MenuItemSelectable } from 'carbon-components-ember/components';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { Copy, Cut, FolderShared, Paste, TextBold, TextItalic, TrashCan } from 'carbon-components-ember/icons';\\nimport { ThemeSupport, didInsert } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  \"],[1,\"{{#let (newObj container=null) as |context|}}\\n    <div\\n      style='position: relative; transform: translateZ(0); min-block-size: 22rem; border: 1px dashed; padding: 1rem;'\\n      \"],[1,\"{{didInsert (set context 'container')}}\\n    >\\n      \"],[1,\"{{#if context.container}}\\n        <Menu\\n          @label='Menu'\\n          @open=\"],[1,\"{{true}}\\n          @target=\"],[1,\"{{context.container}}\\n          @x=\"],[1,\"{{0}}\\n          @y=\"],[1,\"{{0}}\\n        >\\n          <MenuItem @label='Share with' @renderIcon=\"],[1,\"{{FolderShared}}>\\n            <MenuItemRadioGroup\\n              @label='Share with'\\n              @items=\"],[1,\"{{array 'None' 'Product team' 'Organization' 'Company'}}\\n              @defaultSelectedItem='Product team'\\n            />\\n          </MenuItem>\\n          <MenuItemDivider />\\n          <MenuItem @label='Cut' @shortcut='⌘X' @renderIcon=\"],[1,\"{{Cut}} />\\n          <MenuItem @label='Copy' @shortcut='⌘C' @renderIcon=\"],[1,\"{{Copy}} />\\n          <MenuItem @label='Paste' @shortcut='⌘V' @disabled=\"],[1,\"{{true}} @renderIcon=\"],[1,\"{{Paste}} />\\n          <MenuItemDivider />\\n          <MenuItemGroup @label='Font style'>\\n            <MenuItemSelectable @label='Bold' @shortcut='⌘B' @defaultSelected=\"],[1,\"{{true}} @renderIcon=\"],[1,\"{{TextBold}} />\\n            <MenuItemSelectable @label='Italic' @shortcut='⌘I' @renderIcon=\"],[1,\"{{TextItalic}} />\\n          </MenuItemGroup>\\n          <MenuItemDivider />\\n          <MenuItemRadioGroup\\n            @label='Text decoration'\\n            @items=\"],[1,\"{{array 'None' 'Overline' 'Line-through' 'Underline'}}\\n            @defaultSelectedItem='None'\\n          />\\n          <MenuItemDivider />\\n          <MenuItem @label='Delete' @shortcut='⌫' @kind='danger' @renderIcon=\"],[1,\"{{TrashCan}} />\\n        </Menu>\\n      \"],[1,\"{{/if}}\\n    </div>\\n  \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"opening-from-a-trigger\"],[12],[1,\"Opening from a trigger\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"In practice \"],[10,\"code\"],[12],[1,\"@open\"],[13],[1,\" is toggled from a trigger element, and \"],[10,\"code\"],[12],[1,\"@x\"],[13],[1,\"/\"],[10,\"code\"],[12],[1,\"@y\"],[13],[1,\" are\\ncomputed from that trigger's position so the menu appears anchored to it.\\nPassing both edges of the trigger (\"],[10,\"code\"],[12],[1,\"[x1, x2]\"],[13],[1,\"/\"],[10,\"code\"],[12],[1,\"[y1, y2]\"],[13],[1,\") lets the Menu flip\\nto the other side when it doesn't fit. Clicking a leaf item, pressing\\n\"],[10,\"kbd\"],[12],[1,\"Escape\"],[13],[1,\", or moving focus outside the menu all call \"],[10,\"code\"],[12],[1,\"@onClose\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_53\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { on } from '@ember/modifier';\\nimport { Menu, MenuItem, MenuItemDivider, Button } from 'carbon-components-ember/components';\\nimport { trackedObject } from '@ember/reactive/collections';\\nimport { ThemeSupport, didInsert } from 'docs-support';\\n\\nconst context = trackedObject({ open: false });\\n\\nconst setContainer = (element) => (context.container = element);\\n\\nconst openMenu = (event) => {\\n  const trigger = event.currentTarget.getBoundingClientRect();\\n  const box = context.container.getBoundingClientRect();\\n  // Subtracting the box here is only needed because the demo box below is\\n  // the containing block for the menu. Rendering into `document.body`, you\\n  // would pass the trigger's viewport coordinates as they are.\\n  context.x = [trigger.left - box.left, trigger.right - box.left];\\n  context.y = [trigger.top - box.top, trigger.bottom - box.top];\\n  context.open = true;\\n};\\n\\nconst closeMenu = () => (context.open = false);\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  <div\\n    style='position: relative; transform: translateZ(0); min-block-size: 14rem; border: 1px dashed; padding: 1rem;'\\n    \"],[1,\"{{didInsert setContainer}}\\n  >\\n    <Button \"],[1,\"{{on 'click' openMenu}}>\\n      Open menu\\n    </Button>\\n\\n    \"],[1,\"{{#if context.container}}\\n      <Menu\\n        @label='Menu'\\n        @open=\"],[1,\"{{context.open}}\\n        @target=\"],[1,\"{{context.container}}\\n        @x=\"],[1,\"{{context.x}}\\n        @y=\"],[1,\"{{context.y}}\\n        @onClose=\"],[1,\"{{closeMenu}}\\n      >\\n        <MenuItem @label='Cut' @shortcut='⌘X' />\\n        <MenuItem @label='Copy' @shortcut='⌘C' />\\n        <MenuItemDivider />\\n        <MenuItem @label='Delete' @shortcut='⌫' @kind='danger' />\\n      </Menu>\\n    \"],[1,\"{{/if}}\\n  </div>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"sizes\"],[12],[1,\"Sizes\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"@size\"],[13],[1,\" accepts \"],[10,\"code\"],[12],[1,\"xs\"],[13],[1,\", \"],[10,\"code\"],[12],[1,\"sm\"],[13],[1,\" (default), \"],[10,\"code\"],[12],[1,\"md\"],[13],[1,\", or \"],[10,\"code\"],[12],[1,\"lg\"],[13],[1,\".\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_54\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { Menu, MenuItem, MenuItemDivider } from 'carbon-components-ember/components';\\nimport { newObj, set } from 'carbon-components-ember/helpers';\\nimport { ThemeSupport, didInsert } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <br />\\n\\n  \"],[1,\"{{#let (newObj container=null) as |context|}}\\n    <div\\n      style='position: relative; transform: translateZ(0); min-block-size: 10rem; border: 1px dashed; padding: 1rem;'\\n      \"],[1,\"{{didInsert (set context 'container')}}\\n    >\\n      \"],[1,\"{{#if context.container}}\\n        <Menu\\n          @label='Menu'\\n          @open=\"],[1,\"{{true}}\\n          @target=\"],[1,\"{{context.container}}\\n          @x=\"],[1,\"{{0}}\\n          @y=\"],[1,\"{{0}}\\n          @size='lg'\\n        >\\n          <MenuItem @label='Cut' @shortcut='⌘X' />\\n          <MenuItem @label='Copy' @shortcut='⌘C' />\\n          <MenuItemDivider />\\n          <MenuItem @label='Delete' @shortcut='⌫' @kind='danger' />\\n        </Menu>\\n      \"],[1,\"{{/if}}\\n    </div>\\n  \"],[1,\"{{/let}}\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Menu\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_55\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"MenuItem\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_56\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"MenuItemSelectable\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_57\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,6],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"MenuItemGroup\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_58\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,7],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"MenuItemRadioGroup\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_59\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,8],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"MenuItemDivider\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_60\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,9],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_52, repl_53, repl_54, repl_55, repl_56, repl_57, repl_58, repl_59, repl_60],
  "isStrictMode": true
}), templateOnly(undefined, "menu.gjs"));

export { menu_gjs as default };

import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, aX as UIShell, aY as Notification, aZ as UserAvatar, at as array, t as templateOnly, a6 as cell, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-Dx0IVUHb.js';

const sideNavOpen = cell(true);
const onToggle = value => sideNavOpen.current = value;
const noop = () => {};
const subLinks = [{
  title: 'Sub-link 1'
}, {
  title: 'Sub-link 2'
}];
const repl_142 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
{{! The wrapper's transform makes it the containing block for the
    shell's fixed-position header and side nav, so the preview stays
    inside this box instead of overlaying the whole page. }}
<div
  style='position: relative; height: 26rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
>
  <UIShell>
    <:shell as |s|>
      <s.Header @title='IBM' @subtitle='Platform' @open={{sideNavOpen.current}} @onToggle={{onToggle}}>
        <:header>
          <s.Nav as |Item|>
            <Item>Link 1</Item>
            <Item>Link 2</Item>
            <Item>Link 3</Item>
          </s.Nav>
        </:header>
        <:headerGlobal as |GlobalAction|>
          <GlobalAction @aria-label='Notifications' @icon={{Notification}} @onClick={{noop}} />
          <GlobalAction @aria-label='User Avatar' @icon={{UserAvatar}} @onClick={{noop}} />
        </:headerGlobal>
      </s.Header>
      <s.Sidenav @open={{sideNavOpen.current}}>
        <:default as |Menu Divider|>
          <Menu @title='Category 1' @submenus={{subLinks}} as |Sub|>
            {{#each subLinks as |link|}}
              <Sub @title={{link.title}} @transitionTo={{noop}} />
            {{/each}}
          </Menu>
          <Divider />
          <Menu @title='Category 2' @isCurrent={{false}} @transitionTo={{noop}} @submenus={{array}} />
        </:default>
        <:footer as |Footer|>
          <Footer @open={{sideNavOpen.current}} @onToggle={{onToggle}} />
        </:footer>
      </s.Sidenav>
    </:shell>
    <:content>
      <p>Page content</p>
    </:content>
  </UIShell>
</div>
*/
{
  "id": "IP1phGDx",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,0],[14,5,\"position: relative; height: 26rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);\"],[12],[1,\"\\n  \"],[8,[32,1],null,null,[[\"shell\",\"content\"],[[[[1,\"\\n      \"],[8,[30,1,[\"Header\"]],null,[[\"@title\",\"@subtitle\",\"@open\",\"@onToggle\"],[\"IBM\",\"Platform\",[32,2,[\"current\"]],[32,3]]],[[\"header\",\"headerGlobal\"],[[[[1,\"\\n          \"],[8,[30,1,[\"Nav\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,2],null,null,[[\"default\"],[[[[1,\"Link 1\"]],[]]]]],[1,\"\\n            \"],[8,[30,2],null,null,[[\"default\"],[[[[1,\"Link 2\"]],[]]]]],[1,\"\\n            \"],[8,[30,2],null,null,[[\"default\"],[[[[1,\"Link 3\"]],[]]]]],[1,\"\\n          \"]],[2]]]]],[1,\"\\n        \"]],[]],[[[1,\"\\n          \"],[8,[30,3],null,[[\"@aria-label\",\"@icon\",\"@onClick\"],[\"Notifications\",[32,4],[32,5]]],null],[1,\"\\n          \"],[8,[30,3],null,[[\"@aria-label\",\"@icon\",\"@onClick\"],[\"User Avatar\",[32,6],[32,5]]],null],[1,\"\\n        \"]],[3]]]]],[1,\"\\n      \"],[8,[30,1,[\"Sidenav\"]],null,[[\"@open\"],[[32,2,[\"current\"]]]],[[\"default\",\"footer\"],[[[[1,\"\\n          \"],[8,[30,4],null,[[\"@title\",\"@submenus\"],[\"Category 1\",[32,7]]],[[\"default\"],[[[[1,\"\\n\"],[42,[28,[31,1],[[28,[31,1],[[32,7]],null]],null],null,[[[1,\"              \"],[8,[30,6],null,[[\"@title\",\"@transitionTo\"],[[30,7,[\"title\"]],[32,5]]],null],[1,\"\\n\"]],[7]],null],[1,\"          \"]],[6]]]]],[1,\"\\n          \"],[8,[30,5],null,null,null],[1,\"\\n          \"],[8,[30,4],null,[[\"@title\",\"@isCurrent\",\"@transitionTo\",\"@submenus\"],[\"Category 2\",false,[32,5],[32,8]]],null],[1,\"\\n        \"]],[4,5]],[[[1,\"\\n          \"],[8,[30,8],null,[[\"@open\",\"@onToggle\"],[[32,2,[\"current\"]],[32,3]]],null],[1,\"\\n        \"]],[8]]]]],[1,\"\\n    \"]],[1]],[[[1,\"\\n      \"],[10,2],[12],[1,\"Page content\"],[13],[1,\"\\n    \"]],[]]]]],[1,\"\\n\"],[13]],[\"s\",\"Item\",\"GlobalAction\",\"Menu\",\"Divider\",\"Sub\",\"link\",\"Footer\"],[\"each\",\"-track-array\"]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, UIShell, sideNavOpen, onToggle, Notification, noop, UserAvatar, subLinks, array],
  "isStrictMode": true
}), templateOnly(undefined, "ui-shell.gjs"));

const repl_143 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<div
  style='position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
>
  <UIShell>
    <:shell as |s|>
      <s.Header @title='IBM' @subtitle='Platform'>
        <:header>
          <s.Nav as |Item Menu|>
            <Item>Link 1</Item>
            <Menu @menuLinkName='Link 2' as |MenuItem|>
              <MenuItem @isActive={{true}}>Sub-link 1</MenuItem>
              <MenuItem>Sub-link 2</MenuItem>
            </Menu>
          </s.Nav>
        </:header>
      </s.Header>
    </:shell>
    <:content></:content>
  </UIShell>
</div>
*/
{
  "id": "zB5Jeu9D",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,0],[14,5,\"position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);\"],[12],[1,\"\\n  \"],[8,[32,1],null,null,[[\"shell\",\"content\"],[[[[1,\"\\n      \"],[8,[30,1,[\"Header\"]],null,[[\"@title\",\"@subtitle\"],[\"IBM\",\"Platform\"]],[[\"header\"],[[[[1,\"\\n          \"],[8,[30,1,[\"Nav\"]],null,null,[[\"default\"],[[[[1,\"\\n            \"],[8,[30,2],null,null,[[\"default\"],[[[[1,\"Link 1\"]],[]]]]],[1,\"\\n            \"],[8,[30,3],null,[[\"@menuLinkName\"],[\"Link 2\"]],[[\"default\"],[[[[1,\"\\n              \"],[8,[30,4],null,[[\"@isActive\"],[true]],[[\"default\"],[[[[1,\"Sub-link 1\"]],[]]]]],[1,\"\\n              \"],[8,[30,4],null,null,[[\"default\"],[[[[1,\"Sub-link 2\"]],[]]]]],[1,\"\\n            \"]],[4]]]]],[1,\"\\n          \"]],[2,3]]]]],[1,\"\\n        \"]],[]]]]],[1,\"\\n    \"]],[1]],[[],[]]]]],[1,\"\\n\"],[13]],[\"s\",\"Item\",\"Menu\",\"MenuItem\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, UIShell],
  "isStrictMode": true
}), templateOnly(undefined, "ui-shell.gjs"));

const switcherOpen = cell(false);
const toggleSwitcher = () => switcherOpen.current = !switcherOpen.current;
const repl_144 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<div
  style='position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
>
  <UIShell>
    <:shell as |s|>
      <s.Header @title='IBM' @subtitle='Platform'>
        <:headerGlobal as |GlobalAction|>
          <GlobalAction
            @aria-label='App switcher'
            @icon={{UserAvatar}}
            @onClick={{toggleSwitcher}}
          />
        </:headerGlobal>
        <:headerPanel as |HeaderPanel|>
          <HeaderPanel @expanded={{switcherOpen.current}} @onToggle={{toggleSwitcher}}>
            <s.Switcher @aria-label='App switcher' as |Item Divider|>
              <Item @isSelected={{true}}>App 1</Item>
              <Item>App 2</Item>
              <Divider />
              <Item>App 3</Item>
            </s.Switcher>
          </HeaderPanel>
        </:headerPanel>
      </s.Header>
    </:shell>
    <:content></:content>
  </UIShell>
</div>
*/
{
  "id": "2G/lDG8u",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,0],[14,5,\"position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);\"],[12],[1,\"\\n  \"],[8,[32,1],null,null,[[\"shell\",\"content\"],[[[[1,\"\\n      \"],[8,[30,1,[\"Header\"]],null,[[\"@title\",\"@subtitle\"],[\"IBM\",\"Platform\"]],[[\"headerGlobal\",\"headerPanel\"],[[[[1,\"\\n          \"],[8,[30,2],null,[[\"@aria-label\",\"@icon\",\"@onClick\"],[\"App switcher\",[32,2],[32,3]]],null],[1,\"\\n        \"]],[2]],[[[1,\"\\n          \"],[8,[30,3],null,[[\"@expanded\",\"@onToggle\"],[[32,4,[\"current\"]],[32,3]]],[[\"default\"],[[[[1,\"\\n            \"],[8,[30,1,[\"Switcher\"]],null,[[\"@aria-label\"],[\"App switcher\"]],[[\"default\"],[[[[1,\"\\n              \"],[8,[30,4],null,[[\"@isSelected\"],[true]],[[\"default\"],[[[[1,\"App 1\"]],[]]]]],[1,\"\\n              \"],[8,[30,4],null,null,[[\"default\"],[[[[1,\"App 2\"]],[]]]]],[1,\"\\n              \"],[8,[30,5],null,null,null],[1,\"\\n              \"],[8,[30,4],null,null,[[\"default\"],[[[[1,\"App 3\"]],[]]]]],[1,\"\\n            \"]],[4,5]]]]],[1,\"\\n          \"]],[]]]]],[1,\"\\n        \"]],[3]]]]],[1,\"\\n    \"]],[1]],[[],[]]]]],[1,\"\\n\"],[13]],[\"s\",\"GlobalAction\",\"HeaderPanel\",\"Item\",\"Divider\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, UIShell, UserAvatar, toggleSwitcher, switcherOpen],
  "isStrictMode": true
}), templateOnly(undefined, "ui-shell.gjs"));

const repl_145 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<div
  style='position: relative; height: 20rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
>
  <UIShell>
    <:shell as |s|>
      <s.Sidenav @open={{true}}>
        <:default as |_Menu _Divider SideNavHeader SideNavDetails _SideNavIcon HeaderSideNavItems|>
          <SideNavHeader @icon={{UserAvatar}}>IBM</SideNavHeader>
          <SideNavDetails @title='Account'>
            <p>jane.doe@example.com</p>
          </SideNavDetails>
          <HeaderSideNavItems @hasDivider={{true}}>
            <li>Mirrored link 1</li>
            <li>Mirrored link 2</li>
          </HeaderSideNavItems>
        </:default>
      </s.Sidenav>
    </:shell>
    <:content></:content>
  </UIShell>
</div>
*/
{
  "id": "UlKofWM/",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,0],[14,5,\"position: relative; height: 20rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);\"],[12],[1,\"\\n  \"],[8,[32,1],null,null,[[\"shell\",\"content\"],[[[[1,\"\\n      \"],[8,[30,1,[\"Sidenav\"]],null,[[\"@open\"],[true]],[[\"default\"],[[[[1,\"\\n          \"],[8,[30,4],null,[[\"@icon\"],[[32,2]]],[[\"default\"],[[[[1,\"IBM\"]],[]]]]],[1,\"\\n          \"],[8,[30,5],null,[[\"@title\"],[\"Account\"]],[[\"default\"],[[[[1,\"\\n            \"],[10,2],[12],[1,\"jane.doe@example.com\"],[13],[1,\"\\n          \"]],[]]]]],[1,\"\\n          \"],[8,[30,7],null,[[\"@hasDivider\"],[true]],[[\"default\"],[[[[1,\"\\n            \"],[10,\"li\"],[12],[1,\"Mirrored link 1\"],[13],[1,\"\\n            \"],[10,\"li\"],[12],[1,\"Mirrored link 2\"],[13],[1,\"\\n          \"]],[]]]]],[1,\"\\n        \"]],[2,3,4,5,6,7]]]]],[1,\"\\n    \"]],[1]],[[],[]]]]],[1,\"\\n\"],[13]],[\"s\",\"_Menu\",\"_Divider\",\"SideNavHeader\",\"SideNavDetails\",\"_SideNavIcon\",\"HeaderSideNavItems\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, UIShell, UserAvatar],
  "isStrictMode": true
}), templateOnly(undefined, "ui-shell.gjs"));

const repl_146 = setComponentTemplate(templateFactory(
/*
  <ThemeSupport />
<div
  style='position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
>
  <UIShell>
    <:shell as |s|>
      <s.HeaderContainer as |c|>
        <s.Header
          @title='IBM'
          @subtitle='Platform'
          @open={{c.isSideNavExpanded}}
          @onToggle={{c.onClickSideNavExpand}}
        />
        <s.Sidenav @open={{c.isSideNavExpanded}} />
      </s.HeaderContainer>
    </:shell>
    <:content></:content>
  </UIShell>
</div>
*/
{
  "id": "B0hnzKce",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,0],[14,5,\"position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);\"],[12],[1,\"\\n  \"],[8,[32,1],null,null,[[\"shell\",\"content\"],[[[[1,\"\\n      \"],[8,[30,1,[\"HeaderContainer\"]],null,null,[[\"default\"],[[[[1,\"\\n        \"],[8,[30,1,[\"Header\"]],null,[[\"@title\",\"@subtitle\",\"@open\",\"@onToggle\"],[\"IBM\",\"Platform\",[30,2,[\"isSideNavExpanded\"]],[30,2,[\"onClickSideNavExpand\"]]]],null],[1,\"\\n        \"],[8,[30,1,[\"Sidenav\"]],null,[[\"@open\"],[[30,2,[\"isSideNavExpanded\"]]]],null],[1,\"\\n      \"]],[2]]]]],[1,\"\\n    \"]],[1]],[[],[]]]]],[1,\"\\n\"],[13]],[\"s\",\"c\"],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, UIShell],
  "isStrictMode": true
}), templateOnly(undefined, "ui-shell.gjs"));

const repl_147 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature
  @package="carbon-components-ember"
  @module='declarations/components/ui-shell'
  @name='default'
/>
*/
{
  "id": "V4peZ5b6",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/ui-shell\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "ui-shell.gjs"));

const uiShell_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="ui-shell">UI Shell</h1>
<p>The UI Shell is the structural framework of an application that houses
navigational elements and page content, so users can move through an
application consistently and predictably. It composes a <code>Header</code> (top bar
with the product name, navigation, and global actions), an optional <code>Nav</code>
(top-level navigation links), a <code>Sidenav</code> (left-hand navigation panel), and
the page <code>content</code> region.</p>
<carbon-shadow-demo id="repl_142" class="repl-sdk__demo"><div><repl_142></repl_142></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { array } from '@ember/helper';
import { UIShell } from 'carbon-components-ember/components';
import { Notification, UserAvatar } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const sideNavOpen = cell(true);
const onToggle = (value) => (sideNavOpen.current = value);
const noop = () => {};
const subLinks = [{ title: 'Sub-link 1' }, { title: 'Sub-link 2' }];

&#x3C;template>
  &#x3C;ThemeSupport />
  \{{! The wrapper's transform makes it the containing block for the
      shell's fixed-position header and side nav, so the preview stays
      inside this box instead of overlaying the whole page. }}
  &#x3C;div
    style='position: relative; height: 26rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
  >
    &#x3C;UIShell>
      &#x3C;:shell as |s|>
        &#x3C;s.Header @title='IBM' @subtitle='Platform' @open=\{{sideNavOpen.current}} @onToggle=\{{onToggle}}>
          &#x3C;:header>
            &#x3C;s.Nav as |Item|>
              &#x3C;Item>Link 1&#x3C;/Item>
              &#x3C;Item>Link 2&#x3C;/Item>
              &#x3C;Item>Link 3&#x3C;/Item>
            &#x3C;/s.Nav>
          &#x3C;/:header>
          &#x3C;:headerGlobal as |GlobalAction|>
            &#x3C;GlobalAction @aria-label='Notifications' @icon=\{{Notification}} @onClick=\{{noop}} />
            &#x3C;GlobalAction @aria-label='User Avatar' @icon=\{{UserAvatar}} @onClick=\{{noop}} />
          &#x3C;/:headerGlobal>
        &#x3C;/s.Header>
        &#x3C;s.Sidenav @open=\{{sideNavOpen.current}}>
          &#x3C;:default as |Menu Divider|>
            &#x3C;Menu @title='Category 1' @submenus=\{{subLinks}} as |Sub|>
              \{{#each subLinks as |link|}}
                &#x3C;Sub @title=\{{link.title}} @transitionTo=\{{noop}} />
              \{{/each}}
            &#x3C;/Menu>
            &#x3C;Divider />
            &#x3C;Menu @title='Category 2' @isCurrent=\{{false}} @transitionTo=\{{noop}} @submenus=\{{array}} />
          &#x3C;/:default>
          &#x3C;:footer as |Footer|>
            &#x3C;Footer @open=\{{sideNavOpen.current}} @onToggle=\{{onToggle}} />
          &#x3C;/:footer>
        &#x3C;/s.Sidenav>
      &#x3C;/:shell>
      &#x3C;:content>
        &#x3C;p>Page content&#x3C;/p>
      &#x3C;/:content>
    &#x3C;/UIShell>
  &#x3C;/div>
&#x3C;/template>
</code></pre></div>
<h2 id="global-header-actions">Global header actions</h2>
<p>Pass action buttons (search, notifications, user profile, app switcher, ...)
into the <code>headerGlobal</code> named block; each one is yielded a <code>GlobalAction</code>
component that renders an icon button in the header's global action bar.</p>
<h2 id="side-navigation-dividers-and-footer">Side navigation dividers and footer</h2>
<p>The <code>Sidenav</code> block yields a <code>Divider</code> component to separate groups of
navigation items, and a <code>footer</code> named block that yields a <code>Footer</code> toggle
control for expanding/collapsing the rail — wire both to the same
<code>@open</code>/<code>@onToggle</code> state used by the <code>Header</code>'s menu button.</p>
<h2 id="header-dropdown-menus">Header dropdown menus</h2>
<p>The <code>Nav</code> block yields a second component, <code>Menu</code> (<code>HeaderMenu</code>), for
top-level items that expand to show a list of <code>HeaderMenuItem</code>s.</p>
<carbon-shadow-demo id="repl_143" class="repl-sdk__demo"><div><repl_143></repl_143></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { UIShell } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;div
    style='position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
  >
    &#x3C;UIShell>
      &#x3C;:shell as |s|>
        &#x3C;s.Header @title='IBM' @subtitle='Platform'>
          &#x3C;:header>
            &#x3C;s.Nav as |Item Menu|>
              &#x3C;Item>Link 1&#x3C;/Item>
              &#x3C;Menu @menuLinkName='Link 2' as |MenuItem|>
                &#x3C;MenuItem @isActive=\{{true}}>Sub-link 1&#x3C;/MenuItem>
                &#x3C;MenuItem>Sub-link 2&#x3C;/MenuItem>
              &#x3C;/Menu>
            &#x3C;/s.Nav>
          &#x3C;/:header>
        &#x3C;/s.Header>
      &#x3C;/:shell>
      &#x3C;:content>&#x3C;/:content>
    &#x3C;/UIShell>
  &#x3C;/div>
&#x3C;/template>
</code></pre></div>
<h2 id="header-panel-and-switcher">Header panel and switcher</h2>
<p><code>Header</code> yields a <code>HeaderPanel</code> component into the <code>headerPanel</code> named
block for building panels such as an application switcher — toggle its
<code>@expanded</code> argument from a <code>GlobalAction</code>'s <code>onClick</code>. The top-level
<code>UIShell</code> yields a <code>Switcher</code> component (with <code>Item</code> and <code>Divider</code>) for
rendering the switcher's contents.</p>
<carbon-shadow-demo id="repl_144" class="repl-sdk__demo"><div><repl_144></repl_144></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { UIShell } from 'carbon-components-ember/components';
import { UserAvatar } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';
import { cell } from 'ember-resources';

const switcherOpen = cell(false);
const toggleSwitcher = () => (switcherOpen.current = !switcherOpen.current);

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;div
    style='position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
  >
    &#x3C;UIShell>
      &#x3C;:shell as |s|>
        &#x3C;s.Header @title='IBM' @subtitle='Platform'>
          &#x3C;:headerGlobal as |GlobalAction|>
            &#x3C;GlobalAction
              @aria-label='App switcher'
              @icon=\{{UserAvatar}}
              @onClick=\{{toggleSwitcher}}
            />
          &#x3C;/:headerGlobal>
          &#x3C;:headerPanel as |HeaderPanel|>
            &#x3C;HeaderPanel @expanded=\{{switcherOpen.current}} @onToggle=\{{toggleSwitcher}}>
              &#x3C;s.Switcher @aria-label='App switcher' as |Item Divider|>
                &#x3C;Item @isSelected=\{{true}}>App 1&#x3C;/Item>
                &#x3C;Item>App 2&#x3C;/Item>
                &#x3C;Divider />
                &#x3C;Item>App 3&#x3C;/Item>
              &#x3C;/s.Switcher>
            &#x3C;/HeaderPanel>
          &#x3C;/:headerPanel>
        &#x3C;/s.Header>
      &#x3C;/:shell>
      &#x3C;:content>&#x3C;/:content>
    &#x3C;/UIShell>
  &#x3C;/div>
&#x3C;/template>
</code></pre></div>
<h2 id="side-navigation-header-details-and-mirrored-header-items">Side navigation header, details, and mirrored header items</h2>
<p>The <code>Sidenav</code> block also yields <code>SideNavHeader</code> (an icon + heading for the
rail), <code>SideNavDetails</code> (a titled block, useful for account info), and
<code>HeaderSideNavItems</code> (mirrors top <code>Header</code> nav items into the rail for
smaller viewports).</p>
<carbon-shadow-demo id="repl_145" class="repl-sdk__demo"><div><repl_145></repl_145></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { UIShell } from 'carbon-components-ember/components';
import { UserAvatar } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;div
    style='position: relative; height: 20rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
  >
    &#x3C;UIShell>
      &#x3C;:shell as |s|>
        &#x3C;s.Sidenav @open=\{{true}}>
          &#x3C;:default as |_Menu _Divider SideNavHeader SideNavDetails _SideNavIcon HeaderSideNavItems|>
            &#x3C;SideNavHeader @icon=\{{UserAvatar}}>IBM&#x3C;/SideNavHeader>
            &#x3C;SideNavDetails @title='Account'>
              &#x3C;p>jane.doe@example.com&#x3C;/p>
            &#x3C;/SideNavDetails>
            &#x3C;HeaderSideNavItems @hasDivider=\{{true}}>
              &#x3C;li>Mirrored link 1&#x3C;/li>
              &#x3C;li>Mirrored link 2&#x3C;/li>
            &#x3C;/HeaderSideNavItems>
          &#x3C;/:default>
        &#x3C;/s.Sidenav>
      &#x3C;/:shell>
      &#x3C;:content>&#x3C;/:content>
    &#x3C;/UIShell>
  &#x3C;/div>
&#x3C;/template>
</code></pre></div>
<h2 id="header-container">HeaderContainer</h2>
<p><code>HeaderContainer</code> (yielded from the top-level <code>shell</code> block) manages the
<code>isSideNavExpanded</code> state for you and collapses it when the user presses
<kbd>Escape</kbd>, so you don't have to keep your own <code>@open</code>/<code>@onToggle</code>
cell. It yields <code>isSideNavExpanded</code> and <code>onClickSideNavExpand</code> for wiring up
the <code>Header</code>'s menu toggle and the <code>Sidenav</code>'s <code>@open</code> argument.</p>
<carbon-shadow-demo id="repl_146" class="repl-sdk__demo"><div><repl_146></repl_146></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { UIShell } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
  &#x3C;ThemeSupport />
  &#x3C;div
    style='position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'
  >
    &#x3C;UIShell>
      &#x3C;:shell as |s|>
        &#x3C;s.HeaderContainer as |c|>
          &#x3C;s.Header
            @title='IBM'
            @subtitle='Platform'
            @open=\{{c.isSideNavExpanded}}
            @onToggle=\{{c.onClickSideNavExpand}}
          />
          &#x3C;s.Sidenav @open=\{{c.isSideNavExpanded}} />
        &#x3C;/s.HeaderContainer>
      &#x3C;/:shell>
      &#x3C;:content>&#x3C;/:content>
    &#x3C;/UIShell>
  &#x3C;/div>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>UIShell</h3></summary>
<div id="repl_147" class="repl-sdk__demo"><repl_147></repl_147></div>
</details>
*/
{
  "id": "LDfrETxj",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"ui-shell\"],[12],[1,\"UI Shell\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"The UI Shell is the structural framework of an application that houses\\nnavigational elements and page content, so users can move through an\\napplication consistently and predictably. It composes a \"],[10,\"code\"],[12],[1,\"Header\"],[13],[1,\" (top bar\\nwith the product name, navigation, and global actions), an optional \"],[10,\"code\"],[12],[1,\"Nav\"],[13],[1,\"\\n(top-level navigation links), a \"],[10,\"code\"],[12],[1,\"Sidenav\"],[13],[1,\" (left-hand navigation panel), and\\nthe page \"],[10,\"code\"],[12],[1,\"content\"],[13],[1,\" region.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_142\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { array } from '@ember/helper';\\nimport { UIShell } from 'carbon-components-ember/components';\\nimport { Notification, UserAvatar } from 'carbon-components-ember/icons';\\nimport { ThemeSupport } from 'docs-support';\\nimport { cell } from 'ember-resources';\\n\\nconst sideNavOpen = cell(true);\\nconst onToggle = (value) => (sideNavOpen.current = value);\\nconst noop = () => {};\\nconst subLinks = [{ title: 'Sub-link 1' }, { title: 'Sub-link 2' }];\\n\\n<template>\\n  <ThemeSupport />\\n  \"],[1,\"{{! The wrapper's transform makes it the containing block for the\\n      shell's fixed-position header and side nav, so the preview stays\\n      inside this box instead of overlaying the whole page. }}\\n  <div\\n    style='position: relative; height: 26rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'\\n  >\\n    <UIShell>\\n      <:shell as |s|>\\n        <s.Header @title='IBM' @subtitle='Platform' @open=\"],[1,\"{{sideNavOpen.current}} @onToggle=\"],[1,\"{{onToggle}}>\\n          <:header>\\n            <s.Nav as |Item|>\\n              <Item>Link 1</Item>\\n              <Item>Link 2</Item>\\n              <Item>Link 3</Item>\\n            </s.Nav>\\n          </:header>\\n          <:headerGlobal as |GlobalAction|>\\n            <GlobalAction @aria-label='Notifications' @icon=\"],[1,\"{{Notification}} @onClick=\"],[1,\"{{noop}} />\\n            <GlobalAction @aria-label='User Avatar' @icon=\"],[1,\"{{UserAvatar}} @onClick=\"],[1,\"{{noop}} />\\n          </:headerGlobal>\\n        </s.Header>\\n        <s.Sidenav @open=\"],[1,\"{{sideNavOpen.current}}>\\n          <:default as |Menu Divider|>\\n            <Menu @title='Category 1' @submenus=\"],[1,\"{{subLinks}} as |Sub|>\\n              \"],[1,\"{{#each subLinks as |link|}}\\n                <Sub @title=\"],[1,\"{{link.title}} @transitionTo=\"],[1,\"{{noop}} />\\n              \"],[1,\"{{/each}}\\n            </Menu>\\n            <Divider />\\n            <Menu @title='Category 2' @isCurrent=\"],[1,\"{{false}} @transitionTo=\"],[1,\"{{noop}} @submenus=\"],[1,\"{{array}} />\\n          </:default>\\n          <:footer as |Footer|>\\n            <Footer @open=\"],[1,\"{{sideNavOpen.current}} @onToggle=\"],[1,\"{{onToggle}} />\\n          </:footer>\\n        </s.Sidenav>\\n      </:shell>\\n      <:content>\\n        <p>Page content</p>\\n      </:content>\\n    </UIShell>\\n  </div>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"global-header-actions\"],[12],[1,\"Global header actions\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Pass action buttons (search, notifications, user profile, app switcher, ...)\\ninto the \"],[10,\"code\"],[12],[1,\"headerGlobal\"],[13],[1,\" named block; each one is yielded a \"],[10,\"code\"],[12],[1,\"GlobalAction\"],[13],[1,\"\\ncomponent that renders an icon button in the header's global action bar.\"],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"side-navigation-dividers-and-footer\"],[12],[1,\"Side navigation dividers and footer\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"The \"],[10,\"code\"],[12],[1,\"Sidenav\"],[13],[1,\" block yields a \"],[10,\"code\"],[12],[1,\"Divider\"],[13],[1,\" component to separate groups of\\nnavigation items, and a \"],[10,\"code\"],[12],[1,\"footer\"],[13],[1,\" named block that yields a \"],[10,\"code\"],[12],[1,\"Footer\"],[13],[1,\" toggle\\ncontrol for expanding/collapsing the rail — wire both to the same\\n\"],[10,\"code\"],[12],[1,\"@open\"],[13],[1,\"/\"],[10,\"code\"],[12],[1,\"@onToggle\"],[13],[1,\" state used by the \"],[10,\"code\"],[12],[1,\"Header\"],[13],[1,\"'s menu button.\"],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"header-dropdown-menus\"],[12],[1,\"Header dropdown menus\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"The \"],[10,\"code\"],[12],[1,\"Nav\"],[13],[1,\" block yields a second component, \"],[10,\"code\"],[12],[1,\"Menu\"],[13],[1,\" (\"],[10,\"code\"],[12],[1,\"HeaderMenu\"],[13],[1,\"), for\\ntop-level items that expand to show a list of \"],[10,\"code\"],[12],[1,\"HeaderMenuItem\"],[13],[1,\"s.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_143\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { UIShell } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <div\\n    style='position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'\\n  >\\n    <UIShell>\\n      <:shell as |s|>\\n        <s.Header @title='IBM' @subtitle='Platform'>\\n          <:header>\\n            <s.Nav as |Item Menu|>\\n              <Item>Link 1</Item>\\n              <Menu @menuLinkName='Link 2' as |MenuItem|>\\n                <MenuItem @isActive=\"],[1,\"{{true}}>Sub-link 1</MenuItem>\\n                <MenuItem>Sub-link 2</MenuItem>\\n              </Menu>\\n            </s.Nav>\\n          </:header>\\n        </s.Header>\\n      </:shell>\\n      <:content></:content>\\n    </UIShell>\\n  </div>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"header-panel-and-switcher\"],[12],[1,\"Header panel and switcher\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"Header\"],[13],[1,\" yields a \"],[10,\"code\"],[12],[1,\"HeaderPanel\"],[13],[1,\" component into the \"],[10,\"code\"],[12],[1,\"headerPanel\"],[13],[1,\" named\\nblock for building panels such as an application switcher — toggle its\\n\"],[10,\"code\"],[12],[1,\"@expanded\"],[13],[1,\" argument from a \"],[10,\"code\"],[12],[1,\"GlobalAction\"],[13],[1,\"'s \"],[10,\"code\"],[12],[1,\"onClick\"],[13],[1,\". The top-level\\n\"],[10,\"code\"],[12],[1,\"UIShell\"],[13],[1,\" yields a \"],[10,\"code\"],[12],[1,\"Switcher\"],[13],[1,\" component (with \"],[10,\"code\"],[12],[1,\"Item\"],[13],[1,\" and \"],[10,\"code\"],[12],[1,\"Divider\"],[13],[1,\") for\\nrendering the switcher's contents.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_144\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,3],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { UIShell } from 'carbon-components-ember/components';\\nimport { UserAvatar } from 'carbon-components-ember/icons';\\nimport { ThemeSupport } from 'docs-support';\\nimport { cell } from 'ember-resources';\\n\\nconst switcherOpen = cell(false);\\nconst toggleSwitcher = () => (switcherOpen.current = !switcherOpen.current);\\n\\n<template>\\n  <ThemeSupport />\\n  <div\\n    style='position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'\\n  >\\n    <UIShell>\\n      <:shell as |s|>\\n        <s.Header @title='IBM' @subtitle='Platform'>\\n          <:headerGlobal as |GlobalAction|>\\n            <GlobalAction\\n              @aria-label='App switcher'\\n              @icon=\"],[1,\"{{UserAvatar}}\\n              @onClick=\"],[1,\"{{toggleSwitcher}}\\n            />\\n          </:headerGlobal>\\n          <:headerPanel as |HeaderPanel|>\\n            <HeaderPanel @expanded=\"],[1,\"{{switcherOpen.current}} @onToggle=\"],[1,\"{{toggleSwitcher}}>\\n              <s.Switcher @aria-label='App switcher' as |Item Divider|>\\n                <Item @isSelected=\"],[1,\"{{true}}>App 1</Item>\\n                <Item>App 2</Item>\\n                <Divider />\\n                <Item>App 3</Item>\\n              </s.Switcher>\\n            </HeaderPanel>\\n          </:headerPanel>\\n        </s.Header>\\n      </:shell>\\n      <:content></:content>\\n    </UIShell>\\n  </div>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"side-navigation-header-details-and-mirrored-header-items\"],[12],[1,\"Side navigation header, details, and mirrored header items\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"The \"],[10,\"code\"],[12],[1,\"Sidenav\"],[13],[1,\" block also yields \"],[10,\"code\"],[12],[1,\"SideNavHeader\"],[13],[1,\" (an icon + heading for the\\nrail), \"],[10,\"code\"],[12],[1,\"SideNavDetails\"],[13],[1,\" (a titled block, useful for account info), and\\n\"],[10,\"code\"],[12],[1,\"HeaderSideNavItems\"],[13],[1,\" (mirrors top \"],[10,\"code\"],[12],[1,\"Header\"],[13],[1,\" nav items into the rail for\\nsmaller viewports).\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_145\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,4],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { UIShell } from 'carbon-components-ember/components';\\nimport { UserAvatar } from 'carbon-components-ember/icons';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <div\\n    style='position: relative; height: 20rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'\\n  >\\n    <UIShell>\\n      <:shell as |s|>\\n        <s.Sidenav @open=\"],[1,\"{{true}}>\\n          <:default as |_Menu _Divider SideNavHeader SideNavDetails _SideNavIcon HeaderSideNavItems|>\\n            <SideNavHeader @icon=\"],[1,\"{{UserAvatar}}>IBM</SideNavHeader>\\n            <SideNavDetails @title='Account'>\\n              <p>jane.doe@example.com</p>\\n            </SideNavDetails>\\n            <HeaderSideNavItems @hasDivider=\"],[1,\"{{true}}>\\n              <li>Mirrored link 1</li>\\n              <li>Mirrored link 2</li>\\n            </HeaderSideNavItems>\\n          </:default>\\n        </s.Sidenav>\\n      </:shell>\\n      <:content></:content>\\n    </UIShell>\\n  </div>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"header-container\"],[12],[1,\"HeaderContainer\"],[13],[1,\"\\n\"],[10,2],[12],[10,\"code\"],[12],[1,\"HeaderContainer\"],[13],[1,\" (yielded from the top-level \"],[10,\"code\"],[12],[1,\"shell\"],[13],[1,\" block) manages the\\n\"],[10,\"code\"],[12],[1,\"isSideNavExpanded\"],[13],[1,\" state for you and collapses it when the user presses\\n\"],[10,\"kbd\"],[12],[1,\"Escape\"],[13],[1,\", so you don't have to keep your own \"],[10,\"code\"],[12],[1,\"@open\"],[13],[1,\"/\"],[10,\"code\"],[12],[1,\"@onToggle\"],[13],[1,\"\\ncell. It yields \"],[10,\"code\"],[12],[1,\"isSideNavExpanded\"],[13],[1,\" and \"],[10,\"code\"],[12],[1,\"onClickSideNavExpand\"],[13],[1,\" for wiring up\\nthe \"],[10,\"code\"],[12],[1,\"Header\"],[13],[1,\"'s menu toggle and the \"],[10,\"code\"],[12],[1,\"Sidenav\"],[13],[1,\"'s \"],[10,\"code\"],[12],[1,\"@open\"],[13],[1,\" argument.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_146\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,5],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { UIShell } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n  <ThemeSupport />\\n  <div\\n    style='position: relative; height: 14rem; overflow: hidden; transform: translate(0); border: 1px solid var(--cds-border-subtle-01, #e0e0e0);'\\n  >\\n    <UIShell>\\n      <:shell as |s|>\\n        <s.HeaderContainer as |c|>\\n          <s.Header\\n            @title='IBM'\\n            @subtitle='Platform'\\n            @open=\"],[1,\"{{c.isSideNavExpanded}}\\n            @onToggle=\"],[1,\"{{c.onClickSideNavExpand}}\\n          />\\n          <s.Sidenav @open=\"],[1,\"{{c.isSideNavExpanded}} />\\n        </s.HeaderContainer>\\n      </:shell>\\n      <:content></:content>\\n    </UIShell>\\n  </div>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"UIShell\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_147\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,6],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_142, repl_143, repl_144, repl_145, repl_146, repl_147],
  "isStrictMode": true
}), templateOnly(undefined, "ui-shell.gjs"));

export { uiShell_gjs as default };

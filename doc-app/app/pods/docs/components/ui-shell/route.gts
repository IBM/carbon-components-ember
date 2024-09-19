import Demo from 'ember-cli-addon-docs/components/docs-demo';
import set from 'carbon-components-ember/helpers/set';
import UiShell from 'carbon-components-ember/components/ui-shell';
import Icon from 'carbon-components-ember/components/icon';
import Menu from 'carbon-components-ember/components/menu';
import Tabs from 'carbon-components-ember/components/tabs';
import RouteTemplate, { RoutableComponent } from 'ember-routable-component';
import { on } from '@ember/modifier';
import UiShellController from 'doc-app/pods/docs/components/ui-shell/controller.ts';

class RouteComponent extends RoutableComponent<UiShellController> {
  <template>
    <h1>
      Carbon Shell UI
    </h1>

    <Demo as |demo|>
      {{! template-lint-disable no-forbidden-elements }}
      <style>
        .cds--side-nav { position: inherit; } .cds--header { position: inherit;
        } .docs-p-4 { position: relative; } .bx--header { position: absolute; }
        .bx--side-nav { position: absolute; } div#example-ui-shell\.hbs {
        height: 500px } div#example-ui-shell-2\.hbs { height: 500px }
      </style>
      <demo.example @name='ui-shell.hbs'>
        {{!import UiShell from 'carbon-components-ember/components/ui-shell'}}
        {{!import Icon from 'carbon-components-ember/components/icon'}}
        {{!import Menu from 'carbon-components-ember/components/menu'}}

        <UiShell>
          <:shell as |shell|>
            <shell.Header
              @onToggle={{set @controller 'leftSideBarOpen'}}
              @open={{@controller.leftSideBarOpen}}
              @title='Ui Shell'
              @subtitle='1.0'
            >
              <:header-global>
                <div style='float: right; margin-right: 100px'>
                  <Menu @direction='top' @icon='user--avatar' as |Item|>
                    <Item {{on 'click' @controller.logout}}>
                      Logout
                    </Item>
                  </Menu>
                </div>
              </:header-global>
            </shell.Header>
            <shell.Sidenav
              @menuItems={{@controller.menuItems}}
              @currentMenu={{@controller.currentMenu}}
              @transitionTo={{@controller.transitionTo}}
              @open={{@controller.leftSideBarOpen}}
            />
          </:shell>
          <:content>
            <div>
              <div class='page-header'>
                <h4 style='display: inline-block' class='page-header__label'>
                  {{@controller.currentMenu.title}}
                </h4>
                <Icon @icon='chevron--right' />
                <h1
                  id='page-title'
                  class='page-header__title'
                  style='display: inline-block'
                >
                  Page Title
                </h1>
                <div style='width: 100%'>
                  <span class='flex'></span>
                </div>
              </div>
              <div>
                {{#if @controller.menuTitle.tabs}}
                  <Tabs
                    style='min-width: 150px'
                    @tabSelected={{@controller.transitionTo}}
                    @selectedTab={{@controller.currentTab}}
                    as |Pane|
                  >
                    {{#each @controller.menuTitle.tabs as |tab|}}
                      <Pane @title={{tab}} />
                    {{/each}}
                  </Tabs>
                  <div style='margin-top: 50px'></div>
                {{/if}}
              </div>
              <div>
                <section style='margin-top: 30px'>
                  Outlet Page content here
                  {{outlet}}
                </section>
              </div>
            </div>
          </:content>
        </UiShell>
      </demo.example>
      <demo.snippet @name='ui-shell.hbs' />
      <demo.snippet @name='ui-shell.js' />

      <demo.example @name='ui-shell-2.hbs'>
        {{!import UiShell from 'carbon-components-ember/components/ui-shell'}}
        {{!import Icon from 'carbon-components-ember/components/icon'}}
        {{!import Menu from 'carbon-components-ember/components/menu'}}

        <UiShell>
          <:shell as |shell|>
            <shell.Header
              @onToggle={{set @controller 'leftSideBarOpen'}}
              @open={{@controller.leftSideBarOpen}}
              @title='Ui Shell'
              @subtitle='1.0'
            >
              <:header-global>
                <div style='float: right; margin-right: 100px'>
                  <Menu @direction='top' @icon='user--avatar' as |Item|>
                    <Item {{on 'click' @controller.logout}}>
                      Logout
                    </Item>
                  </Menu>
                </div>
              </:header-global>
            </shell.Header>
            <shell.Sidenav
              @menuItems={{@controller.menuItems}}
              @currentMenu={{@controller.currentMenu}}
              @transitionTo={{@controller.transitionTo}}
              @open={{@controller.leftSideBarOpen}}
            />
          </:shell>
          <:content>
            <div>
              <div class='page-header'>
                <h4 style='display: inline-block' class='page-header__label'>
                  {{@controller.currentMenu.title}}
                </h4>
                <Icon @icon='chevron--right' />
                <h1
                  id='page-title'
                  class='page-header__title'
                  style='display: inline-block'
                >
                  Page Title
                </h1>
                <div style='width: 100%'>
                  <span class='flex'></span>
                </div>
              </div>
              <div>
                {{#if @controller.menuTitle.tabs}}
                  <Tabs
                    style='min-width: 150px'
                    @tabSelected={{@controller.transitionTo}}
                    @selectedTab={{@controller.currentTab}}
                    as |Pane|
                  >
                    {{#each @controller.menuTitle.tabs as |tab|}}
                      <Pane @title={{tab}} />
                    {{/each}}
                  </Tabs>
                  <div style='margin-top: 50px'></div>
                {{/if}}
              </div>
              <div>
                <section style='margin-top: 30px'>
                  Outlet Page content here
                  {{outlet}}
                </section>
              </div>
            </div>
          </:content>
        </UiShell>
      </demo.example>
      <demo.snippet @name='ui-shell-2.hbs' />
      <demo.snippet @name='ui-shell.js' />
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);

import Demo from 'ember-cli-addon-docs/components/docs-demo';
import newObj from 'carbon-components-ember/helpers/new-obj';
import { fn } from '@ember/helper';
import Tabs from 'carbon-components-ember/components/tabs';
import RouteTemplate from 'ember-routable-component';
import Component from '@glimmer/component';

class RouteComponent extends Component {
  <template>
    <h1>
      Carbon Tabs
    </h1>

    <Demo as |demo|>
      {{#let (newObj) as |context|}}
        <demo.example @name='tabs.hbs'>
          {{!import Tab from 'carbon-components-ember/components/tab'}}

          <Tabs @loading={{true}} />

          <br />

          <Tabs
            @selectedTab={{context.selected}}
            @tabSelected={{fn (mut context.selected)}}
            as |TabPane|
          >
            <TabPane @title='Tab Label 1' @isDefault={{true}}>
              title:
              {{context.selected}}
            </TabPane>
            <TabPane @title='Tab Label 2' @disabled={{true}}>
              title:
              {{context.selected}}
            </TabPane>
            <TabPane @title='Tab Label 4 with a very long long label'>
              title:
              {{context.selected}}
            </TabPane>
          </Tabs>
        </demo.example>
      {{/let}}
      <demo.snippet @name='tabs.hbs' />
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);

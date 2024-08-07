import Demo from 'ember-cli-addon-docs/components/docs-demo';
import Menu from 'carbon-components-ember/components/menu';
import newObj from 'carbon-components-ember/helpers/new-obj';
import Checkbox from 'carbon-components-ember/components/checkbox';
import set from 'carbon-components-ember/helpers/set';
import not from 'ember-truth-helpers/helpers/not';
import { fn } from '@ember/helper';
import RouteTemplate from 'ember-routable-component';
import Component from '@glimmer/component';

class RouteComponent extends Component {
  <template>
    <h1>
      Carbon Menu
    </h1>

    <Demo as |demo|>
      <demo.example @name='menu.hbs'>
        {{!import Menu from 'carbon-components-ember/components/menu'}}
        {{#let (newObj) as |context|}}
          <Checkbox
            @checked={{context.danger}}
            @onChange={{fn (set context 'danger') (not context.danger)}}
          >
            danger
          </Checkbox>
          <Checkbox
            @checked={{context.disabled}}
            @onChange={{fn (set context 'disabled') (not context.disabled)}}
          >
            disabled
          </Checkbox>
          <br />
          <Menu
            @tooltip='Options'
            @direction='bottom'
            @danger={{context.danger}}
            @disabled={{context.disabled}}
            as |Item|
          >
            <Item>option 1</Item>
            <Item
              @tooltip='Option 2 is an example of a really long string and how we recommend handling this'
            >
              Option 2 is an example of a really long string and how we
              recommend handling this
            </Item>
            <Item>option 3</Item>
            <Item @isDivider={{true}}>option 4</Item>
          </Menu>
        {{/let}}
      </demo.example>
      <demo.snippet @name='menu.hbs' />
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);

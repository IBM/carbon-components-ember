import Icon from 'carbon-components-ember/components/icon';
import DocsDemo from 'ember-cli-addon-docs/components/docs-demo';
import { fn } from '@ember/helper';
import noop from '~/helpers/noop';
import RouteTemplate from 'ember-route-template/route';
import Component from '@glimmer/component';

class RouteComponent extends Component {
  <template>
    <h1>
      Carbon Icon
    </h1>

    <DocsDemo as |demo|>
      <demo.example @name='icon.hbs'>
        <Icon @icon='bookmark' />
        <Icon @icon='task' @onClick={{fn (noop)}} />
      </demo.example>
      <demo.snippet @name='icon.hbs' />
    </DocsDemo>
  </template>
}

export default RouteTemplate(RouteComponent);

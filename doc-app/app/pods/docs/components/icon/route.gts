import Icon from 'carbon-components-ember/components/icon';
import DocsDemo from 'ember-cli-addon-docs/components/docs-demo';
import { fn } from '@ember/helper';
import noop from 'doc-app/helpers/noop';
import RouteTemplate, { RoutableComponent } from 'ember-routable-component';

class RouteComponent extends RoutableComponent {
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

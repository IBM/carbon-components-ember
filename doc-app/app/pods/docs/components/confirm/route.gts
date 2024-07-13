import DocsDemo from 'ember-cli-addon-docs/components/docs-demo';
import Confirm from 'carbon-components-ember/components/dialogs/confirm';
import RouteTemplate, { RoutableComponent } from 'ember-routable-component';
import { fn } from '@ember/helper';
import ConfirmController from './controller.ts';
import Controller from '@ember/controller';

class RouteComponent extends RoutableComponent<ConfirmController> {
  <template>
    <h1>
      Carbon Confirm Dialog
    </h1>

    <DocsDemo as |demo|>
      <demo.example @name='confirm.hbs'>
        {{#unless @controller.answer}}
          <Confirm
            @type='info'
            @body='are you sure?'
            @onCancel={{fn (mut @controller.answer) 'no'}}
            @onAccept={{fn (mut @controller.answer) 'yes'}}
          />
        {{/unless}}
        {{@controller.answer}}
      </demo.example>
      <demo.snippet @name='confirm.hbs' />
      <demo.snippet @name='confirm.js' />
    </DocsDemo>
  </template>
}

export default RouteTemplate(RouteComponent);

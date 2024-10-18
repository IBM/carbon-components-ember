import Demo from 'ember-cli-addon-docs/components/docs-demo';
import Modal from 'carbon-components-ember/components/modal';
import RouteTemplate, { RoutableComponent } from 'ember-routable-component';

class RouteComponent extends RoutableComponent {
  <template>
    <h1>
      Carbon Modal
    </h1>

    <Demo as |demo|>
      <demo.example @name='modal.hbs'>
        {{!import Modal from 'carbon-components-ember/components/modal'}}

        <Modal>
          <:label>
            Label
          </:label>
          <:header>
            Header
          </:header>
          <:body>
            body
          </:body>
          <:footer>
            footer
          </:footer>
        </Modal>
      </demo.example>
      <demo.snippet @name='modal.hbs' />
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);

import Loading from 'carbon-components-ember/components/loading';
import Button from 'carbon-components-ember/components/button';
import DocsDemo from 'ember-cli-addon-docs/components/docs-demo';
import { fn } from '@ember/helper';
import not from 'ember-truth-helpers/helpers/not';
import newObj from 'carbon-components-ember/helpers/new-obj';
import RouteTemplate from 'ember-routable-component';
import Component from '@glimmer/component';

class RouteComponent extends Component {
  <template>
    <h1>
      Carbon Loading
    </h1>

    <DocsDemo as |demo|>
      {{#let (newObj) as |context|}}
        <demo.example @name='loading.hbs'>
          <Loading />
          <Loading @inline={{true}} />
          <Loading @active={{false}} />
          <Loading @small={{true}} />
          {{#if context.showOver}}
            <Loading @overlay={{true}} />
          {{/if}}
          <Button
            @type='primary'
            @onClick={{fn (mut context.showOver) (not context.showOver)}}
          >
            show with overlay
          </Button>
        </demo.example>
      {{/let}}
      <demo.snippet @name='loading.hbs' />
    </DocsDemo>
  </template>
}

export default RouteTemplate(RouteComponent);

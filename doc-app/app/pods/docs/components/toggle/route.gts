import Demo from 'ember-cli-addon-docs/components/docs-demo';
import Toggle from 'carbon-components-ember/components/toggle';
import newObj from 'carbon-components-ember/helpers/new-obj';
import { fn } from '@ember/helper';
import not from 'ember-truth-helpers/helpers/not';
import RouteTemplate from 'ember-routable-component';
import Component from '@glimmer/component';

const RouteComponent = <template>
  <h1>
    Carbon Toggle
  </h1>

  <Demo as |demo|>
    {{#let (newObj) as |context|}}
      <demo.example @name='toggle.hbs'>
        {{!import Toggle from 'carbon-components-ember/components/toggle'}}

        <Toggle @name='toggle is off' @value={{false}} />
        <Toggle @name='toggle is on' @value={{true}} />
        <Toggle @name='toggle is disabled' @disabled={{true}} />
        <Toggle @name='toggle is readonly' @readonly={{true}} />
        <Toggle
          @name='toggle with click'
          @value={{context.checked}}
          @onChange={{fn (mut context.checked) (not context.checked)}}
        />
      </demo.example>
    {{/let}}
    <demo.snippet @name='toggle.hbs' />
  </Demo>
</template>;

export default RouteTemplate(RouteComponent);

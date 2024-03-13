import Hero from 'ember-cli-addon-docs/components/docs-hero';
import Demo from 'ember-cli-addon-docs/components/docs-demo';
import RouteTemplate from 'ember-route-template';
import Component from '@glimmer/component';

class RouteComponent extends Component {
  <template>
    <Hero
      @prefix='Ember'
      @heading='Carbon Components'
      @byline='Carbon Components for Ember'
    />

    <div class='container'>
      <Demo as |demo|>
        <demo.example @name='my-demo.hbs'>
          <p>
            The Ember Carbon Components
          </p>
        </demo.example>
      </Demo>
    </div>
  </template>
}

export default RouteTemplate(RouteComponent);

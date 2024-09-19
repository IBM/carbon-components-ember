import Hero from 'ember-cli-addon-docs/components/docs-hero';
import Demo from 'ember-cli-addon-docs/components/docs-demo';
import RouteTemplate, { RoutableComponent } from 'ember-routable-component';
import Component from '@glimmer/component';

class RouteComponent extends RoutableComponent {
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
            Make sure to read up on the DocsDemo component before building out
            this page.
          </p>
        </demo.example>
      </Demo>
    </div>
  </template>
}

export default RouteTemplate(RouteComponent);

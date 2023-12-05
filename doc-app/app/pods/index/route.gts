import Hero from 'ember-cli-addon-docs/components/docs-hero';
import Demo from 'ember-cli-addon-docs/components/docs-demo';
import { service } from '@ember/service';
import RouteTemplate, { RoutableComponent } from 'ember-routable-component';

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
            The Ember Carbon Components
          </p>
        </demo.example>
      </Demo>
    </div>
  </template>
}

export default class extends RouteTemplate(RouteComponent) {
  @service() router;
  redirect() {
    this.router.replaceWith('docs.getting-started.installation');
  }
}

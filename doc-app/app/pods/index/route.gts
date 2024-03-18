import Hero from 'ember-cli-addon-docs/components/docs-hero';
import Demo from 'ember-cli-addon-docs/components/docs-demo';
import Component from '@glimmer/component';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RouteTemplate from 'ember-route-template/route';

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

function RoutableComponent(Component) {
  return class RoutableComponent extends Route {
    Component = Component;
    init() {
      this.templateName = 'ember-route-template/ember-route-template'
    }
  }
}

export default class extends RouteTemplate(RouteComponent) {
  @service() router;
  redirect() {
    this.router.replaceWith('docs.getting-started.installation');
  }
}

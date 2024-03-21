import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'doc-app/config/environment';
import { RSVP } from '@ember/-internals/runtime';
import Ember from 'ember';

window.define('doc-app/config/environment', () => config);
window.define('rsvp', () => RSVP);
window.define('ember', () => Ember);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);

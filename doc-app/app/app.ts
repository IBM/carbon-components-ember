import './setup-config';
import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'doc-app/config/environment';
import { RSVP } from '@ember/-internals/runtime';
import Ember from 'ember';
import './app.scss';
window.define('rsvp', () => RSVP);
window.define('ember', () => Ember);

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  init(properties: object | undefined) {
    super.init(properties);
    loadInitializers(App, config.modulePrefix);
  }
}


import.meta.hot.on('vite:beforeUpdate', (options) => {
  options.updates = options.updates.filter(
    (u) => !u.path.startsWith(`/assets/${config.modulePrefix}.js`),
  );
});

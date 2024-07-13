import Application from '@ember/application';
import { next } from '@ember/runloop';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'test-app/config/environment';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  constructor(...args) {
    let r = super(...args);
    if (App.__loadedInitializers) return;
    loadInitializers(App, config.modulePrefix);
    App.__loadedInitializers = true;
  }
}

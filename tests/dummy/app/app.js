import RSVP from 'rsvp';
import Application from '@ember/application';
import loadInitializers from 'ember-load-initializers';

import Resolver from './resolver';
import config from 'dummy/config/environment';


// fix for https://github.com/tildeio/rsvp.js/pull/491
// used in virtual-each
RSVP.cast = RSVP.resolve;

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, `${config.modulePrefix}`);

export default App;

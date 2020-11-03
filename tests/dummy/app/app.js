import RSVP from 'rsvp';
import Application from '@ember/application';
import loadInitializers from 'ember-load-initializers';

import Resolver from './resolver';
import config from 'dummy/config/environment';


const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, `${config.modulePrefix}`);

export default App;

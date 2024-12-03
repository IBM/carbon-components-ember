import Ember from 'ember';
import * as runtime from '@glimmer/runtime';
import * as tracking from '@glimmer/tracking';
import * as validator from '@glimmer/validator';
import { RSVP } from '@ember/-internals/runtime';

import config from './config/environment';
import * as loader from './loader';

window.define = loader.define;
window.require = loader.require;
window.requireModule = loader.requireModule;

window.define('@glimmer/tracking', () => tracking);
window.define('@glimmer/runtime', () => runtime);
window.define('@glimmer/validator', () => validator);
window.define('rsvp', () => RSVP);
window.define('ember', () => ({ default: Ember }));
window.define('doc-app/config/environment', () => ({
  default: config,
}));

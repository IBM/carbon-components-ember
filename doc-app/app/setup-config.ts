import config from './config/environment';
import { RSVP } from '@ember/-internals/runtime';
import Ember from 'ember';
import * as tracking from '@glimmer/tracking';
import * as runtime from '@glimmer/runtime';
import * as validator from '@glimmer/validator';
console.log(runtime);
window.define('@glimmer/tracking', () => tracking);
window.define('@glimmer/runtime', () => runtime);
window.define('@glimmer/validator', () => validator);
window.define('rsvp', () => RSVP);
window.define('ember', () => ({ default: Ember }));
window.define('doc-app/config/environment', () => ({
  default: config,
}));

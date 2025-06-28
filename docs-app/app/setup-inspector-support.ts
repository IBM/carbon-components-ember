import Ember from 'ember';
// @ts-expect-error dont care
import * as runtime from '@glimmer/runtime';
// @ts-expect-error dont care
import * as reference from '@glimmer/reference';
import * as tracking from '@glimmer/tracking';
// @ts-expect-error dont care
import * as validator from '@glimmer/validator';
import { RSVP } from '@ember/-internals/runtime';
import * as metal from '@ember/-internals/metal';

import config from './config/environment';

window.define('@ember/-internals/metal', () => metal);
window.define('@glimmer/tracking', () => tracking);
window.define('@glimmer/reference', () => reference);
window.define('@glimmer/runtime', () => runtime);
window.define('@glimmer/validator', () => validator);
window.define('rsvp', () => RSVP);
window.define('ember/barrel', () => ({ default: Ember }));
window.define('doc-app/config/environment', () => ({
  default: config,
}));
document.dispatchEvent(new Event('Ember'));

import Ember from 'ember';
import rsvp from 'rsvp';

window.define('ember', () => Ember);
window.define('rsvp', () => rsvp);

export default window.require('fetch').default;
export const setupFastboot = window.require('fetch').setupFastboot;

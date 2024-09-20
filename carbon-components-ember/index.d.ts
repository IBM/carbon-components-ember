import DialogManager from './addon/services/dialog-manager';
import Notifications from './addon/services/notifications';
import 'ember-source/types/stable';

declare module '@ember/service' {
  export interface Registry {
    'carbon/dialog-manager': DialogManager;
    'carbon/notifications': Notifications;
  }
}

declare global {
  interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
}

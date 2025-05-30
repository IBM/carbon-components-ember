import DialogManager from './addon/services/dialog-manager';
import Notifications from './addon/services/notifications';
import 'ember-source/types';

declare module '@ember/service' {
  export interface Registry {
    'carbon-components-ember@dialog-manager': DialogManager;
    'carbon.dialog-manager': DialogManager;
    'carbon-components-ember@notifications': Notifications;
    'carbon.notifications': Notifications;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
}

import DialogManager from './addon/services/dialog-manager'
import Notifications from './addon/services/notifications'
import { ComponentLike, HelperLike } from '@glint/template';

declare module '@ember/service' {
  export interface Registry {
    'carbon-components-ember@dialog-manager': DialogManager
    'carbon.dialog-manager': DialogManager
    'carbon-components-ember@notifications': Notifications
    'carbon.notifications': Notifications
  }
}

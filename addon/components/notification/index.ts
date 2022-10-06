import Component from '@glimmer/component';
import { action } from '@ember/object';
import NotificationService, { NotificationOptions } from 'carbon-components-ember/services/notifications';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';


type Args = {
  onClick: null|Function;
  notification?: NotificationOptions;
} & NotificationOptions

export interface NotificationComponentSignature {
  Args: Args;
  Element: HTMLDivElement
}

export default class NotificationComponent extends Component<NotificationComponentSignature> {
  @tracked show = true;
  @service('carbon.notifications') notifications: NotificationService;

  @action
  onNotificationClick(notification) {
    if (this.notifications.has(notification)) {
      this.notifications.remove(notification);
    } else {
      this.show = false;
    }
  }
}

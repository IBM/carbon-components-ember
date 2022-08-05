import Component from '@glimmer/component';
import { action } from '@ember/object';
import NotificationService from 'carbon-components-ember/services/notifications';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';


type Args = {
  onClick: null|Function;
}

export default class NotificationComponent extends Component<Args> {
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

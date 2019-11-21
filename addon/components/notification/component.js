import Component from '@ember/component';
import { action } from '@ember/object';


export default class NotificationComponent extends Component {
  @action
  onNotificationClick(notification) {
    if (this.attrs.onClick) {
      this.attrs.onClick(notification);
    }
  }
}

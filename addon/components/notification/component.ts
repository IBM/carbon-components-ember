import Component from '@glimmer/component';
import { action } from '@ember/object';


type Args = {
  onClick: null|Function;
}

export default class NotificationComponent extends Component<Args> {
  @action
  onNotificationClick(notification) {
    if (this.args.onClick) {
      this.args.onClick(notification);
    }
  }
}

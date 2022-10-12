import Component from '@glimmer/component';
import { action } from '@ember/object';
import NotificationService, { NotificationOptions } from 'carbon-components-ember/services/notifications';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { IconNames } from 'carbon-components-ember/components/icon';


type Args = {
  onClick: null|Function;
  notification?: NotificationOptions;
} & NotificationOptions

export interface NotificationComponentSignature {
  Args: Args;
  Element: HTMLDivElement;
}

export default class NotificationComponent extends Component<NotificationComponentSignature> {
  @tracked show = true;
  @service('carbon.notifications') notifications: NotificationService;

  get icon(): IconNames {
    const mapping: Record<Required<NotificationOptions>['kind'], IconNames> = {
      'info': 'information',
      error: 'error--filled',
      'info-square': 'information--square--filled',
      success: 'checkmark--filled',
      warning: 'warning',
      'warning-alt': 'warning--alt--filled'
    };
    return mapping[this.defaultArgs.kind];
  }

  get defaultArgs(): WithRequired<Args, 'display'|'kind'> {
    const type = this.args.type || 'error';
    return Object.assign({},
      this.args.notification || {},{
      display: 'toast',
      kind: this.args.kind || type,
    }, this.args);
  }

  @action
  onNotificationClick(notification) {
    if (this.notifications.has(notification)) {
      this.notifications.remove(notification);
    } else {
      this.show = false;
    }
  }
}

// BEGIN-SNIPPET notification.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class NotificationController extends Controller {
  /**
   * @type {NotificationService}
   */
  @service('carbon-components-ember@notifications') notifications;
  @action
  showNotification(type) {
    this.notifications.info({
      caption: 'test'
    })
  }
}
// END-SNIPPET

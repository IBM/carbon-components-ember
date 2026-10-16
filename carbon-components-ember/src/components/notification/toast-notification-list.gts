/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { service } from '@ember/service';
import type NotificationService from '../../services/notifications.ts';
import type { Toast } from '../../services/notifications.ts';
import ActionableNotification from './actionable-notification.gts';
import ToastNotification from './toast-notification.gts';
import './toast-notification-list.scss';

export interface ToastNotificationListSignature {
  Element: HTMLDivElement;
}

/**
 * Shows the toasts of the `carbon.notifications` service, newest first, at
 * the top right of the window, below the UI Shell header. Render it once, in
 * the application template.
 */
export default class ToastNotificationList extends Component<ToastNotificationListSignature> {
  @service('carbon.notifications') declare notifications: NotificationService;

  close = (toast: Toast, event?: Event) => {
    // A timeout closes the toast whatever onClose returns, as in Carbon React.
    if (toast.onClose?.(event) === false && event) return false;
    this.notifications.remove(toast);
  };

  <template>
    <div class="cds--ember-toast-notification-list" ...attributes>
      {{#each this.notifications.toasts as |toast|}}
        {{#if toast.actionButtonLabel}}
          <ActionableNotification
            @actionButtonLabel={{toast.actionButtonLabel}}
            @ariaLabel={{toast.ariaLabel}}
            @caption={{toast.caption}}
            @closeOnEscape={{toast.closeOnEscape}}
            @hideCloseButton={{toast.hideCloseButton}}
            @kind={{toast.kind}}
            @lowContrast={{toast.lowContrast}}
            @onActionButtonClick={{toast.onActionButtonClick}}
            @onClose={{fn this.close toast}}
            @role={{toast.role}}
            @statusIconDescription={{toast.statusIconDescription}}
            @subtitle={{toast.subtitle}}
            @title={{toast.title}}
          />
        {{else}}
          <ToastNotification
            @ariaLabel={{toast.ariaLabel}}
            @caption={{toast.caption}}
            @hideCloseButton={{toast.hideCloseButton}}
            @kind={{toast.kind}}
            @lowContrast={{toast.lowContrast}}
            @onClose={{fn this.close toast}}
            @statusIconDescription={{toast.statusIconDescription}}
            @subtitle={{toast.subtitle}}
            @timeout={{toast.timeout}}
            @title={{toast.title}}
            role={{or toast.role "status"}}
          />
        {{/if}}
      {{/each}}
    </div>
  </template>
}

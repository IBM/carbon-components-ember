/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { service } from '@ember/service';
import { modifier } from 'ember-modifier';
import type LayersService from '../../services/layers.ts';
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
 * the application template. While a `Modal` is open, the list moves into it,
 * so its toasts can be used over the modal.
 */
export default class ToastNotificationList extends Component<ToastNotificationListSignature> {
  @service('carbon.layers') declare layers: LayersService;
  @service('carbon.notifications') declare notifications: NotificationService;

  // Moving the list, rather than rendering it into the modal, keeps its
  // toasts' countdowns and focus. Its parent is never moved, so Glimmer can
  // still remove it.
  moveIntoModal = modifier(
    (list: HTMLDivElement, [modal]: [modal: HTMLDialogElement | undefined]) => {
      const home = list.parentElement;
      if (!modal || !home) return;
      modal.append(list);
      return () => home.append(list);
    },
  );

  close = (toast: Toast, event?: Event) => {
    // A timeout closes the toast whatever onClose returns, as in Carbon React.
    if (toast.onClose?.(event) === false && event) return false;
    this.notifications.remove(toast);
  };

  <template>
    <div class="cds--ember-toast-notification-list__home">
      <div
        class="cds--ember-toast-notification-list"
        ...attributes
        {{this.moveIntoModal this.layers.modal}}
      >
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
    </div>
  </template>
}

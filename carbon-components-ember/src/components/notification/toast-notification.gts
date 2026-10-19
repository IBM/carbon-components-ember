/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { rawTimeout, task } from 'ember-concurrency';
import type { TaskInstance } from 'ember-concurrency';
import { modifier } from 'ember-modifier';
import Text from '../text.gts';
import NotificationButton from './notification-button.gts';
import NotificationIcon from './-notification-icon.gts';
import type { NotificationKind } from './-notification-icon.gts';

export interface ToastNotificationSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * Provide a description for the "close" icon button that can be read by
     * screen readers. Carbon React's `aria-label`; an `aria-label` attribute
     * would label the notification instead.
     */
    ariaLabel?: string;
    /**
     * Specify the caption.
     */
    caption?: string;
    /**
     * Specify whether the close button should be hidden.
     */
    hideCloseButton?: boolean;
    /**
     * Specify what state the notification represents. Defaults to `'error'`.
     */
    kind?: NotificationKind;
    /**
     * Specify whether you are using the low contrast variant of the
     * ToastNotification.
     */
    lowContrast?: boolean;
    /**
     * Provide a function that is called when the notification closes, from
     * its close button or its timeout. Return `false` to keep it open after
     * a click on the close button.
     */
    onClose?: (event?: Event) => boolean | void;
    /**
     * Provide a function that is called when the close button is clicked.
     */
    onCloseButtonClick?: (event: MouseEvent) => void;
    /**
     * Provide a description for the "status" icon that can be read by screen
     * readers. Defaults to `'<kind> icon'`.
     */
    statusIconDescription?: string;
    /**
     * Specify the subtitle.
     */
    subtitle?: string;
    /**
     * Specify an optional duration, in milliseconds, after which the
     * notification closes. `0` (the default) keeps it open. Unlike Carbon
     * React's, the countdown pauses while the pointer or focus is on the
     * notification.
     */
    timeout?: number;
    /**
     * Specify the title.
     */
    title?: string;
  };
  Blocks: {
    /** More content, after the caption. Don't put interactive elements here; use an `ActionableNotification` for those. */
    default: [];
  };
}

/**
 * A non-modal, time-based message at the edge of the screen. To show toasts
 * from anywhere in an app, use the `carbon.notifications` service and a
 * `ToastNotificationList`.
 */
export default class ToastNotification extends Component<ToastNotificationSignature> {
  @tracked isOpen = true;

  get kind(): NotificationKind {
    return this.args.kind ?? 'error';
  }

  get statusIconDescription() {
    return this.args.statusIconDescription || `${this.kind} icon`;
  }

  onCloseButtonClick = (event: MouseEvent) => {
    this.args.onCloseButtonClick?.(event);
    if (this.args.onClose?.(event) !== false) this.isOpen = false;
  };

  // rawTimeout, not timeout: settled() mustn't wait for a toast to close, or
  // tests could never see one.
  closeAfter = task({ restartable: true }, async (ms: number) => {
    await rawTimeout(ms);
    this.isOpen = false;
    this.args.onClose?.();
  });

  // Counts `timeout` down while neither the pointer nor focus is on the toast.
  countdown = modifier((element: HTMLDivElement, [timeout]: [number?]) => {
    if (!timeout) return;
    let remaining = timeout;
    let startedAt = 0;
    let timer: TaskInstance<void> | undefined;
    let hovered = false;
    let focused = false;

    const update = () => {
      const paused = hovered || focused;
      if (paused && timer) {
        void timer.cancel();
        timer = undefined;
        remaining -= Date.now() - startedAt;
      } else if (!paused && !timer) {
        startedAt = Date.now();
        timer = this.closeAfter.perform(remaining);
      }
    };
    const onMouseEnter = () => {
      hovered = true;
      update();
    };
    const onMouseLeave = () => {
      hovered = false;
      update();
    };
    const onFocusIn = () => {
      focused = true;
      update();
    };
    const onFocusOut = (event: FocusEvent) => {
      focused = element.contains(event.relatedTarget as Node | null);
      update();
    };

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mouseleave', onMouseLeave);
    element.addEventListener('focusin', onFocusIn);
    element.addEventListener('focusout', onFocusOut);
    update();

    return () => {
      void timer?.cancel();
      element.removeEventListener('mouseenter', onMouseEnter);
      element.removeEventListener('mouseleave', onMouseLeave);
      element.removeEventListener('focusin', onFocusIn);
      element.removeEventListener('focusout', onFocusOut);
    };
  });

  <template>
    {{#if this.isOpen}}
      <div
        role="status"
        class="cds--toast-notification cds--toast-notification--{{this.kind}}
          {{if @lowContrast 'cds--toast-notification--low-contrast'}}"
        {{this.countdown @timeout}}
        ...attributes
      >
        <NotificationIcon
          @notificationType="toast"
          @kind={{this.kind}}
          @iconDescription={{this.statusIconDescription}}
        />
        <div class="cds--toast-notification__details">
          {{#if @title}}
            <Text @as="div" class="cds--toast-notification__title">
              {{@title}}
            </Text>
          {{/if}}
          {{#if @subtitle}}
            <Text @as="div" class="cds--toast-notification__subtitle">
              {{@subtitle}}
            </Text>
          {{/if}}
          {{#if @caption}}
            <Text @as="div" class="cds--toast-notification__caption">
              {{@caption}}
            </Text>
          {{/if}}
          {{yield}}
        </div>
        {{#unless @hideCloseButton}}
          <NotificationButton
            @notificationType="toast"
            @ariaLabel={{@ariaLabel}}
            {{on "click" this.onCloseButtonClick}}
          />
        {{/unless}}
      </div>
    {{/if}}
  </template>
}

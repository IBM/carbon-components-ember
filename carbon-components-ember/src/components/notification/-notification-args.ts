/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { NotificationKind } from './-notification-icon.gts';

/**
 * Carbon React's `NotificationCloseHandler`: return `false` to keep the
 * notification open. Each notification passes the event that closed it.
 */
export type NotificationCloseHandler<E = MouseEvent> = (
  event: E,
) => boolean | void;

/** The args ToastNotification, ActionableNotification and InlineNotification share. */
export interface NotificationArgs {
  /**
   * Provide a description for the "close" icon button that can be read by
   * screen readers. Carbon React's `aria-label`; an `aria-label` attribute
   * would label the notification instead.
   */
  ariaLabel?: string;
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
   * notification.
   */
  lowContrast?: boolean;
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
   * Specify the title.
   */
  title?: string;
}

/** The caption ToastNotification and ActionableNotification take. */
export interface NotificationCaptionArgs {
  /**
   * Specify the caption.
   */
  caption?: string;
}

import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { NotificationKind } from '../components/notification/-notification-icon.gts';

/**
 * A toast for the `carbon.notifications` service, rendered by
 * `ToastNotificationList`: a `ToastNotification`, or an
 * `ActionableNotification` when it has an `actionButtonLabel`. Each field is
 * passed on as the argument of the same name.
 */
export interface Toast {
  kind?: NotificationKind;
  title?: string;
  subtitle?: string;
  caption?: string;
  /**
   * Closes the toast after this many milliseconds; `0` keeps it open.
   * Defaults to 5000 for `info`, `info-square` and `success` toasts, and to
   * `0` for errors and warnings. Toasts with an action ignore it: they stay
   * until closed.
   */
  timeout?: number;
  lowContrast?: boolean;
  hideCloseButton?: boolean;
  statusIconDescription?: string;
  /** The close button's label. */
  ariaLabel?: string;
  /**
   * `'status'` by default, or `'alertdialog'` for a toast with an action,
   * which then takes focus.
   */
  role?: string;
  /** Called when the toast closes. Return `false` from a close button click to keep it. */
  onClose?: (event?: Event) => boolean | void;
  /** Makes it an `ActionableNotification` with this action. */
  actionButtonLabel?: string;
  onActionButtonClick?: (event: MouseEvent) => void;
  /** ActionableNotification only. */
  closeOnEscape?: boolean;
}

const PERSISTENT_KINDS = new Set<NotificationKind | undefined>([
  undefined,
  'error',
  'warning',
  'warning-alt',
]);

const defaultTimeout = (toast: Toast) =>
  toast.actionButtonLabel || PERSISTENT_KINDS.has(toast.kind) ? 0 : 5000;

/**
 * Shows toasts from anywhere in an app. Render a `ToastNotificationList` once,
 * in the application template, then add toasts:
 * `this.notifications.success({ title: 'Saved' })`.
 */
export default class NotificationService extends Service {
  /** The toasts to show, newest first. */
  @tracked toasts: Toast[] = [];

  /** Shows a toast. Returns it, to `remove` it later. */
  add(toast: Toast): Toast {
    const added = { ...toast, timeout: toast.timeout ?? defaultTimeout(toast) };
    this.toasts = [added, ...this.toasts];
    return added;
  }

  info(toast: Omit<Toast, 'kind'>) {
    return this.add({ ...toast, kind: 'info' });
  }

  success(toast: Omit<Toast, 'kind'>) {
    return this.add({ ...toast, kind: 'success' });
  }

  warning(toast: Omit<Toast, 'kind'>) {
    return this.add({ ...toast, kind: 'warning' });
  }

  error(toast: Omit<Toast, 'kind'>) {
    return this.add({ ...toast, kind: 'error' });
  }

  /** Closes a toast. */
  remove(toast: Toast) {
    this.toasts = this.toasts.filter((shown) => shown !== toast);
  }

  /** Closes every toast. */
  clear() {
    this.toasts = [];
  }
}

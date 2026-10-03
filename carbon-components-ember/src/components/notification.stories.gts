import Component from '@glimmer/component';
import { service } from '@ember/service';
import { expect, waitFor, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import Notification from './notification.gts';

import type NotificationService from '../services/notifications.ts';

// Carbon React splits notifications into separate components and story
// files (Components/Notifications/Toast, /Inline, /Actionable, /Callout). The
// Ember addon has a single `Notification` component whose `@display` picks
// the variant, so those become the `Toast`, `Inline` and `Actionable`
// stories here.
//
// Parity gaps:
// - No Callout / StaticNotification variant.
// - No `lowContrast`, `hideCloseButton`, `statusIconDescription`, `role`,
//   `closeOnEscape` or `aria-label` args.
// - No `onClose` / `onCloseButtonClick` / `onActionButtonClick` callbacks:
//   only the toast's close button does anything (it hides the toast); the
//   inline and actionable close buttons and the action button are inert.
// - `@actionTitle` is the action *button* label; there is no subtitle for
//   the actionable variant other than `@text`.

const meta = preview.meta({
  title: 'Components/Notifications',
  component: Notification,
  parameters: {
    docs: {
      description: {
        component:
          'Notifications are messages that communicate information to the user. `@display` selects a `toast` (default), `inline` or `actionable` notification and `@type` (or `@kind`) its status. Toasts can also be queued through the `carbon.notifications` service (see the *Service* story).',
      },
    },
  },
  args: {
    type: 'error',
    title: 'Notification title',
    text: 'Subtitle text goes here',
  },
  argTypes: {
    display: { control: 'select', options: ['toast', 'inline', 'actionable'] },
    type: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
  },
});

export const Toast = meta.story({
  args: {
    display: 'toast',
    caption: '00:00:00 AM',
  },
});

Toast.test(
  'the close button hides the toast',
  async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Notification title',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'close notification' }),
    );
    await expect(canvas.queryByRole('alert')).toBeNull();
  },
);

export const Inline = meta.story({
  args: {
    display: 'inline',
  },
});

export const Actionable = meta.story({
  args: {
    display: 'actionable',
    actionTitle: 'Action',
  },
});

export const Success = meta.story({
  args: {
    type: 'success',
    caption: 'success',
    title: 'Success',
    text: 'a long long long long message',
  },
});

export const Info = meta.story({
  args: {
    display: 'actionable',
    type: 'info',
    caption: 'info',
    title: 'Actionable title',
    actionTitle: 'Actionable subtitle text goes here',
    text: undefined,
  },
});

export const Warning = meta.story({
  args: {
    type: 'warning',
    caption: 'warning',
    title: undefined,
    text: undefined,
  },
});

class NotificationsDemo extends Component {
  @service('carbon.notifications') declare notifications: NotificationService;

  showNotification = () => {
    this.notifications.info({
      title: 'Info',
      caption: 'test',
    });
  };

  <template>
    <Button @type="primary" @onClick={{this.showNotification}}>
      Notify
    </Button>

    <div
      data-test-notification-queue
      style="position: absolute; top: 0; right: 0"
    >
      {{#each this.notifications.queue as |n|}}
        <Notification @notification={{n}} />
        <div style="margin: 2px"></div>
      {{/each}}
    </div>
  </template>
}

// The `carbon.notifications` service keeps a queue of toasts; render it
// wherever they should appear. Queued toasts disappear after their timeout
// (5 seconds) or when closed.
export const Service = meta.story({
  parameters: {
    docs: { story: { inline: false, iframeHeight: '200px' } },
  },
  render: () => <template><NotificationsDemo /></template>,
});

Service.test(
  'queues a toast and removes it when closed',
  async ({ canvas, canvasElement, userEvent }) => {
    const queue = within(
      canvasElement.querySelector<HTMLElement>(
        '[data-test-notification-queue]',
      )!,
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Notify' }));
    await expect(queue.getByRole('alert')).toHaveTextContent('Info');
    // It keeps the type it was queued with (`info`).
    await expect(queue.getByRole('alert')).toHaveClass(
      'cds--toast-notification--info',
    );
    await userEvent.click(
      queue.getByRole('button', { name: 'close notification' }),
    );
    await waitFor(() => expect(queue.queryByRole('alert')).toBeNull());
  },
);

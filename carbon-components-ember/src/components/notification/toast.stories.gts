import { expect, fn as spy } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ToastNotification from './toast-notification.gts';

// Carbon React parity: Components/Notifications/Toast has one story,
// `Default`, which this file mirrors. React's `role` prop is the `role`
// attribute here.

const meta = preview.meta({
  title: 'Components/Notifications/Toast',
  component: ToastNotification,
  parameters: {
    docs: {
      description: {
        component:
          'Toast notifications are non-modal, time-based messages that slide in at the top right of the screen. Like `InlineNotification`, they can\'t contain interactive elements or rich text, don\'t take focus, and are announced by screen readers when rendered (`role="status"`; set `role="alert"` or `role="log"` for another announcement). Toasts stay until closed unless `@timeout` is set; Carbon suggests 5 seconds. Unlike Carbon React\'s, the countdown pauses while the pointer or focus is on the toast. Make sure the information can be found elsewhere once a toast is gone. To show toasts from anywhere in an app, use the `carbon.notifications` service and a `ToastNotificationList`.',
      },
    },
  },
  args: {
    kind: 'error',
    lowContrast: false,
    hideCloseButton: false,
    ariaLabel: 'closes notification',
    statusIconDescription: 'notification',
    onClose: spy(),
    onCloseButtonClick: spy(),
  },
  argTypes: {
    kind: {
      control: 'select',
      options: [
        'error',
        'info',
        'info-square',
        'success',
        'warning',
        'warning-alt',
      ],
    },
  },
  render: (args) => <template>
    <ToastNotification
      @ariaLabel={{args.ariaLabel}}
      @caption={{args.caption}}
      @hideCloseButton={{args.hideCloseButton}}
      @kind={{args.kind}}
      @lowContrast={{args.lowContrast}}
      @onClose={{args.onClose}}
      @onCloseButtonClick={{args.onCloseButtonClick}}
      @statusIconDescription={{args.statusIconDescription}}
      @subtitle={{args.subtitle}}
      @timeout={{args.timeout}}
      @title={{args.title}}
    />
  </template>,
});

export const Default = meta.story({
  args: {
    caption: '00:00:00 AM',
    timeout: 0,
    title: 'Notification title',
    subtitle: 'Subtitle text goes here',
  },
});

Default.test(
  'the close button closes the toast',
  async ({ canvas, userEvent, args }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Notification title',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'closes notification' }),
    );
    await expect(args.onCloseButtonClick).toHaveBeenCalledOnce();
    await expect(args.onClose).toHaveBeenCalledOnce();
    await expect(canvas.queryByRole('status')).toBeNull();
  },
);

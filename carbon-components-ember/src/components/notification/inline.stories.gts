import { expect, fn as spy } from 'storybook/test';

import preview from '#storybook/preview.ts';
import InlineNotification from './inline-notification.gts';

// Carbon React parity: Components/Notifications/Inline has one story,
// `Default`, which this file mirrors. React's `role` prop is the `role`
// attribute here.

const meta = preview.meta({
  title: 'Components/Notifications/Inline',
  component: InlineNotification,
  parameters: {
    docs: {
      description: {
        component:
          'Inline notifications show up in task flows, usually at the top of the primary content area or next to the item they relate to, to tell users the status of an action. They can\'t contain interactive elements or rich text, don\'t take focus, and are announced by screen readers when rendered (`role="status"`; set `role="alert"` or `role="log"` for another announcement). They don\'t close on their own: they stay until the user closes them or resolves the issue, and the close button is optional (`@hideCloseButton`). For an action, use an `ActionableNotification` with `@inline`.',
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
    <InlineNotification
      @ariaLabel={{args.ariaLabel}}
      @hideCloseButton={{args.hideCloseButton}}
      @kind={{args.kind}}
      @lowContrast={{args.lowContrast}}
      @onClose={{args.onClose}}
      @onCloseButtonClick={{args.onCloseButtonClick}}
      @statusIconDescription={{args.statusIconDescription}}
      @subtitle={{args.subtitle}}
      @title={{args.title}}
    />
  </template>,
});

export const Default = meta.story({
  args: {
    title: 'Notification title',
    subtitle: 'Subtitle text goes here',
  },
});

Default.test(
  'the close button closes the notification',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'closes notification' }),
    );
    await expect(args.onCloseButtonClick).toHaveBeenCalledOnce();
    await expect(args.onClose).toHaveBeenCalledOnce();
    await expect(canvas.queryByRole('status')).toBeNull();
  },
);

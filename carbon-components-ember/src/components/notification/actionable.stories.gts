import { expect, fn as spy, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ActionableNotification from './actionable-notification.gts';

// Carbon React parity: mirrors Components/Notifications/Actionable's
// `Default` and `Inline` stories.
//
// Parity gaps:
// - No "Feature Flag" page: focus always wraps the way React's
//   `enable-focus-wrap-without-sentinels` flag makes it, without the hidden
//   sentinel elements.

const meta = preview.meta({
  title: 'Components/Notifications/Actionable',
  component: ActionableNotification,
  parameters: {
    docs: {
      description: {
        component:
          "Use an actionable notification when the user needs to act. It can hold an action button (`@actionButtonLabel`, `@onActionButtonClick`), other interactive elements or rich text in its block, and has a toast's style unless `@inline` is set. It moves focus to the action button and keeps it inside the notification until the user acts on it or closes it; Escape closes it unless `@closeOnEscape` is `false`. It stays until closed, so it never times out.\n\n`@role` defaults to `'alertdialog'`. Any other role turns the focus handling off, so use it with caution: before reaching for it, consider a `Callout`. To stay accessible, either render notifications into a region users can jump to with a hotkey, returning focus to where they were once they act or leave it, or collect them in a persistent place such as a side panel and tell users how to get there.",
      },
    },
  },
  args: {
    actionButtonLabel: 'Action',
    inline: false,
    closeOnEscape: true,
    title: 'Notification title',
    subtitle: 'Subtitle text goes here',
    kind: 'error',
    lowContrast: false,
    hideCloseButton: false,
    ariaLabel: 'close notification',
    statusIconDescription: 'notification',
    onClose: spy(),
    onCloseButtonClick: spy(),
    onActionButtonClick: spy(),
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
    <ActionableNotification
      @actionButtonLabel={{args.actionButtonLabel}}
      @ariaLabel={{args.ariaLabel}}
      @caption={{args.caption}}
      @closeOnEscape={{args.closeOnEscape}}
      @hideCloseButton={{args.hideCloseButton}}
      @inline={{args.inline}}
      @kind={{args.kind}}
      @lowContrast={{args.lowContrast}}
      @onActionButtonClick={{args.onActionButtonClick}}
      @onClose={{args.onClose}}
      @onCloseButtonClick={{args.onCloseButtonClick}}
      @role={{args.role}}
      @statusIconDescription={{args.statusIconDescription}}
      @subtitle={{args.subtitle}}
      @title={{args.title}}
    />
  </template>,
});

export const Default = meta.story();

Default.test(
  'takes focus, keeps it inside and closes on Escape',
  async ({ canvas, userEvent, args }) => {
    const action = canvas.getByRole('button', { name: 'Action' });
    await waitFor(() => expect(action).toHaveFocus());
    await userEvent.click(action);
    await expect(args.onActionButtonClick).toHaveBeenCalledOnce();

    await userEvent.tab();
    await expect(
      canvas.getByRole('button', { name: 'close notification' }),
    ).toHaveFocus();
    await userEvent.tab();
    await expect(action).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(
      canvas.getByRole('button', { name: 'close notification' }),
    ).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalledOnce();
    await expect(canvas.queryByRole('alertdialog')).toBeNull();
  },
);

// Hidden from the sidebar and docs page, as React's is.
export const Inline = meta.story({
  args: {
    inline: true,
  },
  tags: ['!dev', '!autodocs'],
});

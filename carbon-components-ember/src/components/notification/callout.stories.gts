import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Link from '../link.gts';
import Callout from './callout.gts';

// Carbon React parity: mirrors Components/Notifications/Callout's `Default`
// and `WithInteractiveElements` stories. The deprecated `StaticNotification`
// alias isn't ported.

const meta = preview.meta({
  title: 'Components/Notifications/Callout',
  component: Callout,
  parameters: {
    docs: {
      description: {
        component:
          "A callout is the most passive notification: a styled block of information that loads with the page's content, next to what it relates to. It can't be closed and only comes in `info` and `warning` kinds. Screen readers don't announce it, so render it with the page (or modal), never in response to user input: users whose focus has already passed it won't know it appeared. Give any action or interactive element in its block an `aria-describedby` that matches `@titleId`.",
      },
    },
  },
  args: {
    kind: 'info',
    lowContrast: false,
    statusIconDescription: 'notification',
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['info', 'warning'],
    },
  },
  render: (args) => <template>
    <Callout
      @actionButtonLabel={{args.actionButtonLabel}}
      @kind={{args.kind}}
      @lowContrast={{args.lowContrast}}
      @onActionButtonClick={{args.onActionButtonClick}}
      @statusIconDescription={{args.statusIconDescription}}
      @subtitle={{args.subtitle}}
      @title={{args.title}}
      @titleId={{args.titleId}}
    />
  </template>,
});

export const Default = meta.story({
  args: {
    subtitle: 'Subtitle text goes here',
    title: 'Notification title',
  },
});

export const WithInteractiveElements = meta.story({
  args: {
    kind: 'info',
    lowContrast: true,
    statusIconDescription: 'notification',
    title: 'Notification title',
    titleId: 'callout-title-interactive',
  },
  parameters: {
    controls: {
      include: ['kind', 'lowContrast', 'statusIconDescription', 'title'],
    },
    docs: {
      description: {
        story:
          'A link in the block points `aria-describedby` at the title, through `@titleId`.',
      },
    },
  },
  render: (args) => <template>
    <Callout
      @kind={{args.kind}}
      @lowContrast={{args.lowContrast}}
      @statusIconDescription={{args.statusIconDescription}}
      @title={{args.title}}
      @titleId={{args.titleId}}
    >
      <div class="cds--inline-notification__subtitle">
        Additional text can describe the notification, or a link to
        <Link @inline={{true}} @href="#" aria-describedby={{args.titleId}}>
          learn more
        </Link>
      </div>
    </Callout>
  </template>,
});

WithInteractiveElements.test(
  'the link is described by the title',
  async ({ canvas }) => {
    await expect(
      canvas.getByRole('link', { name: 'learn more' }),
    ).toHaveAccessibleDescription('Notification title');
  },
);

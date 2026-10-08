import preview from '#storybook/preview.ts';
import Notification from '../notification.gts';

const meta = preview.meta({
  title: 'Components/Notifications/Inline',
  component: Notification,
  parameters: {
    docs: {
      description: {
        component:
          'Inline notifications show up in task flows, to notify users of the status of an action, close to where it happened. `@display="inline"` renders a `Notification` inline; `@type` (or `@kind`) sets its status.',
      },
    },
  },
  args: {
    display: 'inline',
    type: 'error',
    title: 'Notification title',
    text: 'Subtitle text goes here',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
  },
});

export const Default = meta.story();

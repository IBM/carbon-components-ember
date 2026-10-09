import preview from '#storybook/preview.ts';
import Notification from '../notification.gts';

const meta = preview.meta({
  title: 'Components/Notifications/Actionable',
  component: Notification,
  parameters: {
    docs: {
      description: {
        component:
          'Actionable notifications pair a message with an action the user can take. `@display="actionable"` renders one, and `@actionTitle` labels its action button; `@type` (or `@kind`) sets its status.',
      },
    },
  },
  args: {
    display: 'actionable',
    type: 'error',
    title: 'Notification title',
    text: 'Subtitle text goes here',
    actionTitle: 'Action',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
  },
});

export const Default = meta.story();

export const Info = meta.story({
  args: {
    type: 'info',
    caption: 'info',
    title: 'Actionable title',
    actionTitle: 'Actionable subtitle text goes here',
    text: undefined,
  },
});

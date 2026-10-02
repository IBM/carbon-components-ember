import { fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';

const meta = preview.meta({
  title: 'Components/Button',
  component: Button,
  args: {
    label: 'Button',
    onClick: fn(),
  },
  render: (args) => <template>
    <Button
      @type={{args.type}}
      @size={{args.size}}
      @tertiary={{args.tertiary}}
      @ghost={{args.ghost}}
      @disabled={{args.disabled}}
      @loading={{args.loading}}
      @onClick={{args.onClick}}
    >
      {{args.label}}
    </Button>
  </template>,
});

export const Primary = meta.story({
  args: {
    type: 'primary',
  },
});

export const Secondary = meta.story({
  args: {
    type: 'secondary',
  },
});

export const Tertiary = meta.story({
  args: {
    tertiary: true,
  },
});

export const Ghost = meta.story({
  args: {
    ghost: true,
  },
});

export const Loading = Primary.extend({
  args: {
    loading: true,
  },
});

export const Disabled = Primary.extend({
  args: {
    disabled: true,
  },
});

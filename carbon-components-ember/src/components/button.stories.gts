import { fn } from 'storybook/test';

import Button from './button.gts';

import type { Meta, StoryObj } from 'ember-storybook';

export default {
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
} satisfies Meta;

export const Primary: StoryObj = {
  args: {
    type: 'primary',
  },
};

export const Secondary: StoryObj = {
  args: {
    type: 'secondary',
  },
};

export const Tertiary: StoryObj = {
  args: {
    tertiary: true,
  },
};

export const Ghost: StoryObj = {
  args: {
    ghost: true,
  },
};

export const Loading: StoryObj = {
  args: {
    type: 'primary',
    loading: true,
  },
};

export const Disabled: StoryObj = {
  args: {
    type: 'primary',
    disabled: true,
  },
};

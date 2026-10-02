import Tag from './tag.gts';

import type { Meta, StoryObj } from 'ember-storybook';

export default {
  title: 'Components/Tag',
  component: Tag,
  args: {
    label: 'Tag content',
  },
  render: (args) => <template>
    <Tag @type={{args.type}} @size={{args.size}} @disabled={{args.disabled}}>
      {{args.label}}
    </Tag>
  </template>,
} satisfies Meta;

export const Default: StoryObj = {
  args: {
    type: 'gray',
  },
};

export const Blue: StoryObj = {
  args: {
    type: 'blue',
  },
};

export const Small: StoryObj = {
  args: {
    type: 'purple',
    size: 'sm',
  },
};

export const Disabled: StoryObj = {
  args: {
    type: 'teal',
    disabled: true,
  },
};

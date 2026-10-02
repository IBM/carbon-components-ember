import preview from '#storybook/preview.ts';
import Tag from './tag.gts';

import type { Args as TagArgs } from './tag.gts';

// `label` isn't one of Tag's args: it's the text the story yields into the
// tag's block. `preview.type()` replaces the inferred args rather than adding
// to them, so spell out Tag's own args too.
const meta = preview.type<{ args: TagArgs & { label: string } }>().meta({
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
});

export const Default = meta.story({
  args: {
    type: 'gray',
  },
});

export const Blue = meta.story({
  args: {
    type: 'blue',
  },
});

export const Small = meta.story({
  args: {
    type: 'purple',
    size: 'sm',
  },
});

export const Disabled = meta.story({
  args: {
    type: 'teal',
    disabled: true,
  },
});

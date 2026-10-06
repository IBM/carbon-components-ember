import preview from '#storybook/preview.ts';
import Tag from './tag.gts';
import Add from './icons/add.ts';
import Asleep from './icons/asleep.ts';

import type { Args as TagArgs } from './tag.gts';
import type { TOC } from '@ember/component/template-only';

// Parity gaps with Carbon React's Tag stories:
// - `Skeleton`: there is no TagSkeleton component.
// - No `filter`/`title` args, and no DismissibleTag, OperationalTag or
//   SelectableTag components (React's separate Tag story files).
// - `withAILabel`: there is no AILabel component yet (see #406); the
//   `WithDecorator` story shows the `@decorator` slot with a placeholder.

const TYPES: TagArgs['type'][] = [
  'red',
  'magenta',
  'purple',
  'blue',
  'cyan',
  'teal',
  'green',
  'gray',
  'cool-gray',
  'warm-gray',
  'high-contrast',
  'outline',
];

// `label` isn't one of Tag's args: it's the text the story yields into the
// tag's block. `preview.type()` replaces the inferred args rather than adding
// to them, so spell out Tag's own args too.
type StoryArgs = TagArgs & { label: string };

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Tag',
  component: Tag,
  args: {
    label: 'Tag content',
    type: 'gray',
  },
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args: StoryArgs) => <template>
    <Tag
      @type={{args.type}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @renderIcon={{args.renderIcon}}
      @decorator={{args.decorator}}
    >
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
  parameters: {
    a11y: {
      config: {
        // WCAG 1.4.3 exempts inactive components from contrast minimums;
        // axe can't tell a disabled tag (a <div>) is inactive.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
});

// One tag of every type.
export const ReadOnly = meta.story({
  render: (args: StoryArgs) => <template>
    <div>
      {{#each TYPES as |type index|}}
        <Tag @type={{type}} @size={{args.size}} @disabled={{args.disabled}}>
          {{if index args.label "Tag content with a long text description"}}
        </Tag>
      {{/each}}
    </div>
  </template>,
});

// `@size` supports `sm`, `md` (default) or `lg`.
export const Sizes = meta.story({
  render: () => <template>
    <Tag @type="blue" @size="sm">Small</Tag>
    <Tag @type="blue" @size="md">Medium</Tag>
    <Tag @type="blue" @size="lg">Large</Tag>
  </template>,
});

// `@renderIcon` renders an icon inside the tag. The icon is hidden for the
// `sm` size.
export const WithIcon = meta.story({
  args: {
    type: 'blue',
    label: 'With icon',
    renderIcon: Asleep,
  },
});

const DecoratorPlaceholder: TOC<object> = <template>
  <Add @size="16" />
</template>;

// **Experimental:** `@decorator` (or the deprecated `@slug`) renders a
// component inside the tag, such as an AILabel once it's available (see
// #406). Any component can be used as a placeholder in the meantime.
export const WithDecorator = meta.story({
  args: {
    type: 'red',
    label: 'With decorator',
    renderIcon: Add,
    decorator: DecoratorPlaceholder,
  },
});

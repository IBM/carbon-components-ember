import preview from '#storybook/preview.ts';
import SkeletonPlaceholder from './skeleton-placeholder.gts';
import style from 'ember-style-modifier';

// Carbon React parity gaps: none. React's `className` arg is covered by
// Ember's `...attributes` (pass `class=` directly).

const sizeStyle = (width: number, height: number) => ({
  width: `${width}px`,
  height: `${height}px`,
});

// `width`/`height` aren't SkeletonPlaceholder args (it has none): the story
// turns them into an inline style, like Carbon React's story does.
const meta = preview.type<{ args: { width: number; height: number } }>().meta({
  title: 'Components/Skeleton/SkeletonPlaceholder',
  component: SkeletonPlaceholder,
  parameters: {
    docs: {
      description: {
        component:
          'A generic placeholder block shown while content is loading. Size it with a `class`, or with the `{{style}}` modifier for a computed size.',
      },
    },
  },
  argTypes: {
    height: {
      control: { type: 'range', min: 16, max: 400, step: 4 },
    },
    width: {
      control: { type: 'range', min: 16, max: 400, step: 4 },
    },
  },
  args: {
    height: 100,
    width: 100,
  },
  render: (args) => <template>
    <SkeletonPlaceholder {{style (sizeStyle args.width args.height)}} />
  </template>,
});

export const Default = meta.story();

import { htmlSafe } from '@ember/template';

import preview from '#storybook/preview.ts';
import SkeletonIcon from './skeleton-icon.gts';

// Carbon React parity gaps: none. React's `className` arg is covered by
// Ember's `...attributes` (pass `class=` directly).

const sizeStyle = (size: number) =>
  htmlSafe(`margin: 50px; width: ${size}px; height: ${size}px;`);

// `size` isn't one of SkeletonIcon's args (it has none): the story turns it
// into an inline width/height, like Carbon React's story does.
const meta = preview.type<{ args: { size: number } }>().meta({
  title: 'Components/Skeleton/SkeletonIcon',
  component: SkeletonIcon,
  parameters: {
    docs: {
      description: {
        component:
          'A placeholder for an icon while content is loading. It renders a 16px square by default; size it with a `style` or `class` attribute (e.g. `style="width: 24px; height: 24px;"`).',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'range', min: 16, max: 64, step: 1 },
    },
  },
  args: {
    size: 16,
  },
  render: (args) => <template>
    <SkeletonIcon style={{sizeStyle args.size}} />
  </template>,
});

export const Default = meta.story();

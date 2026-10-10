import preview from '#storybook/preview.ts';
import AccordionSkeleton from './accordion-skeleton.gts';

import type { AccordionSkeletonSignature } from './accordion-skeleton.gts';

// Carbon React has no stories of its own for AccordionSkeleton: it's the
// `Skeleton` story of Components/Accordion.

const meta = preview.type<{ args: AccordionSkeletonSignature['Args'] }>().meta({
  title: 'Components/Accordion/AccordionSkeleton',
  component: AccordionSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'A loading placeholder for an `Accordion`: `@count` items, with the first one open unless `@open` is `false`.',
      },
    },
  },
  args: {
    align: 'end',
    count: 4,
    isFlush: false,
    open: true,
    ordered: false,
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'end'] },
  },
  render: (args) => <template>
    <div style="width: 500px">
      <AccordionSkeleton
        @align={{args.align}}
        @count={{args.count}}
        @isFlush={{args.isFlush}}
        @open={{args.open}}
        @ordered={{args.ordered}}
      />
    </div>
  </template>,
});

export const Default = meta.story();

import preview from '#storybook/preview.ts';
import Stack from './stack.gts';

// Carbon React parity gaps: React also exports `HStack`/`VStack` shorthands
// (a Stack with a fixed `orientation`); Ember only has `Stack`, so pass
// `@orientation` instead.

const meta = preview.meta({
  title: 'Layout/Stack',
  component: Stack,
  parameters: {
    docs: {
      description: {
        component: `The Stack component is a useful layout utility in a component-based model. This allows components to not use margin and instead delegate the responsibility of positioning and layout to parent components.

Stack uses the spacing scale from the Design Language in order to determine how much space there should be between items rendered by the Stack component. It also supports a custom \`@gap\` argument which will allow a user to provide a custom value for the gap of the layout (a number from 1 to 13 picks a step of the spacing scale; a string sets any CSS gap value). This component supports both horizontal and vertical orientations.`,
      },
    },
  },
  args: {
    as: 'div',
    gap: 6,
    orientation: 'vertical',
  },
  argTypes: {
    as: { control: { type: 'text' } },
    gap: {
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      control: { type: 'select' },
    },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
    },
  },
  render: (args) => <template>
    <Stack @as={{args.as}} @gap={{args.gap}} @orientation={{args.orientation}}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </Stack>
  </template>,
});

export const Horizontal = meta.story({
  args: {
    orientation: 'horizontal',
  },
});

export const Default = meta.story();

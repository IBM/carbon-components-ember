import preview from '#storybook/preview.ts';
import ListItem from './list-item.gts';
import OrderedList from './ordered-list.gts';

// Carbon React parity gaps: none.

// Carbon React's stories repeat the same item; render it from a list.
const ITEMS = Array.from({ length: 13 });
const NATIVE_TAIL = Array.from({ length: 8 });

const meta = preview.meta({
  title: 'Components/OrderedList',
  component: OrderedList,
  subcomponents: { ListItem },
  parameters: {
    docs: {
      description: {
        component: `Ordered lists are groupings of related content where the order of the items within the group is meaningful.

Each item is a \`ListItem\`: a single \`<li>\` with the styles it needs to work as a child of \`OrderedList\` or \`UnorderedList\`. It has no arguments of its own; any attributes passed to it (\`id\`, \`class\`, ...) are applied to the underlying \`<li>\`. A \`ListItem\` can contain a nested list to build multi-level lists.`,
      },
    },
  },
  args: {
    isExpressive: false,
    native: false,
    nested: false,
  },
  render: (args) => <template>
    <OrderedList
      @isExpressive={{args.isExpressive}}
      @native={{args.native}}
      @nested={{args.nested}}
    >
      {{#each ITEMS}}
        <ListItem>Ordered List level 1</ListItem>
      {{/each}}
    </OrderedList>
  </template>,
});

export const Default = meta.story();

export const Nested = meta.story({
  args: {
    nested: true,
  },
  argTypes: {
    nested: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Ordered lists can be nested inside of each other using the `@nested` argument on the inner lists.',
      },
    },
  },
  render: (args) => <template>
    <OrderedList @isExpressive={{args.isExpressive}} @native={{args.native}}>
      <ListItem>
        Ordered List level 1
        <OrderedList
          @isExpressive={{args.isExpressive}}
          @native={{args.native}}
          @nested={{args.nested}}
        >
          <ListItem>Ordered List level 2</ListItem>
          <ListItem>
            Ordered List level 2
            <OrderedList
              @isExpressive={{args.isExpressive}}
              @native={{args.native}}
              @nested={{args.nested}}
            >
              <ListItem>Ordered List level 3</ListItem>
              <ListItem>Ordered List level 3</ListItem>
            </OrderedList>
          </ListItem>
        </OrderedList>
      </ListItem>
      <ListItem>Ordered List level 1</ListItem>
      <ListItem>Ordered List level 1</ListItem>
    </OrderedList>
  </template>,
});

export const NativeListStyles = meta.story({
  args: {
    native: true,
    nested: true,
  },
  argTypes: {
    native: { control: false },
    nested: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use the `@native` argument to render the list using the browser's native ordered list numbering instead of the custom Carbon counter.",
      },
    },
  },
  render: (args) => <template>
    <OrderedList @isExpressive={{args.isExpressive}} @native={{args.native}}>
      <ListItem>Ordered List level 1</ListItem>
      <ListItem>Ordered List level 1</ListItem>
      <ListItem>Ordered List level 1</ListItem>
      <ListItem>
        Ordered List level 1
        <OrderedList
          @isExpressive={{args.isExpressive}}
          @native={{args.native}}
          @nested={{args.nested}}
        >
          <ListItem>Ordered List level 2</ListItem>
          <ListItem>Ordered List level 2</ListItem>
          <ListItem>Ordered List level 2</ListItem>
          <ListItem>Ordered List level 2</ListItem>
        </OrderedList>
      </ListItem>
      {{#each NATIVE_TAIL}}
        <ListItem>Ordered List level 1</ListItem>
      {{/each}}
    </OrderedList>
  </template>,
});

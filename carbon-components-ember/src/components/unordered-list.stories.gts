import preview from '#storybook/preview.ts';
import ListItem from './list-item.gts';
import UnorderedList from './unordered-list.gts';

// Carbon React parity gaps: none.

const meta = preview.meta({
  title: 'Components/UnorderedList',
  component: UnorderedList,
  subcomponents: { ListItem },
  parameters: {
    docs: {
      description: {
        component: `Unordered lists are groupings of related content that have no priority.

Each item is a \`ListItem\`: a single \`<li>\` with the styles it needs to work as a child of \`OrderedList\` or \`UnorderedList\`. It has no arguments of its own; any attributes passed to it (\`id\`, \`class\`, ...) are applied to the underlying \`<li>\`. A \`ListItem\` can contain a nested list (with \`@nested={{true}}\`) to build multi-level lists.`,
      },
    },
  },
  args: {
    isExpressive: false,
    nested: false,
  },
  render: (args) => <template>
    <UnorderedList @isExpressive={{args.isExpressive}} @nested={{args.nested}}>
      <ListItem>Review pull requests</ListItem>
      <ListItem>Update dependencies</ListItem>
      <ListItem>Publish the release notes</ListItem>
    </UnorderedList>
  </template>,
});

export const Default = meta.story();

export const Nested = meta.story({
  name: 'nested',
  args: {
    nested: true,
  },
  argTypes: {
    nested: { table: { readonly: true } },
  },
  render: (args) => <template>
    <UnorderedList @isExpressive={{args.isExpressive}}>
      <ListItem>
        Prepare the release
        <UnorderedList
          @isExpressive={{args.isExpressive}}
          @nested={{args.nested}}
        >
          <ListItem>Review pull requests</ListItem>
          <ListItem>
            Update dependencies
            <UnorderedList
              @isExpressive={{args.isExpressive}}
              @nested={{args.nested}}
            >
              <ListItem>Run the test suite</ListItem>
              <ListItem>Resolve security alerts</ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>Publish the release notes</ListItem>
      <ListItem>Notify maintainers</ListItem>
    </UnorderedList>
  </template>,
});

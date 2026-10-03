import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ListItem from './list-item.gts';
import OrderedList from './ordered-list.gts';
import UnorderedList from './unordered-list.gts';

// Carbon React has no stories of its own for ListItem: it's a subcomponent
// of Components/OrderedList and Components/UnorderedList. These are the
// docs-app examples. ListItem takes no arguments, so there are no controls.

const meta = preview.meta({
  title: 'Components/ListItem',
  component: ListItem,
  parameters: {
    docs: {
      description: {
        component:
          'A `ListItem` renders a single `<li>` element with the styles needed for it to work as a child of `OrderedList` or `UnorderedList`. It has no arguments of its own; any attributes passed to it (`id`, `class`, ...) are applied to the underlying `<li>`.',
      },
    },
  },
});

export const Default = meta.story({
  name: 'ListItem',
  render: () => <template>
    <UnorderedList>
      <ListItem>Item 1</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
    </UnorderedList>
  </template>,
});

Default.test('renders list items', async ({ canvas }) => {
  const items = canvas.getAllByRole('listitem');
  await expect(items).toHaveLength(3);
  await expect(items[0]).toHaveClass('cds--list__item');
  await expect(items[0]).toHaveTextContent('Item 1');
});

export const WithinOrderedList = meta.story({
  name: 'Within an OrderedList',
  render: () => <template>
    <OrderedList>
      <ListItem>Ordered List level 1</ListItem>
      <ListItem>Ordered List level 1</ListItem>
      <ListItem>Ordered List level 1</ListItem>
    </OrderedList>
  </template>,
});

export const Nested = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          '`ListItem` can contain a nested `OrderedList` or `UnorderedList` to build multi-level lists.',
      },
    },
  },
  render: () => <template>
    <OrderedList>
      <ListItem>
        Ordered List level 1
        <OrderedList @nested={{true}}>
          <ListItem>Ordered List level 2</ListItem>
          <ListItem>
            Ordered List level 2
            <OrderedList @nested={{true}}>
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

Nested.test('nests lists inside items', async ({ canvas }) => {
  await expect(canvas.getAllByRole('list')).toHaveLength(3);
  await expect(canvas.getAllByRole('listitem')).toHaveLength(7);
});

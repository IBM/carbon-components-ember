import { expect, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import List from './list.gts';

import type { Args as ListArgs } from './list.gts';

// `List` is an Ember-only component (a structured list with search and
// pagination); Carbon React has no counterpart, so there's nothing to mirror.

const HEADERS = ['#', 'item', 'name'];

// The yielded rows lose List's item type parameter (`T`), so `row.item` is
// `unknown` to Glint; the story's items are strings.
const asString = (item: unknown) => String(item);

// List is generic over its item type, which signature inference can't
// follow, so declare the story's args explicitly.
const meta = preview.type<{ args: ListArgs<string> }>().meta({
  title: 'Components/List',
  component: List,
  parameters: {
    docs: {
      description: {
        component:
          'A structured list that filters and pages its `@items`. The block yields `SearchInput`, `Header`, `BodyRows` (yielding a `Row` and the `item` for each visible item), `Column` and `Pagination`. `@loading` renders a skeleton instead.',
      },
    },
  },
  args: {
    items: ['a', 'b', 'c'],
  },
  render: (args) => <template>
    <List @items={{args.items}} @loading={{args.loading}} as |list|>
      <list.SearchInput />
      <list.Header @headers={{HEADERS}} />
      <list.BodyRows as |row|>
        <row.Row>
          <list.Column>
            {{asString row.item}}
          </list.Column>
          <list.Column>
            item
          </list.Column>
          <list.Column>
            stock
          </list.Column>
        </row.Row>
      </list.BodyRows>
      <list.Pagination />
    </List>
  </template>,
});

export const Default = meta.story({});

Default.test(
  'filters the items through the search input',
  async ({ canvas, userEvent }) => {
    await expect(await canvas.findByText('a')).toBeInTheDocument();
    await expect(canvas.getByText('c')).toBeInTheDocument();

    await userEvent.type(canvas.getByRole('searchbox'), 'c');
    await waitFor(() =>
      expect(canvas.queryByText('a')).not.toBeInTheDocument(),
    );
    await expect(canvas.getByText('c')).toBeInTheDocument();
  },
);

export const Loading = meta.story({
  args: {
    loading: true,
  },
});

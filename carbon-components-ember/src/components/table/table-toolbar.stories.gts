import { expect, fn, userEvent } from 'storybook/test';

import { LoadBalancerRows } from '#storybook/fixtures/table.gts';
import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import TableContainer from './table-container.gts';
import TableToolbar from './table-toolbar.gts';

// Carbon React's `DataTable/Toolbar` page renders these parts through
// DataTable's render prop. Its stories `Default`, `PersistentToolbar`,
// `SmallPersistentToolbar` and `WithOverflowMenu` are ported here with the
// parts on their own.
//
// Parity gaps: React's `TableToolbar` also takes the deprecated `ariaLabel`
// prop; use `aria-label`.

type StoryArgs = { onRefresh: () => void };

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Table/TableToolbar',
  component: TableToolbar,
  parameters: {
    docs: {
      description: {
        component: `\`TableToolbar\` sits above a table, as Carbon React's. Its yielded \`Content\` holds a search, a menu and your own buttons, and gives the search and menu the toolbar's \`@size\`. \`TableToolbarSearch\` expands when focused unless \`@persistent\`. \`TableToolbarMenu\` is an overflow menu of \`TableToolbarAction\`s; handle a click with \`{{on "click"}}\`.

\`\`\`gts
<TableToolbar @size="sm" as |Content|>
  <Content as |Search Menu|>
    <Search @persistent={{true}} />
    <Menu as |Action|>
      <Action {{on "click" this.refresh}}>Refresh data</Action>
    </Menu>
    <Button @size="sm">Add</Button>
  </Content>
</TableToolbar>
\`\`\``,
      },
    },
  },
  args: { onRefresh: fn() },
});

export const Default = meta.story({
  render: () => <template>
    <TableContainer
      @title="Load balancers"
      @description="With a toolbar"
      as |Table|
    >
      <TableToolbar as |Content|>
        <Content as |Search|>
          <Search />
          <Button @kind="primary">Primary Button</Button>
        </Content>
      </TableToolbar>
      <Table><LoadBalancerRows /></Table>
    </TableContainer>
  </template>,
});

Default.test('the search expands when focused', async ({ canvas }) => {
  const search = canvas.getByRole('searchbox');
  const wrapper = search.closest('.cds--search')!;
  await expect(wrapper).not.toHaveClass('cds--toolbar-search-container-active');
  await userEvent.click(search);
  await expect(wrapper).toHaveClass('cds--toolbar-search-container-active');
  await userEvent.tab();
  await expect(wrapper).not.toHaveClass('cds--toolbar-search-container-active');
});

export const PersistentToolbar = meta.story({
  render: () => <template>
    <TableContainer
      @title="Load balancers"
      @description="With a persistent search"
      as |Table|
    >
      <TableToolbar as |Content|>
        <Content as |Search|>
          <Search @persistent={{true}} />
          <Button @kind="primary">Primary Button</Button>
        </Content>
      </TableToolbar>
      <Table><LoadBalancerRows /></Table>
    </TableContainer>
  </template>,
});

export const SmallPersistentToolbar = meta.story({
  render: () => <template>
    <TableContainer
      @title="Load balancers"
      @description="With a small persistent toolbar"
      as |Table|
    >
      <TableToolbar @size="sm" as |Content|>
        <Content as |Search|>
          <Search @persistent={{true}} />
          <Button @kind="primary" @size="sm">Primary Button</Button>
        </Content>
      </TableToolbar>
      <Table @size="sm"><LoadBalancerRows /></Table>
    </TableContainer>
  </template>,
});

export const WithOverflowMenu = meta.story({
  render: (args: StoryArgs) => <template>
    <TableContainer
      @title="Load balancers"
      @description="With an overflow menu"
      as |Table|
    >
      <TableToolbar as |Content|>
        <Content as |Search Menu|>
          <Search @persistent={{true}} />
          <Menu as |Action|>
            <Action {{on "click" args.onRefresh}}>Refresh data</Action>
            <Action {{on "click" args.onRefresh}}>Download data</Action>
          </Menu>
          <Button @kind="primary">Primary Button</Button>
        </Content>
      </TableToolbar>
      <Table><LoadBalancerRows /></Table>
    </TableContainer>
  </template>,
});

WithOverflowMenu.test(
  'an action runs and closes the menu',
  async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Settings' }));
    await userEvent.click(
      await canvas.findByRole('menuitem', { name: 'Refresh data' }),
    );
    await expect(args.onRefresh).toHaveBeenCalledOnce();
    await expect(canvas.queryByRole('menu')).toBeNull();
  },
);

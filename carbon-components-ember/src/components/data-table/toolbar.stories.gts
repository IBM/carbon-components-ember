import { expect, fn as spy } from 'storybook/test';

import {
  DATA_TABLE_ARGS,
  DATA_TABLE_ARG_TYPES,
  HEADERS,
  ROWS,
} from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import DataTable from '../data-table.gts';
import OverflowMenu from '../overflow-menu.gts';
import TableBody from '../table/table-body.gts';
import TableCell from '../table/table-cell.gts';
import TableHead from '../table/table-head.gts';
import TableHeader from '../table/table-header.gts';
import TableRow from '../table/table-row.gts';

import type { TableArgs } from '#storybook/fixtures/data-table.gts';

// Carbon React's `DataTable/Toolbar` page: `Default`, `PersistentToolbar`,
// `SmallPersistentToolbar` and `WithOverflowMenu`.
//
// Parity gaps:
// - React's empty state when no row matches the search: its `EmptyState` is
//   an example in Carbon's repository (`examples/EmptyState`), not part of
//   `@carbon/react`. The addon's IBM Products `EmptyState` is another design.
// - React's v12 `Menu` flavour of `WithOverflowMenu`, behind a feature flag.

type StoryArgs = TableArgs & {
  persistent: boolean;
  onAction: (action: string) => void;
  onClick: () => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Toolbar',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `\`table.TableToolbar\` takes the table's size when it is \`xs\` or \`sm\`, and yields \`Content\`, which yields the toolbar's search and menu with that size. The search expands on focus unless it is \`@persistent\`; give it \`@onChange={{table.onInputChange}}\` to filter the table. The menu yields \`TableToolbarAction\`s, which take \`{{on "click"}}\`.

\`\`\`gts
<table.TableToolbar as |Content|>
  <Content as |Search Menu|>
    <Search @persistent={{true}} @onChange={{table.onInputChange}} />
    <Menu as |Action|>
      <Action {{on "click" this.refresh}}>Refresh</Action>
    </Menu>
    <Button @kind="primary">Add</Button>
  </Content>
</table.TableToolbar>
\`\`\``,
      },
    },
  },
  args: {
    ...DATA_TABLE_ARGS,
    persistent: false,
    rows: ROWS,
    headers: HEADERS,
    overflowMenuOnHover: false,
    onAction: spy(),
    onClick: spy(),
  },
  argTypes: {
    ...DATA_TABLE_ARG_TYPES,
    persistent: { control: 'boolean' },
    overflowMenuOnHover: { control: 'boolean' },
  },
  render: (args: StoryArgs) => <template>
    <DataTable
      @rows={{args.rows}}
      @headers={{args.headers}}
      @isSortable={{args.isSortable}}
      @locale={{args.locale}}
      @size={{args.size}}
      @stickyHeader={{args.stickyHeader}}
      @useStaticWidth={{args.useStaticWidth}}
      @useZebraStyles={{args.useZebraStyles}}
      as |table|
    >
      <table.TableContainer
        @title="DataTable"
        @description="With toolbar"
        as |Table|
      >
        <table.TableToolbar as |Content|>
          <Content as |Search Menu|>
            <Search
              @persistent={{args.persistent}}
              @onChange={{table.onInputChange}}
            />
            <Menu as |Action|>
              <Action {{on "click" (fn args.onAction "Action 1")}}>Action 1</Action>
              <Action {{on "click" (fn args.onAction "Action 2")}}>Action 2</Action>
              <Action {{on "click" (fn args.onAction "Action 3")}}>Action 3</Action>
            </Menu>
            <Button @kind="primary" {{on "click" args.onClick}}>Primary Button</Button>
          </Content>
        </table.TableToolbar>
        <Table>
          <TableHead>
            <TableRow>
              {{#each table.headers key="key" as |header|}}
                <table.TableHeader
                  @header={{header}}
                >{{header.header}}</table.TableHeader>
              {{/each}}
            </TableRow>
          </TableHead>
          <TableBody>
            {{#each table.rows key="id" as |row|}}
              <table.TableRow @row={{row}}>
                {{#each row.cells key="id" as |cell|}}
                  <table.TableCell
                    @cell={{cell}}
                  >{{cell.value}}</table.TableCell>
                {{/each}}
              </table.TableRow>
            {{/each}}
          </TableBody>
        </Table>
      </table.TableContainer>
    </DataTable>
  </template>,
});

export const Default = meta.story();

Default.test('runs a toolbar action', async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Settings' }));
  await userEvent.click(
    await canvas.findByRole('menuitem', { name: 'Action 2' }),
  );
  await expect(args.onAction).toHaveBeenCalledWith(
    'Action 2',
    expect.anything(),
  );
});

export const PersistentToolbar = meta.story({
  args: { persistent: true },
  argTypes: { persistent: { control: false } },
});

export const SmallPersistentToolbar = meta.story({
  args: { persistent: true, size: 'sm' },
  argTypes: { persistent: { control: false } },
});

export const WithOverflowMenu = meta.story({
  render: (args: StoryArgs) => <template>
    <DataTable
      @rows={{args.rows}}
      @headers={{args.headers}}
      @isSortable={{args.isSortable}}
      @locale={{args.locale}}
      @size={{args.size}}
      @stickyHeader={{args.stickyHeader}}
      @useStaticWidth={{args.useStaticWidth}}
      @useZebraStyles={{args.useZebraStyles}}
      @overflowMenuOnHover={{args.overflowMenuOnHover}}
      as |table|
    >
      <table.TableContainer
        @title="DataTable"
        @description="With overflow menu"
        as |Table|
      >
        <table.TableToolbar as |Content|>
          <Content as |Search Menu|>
            <Search
              @persistent={{args.persistent}}
              @onChange={{table.onInputChange}}
            />
            <Menu as |Action|>
              <Action {{on "click" (fn args.onAction "Action 1")}}>Action 1</Action>
              <Action {{on "click" (fn args.onAction "Action 2")}}>Action 2</Action>
              <Action {{on "click" (fn args.onAction "Action 3")}}>Action 3</Action>
            </Menu>
            <Button @kind="primary" {{on "click" args.onClick}}>Primary Button</Button>
          </Content>
        </table.TableToolbar>
        <Table>
          <TableHead>
            <TableRow>
              {{#each table.headers key="key" as |header|}}
                <table.TableHeader
                  @header={{header}}
                >{{header.header}}</table.TableHeader>
              {{/each}}
              <TableHeader><span class="cds--visually-hidden">Overflow actions</span></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {{#each table.rows key="id" as |row|}}
              <table.TableRow @row={{row}}>
                {{#each row.cells key="id" as |cell|}}
                  <table.TableCell
                    @cell={{cell}}
                  >{{cell.value}}</table.TableCell>
                {{/each}}
                <TableCell class="cds--table-column-menu">
                  <OverflowMenu @size="sm" @flipped={{true}} as |Item|>
                    <Item @itemText="Stop app" />
                    <Item @itemText="Restart app" />
                    <Item @itemText="Rename app" />
                  </OverflowMenu>
                </TableCell>
              </table.TableRow>
            {{/each}}
          </TableBody>
        </Table>
      </table.TableContainer>
    </DataTable>
  </template>,
});

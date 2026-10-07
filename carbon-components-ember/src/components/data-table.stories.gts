import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import DataTable from './data-table.gts';

import type { Args as DataTableArgs } from './data-table.gts';
import type TableColumn from './data-table/-column.gts';
import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';

// Mirrors Carbon React's DataTable stories (`Components/DataTable/Basic`,
// `/Selection`, `/Batch Actions`, `/Expansion`, `/Toolbar`, `/Pagination`,
// `/Filtering`),
// flattened into one `Components/DataTable` title since one file holds one
// meta. The docs-app's "state" and "xs toolbar and pagination" examples are
// `SharedState` and `ExtraSmall`.
//
// Parity gaps (React stories not ported because the Ember DataTable can't
// express them):
// - Sorting (`/Sorting`, `/Selection` WithSelectionAndSorting, `ColumnAILabelSort`):
//   a `{ sortable: true }` header renders the sort button, but the table
//   never sorts.
// - `WithRadioSelection` / `AILabelWithRadioSelection`: no radio selection.
// - `/Expansion` BatchExpansion and BatchExpansionMultipleTables: no
//   expand-all button in the expand header (`TableExpandHeader`).
// - `/WithAILabel` (`AILabel*`, `FullTableAI`): no AI label/slug support.
// - Toolbar `WithOverflowMenu` and the toolbar menus in the batch-actions and
//   pagination stories: no `TableToolbarMenu`.
// - `/Skeleton`: no public `DataTableSkeleton`; `@isLoading` (the `Loading`
//   story) is the closest equivalent.
// - `stickyHeader`, `useStaticWidth` and `locale` table props.

interface LoadBalancer {
  id: string;
  name: string;
  protocol: string;
  port: number;
  rule: string;
  attached_groups: string;
  status: string;
}

const ROWS: LoadBalancer[] = [
  {
    id: 'a',
    name: 'Load Balancer 3',
    protocol: 'HTTP',
    port: 3000,
    rule: 'Round robin',
    attached_groups: 'Kevin’s VM Groups',
    status: 'Disabled',
  },
  {
    id: 'b',
    name: 'Load Balancer 1',
    protocol: 'HTTP',
    port: 443,
    rule: 'Round robin',
    attached_groups: 'Maureen’s VM Groups',
    status: 'Starting',
  },
  {
    id: 'c',
    name: 'Load Balancer 2',
    protocol: 'HTTP',
    port: 80,
    rule: 'DNS delegation',
    attached_groups: 'Andrew’s VM Groups',
    status: 'Active',
  },
  {
    id: 'd',
    name: 'Load Balancer 6',
    protocol: 'HTTP',
    port: 3000,
    rule: 'Round robin',
    attached_groups: 'Marc’s VM Groups',
    status: 'Disabled',
  },
  {
    id: 'e',
    name: 'Load Balancer 4',
    protocol: 'HTTP',
    port: 443,
    rule: 'Round robin',
    attached_groups: 'Mel’s VM Groups',
    status: 'Starting',
  },
  {
    id: 'f',
    name: 'Load Balancer 5',
    protocol: 'HTTP',
    port: 80,
    rule: 'DNS delegation',
    attached_groups: 'Ronja’s VM Groups',
    status: 'Active',
  },
];

const PORTS = [3000, 443, 80];
const RULES = ['Round robin', 'DNS delegation'];
const STATUSES = ['Disabled', 'Starting', 'Active'];

const MANY_ROWS: LoadBalancer[] = Array.from({ length: 100 }, (_, i) => ({
  id: `load-balancer-${i + 1}`,
  name: `Load Balancer ${i + 1}`,
  protocol: 'HTTP',
  port: PORTS[i % 3]!,
  rule: RULES[i % 2]!,
  attached_groups: `Group ${(i % 5) + 1}`,
  status: STATUSES[i % 3]!,
}));

const HEADERS = [
  { label: 'Name' },
  { label: 'Protocol' },
  { label: 'Port' },
  { label: 'Rule' },
  { label: 'Attached groups' },
  { label: 'Status' },
];

// The trailing `null` reserves the overflow-menu column.
// The row-actions column gets a visually hidden heading.
const HEADERS_WITH_MENU = [...HEADERS, { label: 'Actions', hideLabel: true }];

type Column = WithBoundArgs<typeof TableColumn, 'table'>;

const Cells: TOC<{ Args: { Column: Column; item: LoadBalancer } }> = <template>
  <@Column>{{@item.name}}</@Column>
  <@Column>{{@item.protocol}}</@Column>
  <@Column>{{@item.port}}</@Column>
  <@Column>{{@item.rule}}</@Column>
  <@Column>{{@item.attached_groups}}</@Column>
  <@Column>{{@item.status}}</@Column>
</template>;

// The table shows its rows once it has set up its first page slice (on the
// next run loop), so tests wait for them first.
const rowsRendered = (canvasElement: HTMLElement) =>
  waitFor(() =>
    expect(canvasElement.querySelectorAll('tbody tr').length).toBeGreaterThan(
      0,
    ),
  );

type TableState = Parameters<
  NonNullable<DataTableArgs<LoadBalancer>['registerState']>
>[0];

// DataTable is generic over its item type, which signature inference can't
// follow, so declare the story's args explicitly. `size`/`useZebraStyles`
// are the yielded `Table`'s args; `onBatchAction` is the story's own spy.
type StoryArgs = Omit<DataTableArgs<LoadBalancer>, 'items'> & {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  useZebraStyles?: boolean;
  onBatchAction: (action: string, items: LoadBalancer[]) => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `Data tables are used to organize and display data efficiently. The data table component allows for customization with additional functionality, as needed by your product’s users.

\`DataTable\` yields its building blocks already wired to the table: \`Toolbar\` (with \`Content\` and the batch-action bar \`Actions\`), \`SearchInput\`, \`Table\`, \`Header\`, \`EachBodyRows\` (yielding a \`Row\` per item), \`Column\`, \`Menu\` and \`Pagination\`. Every \`<td>\` is automatically linked to its column's \`<th>\` via the \`headers\` attribute for screen-reader users.`,
      },
    },
  },
  args: {
    title: 'DataTable',
    description: 'With toolbar',
    size: 'lg',
    useZebraStyles: false,
    onSelectionChange: fn(),
    onBatchAction: fn(),
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @isLoading={{args.isLoading}}
      @items={{ROWS}}
      as |table|
    >
      <table.Toolbar as |toolbar|>
        <toolbar.Content>
          <table.SearchInput @expandable={{true}} />
        </toolbar.Content>
      </table.Toolbar>
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @headers={{HEADERS_WITH_MENU}} />
        <table.EachBodyRows as |row|>
          <row.Row>
            <Cells @Column={{table.Column}} @item={{row.item}} />
            <table.Menu as |Item|>
              <Item>Edit</Item>
            </table.Menu>
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
      <table.Pagination />
    </DataTable>
  </template>,
});

export const Default = meta.story();

Default.test(
  'links each cell to its column header',
  async ({ canvas, canvasElement }) => {
    await rowsRendered(canvasElement);
    const cell = canvas.getByRole('cell', { name: 'Load Balancer 3' });
    const header = canvas.getByRole('columnheader', { name: 'Name' });
    await expect(cell).toHaveAttribute('headers', header.id);
  },
);

export const XLWithTwoLines = meta.story({
  args: {
    size: 'xl',
    description: 'Extra-large rows with two lines of content',
  },
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{ROWS}}
      as |table|
    >
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @headers={{HEADERS}} />
        <table.EachBodyRows as |row|>
          <row.Row>
            <table.Column>
              <div>{{row.item.name}}</div>
              <div class="cds--label">{{row.item.id}}</div>
            </table.Column>
            <table.Column>{{row.item.protocol}}</table.Column>
            <table.Column>{{row.item.port}}</table.Column>
            <table.Column>{{row.item.rule}}</table.Column>
            <table.Column>{{row.item.attached_groups}}</table.Column>
            <table.Column>{{row.item.status}}</table.Column>
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
    </DataTable>
  </template>,
});

export const ExtraSmall = meta.story({
  args: { size: 'xs' },
  parameters: {
    docs: {
      description: {
        story:
          'The `Toolbar`, its `SearchInput` and the `Pagination` each accept their own `@size` argument (`xs`, `sm`, `md` or `lg`, depending on the sub-component).',
      },
    },
  },
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{ROWS}}
      as |table|
    >
      <table.Toolbar @size="xs" as |toolbar|>
        <toolbar.Content>
          <table.SearchInput @size="xs" @expandable={{true}} />
        </toolbar.Content>
      </table.Toolbar>
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @headers={{HEADERS_WITH_MENU}} />
        <table.EachBodyRows as |row|>
          <row.Row>
            <Cells @Column={{table.Column}} @item={{row.item}} />
            <table.Menu as |Item|>
              <Item>Edit</Item>
            </table.Menu>
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
      <table.Pagination @size="sm" />
    </DataTable>
  </template>,
});

export const Selection = meta.story({
  args: { description: 'With selection' },
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{ROWS}}
      @onSelectionChange={{args.onSelectionChange}}
      as |table|
    >
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @isCheckable={{true}} @headers={{HEADERS}} />
        <table.EachBodyRows as |row|>
          <row.Row @item={{row.item}}>
            <Cells @Column={{table.Column}} @item={{row.item}} />
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
    </DataTable>
  </template>,
});

Selection.test(
  'selects single rows and all rows',
  async ({ canvasElement, userEvent, args }) => {
    await rowsRendered(canvasElement);
    const [selectAll, first] = canvasElement.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]',
    );
    await userEvent.click(first!);
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith([ROWS[0]]);
    await expect(first!.closest('tr')).toHaveClass('cds--data-table--selected');

    await userEvent.click(selectAll!);
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith(ROWS);

    await userEvent.click(selectAll!);
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith([]);
  },
);

export const BatchActions = meta.story({
  args: { description: 'With batch actions' },
  render: (args: StoryArgs) => {
    const state = trackedObject<{ selected: LoadBalancer[] }>({
      selected: [],
    });
    const select = (items: LoadBalancer[]) => {
      state.selected = items;
      args.onSelectionChange?.(items);
    };
    const batch = (action: string) =>
      args.onBatchAction(action, state.selected);
    const remove = () => batch('Delete');
    const save = () => batch('Save');
    const download = () => batch('Download');

    return <template>
      <DataTable
        @title={{args.title}}
        @description={{args.description}}
        @items={{ROWS}}
        @onSelectionChange={{select}}
        as |table|
      >
        <table.Toolbar as |toolbar|>
          <toolbar.Actions>
            <Button @onClick={{remove}}>Delete</Button>
            <Button @onClick={{save}}>Save</Button>
            <Button @onClick={{download}}>Download</Button>
          </toolbar.Actions>
          <toolbar.Content>
            <table.SearchInput />
            <Button @type="primary">Add new</Button>
          </toolbar.Content>
        </table.Toolbar>
        <table.Table
          @size={{args.size}}
          @useZebraStyles={{args.useZebraStyles}}
        >
          <table.Header @isCheckable={{true}} @headers={{HEADERS}} />
          <table.EachBodyRows as |row|>
            <row.Row @item={{row.item}}>
              <Cells @Column={{table.Column}} @item={{row.item}} />
            </row.Row>
          </table.EachBodyRows>
        </table.Table>
      </DataTable>
    </template>;
  },
});

BatchActions.test(
  'runs a batch action on the selected rows',
  async ({ canvas, canvasElement, userEvent, args }) => {
    await rowsRendered(canvasElement);
    await expect(canvas.queryByText('items selected')).toBeNull();
    const checkboxes = canvasElement.querySelectorAll<HTMLInputElement>(
      'tbody input[type="checkbox"]',
    );
    await userEvent.click(checkboxes[0]!);
    await userEvent.click(checkboxes[1]!);

    const summary = canvasElement.querySelector('[data-items-selected]');
    await expect(summary).toHaveTextContent('2');

    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));
    await expect(args.onBatchAction).toHaveBeenCalledWith('Delete', [
      ROWS[0],
      ROWS[1],
    ]);

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(
      canvasElement.querySelector('[data-items-selected]'),
    ).toBeNull();
  },
);

export const Expansion = meta.story({
  args: { description: 'With expansion' },
  render: (args) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{ROWS}}
      as |table|
    >
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @isExpandable={{true}} @headers={{HEADERS}} />
        <table.EachBodyRows as |row|>
          <row.Row @item={{row.item}}>
            <:default>
              <Cells @Column={{table.Column}} @item={{row.item}} />
            </:default>
            <:expanded>
              {{! React's story uses an h6; h5 keeps the heading order valid
                below the table title's h4. }}
              <h5>Expandable row content</h5>
              <div>Description here</div>
            </:expanded>
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
    </DataTable>
  </template>,
});

Expansion.test(
  'expands and collapses a row',
  async ({ canvas, canvasElement, userEvent }) => {
    await rowsRendered(canvasElement);
    const [first] = canvas.getAllByRole('button', {
      name: 'Expand current row',
    });
    const parentRow = first!.closest('tr')!;
    const childRow = parentRow.nextElementSibling as HTMLElement;
    const content = childRow.querySelector('.cds--child-row-inner-container')!;
    const contentHeight = () => content.getBoundingClientRect().height;
    // Carbon's CSS collapses the always-rendered child row's content.
    await expect(contentHeight()).toBe(0);

    await userEvent.click(first!);
    await expect(parentRow).toHaveClass('cds--expandable-row');
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(first).toHaveAccessibleName('Collapse current row');
    await expect(
      within(childRow).getByText('Expandable row content'),
    ).toBeVisible();
    await waitFor(() => expect(contentHeight()).toBeGreaterThan(0));

    await userEvent.click(first!);
    await expect(parentRow).not.toHaveClass('cds--expandable-row');
    await waitFor(() => expect(contentHeight()).toBe(0));
  },
);

export const Toolbar = meta.story({
  args: { description: 'With toolbar' },
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{ROWS}}
      as |table|
    >
      <table.Toolbar as |toolbar|>
        <toolbar.Content>
          <table.SearchInput @expandable={{true}} />
          <Button @type="primary">Primary Button</Button>
        </toolbar.Content>
      </table.Toolbar>
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @headers={{HEADERS}} />
        <table.EachBodyRows as |row|>
          <row.Row>
            <Cells @Column={{table.Column}} @item={{row.item}} />
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
    </DataTable>
  </template>,
});

export const PersistentToolbar = meta.story({
  args: { description: 'With a persistent search' },
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{ROWS}}
      as |table|
    >
      <table.Toolbar as |toolbar|>
        <toolbar.Content>
          <table.SearchInput />
          <Button @type="primary">Primary Button</Button>
        </toolbar.Content>
      </table.Toolbar>
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @headers={{HEADERS}} />
        <table.EachBodyRows as |row|>
          <row.Row>
            <Cells @Column={{table.Column}} @item={{row.item}} />
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
    </DataTable>
  </template>,
});

export const SmallPersistentToolbar = meta.story({
  args: { description: 'With a small persistent toolbar', size: 'sm' },
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{ROWS}}
      as |table|
    >
      <table.Toolbar @size="sm" as |toolbar|>
        <toolbar.Content>
          <table.SearchInput @size="sm" />
          <Button @type="primary" @size="sm">Primary Button</Button>
        </toolbar.Content>
      </table.Toolbar>
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @headers={{HEADERS}} />
        <table.EachBodyRows as |row|>
          <row.Row>
            <Cells @Column={{table.Column}} @item={{row.item}} />
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
    </DataTable>
  </template>,
});

export const Pagination = meta.story({
  args: {
    title: 'Load Balancers',
    description: 'Paginated data table with persistent toolbar',
  },
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{MANY_ROWS}}
      as |table|
    >
      <table.Toolbar as |toolbar|>
        <toolbar.Content>
          <table.SearchInput />
          <Button @type="primary">Primary Button</Button>
        </toolbar.Content>
      </table.Toolbar>
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @headers={{HEADERS}} />
        <table.EachBodyRows as |row|>
          <row.Row>
            <Cells @Column={{table.Column}} @item={{row.item}} />
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
      <table.Pagination />
    </DataTable>
  </template>,
});

Pagination.test(
  'pages through the rows',
  async ({ canvas, canvasElement, userEvent }) => {
    await rowsRendered(canvasElement);
    const body = () => within(canvas.getAllByRole('rowgroup')[1]!);
    await waitFor(() => expect(body().getAllByRole('row')).toHaveLength(10));
    await expect(body().getByText('Load Balancer 1')).toBeVisible();
    await expect(body().queryByText('Load Balancer 11')).toBeNull();
    await expect(
      canvasElement.querySelector('[data-total-items]'),
    ).toHaveTextContent('100');

    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await waitFor(() =>
      expect(body().getByText('Load Balancer 11')).toBeVisible(),
    );
    await expect(body().queryByText('Load Balancer 1')).toBeNull();
  },
);

export const Filtering = meta.story({
  args: { description: 'Filter rows with the toolbar search' },
  render: (args: StoryArgs) => <template>
    <DataTable
      @title={{args.title}}
      @description={{args.description}}
      @items={{ROWS}}
      as |table|
    >
      <table.Toolbar as |toolbar|>
        <toolbar.Content>
          <table.SearchInput />
        </toolbar.Content>
      </table.Toolbar>
      <table.Table @size={{args.size}} @useZebraStyles={{args.useZebraStyles}}>
        <table.Header @headers={{HEADERS}} />
        <table.EachBodyRows as |row|>
          <row.Row>
            <Cells @Column={{table.Column}} @item={{row.item}} />
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
    </DataTable>
  </template>,
});

Filtering.test(
  'filters rows by the search term',
  async ({ canvas, canvasElement, userEvent }) => {
    await rowsRendered(canvasElement);
    await expect(canvas.getAllByRole('row')).toHaveLength(ROWS.length + 1);
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Filter table' }),
      'dns',
    );
    await waitFor(() => expect(canvas.getAllByRole('row')).toHaveLength(3));
    await expect(canvas.getByText('Load Balancer 2')).toBeVisible();
    await expect(canvas.getByText('Load Balancer 5')).toBeVisible();

    await userEvent.clear(
      canvas.getByRole('searchbox', { name: 'Filter table' }),
    );
    await waitFor(() =>
      expect(canvas.getAllByRole('row')).toHaveLength(ROWS.length + 1),
    );
  },
);

export const SharedState = meta.story({
  args: { description: '' },
  parameters: {
    docs: {
      description: {
        story:
          'The state of the table (selection, search and page) can be captured with `@registerState` and handed to another table — or to the same table after navigating away and back — through `@state`, so it resumes where the user left it. Here the copy below shares the first table’s state.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const shared = trackedObject<{ state?: TableState }>({});
    const register = (state: TableState) => {
      shared.state = state;
    };

    return <template>
      <DataTable
        @title="Table title"
        @registerState={{register}}
        @items={{ROWS}}
        as |table|
      >
        <table.Toolbar as |toolbar|>
          <toolbar.Content>
            <table.SearchInput />
          </toolbar.Content>
          <toolbar.Actions>
            <Button @type="primary">Save</Button>
          </toolbar.Actions>
        </table.Toolbar>
        <table.Table
          @size={{args.size}}
          @useZebraStyles={{args.useZebraStyles}}
        >
          <table.Header @isCheckable={{true}} @headers={{HEADERS_WITH_MENU}} />
          <table.EachBodyRows as |row|>
            <row.Row @item={{row.item}}>
              <Cells @Column={{table.Column}} @item={{row.item}} />
              <table.Menu as |Item|>
                <Item>Edit</Item>
              </table.Menu>
            </row.Row>
          </table.EachBodyRows>
        </table.Table>
        <table.Pagination />
      </DataTable>

      <DataTable
        @state={{shared.state}}
        @title="Table Copy"
        @items={{ROWS}}
        as |table|
      >
        <table.Toolbar @ariaLabel="data table copy toolbar" as |toolbar|>
          <toolbar.Content>
            <table.SearchInput @labelText="Filter table copy" />
          </toolbar.Content>
          <toolbar.Actions>
            <Button @type="primary">Save</Button>
          </toolbar.Actions>
        </table.Toolbar>
        <table.Table
          @size={{args.size}}
          @useZebraStyles={{args.useZebraStyles}}
        >
          <table.Header @isCheckable={{true}} @headers={{HEADERS_WITH_MENU}} />
          <table.EachBodyRows as |row|>
            <row.Row @item={{row.item}}>
              <Cells @Column={{table.Column}} @item={{row.item}} />
              <table.Menu as |Item|>
                <Item>Edit</Item>
              </table.Menu>
            </row.Row>
          </table.EachBodyRows>
        </table.Table>
        <table.Pagination />
      </DataTable>
    </template>;
  },
});

SharedState.test(
  'mirrors the first table’s selection in the copy',
  async ({ canvasElement, userEvent }) => {
    await rowsRendered(canvasElement);
    const [original, copy] = canvasElement.querySelectorAll<HTMLElement>(
      '.cds--data-table-container',
    );
    const firstRow = original!.querySelector<HTMLInputElement>(
      'tbody input[type="checkbox"]',
    )!;
    await userEvent.click(firstRow);

    await waitFor(() =>
      expect(copy!.querySelector('tbody input[type="checkbox"]')).toBeChecked(),
    );
    await expect(
      copy!.querySelector('[data-items-selected]'),
    ).toHaveTextContent('1');
  },
);

export const Loading = meta.story({
  args: { isLoading: true },
  parameters: {
    docs: {
      description: {
        story:
          '`@isLoading` puts the table, its search and its pagination into their loading/skeleton state.',
      },
    },
  },
});

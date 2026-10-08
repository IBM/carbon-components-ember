import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor } from 'storybook/test';

import {
  ROWS,
  HEADERS,
  HEADERS_WITH_MENU,
  Cells,
  rowsRendered,
} from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import DataTable from '../data-table.gts';

import type { StoryArgs, TableState } from '#storybook/fixtures/data-table.gts';

// Carbon React's DataTable story pages, one file per page (Basic, Selection,
// Batch Actions, Expansion, Toolbar, Pagination, Filtering, Skeleton). Basic
// also has `ExtraSmall` and the Ember-only `SharedState`.
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
// - `/Skeleton`: no public `DataTableSkeleton`; that page shows `@isLoading`
//   instead.
// - `stickyHeader`, `useStaticWidth` and `locale` table props.

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DataTable/Basic',
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
              <Item @itemText="Edit" />
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
              <Item @itemText="Edit" />
            </table.Menu>
          </row.Row>
        </table.EachBodyRows>
      </table.Table>
      <table.Pagination @size="sm" />
    </DataTable>
  </template>,
});

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
                <Item @itemText="Edit" />
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
                <Item @itemText="Edit" />
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

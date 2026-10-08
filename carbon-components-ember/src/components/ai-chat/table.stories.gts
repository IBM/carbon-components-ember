import { RenderStory } from 'ember-storybook';
import { expect, spyOn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import AiChatCard from './card.gts';
import Table from './table.gts';

import type { TableSignature } from './table.gts';

// Mirrors `@carbon/ai-chat-components`' `table.stories.js` (`Default`,
// `Loading`), including its `useCard` wrapper toggle (renders the table in
// a flush `AiChatCard` body) and its `story-data.js` rows.
//
// docs-app coverage: its first demo (an "Invoices" table with a CSV
// download label, not wrapped in a card) is `Invoices`; its "Loading
// state" demo is covered by `Loading` (docs-app used `@defaultPageSize=3`
// and two headers; the skeleton simply renders one row per page-size slot).
//
// Parity gaps (see the component's doc comment):
// - `@itemsPerPageText` is accepted but not wired - the shared `Pagination`
//   hardcodes its "Items per page" label.
// - Upstream sizes the default page from the rendered width (10 above
//   ~400px, 5 below); the Ember port defaults to 5.
// - Upstream's `data-rounded` (set here by `useCard`) isn't exposed, so the
//   card wrapper doesn't clip the table's corners.
// - Upstream's download button has a built-in label; the Ember port needs
//   `@downloadLabelText`, so these stories pass one.

const HEADERS = [
  { text: 'Name' },
  { text: 'Role' },
  { text: 'Location' },
  { text: 'Status' },
];

const ROWS = [
  ['Jordan Smith', 'Conversation Designer', 'Austin, TX', 'Active'],
  ['Priya Patel', 'Applied Scientist', 'Bengaluru, IN', 'Active'],
  ['Lee Chen', 'Product Manager', 'Singapore', 'Paused'],
  ['Morgan Reyes', 'Researcher', 'Toronto, CA', 'Active'],
  ['Samira Khan', 'Engineer', 'San Jose, CA', 'Active'],
  ['Alex Kim', 'Designer', 'Seoul, KR', 'Inactive'],
].map((cells) => ({ cells: cells.map((text) => ({ text })) }));

const INVOICE_HEADERS = [
  { text: 'Name' },
  { text: 'Status' },
  { text: 'Owner' },
];

const INVOICE_ROWS = [
  ['invoice-001.pdf', 'Complete', 'Amanda'],
  ['invoice-002.pdf', 'Pending', 'Bilal'],
  ['invoice-003.pdf', 'Complete', 'Chidi'],
  ['invoice-004.pdf', 'Failed', 'Amanda'],
  ['invoice-005.pdf', 'Complete', 'Dara'],
  ['invoice-006.pdf', 'Pending', 'Bilal'],
  ['invoice-007.pdf', 'Complete', 'Chidi'],
].map((cells) => ({ cells: cells.map((text) => ({ text })) }));

const bodyRowNames = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll('tbody tr td:first-child'),
    (cell) => cell.textContent?.trim(),
  );

type StoryArgs = TableSignature['Args'] & {
  /** Story-only: wrap the table in a flush `AiChatCard` (upstream `useCard`). */
  useCard?: boolean;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: [
          'The AI Chat `Table` (exported as `Table`, not `DataTable` — see `DataTable` for the general-purpose Carbon data table) is a sortable, filterable, paginated table for [Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat), with a built-in CSV download action.',
          '',
          "It's always internally-controlled — sort/filter/page state live inside the component, matching upstream, which has no equivalent change callbacks.",
        ].join('\n'),
      },
    },
  },
  args: {
    useCard: true,
    tableTitle: 'Agent roster',
    tableDescription: 'Operational view of AI chat team members.',
    headers: HEADERS,
    rows: ROWS,
    loading: false,
    filterPlaceholderText: 'Filter rows',
    previousPageText: 'Previous page',
    nextPageText: 'Next page',
    itemsPerPageText: 'Items per page',
    downloadLabelText: 'Download as CSV',
    locale: 'en',
    defaultPageSize: 5,
  },
  argTypes: {
    useCard: { table: { category: 'Wrapper' } },
    headers: { control: false },
    rows: { control: false },
  },
  // Keep a chat-message-like width.
  decorators: [
    (Story, context) => <template>
      <div style="max-width: 40rem;">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  render: (args: StoryArgs) => <template>
    {{#if args.useCard}}
      <AiChatCard @isFlush={{true}}>
        <:body>
          <Table
            @tableTitle={{args.tableTitle}}
            @tableDescription={{args.tableDescription}}
            @headers={{args.headers}}
            @rows={{args.rows}}
            @loading={{args.loading}}
            @filterPlaceholderText={{args.filterPlaceholderText}}
            @previousPageText={{args.previousPageText}}
            @nextPageText={{args.nextPageText}}
            @itemsPerPageText={{args.itemsPerPageText}}
            @downloadLabelText={{args.downloadLabelText}}
            @locale={{args.locale}}
            @defaultPageSize={{args.defaultPageSize}}
          />
        </:body>
      </AiChatCard>
    {{else}}
      <Table
        @tableTitle={{args.tableTitle}}
        @tableDescription={{args.tableDescription}}
        @headers={{args.headers}}
        @rows={{args.rows}}
        @loading={{args.loading}}
        @filterPlaceholderText={{args.filterPlaceholderText}}
        @previousPageText={{args.previousPageText}}
        @nextPageText={{args.nextPageText}}
        @itemsPerPageText={{args.itemsPerPageText}}
        @downloadLabelText={{args.downloadLabelText}}
        @locale={{args.locale}}
        @defaultPageSize={{args.defaultPageSize}}
      />
    {{/if}}
  </template>,
});

export const Default = meta.story();

Default.test(
  'pages, sorts and filters rows',
  async ({ canvas, canvasElement, userEvent }) => {
    // 6 rows at a page size of 5: the first page shows 5, in source order.
    await waitFor(() => expect(bodyRowNames(canvasElement)).toHaveLength(5));
    await expect(bodyRowNames(canvasElement)[0]).toBe('Jordan Smith');

    const nameHeader = canvasElement.querySelector('thead th')!;
    await userEvent.click(canvas.getByRole('button', { name: 'Name' }));
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect(bodyRowNames(canvasElement)[0]).toBe('Alex Kim');

    await userEvent.click(canvas.getByRole('button', { name: 'Name' }));
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    await expect(bodyRowNames(canvasElement)[0]).toBe('Samira Khan');

    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Filter rows' }),
      'paused',
    );
    await waitFor(() =>
      expect(bodyRowNames(canvasElement)).toEqual(['Lee Chen']),
    );
  },
);

Default.test(
  'downloads every row as CSV',
  async ({ canvasElement, userEvent }) => {
    // Intercept the synthetic download link instead of letting the browser
    // download a file.
    let href: string | null = null;
    let filename: string | null = null;
    const click = spyOn(
      HTMLAnchorElement.prototype,
      'click',
    ).mockImplementation(function (this: HTMLAnchorElement) {
      href = this.getAttribute('href');
      filename = this.getAttribute('download');
    });
    try {
      await userEvent.click(
        canvasElement.querySelector<HTMLButtonElement>(
          '.cds--toolbar-content .cds--btn--icon-only',
        )!,
      );
    } finally {
      click.mockRestore();
    }

    await expect(filename).toBe('table-data.csv');
    const csv = decodeURIComponent(
      (href ?? '').replace('data:text/csv;charset=utf-8,', ''),
    );
    await expect(csv).toContain('Name,Role,Location,Status');
    // Every row, not just the visible page.
    await expect(csv).toContain('Alex Kim,Designer');
  },
);

export const Loading = meta.story({
  args: {
    loading: true,
  },
  // The skeleton has no download button, so none of the meta's known
  // violations apply: hold it to the default bar.
});

Loading.test(
  'renders a skeleton instead of the table',
  async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('[data-loading]');
    await expect(skeleton).toHaveClass('cds--skeleton');
    await expect(skeleton!.querySelectorAll('tbody tr')).toHaveLength(5);
    await expect(canvasElement.querySelector('thead')).toBeNull();
  },
);

// docs-app's first demo.
export const Invoices = meta.story({
  args: {
    useCard: false,
    tableTitle: 'Invoices',
    tableDescription: 'Generated by the assistant',
    headers: INVOICE_HEADERS,
    rows: INVOICE_ROWS,
    filterPlaceholderText: 'Filter table',
  },
});

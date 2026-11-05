import { trackedObject } from '@ember/reactive/collections';
import { expect, fn as spy, userEvent } from 'storybook/test';

import { ROWS, HEADERS } from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import Table from './table.gts';
import TableBody from './table-body.gts';
import TableCell from './table-cell.gts';
import TableExpandedRow from './table-expanded-row.gts';
import TableExpandHeader from './table-expand-header.gts';
import TableExpandRow from './table-expand-row.gts';
import TableHead from './table-head.gts';
import TableHeader from './table-header.gts';
import TableRow from './table-row.gts';

// Carbon React has no stories for the expansion parts themselves: its
// `Components/DataTable/Expansion` page (`Default`, `BatchExpansion`) and the
// `WithAILabel` page's `AILabelWithExpansion` render them through
// DataTable's render prop. These build those tables by hand, keeping the
// expanded rows in the story's state, as an app that builds its own does.
//
// Parity gaps: `BatchExpansionMultipleTables` and `StickyHeader` (the
// Expansion page's) are not ported; the expansion parts add nothing to them.
// `TableSlugRow`, Carbon React's deprecated alias of `TableDecoratorRow`, is
// not ported either: `TableExpandRow`'s `decorator` block replaces it.
//
// The expand header's visually hidden label is Ember-only: Carbon React's
// header is empty there, which axe flags.

interface StoryArgs {
  onExpand: (event: MouseEvent) => void;
}

const meta = preview.meta({
  title: 'Components/Table/TableExpandRow',
  component: TableExpandRow,
  args: { onExpand: spy() },
  parameters: {
    docs: {
      description: {
        component: `\`TableExpandRow\` is a row with a button that expands the \`TableExpandedRow\` after it, as Carbon React's \`TableExpandRow\` and \`TableExpandedRow\`. \`TableExpandHeader\` heads the button column, and with \`@enableToggle\` it adds an expand all button. They keep no state: pass \`@isExpanded\` and handle \`@onExpand\`. \`@colSpan\` on \`TableExpandedRow\` spans the table's columns, counting the button column.

The row's \`decorator\` block puts its AI label in the row's first cell, which Carbon React does with a \`TableDecoratorRow\` child; it yields an \`AILabel\` set up for the cell.

\`\`\`gts
<Table>
  <TableHead>
    <TableRow>
      <TableExpandHeader />
      <TableHeader>Name</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableExpandRow
      @isExpanded={{this.expanded}}
      @onExpand={{this.toggle}}
      @ariaLabel="Expand row"
    >
      <TableCell>Load Balancer 3</TableCell>
    </TableExpandRow>
    {{#if this.expanded}}
      <TableExpandedRow @colSpan={{2}}>Details</TableExpandedRow>
    {{/if}}
  </TableBody>
</Table>
\`\`\``,
      },
    },
  },
  render: (args) => {
    const state = trackedObject<Record<string, boolean>>({});
    const isOpen = (id: string) => Boolean(state[id]);
    const toggle = (id: string) => (event: MouseEvent) => {
      state[id] = !state[id];
      args.onExpand(event);
    };
    return <template>
      <Table aria-label="Load balancers">
        <TableHead>
          <TableRow>
            <TableExpandHeader>
              <span class="cds--visually-hidden">Expand rows</span>
            </TableExpandHeader>
            {{#each HEADERS as |header|}}
              <TableHeader>{{header.label}}</TableHeader>
            {{/each}}
          </TableRow>
        </TableHead>
        <TableBody>
          {{#each ROWS as |row|}}
            <TableExpandRow
              @isExpanded={{isOpen row.id}}
              @onExpand={{toggle row.id}}
              @ariaLabel="Expand current row"
            >
              <TableCell>{{row.name}}</TableCell>
              <TableCell>{{row.protocol}}</TableCell>
              <TableCell>{{row.port}}</TableCell>
              <TableCell>{{row.rule}}</TableCell>
              <TableCell>{{row.attached_groups}}</TableCell>
              <TableCell>{{row.status}}</TableCell>
            </TableExpandRow>
            {{#if (isOpen row.id)}}
              <TableExpandedRow @colSpan={{7}}>
                Details of
                {{row.name}}
              </TableExpandedRow>
            {{/if}}
          {{/each}}
        </TableBody>
      </Table>
    </template>;
  },
});

export const Default = meta.story();

Default.test('expands and collapses a row', async ({ canvas }) => {
  const [first] = canvas.getAllByRole('button', {
    name: 'Expand current row',
  });
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(first!);
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await expect(canvas.getByText(/^Details of/)).toBeVisible();
  await userEvent.click(first!);
  await expect(canvas.queryByText(/^Details of/)).toBeNull();
});

export const BatchExpansion = meta.story({
  render: (args: StoryArgs) => {
    const state = trackedObject<Record<string, boolean>>({});
    const allExpanded = () => ROWS.every((row) => state[row.id]);
    const toggleAll = (event: MouseEvent) => {
      const next = !allExpanded();
      args.onExpand(event);
      for (const row of ROWS) state[row.id] = next;
    };
    const isOpen = (id: string) => Boolean(state[id]);
    const toggle = (id: string) => (event: MouseEvent) => {
      state[id] = !state[id];
      args.onExpand(event);
    };
    return <template>
      <Table aria-label="Load balancers">
        <TableHead>
          <TableRow>
            <TableExpandHeader
              @enableToggle={{true}}
              @isExpanded={{(allExpanded)}}
              @onExpand={{toggleAll}}
              @ariaLabel="Expand all rows"
            />
            {{#each HEADERS as |header|}}
              <TableHeader>{{header.label}}</TableHeader>
            {{/each}}
          </TableRow>
        </TableHead>
        <TableBody>
          {{#each ROWS as |row|}}
            <TableExpandRow
              @isExpanded={{isOpen row.id}}
              @onExpand={{toggle row.id}}
              @ariaLabel="Expand current row"
            >
              <TableCell>{{row.name}}</TableCell>
              <TableCell>{{row.protocol}}</TableCell>
              <TableCell>{{row.port}}</TableCell>
              <TableCell>{{row.rule}}</TableCell>
              <TableCell>{{row.attached_groups}}</TableCell>
              <TableCell>{{row.status}}</TableCell>
            </TableExpandRow>
            {{#if (isOpen row.id)}}
              <TableExpandedRow @colSpan={{7}}>
                Details of
                {{row.name}}
              </TableExpandedRow>
            {{/if}}
          {{/each}}
        </TableBody>
      </Table>
    </template>;
  },
});

BatchExpansion.test('expands every row at once', async ({ canvas }) => {
  await userEvent.click(
    canvas.getByRole('button', { name: 'Expand all rows' }),
  );
  await expect(canvas.getAllByText(/^Details of/)).toHaveLength(ROWS.length);
});

export const AILabelWithExpansion = meta.story({
  render: (args: StoryArgs) => {
    const state = trackedObject<Record<string, boolean>>({});
    const isOpen = (id: string) => Boolean(state[id]);
    const toggle = (id: string) => (event: MouseEvent) => {
      state[id] = !state[id];
      args.onExpand(event);
    };
    return <template>
      <Table aria-label="Load balancers">
        <TableHead>
          <TableRow>
            <TableExpandHeader>
              <span class="cds--visually-hidden">Expand rows</span>
            </TableExpandHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {{#each ROWS as |row|}}
            <TableExpandRow
              @isExpanded={{isOpen row.id}}
              @onExpand={{toggle row.id}}
              @ariaLabel="Expand current row"
            >
              <:decorator as |AILabel|>
                <AILabel @ariaLabel="AI Explained" />
              </:decorator>
              <:default>
                <TableCell>{{row.name}}</TableCell>
                <TableCell>{{row.status}}</TableCell>
              </:default>
            </TableExpandRow>
            {{#if (isOpen row.id)}}
              <TableExpandedRow @colSpan={{4}}>
                Details of
                {{row.name}}
              </TableExpandedRow>
            {{/if}}
          {{/each}}
        </TableBody>
      </Table>
    </template>;
  },
});

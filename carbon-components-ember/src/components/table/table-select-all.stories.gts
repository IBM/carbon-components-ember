import { tracked } from '@glimmer/tracking';
import { expect } from 'storybook/test';

import { ROWS } from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import Table from './table.gts';
import TableBody from './table-body.gts';
import TableCell from './table-cell.gts';
import TableHead from './table-head.gts';
import TableHeader from './table-header.gts';
import TableRow from './table-row.gts';
import TableSelectAll from './table-select-all.gts';
import TableSelectRow from './table-select-row.gts';

// Carbon React shows these in its DataTable `Selection` stories (`Default`),
// which build the table with DataTable's render props. This story builds it
// by hand, and keeps the selection itself, so it is Ember-only.

class Selection {
  @tracked selected: string[] = [];

  get all() {
    return this.selected.length === ROWS.length;
  }

  get some() {
    return this.selected.length > 0 && !this.all;
  }

  toggleAll = () => {
    this.selected = this.all ? [] : ROWS.map((row) => row.id);
  };

  toggle = (id: string) => {
    this.selected = this.selected.includes(id)
      ? this.selected.filter((selected) => selected !== id)
      : [...this.selected, id];
  };
}

const meta = preview.meta({
  title: 'Components/Table/TableSelectAll',
  component: TableSelectAll,
  parameters: {
    docs: {
      description: {
        component: `\`TableSelectAll\` is the header cell that selects every row, as Carbon React's. \`@onSelect\` receives the \`click\` event; keep the selection yourself, and pass \`@checked\` when every row is selected or \`@indeterminate\` when only some are. \`@ariaLabel\` names the checkbox, and defaults to "Select all rows in the table". \`class\` and other attributes go on the \`<th>\`. Pair it with \`TableSelectRow\` in each row.

\`\`\`gts
<TableHead>
  <TableRow>
    <TableSelectAll
      @id="select-all"
      @name="select-all"
      @checked={{this.all}}
      @indeterminate={{this.some}}
      @onSelect={{this.toggleAll}}
    />
    <TableHeader>Name</TableHeader>
  </TableRow>
</TableHead>
\`\`\``,
      },
    },
  },
  render: () => {
    const state = new Selection();
    const isSelected = (id: string) => state.selected.includes(id);
    const toggle = (id: string) => () => state.toggle(id);

    return <template>
      <Table aria-label="Load balancers">
        <TableHead>
          <TableRow>
            <TableSelectAll
              @id="select-all"
              @name="select-all"
              @checked={{state.all}}
              @indeterminate={{state.some}}
              @onSelect={{state.toggleAll}}
            />
            <TableHeader>Name</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {{#each ROWS key="id" as |row|}}
            <TableRow @isSelected={{isSelected row.id}}>
              <TableSelectRow
                @id="select-{{row.id}}"
                @ariaLabel="Select {{row.name}}"
                @checked={{isSelected row.id}}
                @onSelect={{toggle row.id}}
              />
              <TableCell>{{row.name}}</TableCell>
              <TableCell>{{row.status}}</TableCell>
            </TableRow>
          {{/each}}
        </TableBody>
      </Table>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'selects every row, and shows a partial selection as indeterminate',
  async ({ canvas, userEvent }) => {
    const all = canvas.getByRole('checkbox', {
      name: 'Select all rows in the table',
    });
    const first = canvas.getByRole('checkbox', {
      name: 'Select Load Balancer 3',
    });

    await userEvent.click(first);
    await expect(all).toBePartiallyChecked();

    await userEvent.click(all);
    await expect(all).toBeChecked();
    for (const row of canvas.getAllByRole('checkbox')) {
      await expect(row).toBeChecked();
    }

    await userEvent.click(all);
    await expect(first).not.toBeChecked();
  },
);

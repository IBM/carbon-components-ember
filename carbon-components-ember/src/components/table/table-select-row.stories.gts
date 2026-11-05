import { trackedObject } from '@ember/reactive/collections';
import { expect } from 'storybook/test';

import { ROWS } from '#storybook/fixtures/data-table.gts';
import preview from '#storybook/preview.ts';
import Table from './table.gts';
import TableBody from './table-body.gts';
import TableCell from './table-cell.gts';
import TableHead from './table-head.gts';
import TableHeader from './table-header.gts';
import TableRow from './table-row.gts';
import TableSelectRow from './table-select-row.gts';

// Carbon React shows these in its DataTable `Selection` stories
// (`With Radio Selection`), built with DataTable's render props. This story
// builds the table by hand and keeps the selection itself, so it is
// Ember-only; the checkbox version is in `TableSelectAll`'s story.

const meta = preview.meta({
  title: 'Components/Table/TableSelectRow',
  component: TableSelectRow,
  parameters: {
    docs: {
      description: {
        component: `\`TableSelectRow\` is the cell that selects a row, as Carbon React's. It renders a checkbox, or a radio button with \`@radio={{true}}\` for a single selection (give the rows the same \`@name\`). \`@onSelect\` receives the \`click\` event, and \`@onChange\` the new state, the control's \`id\` (a radio button's \`name\`) and the \`change\` event. Keep the selection yourself and pass \`@checked\`. \`@ariaLabel\` names the control, and \`class\` and other attributes go on the \`<td>\`.

\`\`\`gts
<TableRow @isSelected={{this.isSelected "a"}}>
  <TableSelectRow
    @id="select-a"
    @name="rows"
    @radio={{true}}
    @ariaLabel="Select Load Balancer 3"
    @checked={{this.isSelected "a"}}
    @onSelect={{this.select "a"}}
  />
  <TableCell>Load Balancer 3</TableCell>
</TableRow>
\`\`\``,
      },
    },
  },
  render: () => {
    const state = trackedObject<{ selected: string | null }>({
      selected: null,
    });
    const isSelected = (id: string) => state.selected === id;
    const select = (id: string) => () => {
      state.selected = id;
    };

    return <template>
      <Table aria-label="Load balancers">
        <TableHead>
          <TableRow>
            <TableHeader>Select</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {{#each ROWS key="id" as |row|}}
            <TableRow @isSelected={{isSelected row.id}}>
              <TableSelectRow
                @id="select-{{row.id}}"
                @name="rows"
                @radio={{true}}
                @ariaLabel="Select {{row.name}}"
                @checked={{isSelected row.id}}
                @onSelect={{select row.id}}
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

export const WithRadioSelection = meta.story();

WithRadioSelection.test(
  'selects one row at a time',
  async ({ canvas, userEvent }) => {
    const first = canvas.getByRole('radio', { name: 'Select Load Balancer 3' });
    const second = canvas.getByRole('radio', {
      name: 'Select Load Balancer 1',
    });

    await userEvent.click(first);
    await expect(first).toBeChecked();

    await userEvent.click(second);
    await expect(second).toBeChecked();
    await expect(first).not.toBeChecked();
  },
);

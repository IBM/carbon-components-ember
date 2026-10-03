import { array, concat } from '@ember/helper';
import { htmlSafe } from '@ember/template';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Layer from './layer.gts';
import StructuredList from './structured-list.gts';

import type { TOC } from '@ember/component/template-only';

// Carbon React parity gaps:
// - `Skeleton`: Ember has no StructuredList skeleton component.
// - React's `StructuredListInput` + checkmark cell are composed by hand in its
//   selection stories; Ember renders the selection icon cell itself, and the
//   input is the component yielded by `SL.Row`.
// Ember-only additions (from the docs-app page): `MultiSelection`,
// `Condensed`, `Flush`.

const SELECTION_ROWS = [
  {
    environment: 'Production',
    region: 'Frankfurt',
    purpose: 'Runs customer-facing services',
  },
  {
    environment: 'Staging',
    region: 'Dallas',
    purpose: 'Validates releases before deployment',
  },
  {
    environment: 'Development',
    region: 'London',
    purpose: 'Supports feature development and integration',
  },
  {
    environment: 'Disaster recovery',
    region: 'Sydney',
    purpose: 'Provides a standby recovery environment',
  },
];

const annotationStyle = htmlSafe('padding: 1rem;');

// Carbon React's `WithLayer` storybook template: the content on the
// background, then on two nested layers. Yields the layer index so each copy
// can use its own row ids and input names.
const WithLayer: TOC<{ Blocks: { default: [number] } }> = <template>
  <div style={{annotationStyle}}>
    {{yield 0}}
  </div>
  <Layer @withBackground={{true}} as |L|>
    <div style={{annotationStyle}}>
      {{yield 1}}
    </div>
    <L @withBackground={{true}}>
      <div style={{annotationStyle}}>
        {{yield 2}}
      </div>
    </L>
  </Layer>
</template>;

type SelectionListSignature = {
  Args: {
    ariaLabel?: string;
    isCondensed?: boolean;
    multiSelection?: boolean;
    selectedInitialRow?: string;
    selectedInitialRows?: string[];
    onSelectionChange?: (id: string) => void;
    onMultiSelectionChange?: (ids: string[]) => void;
    /** Prefix for row ids and the input group name. */
    prefix: string;
  };
};

// Carbon React's `structuredListBodyRowGenerator(4)` under a header row.
const SelectionList: TOC<SelectionListSignature> = <template>
  <StructuredList
    @selection={{true}}
    @multiSelection={{@multiSelection}}
    @ariaLabel={{@ariaLabel}}
    @isCondensed={{@isCondensed}}
    @selectedInitialRow={{@selectedInitialRow}}
    @selectedInitialRows={{@selectedInitialRows}}
    @onSelectionChange={{@onSelectionChange}}
    @onMultiSelectionChange={{@onMultiSelectionChange}}
    as |SL|
  >
    <SL.Head>
      <SL.Row @head={{true}}>
        <SL.Cell @head={{true}}>Environment</SL.Cell>
        <SL.Cell @head={{true}}>Region</SL.Cell>
        <SL.Cell @head={{true}}>Purpose</SL.Cell>
      </SL.Row>
    </SL.Head>
    <SL.Body>
      {{#each SELECTION_ROWS as |row index|}}
        <SL.Row @id={{concat @prefix "row-" index}} as |Input|>
          <Input
            @name={{concat @prefix "row"}}
            @title={{row.environment}}
            aria-label={{row.environment}}
          />
          <SL.Cell>{{row.environment}}</SL.Cell>
          <SL.Cell>{{row.region}}</SL.Cell>
          <SL.Cell>{{row.purpose}}</SL.Cell>
        </SL.Row>
      {{/each}}
    </SL.Body>
  </StructuredList>
</template>;

const meta = preview.meta({
  title: 'Components/StructuredList',
  component: StructuredList,
  parameters: {
    docs: {
      description: {
        component: `Structured Lists group content that is similar or related, such as terms or definitions. Compose a list from \`SL.Head\`, \`SL.Body\`, \`SL.Row\`, and \`SL.Cell\` yielded by \`StructuredList\`:

\`\`\`hbs
<StructuredList as |SL|>
  <SL.Head>
    <SL.Row @head={{true}}>
      <SL.Cell @head={{true}}>Column A</SL.Cell>
    </SL.Row>
  </SL.Head>
  <SL.Body>
    <SL.Row>
      <SL.Cell>Row 1</SL.Cell>
    </SL.Row>
  </SL.Body>
</StructuredList>
\`\`\``,
      },
    },
  },
  args: {
    ariaLabel: 'Service status',
    isCondensed: false,
    isFlush: false,
  },
  argTypes: {
    selection: { table: { readonly: true } },
  },
  render: (args) => <template>
    <StructuredList
      @ariaLabel={{args.ariaLabel}}
      @isCondensed={{args.isCondensed}}
      @isFlush={{args.isFlush}}
      as |SL|
    >
      <SL.Head>
        <SL.Row @head={{true}}>
          <SL.Cell @head={{true}}>Service</SL.Cell>
          <SL.Cell @head={{true}}>Status</SL.Cell>
          <SL.Cell @head={{true}}>Description</SL.Cell>
        </SL.Row>
      </SL.Head>
      <SL.Body>
        <SL.Row>
          <SL.Cell @noWrap={{true}}>API gateway</SL.Cell>
          <SL.Cell>Online</SL.Cell>
          <SL.Cell>
            Routes and secures application traffic across environments.
          </SL.Cell>
        </SL.Row>
        <SL.Row>
          <SL.Cell @noWrap={{true}}>Data warehouse</SL.Cell>
          <SL.Cell>Maintenance</SL.Cell>
          <SL.Cell>
            Scheduled maintenance begins Friday at 22:00 UTC.
          </SL.Cell>
        </SL.Row>
      </SL.Body>
    </StructuredList>
  </template>,
});

export const Default = meta.story({
  parameters: {
    controls: { include: ['ariaLabel', 'isCondensed', 'isFlush'] },
  },
});

const selectionDescription = `Passing \`@selection={{true}}\` turns each row into a radio-style selectable item. Give each \`SL.Row\` a stable \`@id\` and render the row-bound input component (yielded from \`SL.Row\`) to make it selectable; clicking anywhere in the row, or the input itself, selects it.

By default selection state is managed internally, optionally seeded with \`@selectedInitialRow\`. Pass \`@onSelectionChange\` to be notified whenever the selected row changes, and/or \`@selectedRow\` to fully control the selection from outside the component (for example to drive it from route or query param state):

\`\`\`hbs
<StructuredList
  @selection={{true}}
  @selectedRow={{this.selectedRow}}
  @onSelectionChange={{this.handleSelectionChange}}
  as |SL|
>
  <SL.Row @id="row-1" as |Input|>
    <Input @name="environments" />
    ...
  </SL.Row>
</StructuredList>
\`\`\``;

export const Selection = meta.story({
  args: {
    ariaLabel: 'Deployment environments',
    selection: true,
    onSelectionChange: fn(),
  },
  parameters: {
    controls: { include: ['ariaLabel', 'isCondensed'] },
    docs: { description: { story: selectionDescription } },
  },
  render: (args) => <template>
    <SelectionList
      @prefix=""
      @ariaLabel={{args.ariaLabel}}
      @isCondensed={{args.isCondensed}}
      @onSelectionChange={{args.onSelectionChange}}
    />
  </template>,
});

Selection.test(
  'selects the clicked row',
  async ({ canvas, userEvent, args }) => {
    const staging = canvas.getByRole('radio', { name: 'Staging' });
    await expect(staging).not.toBeChecked();

    await userEvent.click(canvas.getByText('Dallas'));
    await expect(staging).toBeChecked();
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith('row-1');

    await userEvent.click(canvas.getByText('London'));
    await expect(staging).not.toBeChecked();
    await expect(
      canvas.getByRole('radio', { name: 'Development' }),
    ).toBeChecked();
    await expect(args.onSelectionChange).toHaveBeenLastCalledWith('row-2');
  },
);

export const InitialSelection = meta.story({
  args: {
    ariaLabel: 'Deployment environments',
    selection: true,
    selectedInitialRow: 'row-2',
  },
  argTypes: {
    selectedInitialRow: {
      control: { type: 'select' },
      options: ['row-0', 'row-1', 'row-2', 'row-3'],
    },
  },
  parameters: {
    controls: { include: ['ariaLabel', 'isCondensed', 'selectedInitialRow'] },
  },
  render: (args) => <template>
    <SelectionList
      @prefix=""
      @ariaLabel={{args.ariaLabel}}
      @isCondensed={{args.isCondensed}}
      @selectedInitialRow={{args.selectedInitialRow}}
    />
  </template>,
});

InitialSelection.test('seeds the selected row', async ({ canvas }) => {
  await expect(
    canvas.getByRole('radio', { name: 'Development' }),
  ).toBeChecked();
});

export const WithBackgroundLayer = meta.story({
  args: {
    ariaLabel: 'Deployment environments',
    selection: true,
  },
  parameters: {
    controls: { include: ['ariaLabel', 'isCondensed'] },
  },
  render: (args) => <template>
    <WithLayer as |layer|>
      <SelectionList
        @prefix={{concat "layer-" layer "-"}}
        @ariaLabel={{args.ariaLabel}}
        @isCondensed={{args.isCondensed}}
      />
    </WithLayer>
  </template>,
});

export const MultiSelection = meta.story({
  args: {
    ariaLabel: 'Deployment environments',
    selection: true,
    multiSelection: true,
    onMultiSelectionChange: fn(),
  },
  parameters: {
    controls: { include: ['ariaLabel', 'isCondensed'] },
    docs: {
      description: {
        story: `Carbon React's \`StructuredListWrapper\` only ever supports single (radio-style) selection. As an Ember-specific addition, passing \`@multiSelection={{true}}\` alongside \`@selection={{true}}\` turns each row into a checkbox-style selectable item instead, allowing more than one row to be selected at once.

The API mirrors the single-selection one: \`@selectedInitialRows\` seeds the internal state, \`@onMultiSelectionChange\` is called with the full array of selected row ids whenever it changes, and \`@selectedRows\` lets you fully control selection from outside the component.`,
      },
    },
  },
  render: (args) => <template>
    <SelectionList
      @prefix=""
      @multiSelection={{true}}
      @ariaLabel={{args.ariaLabel}}
      @isCondensed={{args.isCondensed}}
      @selectedInitialRows={{array "row-0"}}
      @onMultiSelectionChange={{args.onMultiSelectionChange}}
    />
  </template>,
});

MultiSelection.test(
  'toggles several rows',
  async ({ canvas, userEvent, args }) => {
    const production = canvas.getByRole('checkbox', { name: 'Production' });
    await expect(production).toBeChecked();

    await userEvent.click(canvas.getByText('Dallas'));
    await expect(
      canvas.getByRole('checkbox', { name: 'Staging' }),
    ).toBeChecked();
    await expect(args.onMultiSelectionChange).toHaveBeenLastCalledWith([
      'row-0',
      'row-1',
    ]);

    await userEvent.click(canvas.getByText('Frankfurt'));
    await expect(production).not.toBeChecked();
    await expect(args.onMultiSelectionChange).toHaveBeenLastCalledWith([
      'row-1',
    ]);
  },
);

export const Condensed = Default.extend({
  args: {
    isCondensed: true,
  },
});

export const Flush = Default.extend({
  args: {
    isFlush: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`@isFlush` removes the left/right padding on the outer columns. It has no effect when `@selection` is enabled.',
      },
    },
  },
});

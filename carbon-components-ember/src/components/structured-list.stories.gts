import { concat } from '@ember/helper';
import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Layer from './layer.gts';
import StructuredListBody from './structured-list/structured-list-body.gts';
import StructuredListCell from './structured-list/structured-list-cell.gts';
import StructuredListHead from './structured-list/structured-list-head.gts';
import StructuredListWrapper from './structured-list/structured-list-wrapper.gts';
import StructuredListSkeleton from './structured-list-skeleton.gts';
import CheckmarkFilled from './icons/checkmark-filled.ts';

import type { TOC } from '@ember/component/template-only';
import '#storybook/styles/structured-list.css';

// Ember-only stories: `Condensed` and `Flush`.

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

// Carbon React's `WithLayer` storybook template: the content on the
// background, then on two nested layers. Yields the layer index so each copy
// can use its own row ids and input names.
const WithLayer: TOC<{ Blocks: { default: [number] } }> = <template>
  <div class="structured-list-story__annotation">
    {{yield 0}}
  </div>
  <Layer @withBackground={{true}} as |L|>
    <div class="structured-list-story__annotation">
      {{yield 1}}
    </div>
    <L @withBackground={{true}}>
      <div class="structured-list-story__annotation">
        {{yield 2}}
      </div>
    </L>
  </Layer>
</template>;

interface SelectionListSignature {
  Args: {
    ariaLabel: string;
    isCondensed?: boolean;
    selectedInitialRow?: string;
    /** Prefix for row ids and the input group name. */
    prefix: string;
  };
}

// Carbon React's `structuredListBodyRowGenerator(4)` under a header row: each
// row has an input and a checkmark cell, which Carbon shows while it's
// selected.
const SelectionList: TOC<SelectionListSignature> = <template>
  <StructuredListWrapper
    @selection={{true}}
    @isCondensed={{@isCondensed}}
    @selectedInitialRow={{@selectedInitialRow}}
    aria-label={{@ariaLabel}}
    as |StructuredListRow|
  >
    <StructuredListHead>
      <StructuredListRow @head={{true}}>
        <StructuredListCell @head={{true}}>Environment</StructuredListCell>
        <StructuredListCell @head={{true}}>Region</StructuredListCell>
        <StructuredListCell @head={{true}}>Purpose</StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {{#each SELECTION_ROWS as |row index|}}
        <StructuredListRow
          @id={{concat @prefix "row-" index}}
          as |StructuredListInput|
        >
          <StructuredListCell>{{row.environment}}</StructuredListCell>
          <StructuredListCell>{{row.region}}</StructuredListCell>
          <StructuredListCell>{{row.purpose}}</StructuredListCell>
          <StructuredListInput
            title={{row.environment}}
            name={{concat @prefix "row-0"}}
            aria-label={{row.environment}}
          />
          <StructuredListCell>
            <CheckmarkFilled
              @svgClass="cds--structured-list-svg"
              @ariaLabel="select an option"
            />
          </StructuredListCell>
        </StructuredListRow>
      {{/each}}
    </StructuredListBody>
  </StructuredListWrapper>
</template>;

type StoryArgs = {
  'aria-label': string;
  isCondensed: boolean;
  isFlush: boolean;
  selectedInitialRow?: string;
  rowCount?: number;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/StructuredList',
  component: StructuredListWrapper,
  parameters: {
    docs: {
      description: {
        component: `Structured lists group related content, such as terms and their definitions, in rows and columns. Build one from Carbon React's parts, imported from \`carbon-components-ember/components\`: \`StructuredListWrapper\` yields the \`StructuredListRow\`, which goes in a \`StructuredListHead\` (with \`@head\`) or \`StructuredListBody\` and holds \`StructuredListCell\`s.

For a list the user picks one row from, give the wrapper \`@selection\`, each body row an \`@id\`, and each row the \`StructuredListInput\` it yields: a visually hidden radio for the keyboard, whose \`{{on "change"}}\` tells you the chosen row's \`@id\` (its \`value\`). A click on the row selects it too. \`@selectedInitialRow\` selects a row at first. Give a row \`@selection\` to show a radio icon in it.

\`\`\`gts
<StructuredListWrapper @selection={{true}} aria-label="Environments" as |StructuredListRow|>
  <StructuredListBody>
    <StructuredListRow @id="production" as |StructuredListInput|>
      <StructuredListCell>Production</StructuredListCell>
      <StructuredListInput aria-label="Production" {{on "change" this.choose}} />
    </StructuredListRow>
  </StructuredListBody>
</StructuredListWrapper>
\`\`\``,
      },
    },
  },
  args: {
    'aria-label': 'Service status',
    isCondensed: false,
    isFlush: false,
  },
  render: (args: StoryArgs) => <template>
    <StructuredListWrapper
      @isCondensed={{args.isCondensed}}
      @isFlush={{args.isFlush}}
      aria-label={{args.aria-label}}
      as |StructuredListRow|
    >
      <StructuredListHead>
        <StructuredListRow @head={{true}}>
          <StructuredListCell @head={{true}}>Service</StructuredListCell>
          <StructuredListCell @head={{true}}>Status</StructuredListCell>
          <StructuredListCell @head={{true}}>Description</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        <StructuredListRow>
          <StructuredListCell @noWrap={{true}}>API gateway</StructuredListCell>
          <StructuredListCell>Online</StructuredListCell>
          <StructuredListCell>
            Routes and secures application traffic across environments.
          </StructuredListCell>
        </StructuredListRow>
        <StructuredListRow>
          <StructuredListCell @noWrap={{true}}>Data warehouse</StructuredListCell>
          <StructuredListCell>Maintenance</StructuredListCell>
          <StructuredListCell>
            Scheduled maintenance begins Friday at 22:00 UTC.
          </StructuredListCell>
        </StructuredListRow>
      </StructuredListBody>
    </StructuredListWrapper>
  </template>,
});

export const Default = meta.story({
  parameters: {
    controls: { include: ['aria-label', 'isCondensed', 'isFlush'] },
  },
});

export const Selection = meta.story({
  args: {
    'aria-label': 'Deployment environments',
  },
  parameters: {
    controls: { include: ['aria-label', 'isCondensed'] },
  },
  render: (args: StoryArgs) => <template>
    <SelectionList
      @prefix=""
      @ariaLabel={{args.aria-label}}
      @isCondensed={{args.isCondensed}}
    />
  </template>,
});

Selection.test('selects the clicked row', async ({ canvas, userEvent }) => {
  const staging = canvas.getByRole('radio', { name: 'Staging' });
  await expect(staging).not.toBeChecked();

  await userEvent.click(canvas.getByText('Dallas'));
  await expect(staging).toBeChecked();
  await expect(staging.closest('[role="row"]')).toHaveClass(
    'cds--structured-list-row--selected',
  );

  await userEvent.click(canvas.getByText('London'));
  await expect(staging).not.toBeChecked();
  await expect(
    canvas.getByRole('radio', { name: 'Development' }),
  ).toBeChecked();
});

export const InitialSelection = meta.story({
  args: {
    'aria-label': 'Deployment environments',
    selectedInitialRow: 'row-2',
  },
  argTypes: {
    selectedInitialRow: {
      control: { type: 'select' },
      options: ['row-0', 'row-1', 'row-2', 'row-3'],
    },
  },
  parameters: {
    controls: {
      include: ['aria-label', 'isCondensed', 'selectedInitialRow'],
    },
  },
  render: (args: StoryArgs) => <template>
    <SelectionList
      @prefix=""
      @ariaLabel={{args.aria-label}}
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
    'aria-label': 'Deployment environments',
  },
  parameters: {
    controls: { include: ['aria-label', 'isCondensed'] },
  },
  render: (args: StoryArgs) => <template>
    <WithLayer as |layer|>
      <SelectionList
        @prefix={{concat "layer-" layer "-"}}
        @ariaLabel={{args.aria-label}}
        @isCondensed={{args.isCondensed}}
      />
    </WithLayer>
  </template>,
});

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
          "`@isFlush` removes the outer columns' side padding. It has no effect with `@selection`.",
      },
    },
  },
});

export const Skeleton = meta.story({
  args: {
    rowCount: 5,
  },
  parameters: {
    controls: { include: ['rowCount'] },
    docs: {
      description: {
        story:
          '`StructuredListSkeleton` stands in for the list while its content loads.',
      },
    },
  },
  render: (args: StoryArgs) => <template>
    <div class="structured-list-story__skeleton">
      <StructuredListSkeleton @rowCount={{args.rowCount}} />
    </div>
  </template>,
});

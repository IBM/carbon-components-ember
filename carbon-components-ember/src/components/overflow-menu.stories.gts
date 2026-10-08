import { expect, fn, waitFor, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import OverflowMenu from './overflow-menu.gts';
import Filter from './icons/filter.ts';

import type { OverflowMenuSignature } from './overflow-menu.gts';

// Parity gaps with Carbon React's OverflowMenu stories:
// - No `size`, `align`, `autoAlign`, `focusTrap`, `open`/`defaultOpen` or
//   tooltip `enterDelayMs`/`leaveDelayMs` args.
// - `@disabled`/`@danger` disable or mark *every item* rather than the
//   trigger.
//
// The menu renders into ember-basic-dropdown's wormhole, outside the story
// canvas, so the tests query `document.body` for it.

type StoryArgs = OverflowMenuSignature['Args'] & {
  onItemClick?: () => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/OverflowMenu',
  component: OverflowMenu,
  args: {
    direction: 'bottom',
    flipped: false,
    tooltip: 'Options',
    onItemClick: fn(),
  },
  render: (args: StoryArgs) => <template>
    <OverflowMenu
      @direction={{args.direction}}
      @flipped={{args.flipped}}
      @tooltip={{args.tooltip}}
      @disabled={{args.disabled}}
      @danger={{args.danger}}
      @icon={{args.icon}}
      as |Item|
    >
      <Item @itemText="Stop app" @onClick={{args.onItemClick}} />
      <Item @itemText="Restart app" />
      <Item @itemText="Rename app" />
      <Item
        @itemText="Clone and move app"
        @disabled={{true}}
        @requireTitle={{true}}
      />
      <Item @itemText="Edit routes and access" @requireTitle={{true}} />
      <Item @hasDivider={{true}} @isDelete={{true}} @itemText="Delete app" />
    </OverflowMenu>
  </template>,
});

export const Default = meta.story();

Default.test(
  'opens the menu and closes it after choosing an item',
  async ({ canvasElement, userEvent, args }) => {
    const body = within(document.body);
    await userEvent.click(
      canvasElement.querySelector<HTMLElement>('.cds--overflow-menu')!,
    );
    const item = await body.findByRole('menuitem', { name: 'Stop app' });
    await expect(
      body.getByRole('menuitem', { name: 'Clone and move app' }),
    ).toBeDisabled();
    await userEvent.click(item);
    await expect(args.onItemClick).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(body.queryByRole('menuitem', { name: 'Stop app' })).toBeNull(),
    );
  },
);

export const RenderCustomIcon = meta.story({
  args: {
    icon: Filter,
    tooltip: 'Filter',
  },
  render: (args: StoryArgs) => <template>
    <OverflowMenu
      @direction={{args.direction}}
      @flipped={{args.flipped}}
      @tooltip={{args.tooltip}}
      @icon={{args.icon}}
      as |Item|
    >
      <Item @itemText="Filter A" />
      <Item @itemText="Filter B" />
    </OverflowMenu>
  </template>,
});

// The docs-app demo: long items with `@requireTitle`, a delete item with a
// `@dangerDescription`, a divider, a disabled item and a link item. Toggle
// the `danger` and `disabled` controls to affect every item.
export const ItemVariants = meta.story({
  render: (args: StoryArgs) => <template>
    <OverflowMenu
      @direction={{args.direction}}
      @flipped={{args.flipped}}
      @tooltip={{args.tooltip}}
      @danger={{args.danger}}
      @disabled={{args.disabled}}
      as |Item|
    >
      <Item @itemText="option 1" />
      <Item
        @itemText="Option 2 is an example of a really long string and how we recommend handling this"
        @requireTitle={{true}}
      />
      <Item @itemText="option 3" @onClick={{args.onItemClick}} />
      <Item
        @itemText="delete"
        @isDelete={{true}}
        @dangerDescription="delete this item"
      />
      <Item @itemText="disabled" @disabled={{true}} />
      <Item @itemText="option 4" @hasDivider={{true}} />
      <Item @itemText="link item" @href="https://carbondesignsystem.com" />
    </OverflowMenu>
  </template>,
});

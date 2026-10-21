import { expect, fn, waitFor, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import OverflowMenu from './overflow-menu.gts';
import Filter from './icons/filter.ts';

import type { OverflowMenuSignature } from './overflow-menu.gts';

// Parity gaps with Carbon React's OverflowMenu stories:
// - No `focusTrap` control: Tab closes the menu, so there's no focus to
//   trap.

type StoryArgs = OverflowMenuSignature['Args'] & {
  onItemClick: () => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/OverflowMenu',
  component: OverflowMenu,
  parameters: {
    docs: {
      description: {
        component:
          'A button that opens a menu of actions for the thing it sits next to. It yields `OverflowMenuItem` bound to the menu: an item closes the menu once its `{{on "click"}}` has run, and the arrow keys move between enabled items. The menu renders in place, in the top layer, so containers like DataTable cells don\'t clip it and it stays usable inside a Modal. `@iconDescription` names the trigger and is its tooltip; `@ariaLabel` names the menu.',
      },
    },
  },
  args: {
    flipped: false,
    iconDescription: 'Options',
    open: false,
    size: 'md',
    onItemClick: fn(),
  },
  argTypes: {
    align: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-end',
        'left-start',
        'right',
        'right-end',
        'right-start',
      ],
    },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
  render: (args: StoryArgs) => <template>
    <OverflowMenu
      @ariaLabel="overflow-menu"
      @align={{args.align}}
      @autoAlign={{args.autoAlign}}
      @defaultOpen={{args.defaultOpen}}
      @disabled={{args.disabled}}
      @enterDelayMs={{args.enterDelayMs}}
      @flipped={{args.flipped}}
      @iconDescription={{args.iconDescription}}
      @leaveDelayMs={{args.leaveDelayMs}}
      @open={{args.open}}
      @size={{args.size}}
      as |Item|
    >
      <Item @itemText="Stop app" {{on "click" args.onItemClick}} />
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
  'opens the menu on the first item, and closes it after choosing one',
  async ({ canvasElement, userEvent, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Options' }));
    const item = await canvas.findByRole('menuitem', { name: 'Stop app' });
    await waitFor(() => expect(item).toHaveFocus());
    await expect(
      canvas.getByRole('menuitem', { name: 'Clone and move app' }),
    ).toBeDisabled();
    await userEvent.click(item);
    await expect(args.onItemClick).toHaveBeenCalledOnce();
    await waitFor(() => expect(canvas.queryByRole('menu')).toBeNull());
  },
);

Default.test(
  'moves between enabled items with the arrow keys, and closes on Escape',
  async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Options' });
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(canvas.getByRole('menuitem', { name: 'Stop app' })).toHaveFocus(),
    );
    await userEvent.keyboard('{ArrowUp}');
    await expect(
      canvas.getByRole('menuitem', { name: 'Delete app' }),
    ).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    // Past the disabled "Clone and move app".
    await expect(
      canvas.getByRole('menuitem', { name: 'Rename app' }),
    ).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('menu')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
);

export const RenderCustomIcon = meta.story({
  render: (args: StoryArgs) => <template>
    <OverflowMenu
      @align={{args.align}}
      @flipped={{args.flipped}}
      @iconDescription={{args.iconDescription}}
      @open={{args.open}}
      @renderIcon={{Filter}}
      @size={{args.size}}
      as |Item|
    >
      <Item @itemText="Filter A" />
      <Item @itemText="Filter B" />
    </OverflowMenu>
  </template>,
});

// Long items with `@requireTitle`, a delete item with a `@dangerDescription`,
// a divider, a disabled item and a link item.
export const ItemVariants = meta.story({
  render: (args: StoryArgs) => <template>
    <OverflowMenu
      @ariaLabel="overflow-menu"
      @flipped={{args.flipped}}
      @iconDescription={{args.iconDescription}}
      @size={{args.size}}
      as |Item|
    >
      <Item @itemText="option 1" />
      <Item
        @itemText="Option 2 is an example of a really long string and how we recommend handling this"
        @requireTitle={{true}}
      />
      <Item @itemText="option 3" {{on "click" args.onItemClick}} />
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

import { trackedObject } from '@ember/reactive/collections';
import { modifier } from 'ember-modifier';
import { expect, fn, waitFor, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import Menu from './menu.gts';
import MenuItem from './menu/menu-item.gts';
import MenuItemDivider from './menu/menu-item-divider.gts';
import MenuItemGroup from './menu/menu-item-group.gts';
import MenuItemRadioGroup from './menu/menu-item-radio-group.gts';
import MenuItemSelectable from './menu/menu-item-selectable.gts';
import Copy from './icons/copy.ts';
import Cut from './icons/cut.ts';
import FolderShared from './icons/folder-shared.ts';
import Paste from './icons/paste.ts';
import TextBold from './icons/text-bold.ts';
import TextItalic from './icons/text-italic.ts';
import TrashCan from './icons/trash-can.ts';

import type { MenuSignature } from './menu.gts';

// Mirrors Carbon React's single Menu story (`Default`); `Opening from a
// trigger` and `Sizes` port the docs-app demos. MenuItem, MenuItemDivider,
// MenuItemGroup, MenuItemRadioGroup and MenuItemSelectable are separate
// components (not yielded by Menu), so their API isn't listed on this page;
// see their JSDoc in `src/components/menu/`.
//
// Each story renders the menu into a local box passed as `@target`
// (Menu defaults to `document.body`). The box carries a `transform`, which
// makes it the containing block for the fixed-position menu, so `@x`/`@y`
// are relative to the box rather than to the viewport.

type StoryArgs = MenuSignature['Args'] & {
  onItemClick?: () => void;
  onSelectableChange?: (checked: boolean) => void;
  onRadioChange?: (selected: string) => void;
};

const SHARE_WITH = ['None', 'Product team', 'Organization', 'Company'];
const DECORATIONS = ['None', 'Overline', 'Line-through', 'Underline'];

function targetBox() {
  const state = trackedObject<{ target?: HTMLElement }>({});
  const setTarget = modifier((element: HTMLElement) => {
    state.target = element;
  });
  return { state, setTarget };
}

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    docs: {
      description: {
        component:
          "Menu is a low-level building block for rendering a floating list of actions; `OverflowMenu` and context menus are built on top of it. It's a controlled component: pass `@open` and toggle it from `@onClose`/your own trigger. Compose it out of `MenuItem`, `MenuItemDivider`, `MenuItemGroup`, `MenuItemRadioGroup`, and `MenuItemSelectable`.\n\nBy default the Menu renders into `document.body`; `@target` renders it into another element. `@x`/`@y` position it; passing both edges of a trigger (`[x1, x2]`/`[y1, y2]`) lets it flip to the other side when it doesn't fit. Clicking a leaf item, pressing <kbd>Escape</kbd>, or moving focus outside the menu all call `@onClose`.",
      },
    },
  },
  args: {
    label: 'Menu',
    open: true,
    size: 'sm',
    onClose: fn(),
    onItemClick: fn(),
    onSelectableChange: fn(),
    onRadioChange: fn(),
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    target: { control: false },
  },
  render: (args: StoryArgs) => {
    const { state, setTarget } = targetBox();

    return <template>
      <div
        style="position: relative; transform: translateZ(0); min-block-size: 24rem;"
        {{setTarget}}
      >
        {{#if state.target}}
          <Menu
            @label={{args.label}}
            @open={{args.open}}
            @size={{args.size}}
            @border={{args.border}}
            @backgroundToken={{args.backgroundToken}}
            @target={{state.target}}
            @x={{0}}
            @y={{0}}
            @onClose={{args.onClose}}
          >
            <MenuItem @label="Share with" @renderIcon={{FolderShared}}>
              <MenuItemRadioGroup
                @label="Share with"
                @items={{SHARE_WITH}}
                @defaultSelectedItem="Product team"
                @onChange={{args.onRadioChange}}
              />
            </MenuItem>
            <MenuItemDivider />
            <MenuItem
              @label="Cut"
              @shortcut="⌘X"
              @renderIcon={{Cut}}
              @onClick={{args.onItemClick}}
            />
            <MenuItem
              @label="Copy"
              @shortcut="⌘C"
              @renderIcon={{Copy}}
              @onClick={{args.onItemClick}}
            />
            <MenuItem
              @label="Paste"
              @shortcut="⌘V"
              @disabled={{true}}
              @renderIcon={{Paste}}
              @onClick={{args.onItemClick}}
            />
            <MenuItemDivider />
            <MenuItemGroup @label="Font style">
              <MenuItemSelectable
                @label="Bold"
                @shortcut="⌘B"
                @defaultSelected={{true}}
                @renderIcon={{TextBold}}
                @onChange={{args.onSelectableChange}}
              />
              <MenuItemSelectable
                @label="Italic"
                @shortcut="⌘I"
                @renderIcon={{TextItalic}}
                @onChange={{args.onSelectableChange}}
              />
            </MenuItemGroup>
            <MenuItemDivider />
            <MenuItemRadioGroup
              @label="Text decoration"
              @items={{DECORATIONS}}
              @defaultSelectedItem="None"
              @onChange={{args.onRadioChange}}
            />
            <MenuItemDivider />
            <MenuItem
              @label="Delete"
              @shortcut="⌫"
              @kind="danger"
              @renderIcon={{TrashCan}}
              @onClick={{args.onItemClick}}
            />
          </Menu>
        {{/if}}
      </div>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'toggles selectable and radio items',
  async ({ canvas, userEvent, args }) => {
    const italic = await canvas.findByRole('menuitemcheckbox', {
      name: /Italic/,
    });
    await expect(italic).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(italic);
    await expect(italic).toHaveAttribute('aria-checked', 'true');
    await expect(args.onSelectableChange).toHaveBeenCalledWith(true);

    await userEvent.click(
      canvas.getByRole('menuitemradio', { name: /Underline/ }),
    );
    // The radio group re-renders its items on change, so query again.
    await expect(
      canvas.getByRole('menuitemradio', { name: /Underline/ }),
    ).toHaveAttribute('aria-checked', 'true');
    await expect(args.onRadioChange).toHaveBeenCalledWith('Underline');
  },
);

Default.test(
  'clicking a leaf item calls it and closes the menu',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(await canvas.findByRole('menuitem', { name: /Cut/ }));
    await expect(args.onItemClick).toHaveBeenCalledOnce();
    await expect(args.onClose).toHaveBeenCalled();
  },
);

// In practice `@open` is toggled from a trigger, and `@x`/`@y` are computed
// from the trigger's position so the menu appears anchored to it.
export const OpeningFromATrigger = meta.story({
  name: 'Opening from a trigger',
  args: {
    open: false,
  },
  render: (args: StoryArgs) => {
    const state = trackedObject<{
      open: boolean;
      target?: HTMLElement;
      x?: [number, number];
      y?: [number, number];
    }>({ open: args.open ?? false });
    const setTarget = modifier((element: HTMLElement) => {
      state.target = element;
    });
    const openMenu = (event: MouseEvent) => {
      const trigger = (
        event.currentTarget as HTMLElement
      ).getBoundingClientRect();
      const box = state.target!.getBoundingClientRect();
      // Subtracting the box is only needed because it is the menu's
      // containing block. Rendering into `document.body`, you would pass the
      // trigger's viewport coordinates as they are.
      state.x = [trigger.left - box.left, trigger.right - box.left];
      state.y = [trigger.top - box.top, trigger.bottom - box.top];
      state.open = true;
    };
    const closeMenu = () => {
      state.open = false;
      args.onClose?.();
    };

    return <template>
      <div
        style="position: relative; transform: translateZ(0); min-block-size: 14rem; padding: 1rem;"
        {{setTarget}}
      >
        <Button {{on "click" openMenu}}>Open menu</Button>

        {{#if state.target}}
          <Menu
            @label={{args.label}}
            @open={{state.open}}
            @size={{args.size}}
            @target={{state.target}}
            @x={{state.x}}
            @y={{state.y}}
            @onClose={{closeMenu}}
          >
            <MenuItem
              @label="Cut"
              @shortcut="⌘X"
              @onClick={{args.onItemClick}}
            />
            <MenuItem
              @label="Copy"
              @shortcut="⌘C"
              @onClick={{args.onItemClick}}
            />
            <MenuItemDivider />
            <MenuItem
              @label="Delete"
              @shortcut="⌫"
              @kind="danger"
              @onClick={{args.onItemClick}}
            />
          </Menu>
        {{/if}}
      </div>
    </template>;
  },
});

OpeningFromATrigger.test(
  'opens from the trigger, moves focus with the arrow keys and closes on Escape',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const menu = () => canvasElement.querySelector('.cds--menu--open');
    await expect(menu()).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    await waitFor(() => expect(menu()).toBeInTheDocument());
    const items = within(menu() as HTMLElement);
    await waitFor(() =>
      expect(items.getByRole('menuitem', { name: /Cut/ })).toHaveFocus(),
    );
    await userEvent.keyboard('{ArrowDown}');
    await expect(items.getByRole('menuitem', { name: /Copy/ })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(menu()).toBeNull());
    await expect(args.onClose).toHaveBeenCalled();
  },
);

// `@size` accepts `xs`, `sm` (default), `md`, or `lg`.
export const Sizes = meta.story({
  args: {
    size: 'lg',
  },
  render: (args: StoryArgs) => {
    const { state, setTarget } = targetBox();

    return <template>
      <div
        style="position: relative; transform: translateZ(0); min-block-size: 12rem;"
        {{setTarget}}
      >
        {{#if state.target}}
          <Menu
            @label={{args.label}}
            @open={{args.open}}
            @size={{args.size}}
            @target={{state.target}}
            @x={{0}}
            @y={{0}}
            @onClose={{args.onClose}}
          >
            <MenuItem @label="Cut" @shortcut="⌘X" />
            <MenuItem @label="Copy" @shortcut="⌘C" />
            <MenuItemDivider />
            <MenuItem @label="Delete" @shortcut="⌫" @kind="danger" />
          </Menu>
        {{/if}}
      </div>
    </template>;
  },
});

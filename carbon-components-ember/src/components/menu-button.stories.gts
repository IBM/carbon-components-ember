import { fn as spy } from 'storybook/test';

import preview from '#storybook/preview.ts';
import MenuButton from './menu-button.gts';
import MenuItemDivider from './menu/menu-item-divider.gts';
import Asset from './icons/asset.ts';
import Group from './icons/group.ts';
import User from './icons/user.ts';

import type { MenuButtonSignature } from './menu-button.gts';
import type { MenuItemSignature } from './menu/menu-item.gts';
import '#storybook/styles/menu-button.css';

// Mirrors Carbon React's MenuButton stories. Parity gaps: none.

type StoryArgs = MenuButtonSignature['Args'] & {
  onClick: NonNullable<MenuItemSignature['Args']['onClick']>;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/MenuButton',
  component: MenuButton,
  parameters: {
    docs: {
      description: {
        component:
          'A button that opens a menu of actions. It yields `MenuItem`, `MenuItemSelectable` and `MenuItemRadioGroup`, as Menu does (`<MenuButton @label="Actions" as |MenuItem|>`); separate them with `MenuItemDivider`, which you import. `@menuAlignment` places the menu against the button (`bottom` by default, as wide as the button when it opens straight above or below), and it flips when there\'s no room. Choosing an item, pressing <kbd>Escape</kbd> or moving focus away closes the menu.',
      },
    },
  },
  args: {
    disabled: false,
    kind: 'primary',
    label: 'Actions',
    menuAlignment: 'bottom',
    menuBackgroundToken: 'layer',
    menuBorder: false,
    size: 'lg',
    tabIndex: 0,
    onClick: spy(),
  },
  argTypes: {
    kind: { control: 'radio', options: ['primary', 'tertiary', 'ghost'] },
    menuAlignment: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
      ],
    },
    menuBackgroundToken: {
      control: 'select',
      options: ['layer', 'background'],
    },
    size: { control: 'radio', options: ['xs', 'sm', 'md', 'lg'] },
    menuTarget: { control: false },
    onClick: { table: { category: 'story controls' } },
  },
});

export const Default = meta.story({
  render: (args: StoryArgs) => <template>
    <MenuButton
      @label={{args.label}}
      @kind={{args.kind}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @menuAlignment={{args.menuAlignment}}
      @menuBackgroundToken={{args.menuBackgroundToken}}
      @menuBorder={{args.menuBorder}}
      @tabIndex={{args.tabIndex}}
      as |MenuItem|
    >
      <MenuItem
        @label="First action with a long label description"
        @onClick={{args.onClick}}
      />
      <MenuItem @label="Second action" @onClick={{args.onClick}} />
      <MenuItem
        @label="Third action"
        @onClick={{args.onClick}}
        @disabled={{true}}
      />
    </MenuButton>
  </template>,
});

export const ExperimentalAutoAlign = meta.story({
  render: (args: StoryArgs) => <template>
    <div class="menu-button-story__auto-align">
      <div class="menu-button-story__auto-align-anchor">
        <MenuButton
          @label={{args.label}}
          @kind={{args.kind}}
          @size={{args.size}}
          @disabled={{args.disabled}}
          @menuAlignment={{args.menuAlignment}}
          @menuBackgroundToken={{args.menuBackgroundToken}}
          @menuBorder={{args.menuBorder}}
          @tabIndex={{args.tabIndex}}
          as |MenuItem|
        >
          <MenuItem @label="First action" />
          <MenuItem
            @label="Second action that is a longer item to test overflow and title."
          />
          <MenuItem @label="Third action" @disabled={{true}} />
        </MenuButton>
      </div>
    </div>
  </template>,
});

export const WithDanger = meta.story({
  render: (args: StoryArgs) => <template>
    <MenuButton
      @label={{args.label}}
      @kind={{args.kind}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @menuAlignment={{args.menuAlignment}}
      @menuBackgroundToken={{args.menuBackgroundToken}}
      @menuBorder={{args.menuBorder}}
      @tabIndex={{args.tabIndex}}
      as |MenuItem|
    >
      <MenuItem @label="First action" />
      <MenuItem @label="Second action" />
      <MenuItem @label="Third action" />
      <MenuItemDivider />
      <MenuItem @label="Danger action" @kind="danger" />
    </MenuButton>
  </template>,
});

export const WithDividers = meta.story({
  render: (args: StoryArgs) => <template>
    <MenuButton
      @label={{args.label}}
      @kind={{args.kind}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @menuAlignment={{args.menuAlignment}}
      @menuBackgroundToken={{args.menuBackgroundToken}}
      @menuBorder={{args.menuBorder}}
      @tabIndex={{args.tabIndex}}
      as |MenuItem|
    >
      <MenuItem @label="Create service request" />
      <MenuItem @label="Create work order" />
      <MenuItemDivider />
      <MenuItem @label="Add plan" />
      <MenuItem @label="Add flag" />
      <MenuItemDivider />
      <MenuItem @label="Edit source location" />
      <MenuItem @label="Recalculate source" />
    </MenuButton>
  </template>,
});

export const WithIcons = meta.story({
  args: { label: 'Add' },
  render: (args: StoryArgs) => <template>
    <MenuButton
      @label={{args.label}}
      @kind={{args.kind}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @menuAlignment={{args.menuAlignment}}
      @menuBackgroundToken={{args.menuBackgroundToken}}
      @menuBorder={{args.menuBorder}}
      @tabIndex={{args.tabIndex}}
      as |MenuItem|
    >
      <MenuItem @label="Asset" @renderIcon={{Asset}} />
      <MenuItem @label="User" @renderIcon={{User}} />
      <MenuItem @label="User group" @renderIcon={{Group}} />
    </MenuButton>
  </template>,
});

export const WithNestedMenu = meta.story({
  render: (args: StoryArgs) => <template>
    <MenuButton
      @label={{args.label}}
      @kind={{args.kind}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @menuAlignment={{args.menuAlignment}}
      @menuBackgroundToken={{args.menuBackgroundToken}}
      @menuBorder={{args.menuBorder}}
      @tabIndex={{args.tabIndex}}
      as |MenuItem|
    >
      <MenuItem @label="Save" @shortcut="⌘S" />
      <MenuItem @label="Save as" @shortcut="⌥⌘S" />
      <MenuItem @label="Export as" as |SubmenuItem|>
        <SubmenuItem @label="PDF" />
        <SubmenuItem @label="JPG" />
        <SubmenuItem @label="PNG" />
      </MenuItem>
      <MenuItemDivider />
      <MenuItem @label="Delete" @kind="danger" />
    </MenuButton>
  </template>,
});

export const WithMenuAlignment = meta.story({
  parameters: {
    controls: {
      include: [
        'disabled',
        'kind',
        'menuBackgroundToken',
        'menuBorder',
        'size',
      ],
    },
  },
  render: (args: StoryArgs) => <template>
    <div class="menu-button-story__row">
      {{#each BOTTOM as |alignment|}}
        <MenuButton
          @label={{alignment.label}}
          @menuAlignment={{alignment.value}}
          @kind={{args.kind}}
          @size={{args.size}}
          @disabled={{args.disabled}}
          @menuBackgroundToken={{args.menuBackgroundToken}}
          @menuBorder={{args.menuBorder}}
          @tabIndex={{args.tabIndex}}
          as |MenuItem|
        >
          <MenuItem @label="First action" />
          <MenuItem
            @label="Second action that is a longer item to test overflow and title."
          />
          <MenuItem @label="Third action" @disabled={{true}} />
        </MenuButton>
      {{/each}}
    </div>
    <div class="menu-button-story__row menu-button-story__row--top">
      {{#each TOP as |alignment|}}
        <MenuButton
          @label={{alignment.label}}
          @menuAlignment={{alignment.value}}
          @kind={{args.kind}}
          @size={{args.size}}
          @disabled={{args.disabled}}
          @menuBackgroundToken={{args.menuBackgroundToken}}
          @menuBorder={{args.menuBorder}}
          @tabIndex={{args.tabIndex}}
          as |MenuItem|
        >
          <MenuItem @label="First action" />
          <MenuItem
            @label="Second action that is a longer item to test overflow and title."
          />
          <MenuItem @label="Third action" @disabled={{true}} />
        </MenuButton>
      {{/each}}
    </div>
  </template>,
});

type Alignment = {
  label: string;
  value: NonNullable<MenuButtonSignature['Args']['menuAlignment']>;
};

const BOTTOM: Alignment[] = [
  { label: 'Bottom', value: 'bottom' },
  { label: 'Bottom start', value: 'bottom-start' },
  { label: 'Bottom end', value: 'bottom-end' },
];

const TOP: Alignment[] = [
  { label: 'Top', value: 'top' },
  { label: 'Top start', value: 'top-start' },
  { label: 'Top end', value: 'top-end' },
];

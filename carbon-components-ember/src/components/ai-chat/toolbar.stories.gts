import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import {
  Add,
  ArrowLeft,
  Close,
  Download,
  Home,
  Launch,
  Maximize,
  Renew,
  Settings,
  Share,
  Star,
  StarFilled,
  TrashCan,
  Version,
} from '../../icons.ts';
import Button from '../button.gts';
import OverflowMenu from '../overflow-menu.gts';
import OverflowMenuItem from '../overflow-menu/item.gts';
import Tooltip from '../tooltip.gts';
import Toolbar from './toolbar.gts';

import type { ToolbarSignature, ToolbarAction } from './toolbar.gts';

// Mirrors `@carbon/ai-chat-components`' `toolbar.stories.js`
// (`Components/Toolbar`): Default (with the same `title`/`navigation`/
// `fixedActions`/`actions`/border-radius select controls, mapped to story-only
// args) and Toggle ("Toggleable actions").
//
// docs-app's demo (a 20rem-wide toolbar whose actions collapse into the
// overflow menu) is the `NarrowWithOverflow` story.
//
// Parity gaps (not faked):
// - `aiLabel` (an AI label in the `decorator` slot): this addon has no
//   `AILabel` component. The `decorator` block exists, but there's nothing
//   Carbon-equivalent to put in it.
// - `fixedActions: 'content switcher'`: this addon has no `ContentSwitcher`;
//   only the `'custom 1'` (a plain button) option is ported.
// - Toggle: `ToolbarAction` has no `isSelected`, so the favourite action
//   only swaps its icon (Star / StarFilled) - there's no selected styling.
// - Upstream's `carbonTheme` arg isn't ported: the Storybook toolbar's
//   theme switcher applies Carbon's theme classes instead.

type StoryArgs = ToolbarSignature['Args'] & {
  /** Story-only: which predefined action list to render. */
  actionList: 'Advanced list' | 'Basic list' | 'Close only' | 'None';
  /** Story-only: content of the `title` block (upstream `title` slot). */
  titleSlot: 'default' | 'with truncation' | 'none';
  /** Story-only: content of the `navigation` block. */
  navigation: 'home' | 'back' | 'custom 1' | 'custom 2' | 'none';
  /** Story-only: content of the `fixedActions` block. */
  fixedActions: 'custom 1' | 'none';
  /** Story-only: sets `--cds-aichat-border-radius: 8px` on the toolbar. */
  borderRadius: boolean;
  /** Story-only: called with an action's text when it is clicked. */
  onActionClick: (text: string) => void;
};

function actionLists(
  onClick: (text: string) => void,
): Record<StoryArgs['actionList'], ToolbarAction[]> {
  const make = (
    text: string,
    icon: ToolbarAction['icon'],
    extra: Partial<ToolbarAction> = {},
  ): ToolbarAction => ({
    text,
    icon,
    size: 'md',
    onClick: () => onClick(text),
    ...extra,
  });

  return {
    'Advanced list': [
      make('Version', Version),
      make('Download', Download),
      make('Share', Share),
      make('Launch', Launch),
      make('Maximize', Maximize),
      make('Close', Close, { fixed: true }),
    ],
    'Basic list': [
      make('Launch', Launch),
      make('Maximize', Maximize),
      make('Close', Close, { fixed: true }),
    ],
    'Close only': [make('Close', Close, { fixed: true })],
    None: [],
  };
}

const eq = (a: unknown, b: unknown) => a === b;

// The icon buttons get no accessible name (see the a11y note on the meta), so
// tests find them through the tooltip that labels their wrapper. Buttons in
// the toolbar's hidden measurement row are skipped.
// Toolbar's icon-only buttons are named by their Tooltip label. The hidden
// measurement row isn't in the accessibility tree, so this finds the visible
// button.
function buttonLabelled(root: HTMLElement, label: string): HTMLButtonElement {
  return within(root).getByRole('button', { name: label });
}

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Toolbar',
  component: Toolbar,
  parameters: {
    docs: {
      description: {
        component: `\`Toolbar\` renders a horizontal action bar: a navigation area, a title, and a row of icon-button actions. Setting \`@overflow\` collapses actions that don't fit the available width into an overflow menu; actions marked \`fixed\` never overflow.

The \`navigation\`, \`title\`, \`fixedActions\` and \`decorator\` named blocks mirror upstream's slots of the same names.`,
      },
    },
  },
  argTypes: {
    actionList: {
      control: 'select',
      options: ['Advanced list', 'Basic list', 'Close only', 'None'],
    },
    titleSlot: {
      control: 'select',
      options: ['default', 'with truncation', 'none'],
    },
    navigation: {
      control: 'select',
      options: ['home', 'back', 'custom 1', 'custom 2', 'none'],
    },
    fixedActions: {
      control: 'select',
      options: ['custom 1', 'none'],
    },
  },
  args: {
    titleSlot: 'default',
    overflow: true,
    actionList: 'Advanced list',
    navigation: 'home',
    fixedActions: 'none',
    borderRadius: false,
    onActionClick: fn(),
  },
  render: (args: StoryArgs) => {
    const actions = actionLists(args.onActionClick)[args.actionList];
    const navClick = () => args.onActionClick('navigation');
    const fixedClick = () => args.onActionClick('fixed');
    const style = args.borderRadius
      ? '--cds-aichat-border-radius: 8px; border-block-end: 1px solid var(--cds-border-subtle-00);'
      : 'border-block-end: 1px solid var(--cds-border-subtle-00);';

    return <template>
      <Toolbar
        @actions={{actions}}
        @overflow={{args.overflow}}
        @titleText={{args.titleText}}
        @nameText={{args.nameText}}
        style={{style}}
      >
        <:navigation>
          {{#if (eq args.navigation "home")}}
            <Tooltip @label="Home" @align="bottom-start">
              <Button
                @ghost={{true}}
                @iconOnly={{true}}
                @size="md"
                @onClick={{navClick}}
              >
                <Home @size={{16}} @svgClass="cds-aichat-story-icon" />
              </Button>
            </Tooltip>
          {{else if (eq args.navigation "back")}}
            <Tooltip @label="Back" @align="bottom-start">
              <Button
                @ghost={{true}}
                @iconOnly={{true}}
                @size="md"
                @onClick={{navClick}}
              >
                <ArrowLeft @size={{16}} @svgClass="cds-aichat-story-icon" />
              </Button>
            </Tooltip>
          {{else if (eq args.navigation "custom 1")}}
            <OverflowMenu @tooltip="Menu" @direction="bottom">
              <OverflowMenuItem @itemText="Stop app" />
              <OverflowMenuItem @itemText="Restart app" />
              <OverflowMenuItem @itemText="Rename app" />
              <OverflowMenuItem
                @itemText="Clone and move app"
                @disabled={{true}}
              />
              <OverflowMenuItem @itemText="Edit routes and access" />
              <OverflowMenuItem
                @itemText="Delete app"
                @hasDivider={{true}}
                @isDelete={{true}}
              />
            </OverflowMenu>
          {{else if (eq args.navigation "custom 2")}}
            <Button @size="md" @onClick={{navClick}}>test</Button>
          {{/if}}
        </:navigation>
        <:title>
          {{#if (eq args.titleSlot "default")}}
            <div style="white-space: nowrap;">
              Title
              <span class="cds--type-heading-compact-01">text</span>
            </div>
          {{else if (eq args.titleSlot "with truncation")}}
            <div>
              <span
                style="display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 1; line-height: normal; word-break: break-all;"
              >
                Lorem ipsum dolor sit amet
                <span class="cds--type-heading-compact-01">consectetur</span>
              </span>
            </div>
          {{/if}}
        </:title>
        <:fixedActions>
          {{#if (eq args.fixedActions "custom 1")}}
            <Button @size="md" @onClick={{fixedClick}}>test</Button>
          {{/if}}
        </:fixedActions>
      </Toolbar>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'calls an action and the navigation button',
  async ({ canvasElement, userEvent, args }) => {
    // The fixed Close action is always visible; actions are icon-only
    // buttons labelled by their tooltip.
    const close = await waitFor(() => buttonLabelled(canvasElement, 'Close'));
    await userEvent.click(close);
    await expect(args.onActionClick).toHaveBeenCalledWith('Close');

    await userEvent.click(buttonLabelled(canvasElement, 'Home'));
    await expect(args.onActionClick).toHaveBeenCalledWith('navigation');
  },
);

export const WithTitleText = meta.story({
  args: {
    titleSlot: 'none',
    titleText: 'Conversation',
    nameText: 'with watsonx',
    actionList: 'Basic list',
    navigation: 'back',
    fixedActions: 'custom 1',
    borderRadius: true,
  },
});

// docs-app's demo: in a 20rem container the overflowing actions collapse
// into an "Options" overflow menu, while the `fixed` Refresh action stays.
export const NarrowWithOverflow = meta.story({
  args: {
    titleText: 'Conversation',
    titleSlot: 'none',
    navigation: 'none',
  },
  render: (args: StoryArgs) => {
    const click = (text: string) => () => args.onActionClick(text);
    const actions: ToolbarAction[] = [
      { text: 'Add', icon: Add, onClick: click('Add') },
      { text: 'Refresh', icon: Renew, onClick: click('Refresh'), fixed: true },
      { text: 'Settings', icon: Settings, onClick: click('Settings') },
      {
        text: 'Delete',
        icon: TrashCan,
        danger: true,
        onClick: click('Delete'),
      },
    ];

    return <template>
      <div
        style="max-inline-size: 20rem; border: 1px solid var(--cds-border-subtle); border-radius: 0.5rem 0.5rem 0 0;"
      >
        <Toolbar
          @titleText={{args.titleText}}
          @overflow={{args.overflow}}
          @actions={{actions}}
        />
      </div>
    </template>;
  },
});

NarrowWithOverflow.test(
  'collapses actions into the overflow menu',
  async ({ canvasElement, userEvent, args }) => {
    await expect(
      await waitFor(() => buttonLabelled(canvasElement, 'Refresh')),
    ).toBeVisible();
    const trigger = await waitFor(() => {
      const el = canvasElement.querySelector<HTMLElement>(
        '.cds-aichat-toolbar__actions-container .cds--overflow-menu',
      );
      if (!el) throw new Error('overflow menu not rendered yet');
      return el;
    });
    await userEvent.click(trigger);

    const body = within(document.body);
    const deleteItem = await body.findByRole('menuitem', { name: 'Delete' });
    await userEvent.click(deleteItem);
    await expect(args.onActionClick).toHaveBeenCalledWith('Delete');
  },
);

// Upstream's "Toggleable actions": clicking the star toggles the favourite
// action (icon only - see the parity note on `isSelected`).
export const Toggle = meta.story({
  name: 'Toggleable actions',
  parameters: {
    docs: {
      description: {
        story:
          'Click the star action to toggle it. Upstream also renders a selected state via `isSelected`, which this port lacks; only the icon swaps.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({ isOn: false });
    const getActions = (isOn: boolean): ToolbarAction[] => [
      {
        text: 'Favourite',
        icon: isOn ? StarFilled : Star,
        size: 'md',
        onClick: () => {
          state.isOn = !state.isOn;
          args.onActionClick('Favourite');
        },
      },
      {
        text: 'Download',
        icon: Download,
        size: 'md',
        onClick: () => args.onActionClick('Download'),
      },
      {
        text: 'Close',
        fixed: true,
        icon: Close,
        size: 'md',
        onClick: () => args.onActionClick('Close'),
      },
    ];

    return <template>
      <Toolbar @overflow={{args.overflow}} @actions={{getActions state.isOn}} />
    </template>;
  },
});

Toggle.test(
  'toggles the favourite icon',
  async ({ canvasElement, userEvent, args }) => {
    const iconMarkup = () =>
      buttonLabelled(canvasElement, 'Favourite').querySelector('svg')
        ?.innerHTML;
    await waitFor(() => expect(iconMarkup()).toBeTruthy());
    const before = iconMarkup();

    await userEvent.click(buttonLabelled(canvasElement, 'Favourite'));
    await expect(args.onActionClick).toHaveBeenCalledWith('Favourite');
    await waitFor(() => expect(iconMarkup()).not.toBe(before));

    await userEvent.click(buttonLabelled(canvasElement, 'Favourite'));
    await waitFor(() => expect(iconMarkup()).toBe(before));
  },
);

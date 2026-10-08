import { trackedObject } from '@ember/reactive/collections';
import { expect, fn as spy } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Add from '../icons/add.ts';
import Link from '../icons/link.ts';
import AiChatChatButton from './chat-button.gts';

import type { AiChatChatButtonSignature } from './chat-button.gts';

// Mirrors `@carbon/ai-chat-components`' `Components/Chat button` stories
// (chat-button/__stories__/chat-button.stories.js). Its `Skeleton` story is
// in `AI Chat/Chat button/Skeleton` (chat-button-skeleton.stories.gts), next
// to `AiChatChatButtonSkeleton`.
//
// Parity gaps (AiChatChatButton wraps this addon's `Button`, not
// `cds-button`):
// - No `href`/`linkRole`, `isExpressive`, `type`, `dangerDescription`, or
//   `tooltipText`/`tooltipAlignment`/`tooltipPosition` args, and no
//   icon-only mode — so upstream's `IconOnly` and `IconOnly (danger)`
//   stories have no equivalent.
// - Only `danger` of upstream's danger kinds (no `danger--tertiary`/
//   `danger--ghost`).
// - The `icon` slot is the default block here: `iconSlot` renders the icon
//   after the text inside the block.

const ICONS = { None: undefined, Add16: Add, Link16: Link } as const;

type StoryArgs = AiChatChatButtonSignature['Args'] & {
  /** Story-only: the button text. */
  buttonText?: string;
  /** Story-only: icon placed in the button after its text. */
  iconSlot?: keyof typeof ICONS;
};

const iconFor = (name: StoryArgs['iconSlot']) => ICONS[name ?? 'None'];

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Chat button',
  component: AiChatChatButton,
  parameters: {
    docs: {
      description: {
        component: `\`AiChatChatButton\` is a button styled for AI Chat surfaces: a taller pill
radius than this addon's plain \`Button\`, plus an \`@isQuickAction\` variant (a
small, outlined chip used for quick-reply-style options) that can be marked
\`@isSelected\` once chosen.

Exported as \`AiChatChatButton\` because Carbon React has its own (not yet
implemented) \`ChatButton\`.`,
      },
    },
  },
  argTypes: {
    iconSlot: { control: 'select', options: Object.keys(ICONS) },
  },
  args: {
    disabled: false,
    iconSlot: 'None',
    buttonText: 'Button',
    onClick: spy(),
  },
  render: (args: StoryArgs) => <template>
    <AiChatChatButton
      @kind={{args.kind}}
      @size={{args.size}}
      @isQuickAction={{args.isQuickAction}}
      @isSelected={{args.isSelected}}
      @disabled={{args.disabled}}
      @onClick={{args.onClick}}
    >
      {{args.buttonText}}
      {{#let (iconFor args.iconSlot) as |Icon|}}
        {{#if Icon}}
          <Icon @size={{16}} @svgClass="cds--btn__icon" />
        {{/if}}
      {{/let}}
    </AiChatChatButton>
  </template>,
});

export const Default = meta.story({
  name: 'Primary (default)',
  args: { kind: 'primary' },
});

Default.test('calls @onClick', async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Button' }));
  await expect(args.onClick).toHaveBeenCalledTimes(1);
});

export const Secondary = meta.story({
  args: { kind: 'secondary' },
});

export const Tertiary = meta.story({
  args: { kind: 'tertiary' },
});

export const Danger = meta.story({
  args: { kind: 'danger' },
});

export const Ghost = meta.story({
  args: { kind: 'ghost' },
});

export const WithIcon = meta.story({
  args: { iconSlot: 'Add16' },
});

export const QuickAction = meta.story({
  args: {
    buttonText: 'Quick action',
    isQuickAction: true,
    isSelected: false,
  },
});

export const QuickActionSelected = meta.story({
  name: 'Quick action (selected)',
  args: {
    buttonText: 'Quick action',
    isQuickAction: true,
    isSelected: true,
  },
});

QuickActionSelected.test(
  'a selected quick action ignores clicks',
  async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('button')!;
    await expect(button).toHaveAttribute('inert');
    button.click();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
);

export const QuickActionSelectedWithDisabled = meta.story({
  name: 'Quick action (selected with disabled)',
  parameters: {
    controls: { disable: true },
    a11y: {
      config: {
        // WCAG 1.4.3 exempts inactive (disabled) controls from contrast
        // minimums.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  render: () => <template>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
      {{#each
        (array
          "audio - mp3"
          "audio - soundcloud"
          "button"
          "card"
          "carousel"
          "code"
          "code (stream)"
          "conversational search"
          "conversational search (stream)"
        )
        as |label|
      }}
        <AiChatChatButton
          @isQuickAction={{true}}
          @isSelected={{eq label "button"}}
          @disabled={{if (eq label "button") false true}}
        >{{label}}</AiChatChatButton>
      {{/each}}
    </div>
  </template>,
});

export const SelectingQuickActions = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'Primary/secondary actions and a group of quick-action chips; the chosen chip is marked `@isSelected`.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({ selected: 'red' });
    const select = (value: string) => {
      state.selected = value;
      args.onClick?.();
    };

    return <template>
      <div style="display: flex; gap: 1rem; margin-block-end: 1rem;">
        <AiChatChatButton @onClick={{fn select "primary"}}>Primary action</AiChatChatButton>
        <AiChatChatButton
          @kind="secondary"
          @onClick={{fn select "secondary"}}
        >Secondary action</AiChatChatButton>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        {{#each (array "red" "green" "blue") as |color|}}
          <AiChatChatButton
            @isQuickAction={{true}}
            @isSelected={{eq state.selected color}}
            @onClick={{fn select color}}
          >{{color}}</AiChatChatButton>
        {{/each}}
      </div>
    </template>;
  },
});

SelectingQuickActions.test(
  'selecting a chip deselects the previous one',
  async ({ canvas, userEvent, args }) => {
    const green = canvas.getByRole('button', { name: 'green' });
    await userEvent.click(green);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(green).toHaveAttribute('data-is-selected');
    await expect(
      canvas.getByRole('button', { name: 'red' }),
    ).not.toHaveAttribute('data-is-selected');
  },
);

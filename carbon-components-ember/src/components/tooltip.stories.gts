import { modifier } from 'ember-modifier';
import { RenderStory } from 'ember-storybook';
import { expect, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import Tooltip, { TooltipAlignments } from './tooltip.gts';
import OverflowMenuVertical from './icons/overflow-menu-vertical.ts';

import type { Args as TooltipArgs } from './tooltip.gts';

// Parity with Carbon React's Tooltip stories (Default, Alignment,
// ExperimentalAutoAlign, Duration): React's `Default` is the
// `IconTrigger` story here; the existing `Default` keeps a plain text
// button. `@autoAlign` only re-checks the alignment when the tooltip opens,
// rather than continuously while scrolling.

const scrollIntoView = modifier((element: HTMLElement) => {
  element.scrollIntoView({ block: 'center', inline: 'center' });
});

const meta = preview.meta({
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          'Tooltips display additional information upon hover or focus. The information should be contextual, useful, and nonessential. A tooltip is attached to the element yielded in its default block and shows after a short delay on hover, or immediately on keyboard focus. Pressing `Escape` dismisses it.\n\nUse `@label` when the tooltip names the trigger (exposed as `aria-labelledby`), or `@description` when it adds extra information (exposed as `aria-describedby`). For rich content, use the `:content` block instead. Placement is controlled with `@align`.',
      },
    },
  },
  argTypes: {
    align: { control: 'select', options: [...TooltipAlignments] },
  },
  args: {
    label: 'Occasionally, services are updated in a specified time window.',
    align: 'bottom',
  },
  // Leave room around the trigger so the popover stays inside the canvas.
  decorators: [
    (Story, context) => <template>
      <div style="padding: 4rem 8rem">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  render: (args) => <template>
    <Tooltip
      @label={{args.label}}
      @align={{args.align}}
      @defaultOpen={{args.defaultOpen}}
      @highContrast={{args.highContrast}}
      @dropShadow={{args.dropShadow}}
    >
      <button class="cds--btn cds--btn--primary" type="button">
        Hover or focus me
      </button>
    </Tooltip>
  </template>,
});

export const Default = meta.story();

export const Open = meta.story({
  args: {
    defaultOpen: true,
  },
});

export const AlignTop = meta.story({
  args: {
    align: 'top',
    defaultOpen: true,
  },
});

Default.test(
  'shows on focus and hides on Escape',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const tooltip = canvasElement.querySelector('[role="tooltip"]')!;
    await expect(tooltip).toHaveAttribute('aria-hidden', 'true');
    await userEvent.tab();
    // `@label` names the trigger, as in Carbon React.
    await expect(
      canvas.getByRole('button', { name: args.label }),
    ).toHaveFocus();
    await waitFor(() =>
      expect(tooltip).toHaveAttribute('aria-hidden', 'false'),
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(tooltip).toHaveAttribute('aria-hidden', 'true'));
  },
);

// Carbon React's Default story: an icon-only button named by the tooltip.
export const IconTrigger = meta.story({
  args: {
    label: 'Options',
    closeOnActivation: false,
  },
  render: (args: TooltipArgs) => <template>
    <Tooltip
      @label={{args.label}}
      @align={{args.align}}
      @closeOnActivation={{args.closeOnActivation}}
    >
      <button
        class="cds--btn cds--btn--ghost cds--btn--icon-only"
        type="button"
      >
        <OverflowMenuVertical @size="16" @svgClass="cds--btn__icon" />
      </button>
    </Tooltip>
  </template>,
});

export const Alignment = meta.story({
  args: {
    label: 'Tooltip alignment',
    align: 'bottom-left',
  },
  render: (args: TooltipArgs) => <template>
    <Tooltip @label={{args.label}} @align={{args.align}}>
      <Button @type="secondary">This button has a tooltip</Button>
    </Tooltip>
  </template>,
});

// `@description` adds extra information (`aria-describedby`) instead of
// naming the trigger.
export const Description = meta.story({
  args: {
    label: undefined,
    description:
      'Occasionally, services are updated in a specified time window to ensure no down time for customers.',
  },
  render: (args: TooltipArgs) => <template>
    <Tooltip @description={{args.description}} @align={{args.align}}>
      <Button @type="secondary">Large text</Button>
    </Tooltip>
  </template>,
});

// The `:content` block renders rich content.
export const CustomContent = meta.story({
  args: {
    align: 'right',
    dropShadow: true,
    highContrast: false,
  },
  render: (args: TooltipArgs) => <template>
    <Tooltip
      @align={{args.align}}
      @dropShadow={{args.dropShadow}}
      @highContrast={{args.highContrast}}
    >
      <:default><Button @type="secondary">Low contrast</Button></:default>
      <:content><strong>Custom</strong> content</:content>
    </Tooltip>
  </template>,
});

// When `@autoAlign` is set, the tooltip flips to the opposite side if it
// would otherwise overflow the viewport (or `@autoAlignBoundary`).
export const ExperimentalAutoAlign = meta.story({
  args: {
    label:
      'Scroll the container up, down, left or right, then hover the button again to observe how the tooltip changes its position in attempt to stay within the viewport.',
    align: 'top',
    autoAlign: true,
  },
  parameters: {
    docs: { story: { inline: false, iframeHeight: '400px' } },
  },
  render: (args: TooltipArgs) => <template>
    <div
      style="display: grid; place-items: center; width: 200vw; min-width: 1200px; height: 200vh; min-height: 1200px;"
    >
      <Tooltip
        @label={{args.label}}
        @align={{args.align}}
        @autoAlign={{args.autoAlign}}
      >
        <Button {{scrollIntoView}}>This button has a tooltip</Button>
      </Tooltip>
    </div>
  </template>,
});

// `@enterDelayMs` and `@leaveDelayMs` control how long the tooltip waits
// before showing and hiding on hover.
export const Duration = meta.story({
  args: {
    label: 'Label one',
    enterDelayMs: 0,
    leaveDelayMs: 300,
  },
  render: (args: TooltipArgs) => <template>
    <Tooltip
      @label={{args.label}}
      @align={{args.align}}
      @enterDelayMs={{args.enterDelayMs}}
      @leaveDelayMs={{args.leaveDelayMs}}
    >
      <Button>This button has a tooltip</Button>
    </Tooltip>
  </template>,
});

Duration.test(
  'shows on hover and hides after the leave delay',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const tooltip = canvasElement.querySelector('[role="tooltip"]')!;
    const trigger = canvas.getByRole('button', { name: args.label });
    await userEvent.hover(trigger);
    await waitFor(() =>
      expect(tooltip).toHaveAttribute('aria-hidden', 'false'),
    );
    await userEvent.unhover(trigger);
    await waitFor(() => expect(tooltip).toHaveAttribute('aria-hidden', 'true'));
  },
);

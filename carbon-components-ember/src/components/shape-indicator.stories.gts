import { htmlSafe } from '@ember/template';
import { expect, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ShapeIndicator, { ShapeIndicatorKinds } from './shape-indicator.gts';

import type { ShapeIndicatorKind } from './shape-indicator.gts';

// Carbon React parity gaps:
// - `align` and `autoAlign` (placement of the compact-mode tooltip) aren't
//   supported: Ember's ShapeIndicator always places its tooltip on top.

// "cautious" -> "Cautious", matching Carbon React's story labels.
const KINDS = ShapeIndicatorKinds.map((kind) => ({
  kind,
  label: kind.charAt(0).toUpperCase() + kind.slice(1),
}));

const columnStyle = htmlSafe(
  'display: inline-flex; flex-flow: column; row-gap: .5rem;',
);

// The parity stories render every kind from the list above; the `kind` and
// `label` args only drive the single-indicator `Compact` story. (Typed as the
// union, not widened to `string`, so stories don't have to repeat the
// required arg.)
const meta = preview.meta({
  title: 'Preview/StatusIndicators/preview__ShapeIndicator',
  component: ShapeIndicator,
  parameters: {
    docs: {
      description: {
        component:
          'Shape indicators can take the form of failed, critical, high, medium, low, cautious, undefined, stable, informative, incomplete, and draft. They are useful for conveying status where color alone would not be accessible.',
      },
    },
  },
  argTypes: {
    compact: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
    kind: { control: false },
    shapeDescription: { control: { type: 'text' } },
    textSize: { control: { type: 'select' }, options: [12, 14] },
  },
  args: {
    kind: 'failed' as ShapeIndicatorKind,
    label: 'Failed',
  },
  render: (args) => <template>
    <div style={{columnStyle}}>
      {{#each KINDS as |k|}}
        <ShapeIndicator
          @kind={{k.kind}}
          @label={{k.label}}
          @compact={{args.compact}}
          @shapeDescription={{args.shapeDescription}}
          @textSize={{args.textSize}}
        />
      {{/each}}
    </div>
  </template>,
});

export const Default = meta.story({
  args: {
    compact: false,
    shapeDescription: 'Shape',
    textSize: 12,
  },
});

export const DefaultWithTextSize14 = meta.story({
  args: {
    compact: false,
    shapeDescription: 'Shape',
    textSize: 14,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shape indicators have two text size options, 12 (default) and 14.',
      },
    },
  },
});

export const Compact = meta.story({
  args: {
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `@compact` is `true`, the shape indicator displays only the shape, with the label shown in a tooltip on hover/focus. `@shapeDescription` overrides the accessible name (defaults to `@label`).',
      },
    },
  },
  render: (args) => <template>
    <ShapeIndicator
      @kind={{args.kind}}
      @label={{args.label}}
      @compact={{args.compact}}
      @shapeDescription={{args.shapeDescription}}
      @textSize={{args.textSize}}
    />
  </template>,
});

Compact.test(
  'shows the label in a tooltip on focus',
  async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvasElement.querySelector<HTMLElement>(
      '.cds--shape-indicator__button',
    )!;
    // Only the always-present, visually hidden description exists at rest.
    await expect(canvas.getAllByText('Failed')).toHaveLength(2);

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await waitFor(() => expect(canvas.getAllByText('Failed')).toHaveLength(3));

    await userEvent.tab();
    await waitFor(() => expect(canvas.getAllByText('Failed')).toHaveLength(2));
  },
);

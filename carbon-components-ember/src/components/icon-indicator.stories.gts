import { htmlSafe } from '@ember/template';
import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import IconIndicator, {
  IconIndicatorAlignments,
  IconIndicatorKinds,
} from './icon-indicator.gts';

import type { IconIndicatorKind } from './icon-indicator.gts';

// Carbon React parity gaps: none. (React's `className` is covered by
// Ember's `...attributes`.)

// "caution-major" -> "Caution major", matching Carbon React's story labels.
const KINDS = IconIndicatorKinds.map((kind) => {
  const words = kind.replace('-', ' ');
  return { kind, label: words.charAt(0).toUpperCase() + words.slice(1) };
});

const columnStyle = htmlSafe(
  'display: inline-flex; flex-flow: column; row-gap: .5rem;',
);

// The parity stories render every kind from the list above; the `kind` and
// `label` args only drive the single-indicator `Compact` story. (Typed as the
// union, not widened to `string`, so stories don't have to repeat the
// required arg.)
const meta = preview.meta({
  title: 'Preview/StatusIndicators/preview__IconIndicator',
  component: IconIndicator,
  parameters: {
    docs: {
      description: {
        component:
          'Icon indicators pair a status icon with a label to communicate the state of an item. They support the kinds `failed`, `caution-major`, `caution-minor`, `undefined`, `succeeded`, `normal`, `in-progress`, `incomplete`, `not-started`, `pending`, `unknown`, and `informative`.',
      },
    },
  },
  argTypes: {
    align: { control: { type: 'select' }, options: IconIndicatorAlignments },
    autoAlign: { control: { type: 'boolean' } },
    compact: { control: { type: 'boolean' } },
    iconDescription: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    kind: { control: false },
    size: { control: { type: 'select' }, options: [16, 20] },
  },
  args: {
    kind: 'failed' as IconIndicatorKind,
    label: 'Failed',
  },
  render: (args) => <template>
    <div style={{columnStyle}}>
      {{#each KINDS as |k|}}
        <IconIndicator
          @kind={{k.kind}}
          @label={{k.label}}
          @align={{args.align}}
          @autoAlign={{args.autoAlign}}
          @compact={{args.compact}}
          @iconDescription={{args.iconDescription}}
          @size={{args.size}}
        />
      {{/each}}
    </div>
  </template>,
});

export const Default = meta.story({
  args: {
    align: 'right',
    autoAlign: false,
    iconDescription: 'Icon',
    compact: false,
    size: 16,
  },
});

export const DefaultWithSize20 = meta.story({
  args: {
    align: 'top',
    autoAlign: true,
    compact: false,
    size: 20,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Icon indicators have two size options, 16 (default) and 20. `@autoAlign` can be used to keep the compact-mode tooltip within the viewport, flipping to the opposite side when it would otherwise overflow.',
      },
    },
  },
});

export const Compact = meta.story({
  args: {
    iconDescription: 'Build failed',
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `@compact` is `true`, the icon indicator displays only the icon, with the label shown in a tooltip on hover/focus. Use `@iconDescription` to provide a different accessible name than `@label`.',
      },
    },
  },
  render: (args) => <template>
    <IconIndicator
      @kind={{args.kind}}
      @label={{args.label}}
      @align={{args.align}}
      @autoAlign={{args.autoAlign}}
      @compact={{args.compact}}
      @iconDescription={{args.iconDescription}}
      @size={{args.size}}
    />
  </template>,
});

Compact.test(
  'shows the label in a definition tooltip on hover',
  async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Build failed' });
    const definition = canvasElement.ownerDocument.getElementById(
      trigger.getAttribute('aria-describedby')!,
    );
    await expect(definition).toHaveTextContent('Failed');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.hover(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.unhover(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
);

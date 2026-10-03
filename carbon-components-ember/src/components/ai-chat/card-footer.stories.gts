import { htmlSafe } from '@ember/template';
import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ArrowRight from '../icons/arrow-right.ts';
import Download from '../icons/download.ts';
import Edit from '../icons/edit.ts';
import Launch from '../icons/launch.ts';
import Maximize from '../icons/maximize.ts';
import TrashCan from '../icons/trash-can.ts';
import View from '../icons/view.ts';
import AiChatCard from './card.gts';
import AiChatCardFooter from './card-footer.gts';

import type {
  Args as CardFooterArgs,
  CardFooterAction,
} from './card-footer.gts';

// Upstream has no stories file of its own for `cds-aichat-card-footer`: it's
// the `CardFooter` story in `Components/Card` (card/__stories__/
// card.stories.js). It's mirrored here, next to the component, as
// `AI Chat/Card/Card Footer`.
//
// Parity gaps:
// - No `size` arg (upstream's `footerSize` `md`/`lg`) and no per-action
//   `payload`.
//
// Known bug: an action with `kind: 'danger'` is rendered as `Button
// @type='danger'`, which opens `Button`'s own confirm dialog instead of
// calling `@onAction` (AiChatChatButton had the same bug and was fixed by
// applying `cds--btn--danger` itself). The tests click non-danger actions.

// upstream card/__stories__/story-data.js `cardFooterPresets` and
// `previewCardFooterPresets`, minus `payload`.
const PRESETS: Record<string, CardFooterAction[] | undefined> = {
  'primary danger buttons': [
    { id: 'primary', label: 'Primary', kind: 'primary' },
    { id: 'danger', label: 'Danger', kind: 'danger' },
  ],
  'ghost button with icon': [
    { id: 'docs', label: 'View carbon docs', kind: 'ghost', icon: Launch },
  ],
  'secondary button': [
    { id: 'secondary', label: 'Secondary', kind: 'secondary', icon: Launch },
  ],
  '3 ghost buttons vertical': [
    { id: 'docs1', label: 'View Carbon Docs 1', kind: 'ghost', icon: Launch },
    { id: 'docs2', label: 'View Carbon Docs 2', kind: 'ghost', icon: Launch },
    { id: 'docs3', label: 'View Carbon Docs 3', kind: 'ghost', icon: Launch },
  ],
  'primary button': [{ id: 'primary', label: 'Primary', kind: 'primary' }],
  'primary button with icon': [
    { id: 'primary-icon', label: 'Primary', kind: 'primary', icon: ArrowRight },
  ],
  'danger button': [{ id: 'danger', label: 'Danger', kind: 'danger' }],
  'ghost button': [{ id: 'ghost', label: 'Ghost', kind: 'ghost' }],
  'secondary primary buttons': [
    { id: 'secondary', label: 'Secondary', kind: 'secondary' },
    { id: 'primary', label: 'Primary', kind: 'primary' },
  ],
  '2 ghost icon buttons': [
    {
      id: 'ghost 1',
      label: '',
      kind: 'ghost',
      tooltipText: 'Download',
      icon: Download,
    },
    {
      id: 'ghost 2',
      label: '',
      kind: 'ghost',
      tooltipText: 'Maximize',
      icon: Maximize,
    },
  ],
  '1 ghost button with icon': [
    { id: 'docs', label: 'View details', kind: 'ghost', icon: Maximize },
  ],
  '1 ghost button with disabled state': [
    {
      id: 'docs',
      label: 'View details',
      kind: 'ghost',
      icon: Maximize,
      disabled: true,
    },
  ],
  '1 ghost button with viewing state': [
    {
      id: 'docs',
      label: 'Viewing',
      kind: 'ghost',
      icon: View,
      isViewing: true,
    },
  ],
  none: undefined,
};

const MAX_WIDTHS = {
  unset: 'none',
  sm: '291px',
  md: '438px',
  lg: '535px',
} as const;

type StoryArgs = CardFooterArgs & {
  /** Story-only: preset `@actions`. */
  footerActions?: string;
  /** Story-only: max width of the story wrapper. */
  maxWidth?: keyof typeof MAX_WIDTHS;
  /** Story-only: sets `--cds-aichat-border-radius: 8px` on the footer. */
  borderRadius?: boolean;
};

const wrapperStyle = (maxWidth: StoryArgs['maxWidth']) =>
  htmlSafe(`max-width: ${MAX_WIDTHS[maxWidth ?? 'unset']}`);
const presetFor = (name: string | undefined) =>
  name ? PRESETS[name] : undefined;
const borderRadiusStyle = (on: boolean | undefined) =>
  htmlSafe(on ? '--cds-aichat-border-radius: 8px;' : '');

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Card/Card Footer',
  component: AiChatCardFooter,
  parameters: {
    docs: {
      description: {
        component: `\`AiChatCardFooter\` renders a row of action buttons for an
\`AiChatCard\`'s \`<:footer>\` block, driven entirely by an \`@actions\` array
rather than yielded content. When every action's \`label\` is empty, it
switches to a row of icon-only ghost buttons instead of labeled buttons —
matching upstream's own derivation. Each action's \`kind\` maps onto this
addon's \`Button\` component (\`'primary'\`, \`'secondary'\`, \`'tertiary'\`,
\`'ghost'\`, or \`'danger'\`); \`@onAction\` is called with the clicked action
whenever a button is pressed.`,
      },
    },
  },
  argTypes: {
    footerActions: { control: 'select', options: Object.keys(PRESETS) },
    maxWidth: { control: 'radio', options: Object.keys(MAX_WIDTHS) },
  },
  args: {
    footerActions: 'primary danger buttons',
    maxWidth: 'sm',
    borderRadius: false,
    onAction: fn(),
  },
  render: (args) => <template>
    <div style={{wrapperStyle args.maxWidth}}>
      <AiChatCardFooter
        style={{borderRadiusStyle args.borderRadius}}
        @actions={{presetFor args.footerActions}}
        @onAction={{args.onAction}}
      />
    </div>
  </template>,
});

export const CardFooter = meta.story();

CardFooter.test(
  'calls @onAction with the clicked action',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Primary' }));
    await expect(args.onAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'primary', label: 'Primary' }),
    );
  },
);

export const IconButtons = meta.story({
  args: { footerActions: '2 ghost icon buttons' },
  parameters: {
    // Known violations in the shared `Tooltip` wrapping each icon-only
    // button: `aria-prohibited-attr` (aria-labelledby on its role-less
    // trigger span) and `button-name` (the label never names the button).
    a11y: { test: 'todo' },
  },
});

export const DisabledAction = meta.story({
  args: { footerActions: '1 ghost button with disabled state' },
  parameters: {
    a11y: {
      config: {
        // WCAG 1.4.3 exempts inactive (disabled) controls from contrast
        // minimums.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
});

export const ViewingAction = DisabledAction.extend({
  args: { footerActions: '1 ghost button with viewing state' },
});

export const InACard = meta.story({
  parameters: {
    // Known violations in the shared `Tooltip` wrapping each icon-only
    // button: `aria-prohibited-attr` (aria-labelledby on its role-less
    // trigger span) and `button-name` (the label never names the button).
    a11y: { test: 'todo' },
    docs: {
      description: {
        story:
          'Labeled actions and icon-only actions (no `label`; each icon button is wrapped in a `Tooltip` using `tooltipText`) inside an `AiChatCard`, reporting the last action.',
      },
    },
  },
  render: (args) => {
    const state = trackedObject({ last: '(none yet)' });
    const handleAction = (action: CardFooterAction) => {
      state.last = action.label || action.id;
      args.onAction?.(action);
    };
    const labeledActions: CardFooterAction[] = [
      { id: 'accept', label: 'Accept', kind: 'primary' },
      { id: 'reject', label: 'Reject', kind: 'secondary' },
    ];
    const iconActions: CardFooterAction[] = [
      { id: 'edit', label: '', icon: Edit, tooltipText: 'Edit' },
      {
        id: 'delete',
        label: '',
        icon: TrashCan,
        tooltipText: 'Delete',
        kind: 'danger',
      },
    ];

    return <template>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <AiChatCard style="max-inline-size: 18rem;">
          <:header><h5>Confirm action</h5></:header>
          <:body>Do you want to proceed?</:body>
          <:footer>
            <AiChatCardFooter
              @actions={{labeledActions}}
              @onAction={{handleAction}}
            />
          </:footer>
        </AiChatCard>
        <AiChatCard style="max-inline-size: 18rem;">
          <:header><h5>Icon actions</h5></:header>
          <:body>Actions with no label render as icon-only buttons.</:body>
          <:footer>
            <AiChatCardFooter
              @actions={{iconActions}}
              @onAction={{handleAction}}
            />
          </:footer>
        </AiChatCard>
      </div>
      <p>last action: <output>{{state.last}}</output></p>
    </template>;
  },
});

InACard.test(
  'reports labeled and icon-only actions',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Accept' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Accept');
    await expect(args.onAction).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'accept' }),
    );

    // The icon-only buttons have no accessible name (see the a11y todo):
    // Accept, Reject, then Edit, Delete.
    await userEvent.click(canvas.getAllByRole('button')[2]!);
    await expect(canvas.getByRole('status')).toHaveTextContent('edit');
    await expect(args.onAction).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'edit' }),
    );
  },
);

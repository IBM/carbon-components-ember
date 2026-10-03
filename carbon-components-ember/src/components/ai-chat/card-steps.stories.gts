import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';
import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import { IconIndicatorKinds } from '../icon-indicator.gts';
import Download from '../icons/download.ts';
import Maximize from '../icons/maximize.ts';
import Share from '../icons/share.ts';
import Version from '../icons/version.ts';
import View from '../icons/view.ts';
import AiChatCard from './card.gts';
import AiChatCardFooter from './card-footer.gts';
import AiChatCardSteps from './card-steps.gts';
import Toolbar from './toolbar.gts';

import type Owner from '@ember/owner';
import type { IconIndicatorKind } from '../icon-indicator.gts';
import type { CardFooterAction } from './card-footer.gts';
import type { Args as CardStepsArgs, CardStep } from './card-steps.gts';
import type { ToolbarAction } from './toolbar.gts';

// Mirrors `@carbon/ai-chat-components`' `Components/Card/Preview Card`
// stories (card/__stories__/preview-card.stories.js), which is where upstream
// documents `cds-aichat-card-steps` (its `CardSteps` and `WithSteps` stories).
//
// Parity gaps:
// - Upstream's `aiLabel` control renders a Carbon `cds-ai-label` in the
//   card's/toolbar's `decorator` slot. This addon has no AILabel component,
//   so the decorator is omitted.
// - `AiChatCardFooter` has no `size` arg (upstream passes `size="md"`).

const MAX_WIDTHS = {
  unset: 'none',
  sm: '291px',
  md: '438px',
  lg: '535px',
} as const;

// upstream card/__stories__/story-data.js `previewCardFooterPresets`.
const PREVIEW_FOOTER_PRESETS: Record<string, CardFooterAction[] | undefined> = {
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

type StoryArgs = CardStepsArgs & {
  /** Story-only: `AiChatCard`'s `@isLayered`. */
  isLayered?: boolean;
  /** Story-only: `AiChatCard`'s `@isFlush`. */
  isFlush?: boolean;
  /** Story-only: max width of the story wrapper. */
  maxWidth?: keyof typeof MAX_WIDTHS;
  /** Story-only: preset footer actions. */
  footerActions?: string;
  /** Story-only: called with the clicked footer action. */
  onAction?: (action: CardFooterAction) => void;
  /** Story-only: called with the clicked toolbar action's text. */
  onToolbarAction?: (text: string) => void;
  /** Story-only (`CardSteps`): number of steps rendered. */
  numberOfSteps?: number;
  /** Story-only (`CardSteps`): label of each step. */
  label?: string;
  /** Story-only (`CardSteps`): kind of each step (`none` for no indicator). */
  kind?: IconIndicatorKind | 'none';
  /** Story-only (`CardSteps`): title of each step. */
  title?: string;
  /** Story-only (`CardSteps`): description of each step. */
  description?: string;
};

const wrapperStyle = (maxWidth: StoryArgs['maxWidth']) =>
  htmlSafe(`max-width: ${MAX_WIDTHS[maxWidth ?? 'unset']}`);
const footerFor = (name: string | undefined) =>
  name ? PREVIEW_FOOTER_PRESETS[name] : undefined;

const toolbarActionsFor = (
  onClick: StoryArgs['onToolbarAction'],
): ToolbarAction[] =>
  [
    { text: 'Version', icon: Version },
    { text: 'Download', icon: Download },
    { text: 'Share', icon: Share },
    { text: 'Maximize', icon: Maximize },
  ].map((action) => ({
    ...action,
    size: 'md' as const,
    onClick: () => onClick?.(action.text),
  }));

const PreviewHeading = <template>
  <h4 style="margin: 0 0 0.125rem;">Document title</h4>
  <p style="margin: 0; color: var(--cds-text-secondary);">Subtitle</p>
</template>;

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Card/Preview Card',
  component: AiChatCardSteps,
  parameters: {
    docs: {
      description: {
        component: `\`AiChatCardSteps\` renders a vertical list of steps — e.g. an
agent's reasoning or progress trail — for use inside an \`AiChatCard\`'s
\`<:body>\` block. Each step's \`kind\` is one of \`IconIndicator\`'s kinds
(\`'failed'\`, \`'caution-major'\`, \`'caution-minor'\`, \`'undefined'\`,
\`'succeeded'\`, \`'normal'\`, \`'in-progress'\`, \`'incomplete'\`,
\`'not-started'\`, \`'pending'\`, \`'unknown'\`, \`'informative'\`);
\`'in-progress'\` renders a spinner instead of an icon. A step with no
\`kind\` renders only its \`label\`.

The other stories here mirror upstream's preview-card compositions of
\`AiChatCard\`, \`AiChatCardFooter\`, \`Toolbar\` and \`AiChatCardSteps\`.`,
      },
    },
  },
  argTypes: {
    maxWidth: { control: 'radio', options: Object.keys(MAX_WIDTHS) },
    footerActions: {
      control: 'select',
      options: Object.keys(PREVIEW_FOOTER_PRESETS),
    },
    kind: { control: 'select', options: [...IconIndicatorKinds, 'none'] },
    numberOfSteps: { control: { type: 'number', min: 1, max: 10 } },
  },
  args: {
    isLayered: false,
    isFlush: true,
    maxWidth: 'sm',
    footerActions: '2 ghost icon buttons',
    onAction: fn(),
    onToolbarAction: fn(),
  },
  render: (args) => <template>
    <div style={{wrapperStyle args.maxWidth}}>
      <AiChatCard @isLayered={{args.isLayered}} @isFlush={{args.isFlush}}>
        <:body>
          <div style="padding: 1rem;"><PreviewHeading /></div>
        </:body>
        <:footer>
          <AiChatCardFooter
            @actions={{footerFor args.footerActions}}
            @onAction={{args.onAction}}
          />
        </:footer>
      </AiChatCard>
    </div>
  </template>,
});

export const Small = meta.story({
  parameters: {
    // Known violations in the shared `Tooltip` wrapping each icon-only
    // button: `aria-prohibited-attr` (aria-labelledby on its role-less
    // trigger span) and `button-name` (the label never names the button).
    a11y: { test: 'todo' },
  },
});

export const Default = meta.story({
  args: {
    footerActions: '1 ghost button with icon',
    maxWidth: 'lg',
  },
  render: (args) => <template>
    <div style={{wrapperStyle args.maxWidth}}>
      <AiChatCard @isLayered={{args.isLayered}} @isFlush={{args.isFlush}}>
        <:header>
          <div
            style="padding: 1rem; border-block-end: 1px solid var(--cds-border-subtle);"
          >
            <PreviewHeading />
            <p style="margin: 0; color: var(--cds-text-secondary);">Subtitle</p>
          </div>
        </:header>
        <:body><div style="block-size: 8rem;"></div></:body>
        <:footer>
          <AiChatCardFooter
            @actions={{footerFor args.footerActions}}
            @onAction={{args.onAction}}
          />
        </:footer>
      </AiChatCard>
    </div>
  </template>,
});

export const WithToolbar = meta.story({
  args: {
    maxWidth: 'lg',
    footerActions: 'none',
  },
  parameters: {
    // Known violations in the shared `Tooltip` wrapping each toolbar
    // action: `aria-prohibited-attr` (aria-labelledby on its role-less
    // trigger span) and `button-name` (the label never names the button).
    a11y: { test: 'todo' },
  },
  render: (args) => <template>
    <div style={{wrapperStyle args.maxWidth}}>
      <AiChatCard @isLayered={{args.isLayered}} @isFlush={{args.isFlush}}>
        <:header>
          <Toolbar
            style="border-block-end: 1px solid var(--cds-border-subtle);"
            @overflow={{true}}
            @actions={{toolbarActionsFor args.onToolbarAction}}
          >
            <:title>
              <h4 style="margin: 0;">Resource consumption</h4>
            </:title>
          </Toolbar>
        </:header>
        <:body><div style="block-size: 8rem;"></div></:body>
        <:footer>
          <AiChatCardFooter
            @actions={{footerFor args.footerActions}}
            @onAction={{args.onAction}}
          />
        </:footer>
      </AiChatCard>
    </div>
  </template>,
});

const STEP_TIMES = [3000, 1000, 500, 4000, 2000];

/**
 * Advances upstream's five inventory steps one by one on a timer, like
 * upstream's `WithSteps` story does.
 */
class ProgressingSteps extends Component<{
  Blocks: { default: [steps: CardStep[], status: string] };
}> {
  state = trackedObject<{ steps: CardStep[]; status: string }>({
    status: 'running',
    steps: [
      'Estimate inventory needs in all locations',
      'Identify locations with excess inventory',
      'Prepare multiple rebalancing scenarios',
      'Rank rebalancing scenarios for speed and cost',
      'Prepare recommendations',
    ].map((title, index) => ({
      label: `Step ${index + 1}`,
      title,
      kind: index === 0 ? 'in-progress' : 'not-started',
      description: index === 0 ? 'In progress...' : 'Not started',
    })),
  });

  timer?: ReturnType<typeof setTimeout>;

  constructor(owner: Owner, args: object) {
    super(owner, args);
    this.schedule(0);
    registerDestructor(this, () => clearTimeout(this.timer));
  }

  schedule(current: number) {
    this.timer = setTimeout(() => this.proceed(current), STEP_TIMES[current]);
  }

  proceed(current: number) {
    const steps = [...this.state.steps];
    steps[current] = {
      ...steps[current]!,
      kind: 'succeeded',
      description: 'Completed successfully',
    };
    const next = current + 1;
    if (steps[next]) {
      steps[next] = {
        ...steps[next],
        kind: 'in-progress',
        description: 'In progress...',
      };
      this.schedule(next);
    } else {
      this.state.status = 'completed';
    }
    this.state.steps = steps;
  }

  <template>{{yield this.state.steps this.state.status}}</template>
}

export const WithSteps = meta.story({
  args: {
    maxWidth: 'lg',
    footerActions: '1 ghost button with icon',
  },
  render: (args) => <template>
    <div style={{wrapperStyle args.maxWidth}}>
      <ProgressingSteps as |steps status|>
        <AiChatCard @isLayered={{args.isLayered}} @isFlush={{args.isFlush}}>
          <:header>
            <Toolbar
              style="border-block-end: 1px solid var(--cds-border-subtle);"
            >
              <:title>
                <div style="padding: 0.75rem 0.125rem;">
                  <h4 style="margin: 0;">Optimising excess inventory</h4>
                  <p style="margin: 0; color: var(--cds-text-secondary);">
                    Status:
                    {{status}}
                  </p>
                </div>
              </:title>
            </Toolbar>
          </:header>
          <:body>
            <div style="padding: 1rem;">
              <AiChatCardSteps @steps={{steps}} />
            </div>
          </:body>
          <:footer>
            <AiChatCardFooter
              @actions={{footerFor args.footerActions}}
              @onAction={{args.onAction}}
            />
          </:footer>
        </AiChatCard>
      </ProgressingSteps>
    </div>
  </template>,
});

const stepsFor = (args: StoryArgs): CardStep[] =>
  Array.from({ length: args.numberOfSteps ?? 1 }, () => ({
    label: args.label,
    kind: args.kind === 'none' ? undefined : args.kind,
    title: args.title ?? '',
    description: args.description,
  }));

export const CardSteps = meta.story({
  args: {
    numberOfSteps: 1,
    maxWidth: 'lg',
    label: 'Step 1',
    kind: 'in-progress',
    title: 'Estimate inventory needs in all locations',
    description: 'In progress...',
  },
  render: (args) => <template>
    <div style={{wrapperStyle args.maxWidth}}>
      <AiChatCardSteps @steps={{stepsFor args}} />
    </div>
  </template>,
});

export const AgentProgress = meta.story({
  args: {
    steps: [
      { title: 'Understanding request', kind: 'succeeded' },
      {
        title: 'Searching knowledge base',
        description: 'Checking 12 sources',
        kind: 'in-progress',
        label: 'Running',
      },
      { title: 'Drafting response', kind: 'not-started' },
      { title: 'Plain step with no indicator' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "`AiChatCardSteps` inside an `AiChatCard`'s `<:body>` block, mixing kinds, an in-progress spinner and a step with no indicator.",
      },
    },
  },
  render: (args) => <template>
    <AiChatCard style="max-inline-size: 24rem;">
      <:header><h5>Agent progress</h5></:header>
      <:body>
        <AiChatCardSteps @steps={{args.steps}} />
      </:body>
    </AiChatCard>
  </template>,
});

AgentProgress.test(
  'renders every step with its title and description',
  async ({ canvas }) => {
    await expect(canvas.getByText('Understanding request')).toBeVisible();
    await expect(canvas.getByText('Checking 12 sources')).toBeVisible();
    await expect(
      canvas.getByText('Plain step with no indicator'),
    ).toBeVisible();
  },
);

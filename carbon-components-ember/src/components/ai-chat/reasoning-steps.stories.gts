import { fn as fnHelper } from '@ember/helper';
import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import Markdown from './markdown.gts';
import ReasoningSteps from './reasoning-steps.gts';

import type { Args as ReasoningStepsArgs } from './reasoning-steps.gts';

// Mirrors `@carbon/ai-chat-components`' `reasoning-steps.stories.js`
// (`Components/Reasoning steps`: Default, WithStaticSteps, Controlled) AND
// `reasoning-step.stories.js` (`Components/Reasoning steps/Step`: Default,
// Static). `ReasoningStep` isn't exported from its own file - it's only
// reachable as the component `ReasoningSteps` yields - and CSF allows one
// meta per file, so upstream's Step stories live here as `StepDefault` and
// `StepStatic` instead of under their own `.../Step` title.
//
// docs-app demos: the first demo (an open list of two steps) is covered by
// `Default`; the "Controlled steps" demo (`@controlled` + per-step
// `@open`/`@onToggle` owned by the host) is covered by `Controlled`.
//
// Parity gaps (not faked):
// - Upstream seeds an *uncontrolled* step's initial state from its `open`
//   attribute (its Default story starts with the first step expanded). The
//   Ember `ReasoningStep` ignores `@open` unless `@controlled` is set, so
//   every uncontrolled step here starts collapsed.
// - Upstream's `cds-aichat-reasoning-step-toggled` event bubbles to the
//   container; the Ember port has no container-level toggle callback, so
//   each step gets its own `@onToggle` (wired to the `onToggle` action).
// - Upstream marks collapsed steps `inert`; not reproduced (see the
//   component's class doc).
// - Upstream's `carbonTheme` arg isn't ported: the Storybook toolbar's
//   theme switcher applies Carbon's theme classes instead.

type StoryArgs = ReasoningStepsArgs & {
  /** Story-only: called by every step's `@onToggle`. */
  onToggle: (open: boolean) => void;
  /** Story-only (`StepDefault`): the step's title. */
  stepTitle?: string;
  /** Story-only (`StepDefault`): the step's `@open`, honored when `controlled`. */
  stepOpen?: boolean;
};

type Step = { id: string; title: string; body?: string };

const defaultSteps: Step[] = [
  {
    id: 'understand',
    title: 'Understand the request',
    body: "Parsed the user's intent and restated it as a concise objective to make sure downstream steps share the same goal.",
  },
  {
    id: 'review',
    title: 'Review retrieved context',
    body: 'Checked the documents and conversation history to identify facts that are relevant to the objective and noted confidence levels.',
  },
  {
    id: 'draft',
    title: 'Draft an answer',
    body: 'Combined the prompt with trusted context and generated a structured response with bullet points summarizing each insight.',
  },
  {
    id: 'validate',
    title: 'Validate the response',
    body: 'Compared the answer with the original request, double-checked citations, and ensured tone guidelines were followed.',
  },
];

const mixedSteps: Step[] = [
  {
    id: 'missing-data',
    title: 'Detect missing data',
    body: 'Noticed the prompt referenced an attachment that was not available, so I documented the gap before drafting an answer.',
  },
  { id: 'citations', title: 'Awaiting supporting citations' },
  {
    id: 'escalation',
    title: 'Ready for escalation',
    body: 'The final recommendation needs human approval. I summarized the findings and highlighted the open questions to review.',
  },
];

const controlledSteps: Step[] = [
  {
    id: 'gather-context',
    title: 'Gather relevant context',
    body: 'Pulled customer profile data, product catalog entries, and the latest troubleshooting articles that match the request.',
  },
  {
    id: 'draft-plan',
    title: 'Draft plan',
    body: "Proposed a three-step plan that addresses the user's main objective while calling out any assumptions.",
  },
  {
    id: 'risk-check',
    title: 'Run risk checks',
    body: '- Verified we are not leaking PII.\n- Ensured rate limits are respected.\n- Confirmed tone aligns with support guidelines.',
  },
  { id: 'handoff', title: 'Ready for human review' },
];

const stepBody =
  'Validated supporting documents, captured relevant citations, and noted confidence levels before drafting a response.';

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Reasoning steps',
  component: ReasoningSteps,
  parameters: {
    docs: {
      description: {
        component: `Displays a list of reasoning steps. Supports auto-open/close behavior or fully controlled state managed by the host.

\`ReasoningSteps\` and its yielded \`ReasoningStep\` render a collapsible list of model-reasoning steps for [Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat) — the same disclosure shape as \`ChainOfThought\`, but without step numbering or status icons. A step without body content renders a static (non-interactive) header.

Passing \`@controlled={{true}}\` to \`ReasoningSteps\` propagates \`@controlled\` to every yielded step: each step's own \`@open\` becomes the sole source of truth, and a click only calls \`@onToggle\`.

The \`Step*\` stories mirror upstream's separate \`Reasoning steps/Step\` stories: \`ReasoningStep\` is only available as the component \`ReasoningSteps\` yields.`,
      },
    },
  },
  args: {
    open: true,
    controlled: false,
    onToggle: fn(),
  },
  // Annotated: otherwise `render` is typed with the component's inferred
  // args instead of the story-only ones declared via `preview.type()`.
  render: (args: StoryArgs) => <template>
    <ReasoningSteps
      @open={{args.open}}
      @controlled={{args.controlled}}
      as |ReasoningStep|
    >
      {{#each defaultSteps as |step|}}
        <ReasoningStep @title={{step.title}} @onToggle={{args.onToggle}}>
          <Markdown @markdown={{step.body}} />
        </ReasoningStep>
      {{/each}}
    </ReasoningSteps>
  </template>,
});

export const Default = meta.story();

Default.test(
  'expands and collapses a step on click',
  async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole('button', {
      name: 'Review retrieved context',
    });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onToggle).toHaveBeenLastCalledWith(true);
    await expect(
      canvas.getByRole('region', { name: 'Review retrieved context' }),
    ).toHaveTextContent('Checked the documents');

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(args.onToggle).toHaveBeenLastCalledWith(false);
  },
);

Default.test(
  'Escape collapses an open step',
  async ({ canvas, userEvent, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Draft an answer' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(args.onToggle).toHaveBeenLastCalledWith(false);
  },
);

export const WithStaticSteps = meta.story({
  render: (args) => <template>
    <ReasoningSteps
      @open={{args.open}}
      @controlled={{args.controlled}}
      as |ReasoningStep|
    >
      {{#each mixedSteps as |step|}}
        {{#if step.body}}
          <ReasoningStep @title={{step.title}} @onToggle={{args.onToggle}}>
            <Markdown @markdown={{step.body}} />
          </ReasoningStep>
        {{else}}
          <ReasoningStep @title={{step.title}} />
        {{/if}}
      {{/each}}
    </ReasoningSteps>
  </template>,
});

WithStaticSteps.test(
  'renders a step without body content as a static header',
  async ({ canvas }) => {
    await expect(
      canvas.queryByRole('button', { name: 'Awaiting supporting citations' }),
    ).toBeNull();
    await expect(
      canvas.getByText('Awaiting supporting citations'),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Ready for escalation' }),
    ).toBeVisible();
  },
);

// Upstream's `ControlledReasoningStepsDemo`: the host owns every step's open
// state plus the wrapper's, and drives them from its own buttons.
export const Controlled = meta.story({
  args: {
    controlled: true,
  },
  render: (args) => {
    const state = trackedObject<{ openIds: string[]; wrapperOpen: boolean }>({
      openIds: ['gather-context'],
      wrapperOpen: true,
    });
    const isOpen = (id: string) => state.openIds.includes(id);
    const toggleStep = (id: string, open: boolean) => {
      state.openIds = open
        ? [...state.openIds, id]
        : state.openIds.filter((openId) => openId !== id);
      args.onToggle(open);
    };
    const openAll = () => {
      state.openIds = controlledSteps
        .filter((step) => step.body)
        .map((step) => step.id);
    };
    const collapseAll = () => {
      state.openIds = [];
    };
    const toggleWrapper = () => {
      state.wrapperOpen = !state.wrapperOpen;
    };

    return <template>
      <div style="display: flex; gap: 0.5rem; margin-block-end: 0.75rem;">
        <Button @size="sm" @tertiary={{true}} @onClick={{openAll}}>
          Open all
        </Button>
        <Button @size="sm" @tertiary={{true}} @onClick={{collapseAll}}>
          Collapse all
        </Button>
        <Button @size="sm" @tertiary={{true}} @onClick={{toggleWrapper}}>
          {{if state.wrapperOpen "Hide all" "Show all"}}
        </Button>
      </div>
      <ReasoningSteps
        @open={{state.wrapperOpen}}
        @controlled={{args.controlled}}
        as |ReasoningStep|
      >
        {{#each controlledSteps as |step|}}
          {{#if step.body}}
            <ReasoningStep
              @title={{step.title}}
              @open={{isOpen step.id}}
              @onToggle={{fnHelper toggleStep step.id}}
              data-step-id={{step.id}}
            >
              <Markdown @markdown={{step.body}} />
            </ReasoningStep>
          {{else}}
            <ReasoningStep @title={{step.title}} data-step-id={{step.id}} />
          {{/if}}
        {{/each}}
      </ReasoningSteps>
    </template>;
  },
});

Controlled.test(
  'step state is owned by the host',
  async ({ canvas, userEvent, args }) => {
    const gather = canvas.getByRole('button', {
      name: 'Gather relevant context',
    });
    const plan = canvas.getByRole('button', { name: 'Draft plan' });
    await expect(gather).toHaveAttribute('aria-expanded', 'true');
    await expect(plan).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(plan);
    await expect(args.onToggle).toHaveBeenLastCalledWith(true);
    await expect(plan).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(canvas.getByRole('button', { name: 'Collapse all' }));
    await expect(gather).toHaveAttribute('aria-expanded', 'false');
    await expect(plan).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(canvas.getByRole('button', { name: 'Open all' }));
    await expect(gather).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvas.getByRole('button', { name: 'Run risk checks' }),
    ).toHaveAttribute('aria-expanded', 'true');

    const wrapperToggle = canvas.getByRole('button', { name: 'Hide all' });
    await userEvent.click(wrapperToggle);
    await expect(wrapperToggle).toHaveTextContent('Show all');
    await userEvent.click(wrapperToggle);
    await expect(wrapperToggle).toHaveTextContent('Hide all');
  },
);

// Upstream `Reasoning steps/Step` → Default. `stepOpen` only takes effect
// with `controlled` (see the parity note at the top of this file).
export const StepDefault = meta.story({
  name: 'Step: Default',
  args: {
    stepTitle: 'Review retrieved context',
    stepOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Represents a single entry within the reasoning steps timeline. Supports controlled or uncontrolled open state when paired with `ReasoningSteps`.',
      },
    },
  },
  render: (args) => <template>
    <ReasoningSteps @open={{true}} @controlled={{args.controlled}} as |Step|>
      <Step
        @title={{args.stepTitle}}
        @open={{args.stepOpen}}
        @onToggle={{args.onToggle}}
      >
        <Markdown @markdown={{stepBody}} />
      </Step>
      <Step @title="Awaiting attachments" />
    </ReasoningSteps>
  </template>,
});

// Upstream `Reasoning steps/Step` → Static.
export const StepStatic = meta.story({
  name: 'Step: Static',
  render: () => <template>
    <ReasoningSteps @open={{true}} as |Step|>
      <Step @title="Context missing" />
    </ReasoningSteps>
  </template>,
});

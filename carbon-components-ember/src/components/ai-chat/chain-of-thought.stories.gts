import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ChainOfThought from './chain-of-thought.gts';
import ChainOfThoughtToggle from './chain-of-thought-toggle.gts';
import Markdown from './markdown.gts';

import type {
  ChainOfThoughtSignature,
  ChainOfThoughtStepStatus,
} from './chain-of-thought.gts';
import type { TOC } from '@ember/component/template-only';

// Mirrors `@carbon/ai-chat-components`' `Components/Chain of thought`
// stories (chain-of-thought/__stories__/chain-of-thought.stories.js) and, as
// `Step`/`StaticStep`, its `Components/Chain of thought/Step` stories
// (chain-of-thought-step.stories.js): the step is only reachable as the
// component `ChainOfThought` yields, so it's documented here. The toggle
// has its own file (chain-of-thought-toggle.stories.gts).
//
// Parity gaps:
// - `cds-aichat-tool-call-data` (and its `Components/Chain of thought/Tool
//   call data` stories) isn't ported. `ToolCallData` below is a story-only
//   stand-in rendering the same description/input/output markdown.
// - Upstream's container also emits `chain-of-thought-step-toggled` for any
//   child step; the Ember port only has step-level `@onToggle`.

type ToolStep = {
  title: string;
  description?: string;
  toolName?: string;
  input?: string;
  output?: string;
  status?: ChainOfThoughtStepStatus;
  open?: boolean;
};

const json = (value: string) => `\`\`\`\n${value}\n\`\`\``;

const SAMPLE_STEPS: ToolStep[] = [
  {
    title: 'Search Documentation',
    description: 'Searching the product documentation for relevant information',
    toolName: 'documentation_search',
    input: json(`{
  "query": "API authentication methods",
  "filters": {
    "section": "security",
    "version": "latest"
  }
}`),
    output: json(`{
  "results": [
    {
      "title": "OAuth 2.0 Authentication",
      "snippet": "The API supports OAuth 2.0 for secure authentication..."
    },
    {
      "title": "API Key Authentication",
      "snippet": "API keys can be used for server-to-server authentication..."
    }
  ],
  "count": 2
}`),
    status: 'success',
  },
  {
    title: 'Query Database',
    description: 'Fetching user-specific configuration data',
    toolName: 'database_query',
    input: json(`{
  "table": "user_settings",
  "where": {
    "user_id": "12345"
  }
}`),
    output: json(`{
  "auth_method": "oauth",
  "scopes": ["read", "write"],
  "token_expiry": 3600
}`),
    status: 'success',
  },
  {
    title: 'Generate Response',
    description: 'Synthesizing the information into a final answer',
    toolName: 'response_generator',
    input: json(`{
  "context": "authentication",
  "format": "markdown"
}`),
    output: json(`{
  "summary": "Based on the documentation and your settings, you're using OAuth 2.0 authentication with read and write scopes.",
  "token_expiry_hours": 1
}`),
    status: 'success',
  },
];

const STEPS_WITH_DIFFERENT_STATUSES: ToolStep[] = [
  {
    title: 'Validate Input',
    toolName: 'input_validator',
    input: json(`{
  "input": "test@example.com",
  "type": "email"
}`),
    output: json('{ "valid": true }'),
    status: 'success',
  },
  {
    title: 'Send Email',
    toolName: 'email_sender',
    input: json(`{
  "to": "test@example.com",
  "subject": "Test Email"
}`),
    output: json('{ "error": "SMTP connection timeout" }'),
    status: 'failure',
  },
  {
    title: 'Retry Send Email',
    toolName: 'email_sender',
    input: json(`{
  "to": "test@example.com",
  "subject": "Test Email",
  "retry": true
}`),
    status: 'processing',
  },
];

const STEPS_WITH_COMPLEX_RESPONSES: ToolStep[] = [
  {
    title: 'Analyze Data',
    description:
      'Running statistical analysis on the provided dataset to identify trends and patterns.',
    toolName: 'data_analyzer',
    input: json(`{
  "dataset_id": "sales_2024_q1",
  "metrics": ["revenue", "units_sold", "customer_count"],
  "groupBy": "month"
}`),
    output: json(`{
  "summary": "Q1 2024 sales show strong performance across revenue, units, and customer acquisition.",
  "revenue_growth_yoy": 0.23,
  "unit_sales": 15432,
  "new_customers": 2847,
  "monthly_breakdown": [
    { "month": "Jan", "revenue": "$127K", "units": 4832, "new_customers": 892 },
    { "month": "Feb", "revenue": "$143K", "units": 5123, "new_customers": 967 },
    { "month": "Mar", "revenue": "$156K", "units": 5477, "new_customers": 988 }
  ]
}`),
    status: 'success',
  },
];

// upstream chain-of-thought-step.stories.js `Default`.
const INCIDENT_LOOKUP: ToolStep = {
  title: 'Check recent incidents',
  toolName: 'incident_lookup',
  description:
    'Look up recent outages affecting the EU region before escalating.',
  input: `\`\`\`json
{ "query": "recent outages in eu-west", "limit": 3 }
\`\`\``,
  output: `\`\`\`json
{
  "incidents": [
    { "id": "OUT-483", "status": "resolved" },
    { "id": "OUT-479", "status": "monitoring" }
  ]
}
\`\`\``,
};

/** Story-only stand-in for upstream's unported `cds-aichat-tool-call-data`. */
const ToolCallData: TOC<{ Args: { step: ToolStep } }> = <template>
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    {{#if @step.description}}
      <Markdown @markdown={{@step.description}} />
    {{/if}}
    {{#if @step.input}}
      <strong>Input ({{@step.toolName}})</strong>
      <Markdown @markdown={{@step.input}} />
    {{/if}}
    {{#if @step.output}}
      <strong>Output</strong>
      <Markdown @markdown={{@step.output}} />
    {{/if}}
  </div>
</template>;

type StoryArgs = ChainOfThoughtSignature['Args'] & {
  /** Story-only: the toggle's label while open. */
  openLabelText?: string;
  /** Story-only: the toggle's label while closed. */
  closedLabelText?: string;
  /** Story-only: the steps rendered. */
  steps?: ToolStep[];
};

const increment = (index: number) => index + 1;

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Chain of thought',
  component: ChainOfThought,
  parameters: {
    docs: {
      description: {
        component: `\`ChainOfThought\` and its yielded \`ChainOfThoughtStep\` render a
collapsible list of tool-call-style steps for
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat).
The container's own \`@open\` toggles the whole panel; each step toggles
independently and shows a status icon (success/failure/processing).`,
      },
    },
  },
  args: {
    open: false,
    panelId: 'chain-of-thought-panel',
    openLabelText: 'Hide chain of thought',
    closedLabelText: 'Show chain of thought',
    steps: SAMPLE_STEPS,
    onToggle: fn(),
  },
  // Upstream pairs every chain of thought with a `ChainOfThoughtToggle`
  // that drives the panel's `open`.
  render: (args: StoryArgs) => {
    const state = trackedObject({ open: args.open ?? false });
    const toggle = (open: boolean) => {
      state.open = open;
    };

    return <template>
      <ChainOfThoughtToggle
        @open={{state.open}}
        @panelId={{args.panelId}}
        @openLabelText={{args.openLabelText}}
        @closedLabelText={{args.closedLabelText}}
        @onToggle={{toggle}}
      />
      <ChainOfThought
        @open={{state.open}}
        @panelId={{args.panelId}}
        @onToggle={{args.onToggle}}
        as |CotStep|
      >
        {{#each args.steps as |step index|}}
          <CotStep
            @title={{step.title}}
            @status={{step.status}}
            @open={{step.open}}
            @stepNumber={{increment index}}
          >
            <ToolCallData @step={{step}} />
          </CotStep>
        {{/each}}
      </ChainOfThought>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'the toggle opens the panel',
  async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole('button', {
      name: 'Show chain of thought',
    });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    await expect(
      canvas.getByRole('button', { name: 'Hide chain of thought' }),
    ).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onToggle).toHaveBeenCalledWith(true);
  },
);

export const WithStepsOpen = meta.story({
  args: {
    open: true,
    steps: [{ ...SAMPLE_STEPS[0]!, open: true }, ...SAMPLE_STEPS.slice(1)],
  },
});

export const WithDifferentStatuses = meta.story({
  args: {
    open: true,
    steps: STEPS_WITH_DIFFERENT_STATUSES,
  },
});

export const WithComplexResponses = meta.story({
  args: {
    open: true,
    steps: STEPS_WITH_COMPLEX_RESPONSES,
  },
});

export const Statuses = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'Steps with a plain-text body, one per status (success, processing, failure).',
      },
    },
  },
  render: () => <template>
    <ChainOfThought @open={{true}} as |CotStep|>
      <CotStep @title="Searching the web" @stepNumber={{1}} @status="success">
        Found 3 relevant results.
      </CotStep>
      <CotStep
        @title="Reading documentation"
        @stepNumber={{2}}
        @status="processing"
      >
        Still working...
      </CotStep>
      <CotStep
        @title="Summarizing findings"
        @stepNumber={{3}}
        @status="failure"
      >
        Ran out of context.
      </CotStep>
    </ChainOfThought>
  </template>,
});

Statuses.test(
  'each step toggles independently',
  async ({ canvas, userEvent }) => {
    const [first, second] = canvas.getAllByRole('button');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(first!);
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(second).toHaveAttribute('aria-expanded', 'false');
  },
);

// upstream `Components/Chain of thought/Step` `Default`.
export const Step = meta.story({
  render: () => <template>
    <ChainOfThought @open={{true}} as |CotStep|>
      <CotStep
        @title="Check recent incidents"
        @status="success"
        @open={{true}}
        @statusSucceededLabelText="Succeeded"
        @statusFailedLabelText="Failed"
        @statusProcessingLabelText="Processing"
        @stepNumber={{1}}
      >
        <ToolCallData @step={{INCIDENT_LOOKUP}} />
      </CotStep>
      <CotStep
        @title="Awaiting confirmation"
        @status="processing"
        @stepNumber={{2}}
      />
    </ChainOfThought>
  </template>,
});

// upstream `Components/Chain of thought/Step` `Static`.
export const StaticStep = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'A step with no body content renders a static, non-clickable header instead of a disclosure button.',
      },
    },
  },
  render: () => <template>
    <ChainOfThought @open={{true}} as |CotStep|>
      <CotStep @title="Plan remediation" @status="success" @stepNumber={{1}} />
    </ChainOfThought>
  </template>,
});

StaticStep.test('renders no disclosure button', async ({ canvas }) => {
  await expect(canvas.queryByRole('button')).toBeNull();
  await expect(canvas.getByText(/Plan remediation/)).toBeVisible();
});

export const ControlledSteps = meta.story({
  parameters: {
    docs: {
      description: {
        story: `Passing \`@controlled={{true}}\` to \`ChainOfThought\` propagates \`@controlled\`
to every yielded step: each step's own \`@open\` becomes the sole source of
truth, and a click only calls \`@onToggle\` without changing anything itself.`,
      },
    },
  },
  args: {
    controlled: true,
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({ open: false });
    const toggle = (next: boolean) => {
      state.open = next;
      args.onToggle?.(next);
    };

    return <template>
      <ChainOfThought
        @open={{true}}
        @controlled={{args.controlled}}
        as |CotStep|
      >
        <CotStep
          @title="Controlled step"
          @open={{state.open}}
          @onToggle={{toggle}}
        >
          This step's visibility is fully owned by the host application.
        </CotStep>
      </ChainOfThought>
    </template>;
  },
});

ControlledSteps.test(
  'a click only reports the toggle; the host opens the step',
  async ({ canvas, userEvent, args }) => {
    const step = canvas.getByRole('button');
    await userEvent.click(step);
    await expect(args.onToggle).toHaveBeenCalledWith(true);
    await expect(step).toHaveAttribute('aria-expanded', 'true');
  },
);

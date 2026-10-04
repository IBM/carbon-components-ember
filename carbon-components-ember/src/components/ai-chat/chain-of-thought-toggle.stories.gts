import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ChainOfThought from './chain-of-thought.gts';
import ChainOfThoughtToggle from './chain-of-thought-toggle.gts';
import Markdown from './markdown.gts';

import type { ChainOfThoughtStepStatus } from './chain-of-thought.gts';
import type { Args as ToggleArgs } from './chain-of-thought-toggle.gts';

// Mirrors `@carbon/ai-chat-components`' `Components/Chain of thought/Toggle`
// stories (chain-of-thought/__stories__/chain-of-thought-toggle.stories.js).
//
// Parity gap: upstream's steps wrap their markdown in the unported
// `cds-aichat-tool-call-data`; here the description/input/output markdown is
// rendered directly in each step.

const json = (value: string) => `\`\`\`\n${value}\n\`\`\``;

type ToolStep = {
  title: string;
  description: string;
  input?: string;
  output?: string;
  status: ChainOfThoughtStepStatus;
};

const DEFAULT_STEPS: ToolStep[] = [
  {
    title: 'Collect customer context',
    description:
      "Gathered the customer's prior interactions and relevant metadata for grounding.",
    input: json('{ "customerId": "58429", "channels": ["email", "chat"] }'),
    output: json('{ "recentIssues": 2, "priority": "standard" }'),
    status: 'success',
  },
  {
    title: 'Draft remediation plan',
    description: 'Outlined steps to correct the reported connectivity issue.',
    input: json('{ "issue": "vpn_disconnects", "priority": "standard" }'),
    output: json(`- Validate user credentials
- Rotate access token
- Reconnect VPN gateway`),
    status: 'success',
  },
  {
    title: 'Send confirmation',
    description: 'Confirming steps were sent to the customer.',
    status: 'processing',
  },
];

const increment = (index: number) => index + 1;

const meta = preview.meta({
  title: 'AI Chat/Chain of thought/Toggle',
  component: ChainOfThoughtToggle,
  parameters: {
    docs: {
      description: {
        component: `A standalone disclosure button for a \`ChainOfThought\` panel. Upstream keeps
the two components DOM-decoupled (they only agree via \`@panelId\`/
\`aria-controls\`), so this port does too — wire \`@onToggle\` to whatever
should happen, typically setting a \`ChainOfThought\`'s own \`@open\`.`,
      },
    },
  },
  args: {
    openLabelText: 'Hide chain of thought',
    closedLabelText: 'Show chain of thought',
    panelId: 'chain-of-thought-toggle-demo',
    open: true,
    onToggle: fn(),
  },
  render: (args: ToggleArgs) => {
    const state = trackedObject({ open: args.open ?? false });
    const toggle = (open: boolean) => {
      state.open = open;
      args.onToggle?.(open);
    };

    return <template>
      <div
        style="display: flex; flex-direction: column; gap: 0.75rem; max-inline-size: 48rem;"
      >
        <ChainOfThoughtToggle
          @open={{state.open}}
          @panelId={{args.panelId}}
          @openLabelText={{args.openLabelText}}
          @closedLabelText={{args.closedLabelText}}
          @disabled={{args.disabled}}
          @onToggle={{toggle}}
        />
        <ChainOfThought
          @open={{state.open}}
          @panelId={{args.panelId}}
          as |CotStep|
        >
          {{#each DEFAULT_STEPS as |step index|}}
            <CotStep
              @title={{step.title}}
              @status={{step.status}}
              @stepNumber={{increment index}}
            >
              <Markdown @markdown={{step.description}} />
              {{#if step.input}}
                <Markdown @markdown={{step.input}} />
              {{/if}}
              {{#if step.output}}
                <Markdown @markdown={{step.output}} />
              {{/if}}
            </CotStep>
          {{/each}}
        </ChainOfThought>
      </div>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'toggles the linked panel',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const panel = canvasElement.querySelector(`#${args.panelId}`);
    const toggle = canvas.getByRole('button', {
      name: 'Hide chain of thought',
    });
    await expect(toggle).toHaveAttribute('aria-controls', args.panelId);
    await expect(panel).toHaveAttribute('aria-hidden', 'false');

    await userEvent.click(toggle);
    await expect(args.onToggle).toHaveBeenCalledWith(false);
    await expect(toggle).toHaveAccessibleName('Show chain of thought');
    await expect(panel).toHaveAttribute('aria-hidden', 'true');
  },
);

export const Closed = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "The docs-app demo: starts closed and opens the `ChainOfThought` it's linked to via `@panelId`.",
      },
    },
  },
  args: {
    open: false,
    panelId: 'cot-panel',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
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

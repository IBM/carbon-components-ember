import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Markdown from './markdown.gts';
import ReasoningSteps from './reasoning-steps.gts';
import ReasoningStepsToggle from './reasoning-steps-toggle.gts';

import type { Args as ReasoningStepsToggleArgs } from './reasoning-steps-toggle.gts';

// Mirrors `@carbon/ai-chat-components`' `reasoning-steps-toggle.stories.js`
// (`Components/Reasoning steps/Toggle`: Default). Like upstream's demo
// element, the stories compose the toggle with a `ReasoningSteps` panel and
// keep the open state in the host (here: story-local tracked state, reported
// to the `onToggle` action).
//
// docs-app's demo (toggle starting closed, panel kept mounted and driven by
// `@open`) is the `Collapsed` story.
//
// Parity gaps (not faked):
// - Upstream's `steps` arg (an array of step objects for the demo) isn't a
//   control here: the steps are fixed story data, since `ReasoningSteps`
//   yields its step component rather than taking data.
// - Upstream's `carbonTheme` arg isn't ported: the Storybook toolbar's
//   theme switcher applies Carbon's theme classes instead.

type StoryArgs = ReasoningStepsToggleArgs & {
  onToggle: (open: boolean) => void;
};

const steps = [
  {
    title: 'Gather context',
    body: 'Collected relevant conversation turns and system guidance.',
  },
  {
    title: 'Plan response',
    body: 'Outlined the answer structure before generating the final reply.',
  },
  {
    title: 'Validate output',
    body: 'Checked tone, safety, and citation coverage before sending.',
  },
];

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Reasoning steps/Toggle',
  component: ReasoningStepsToggle,
  parameters: {
    docs: {
      description: {
        component: `A dedicated toggle button for expanding or collapsing reasoning steps. Compose it with \`ReasoningSteps\` when you want to manage the open state externally.

The toggle is DOM-decoupled from the panel (same as \`ChainOfThoughtToggle\`/\`ChainOfThought\`): point \`@panelId\` at the \`ReasoningSteps\`' own \`id\` for \`aria-controls\`. With \`@onToggle\`, \`@open\` is controlled; without it, \`@open\` only seeds the initial state.`,
      },
    },
  },
  args: {
    openLabelText: 'Hide reasoning steps',
    closedLabelText: 'Show reasoning steps',
    panelId: 'reasoning-steps-toggle-demo',
    open: true,
    onToggle: fn(),
  },
  // Upstream's demo only mounts the steps while open.
  // Annotated: otherwise `render` is typed with the component's inferred
  // args instead of the story-only ones declared via `preview.type()`.
  render: (args: StoryArgs) => {
    const state = trackedObject({ open: args.open ?? false });
    const toggle = (open: boolean) => {
      state.open = open;
      args.onToggle(open);
    };

    return <template>
      <div
        style="display: flex; flex-direction: column; gap: 0.75rem; max-inline-size: 48rem;"
      >
        <ReasoningStepsToggle
          @open={{state.open}}
          @panelId={{args.panelId}}
          @openLabelText={{args.openLabelText}}
          @closedLabelText={{args.closedLabelText}}
          @disabled={{args.disabled}}
          @onToggle={{toggle}}
        />
        {{#if state.open}}
          <ReasoningSteps @open={{state.open}} id={{args.panelId}} as |Step|>
            {{#each steps as |step|}}
              <Step @title={{step.title}}>
                <Markdown @markdown={{step.body}} />
              </Step>
            {{/each}}
          </ReasoningSteps>
        {{/if}}
      </div>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'toggles the panel and swaps its label',
  async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole('button', { name: 'Hide reasoning steps' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAttribute(
      'aria-controls',
      'reasoning-steps-toggle-demo',
    );
    await expect(canvas.getByText('Gather context')).toBeVisible();

    await userEvent.click(toggle);
    await expect(args.onToggle).toHaveBeenLastCalledWith(false);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAccessibleName('Show reasoning steps');
    await expect(canvas.queryByText('Gather context')).toBeNull();

    await userEvent.click(toggle);
    await expect(args.onToggle).toHaveBeenLastCalledWith(true);
    await expect(toggle).toHaveAccessibleName('Hide reasoning steps');
  },
);

// docs-app's demo: starts closed and keeps the panel mounted, driving its
// `@open` from the toggle.
export const Collapsed = meta.story({
  args: {
    open: false,
    panelId: 'rs-panel',
  },
  render: (args) => {
    const state = trackedObject({ open: args.open ?? false });
    const toggle = (open: boolean) => {
      state.open = open;
      args.onToggle(open);
    };

    return <template>
      <ReasoningStepsToggle
        @open={{state.open}}
        @panelId={{args.panelId}}
        @openLabelText={{args.openLabelText}}
        @closedLabelText={{args.closedLabelText}}
        @disabled={{args.disabled}}
        @onToggle={{toggle}}
      />
      <ReasoningSteps @open={{state.open}} id={{args.panelId}} as |Step|>
        <Step @title="Considering the question">
          Breaking the request down into smaller parts.
        </Step>
      </ReasoningSteps>
    </template>;
  },
});

Collapsed.test(
  'opens the mounted panel',
  async ({ canvas, userEvent, args, canvasElement }) => {
    const toggle = canvas.getByRole('button', { name: 'Show reasoning steps' });
    const wrapper = canvasElement.querySelector(
      '#rs-panel .cds-aichat-reasoning-steps__wrapper',
    );
    await expect(wrapper).toHaveAttribute('aria-hidden', 'true');

    await userEvent.click(toggle);
    await expect(args.onToggle).toHaveBeenLastCalledWith(true);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(wrapper).toHaveAttribute('aria-hidden', 'false');
  },
);

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

Disabled.test('ignores clicks while disabled', async ({ canvas, args }) => {
  const toggle = canvas.getByRole('button', { name: 'Hide reasoning steps' });
  await expect(toggle).toBeDisabled();
  await expect(args.onToggle).not.toHaveBeenCalled();
});

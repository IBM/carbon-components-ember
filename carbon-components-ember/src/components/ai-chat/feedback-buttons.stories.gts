import { tracked } from '@glimmer/tracking';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Feedback from './feedback.gts';
import FeedbackButtons from './feedback-buttons.gts';

import type { FeedbackDetails } from './feedback.gts';

// Mirrors `@carbon/ai-chat-components`' `feedback-buttons.stories.js`
// (`Default`, `WithDetailsPanel`). Upstream's `Default` `alert()`s on click;
// here `onClick` is an `fn()` spy reported in the Actions panel instead.
// Upstream's `WithDetailsPanel` renders a private `cds-aichat-feedback-
// buttons-demo` element that owns the selection/panel state; that state
// machine is ported 1:1 into `FeedbackDemoState` below.
//
// docs-app coverage: its single demo (thumbs-down opening a `Feedback`
// panel wired via `@panelId`/`aria-controls`) is covered by
// `WithDetailsPanel`.
//
// Parity gaps: upstream flips its tooltip alignment based on document
// direction; the Ember component relies on `Tooltip`'s `@autoAlign` instead
// (see the component's own doc comment).

const POSITIVE_CATEGORIES = [
  'Accurate',
  'Helpful',
  'Clear explanation',
  'Comprehensive',
];

const NEGATIVE_CATEGORIES = [
  'Inaccurate',
  'Unhelpful',
  'Inappropriate',
  'Too verbose',
];

type Submission = {
  isPositive: boolean;
  text: string;
  selectedCategories: string[];
};

// Port of upstream's `FeedbackButtonsDetailsDemo` state handling.
class FeedbackDemoState {
  @tracked submitted = false;
  @tracked positiveSelected = false;
  @tracked negativeSelected = false;
  @tracked positiveOpen = false;
  @tracked negativeOpen = false;
  @tracked lastSubmission: Submission | null = null;

  hasPositiveDetails: boolean;
  hasNegativeDetails: boolean;
  onClick?: (isPositive: boolean) => void;

  constructor(
    hasPositiveDetails: boolean,
    hasNegativeDetails: boolean,
    onClick?: (isPositive: boolean) => void,
  ) {
    this.hasPositiveDetails = hasPositiveDetails;
    this.hasNegativeDetails = hasNegativeDetails;
    this.onClick = onClick;
  }

  get positiveDisabled() {
    return this.negativeSelected || this.submitted;
  }

  get negativeDisabled() {
    return this.positiveSelected || this.submitted;
  }

  get positiveInitialValues() {
    return this.initialValuesFor(true);
  }

  get negativeInitialValues() {
    return this.initialValuesFor(false);
  }

  initialValuesFor(isPositive: boolean): FeedbackDetails | null {
    const last = this.lastSubmission;
    if (last && last.isPositive === isPositive) {
      return { text: last.text, selectedCategories: last.selectedCategories };
    }
    return null;
  }

  toggle = (isPositive: boolean) => {
    this.onClick?.(isPositive);
    if (this.submitted) {
      return;
    }
    const currentlySelected = isPositive
      ? this.positiveSelected
      : this.negativeSelected;
    const toggleToSelected = !currentlySelected;
    const hasDetails = isPositive
      ? this.hasPositiveDetails
      : this.hasNegativeDetails;
    const openDetails = hasDetails && toggleToSelected;

    if (toggleToSelected && !hasDetails) {
      this.record(isPositive, { text: '', selectedCategories: [] });
    } else {
      this.positiveOpen = openDetails && isPositive;
      this.negativeOpen = openDetails && !isPositive;
    }

    if (!toggleToSelected) {
      this.positiveOpen = false;
      this.negativeOpen = false;
    }

    this.positiveSelected = isPositive ? toggleToSelected : false;
    this.negativeSelected = isPositive ? false : toggleToSelected;
  };

  closePositive = () => this.close(true);
  closeNegative = () => this.close(false);

  close(isPositive: boolean) {
    if (this.submitted) {
      return;
    }
    if (isPositive) {
      this.positiveSelected = false;
      this.positiveOpen = false;
    } else {
      this.negativeSelected = false;
      this.negativeOpen = false;
    }
  }

  submitPositive = (details: FeedbackDetails) => this.submit(true, details);
  submitNegative = (details: FeedbackDetails) => this.submit(false, details);

  submit(isPositive: boolean, details: FeedbackDetails) {
    this.record(isPositive, details);
    this.positiveOpen = false;
    this.negativeOpen = false;
  }

  record(isPositive: boolean, details: FeedbackDetails) {
    this.submitted = true;
    this.positiveSelected = isPositive;
    this.negativeSelected = !isPositive;
    this.lastSubmission = {
      isPositive,
      text: details.text ?? '',
      selectedCategories: details.selectedCategories ?? [],
    };
  }
}

const meta = preview.meta({
  title: 'AI Chat/Feedback/Buttons',
  component: FeedbackButtons,
  parameters: {
    // Known violations in the shared `Tooltip` each button sits in: it puts
    // `aria-labelledby` on its generic wrapper `<span>` instead of the
    // trigger (axe `aria-prohibited-attr`), so the icon-only thumbs buttons
    // have no accessible name (axe `button-name`). Reported as warnings
    // until `Tooltip` is fixed.
    a11y: { test: 'todo' },
    docs: {
      description: {
        component:
          '`FeedbackButtons` renders a thumbs-up / thumbs-down pair used to collect quick feedback on a chat response, each optionally wired to its own details panel (typically a `Feedback`) via `aria-controls` (`@panelId` + `-feedback-positive`/`-feedback-negative`).',
      },
    },
  },
  args: {
    positiveLabel: 'I like this response',
    negativeLabel: 'I dislike this response',
    onClick: fn(),
  },
});

export const Default = meta.story({
  args: {
    isPositiveSelected: false,
    isNegativeSelected: false,
    isPositiveDisabled: false,
    isNegativeDisabled: false,
  },
  render: (args) => <template>
    <div style="padding: 2rem;">
      <p style="margin-bottom: 1rem;">
        Click the buttons to provide feedback on this message.
      </p>
      <FeedbackButtons
        @isPositiveSelected={{args.isPositiveSelected}}
        @isNegativeSelected={{args.isNegativeSelected}}
        @isPositiveDisabled={{args.isPositiveDisabled}}
        @isNegativeDisabled={{args.isNegativeDisabled}}
        @positiveLabel={{args.positiveLabel}}
        @negativeLabel={{args.negativeLabel}}
        @onClick={{args.onClick}}
      />
    </div>
  </template>,
});

Default.test(
  'reports which button was clicked',
  async ({ canvasElement, userEvent, args }) => {
    // The buttons have no accessible name yet (see the a11y note on meta),
    // so they can't be queried by role + name.
    const positive = canvasElement.querySelector<HTMLButtonElement>(
      '.cds-aichat-feedback-buttons__positive',
    )!;
    const negative = canvasElement.querySelector<HTMLButtonElement>(
      '.cds-aichat-feedback-buttons__negative',
    )!;

    await userEvent.click(positive);
    await expect(args.onClick).toHaveBeenLastCalledWith(true);
    await userEvent.click(negative);
    await expect(args.onClick).toHaveBeenLastCalledWith(false);
  },
);

export const WithDetailsPanel = meta.story({
  args: {
    panelId: 'feedback-panel-example',
    hasPositiveDetails: true,
    hasNegativeDetails: true,
  },
  render: (args) => {
    const state = new FeedbackDemoState(
      args.hasPositiveDetails ?? false,
      args.hasNegativeDetails ?? false,
      args.onClick,
    );
    const panelId = args.panelId ?? 'feedback-panel-example';
    const positivePanelId = `${panelId}-feedback-positive`;
    const negativePanelId = `${panelId}-feedback-negative`;

    return <template>
      <div style="padding: 2rem;">
        <p style="margin-bottom: 1rem;">
          Both buttons open details panels for collecting more information. Try
          clicking the thumbs up or thumbs down buttons to provide feedback.
        </p>
        <FeedbackButtons
          @hasPositiveDetails={{args.hasPositiveDetails}}
          @hasNegativeDetails={{args.hasNegativeDetails}}
          @isPositiveOpen={{state.positiveOpen}}
          @isNegativeOpen={{state.negativeOpen}}
          @isPositiveSelected={{state.positiveSelected}}
          @isNegativeSelected={{state.negativeSelected}}
          @isPositiveDisabled={{state.positiveDisabled}}
          @isNegativeDisabled={{state.negativeDisabled}}
          @positiveLabel={{args.positiveLabel}}
          @negativeLabel={{args.negativeLabel}}
          @panelId={{panelId}}
          @onClick={{state.toggle}}
        />
        <div style="margin-block-start: 1rem; max-inline-size: 26rem;">
          {{#if args.hasPositiveDetails}}
            <Feedback
              @id={{positivePanelId}}
              @isOpen={{state.positiveOpen}}
              @isReadonly={{state.submitted}}
              @categories={{POSITIVE_CATEGORIES}}
              @initialValues={{state.positiveInitialValues}}
              @title="Additional feedback"
              @body="Why did you choose this rating?"
              @placeholder="Add a comment"
              @primaryLabel="Submit"
              @showBody={{true}}
              @showTextArea={{true}}
              @onClose={{state.closePositive}}
              @onSubmit={{state.submitPositive}}
            />
          {{/if}}
          {{#if args.hasNegativeDetails}}
            <Feedback
              @id={{negativePanelId}}
              @isOpen={{state.negativeOpen}}
              @isReadonly={{state.submitted}}
              @categories={{NEGATIVE_CATEGORIES}}
              @initialValues={{state.negativeInitialValues}}
              @title="Additional feedback"
              @body="Why did you choose this rating?"
              @placeholder="Add a comment"
              @primaryLabel="Submit"
              @showBody={{true}}
              @showTextArea={{true}}
              @onClose={{state.closeNegative}}
              @onSubmit={{state.submitNegative}}
            />
          {{/if}}
        </div>
        {{#if state.lastSubmission}}
          <p
            class="feedback-demo-note"
            style="margin-block-start: 0.5rem; font-size: 0.875rem;"
          >
            Last submission:
            <strong>
              {{if state.lastSubmission.isPositive "Positive" "Negative"}}
            </strong>
            {{#if state.lastSubmission.text}}
              —
              {{state.lastSubmission.text}}
            {{/if}}
          </p>
        {{/if}}
      </div>
    </template>;
  },
});

WithDetailsPanel.test(
  'opens the matching details panel and records the submission',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const positive = canvasElement.querySelector<HTMLButtonElement>(
      '.cds-aichat-feedback-buttons__positive',
    )!;
    const negative = canvasElement.querySelector<HTMLButtonElement>(
      '.cds-aichat-feedback-buttons__negative',
    )!;
    const negativePanel = canvasElement.querySelector<HTMLElement>(
      '#feedback-panel-example-feedback-negative',
    )!;

    await expect(negative).toHaveAttribute(
      'aria-controls',
      'feedback-panel-example-feedback-negative',
    );
    await expect(negative).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(negative);
    await expect(args.onClick).toHaveBeenLastCalledWith(false);
    await waitFor(() =>
      expect(negative).toHaveAttribute('aria-expanded', 'true'),
    );
    await expect(negative).toHaveAttribute('aria-pressed', 'true');
    await expect(positive).toBeDisabled();
    await expect(
      negativePanel.querySelector('.cds-aichat-feedback__container'),
    ).not.toHaveClass('cds-aichat-feedback__container--closed');

    await userEvent.type(
      negativePanel.querySelector<HTMLTextAreaElement>('textarea')!,
      'Too long',
    );
    await userEvent.click(
      negativePanel.querySelector<HTMLButtonElement>(
        '.cds-aichat-feedback__submit button',
      )!,
    );

    await expect(
      await canvas.findByText(/Last submission:/),
    ).toBeInTheDocument();
    await expect(canvas.getByText(/Too long/)).toBeInTheDocument();
    await expect(negative).toBeDisabled();
    await expect(positive).toBeDisabled();
  },
);

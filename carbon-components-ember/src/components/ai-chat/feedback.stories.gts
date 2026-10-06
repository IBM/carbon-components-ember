import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Feedback from './feedback.gts';

// Mirrors `@carbon/ai-chat-components`' `feedback.stories.js` (`Default`,
// `WithCategories`, `WithDisclaimer`, `ReadOnly`). Upstream's stories
// `alert()`/`console.log` on submit/close; here `onSubmit`/`onClose` are
// `fn()` spies reported in the Actions panel instead.
//
// docs-app coverage: its first demo (categories, a disclaimer checkbox and
// an `@onSubmit` that printed the last submission) is covered by
// `WithDisclaimer` (categories + disclaimer + disclaimer checkbox, with the
// submission shown in the Actions panel); its "Read-only mode" demo is
// covered by `ReadOnly`.
//
// Parity gaps: none in the args these stories exercise. Upstream's
// `text-area-placeholder` attribute is the Ember `@placeholder` arg.

const NEGATIVE_CATEGORIES = [
  'Inaccurate',
  'Unhelpful',
  'Inappropriate',
  'Not relevant',
  'Too verbose',
  'Missing information',
];

const POSITIVE_CATEGORIES = [
  'Accurate',
  'Helpful',
  'Well-formatted',
  'Clear explanation',
  'Comprehensive',
];

const meta = preview.meta({
  title: 'AI Chat/Feedback',
  component: Feedback,
  parameters: {
    docs: {
      description: {
        component: [
          '`Feedback` renders a panel requesting free-text and/or categorized feedback on a chat response, typically opened from a `FeedbackButtons` thumbs-down click.',
          '',
          '`@isReadonly` disables every control (categories, text area, disclaimer checkbox, submit) without hiding the panel. `@initialValues` seeds (and, on identity change, resets) the text area and selected categories.',
        ].join('\n'),
      },
    },
  },
  args: {
    isOpen: true,
    isReadonly: false,
    title: 'Additional feedback',
    body: 'Why did you choose this rating?',
    placeholder: 'Add a comment',
    primaryLabel: 'Submit',
    showTextArea: true,
    showBody: true,
    maxLength: 1000,
    onSubmit: fn(),
    onClose: fn(),
  },
  decorators: [
    (Story, context) => <template>
      <div style="padding: 1rem; max-width: 24rem;">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
});

export const Default = meta.story();

Default.test(
  'submits the typed comment and reports close',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const textArea = canvas.getByPlaceholderText('Add a comment');
    await userEvent.type(textArea, 'Great answer');
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(args.onSubmit).toHaveBeenCalledWith({
      text: 'Great answer',
      selectedCategories: [],
    });

    // The close button has no accessible name yet (see the a11y note on
    // meta), so it can't be queried by role + name.
    const close = canvasElement.querySelector<HTMLButtonElement>(
      '.cds-aichat-feedback__close button',
    );
    await expect(close).not.toBeNull();
    await userEvent.click(close!);
    await expect(args.onClose).toHaveBeenCalledOnce();
  },
);

export const WithCategories = meta.story({
  args: {
    categoriesLabel: 'Feedback categories',
    categories: NEGATIVE_CATEGORIES,
  },
});

WithCategories.test(
  'toggles category chips and submits the selection',
  async ({ canvas, userEvent, args }) => {
    const group = canvas.getByRole('group', { name: 'Feedback categories' });
    await expect(group).toBeInTheDocument();

    const inaccurate = canvas.getByRole('button', { name: 'Inaccurate' });
    const verbose = canvas.getByRole('button', { name: 'Too verbose' });
    await userEvent.click(inaccurate);
    await userEvent.click(verbose);
    await expect(inaccurate).toHaveClass('cds-aichat-feedback__tag--selected');

    // Clicking a selected chip deselects it again.
    await userEvent.click(verbose);
    await expect(verbose).not.toHaveClass('cds-aichat-feedback__tag--selected');

    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(args.onSubmit).toHaveBeenCalledWith({
      text: '',
      selectedCategories: ['Inaccurate'],
    });
  },
);

export const WithDisclaimer = meta.story({
  args: {
    categories: POSITIVE_CATEGORIES,
    disclaimer:
      'To better understand your feedback, a dedicated IBM team may review additional information (such as your prompt and the model output) to drive improvement of AI-powered features. Your content will not be used to train or enhance the AI model.',
    disclaimerCheckbox:
      'I agree to IBM collecting information related to my feedback.',
  },
});

WithDisclaimer.test(
  'keeps submit disabled until the disclaimer is accepted',
  async ({ canvas, userEvent, args }) => {
    const submit = canvas.getByRole('button', { name: 'Submit' });
    await expect(submit).toBeDisabled();

    await userEvent.click(
      canvas.getByRole('checkbox', {
        name: 'I agree to IBM collecting information related to my feedback.',
      }),
    );
    await expect(submit).toBeEnabled();

    await userEvent.click(canvas.getByRole('button', { name: 'Helpful' }));
    await userEvent.click(submit);
    await expect(args.onSubmit).toHaveBeenCalledWith({
      text: '',
      selectedCategories: ['Helpful'],
    });
  },
);

export const ReadOnly = meta.story({
  args: {
    isReadonly: true,
    showBody: false,
    body: undefined,
    placeholder: undefined,
    primaryLabel: undefined,
    categories: NEGATIVE_CATEGORIES,
    initialValues: {
      text: "The response was inaccurate and didn't address my question properly. It also included irrelevant information.",
      selectedCategories: ['Inaccurate', 'Not relevant'],
    },
  },
});

ReadOnly.test(
  'shows the initial values with every control disabled',
  async ({ canvas }) => {
    const textArea = canvas.getByRole('textbox');
    await expect(textArea).toBeDisabled();
    await expect(textArea).toHaveValue(
      "The response was inaccurate and didn't address my question properly. It also included irrelevant information.",
    );

    const inaccurate = canvas.getByRole('button', { name: 'Inaccurate' });
    await expect(inaccurate).toBeDisabled();
    await expect(inaccurate).toHaveClass('cds-aichat-feedback__tag--selected');
    await expect(canvas.getByRole('button', { name: 'Submit' })).toBeDisabled();
  },
);

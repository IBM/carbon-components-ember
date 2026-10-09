import { trackedObject } from '@ember/reactive/collections';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { expect, fn as spy, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import InlineLoading from './inline-loading.gts';

// Parity notes on Carbon React's InlineLoading stories:
// - Carbon React's ButtonSet isn't ported yet, so the examples use its
//   `cds--btn-set` class on a div.
// - "Without ember-concurrency" is ours: the UX example's flow with a tracked
//   flag instead of a task.

// Stands in for a request, as Carbon React's example does with a timer.
const SUBMIT_MS = 2000;

const meta = preview.meta({
  title: 'Components/InlineLoading',
  component: InlineLoading,
  parameters: {
    docs: {
      description: {
        component:
          'Shows that something is in progress, finished or failed, in place of the control that started it. `@status` is `inactive`, `active` (the default), `finished` or `error`; `@description` is the text next to the icon, and `@iconDescription` labels the icon. `@onSuccess` runs `@successDelay` milliseconds (1500 by default) after the status becomes `finished`, which is the moment to swap the original control back in.',
      },
    },
  },
  argTypes: {
    status: {
      options: ['inactive', 'active', 'error', 'finished'],
      control: { type: 'select' },
    },
  },
});

// A task that submits, then shows the result until InlineLoading calls
// @onSuccess. `drop: true` ignores clicks while it runs.
class Submission {
  @tracked success = false;

  submit = task({ drop: true }, async () => {
    await timeout(SUBMIT_MS);
    this.success = true;
  });

  reset = () => {
    this.success = false;
  };
}

export const UxExample = meta.story({
  render: () => {
    const submission = new Submission();

    return <template>
      <div class="cds--btn-set" style="width: 300px">
        <Button
          @type="secondary"
          @disabled={{or submission.submit.isRunning submission.success}}
        >Cancel</Button>
        {{#if (or submission.submit.isRunning submission.success)}}
          <InlineLoading
            style="margin-left: 1rem"
            @status={{if submission.success "finished" "active"}}
            @description={{if submission.success "Submitted!" "Submitting..."}}
            @onSuccess={{submission.reset}}
          />
        {{else}}
          <Button {{on "click" submission.submit.perform}}>Submit</Button>
        {{/if}}
      </div>
    </template>;
  },
});

UxExample.test(
  'submits, shows the result, then resets',
  async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(canvas.getByText('Submitting...')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await waitFor(
      () => expect(canvas.getByText('Submitted!')).toBeInTheDocument(),
      { timeout: SUBMIT_MS + 1000 },
    );
    await waitFor(
      () =>
        expect(
          canvas.getByRole('button', { name: 'Submit' }),
        ).toBeInTheDocument(),
      { timeout: 2500 },
    );
  },
);

export const Default = meta.story({
  args: {
    description: 'Loading',
    iconDescription: 'Loading data...',
    status: 'active',
    onSuccess: spy(),
  },
  parameters: {
    controls: { exclude: ['successDelay'] },
  },
});

export const WithoutEmberConcurrency = meta.story({
  name: 'Without ember-concurrency',
  render: () => {
    const state = trackedObject({ submitting: false, success: false });
    const submit = async () => {
      state.submitting = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, SUBMIT_MS));
        state.success = true;
      } finally {
        state.submitting = false;
      }
    };
    const reset = () => {
      state.success = false;
    };

    return <template>
      {{#if (or state.submitting state.success)}}
        <InlineLoading
          @status={{if state.success "finished" "active"}}
          @description={{if state.success "Submitted!" "Submitting..."}}
          @onSuccess={{reset}}
        />
      {{else}}
        <Button {{on "click" submit}}>Submit</Button>
      {{/if}}
    </template>;
  },
});

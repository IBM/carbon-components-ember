import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import ConfirmDialog from './confirm.gts';

import type { Args as ConfirmDialogArgs } from './confirm.gts';

// Carbon React has no ConfirmDialog; it's an Ember-only convenience built on
// the addon's Modal, closest to React's `Modal` `DangerModal` story. The
// `Danger` story mirrors that one.
//
// The dialog is a full-viewport overlay, so on the docs page each story
// renders in its own iframe.

const meta = preview.meta({
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: '400px' },
      description: {
        component:
          'A modal dialog asking the user to confirm an action. `@onAccept` and `@onCancel` are called with the answer; the dialog is shown for as long as it is rendered.',
      },
    },
  },
  args: {
    type: 'primary',
    label: 'Confirmation',
    header: 'Are you sure?',
    body: 'This action cannot be undone.',
    onAccept: fn(),
    onCancel: fn(),
  },
  // Like the docs-app demo: a button opens the dialog, and the answer is
  // shown once it closes.
  render: (args: ConfirmDialogArgs) => {
    const state = trackedObject<{ open: boolean; answer?: string }>({
      open: false,
    });
    const ask = () => {
      state.open = true;
    };
    const accept = () => {
      state.open = false;
      state.answer = 'yes';
      args.onAccept();
    };
    const cancel = () => {
      state.open = false;
      state.answer = 'no';
      args.onCancel();
    };

    return <template>
      <Button @onClick={{ask}}>Ask</Button>
      {{#if state.open}}
        <ConfirmDialog
          @type={{args.type}}
          @label={{args.label}}
          @header={{args.header}}
          @body={{args.body}}
          @cancelText={{args.cancelText}}
          @acceptText={{args.acceptText}}
          @onAccept={{accept}}
          @onCancel={{cancel}}
        />
      {{/if}}
      <p>answer: {{if state.answer state.answer "N/A"}}</p>
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'accepting closes the dialog',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Ask' }));
    const dialog = await canvas.findByRole('dialog');
    await expect(dialog).toHaveTextContent('This action cannot be undone.');
    await userEvent.click(canvas.getByRole('button', { name: 'Okay' }));
    await expect(args.onAccept).toHaveBeenCalledOnce();
    await expect(args.onCancel).not.toHaveBeenCalled();
    await expect(canvas.queryByRole('dialog')).toBeNull();
    await expect(canvas.getByText('answer: yes')).toBeInTheDocument();
  },
);

Default.test(
  'cancelling closes the dialog',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Ask' }));
    await canvas.findByRole('dialog');
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(args.onCancel).toHaveBeenCalledOnce();
    await expect(args.onAccept).not.toHaveBeenCalled();
    await expect(canvas.getByText('answer: no')).toBeInTheDocument();
  },
);

export const Danger = meta.story({
  args: {
    type: 'danger',
    label: 'Account resources',
    header: 'Are you sure you want to delete this custom domain?',
    body: 'Deleting the custom domain will remove it permanently.',
    acceptText: 'Delete',
  },
});

Danger.test(
  'labels the buttons with @acceptText and @cancelText',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Ask' }));
    await canvas.findByRole('dialog');
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));
    await expect(args.onAccept).toHaveBeenCalledOnce();
  },
);

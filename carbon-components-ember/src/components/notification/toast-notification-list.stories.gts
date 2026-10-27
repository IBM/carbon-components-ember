import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { expect, waitFor, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import Modal from '../modal.gts';
import Stack from '../stack.gts';
import ToastNotificationList from './toast-notification-list.gts';

import type NotificationService from '../../services/notifications.ts';

// Ember-only: Carbon React leaves showing toasts to the app.

class ToastsDemo extends Component {
  @service('carbon.notifications') declare notifications: NotificationService;

  saved = () => {
    this.notifications.success({
      title: 'Changes saved',
      subtitle: 'Your settings are up to date.',
    });
  };

  failed = () => {
    this.notifications.error({
      title: 'Upload failed',
      subtitle: 'The file is larger than 10 MB.',
    });
  };

  deleted = () => {
    const toast = this.notifications.info({
      title: 'Project deleted',
      actionButtonLabel: 'Undo',
      onActionButtonClick: () => this.notifications.remove(toast),
    });
  };

  <template>
    <Stack @orientation="horizontal" @gap={{3}}>
      <Button {{on "click" this.saved}}>Save</Button>
      <Button @kind="secondary" {{on "click" this.failed}}>Upload</Button>
      <Button @kind="tertiary" {{on "click" this.deleted}}>Delete</Button>
    </Stack>
    <ToastNotificationList />
  </template>
}

class ModalDemo extends Component {
  @service('carbon.notifications') declare notifications: NotificationService;

  open = tracked(true);

  show = () => (this.open.value = true);

  hide = () => (this.open.value = false);

  failed = () => {
    this.notifications.error({
      title: 'Upload failed',
      subtitle: 'The file is larger than 10 MB.',
    });
  };

  <template>
    <Button {{on "click" this.show}}>Upload files</Button>
    <Modal
      @open={{this.open.value}}
      @modalHeading="Upload files"
      @primaryButtonText="Upload"
      @secondaryButtonText="Cancel"
      @onRequestClose={{this.hide}}
      @onRequestSubmit={{this.failed}}
    >
      <p>Max file size is 10 MB.</p>
    </Modal>
    <ToastNotificationList />
  </template>
}

const meta = preview.meta({
  title: 'Components/Notifications/ToastNotificationList',
  component: ToastNotificationList,
  parameters: {
    docs: {
      description: {
        component:
          "Shows toasts from anywhere in an app. Render a `ToastNotificationList` once, in the application template, and add toasts through the `carbon.notifications` service: `info`, `success`, `warning` and `error` take a `ToastNotification`'s arguments and return the toast, `add` takes its `kind` too, and `remove` and `clear` close toasts. A toast with an `actionButtonLabel` is an `ActionableNotification`, which takes focus. Toasts stack at the top right, newest first; while a `Modal` is open, the list moves into it. `info` and `success` toasts close after 5 seconds unless they set a `timeout`; errors, warnings and toasts with an action stay until closed.",
      },
      story: { inline: false, iframeHeight: '320px' },
    },
  },
  render: () => <template><ToastsDemo /></template>,
});

export const Default = meta.story();

Default.test(
  'shows toasts from the service, newest first, and closes them',
  async ({ canvas, canvasElement, userEvent }) => {
    const list = within(
      canvasElement.ownerDocument.querySelector<HTMLElement>(
        '.cds--ember-toast-notification-list',
      )!,
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Upload' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    const [first, second] = list.getAllByRole('status');
    await expect(first).toHaveTextContent('Changes saved');
    await expect(second).toHaveTextContent('Upload failed');

    await userEvent.click(
      within(second!).getByRole('button', { name: 'close notification' }),
    );
    await waitFor(() => expect(list.getAllByRole('status')).toHaveLength(1));

    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));
    await userEvent.click(list.getByRole('button', { name: 'Undo' }));
    await expect(list.queryByRole('alertdialog')).toBeNull();
  },
);

// Ember-only: the list moves into an open Modal, so its toasts stay usable.
export const OverAModal = meta.story({
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: '640px' },
      description: {
        story:
          'While a `Modal` is open, the list moves into it: a toast raised then shows over the modal and can be read, focused and closed. It moves back when the modal closes.',
      },
    },
  },
  render: () => <template><ModalDemo /></template>,
});

OverAModal.test(
  'shows toasts over an open modal',
  async ({ canvasElement, userEvent }) => {
    const dialog = within(canvasElement.ownerDocument.querySelector('dialog')!);
    await userEvent.click(dialog.getByRole('button', { name: 'Upload' }));
    const toast = await dialog.findByRole('status');
    await expect(toast).toHaveTextContent('Upload failed');

    const close = within(toast).getByRole('button', {
      name: 'close notification',
    });
    close.focus();
    await expect(close).toHaveFocus();
    await userEvent.click(close);
    await waitFor(() => expect(dialog.queryByRole('status')).toBeNull());
    await expect(
      canvasElement.ownerDocument.querySelector('dialog'),
    ).toHaveProperty('open', true);
  },
);

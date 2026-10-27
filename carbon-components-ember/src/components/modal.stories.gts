import { trackedObject } from '@ember/reactive/collections';
import { modifier } from 'ember-modifier';
import { expect, fn, waitFor } from 'storybook/test';

import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import Button from './button.gts';
import Checkbox from './checkbox.gts';
import Dropdown from './dropdown.gts';
import Modal from './modal.gts';
import StructuredList from './structured-list.gts';
import TextArea from './text-area.gts';
import TextInput from './text-input.gts';

import type { ModalSignature } from './modal.gts';
import '#storybook/styles/modal.css';

// Carbon React parity gaps (Components/Modal):
// - The forms leave out Select, ComboBox and MultiSelect, still to add,
//   and CheckboxGroup, which isn't here yet.
// - No `numberOfButtons` control: set `secondaryButtons` instead.

type StoryArgs = ModalSignature['Args'];

// Each story opens its modal, as Carbon React's do, and has a button to open
// it again once closed.
function modalState(args: StoryArgs, open = true) {
  const state = trackedObject({ open });
  return {
    state,
    launch: () => {
      state.open = true;
    },
    close: (event: Event) => {
      state.open = false;
      args.onRequestClose?.(event);
    },
  };
}

const TLS_ITEMS = [
  { id: 'option-0', text: '1.0' },
  { id: 'option-1', text: '1.1' },
  { id: 'option-2', text: '1.2' },
];
const itemText = (item: { text: string }) => item.text;

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    docs: {
      // An open modal covers the page and makes the rest of it inert, so
      // each story gets its own iframe.
      story: { inline: false, iframeHeight: '640px' },
      description: {
        component:
          "Modals focus the user's attention exclusively on one task or piece of information. `Modal` is a native `<dialog>` opened with `showModal()`: it shows above the rest of the page, which is inert while it's open, and returns focus to where it was when it closes. It needs no element in the application template. Menus, portals and the `ToastNotificationList` render into the topmost open modal, so they can be used over it; anything else rendered outside it stays under it and can't be used while it's open.\n\n`@open` shows it. Closing is up to you: the close button, Escape, the secondary button and, for a passive modal, a click outside call `@onRequestClose`, and the primary button calls `@onRequestSubmit`.",
      },
    },
    controls: {
      exclude: [
        'id',
        'open',
        'secondaryButtons',
        'secondaryButtonText',
        'selectorPrimaryFocus',
      ],
    },
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
  args: {
    onRequestClose: fn(),
    onRequestSubmit: fn(),
  },
});

export const Default = meta.story({
  args: {
    modalHeading: 'Add a custom domain',
    primaryButtonText: 'Add',
    secondaryButtonText: 'Cancel',
  },
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    return <template>
      <Button {{on "click" launch}}>Launch modal</Button>
      <Modal
        @open={{state.open}}
        @onRequestClose={{close}}
        @onRequestSubmit={{args.onRequestSubmit}}
        @modalHeading={{args.modalHeading}}
        @modalLabel={{args.modalLabel}}
        @primaryButtonText={{args.primaryButtonText}}
        @secondaryButtonText={{args.secondaryButtonText}}
        @danger={{args.danger}}
        @alert={{args.alert}}
        @size={{args.size}}
        @preventCloseOnClickOutside={{args.preventCloseOnClickOutside}}
        aria-label="Modal content"
      >
        <p class="modal-story__intro">
          Custom domains direct requests for your apps in this Cloud Foundry
          organization to a URL that you own. A custom domain can be a shared
          domain, a shared subdomain, or a shared domain and host.
        </p>
        <TextInput
          @labelText="Domain name"
          @placeholder="For example, GitHub.com"
          class="modal-story__field"
          data-modal-primary-focus
        />
        <div class="modal-story__field">
          <Dropdown
            @titleText="TLS"
            @label="Option 1"
            @items={{TLS_ITEMS}}
            @itemToString={{itemText}}
          />
        </div>
        <Checkbox>
          I confirm domain ownership and accept IBM service terms and applicable
          charges.
        </Checkbox>
      </Modal>
    </template>;
  },
});

Default.test(
  'opens with the field focused, and Cancel asks to close',
  async ({ canvas, userEvent, args }) => {
    const dialog = await canvas.findByRole('dialog', { name: 'Modal content' });
    await expect(dialog).toHaveAttribute('open');
    await waitFor(() =>
      expect(canvas.getByLabelText('Domain name')).toHaveFocus(),
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(args.onRequestClose).toHaveBeenCalledOnce();
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Launch modal' }),
      ).toBeVisible(),
    );
  },
);

Default.test(
  'Add submits, and the modal stays open',
  async ({ canvas, userEvent, args }) => {
    const dialog = await canvas.findByRole('dialog', { name: 'Modal content' });
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }));
    await expect(args.onRequestSubmit).toHaveBeenCalledOnce();
    await expect(dialog).toHaveAttribute('open');
  },
);

export const FullWidth = meta.story({
  args: {
    modalHeading: 'Full width modal',
    modalLabel: 'An example of a modal with no padding',
    primaryButtonText: 'Add',
    secondaryButtonText: 'Cancel',
    isFullWidth: true,
  },
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    return <template>
      <Button {{on "click" launch}}>Launch modal</Button>
      <Modal
        @open={{state.open}}
        @onRequestClose={{close}}
        @onRequestSubmit={{args.onRequestSubmit}}
        @modalHeading={{args.modalHeading}}
        @modalLabel={{args.modalLabel}}
        @primaryButtonText={{args.primaryButtonText}}
        @secondaryButtonText={{args.secondaryButtonText}}
        @isFullWidth={{args.isFullWidth}}
        @size={{args.size}}
      >
        <StructuredList class="modal-story__list" as |SL|>
          <SL.Head>
            <SL.Row @head={{true}}>
              <SL.Cell @head={{true}} @noWrap={{true}}>Default size</SL.Cell>
              <SL.Cell @head={{true}} @noWrap={{true}}>Features</SL.Cell>
              <SL.Cell @head={{true}} @noWrap={{true}}>Pricing</SL.Cell>
            </SL.Row>
          </SL.Head>
          <SL.Body>
            <SL.Row>
              <SL.Cell @noWrap={{true}}>Lite</SL.Cell>
              <SL.Cell>2 vCPUs | 4GB RAM</SL.Cell>
              <SL.Cell>$0.12 USD / hourly</SL.Cell>
            </SL.Row>
            <SL.Row>
              <SL.Cell @noWrap={{true}}>Graduated tier</SL.Cell>
              <SL.Cell>2 vCPUs | 8GB RAM</SL.Cell>
              <SL.Cell>$0.13 USD / hourly</SL.Cell>
            </SL.Row>
            <SL.Row>
              <SL.Cell @noWrap={{true}}>Premium</SL.Cell>
              <SL.Cell>4 vCPUs | 10GB RAM</SL.Cell>
              <SL.Cell>$0.20 USD / hourly</SL.Cell>
            </SL.Row>
          </SL.Body>
        </StructuredList>
      </Modal>
    </template>;
  },
});

export const DangerModal = meta.story({
  args: {
    danger: true,
    modalHeading: 'Are you sure you want to delete this custom domain?',
    modalLabel: 'Account resources',
    primaryButtonText: 'Delete',
    secondaryButtonText: 'Cancel',
  },
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    return <template>
      <Button {{on "click" launch}}>Launch modal</Button>
      <Modal
        @open={{state.open}}
        @onRequestClose={{close}}
        @onRequestSubmit={{args.onRequestSubmit}}
        @danger={{args.danger}}
        @dangerDescription={{args.dangerDescription}}
        @modalHeading={{args.modalHeading}}
        @modalLabel={{args.modalLabel}}
        @primaryButtonText={{args.primaryButtonText}}
        @secondaryButtonText={{args.secondaryButtonText}}
        @size={{args.size}}
      >
        <p>
          Check for dependencies on the domain before deletion. For instance, if
          the domain is used as a primary domain for users or if it's associated
          with critical applications or services, those connections will need to
          be removed or reconfigured first.
        </p>
      </Modal>
    </template>;
  },
});

DangerModal.test('opens with Cancel focused', async ({ canvas }) => {
  await canvas.findByRole('dialog');
  await waitFor(() =>
    expect(canvas.getByRole('button', { name: 'Cancel' })).toHaveFocus(),
  );
});

export const WithScrollingContent = meta.story({
  args: {
    hasScrollingContent: true,
    modalHeading: 'Add a custom domain',
    modalLabel: 'Account resources',
    primaryButtonText: 'Add',
    secondaryButtonText: 'Cancel',
  },
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    return <template>
      <Button {{on "click" launch}}>Launch modal</Button>
      <Modal
        @open={{state.open}}
        @onRequestClose={{close}}
        @onRequestSubmit={{args.onRequestSubmit}}
        @hasScrollingContent={{args.hasScrollingContent}}
        @modalHeading={{args.modalHeading}}
        @modalLabel={{args.modalLabel}}
        @primaryButtonText={{args.primaryButtonText}}
        @secondaryButtonText={{args.secondaryButtonText}}
        @size={{args.size}}
      >
        <p class="modal-story__paragraph">
          Custom domains direct requests for your apps in this Cloud Foundry
          organization to a URL that you own. A custom domain can be a shared
          domain, a shared subdomain, or a shared domain and host.
        </p>
        <p class="modal-story__intro">
          Domain mappings provide the URL route to your Code Engine application
          or function within a project. With Code Engine, these mappings are
          automatically created, by default, whenever you deploy an application
          or create a function. However, you can map your own custom domain to a
          Code Engine application or function. This option routes requests from
          your custom URL to your application or function. You can use the Code
          Engine CLI.
        </p>
        <TextInput
          @labelText="Domain name"
          @placeholder="For example, GitHub.com"
          class="modal-story__field"
          data-modal-primary-focus
        />
      </Modal>
    </template>;
  },
});

WithScrollingContent.test(
  'makes the content a focusable region',
  async ({ canvas }) => {
    const region = await canvas.findByRole('region', {
      name: 'Account resources',
    });
    await expect(region).toHaveAttribute('tabindex', '0');
  },
);

export const WithStateManager = meta.story({
  args: {
    modalHeading: 'Add a custom domain',
    modalLabel: 'Account resources',
    primaryButtonText: 'Add',
    secondaryButtonText: 'Cancel',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The modal starts closed, and the button opens it. Closing it returns focus to the button, as Carbon React does with `launcherButtonRef`.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args, false);
    return <template>
      <Button {{on "click" launch}}>Launch modal</Button>
      <Modal
        @open={{state.open}}
        @onRequestClose={{close}}
        @onRequestSubmit={{args.onRequestSubmit}}
        @modalHeading={{args.modalHeading}}
        @modalLabel={{args.modalLabel}}
        @primaryButtonText={{args.primaryButtonText}}
        @secondaryButtonText={{args.secondaryButtonText}}
        @size={{args.size}}
      >
        <p class="modal-story__paragraph">
          Custom domains direct requests for your apps in this Cloud Foundry
          organization to a URL that you own. A custom domain can be a shared
          domain, a shared subdomain, or a shared domain and host.
        </p>
        <TextInput
          @labelText="Domain name"
          @placeholder="e.g. github.com"
          data-modal-primary-focus
        />
      </Modal>
    </template>;
  },
});

WithStateManager.test(
  'returns focus to the launcher',
  async ({ canvas, userEvent }) => {
    const launcher = canvas.getByRole('button', { name: 'Launch modal' });
    await userEvent.click(launcher);
    const dialog = await canvas.findByRole('dialog');
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(launcher).toHaveFocus());
  },
);

export const PassiveModal = meta.story({
  args: {
    passiveModal: true,
    modalHeading: 'You are now signed out.',
  },
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    return <template>
      <Button {{on "click" launch}}>Launch modal</Button>
      <Modal
        @open={{state.open}}
        @onRequestClose={{close}}
        @passiveModal={{args.passiveModal}}
        @modalHeading={{args.modalHeading}}
        @modalLabel={{args.modalLabel}}
        @modalAriaLabel={{args.modalAriaLabel}}
        @closeButtonLabel={{args.closeButtonLabel}}
        @hasScrollingContent={{args.hasScrollingContent}}
        @isFullWidth={{args.isFullWidth}}
        @preventCloseOnClickOutside={{args.preventCloseOnClickOutside}}
        @size={{args.size}}
      />
    </template>;
  },
});

PassiveModal.test('has no buttons but the close button', async ({ canvas }) => {
  const dialog = await canvas.findByRole('dialog', {
    name: 'You are now signed out.',
  });
  await expect(dialog.querySelector('.cds--modal-footer')).toBeNull();
  await waitFor(() =>
    expect(canvas.getByRole('button', { name: 'Close' })).toHaveFocus(),
  );
});

// Carbon React's story fakes a two-second delete.
const DELETE_DURATION_MS = 2000;

export const WithInlineLoading = meta.story({
  args: {
    danger: true,
    modalHeading: 'Are you sure you want to delete this custom domain?',
    modalLabel: 'Account resources',
    primaryButtonText: 'Delete',
    secondaryButtonText: 'Cancel',
  },
  parameters: {
    controls: { exclude: ['loadingStatus', 'loadingDescription'] },
  },
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    const loading = trackedObject<{
      status: 'inactive' | 'active' | 'finished';
      description: string;
    }>({ status: 'inactive', description: 'Deleting...' });
    let timer: ReturnType<typeof setTimeout> | undefined;
    const submit = (event: Event) => {
      args.onRequestSubmit?.(event);
      loading.status = 'active';
      timer = setTimeout(() => {
        loading.description = 'Deleted!';
        loading.status = 'finished';
      }, DELETE_DURATION_MS);
    };
    const reset = () => {
      loading.status = 'inactive';
      loading.description = 'Deleting...';
    };
    const cleanup = modifier(() => () => clearTimeout(timer));
    return <template>
      <div {{cleanup}}>
        <Button {{on "click" launch}}>Launch modal</Button>
        <Modal
          @open={{state.open}}
          @onRequestClose={{close}}
          @onRequestSubmit={{submit}}
          @onLoadingSuccess={{reset}}
          @loadingStatus={{loading.status}}
          @loadingDescription={{loading.description}}
          @danger={{args.danger}}
          @modalHeading={{args.modalHeading}}
          @modalLabel={{args.modalLabel}}
          @primaryButtonText={{args.primaryButtonText}}
          @secondaryButtonText={{args.secondaryButtonText}}
          @size={{args.size}}
        />
      </div>
    </template>;
  },
});

WithInlineLoading.test(
  'shows the loading status on the primary button',
  async ({ canvas, userEvent }) => {
    await canvas.findByRole('dialog');
    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));
    await expect(
      canvas.getByRole('button', { name: /Deleting/ }),
    ).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  },
);

export const WithAILabel = meta.story({
  args: {
    modalHeading: 'Add a custom domain',
    modalLabel: 'Account resources',
    primaryButtonText: 'Add',
    secondaryButtonText: 'Cancel',
  },
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    return <template>
      <Button {{on "click" launch}}>Launch modal</Button>
      <Modal
        @open={{state.open}}
        @onRequestClose={{close}}
        @onRequestSubmit={{args.onRequestSubmit}}
        @modalHeading={{args.modalHeading}}
        @modalLabel={{args.modalLabel}}
        @primaryButtonText={{args.primaryButtonText}}
        @secondaryButtonText={{args.secondaryButtonText}}
        @size={{args.size}}
      >
        <:default>
          <p class="modal-story__intro">
            Custom domains direct requests for your apps in this Cloud Foundry
            organization to a URL that you own. A custom domain can be a shared
            domain, a shared subdomain, or a shared domain and host.
          </p>
          <TextInput
            @labelText="Domain name"
            @placeholder="For example, GitHub.com"
            class="modal-story__field"
            data-modal-primary-focus
          />
          <TextArea @labelText="Comments" />
        </:default>
        <:decorator as |AILabel|>
          <AILabel @align="bottom-start" as |label|>
            <label.Content><AIExplanation /></label.Content>
          </AILabel>
        </:decorator>
      </Modal>
    </template>;
  },
});

WithAILabel.test('shows the AI label in the header', async ({ canvas }) => {
  const dialog = await canvas.findByRole('dialog');
  await expect(
    dialog.querySelector('.cds--modal--inner__decorator .cds--ai-label'),
  ).not.toBeNull();
});

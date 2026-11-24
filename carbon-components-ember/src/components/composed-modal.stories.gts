import { trackedObject } from '@ember/reactive/collections';
import { modifier } from 'ember-modifier';
import { expect, fn, waitFor } from 'storybook/test';

import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import Button from './button.gts';
import ComposedModal from './composed-modal.gts';
import Dropdown from './dropdown.gts';
import MultiSelect from './multi-select.gts';
import Select from './select.gts';
import StructuredListBody from './structured-list/structured-list-body.gts';
import StructuredListCell from './structured-list/structured-list-cell.gts';
import StructuredListHead from './structured-list/structured-list-head.gts';
import StructuredListWrapper from './structured-list/structured-list-wrapper.gts';
import TextInput from './text-input.gts';

import type { ComposedModalSignature } from './composed-modal.gts';
import type { ModalFooterSignature } from './composed-modal/modal-footer.gts';
import type { ModalHeaderSignature } from './composed-modal/modal-header.gts';
import type { TOC } from '@ember/component/template-only';
import '#storybook/styles/composed-modal.css';

// Carbon React parity gaps (Components/ComposedModal):
// - The Feature Flags pages aren't ported: the native <dialog> is always on,
//   and focus stays in it without sentinels. ComposedModalPresence, which
//   keeps a closing modal rendered for its exit animation, isn't here yet.

type StoryArgs = ComposedModalSignature['Args'] &
  Pick<ModalHeaderSignature['Args'], 'label' | 'title' | 'iconDescription'> &
  Pick<
    ModalFooterSignature['Args'],
    | 'primaryButtonText'
    | 'secondaryButtonText'
    | 'primaryButtonDisabled'
    | 'loadingStatus'
    | 'loadingDescription'
    | 'loadingIconDescription'
  >;

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
      args.onClose?.(event);
    },
  };
}

const ITEMS = [
  { id: 'one', text: 'one' },
  { id: 'two', text: 'two' },
];
const OPTIONS = [
  { id: 'option-1', text: 'Option 1' },
  { id: 'option-2', text: 'Option 2' },
];
const itemText = (item: { text: string }) => item.text;

const INTRO =
  'Custom domains direct requests for your apps in this Cloud Foundry organization to a URL that you own. A custom domain can be a shared domain, a shared subdomain, or a shared domain and host.';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eu nibh odio. Nunc a consequat est, id porttitor sapien. Proin vitae leo vitae orci tincidunt auctor eget eget libero. Ut tincidunt ultricies fringilla. Aliquam erat volutpat. Aenean arcu odio, elementum vel vehicula vitae, porttitor ac lorem. Sed viverra elit ac risus tincidunt fermentum. Ut sollicitudin nibh id risus ornare ornare. Etiam gravida orci ut lectus dictum, quis ultricies felis mollis. Mauris nec commodo est, nec faucibus nibh. Nunc commodo ante quis pretium consectetur. Ut ac nisl vitae mi mattis vulputate a at elit. Nullam porttitor ex eget mi feugiat mattis. Nunc non sodales magna. Proin ornare tellus quis hendrerit egestas. Donec pharetra leo nec molestie sollicitudin.';

const ROW =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor sed, aliquet bibendum augue. Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor. Pellentesque vulputate nisl a porttitor interdum.';

// The domain form most of Carbon React's stories put in the body. `@spaced`
// leaves room after it for more fields.
const DomainForm: TOC<{ Args: { spaced?: boolean } }> = <template>
  <TextInput
    @labelText="Domain name"
    @placeholder="e.g. github.com"
    class="composed-modal-story__field"
    data-modal-primary-focus
  />
  <div class={{if @spaced "composed-modal-story__field"}}>
    <Select @labelText="Region" @defaultValue="us-south" as |SelectItem|>
      <SelectItem @value="us-south" @text="US South" />
      <SelectItem @value="us-east" @text="US East" />
    </Select>
  </div>
</template>;

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/ComposedModal',
  component: ComposedModal,
  parameters: {
    docs: {
      // An open modal covers the page and makes the rest of it inert, so
      // each story gets its own iframe.
      story: { inline: false, iframeHeight: '640px' },
      description: {
        component:
          "A modal put together from parts: `ComposedModal` yields a `ModalHeader`, a `ModalBody` and a `ModalFooter` (`as |ModalHeader ModalBody ModalFooter|`), each already connected to it. Like `Modal`, it's a native `<dialog>` opened with `showModal()`, so the rest of the page is inert while it's open, and focus goes back to where it was when it closes.\n\n`@open` opens it. Unlike `Modal`, it closes itself: the close button, Escape, the footer's secondary button and, for a passive modal (one with no `ModalFooter`), a click outside call `@onClose` and close it, unless `@onClose` returns `false`. It opens again when `@open` does.",
      },
    },
    controls: {
      exclude: ['containerClassName', 'open', 'selectorPrimaryFocus'],
    },
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    loadingStatus: {
      control: 'select',
      options: ['inactive', 'active', 'finished', 'error'],
    },
  },
  args: {
    danger: false,
    isFullWidth: false,
    preventCloseOnClickOutside: false,
    label: 'Account resources',
    title: 'Add a custom domain',
    iconDescription: 'Close the modal',
    primaryButtonText: 'Add',
    secondaryButtonText: 'Cancel',
    primaryButtonDisabled: false,
    loadingStatus: 'inactive',
    loadingDescription: 'Deleting...',
    loadingIconDescription: 'Loading',
    onClose: fn(),
  },
});

export const Default = meta.story({
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    return <template>
      <Button {{on "click" launch}}>Launch composed modal</Button>
      <ComposedModal
        @open={{state.open}}
        @onClose={{close}}
        @danger={{args.danger}}
        @isFullWidth={{args.isFullWidth}}
        @size={{args.size}}
        @preventCloseOnClickOutside={{args.preventCloseOnClickOutside}}
        as |ModalHeader ModalBody ModalFooter|
      >
        <ModalHeader
          @label={{args.label}}
          @title={{args.title}}
          @iconDescription={{args.iconDescription}}
        />
        <ModalBody>
          <p class="composed-modal-story__paragraph">{{INTRO}}</p>
          <DomainForm />
        </ModalBody>
        <ModalFooter
          @primaryButtonText={{args.primaryButtonText}}
          @secondaryButtonText={{args.secondaryButtonText}}
          @primaryButtonDisabled={{args.primaryButtonDisabled}}
          @loadingStatus={{args.loadingStatus}}
          @loadingDescription={{args.loadingDescription}}
          @loadingIconDescription={{args.loadingIconDescription}}
        />
      </ComposedModal>
    </template>;
  },
});

Default.test(
  'opens with the field focused, and Cancel closes it',
  async ({ canvas, userEvent, args }) => {
    const dialog = await canvas.findByRole('dialog', {
      name: 'Account resources',
    });
    await expect(dialog).toHaveAttribute('open');
    await waitFor(() =>
      expect(canvas.getByLabelText('Domain name')).toHaveFocus(),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await expect(args.onClose).toHaveBeenCalled();
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
  },
);

export const FullWidth = meta.story({
  args: {
    isFullWidth: true,
    label: 'An example of a modal with no padding',
    title: 'Full Width Modal',
  },
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    return <template>
      <Button {{on "click" launch}}>Launch composed modal</Button>
      <ComposedModal
        @open={{state.open}}
        @onClose={{close}}
        @isFullWidth={{args.isFullWidth}}
        @size={{args.size}}
        as |ModalHeader ModalBody ModalFooter|
      >
        <ModalHeader
          @label={{args.label}}
          @title={{args.title}}
          @iconDescription={{args.iconDescription}}
        />
        <ModalBody>
          <StructuredListWrapper as |StructuredListRow|>
            <StructuredListHead>
              <StructuredListRow @head={{true}}>
                <StructuredListCell @head={{true}} @noWrap={{true}}>Column A</StructuredListCell>
                <StructuredListCell @head={{true}} @noWrap={{true}}>Column B</StructuredListCell>
                <StructuredListCell @head={{true}} @noWrap={{true}}>Column C</StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              <StructuredListRow>
                <StructuredListCell @noWrap={{true}}>Row 1</StructuredListCell>
                <StructuredListCell>Row 1</StructuredListCell>
                <StructuredListCell>{{ROW}}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell @noWrap={{true}}>Row 2</StructuredListCell>
                <StructuredListCell>Row 2</StructuredListCell>
                <StructuredListCell>{{ROW}}</StructuredListCell>
              </StructuredListRow>
              <StructuredListRow>
                <StructuredListCell @noWrap={{true}}>Row 3</StructuredListCell>
                <StructuredListCell>Row 3</StructuredListCell>
                <StructuredListCell>{{ROW}}</StructuredListCell>
              </StructuredListRow>
            </StructuredListBody>
          </StructuredListWrapper>
        </ModalBody>
        <ModalFooter
          @primaryButtonText={{args.primaryButtonText}}
          @secondaryButtonText={{args.secondaryButtonText}}
          @primaryButtonDisabled={{args.primaryButtonDisabled}}
        />
      </ComposedModal>
    </template>;
  },
});

export const PassiveModal = meta.story({
  args: {
    label: undefined,
    title: 'You have been successfully signed out',
  },
  parameters: {
    controls: {
      include: [
        'preventCloseOnClickOutside',
        'size',
        'title',
        'iconDescription',
      ],
    },
  },
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    return <template>
      <Button {{on "click" launch}}>Launch composed modal</Button>
      <ComposedModal
        @open={{state.open}}
        @onClose={{close}}
        @size={{args.size}}
        @preventCloseOnClickOutside={{args.preventCloseOnClickOutside}}
        as |ModalHeader ModalBody|
      >
        <ModalHeader
          @label={{args.label}}
          @title={{args.title}}
          @iconDescription={{args.iconDescription}}
        />
        <ModalBody />
      </ComposedModal>
    </template>;
  },
});

PassiveModal.test('has no buttons but the close button', async ({ canvas }) => {
  const dialog = await canvas.findByRole('dialog', {
    name: 'You have been successfully signed out',
  });
  await expect(dialog.querySelector('.cds--modal-footer')).toBeNull();
  await waitFor(() =>
    expect(
      canvas.getByRole('button', { name: 'Close the modal' }),
    ).toHaveFocus(),
  );
});

export const WithStateManager = meta.story({
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
      <Button {{on "click" launch}}>Launch composed modal</Button>
      <ComposedModal
        @open={{state.open}}
        @onClose={{close}}
        @size={{args.size}}
        as |ModalHeader ModalBody ModalFooter|
      >
        <ModalHeader
          @label={{args.label}}
          @title={{args.title}}
          @iconDescription={{args.iconDescription}}
        />
        <ModalBody>
          <p class="composed-modal-story__paragraph">{{INTRO}}</p>
          <DomainForm />
        </ModalBody>
        <ModalFooter
          @primaryButtonText={{args.primaryButtonText}}
          @secondaryButtonText={{args.secondaryButtonText}}
        />
      </ComposedModal>
    </template>;
  },
});

WithStateManager.test(
  'returns focus to the launcher',
  async ({ canvas, userEvent }) => {
    const launcher = canvas.getByRole('button', {
      name: 'Launch composed modal',
    });
    await userEvent.click(launcher);
    const dialog = await canvas.findByRole('dialog');
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Close the modal' }),
    );
    await waitFor(() => expect(launcher).toHaveFocus());
  },
);

export const WithScrollingContent = meta.story({
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    return <template>
      <Button {{on "click" launch}}>Launch composed modal</Button>
      <ComposedModal
        @open={{state.open}}
        @onClose={{close}}
        @size={{args.size}}
        as |ModalHeader ModalBody ModalFooter|
      >
        <ModalHeader
          @label={{args.label}}
          @title={{args.title}}
          @iconDescription={{args.iconDescription}}
        />
        <ModalBody @hasScrollingContent={{true}}>
          <p class="composed-modal-story__paragraph">{{INTRO}}</p>
          <p class="composed-modal-story__paragraph">{{LOREM}}</p>
          <DomainForm @spaced={{true}} />
          <div class="composed-modal-story__field">
            <Dropdown
              @titleText="Dropdown"
              @label="Dropdown"
              @items={{ITEMS}}
              @itemToString={{itemText}}
            />
          </div>
          <MultiSelect
            @titleText="Multiselect"
            @label="Multiselect"
            @items={{OPTIONS}}
            @itemToString={{itemText}}
          />
        </ModalBody>
        <ModalFooter
          @primaryButtonText={{args.primaryButtonText}}
          @secondaryButtonText={{args.secondaryButtonText}}
        />
      </ComposedModal>
    </template>;
  },
});

WithScrollingContent.test(
  "its body is a region named after the header's label",
  async ({ canvas }) => {
    await expect(
      await canvas.findByRole('region', { name: 'Account resources' }),
    ).toHaveClass('cds--modal-scroll-content');
  },
);

// Carbon React's story fakes a two-second submit.
const SUBMIT_DURATION_MS = 2000;

export const WithInlineLoading = meta.story({
  parameters: {
    controls: {
      exclude: [
        'containerClassName',
        'loadingStatus',
        'loadingDescription',
        'loadingIconDescription',
        'open',
        'selectorPrimaryFocus',
      ],
    },
  },
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    const loading = trackedObject<{
      status: 'inactive' | 'active' | 'finished';
      description: string;
    }>({ status: 'inactive', description: 'Submitting...' });
    let timer: ReturnType<typeof setTimeout> | undefined;
    const submit = () => {
      loading.status = 'active';
      timer = setTimeout(() => {
        loading.description = 'Submitted!';
        loading.status = 'finished';
      }, SUBMIT_DURATION_MS);
    };
    const reset = () => {
      loading.status = 'inactive';
      loading.description = 'Submitting...';
    };
    const cleanup = modifier(() => () => clearTimeout(timer));
    return <template>
      <div {{cleanup}}>
        <Button {{on "click" launch}}>Launch composed modal</Button>
        <ComposedModal
          @open={{state.open}}
          @onClose={{close}}
          @size={{args.size}}
          as |ModalHeader ModalBody ModalFooter|
        >
          <ModalHeader
            @label={{args.label}}
            @title={{args.title}}
            @iconDescription={{args.iconDescription}}
          />
          <ModalBody>
            <p class="composed-modal-story__paragraph">{{INTRO}}</p>
            <DomainForm />
          </ModalBody>
          <ModalFooter
            @primaryButtonText={{args.primaryButtonText}}
            @secondaryButtonText={{args.secondaryButtonText}}
            @primaryButtonDisabled={{args.primaryButtonDisabled}}
            @loadingStatus={{loading.status}}
            @loadingDescription={{loading.description}}
            @loadingIconDescription={{args.loadingIconDescription}}
            @onRequestSubmit={{submit}}
            @onLoadingSuccess={{reset}}
          />
        </ComposedModal>
      </div>
    </template>;
  },
});

WithInlineLoading.test(
  'shows the loading status on the primary button',
  async ({ canvas, userEvent }) => {
    await canvas.findByRole('dialog');
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }));
    await expect(
      canvas.getByRole('button', { name: /Submitting/ }),
    ).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  },
);

export const WithAILabel = meta.story({
  args: {
    primaryButtonText: 'Save',
  },
  render: (args: StoryArgs) => {
    const { state, launch, close } = modalState(args);
    return <template>
      <Button {{on "click" launch}}>Launch composed modal</Button>
      <ComposedModal
        @open={{state.open}}
        @onClose={{close}}
        @size={{args.size}}
      >
        <:default as |ModalHeader ModalBody ModalFooter|>
          <ModalHeader
            @label={{args.label}}
            @title={{args.title}}
            @iconDescription={{args.iconDescription}}
          />
          <ModalBody>
            <p class="composed-modal-story__paragraph">{{INTRO}}</p>
            <p class="composed-modal-story__paragraph">{{LOREM}}</p>
            <DomainForm />
          </ModalBody>
          <ModalFooter
            @primaryButtonText={{args.primaryButtonText}}
            @secondaryButtonText={{args.secondaryButtonText}}
          />
        </:default>
        <:decorator as |AILabel|>
          <AILabel @align="bottom-start" as |label|>
            <label.Content><AIExplanation /></label.Content>
          </AILabel>
        </:decorator>
      </ComposedModal>
    </template>;
  },
});

WithAILabel.test('shows the AI label in its corner', async ({ canvas }) => {
  const dialog = await canvas.findByRole('dialog', {
    name: 'Account resources',
  });
  await expect(dialog).toHaveClass('cds--modal--decorator');
  await expect(
    dialog.querySelector('.cds--modal--inner__decorator .cds--ai-label'),
  ).not.toBeNull();
});

import { trackedObject } from '@ember/reactive/collections';
import { modifier } from 'ember-modifier';
import { expect, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import Loading from './loading.gts';
import Modal from './modal.gts';

import type { LoadingSignature } from './loading.gts';

// Parity notes on Carbon React's Loading stories:
// - Like React's, they pass `withOverlay: false` except the overlay ones; the
//   component defaults it to `true` in both.
// - The overlay stories render in their own iframe on the docs page, since
//   the overlay covers the whole viewport.

const OVERLAY_LOADING_DURATION_MS = 2000;

// Shows the overlay for a couple of seconds; the pending timer is cleared if
// the story is torn down first.
function overlayState() {
  const state = trackedObject({ active: false, modalOpen: false });
  let timer: ReturnType<typeof setTimeout> | undefined;
  const startLoading = () => {
    clearTimeout(timer);
    state.active = true;
    timer = setTimeout(() => {
      state.active = false;
    }, OVERLAY_LOADING_DURATION_MS);
  };
  const cleanup = modifier(() => () => clearTimeout(timer));
  return { state, startLoading, cleanup };
}

const meta = preview.meta({
  title: 'Components/Loading',
  component: Loading,
  parameters: {
    docs: {
      description: {
        component:
          'A spinner for content that is loading. `@small` draws the small one, `@active={{false}}` stops it, and `@description` is its accessible name (`loading` by default). By default it covers the page with an overlay (`@withOverlay`): while active, the overlay is a dialog that takes focus when nothing has it, keeps it from the page behind (Tab included), and gives it back when it stops or goes. A modal opened over it keeps its own focus.',
      },
    },
  },
  args: {
    active: true,
    withOverlay: false,
    small: false,
    description: 'Loading account settings',
  },
});

export const Default = meta.story();

export const Small = meta.story({
  args: {
    small: true,
  },
});

export const Inactive = meta.story({
  name: 'Inactive (active=false)',
  args: {
    active: false,
  },
});

export const OverlayLoading = meta.story({
  parameters: {
    docs: { story: { inline: false, iframeHeight: '200px' } },
  },
  render: (args: LoadingSignature['Args']) => {
    const { state, startLoading, cleanup } = overlayState();

    return <template>
      <main {{cleanup}}>
        <Button {{on "click" startLoading}}>Start</Button>
        {{#if state.active}}
          <Loading
            @withOverlay={{true}}
            @small={{args.small}}
            @description={{args.description}}
          />
        {{/if}}
      </main>
    </template>;
  },
});

OverlayLoading.test(
  'shows the overlay for two seconds',
  async ({ canvas, canvasElement, userEvent }) => {
    await expect(
      canvasElement.querySelector('.cds--loading-overlay'),
    ).toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: 'Start' }));
    await expect(
      canvasElement.querySelector('.cds--loading-overlay'),
    ).toBeInTheDocument();
    await waitFor(
      () =>
        expect(canvasElement.querySelector('.cds--loading-overlay')).toBeNull(),
      { timeout: OVERLAY_LOADING_DURATION_MS + 1000 },
    );
  },
);

export const OverlayLoadingBehindModal = meta.story({
  name: 'Overlay Loading Behind Modal',
  parameters: {
    docs: { story: { inline: false, iframeHeight: '500px' } },
  },
  render: (args: LoadingSignature['Args']) => {
    const { state, startLoading, cleanup } = overlayState();
    const openModal = () => {
      state.modalOpen = true;
    };
    const closeModal = () => {
      state.modalOpen = false;
    };

    return <template>
      {{! Like Carbon React's story, this wraps in <main>. Both overlay stories
        render in their own iframe (docs.story.inline is false), so a page
        never has two. }}
      {{! eslint-disable-next-line ember/template-no-duplicate-landmark-elements }}
      <main {{cleanup}}>
        <Button {{on "click" openModal}}>Open modal</Button>
        <Modal
          @open={{state.modalOpen}}
          @modalHeading="Account settings"
          @primaryButtonText="Save"
          @secondaryButtonText="Cancel"
          @onRequestClose={{closeModal}}
          @onRequestSubmit={{startLoading}}
        >
          <p>
            Select
            <strong>Save</strong>
            to trigger a two second loading state behind this modal. The overlay
            is the layer below, so it leaves focus alone.
          </p>
        </Modal>
        {{#if state.active}}
          <Loading
            @withOverlay={{true}}
            @small={{args.small}}
            @description={{args.description}}
          />
        {{/if}}
      </main>
    </template>;
  },
});

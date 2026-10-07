import { trackedObject } from '@ember/reactive/collections';
import { modifier } from 'ember-modifier';
import { expect, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import Loading from './loading.gts';
import Modal from './modal.gts';

import type { Args as LoadingArgs } from './loading.gts';

// Parity notes on Carbon React's Loading stories:
// - React's `withOverlay` defaults to `false`; the Ember component defaults it
//   to `true`, so every story here sets it explicitly.
// - The `Inline` story covers Carbon React's separate `InlineLoading`
//   component, which the Ember component renders with `@inline={{true}}`.
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

export const Inline = meta.story({
  args: {
    inline: true,
    description: 'inline loading',
  },
});

export const OverlayLoading = meta.story({
  parameters: {
    docs: { story: { inline: false, iframeHeight: '200px' } },
  },
  render: (args: LoadingArgs) => {
    const { state, startLoading, cleanup } = overlayState();

    return <template>
      <main {{cleanup}}>
        <Button @onClick={{startLoading}}>Start</Button>
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

// The Ember Modal has no `open` arg or primary/secondary button props, so the
// modal is rendered conditionally and composed from its named blocks.
export const OverlayLoadingBehindModal = meta.story({
  name: 'Overlay Loading Behind Modal',
  parameters: {
    docs: { story: { inline: false, iframeHeight: '500px' } },
  },
  render: (args: LoadingArgs) => {
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
        <Button @onClick={{openModal}}>Open modal</Button>
        {{#if state.modalOpen}}
          <Modal @onClose={{closeModal}}>
            <:label></:label>
            <:header>Account settings</:header>
            <:body>
              <p>
                Select
                <strong>Save</strong>
                to trigger a two second loading state behind this modal. The
                overlay is the layer below, so it leaves focus alone.
              </p>
            </:body>
            <:footer>
              <button
                class="cds--btn cds--btn--secondary"
                type="button"
                {{on "click" closeModal}}
              >Cancel</button>
              <button
                class="cds--btn cds--btn--primary"
                type="button"
                {{on "click" startLoading}}
              >Save</button>
            </:footer>
          </Modal>
        {{/if}}
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

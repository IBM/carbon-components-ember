import { trackedObject } from '@ember/reactive/collections';
import { modifier } from 'ember-modifier';
import { expect, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Portal from './portal.gts';

// Carbon React has no Portal stories (its Portal is an internal utility), so
// these mirror the docs-app page.
//
// KNOWN COMPONENT BUG: portal.gts uses `{{#in-element}}` without
// `insertBefore=null`, which *replaces* the destination's content. With the
// default destination (`document.body`) that wipes the whole page, so there
// is no story for the default container until that is fixed.

const meta = preview.meta({
  title: 'Components/Portal',
  component: Portal,
  parameters: {
    docs: {
      description: {
        component:
          'Helper component for rendering content within a portal. By default, the portal renders into `document.body`. You can customize this behavior with the `@container` argument. Any content yielded to this component will be rendered inside of the container.',
      },
    },
  },
});

// Renders into a local element passed as `@container`, so the portaled
// content stays visible next to the story.
export const Default = meta.story({
  render: () => {
    const state = trackedObject<{ container?: HTMLElement }>({});
    const setContainer = modifier((element: HTMLElement) => {
      state.container = element;
    });

    return <template>
      <p>Portal target:</p>
      <div
        data-test-portal-target
        style="border: 1px dashed; padding: 1rem;"
        {{setContainer}}
      ></div>

      <div data-test-portal-origin>
        This content renders in place.
        {{#if state.container}}
          <Portal @container={{state.container}}>
            <div>This content is rendered into the target above via a Portal.</div>
          </Portal>
        {{/if}}
      </div>
    </template>;
  },
});

Default.test(
  'renders its block into the container',
  async ({ canvasElement }) => {
    const target = canvasElement.querySelector<HTMLElement>(
      '[data-test-portal-target]',
    )!;
    const origin = canvasElement.querySelector<HTMLElement>(
      '[data-test-portal-origin]',
    )!;
    await expect(
      within(target).getByText(/rendered into the target above/),
    ).toBeInTheDocument();
    await expect(
      within(origin).queryByText(/rendered into the target above/),
    ).toBeNull();
  },
);

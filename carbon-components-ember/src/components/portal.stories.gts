import { trackedObject } from '@ember/reactive/collections';
import { modifier } from 'ember-modifier';
import { expect, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Portal from './portal.gts';

// Carbon React has no Portal stories (its Portal is an internal utility), so
// these mirror the docs-app page.

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

// Without `@container`, the content is appended to `document.body`, after
// everything already there.
export const DocumentBody = meta.story({
  render: () => <template>
    <p>The portaled content is appended to the end of the page.</p>
    <Portal>
      <div data-test-body-portal>This content is rendered into document.body.</div>
    </Portal>
  </template>,
});

DocumentBody.test(
  'appends its block to document.body without replacing the page',
  async ({ canvasElement }) => {
    const content = document.querySelector('[data-test-body-portal]');
    await expect(content?.parentElement).toBe(document.body);
    await expect(document.body).toContainElement(canvasElement);
  },
);

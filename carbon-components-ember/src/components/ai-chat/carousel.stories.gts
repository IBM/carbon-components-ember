import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import AiChatCard from './card.gts';
import Carousel from './carousel.gts';

import type { CarouselResponse } from '@carbon/utilities/carousel';
import type { Args as CarouselArgs } from './carousel.gts';

// Mirrors `@carbon/ai-chat-components`' `Components/Carousel` stories
// (carousel/__stories__/carousel.stories.js): eight `AiChatCard`s as views.
// Upstream slots them through one wrapper `<div>`; here every card is a
// direct child of the default block, which is what makes each a view.

const CARDS = Array.from({ length: 8 }, (_, index) => `Card ${index + 1}`);

const meta = preview.meta({
  title: 'AI Chat/Carousel',
  component: Carousel,
  parameters: {
    // Known violations in the shared `Tooltip` wrapping the icon-only
    // previous/next buttons: `aria-prohibited-attr` (aria-labelledby on its
    // role-less trigger span) and `button-name` (`@previousBtnText`/
    // `@nextBtnText` never name the buttons).
    a11y: { test: 'todo' },
    docs: {
      description: {
        component: `\`Carousel\` is a view-stack carousel for
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat).
Each direct child passed to its default block becomes one view. Unlike the
rest of this addon's AI Chat components, navigation, the change event and the
\`N / M\` index readout aren't reimplemented here — they delegate directly to
\`@carbon/utilities\`'s \`initCarousel\`, the same view-stack engine upstream
itself uses.`,
      },
    },
  },
  args: {
    nextBtnText: 'Next',
    previousBtnText: 'Previous',
    onChange: fn(),
  },
  render: (args: CarouselArgs) => <template>
    <Carousel
      @nextBtnText={{args.nextBtnText}}
      @previousBtnText={{args.previousBtnText}}
      @onChange={{args.onChange}}
    >
      {{#each CARDS as |card|}}
        <AiChatCard>
          <:body><div style="padding: 1rem;">{{card}}</div></:body>
        </AiChatCard>
      {{/each}}
    </Carousel>
  </template>,
});

export const Default = meta.story();

Default.test(
  'moves to the next view',
  async ({ canvasElement, userEvent, args }) => {
    await waitFor(() => expect(args.onChange).toHaveBeenCalled());
    // The buttons have no accessible name (see the a11y todo).
    await userEvent.click(
      canvasElement.querySelector('.cds-aichat-carousel__next-btn')!,
    );
    await waitFor(() =>
      expect(args.onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ currentIndex: 1, totalViews: 8 }),
      ),
    );
  },
);

export const ReactingToViewChanges = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "`@onChange` is called with `initCarousel`'s response object whenever the active view finishes transitioning, including once on initial mount.",
      },
    },
  },
  render: (args: CarouselArgs) => {
    const state = trackedObject({ lastChange: 'none yet' });
    const onChange = (data: CarouselResponse) => {
      state.lastChange = `view ${data.currentIndex + 1} of ${data.totalViews}`;
      args.onChange?.(data);
    };

    return <template>
      <p>Last change: {{state.lastChange}}</p>
      <Carousel
        @previousBtnText={{args.previousBtnText}}
        @nextBtnText={{args.nextBtnText}}
        @onChange={{onChange}}
      >
        <div>View 1</div>
        <div>View 2</div>
      </Carousel>
    </template>;
  },
});

ReactingToViewChanges.test(
  'reports the active view',
  async ({ canvas, canvasElement, userEvent }) => {
    await expect(
      await canvas.findByText('Last change: view 1 of 2'),
    ).toBeVisible();
    await userEvent.click(
      canvasElement.querySelector('.cds-aichat-carousel__next-btn')!,
    );
    await expect(
      await canvas.findByText('Last change: view 2 of 2'),
    ).toBeVisible();
  },
);

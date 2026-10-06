import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import ProgressIndicator from './progress-indicator.gts';

import type { Args as ProgressIndicatorArgs } from './progress-indicator.gts';

// Parity gaps with Carbon React's ProgressIndicator stories:
// - `Skeleton`: there is no ProgressIndicatorSkeleton component.
// - ProgressStep has no `current` arg; the current step is always the one at
//   `@currentIndex`.

const meta = preview.meta({
  title: 'Components/ProgressIndicator',
  component: ProgressIndicator,
  args: {
    currentIndex: 0,
    spaceEqually: false,
    vertical: false,
  },
  render: (args: ProgressIndicatorArgs) => <template>
    <ProgressIndicator
      @currentIndex={{args.currentIndex}}
      @spaceEqually={{args.spaceEqually}}
      @vertical={{args.vertical}}
      @onChange={{args.onChange}}
      as |Step|
    >
      <Step
        @complete={{true}}
        @label="First step"
        @description="Step 1: Getting started with Carbon Design System"
        @secondaryLabel="Optional label"
      />
      <Step
        @label="Second step with tooltip"
        @description="Step 2: Getting started with Carbon Design System"
      />
      <Step
        @label="Third step with tooltip"
        @description="Step 3: Getting started with Carbon Design System"
      />
      <Step
        @label="Fourth step"
        @description="Step 4: Getting started with Carbon Design System"
        @invalid={{true}}
        @secondaryLabel="Example invalid step"
      />
      <Step
        @label="Fifth step"
        @description="Step 5: Getting started with Carbon Design System"
        @disabled={{true}}
      />
    </ProgressIndicator>
  </template>,
});

export const Default = meta.story();

// Clicking a step reports its index through `@onChange`; the story keeps the
// current index in local state so the indicator follows along.
export const Interactive = meta.story({
  args: {
    currentIndex: 1,
    onChange: fn(),
  },
  render: (args: ProgressIndicatorArgs) => {
    const state = trackedObject({ currentIndex: args.currentIndex ?? 1 });
    const onChange = (index: number) => {
      state.currentIndex = index;
      args.onChange?.(index);
    };

    return <template>
      <ProgressIndicator
        @currentIndex={{state.currentIndex}}
        @onChange={{onChange}}
        as |Step|
      >
        <Step @label="Click me" @description="Step 1: getting started" />
        <Step
          @label="Second step"
          @secondaryLabel="Optional"
          @description="Step 2: getting started"
        />
        <Step
          @label="Third step"
          @invalid={{true}}
          @description="Step 3: invalid step"
        />
        <Step
          @label="Fourth step"
          @disabled={{true}}
          @description="Step 4: disabled step"
        />
      </ProgressIndicator>
    </template>;
  },
});

Interactive.test(
  'reports the clicked step and makes it current',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByTitle('Click me'));
    await expect(args.onChange).toHaveBeenCalledWith(0);
    await expect(canvas.getByTitle('Click me').closest('li')).toHaveClass(
      'cds--progress-step--current',
    );
  },
);

export const Vertical = meta.story({
  args: {
    currentIndex: 1,
    vertical: true,
  },
});

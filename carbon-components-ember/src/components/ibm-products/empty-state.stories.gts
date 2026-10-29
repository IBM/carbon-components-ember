import { fn as spy } from 'storybook/test';

import preview from '#storybook/preview.ts';
import {
  EMPTY_STATE_ARGS,
  EMPTY_STATE_ARG_TYPES,
  actionFor,
  linkFor,
} from '#storybook/fixtures/empty-state.gts';
import EmptyState from './empty-state.gts';
import Information from '../icons/information.ts';
import Tooltip from '../tooltip.gts';

import type { EmptyStateStoryArgs } from '#storybook/fixtures/empty-state.gts';

// Mirrors Carbon for IBM Products' EmptyState stories. Parity gap: `@action` and
// `@link` take the Button and Link arguments an empty state needs (`kind`,
// `renderIcon`, `disabled`, `href` or a route, `target`), where React spreads
// every prop onto them.

type StoryArgs = EmptyStateStoryArgs & {
  illustration?: string;
  illustrationDescription?: string;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'IBM Products/Patterns/Prebuilt patterns/Empty states/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component:
          "Tells people why a page or panel has nothing to show and what they can do about it, as Carbon for IBM Products' `EmptyState`. Import it from `carbon-components-ember/ibm-products`. Give it a `@title`, a `@subtitle` (or a `<:subtitle>` block for links or a tooltip), an optional image with `@illustration`, and an `@action` button and `@link`, which can go to a route with `route`, `models` and `query`. For a ready-made illustration, use a variant such as `NoDataEmptyState`.",
      },
    },
  },
  args: { ...EMPTY_STATE_ARGS, onClick: spy() },
  argTypes: EMPTY_STATE_ARG_TYPES,
  render: (args: StoryArgs) => <template>
    <EmptyState
      @title={{args.title}}
      @subtitle={{args.subtitle}}
      @size={{args.size}}
      @illustration={{args.illustration}}
      @illustrationDescription={{args.illustrationDescription}}
      @illustrationPosition={{args.illustrationPosition}}
      @action={{actionFor args.action args.onClick}}
      @link={{linkFor args.link args.linkTarget}}
    />
  </template>,
});

export const Default = meta.story({});

export const WithTooltipInSubtitle = meta.story({
  render: (args: StoryArgs) => <template>
    <EmptyState @title={{args.title}} @size={{args.size}}>
      <:subtitle>
        Click
        <span>here</span>
        to upload your data
        <Tooltip
          @label="Facts and statistics collected together for reference or analysis"
        >
          <button type="button" class="cds--btn--ghost" aria-label="Data">
            <Information />
          </button>
        </Tooltip>
      </:subtitle>
    </EmptyState>
  </template>,
});

export const WithCustomIllustration = meta.story({
  args: {
    illustration: 'ibm-products/empty-state-bright-magnifying-glass.svg',
    illustrationDescription: 'Test alt text',
  },
});

export const WithAction = meta.story({ args: { action: 'text' } });

export const WithActionIconButton = meta.story({ args: { action: 'icon' } });

export const WithLink = meta.story({
  args: { link: true, linkTarget: '_blank' },
});

export const WithActionAndLink = meta.story({
  args: { action: 'icon', link: true },
});

import { fn as spy } from 'storybook/test';

import preview from '#storybook/preview.ts';
import {
  EMPTY_STATE_ARGS,
  EMPTY_STATE_ARG_TYPES,
  ILLUSTRATION_THEME_ARG_TYPE,
  actionFor,
  linkFor,
} from '#storybook/fixtures/empty-state.gts';
import ErrorEmptyState from './error-empty-state.gts';

import type { EmptyStateStoryArgs } from '#storybook/fixtures/empty-state.gts';

// Mirrors Carbon for IBM Products' ErrorEmptyState stories. Parity gap: `@action` and
// `@link` take the Button and Link arguments an empty state needs (`kind`,
// `renderIcon`, `disabled`, `href` or a route, `target`), where React spreads
// every prop onto them.

const meta = preview.type<{ args: EmptyStateStoryArgs }>().meta({
  title: 'IBM Products/Patterns/Prebuilt patterns/Empty states/ErrorEmptyState',
  component: ErrorEmptyState,
  parameters: {
    docs: {
      description: {
        component:
          "An `EmptyState` with Carbon for IBM Products' illustration for when something went wrong. Import it from `carbon-components-ember/ibm-products`. `@illustrationTheme` picks the light or dark illustration; the rest is `EmptyState`'s: `@title`, `@subtitle` (or a `<:subtitle>` block), `@size`, `@illustrationPosition`, and an `@action` and `@link`, which can go to a route.",
      },
    },
  },
  args: { ...EMPTY_STATE_ARGS, onClick: spy() },
  argTypes: {
    ...EMPTY_STATE_ARG_TYPES,
    illustrationTheme: ILLUSTRATION_THEME_ARG_TYPE,
  },
  render: (args: EmptyStateStoryArgs) => <template>
    <ErrorEmptyState
      @title={{args.title}}
      @subtitle={{args.subtitle}}
      @size={{args.size}}
      @illustrationPosition={{args.illustrationPosition}}
      @illustrationTheme={{args.illustrationTheme}}
      @action={{actionFor args.action args.onClick}}
      @link={{linkFor args.link args.linkTarget}}
    />
  </template>,
});

export const Default = meta.story({});

export const WithDarkModeIllustration = meta.story({
  args: { illustrationTheme: 'dark' },
});

export const WithAction = meta.story({ args: { action: 'text' } });

export const WithActionIconButton = meta.story({ args: { action: 'icon' } });

export const WithLink = meta.story({
  args: { link: true, linkTarget: '_blank' },
});

export const WithActionAndLink = meta.story({
  args: { action: 'icon', link: true },
});

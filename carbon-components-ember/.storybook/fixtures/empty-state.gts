import Add from '../../src/components/icons/add.ts';

import type {
  EmptyStateAction,
  EmptyStateLink,
} from '../../src/components/ibm-products/empty-state.gts';

// The args and helpers Carbon for IBM Products' empty state pages share.

export interface EmptyStateStoryArgs {
  title: string;
  subtitle?: string;
  size?: 'lg' | 'sm';
  illustrationPosition?: 'top' | 'right' | 'bottom' | 'left';
  illustrationTheme?: 'light' | 'dark';
  /** Story control: no button, a text one, or one with an icon. */
  action?: 'none' | 'text' | 'icon';
  /** Story control: shows the documentation link. */
  link?: boolean;
  /** Story control: the link's `target`. */
  linkTarget?: string;
  onClick: (event: MouseEvent) => void;
}

export const EMPTY_STATE_ARGS = {
  title: 'Start by adding data assets',
  subtitle: 'Click Upload assets to upload your data',
  action: 'none' as const,
  link: false,
};

export const EMPTY_STATE_ARG_TYPES = {
  size: { control: 'select', options: ['lg', 'sm'] },
  illustrationPosition: {
    control: 'select',
    options: ['top', 'right', 'bottom', 'left'],
  },
  action: {
    control: 'select',
    options: ['none', 'text', 'icon'],
    table: { category: 'story controls' },
  },
  link: { table: { category: 'story controls' } },
  onClick: { table: { category: 'story controls' } },
} as const;

export const actionFor = (
  kind: EmptyStateStoryArgs['action'],
  onClick: EmptyStateStoryArgs['onClick'],
): EmptyStateAction | undefined => {
  if (kind === 'text') return { text: 'Create new', onClick };
  if (kind === 'icon') {
    return {
      text: 'Create new',
      onClick,
      renderIcon: Add,
      iconDescription: 'Add icon',
    };
  }
  return undefined;
};

export const linkFor = (
  show?: boolean,
  target?: string,
): EmptyStateLink | undefined =>
  show
    ? {
        text: 'View documentation',
        href: 'https://www.carbondesignsystem.com',
        target,
      }
    : undefined;

/** The variants' illustration theme, which `EmptyState` itself lacks. */
export const ILLUSTRATION_THEME_ARG_TYPE = {
  control: 'select',
  options: ['light', 'dark'],
} as const;

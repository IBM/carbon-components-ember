// Components import their own stylesheets; apps get them all in
// `carbon-components-ember/styles.css`, after this one.
import '@carbon/styles/css/styles.css';

import addonA11y from '@storybook/addon-a11y';
import addonDocs from '@storybook/addon-docs';
import addonThemes, { DecoratorHelpers } from '@storybook/addon-themes';
import addonVitest from '@storybook/addon-vitest';
import { definePreview } from 'ember-storybook';
import { configure } from 'storybook/test';

import { createApp } from './app.ts';
import theme from './theme.ts';

import type Owner from '@ember/owner';
import type ThemeService from '../src/services/theme.ts';
import type { CarbonTheme } from '../src/utils/theme.ts';

// Testing Library's 1s default for `waitFor`/`findBy*` is too short on CI for
// media metadata.
configure({ asyncUtilTimeout: 5000 });

const THEMES: Record<string, CarbonTheme> = {
  White: 'white',
  'Gray 10': 'g10',
  'Gray 90': 'g90',
  'Gray 100': 'g100',
};

// The theme toolbar, from addon-themes.
DecoratorHelpers.initializeThemeState(Object.keys(THEMES), 'White');

export default definePreview({
  addons: [addonDocs(), addonA11y(), addonThemes(), addonVitest()],

  parameters: {
    // Accessibility violations (axe) fail the story tests.
    a11y: {
      test: 'error',
    },
    docs: {
      codePanel: true,
      theme,
    },
    ember: {
      app: createApp,
      // The toolbar's theme is the app's, as Carbon React's Storybook wraps
      // stories in its `GlobalTheme`.
      updateGlobals: (globals: Record<string, unknown>, owner: Owner) => {
        const service = owner.lookup('service:carbon.theme') as ThemeService;
        service.theme = THEMES[globals.theme as string] ?? 'white';
      },
    },
  },

  tags: ['autodocs', 'vitest'],
});

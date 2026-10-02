import '@carbon/styles/css/styles.css';
// The addon's own stylesheet, loaded the way a consuming app loads
// `carbon-components-ember/styles.scss`.
import '../src/styles/index.scss';

import addonA11y from '@storybook/addon-a11y';
import addonDocs from '@storybook/addon-docs';
import addonThemes, { withThemeByClassName } from '@storybook/addon-themes';
import addonVitest from '@storybook/addon-vitest';
import { definePreview } from 'ember-storybook';

import { createApp } from './app.ts';

export default definePreview({
  addons: [addonDocs(), addonA11y(), addonThemes(), addonVitest()],

  // Carbon's theme classes set every `--cds-*` token plus the page
  // background, text color and color-scheme.
  decorators: [
    withThemeByClassName({
      themes: {
        White: 'cds--white',
        'Gray 10': 'cds--g10',
        'Gray 90': 'cds--g90',
        'Gray 100': 'cds--g100',
      },
      defaultTheme: 'White',
      parentSelector: 'html',
    }),
  ],

  parameters: {
    // Accessibility violations (axe) fail the story tests.
    a11y: {
      test: 'error',
    },
    docs: {
      codePanel: true,
    },
    ember: {
      app: createApp,
    },
  },

  tags: ['autodocs', 'vitest'],
});

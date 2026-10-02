import '@carbon/styles/css/styles.css';
// The addon's own stylesheet, loaded the way a consuming app loads
// `carbon-components-ember/styles.scss`.
import '../src/styles/index.scss';

import addonA11y from '@storybook/addon-a11y';
import addonDocs from '@storybook/addon-docs';
import addonVitest from '@storybook/addon-vitest';
import { definePreview } from 'ember-storybook';

import { createApp } from './app.ts';

export default definePreview({
  addons: [addonDocs(), addonA11y(), addonVitest()],

  parameters: {
    docs: {
      codePanel: true,
    },
    ember: {
      app: createApp,
    },
  },

  tags: ['autodocs', 'vitest'],
});

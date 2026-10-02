import '@carbon/styles/css/styles.css';
// The addon's own stylesheet, loaded the way a consuming app loads
// `carbon-components-ember/styles.scss`.
import '../src/styles/index.scss';

import { createApp } from './app.ts';

import type { Preview } from 'ember-storybook';

const preview: Preview = {
  parameters: {
    docs: {
      codePanel: true,
    },
    ember: {
      app: createApp,
    },
  },

  tags: ['autodocs', 'vitest'],
};

export default preview;

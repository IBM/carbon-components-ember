import { mergeConfig } from 'vite';

import { defineMain } from 'ember-storybook/node';

export default defineMain({
  stories: ['./introduction.mdx', '../src/**/*.stories.g(j|t)s'],

  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-vitest',
  ],

  framework: 'ember-storybook',

  // ember-basic-dropdown (behind Select, Dropdown, ...) renders its content
  // into this element, which apps add to their application template.
  previewBody: (body) => `${body}
    <div id="ember-basic-dropdown-wormhole"></div>
  `,

  // Vite's dev-time dependency pre-bundling can't resolve the framework's
  // `virtual:ember-storybook` module when the framework comes from npm, so
  // serve it unbundled like the rest of the Ember code.
  viteFinal: (config) =>
    mergeConfig(config, {
      optimizeDeps: { exclude: ['ember-storybook'] },
    }),

  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
});

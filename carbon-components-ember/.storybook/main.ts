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

  // Sample media for the AudioPlayer and VideoPlayer stories.
  staticDirs: ['./public'],

  // ember-basic-dropdown (behind Select, Dropdown, ...) renders its content
  // into this element, which apps add to their application template.
  previewBody: (body) => `${body}
    <div id="ember-basic-dropdown-wormhole"></div>
  `,

  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
});

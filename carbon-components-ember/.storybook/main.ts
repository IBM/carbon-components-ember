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

  // The logo, and sample media for the AudioPlayer and VideoPlayer stories.
  staticDirs: ['./public'],

  // The project logo as the favicon (relative, so it works under any
  // deploy path). Browsers use the last icon link, so it wins over
  // Storybook's own.
  managerHead: (head) => `${head}
    <link rel="icon" type="image/svg+xml" href="images/ember-carbon-components.svg" />
  `,

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

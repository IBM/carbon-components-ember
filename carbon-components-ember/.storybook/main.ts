import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import { defineMain } from 'ember-storybook/node';

// The manager (sidebar, toolbar) uses IBM Plex, like @carbon/react's
// Storybook. Carbon's stylesheet declares the Plex faces (served from IBM's
// CDN); the preview loads all of it, the manager only needs these rules.
const plexFontFaces = readFileSync(
  createRequire(import.meta.url).resolve('@carbon/styles/css/styles.css'),
  'utf8',
)
  .match(/@font-face\s*\{[^}]*\}/g)
  ?.filter((rule) => /font-family:\s*"IBM Plex (Sans|Mono)"/.test(rule))
  .join('\n');

export default defineMain({
  stories: ['./introduction.mdx', '../src/**/*.stories.g(j|t)s'],

  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-vitest',
    '@storybook/addon-mcp',
    // Points the components manifest's imports at the components barrel.
    './manifests.ts',
  ],

  framework: 'ember-storybook',

  // The logo, and sample media for the AudioPlayer and VideoPlayer stories.
  staticDirs: ['./public'],

  // The project logo as the favicon (relative, so it works under any
  // deploy path). Browsers use the last icon link, so it wins over
  // Storybook's own.
  managerHead: (head) => `${head}
    <link rel="icon" type="image/svg+xml" href="images/ember-carbon-components.svg" />
    <style>${plexFontFaces ?? ''}</style>
  `,

  // ember-basic-dropdown (behind Select, Dropdown, ...) renders its content
  // into this element, which apps add to their application template.
  previewHead: (head) => `${head}
    <style>
      /* As in @carbon/react's Storybook: the docs page follows the OS
         light/dark preference (see theme.ts), while each story block shows
         the Carbon theme picked in the toolbar. */
      .docs-story,
      .docs-story > *:has(> .docblock-code-toggle) {
        background: var(--cds-background);
      }

      /* Storybook's loading placeholders (docs skeleton, canvas spinner)
         are always white; match the dark docs page instead of flashing
         white between pages. */
      @media (prefers-color-scheme: dark) {
        .sb-preparing-docs,
        .sb-preparing-story {
          background-color: #222325;
        }
        .sb-loader {
          border-color: rgb(255 255 255 / 20%);
          border-top-color: rgb(255 255 255 / 60%);
        }
        .sb-previewBlock,
        .sb-argstableBlock-body td {
          background: #1b1c1d;
          border-color: rgb(255 255 255 / 10%);
        }
        .sb-previewBlock_icon,
        .sb-argstableBlock th span,
        .sb-argstableBlock td span,
        .sb-argstableBlock-body button {
          background-color: rgb(255 255 255 / 10%);
        }
        .sb-argstableBlock-body tr:not(:first-child) {
          border-top-color: rgb(255 255 255 / 10%);
        }
      }
    </style>
  `,

  previewBody: (body) => `${body}
    <div id="ember-basic-dropdown-wormhole"></div>
  `,

  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
});

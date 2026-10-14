import { babel } from '@rollup/plugin-babel';
import { Addon } from '@embroider/addon-dev/rollup';
import copy from 'rollup-plugin-copy';
import sass from 'rollup-plugin-sass';
import { realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import * as sassEmbedded from 'sass-embedded';
import { dirname, resolve, sep } from 'node:path';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const babelConfig = resolve(rootDirectory, './babel.publish.config.cjs');
const tsConfig = resolve(rootDirectory, './tsconfig.publish.json');

// @carbon/styles' own dependencies (@carbon/type, ...) sit next to it,
// whatever the layout pnpm uses, at the versions it was installed with.
const carbonStylesDependencies = resolve(
  dirname(
    realpathSync(
      createRequire(import.meta.url).resolve('@carbon/styles/package.json'),
    ),
  ),
  '../..',
);

let componentStyles = '';

export default {
  // This provides defaults that work well alongside `publicEntrypoints` below.
  // You can augment this if you need to.
  output: addon.output(),

  plugins: [
    // These are the modules that users should be able to import from your
    // addon. Anything not listed here may get optimized away.
    // By default all your JavaScript modules (**/*.js) will be importable.
    // But you are encouraged to tweak this to only cover the modules that make
    // up your addon's public API. Also make sure your package.json#exports
    // is aligned to the config here.
    // See https://github.com/embroider-build/embroider/blob/main/docs/v2-faq.md#how-can-i-define-the-public-exports-of-my-addon
    addon.publicEntrypoints(['**/*.js', 'index.js'], {
      // Storybook stories are colocated with components but never published.
      exclude: ['**/*.stories.*'],
    }),

    // Only the services go into the app tree, because the components look
    // them up by name: `services/dialog-manager` becomes
    // `service:carbon.dialog-manager`. Apps import components and modifiers,
    // so loose-mode `.hbs` templates can't resolve them by name.
    addon.appReexports(['services/**/*.js'], {
      mapFilename: (filename) => {
        const parts = filename.split(sep);
        parts.splice(1, 0, 'carbon');
        return parts.join(sep);
      },
    }),

    // Follow the V2 Addon rules about dependencies. Your code can import from
    // `dependencies` and `peerDependencies` as well as standard Ember-provided
    // package names.
    addon.dependencies(),

    // This babel config should *not* apply presets or compile away ES modules.
    // It exists only to provide development niceties for you, like automatic
    // template colocation.
    //
    // By default, this will load the actual babel config from the file
    // babel.config.json.
    babel({
      extensions: ['.js', '.gjs', '.ts', '.gts'],
      babelHelpers: 'bundled',
      configFile: babelConfig,
    }),

    // Ensure that standalone .hbs files are properly integrated as Javascript.
    addon.hbs(),

    // Ensure that .gjs files are properly integrated as Javascript
    addon.gjs(),

    // Emit .d.ts declaration files
    addon.declarations(
      'declarations',
      `node scripts/build-declarations.mjs ${tsConfig}`,
    ),

    // addons are allowed to contain imports of .css files, which we want rollup
    // to leave alone and keep in the published output.
    addon.keepAssets(['**/*.css']),

    // Compiles the stylesheet each component imports into one styles.css
    // (`carbon-components-ember/styles.css`), and leaves the imports out of
    // the published JS, so apps need no Sass and load one file.
    sass({
      api: 'modern',
      // The Sass that Vite uses for the tests and Storybook.
      runtime: sassEmbedded,
      options: {
        loadPaths: [
          resolve(rootDirectory, 'node_modules'),
          carbonStylesDependencies,
        ],
        // The files are concatenated, so a `@charset` would land mid-file.
        charset: false,
      },
      // In path order, so the cascade doesn't depend on build order.
      output(_css, styles) {
        componentStyles = styles
          .toSorted((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
          .map(({ content }) => content)
          .join('\n');
      },
    }),
    {
      // As a Rollup asset, so addon.clean() keeps it.
      name: 'emit-component-styles',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'styles.css',
          source: componentStyles,
        });
      },
    },

    copy({
      // Run after addon.clean(), which deletes anything in dist/ that rollup
      // itself did not emit.
      hook: 'writeBundle',
      targets: [
        // The repository-level README and LICENSE are the ones published to npm.
        { src: '../README.md', dest: '.' },
        { src: '../LICENSE.md', dest: '.' },
      ],
    }),

    // Remove leftover build artifacts when starting a new build.
    addon.clean(),
  ],
};

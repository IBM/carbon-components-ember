import { babel } from '@rollup/plugin-babel';
import { Addon } from '@embroider/addon-dev/rollup';
import { transformAsync } from '@babel/core';
import copy from 'rollup-plugin-copy';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';

const require = createRequire(import.meta.url);

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const babelConfig = resolve(rootDirectory, './babel.publish.config.cjs');
const tsConfig = resolve(rootDirectory, './tsconfig.publish.json');

/**
 * Extracts astroturf's `stylesheet` tagged templates out of .gts files into
 * sibling `*.module.scss` assets, which are published alongside the JS and
 * compiled by the consuming app's own CSS-modules pipeline.
 */
function astroturf() {
  const astroturfFiles = {};
  return {
    name: 'astroturf',
    resolveId(id, importer) {
      if (id.includes('.scss')) {
        if (astroturfFiles[id]) {
          return id;
        }
        const fullPath = resolve(dirname(importer), id);
        if (astroturfFiles[fullPath]) {
          return fullPath;
        }
      }
    },
    load(id) {
      return astroturfFiles[id];
    },
    async transform(code, id) {
      if (!code.includes('astroturf')) {
        return;
      }
      if (id.endsWith('.gjs') || id.endsWith('.gts')) {
        const {
          metadata,
          code: transformedCode,
          map,
        } = await transformAsync(code, {
          babelrc: false,
          configFile: false,
          plugins: [
            [
              require.resolve('astroturf/plugin'),
              {
                writeFiles: false,
                getFileName(hostFile, _pluginOptions, identifier) {
                  const rel = relative(resolve(rootDirectory, 'src'), hostFile);
                  return resolve(
                    join(
                      dirname(rel),
                      basename(hostFile, '.gts') + identifier + '.module.scss',
                    ),
                  );
                },
                getRequirePath(hostFile, _absoluteFilePath, identifier) {
                  return (
                    './' + basename(hostFile, '.gts') + identifier + '.module.scss'
                  );
                },
              },
            ],
          ],
          filename: id,
        });
        for (const style of metadata.astroturf.styles) {
          astroturfFiles[style.absoluteFilePath] = style.value;
          this.emitFile({
            source: style.value,
            type: 'asset',
            fileName: style.absoluteFilePath.replace(process.cwd(), '').slice(1),
          });
        }
        return { code: transformedCode, map };
      }
    },
  };
}

export default {
  // This provides defaults that work well alongside `publicEntrypoints` below.
  // You can augment this if you need to.
  output: addon.output(),

  // Sass is compiled by the consuming app, not by this build.
  external: [/\.scss$/],

  plugins: [
    // These are the modules that users should be able to import from your
    // addon. Anything not listed here may get optimized away.
    // By default all your JavaScript modules (**/*.js) will be importable.
    // But you are encouraged to tweak this to only cover the modules that make
    // up your addon's public API. Also make sure your package.json#exports
    // is aligned to the config here.
    // See https://github.com/embroider-build/embroider/blob/main/docs/v2-faq.md#how-can-i-define-the-public-exports-of-my-addon
    addon.publicEntrypoints(['**/*.js', 'index.js', 'template-registry.js']),

    // These are the modules that should get reexported into the traditional
    // "app" tree. Things in here should also be in publicEntrypoints above, but
    // not everything in publicEntrypoints necessarily needs to go here.
    //
    // Everything is namespaced under `carbon/` in the app tree, so e.g.
    // `services/dialog-manager` is looked up as `service:carbon.dialog-manager`.
    addon.appReexports(
      [
        'components/**/*.js',
        'helpers/**/*.js',
        'modifiers/**/*.js',
        'services/**/*.js',
      ],
      {
        mapFilename: (filename) => {
          const parts = filename.split(sep);
          parts.splice(1, 0, 'carbon');
          return parts.join(sep);
        },
      },
    ),

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
      `pnpm ember-tsc --declaration --project ${tsConfig}`,
    ),

    // addons are allowed to contain imports of .css files, which we want rollup
    // to leave alone and keep in the published output.
    addon.keepAssets(['**/*.css']),

    astroturf(),

    copy({
      // Run after addon.clean(), which deletes anything in dist/ that rollup
      // itself did not emit.
      hook: 'writeBundle',
      // Keep paths relative to src/, so src/styles/** lands in dist/styles/**.
      flatten: false,
      targets: [
        // Published for consumers to `@use` (`carbon-components-ember/styles.scss`).
        // addon.keepAssets() only keeps assets that JS imports, so these
        // stylesheets are copied instead. See
        // https://github.com/embroider-build/embroider/issues/2461
        { src: 'src/styles/**/*.scss', dest: 'dist' },
        // The repository-level README and LICENSE are the ones published to npm.
        { src: '../README.md', dest: '.' },
        { src: '../LICENSE.md', dest: '.' },
      ],
    }),

    // Remove leftover build artifacts when starting a new build.
    addon.clean(),
  ],
};

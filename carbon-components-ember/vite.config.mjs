import { defineConfig } from 'vite';
import { extensions, ember, classicEmberSupport } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { transformAsync } from '@babel/core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const require = createRequire(import.meta.url);
const configDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '.storybook',
);

// For scenario testing
const isCompat = Boolean(process.env.ENABLE_COMPAT_BUILD);

/**
 * Turns astroturf's `stylesheet` tagged templates in .gts files into virtual
 * sibling `*.module.scss` modules, which Vite then compiles as CSS modules.
 * See rollup.config.mjs for the publish-time equivalent.
 */
function astroturf() {
  const astroturfFiles = {};
  return {
    name: 'astroturf',
    resolveId(id, importer) {
      const path = id.split('?')[0];
      if (path.endsWith('.module.scss') && importer) {
        const fullPath = resolve(dirname(importer.split('?')[0]), path);
        if (astroturfFiles[fullPath]) {
          return fullPath;
        }
      }
    },
    load(id) {
      return astroturfFiles[id.split('?')[0]];
    },
    async transform(code, id) {
      const path = id.split('?')[0];
      if (!path.endsWith('.gts') || !code.includes('astroturf')) {
        return;
      }
      const {
        metadata,
        code: transformedCode,
        map,
      } = await transformAsync(code, {
        babelrc: false,
        configFile: false,
        filename: path,
        plugins: [
          [
            require.resolve('astroturf/plugin'),
            {
              writeFiles: false,
              getFileName(hostFile, _pluginOptions, identifier) {
                return resolve(
                  dirname(hostFile),
                  basename(hostFile, '.gts') + identifier + '.module.scss',
                );
              },
              getRequirePath(hostFile, _absoluteFilePath, identifier) {
                return (
                  './' +
                  basename(hostFile, '.gts') +
                  identifier +
                  '.module.scss'
                );
              },
            },
          ],
        ],
      });
      for (const style of metadata.astroturf.styles) {
        astroturfFiles[style.absoluteFilePath] = style.value;
      }
      return { code: transformedCode, map };
    },
  };
}

/**
 * Lets `assert.snapshot()` write style snapshots while running the tests
 * through `vite dev` (open /tests/?save-snapshots). `pnpm test` uses the
 * equivalent testem middleware instead.
 */
function snapshotWriter() {
  return {
    name: 'snapshot-writer',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || !req.url?.startsWith('/__snapshots__/')) {
          return next();
        }
        const file = resolve('tests', '.' + decodeURI(req.url));
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          mkdirSync(dirname(file), { recursive: true });
          writeFileSync(file, body);
          res.statusCode = 204;
          res.end();
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [
    ...(isCompat ? [classicEmberSupport()] : []),
    ember(),
    babel({
      babelHelpers: 'inline',
      extensions,
    }),
    astroturf(),
    snapshotWriter(),
  ],
  build: {
    // This build only bundles the tests. Leave CSS unminified so style
    // snapshots compare Carbon's own CSS, not a minifier's rewrite of it
    // (Lightning CSS turns `background: none` into a 0px 0px position).
    cssMinify: false,
    rollupOptions: {
      input: {
        tests: 'tests/index.html',
      },
    },
  },
  // `pnpm test:storybook` runs every story (and its `play` function) as a
  // browser test. The QUnit suite still runs through testem (`pnpm test`).
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir,
            storybookScript: 'pnpm storybook --no-open',
          }),
        ],
        // Same as `oxc` in .storybook/main.ts: Babel compiles TypeScript.
        oxc: false,
        optimizeDeps: {
          // Same as `viteFinal` in .storybook/main.ts, which the vitest
          // plugin only takes plugins from.
          exclude: ['ember-storybook'],
          // Imports Vite would otherwise only discover mid-run and then reload
          // the tests for: ember-storybook's own, and the addons the CSF Next
          // preview (imported by every story) registers.
          include: [
            'ember-source/@ember/owner/index.js',
            'ember-source/@ember/array/index.js',
            '@storybook/addon-a11y',
            // Loaded lazily by @storybook/addon-a11y.
            'axe-core',
            '@storybook/addon-docs',
            '@storybook/addon-themes',
            '@storybook/addon-vitest',
          ],
        },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            // A cold run pre-bundles the whole Ember dependency graph before
            // the browser can connect, which takes longer than the default.
            connectTimeout: 180_000,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});

import { defineConfig } from 'vite';
import { extensions, ember, classicEmberSupport } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { transformAsync } from '@babel/core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);

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
  resolve: {
    alias: {
      // TEMPORARY until ember-basic-dropdown@9: v8 imports the classic (v1)
      // @embroider/util addon, which has no package entry Vite can resolve.
      '@embroider/util': '@embroider/util/addon/index.js',
    },
  },
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
    rollupOptions: {
      input: {
        tests: 'tests/index.html',
      },
    },
  },
});

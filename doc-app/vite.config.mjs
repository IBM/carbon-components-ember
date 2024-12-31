import { defineConfig } from 'vite';
import { hmr } from 'ember-vite-hmr';
import {
  resolver,
  hbs,
  scripts,
  templateTag,
  optimizeDeps,
  compatPrebuild,
  assets,
  contentFor,
} from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { sassOptions } from './styles-support.js';
import { resolve } from 'path';
import { createRequire } from 'module';
import { ResolverLoader, virtualContent } from '@embroider/core';

const require = createRequire(import.meta.url);

const extensions = [
  '.mjs',
  '.gjs',
  '.js',
  '.mts',
  '.gts',
  '.ts',
  '.hbs',
  '.json',
];

let docsUrl = process.env.ADDON_DOCS_VERSION_PATH;
if (docsUrl && !docsUrl.endsWith('/')) {
  docsUrl += '/';
}

console.log('setting base url to', docsUrl);

export default defineConfig(({ mode }) => {
  return {
    base: docsUrl ? '/carbon-components-ember/versions/' + docsUrl : '/',
    resolve: {
      extensions,
      alias: {
        "ember-composable-helpers": require.resolve("@nullvoxpopuli/ember-composable-helpers")
      },
    },
    plugins: [
      hbs(),
      templateTag(),
      scripts(),
      resolver(),
      compatPrebuild(),
      assets(),
      contentFor(),
      hmr(),
      {
        buildEnd() {
          // workaround https://github.com/embroider-build/embroider/pull/2163
          const resolverLoader = new ResolverLoader(process.cwd());
          this.emitFile({
            type: 'asset',
            fileName: '@embroider/virtual/vendor.css',
            source: virtualContent(
              resolve(
                resolverLoader.resolver.options.engines[0].root,
                '-embroider-vendor-styles.css',
              ),
              resolverLoader.resolver,
            ).src,
          });
        },
      },

      babel({
        babelHelpers: 'runtime',
        extensions,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: sassOptions,
      },
    },
    optimizeDeps: optimizeDeps(),
    server: {
      port: 4200,
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: 'index.html',
          ...(shouldBuildTests(mode)
            ? { tests: 'tests/index.html' }
            : undefined),
        },
      },
    },
  };
});

function shouldBuildTests(mode) {
  return mode !== 'production' || process.env.FORCE_BUILD_TESTS;
}

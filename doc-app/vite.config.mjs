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

let aliasPlugin = {
  name: 'env',
  setup(build) {
    // Intercept import paths called "env" so esbuild doesn't attempt
    // to map them to a file system location. Tag them with the "env-ns"
    // namespace to reserve them for this plugin.
    build.onResolve({ filter: /^fetch$/ }, (args) => ({
      path: resolve('./app/ember-fetch.js'),
    }));
  },
};

const docsUrl = process.env.ADDON_DOCS_VERSION_PATH;

console.log('setting base url to', docsUrl);

export default defineConfig(({ mode }) => {
  return {
    base: docsUrl ? '/carbon-components-ember/versions/' + docsUrl : '',
    resolve: {
      extensions,
      alias: {
        fetch: resolve('./app/ember-fetch.js'),
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
    optimizeDeps: {
      ...optimizeDeps(),
      esbuildOptions: {
        ...optimizeDeps().esbuildOptions,
        plugins: [aliasPlugin, ...optimizeDeps().esbuildOptions.plugins],
      },
    },
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

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
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

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


function snapshotPlugin() {
  return {
    name: 'snapshot',
    configureServer(s) {
      const server = s;
      return () => {
        server.middlewares.use((req, _res, next) => {
          const base = server.config.base || '/';
          let originalUrl = req.originalUrl;
          if (originalUrl === null || originalUrl === void 0 ? void 0 : originalUrl.startsWith(base)) {
            originalUrl = req.originalUrl.slice(base.length - 1);
          }
          if (originalUrl && originalUrl.length > 1) {
            if (req.method === 'POST' && originalUrl.startsWith('/__snapshots__')) {
              const path = `./tests/${decodeURI(originalUrl)}`;
              mkdirSync(dirname(path), { recursive: true });
              let body = "";
              req.on("readable", () => {
                body += req.read() || '';
              });
              req.on("end", () => {
                writeFileSync(path, body.toString());
              });
            }
          }
          return next();
        });
      };
    },
  }
}

export default defineConfig(({ mode }) => {
  return {
    resolve: {
      extensions,
    },
    plugins: [
      snapshotPlugin(),
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

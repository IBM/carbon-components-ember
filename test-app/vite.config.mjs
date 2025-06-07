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
import { transformAsync } from '@babel/core';
import { babel } from '@rollup/plugin-babel';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import path from 'path';

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

function astroturf() {

  const astroturfFiles = {};
  return {
    name: 'astroturf',
    resolveId(id, importee) {
      if (id.includes('.scss')) {
        if (astroturfFiles[id]) {
          return id;
        }
        const fullPath = path.resolve(path.dirname(importee), id);
        if (astroturfFiles[fullPath]) {
          return fullPath
        }
      }
    },
    load(id) {
      // /Users/patrickpircher/IdeaProjects/carbon-components-ember/src/components/buttonCarbonButton.module.scss
      if (id.includes('.scss')) {
        console.log('load', id);
      }
      return astroturfFiles[id];
    },
    async transform(code, id) {
      if (!code.includes('astroturf')) {
        return;
      }
      if (id.endsWith('.gjs') || id.endsWith('.gts')) {
        const { metadata, code: transformedCode, map } = await transformAsync(code, {
          plugins: [[path.resolve('./node_modules/astroturf/plugin'), {
            writeFiles: false,
            getFileName: function(hostFile, pluginOptions, identifier) {
              const r = path.join(path.dirname(hostFile), path.basename(hostFile, '.gts') + identifier + '.module.scss');
              return path.resolve(r);
            },
            getRequirePath(hostFile, absoluteFilePath, identifier) {
              return './' + path.basename(hostFile, '.gts') + identifier   + '.module.scss'
            }
          }]],
          filename: id,
        });
        const generatedFiles = metadata.astroturf.styles
          .map(({absoluteFilePath, requirePath, value}) => ({importPath: requirePath, fullPath: absoluteFilePath, code: value}))
        for (const gen of generatedFiles) {
          console.log('gen file', gen);
          astroturfFiles[gen.fullPath] = gen.code;
        }
        return { code: transformedCode, map };
      }
    }
  }
}


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
      astroturf()
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

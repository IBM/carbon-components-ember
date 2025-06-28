import { classicEmberSupport, ember, extensions } from "@embroider/vite";

import { babel } from "@rollup/plugin-babel";
import { transformAsync } from '@babel/core';
import { defineConfig } from "vite";
import { resolve, dirname, basename, join } from "path";
import { mkdirSync, writeFileSync } from "fs";

function astroturf() {

  const astroturfFiles = {};
  return {
    name: 'astroturf',
    resolveId(id, importee) {
      id = id.split('?')[0];
      if (id.includes('.scss')) {
        if (id.includes('carbon-components-ember/components')) {
          id = id.replace('/components/', '/src/components/');
        }
        if (astroturfFiles[id]) {
          return id;
        }
        const fullPath = resolve(dirname(importee), id);
        if (astroturfFiles[fullPath]) {
          return fullPath
        }
      }
    },
    load(id) {
      id = id.split('?')[0];
      return astroturfFiles[id];
    },
    async transform(code, id) {
      id = id.split('?')[0];
      if (id.endsWith('.gjs') || id.endsWith('.gts')) {
        const { metadata, code: transformedCode, map } = await transformAsync(code, {
          babelrc: false,
          configFile: false,
          plugins: [[resolve('./node_modules/astroturf/plugin'), {
            writeFiles: false,
            getFileName: function(hostFile, pluginOptions, identifier) {
              const r = join(dirname(hostFile), basename(hostFile, '.gts') + '_' + identifier + '.module.scss');
              return resolve(r);
            },
            getRequirePath(hostFile, absoluteFilePath, identifier) {
              return './' + basename(hostFile, '.gts')  + '_' +  identifier   + '.module.scss'
            }
          }]],
          filename: id,
        });
        const generatedFiles = metadata.astroturf.styles
          .map(({absoluteFilePath, requirePath, value}) => ({importPath: requirePath, fullPath: absoluteFilePath, code: value}))
        for (const gen of generatedFiles) {
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

export default defineConfig((/* { mode } */) => {
  return {
    resolve: {
      extensions,
      dedupe: [
        "ember-primitives",
        "ember-source",
      ],
    },
    plugins: [
      snapshotPlugin(),
      classicEmberSupport(),
      ember(),
      babel({
        babelHelpers: "runtime",
        extensions,
      }),
      astroturf(),
    ],
    optimizeDeps: {
      // a wasm-providing dependency
      exclude: ["content-tag"],
      // for top-level-await, etc
      esbuildOptions: {
        target: "esnext",
      },
    },
  };
});

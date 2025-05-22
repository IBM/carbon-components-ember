import { classicEmberSupport, ember, extensions } from "@embroider/vite";

import { babel } from "@rollup/plugin-babel";
import { kolay } from "kolay/vite";
import { transformAsync } from '@babel/core';
import { defineConfig } from "vite";
import { resolve, dirname, basename, join } from "path";

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
          console.log('gen file', gen.fullPath);
          astroturfFiles[gen.fullPath] = gen.code;
        }
        return { code: transformedCode, map };
      }
    }
  }
}

export default defineConfig((/* { mode } */) => {
  return {
    base: process.env.DOCS_URL ? "/carbon-components-ember/" + process.env.DOCS_URL + "/" : "",
    build: {
      target: ["esnext"],
      minify: false,
      rollupOptions: {
        treeshake: 'smallest'
      }
    },
    css: {
      postcss: "./config/postcss.config.mjs",
      devSourcemap: true // this one
    },
    resolve: {
      extensions,
      dedupe: [
        "ember-primitives",
        "ember-source",
      ],
      'alias': {
        '@ember/render-modifiers/modifiers/did-insert': resolve('./node_modules/@ember/render-modifiers/addon/modifiers/did-insert.js'),
      }
    },
    plugins: [
      classicEmberSupport(),
      ember(),
      kolay({
        src: "public/docs",
        groups: [],
        packages: ["carbon-components-ember"],
      }),
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

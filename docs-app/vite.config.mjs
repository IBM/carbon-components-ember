import { classicEmberSupport, ember, extensions } from "@embroider/vite";

import { babel } from "@rollup/plugin-babel";
import { kolay } from "kolay/vite";
import { transformAsync } from '@babel/core';
import { defineConfig } from "vite";
import { resolve, dirname, basename } from "path";

function astroturf() {

  const astroturfFiles = {};
  return {
    name: 'astroturf',
    resolveId(id, importee) {
      id = id.split('?')[0];
      if (id.includes('.scss')) {
        console.log('scss', id);
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
      // /Users/patrickpircher/IdeaProjects/carbon-components-ember/src/components/buttonCarbonButton.module.scss
      if (id.includes('.scss')) {
        console.log('load', id);
      }
      return astroturfFiles[id];
    },
    async transform(code, id) {
      id = id.split('?')[0];
      console.log('transform', id);
      if (id.endsWith('.gjs') || id.endsWith('.gts')) {
        const { metadata, code: transformedCode, map } = await transformAsync(code, {
            babelrc: false,
            configFile: false,
            plugins: [[resolve('./node_modules/astroturf/plugin'), {
            writeFiles: false,
            getFileName: function(hostFile, pluginOptions, identifier) {
              const r = path.join(dirname(hostFile), basename(hostFile, '.gts') + identifier + '.module.scss');
              return resolve(r);
            },
            getRequirePath(hostFile, absoluteFilePath, identifier) {
              return './' + basename(hostFile, '.gts') + identifier   + '.module.scss'
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

export default defineConfig((/* { mode } */) => {
  return {
    base: process.env.DOCS_URL ? "/carbon-components-ember/" + process.env.DOCS_URL + "/" : "",
    build: {
      target: ["esnext"],
    },
    css: {
      postcss: "./config/postcss.config.mjs",
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

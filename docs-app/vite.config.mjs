import { classicEmberSupport, ember, extensions } from "@embroider/vite";

import { babel } from "@rollup/plugin-babel";
import { kolay } from "kolay/vite";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig((/* { mode } */) => {
  return {
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

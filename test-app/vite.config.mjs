import { defineConfig } from "vite";
import {
  resolver,
  hbs,
  scripts,
  templateTag,
  optimizeDeps,
  assets,
  compatPrebuild,
  contentFor
} from "@embroider/vite";
import { resolve, join } from "path";
import { existsSync } from "fs";
import { babel } from "@rollup/plugin-babel";
import { hmr } from 'ember-vite-hmr';
import { ResolverLoader } from '@embroider/core';

const root = "node_modules/.embroider/rewritten-app";

const resolverLoader = new ResolverLoader(process.cwd());

const pathsImporter = () => {
  const addons = [];
  async function search(url) {
    if (existsSync(url)) {
      return null;
    }
    if (!addons.length) {
      for (const engine of resolverLoader.resolver.options.engines) {
        for (const activeAddon of engine.activeAddons) {
          const stylesFolder = join(activeAddon.root, '_app_styles_');
          if (existsSync(stylesFolder)) {
            addons.push(stylesFolder);
          } else {
            addons.push(activeAddon.root);
          }
        }
      }
    }
    for (const p of addons) {
      let newPath = join(p, url);
      if (!newPath.endsWith('.scss') && !newPath.endsWith('.sass') && !newPath.endsWith('.css')) {
        newPath += '.scss';
      }
      if (existsSync(newPath)) {
        return {
          file: newPath
        };
      }
    }
    return null
  }
  return (url, prev, done) => {
    search(url).then(done).catch(e => done(null));
  };
};

const sassOptions = {
  alias: [],
  importer: [pathsImporter()]
}

export default defineConfig({
  root,
  // esbuild in vite does not support decorators
  esbuild: false,
  cacheDir: resolve("node_modules", ".vite"),
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
      babelHelpers: "runtime",

      // this needs .hbs because our hbs() plugin above converts them to
      // javascript but the javascript still also needs babel, but we don't want
      // to rename them because vite isn't great about knowing how to hot-reload
      // them if we resolve them to made-up names.
      extensions: [".gjs", ".js", ".hbs", ".ts", ".gts"],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: sassOptions
    }
  },
  optimizeDeps: optimizeDeps({ exclude: ['@embroider/macros', 'ember-code-snippet'] }),
  server: {
    port: 4200,
    watch: {
      ignored: ["!**/node_modules/.embroider/rewritten-app/**"],
    },
  },
  build: {
    outDir: resolve(process.cwd(), "dist"),
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        tests: resolve(root, "tests/index.html"),
      },
    },
  },
});

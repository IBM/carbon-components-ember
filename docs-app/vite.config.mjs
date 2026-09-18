import { compatPrebuild, ember, extensions } from "@embroider/vite";

import { babel } from "@rollup/plugin-babel";
import { kolay } from "kolay/vite";
import { transformAsync } from '@babel/core';
import { defineConfig } from "vite";
import { resolve, dirname, basename, join } from "path";
import { createRequire } from "module";
import rehypeShiki from "@shikijs/rehype";

import { rehypeShadowDemo } from "./app/docs-support/rehype-shadow-demo";

const require = createRequire(import.meta.url);

// `?inline` imports of a component's astroturf-generated `.module.scss`
// (e.g. ThemeSupport's `iconStyle`/`buttonStyle`/etc., re-injected into
// every shadow-wrapped docs demo's <style> tag) collide with that exact
// same file's plain, query-less CSS-modules import that the owning
// component uses for its own scoped classnames: `@embroider/vite`'s
// `embroider-resolver` plugin is registered `enforce: 'pre'` (always
// resolves first, regardless of plugin-array order) and drops the
// `?inline` query when resolving a real file under the addon's `dist/`, so
// both imports collapse onto the identical resolved id and Vite's own
// inline-vs-css-modules decision (keyed off that id's query string) never
// sees the `?inline` flag -- every `.default` came back as the hashed
// classname map object instead of the compiled CSS text, silently
// rendering "[object Object]" into the injected <style> block. Resolving
// these ourselves, in our own `enforce: 'pre'` plugin placed *before*
// `compatPrebuild()`/`ember()` in the plugins array (same bucket, so array
// order decides), wins the race and keeps the query intact so Vite's real,
// already-correct `?inline` handling (confirmed directly against Vite's
// own dev-server transform) applies.
function inlineAddonModuleCss() {
  // The addon's package.json `exports` map has no `./package.json` entry,
  // so `require.resolve` that directly -- resolve the `.` entry
  // (`dist/index.js`) instead and strip it back down to the package root.
  const addonRoot = require.resolve("carbon-components-ember").replace(/\/dist\/.*$/, "");
  return {
    name: "inline-addon-module-css",
    enforce: "pre",
    resolveId(source) {
      if (!source.startsWith("carbon-components-ember/") || !source.endsWith(".module.scss?inline")) {
        return null;
      }
      const [path, query] = source.slice("carbon-components-ember/".length).split("?");
      return `${join(addonRoot, "dist", path)}?${query}`;
    },
  };
}

// Components invocable at the top level of a build-time `.gjs.md` doc (e.g.
// `<ThemeSwitcher />` above the first heading), mirroring the `topLevelScope`
// passed to `setupKolay` for runtime `.md` docs in routes/application.ts.
// Bare imports here must be real, resolvable module specifiers -- unlike
// `setupKolay`'s `modules` map, there's no dynamic runtime lookup at build
// time.
const kolayScope = `
import ThemeSwitcher from 'docs-app/docs-support/theme-switcher';
import { APIDocs, ComponentSignature, ModifierSignature } from 'docs-app/routes/api-docs';
import { Callout } from '@universal-ember/docs-support';
`;

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
        "@ember/test-waiters",
      ],
      alias: [
        // Backs the `docs-support` bare specifier that live demo fences
        // import `ThemeSupport`/`didInsert`/etc. from. Runtime `.md` docs
        // resolve it dynamically via setupKolay's `modules` map instead (see
        // routes/application.ts); this alias is only exercised by build-time
        // `.gjs.md` docs.
        { find: "docs-support", replacement: resolve("./app/docs-support/index.ts") },
        // Demo fences conventionally import from these two extension-less
        // specifiers, but the addon's package.json `exports` only maps
        // `./*` to `dist/*.js` -- there is no `dist/components.js` or
        // `dist/helpers.js`, only `dist/components/index.js` and
        // `dist/helpers/index.js`. Runtime `.md` docs never hit real module
        // resolution for these (setupKolay's `modules` map short-circuits
        // it with the `/index` forms), so build-time `.gjs.md` docs need
        // the same specifiers aliased to their real, resolvable form.
        // Anchored `RegExp`s so already-correct `/index` (or `/icon`, etc.)
        // specifiers elsewhere in the app don't also match and recurse.
        { find: /^carbon-components-ember\/components$/, replacement: "carbon-components-ember/components/index" },
        { find: /^carbon-components-ember\/helpers$/, replacement: "carbon-components-ember/helpers/index" },
      ],
    },
    plugins: [
      // Must win the resolve race against `embroider-resolver` (registered
      // by compatPrebuild()/ember() below, also `enforce: 'pre'`) for the
      // `?inline` module-CSS imports it targets -- see its own doc comment.
      inlineAddonModuleCss(),
      // Runs a classic ember-cli prebuild so @embroider/core's resolver has
      // the metadata (rewritten-packages, resolver.json, etc.) it needs to
      // resolve Ember virtual modules like @embroider/virtual/helpers/*.
      // Without this, addon-owned templates using dynamic component
      // invocation (e.g. ember-power-select's `ensure-safe-component`) fail
      // to resolve in a fresh build (no stale node_modules/.embroider cache).
      compatPrebuild(),
      ember(),
      kolay({
        // Unnamed/"Home" group pages are co-located markdown under
        // app/templates (e.g. app/templates/1-get-started/index.md) --
        // kolay's markdown-pages plugin only globs {app,src}/templates for
        // that group, so there is no separate top-level `src` option.
        groups: [],
        packages: ["carbon-components-ember"],
        // Applies to build-time `.gjs.md` docs only; runtime `.md` docs get
        // their own copies of these via setupKolay in routes/application.ts.
        scope: kolayScope,
        rehypePlugins: [
          [rehypeShadowDemo, { forBuildTimeInjection: true }],
          // Code-fence syntax highlighting, mirroring the rehypeShiki setup
          // in routes/application.ts for runtime `.md` docs. Build time runs
          // in Node, so (unlike the runtime highlighter) there's no need to
          // hand-roll getHighlighterCore/loadWasm -- the package's default
          // export creates its own highlighter from the bundled langs/themes.
          [
            rehypeShiki,
            {
              langs: [
                "javascript",
                "typescript",
                "bash",
                "css",
                "diff",
                "html",
                "glimmer-js",
                "glimmer-ts",
                "handlebars",
                "jsonc",
                "markdown",
              ],
              // Theme chosen by the `--shiki-{light,dark}{,-bg}` CSS
              // variables this emits (defaultColor: false) -- mapped to
              // `color`/`background-color` by @universal-ember/docs-support's
              // prebuilt site-css/shiki.css (already loaded globally, so no
              // separate include is needed here), same as runtime `.md` docs.
              defaultColor: false,
              themes: {
                light: "github-light",
                dark: "github-dark",
              },
            },
          ],
        ],
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

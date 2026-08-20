import { compatPrebuild, ember, extensions } from "@embroider/vite";

import { babel } from "@rollup/plugin-babel";
import { kolay } from "kolay/vite";
import { transformAsync } from '@babel/core';
import { defineConfig } from "vite";
import { resolve, dirname, basename, join } from "path";
import rehypeShiki from "@shikijs/rehype";

import { rehypeShadowDemo } from "./app/docs-support/rehype-shadow-demo";

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

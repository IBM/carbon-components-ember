import autoprefixer from "autoprefixer";
import postcssImport from "postcss-import";
import tailwind from "tailwindcss";

/**
 * @universal-ember/docs-support >= 0.8 ships plain, pre-built CSS (no
 * `@tailwind`/`@apply`) that uses native `@layer` purely for cascade
 * ordering. Tailwind's PostCSS plugin errors on any `@layer` it finds in
 * a file that doesn't also declare `@tailwind`, so it can't be allowed to
 * touch third-party CSS -- only docs-app's own stylesheets need it.
 */
function onlyAppFiles(plugin) {
  // postcss 7-style bare-function plugins are treated as an implicit `Once` hook.
  if (typeof plugin === "function") {
    // postcss 7-style plugins receive `(root, result)` directly -- `result`
    // here, not `helpers.result` (that shape is only for postcss 8 visitors).
    return (root, resultOrHelpers) => {
      const from = (resultOrHelpers?.result?.opts ?? resultOrHelpers?.opts)?.from;

      if (from?.includes("/node_modules/")) {
        return;
      }

      return plugin(root, resultOrHelpers);
    };
  }

  if (Array.isArray(plugin.plugins)) {
    return {
      postcssPlugin: plugin.postcssPlugin,
      plugins: plugin.plugins.map(onlyAppFiles),
    };
  }

  const hooks = {};

  for (const key of Object.keys(plugin)) {
    if (key === "postcssPlugin" || typeof plugin[key] !== "function") {
      continue;
    }

    if (key === "prepare") {
      hooks.prepare = (result) =>
        result.opts.from?.includes("/node_modules/") ? {} : plugin.prepare(result);
      continue;
    }

    hooks[key] = (...args) => {
      const last = args[args.length - 1];
      const from = (last?.result?.opts ?? last?.opts)?.from;

      if (from?.includes("/node_modules/")) {
        return;
      }

      return plugin[key](...args);
    };
  }

  return { postcssPlugin: plugin.postcssPlugin, ...hooks };
}

const config = {
  plugins: [
    postcssImport(),
    onlyAppFiles(tailwind((await import("./tailwind.config.mjs")).default)),
    autoprefixer(),
  ],
};

export default config;

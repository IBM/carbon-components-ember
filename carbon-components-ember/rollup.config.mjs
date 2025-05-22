import path from 'path';
import fs from 'fs';
import { babel } from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import { Addon } from '@embroider/addon-dev/rollup';
import { transformAsync } from '@babel/core';

// rollup-plugin-astroturf mjs has wrong import specifiers...
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

const rootImport = (options) => ({
  resolveId: (importee) => {
    if (importee[0] === '/') {
      const rootPath = `${options.root}${importee}`;
      const absPath = path.resolve('.', rootPath);
      return fs.existsSync(absPath) ? absPath : null;
    }
    return null;
  },
});

export function astroturf() {

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
      return astroturfFiles[id];
    },
    async transform(code, id) {
      if (!code.includes('astroturf')) {
        return;
      }
      if (id.endsWith('.gjs') || id.endsWith('.gts')) {
        const { metadata, code: transformedCode, map } = await transformAsync(code, {
          plugins: [[require.resolve('astroturf/plugin'), {
            writeFiles: false,
            getFileName: function(hostFile, pluginOptions, identifier) {
              const relative = path.relative(path.resolve(process.cwd(), 'src'), hostFile);
              const r = path.join(path.dirname(relative), path.basename(hostFile, '.gts') + identifier + '.module.scss');
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
          astroturfFiles[gen.fullPath] = gen.code;
          const fname =  gen.fullPath.replace(process.cwd(), '').slice(1);
          this.emitFile({
            source: gen.code,
            type: 'asset',
            fileName: fname,
          })
        }
        return { code: transformedCode, map };
      }
    }
  }
}

export default {
  // This provides defaults that work well alongside `publicEntrypoints` below.
  // You can augment this if you need to.
  output: addon.output(),

  external: [/\.scss$/],

  treeshake: true,

  plugins: [
    // These are the modules that users should be able to import from your
    // addon. Anything not listed here may get optimized away.
    // By default all your JavaScript modules (**/*.js) will be importable.
    // But you are encouraged to tweak this to only cover the modules that make
    // up your addon's public API. Also make sure your package.json#exports
    // is aligned to the config here.
    // See https://github.com/embroider-build/embroider/blob/main/docs/v2-faq.md#how-can-i-define-the-public-exports-of-my-addon
    addon.publicEntrypoints([
      '**/*.{js,ts}',
      'index.js',
      'template-registry.js',
    ]),

    // These are the modules that should get reexported into the traditional
    // "app" tree. Things in here should also be in publicEntrypoints above, but
    // not everything in publicEntrypoints necessarily needs to go here.
    addon.appReexports(
      [
        'components/**/*.{js,ts,gts,gjs}',
        'helpers/**/*.{js,ts}',
        'modifiers/**/*.{js,ts}',
        'services/**/*.{js,ts}',
      ],
      {
        mapFilename: (fn) => {
          const parts = fn.split(path.sep);
          parts.splice(1, 0, 'carbon');
          return parts.join(path.sep);
        },
      },
    ),

    // Follow the V2 Addon rules about dependencies. Your code can import from
    // `dependencies` and `peerDependencies` as well as standard Ember-provided
    // package names.
    addon.dependencies(),

    // This babel config should *not* apply presets or compile away ES modules.
    // It exists only to provide development niceties for you, like automatic
    // template colocation.
    //
    // By default, this will load the actual babel config from the file
    // babel.config.json.
    babel({
      extensions: ['.js', '.gjs', '.ts', '.gts'],
      babelHelpers: 'bundled',
    }),

    // Ensure that standalone .hbs files are properly integrated as Javascript.
    addon.hbs(),

    // Ensure that .gjs files are properly integrated as Javascript
    addon.gjs(),

    // addons are allowed to contain imports of .css files, which we want rollup
    // to leave alone and keep in the published output.
    addon.keepAssets(['styles/**/*.scss']),

    // Remove leftover build artifacts when starting a new build.
    //addon.clean({}),

    rootImport({
      // Will first look in `client/src/*` and then `common/src/*`.
      root: './src',
    }),

    // Copy Readme and License into published package
    copy({
      targets: [
        { src: '../README.md', dest: '.' },
        { src: '../LICENSE.md', dest: '.' },
      ],
    }),

    astroturf(),

    addon.clean()
  ],
};

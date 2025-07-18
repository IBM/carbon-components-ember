const { babelCompatSupport, templateCompatSupport } = require('@embroider/compat/babel');
const addTOCNames = require('./babel/babel-plugin');

module.exports = {
  plugins: [
    require.resolve('ember-concurrency/async-arrow-task-transform'),
    [
      '@babel/plugin-transform-typescript',
      {
        allExtensions: true,
        onlyRemoveTypeImports: true,
        allowDeclareFields: true,
      },
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        compilerPath: 'ember-source/dist/ember-template-compiler.js',
        enableLegacyModules: [
          'ember-cli-htmlbars',
          'ember-cli-htmlbars-inline-precompile',
          'htmlbars-inline-precompile',
        ],
        transforms: [...templateCompatSupport()],
      },
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          // requires package.json#exports

          import: require.resolve('decorator-transforms/runtime-esm'),
        },
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: __dirname,
        useESModules: true,
        regenerator: false,
      },
    ],
    [addTOCNames],
    ...babelCompatSupport(),
  ],

  generatorOpts: {
    compact: false,
  },
};

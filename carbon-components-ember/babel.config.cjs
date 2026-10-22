/**
 * This babel.config is not used for publishing.
 * It's only for the local editing experience
 * (and linting)
 */
const { buildMacros } = require('@embroider/macros/babel');

const macros = buildMacros({
  // Vitest sets NODE_ENV=test. Build the story tests in development, as
  // `pnpm storybook` is, or test waiters do nothing.
  configure(macros) {
    if (process.env.NODE_ENV === 'test') {
      macros.enablePackageDevelopment(process.cwd());
    }
  },
});

module.exports = {
  plugins: [
    // ember-concurrency's `task(async () => {})` syntax needs this transform.
    require.resolve('ember-concurrency/async-arrow-task-transform'),
    [
      '@babel/plugin-transform-typescript',
      {
        allExtensions: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
      },
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        transforms: [...macros.templateMacros],
      },
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: require.resolve('decorator-transforms/runtime-esm'),
        },
      },
    ],
    ...macros.babelMacros,
  ],

  generatorOpts: {
    compact: false,
  },
};

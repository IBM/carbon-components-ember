module.exports = {
  plugins: [
    require.resolve('ember-concurrency/async-arrow-task-transform'),
    [
      '@babel/plugin-transform-typescript',
      { allExtensions: true, allowDeclareFields: true },
    ],
    '@embroider/addon-dev/template-colocation-plugin',
    '@babel/plugin-transform-class-static-block',
    [
      'babel-plugin-ember-template-compilation',
      {
        targetFormat: 'hbs',
        transforms: [],
      },
    ],
    ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
    '@babel/plugin-proposal-class-properties',
  ],
};

'use strict';

module.exports = {
  root: true,
  parser: 'ember-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    babelOptions: {
      root: __dirname,
    },
  },
  plugins: ['ember'],
  extends: ['plugin:ember/recommended', 'plugin:prettier/recommended'],
  globals: {
    'ensure-safe-component': true,
  },
  env: {
    browser: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:ember/recommended',
      ],
      rules: {
        'ember/no-at-ember-render-modifiers': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'ember/no-empty-glimmer-component-classes': 'off',
      },
    },
    {
      files: ['**/*.gts'],
      parser: 'ember-eslint-parser',
      plugins: ['ember'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:ember/recommended',
        'plugin:ember/recommended-gts',
      ],
      rules: {
        'ember/no-at-ember-render-modifiers': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'ember/no-empty-glimmer-component-classes': 'off',
      },
    },
    {
      files: ['**/*.gjs'],
      parser: 'ember-eslint-parser',
      plugins: ['ember'],
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:ember/recommended-gjs',
      ],
    },
    // node files
    {
      files: [
        './.eslintrc.cjs',
        './.prettierrc.cjs',
        './.template-lintrc.cjs',
        './addon-main.cjs',
        './babel.config.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['n'],
      extends: ['plugin:n/recommended'],
    },
  ],
};

require('eslint-plugin-ember-template-lint/lib/ember-teplate-lint/config').registerPlugin('ember-template-lint-plugin-prettier');
require('eslint-plugin-ember-template-lint/lib/ember-teplate-lint/config').registerPlugin('ember-hbs-imports/hbs-imports-rule');


module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  plugins: [],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:@typescript-eslint/base',
    'plugin:ember-template-lint/config',
    'plugin:ember-template-lint/recommended'
  ],
  env: {
    browser: true,
  },
  globals: {
    OneOf: true,
    WithRequired: true,
  },
  rules: {
    'ember-template-lint/no-curly-component-invocation': ['error', { allow: ['noop'] }],
    'ember-template-lint/no-bare-strings': 'off',
    'ember-template-lint/no-inline-styles': 'off',
    'ember-template-lint/must-have-hbs-imports': ['error'],
    'ember-template-lint/no-positive-tabindex': 'off',
    'ember-template-lint/prettier': ['error', {
      singleQuote: true,
      htmlWhitespaceSensitivity: 'ignore'
    }],
    'no-unused-vars': 'off',
    'ember/no-empty-glimmer-component-classes': 'off',
    quotes: ['error', 'single'],
    indent: 'off',
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { 'typedefs': false }],
    'node/no-unsupported-features/es-syntax': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'arrow-body-style': 'off',
    'comma-dangle': 'off',
    'func-names': 'off',
    'global-require': 'off',
    'keyword-spacing': ['error'],
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'max-len': ['error', 180],
    'object-shorthand': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-rest-params': 'off',
    'spaced-comment': 'off',
    'space-before-function-paren': ['error', 'never'],
    strict: 'off',
    'vars-on-top': 'off',

    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': 'off',
    'node/no-extraneous-require': 'off',
    'node/no-unpublished-require': 'off',

    'prefer-template': 'off',
    'prefer-spread': 'off',
    'space-in-parens': ['error', 'never'],
    'space-before-blocks': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'padded-blocks': 'off',
    'no-else-return': 'off',
    'no-empty': 'off',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'class-methods-use-this': 'off',
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js',
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**',
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015,
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      rules: Object.assign(
        {},
        require('eslint-plugin-node').configs.recommended.rules,
        {
          // add your custom rules and overrides for node files here
        }
      ),
    },
    {
      // test files
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
      rules: {
        'qunit/no-conditional-assertions': 'off',
        'qunit/no-early-return': 'off',
      },
    }
  ],
};

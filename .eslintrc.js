module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  "parser": "@typescript-eslint/parser",
  plugins: [
    'ember',
    "@typescript-eslint"
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    "quotes": [
      "error", "single"
    ],
    "indent": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/ban-ts-comment":  "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-empty-function": "off",
    "node/no-unsupported-features/es-syntax": "off",
    "no-restricted-syntax": "off",
    "no-await-in-loop": "off",
    "arrow-body-style": "off",
    "comma-dangle": "off",
    "func-names": "off",
    "global-require": "off",
    "keyword-spacing": ["error"],
    "no-console": "off",
    "no-param-reassign": "off",
    "no-plusplus": ["error", {
      "allowForLoopAfterthoughts": true
    }],
    "no-underscore-dangle": "off",
    "no-unused-vars": ["error", {
      "args": "none"
    }],
    "no-use-before-define": ["error", {
      "functions": false
    }],
    "max-len": ["error", 180],
    "object-shorthand": "off",
    "prefer-arrow-callback": "off",
    "prefer-rest-params": "off",
    "spaced-comment": "off",
    "space-before-function-paren": ["error", "never"],
    "strict": "off",
    "vars-on-top": "off",

    "import/no-dynamic-require": "off",
    "import/no-extraneous-dependencies": "off",
    "node/no-extraneous-require": "off",
    "node/no-unpublished-require": "off",

    "prefer-template": "off",
    "prefer-spread": "off",
    "space-in-parens": ["error", "never"],
    "space-before-blocks": ["error", "always"],
    "object-curly-spacing": ["error", "always"],
    "padded-blocks": "off",
    "no-else-return": "off",
    "no-empty": "off",
    "prefer-const": ["error", {
      "destructuring": "all"
    }],
    "class-methods-use-this": "off"
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
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here
      })
    }
  ]
};

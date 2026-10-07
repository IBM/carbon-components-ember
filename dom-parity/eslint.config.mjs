import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['fixtures/']),
  js.configs.recommended,
  prettier,
  {
    languageOptions: { globals: globals.node },
    rules: {
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  {
    // Also imported by the addon's tests, which run in a browser.
    files: ['lib/**'],
    languageOptions: { globals: globals.browser },
  },
]);

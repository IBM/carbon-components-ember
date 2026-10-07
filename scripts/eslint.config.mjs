import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig([
  js.configs.recommended,
  prettier,
  {
    languageOptions: { globals: globals.node },
  },
]);

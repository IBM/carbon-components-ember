<ThemeSwitcher />

# Code Snippet

Code snippets are strings or small blocks of reusable code that can be copied and inserted in a code file.

```gjs live preview
import { CodeSnippet } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
    <ThemeSupport />
    <CodeSnippet @type='default'>Some code</CodeSnippet>

    <p>
        Some text about this code
        {{! prettier-ignore }}
        <CodeSnippet @type='inline'>inline code</CodeSnippet>
        here
    </p>

    {{! prettier-ignore }}
    <CodeSnippet @type='multiline'>
        {{! template-lint-disable }}
        {
        "scripts": {
        "build": "lerna run build --stream --prefix --npm-client\n      yarn",
        "ci-check": "carbon-cli ci-check",
        "clean": "lerna run clean &&\n      lerna clean --yes && rimraf node_modules",
        "doctoc": "doctoc --title '##\n      Table of Contents'",
        "format": "prettier --write '**/*.{js,md,scss,ts}'\n      '!**/{build,es,lib,storybook,ts,umd}/**'",
        "format:diff": "prettier\n      --list-different '**/*.{js,md,scss,ts}'\n      '!**/{build,es,lib,storybook,ts,umd}/**' '!packages/components/**'",
        "lint": "eslint actions config codemods packages",
        "lint:styles": "stylelint '**/*.{css,scss}' --report-needless-disables\n      --report-invalid-scope-disables",
        "sync": "carbon-cli sync",
        "test": "cross-env BABEL_ENV=test jest",
        "test:e2e": "cross-env BABEL_ENV=test\n      jest --testPathPattern=e2e\n      --testPathIgnorePatterns='examples,/packages/components/,/packages/react/'"
        },
        "resolutions": {
        "react": "~16.9.0",
        "react-dom": "~16.9.0",
        "react-is": "~16.9.0",
        "react-test-renderer": "~16.9.0"
        }
        }
        {
        "scripts": {
        "build": "lerna run build --stream --prefix --npm-client\n      yarn",
        "ci-check": "carbon-cli ci-check",
        "clean": "lerna run clean &&\n      lerna clean --yes && rimraf node_modules",
        "doctoc": "doctoc --title '##\n      Table of Contents'",
        "format": "prettier --write '**/*.{js,md,scss,ts}'\n      '!**/{build,es,lib,storybook,ts,umd}/**'",
        "format:diff": "prettier\n      --list-different '**/*.{js,md,scss,ts}'\n      '!**/{build,es,lib,storybook,ts,umd}/**' '!packages/components/**'",
        "lint": "eslint actions config codemods packages",
        "lint:styles": "stylelint '**/*.{css,scss}' --report-needless-disables\n      --report-invalid-scope-disables",
        "sync": "carbon-cli sync",
        "test": "cross-env BABEL_ENV=test jest",
        "test:e2e": "cross-env BABEL_ENV=test\n      jest --testPathPattern=e2e\n      --testPathIgnorePatterns='examples,/packages/components/,/packages/react/'"
        },
        "resolutions": {
        "react": "~16.9.0",
        "react-dom": "~16.9.0",
        "react-is": "~16.9.0",
        "react-test-renderer": "~16.9.0"
        }
        }
    </CodeSnippet>
</template>
```
## API Reference

<details>
<summary><h3>Code Snippet</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature 
    @package="carbon-components-ember" 
    @module='declarations/components/code-snippet' 
    @name='default' 
  />
</template>
```
</details>

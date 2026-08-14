import { s as setComponentTemplate, i as templateFactory, X as ThemeSwitcher, a3 as CarbonCodeSnippet, t as templateOnly, a0 as ComponentSignature, a1 as ThemeSwitcher$1 } from './main-BNcjraqC.js';

const repl_18 = setComponentTemplate(templateFactory(
/*
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
    "format": "prettier --write '**\/*.{js,md,scss,ts}'\n      '!**\/{build,es,lib,storybook,ts,umd}/**'",
    "format:diff": "prettier\n      --list-different '**\/*.{js,md,scss,ts}'\n      '!**\/{build,es,lib,storybook,ts,umd}/**' '!packages/components/**'",
    "lint": "eslint actions config codemods packages",
    "lint:styles": "stylelint '**\/*.{css,scss}' --report-needless-disables\n      --report-invalid-scope-disables",
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
    "format": "prettier --write '**\/*.{js,md,scss,ts}'\n      '!**\/{build,es,lib,storybook,ts,umd}/**'",
    "format:diff": "prettier\n      --list-different '**\/*.{js,md,scss,ts}'\n      '!**\/{build,es,lib,storybook,ts,umd}/**' '!packages/components/**'",
    "lint": "eslint actions config codemods packages",
    "lint:styles": "stylelint '**\/*.{css,scss}' --report-needless-disables\n      --report-invalid-scope-disables",
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
*/
{
  "id": "PhKl7bX2",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[8,[32,1],null,[[\"@type\"],[\"default\"]],[[\"default\"],[[[[1,\"Some code\"]],[]]]]],[1,\"\\n\\n\"],[10,2],[12],[1,\"\\n    Some text about this code\\n\"],[1,\"    \"],[8,[32,1],null,[[\"@type\"],[\"inline\"]],[[\"default\"],[[[[1,\"inline code\"]],[]]]]],[1,\"\\n    here\\n\"],[13],[1,\"\\n\\n\"],[8,[32,1],null,[[\"@type\"],[\"multiline\"]],[[\"default\"],[[[[1,\"\\n\"],[1,\"    {\\n    \\\"scripts\\\": {\\n    \\\"build\\\": \\\"lerna run build --stream --prefix --npm-client\\\\n      yarn\\\",\\n    \\\"ci-check\\\": \\\"carbon-cli ci-check\\\",\\n    \\\"clean\\\": \\\"lerna run clean &&\\\\n      lerna clean --yes && rimraf node_modules\\\",\\n    \\\"doctoc\\\": \\\"doctoc --title '##\\\\n      Table of Contents'\\\",\\n    \\\"format\\\": \\\"prettier --write '**/*.{js,md,scss,ts}'\\\\n      '!**/{build,es,lib,storybook,ts,umd}/**'\\\",\\n    \\\"format:diff\\\": \\\"prettier\\\\n      --list-different '**/*.{js,md,scss,ts}'\\\\n      '!**/{build,es,lib,storybook,ts,umd}/**' '!packages/components/**'\\\",\\n    \\\"lint\\\": \\\"eslint actions config codemods packages\\\",\\n    \\\"lint:styles\\\": \\\"stylelint '**/*.{css,scss}' --report-needless-disables\\\\n      --report-invalid-scope-disables\\\",\\n    \\\"sync\\\": \\\"carbon-cli sync\\\",\\n    \\\"test\\\": \\\"cross-env BABEL_ENV=test jest\\\",\\n    \\\"test:e2e\\\": \\\"cross-env BABEL_ENV=test\\\\n      jest --testPathPattern=e2e\\\\n      --testPathIgnorePatterns='examples,/packages/components/,/packages/react/'\\\"\\n    },\\n    \\\"resolutions\\\": {\\n    \\\"react\\\": \\\"~16.9.0\\\",\\n    \\\"react-dom\\\": \\\"~16.9.0\\\",\\n    \\\"react-is\\\": \\\"~16.9.0\\\",\\n    \\\"react-test-renderer\\\": \\\"~16.9.0\\\"\\n    }\\n    }\\n    {\\n    \\\"scripts\\\": {\\n    \\\"build\\\": \\\"lerna run build --stream --prefix --npm-client\\\\n      yarn\\\",\\n    \\\"ci-check\\\": \\\"carbon-cli ci-check\\\",\\n    \\\"clean\\\": \\\"lerna run clean &&\\\\n      lerna clean --yes && rimraf node_modules\\\",\\n    \\\"doctoc\\\": \\\"doctoc --title '##\\\\n      Table of Contents'\\\",\\n    \\\"format\\\": \\\"prettier --write '**/*.{js,md,scss,ts}'\\\\n      '!**/{build,es,lib,storybook,ts,umd}/**'\\\",\\n    \\\"format:diff\\\": \\\"prettier\\\\n      --list-different '**/*.{js,md,scss,ts}'\\\\n      '!**/{build,es,lib,storybook,ts,umd}/**' '!packages/components/**'\\\",\\n    \\\"lint\\\": \\\"eslint actions config codemods packages\\\",\\n    \\\"lint:styles\\\": \\\"stylelint '**/*.{css,scss}' --report-needless-disables\\\\n      --report-invalid-scope-disables\\\",\\n    \\\"sync\\\": \\\"carbon-cli sync\\\",\\n    \\\"test\\\": \\\"cross-env BABEL_ENV=test jest\\\",\\n    \\\"test:e2e\\\": \\\"cross-env BABEL_ENV=test\\\\n      jest --testPathPattern=e2e\\\\n      --testPathIgnorePatterns='examples,/packages/components/,/packages/react/'\\\"\\n    },\\n    \\\"resolutions\\\": {\\n    \\\"react\\\": \\\"~16.9.0\\\",\\n    \\\"react-dom\\\": \\\"~16.9.0\\\",\\n    \\\"react-is\\\": \\\"~16.9.0\\\",\\n    \\\"react-test-renderer\\\": \\\"~16.9.0\\\"\\n    }\\n    }\\n\"]],[]]]]]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher, CarbonCodeSnippet],
  "isStrictMode": true
}), templateOnly(undefined, "code-snippet.gjs"));

const repl_19 = setComponentTemplate(templateFactory(
/*
  <ComponentSignature 
  @package="carbon-components-ember" 
  @module='declarations/components/code-snippet' 
  @name='default' 
/>
*/
{
  "id": "qWEvPFr3",
  "block": "[[[8,[32,0],null,[[\"@package\",\"@module\",\"@name\"],[\"carbon-components-ember\",\"declarations/components/code-snippet\",\"default\"]],null]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ComponentSignature],
  "isStrictMode": true
}), templateOnly(undefined, "code-snippet.gjs"));

const codeSnippet_gjs = setComponentTemplate(templateFactory(
/*
  <ThemeSwitcher />
<h1 id="code-snippet">Code Snippet</h1>
<p>Code snippets are strings or small blocks of reusable code that can be copied and inserted in a code file.</p>
<carbon-shadow-demo id="repl_18" class="repl-sdk__demo"><div><repl_18></repl_18></div></carbon-shadow-demo>
<div class="repl-sdk__snippet" data-repl-output><pre><code class="language-gjs">import { CodeSnippet } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

&#x3C;template>
    &#x3C;ThemeSupport />
    &#x3C;CodeSnippet @type='default'>Some code&#x3C;/CodeSnippet>

    &#x3C;p>
        Some text about this code
        \{{! prettier-ignore }}
        &#x3C;CodeSnippet @type='inline'>inline code&#x3C;/CodeSnippet>
        here
    &#x3C;/p>

    \{{! prettier-ignore }}
    &#x3C;CodeSnippet @type='multiline'>
        \{{! template-lint-disable }}
        {
        "scripts": {
        "build": "lerna run build --stream --prefix --npm-client\n      yarn",
        "ci-check": "carbon-cli ci-check",
        "clean": "lerna run clean &#x26;&#x26;\n      lerna clean --yes &#x26;&#x26; rimraf node_modules",
        "doctoc": "doctoc --title '##\n      Table of Contents'",
        "format": "prettier --write '**\/*.{js,md,scss,ts}'\n      '!**\/{build,es,lib,storybook,ts,umd}/**'",
        "format:diff": "prettier\n      --list-different '**\/*.{js,md,scss,ts}'\n      '!**\/{build,es,lib,storybook,ts,umd}/**' '!packages/components/**'",
        "lint": "eslint actions config codemods packages",
        "lint:styles": "stylelint '**\/*.{css,scss}' --report-needless-disables\n      --report-invalid-scope-disables",
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
        "clean": "lerna run clean &#x26;&#x26;\n      lerna clean --yes &#x26;&#x26; rimraf node_modules",
        "doctoc": "doctoc --title '##\n      Table of Contents'",
        "format": "prettier --write '**\/*.{js,md,scss,ts}'\n      '!**\/{build,es,lib,storybook,ts,umd}/**'",
        "format:diff": "prettier\n      --list-different '**\/*.{js,md,scss,ts}'\n      '!**\/{build,es,lib,storybook,ts,umd}/**' '!packages/components/**'",
        "lint": "eslint actions config codemods packages",
        "lint:styles": "stylelint '**\/*.{css,scss}' --report-needless-disables\n      --report-invalid-scope-disables",
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
    &#x3C;/CodeSnippet>
&#x3C;/template>
</code></pre></div>
<h2 id="api-reference">API Reference</h2>
<details>
<summary><h3>Code Snippet</h3></summary>
<div id="repl_19" class="repl-sdk__demo"><repl_19></repl_19></div>
</details>
*/
{
  "id": "unenDOSb",
  "block": "[[[8,[32,0],null,null,null],[1,\"\\n\"],[10,\"h1\"],[14,1,\"code-snippet\"],[12],[1,\"Code Snippet\"],[13],[1,\"\\n\"],[10,2],[12],[1,\"Code snippets are strings or small blocks of reusable code that can be copied and inserted in a code file.\"],[13],[1,\"\\n\"],[10,\"carbon-shadow-demo\"],[14,1,\"repl_18\"],[14,0,\"repl-sdk__demo\"],[12],[10,0],[12],[8,[32,1],null,null,[[\"default\"],[[[],[]]]]],[13],[13],[1,\"\\n\"],[10,0],[14,0,\"repl-sdk__snippet\"],[14,\"data-repl-output\",\"\"],[12],[10,\"pre\"],[12],[10,\"code\"],[14,0,\"language-gjs\"],[12],[1,\"import { CodeSnippet } from 'carbon-components-ember/components';\\nimport { ThemeSupport } from 'docs-support';\\n\\n<template>\\n    <ThemeSupport />\\n    <CodeSnippet @type='default'>Some code</CodeSnippet>\\n\\n    <p>\\n        Some text about this code\\n        \"],[1,\"{{! prettier-ignore }}\\n        <CodeSnippet @type='inline'>inline code</CodeSnippet>\\n        here\\n    </p>\\n\\n    \"],[1,\"{{! prettier-ignore }}\\n    <CodeSnippet @type='multiline'>\\n        \"],[1,\"{{! template-lint-disable }}\\n        {\\n        \\\"scripts\\\": {\\n        \\\"build\\\": \\\"lerna run build --stream --prefix --npm-client\\\\n      yarn\\\",\\n        \\\"ci-check\\\": \\\"carbon-cli ci-check\\\",\\n        \\\"clean\\\": \\\"lerna run clean &&\\\\n      lerna clean --yes && rimraf node_modules\\\",\\n        \\\"doctoc\\\": \\\"doctoc --title '##\\\\n      Table of Contents'\\\",\\n        \\\"format\\\": \\\"prettier --write '**/*.{js,md,scss,ts}'\\\\n      '!**/{build,es,lib,storybook,ts,umd}/**'\\\",\\n        \\\"format:diff\\\": \\\"prettier\\\\n      --list-different '**/*.{js,md,scss,ts}'\\\\n      '!**/{build,es,lib,storybook,ts,umd}/**' '!packages/components/**'\\\",\\n        \\\"lint\\\": \\\"eslint actions config codemods packages\\\",\\n        \\\"lint:styles\\\": \\\"stylelint '**/*.{css,scss}' --report-needless-disables\\\\n      --report-invalid-scope-disables\\\",\\n        \\\"sync\\\": \\\"carbon-cli sync\\\",\\n        \\\"test\\\": \\\"cross-env BABEL_ENV=test jest\\\",\\n        \\\"test:e2e\\\": \\\"cross-env BABEL_ENV=test\\\\n      jest --testPathPattern=e2e\\\\n      --testPathIgnorePatterns='examples,/packages/components/,/packages/react/'\\\"\\n        },\\n        \\\"resolutions\\\": {\\n        \\\"react\\\": \\\"~16.9.0\\\",\\n        \\\"react-dom\\\": \\\"~16.9.0\\\",\\n        \\\"react-is\\\": \\\"~16.9.0\\\",\\n        \\\"react-test-renderer\\\": \\\"~16.9.0\\\"\\n        }\\n        }\\n        {\\n        \\\"scripts\\\": {\\n        \\\"build\\\": \\\"lerna run build --stream --prefix --npm-client\\\\n      yarn\\\",\\n        \\\"ci-check\\\": \\\"carbon-cli ci-check\\\",\\n        \\\"clean\\\": \\\"lerna run clean &&\\\\n      lerna clean --yes && rimraf node_modules\\\",\\n        \\\"doctoc\\\": \\\"doctoc --title '##\\\\n      Table of Contents'\\\",\\n        \\\"format\\\": \\\"prettier --write '**/*.{js,md,scss,ts}'\\\\n      '!**/{build,es,lib,storybook,ts,umd}/**'\\\",\\n        \\\"format:diff\\\": \\\"prettier\\\\n      --list-different '**/*.{js,md,scss,ts}'\\\\n      '!**/{build,es,lib,storybook,ts,umd}/**' '!packages/components/**'\\\",\\n        \\\"lint\\\": \\\"eslint actions config codemods packages\\\",\\n        \\\"lint:styles\\\": \\\"stylelint '**/*.{css,scss}' --report-needless-disables\\\\n      --report-invalid-scope-disables\\\",\\n        \\\"sync\\\": \\\"carbon-cli sync\\\",\\n        \\\"test\\\": \\\"cross-env BABEL_ENV=test jest\\\",\\n        \\\"test:e2e\\\": \\\"cross-env BABEL_ENV=test\\\\n      jest --testPathPattern=e2e\\\\n      --testPathIgnorePatterns='examples,/packages/components/,/packages/react/'\\\"\\n        },\\n        \\\"resolutions\\\": {\\n        \\\"react\\\": \\\"~16.9.0\\\",\\n        \\\"react-dom\\\": \\\"~16.9.0\\\",\\n        \\\"react-is\\\": \\\"~16.9.0\\\",\\n        \\\"react-test-renderer\\\": \\\"~16.9.0\\\"\\n        }\\n        }\\n    </CodeSnippet>\\n</template>\\n\"],[13],[13],[13],[1,\"\\n\"],[10,\"h2\"],[14,1,\"api-reference\"],[12],[1,\"API Reference\"],[13],[1,\"\\n\"],[10,\"details\"],[12],[1,\"\\n\"],[10,\"summary\"],[12],[10,\"h3\"],[12],[1,\"Code Snippet\"],[13],[13],[1,\"\\n\"],[10,0],[14,1,\"repl_19\"],[14,0,\"repl-sdk__demo\"],[12],[8,[32,2],null,null,[[\"default\"],[[[],[]]]]],[13],[1,\"\\n\"],[13]],[],[]]",
  "moduleName": "(unknown template module)",
  "scope": () => [ThemeSwitcher$1, repl_18, repl_19],
  "isStrictMode": true
}), templateOnly(undefined, "code-snippet.gjs"));

export { codeSnippet_gjs as default };

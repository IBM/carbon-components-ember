import Input from 'carbon-components-ember/components/form-input';
import Demo from 'ember-cli-addon-docs/components/docs-demo';
import set from 'carbon-components-ember/helpers/set';
import CodeSnippet from 'carbon-components-ember/components/code-snippet';
import RouteTemplate from 'ember-routable-component';
import Component from '@glimmer/component';

class RouteComponent extends Component {
  <template>
    <h1>
      Carbon Code Snippet
    </h1>

    <Demo as |demo|>
      <demo.example @name='code-snippet.hbs'>
        {{!import CodeSnippet from 'carbon-components-ember/components/code-snippet'}}

        {{! prettier-ignore }}
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
      </demo.example>
      <demo.snippet @name='code-snippet.hbs' />
    </Demo>
  </template>
}

export default RouteTemplate(RouteComponent);

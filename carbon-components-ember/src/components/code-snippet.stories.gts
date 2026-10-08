import { expect } from 'storybook/test';

import { withLayer } from '#storybook/decorators.gts';
import preview from '#storybook/preview.ts';
import CodeSnippet from './code-snippet.gts';
import CodeSnippetSkeleton from './code-snippet-skeleton.gts';

import type { CodeSnippetSignature } from './code-snippet.gts';

// Carbon React parity gaps (Components/CodeSnippet):
// - CodeSnippet only takes `type`; React's `align`, `autoAlign`,
//   `copyButtonDescription`, `feedback`, `feedbackTimeout`, `copyText`,
//   `disabled`, `hideCopyButton`, `wrapText`, `showMoreText`/`showLessText`
//   and the `min|max{Collapsed,Expanded}NumberOfRows` row limits aren't
//   supported (the multiline variant always collapses at 240px).
// - React's single-line type is `single`/`multi`; here it is
//   `default`/`multiline`.

const singlelineCode =
  'yarn add carbon-components@latest carbon-components-react@latest @carbon/icons-react@latest carbon-icons@latest';

const multilineCode = `{
  "scripts": {
    "build": "lerna run build --stream --prefix --npm-client yarn",
    "ci-check": "carbon-cli ci-check",
    "clean": "lerna run clean && lerna clean --yes && rimraf node_modules",
    "doctoc": "doctoc --title '## Table of Contents'",
    "format": "prettier --write '**/*.{js,md,scss,ts}' '!**/{build,es,lib,storybook,ts,umd}/**'",
    "format:diff": "prettier --list-different '**/*.{js,md,scss,ts}' '!**/{build,es,lib,storybook,ts,umd}/**' '!packages/components/**'",
    "lint": "eslint actions config codemods packages",
    "lint:styles": "stylelint '**/*.{css,scss}' --report-needless-disables --report-invalid-scope-disables",
    "sync": "carbon-cli sync",
    "test": "cross-env BABEL_ENV=test jest",
    "test:e2e": "cross-env BABEL_ENV=test jest --testPathPattern=e2e --testPathIgnorePatterns='examples,/packages/components/,/packages/react/'"
  },
  "resolutions": {
    "react": "~16.9.0",
    "react-dom": "~16.9.0",
    "react-is": "~16.9.0",
    "react-test-renderer": "~16.9.0"
  },
  "devDependencies": {
    "@babel/core": "^7.10.0",
    "@babel/plugin-proposal-class-properties": "^7.7.4",
    "@babel/plugin-proposal-export-default-from": "^7.7.4",
    "@babel/plugin-proposal-export-namespace-from": "^7.7.4",
    "@babel/plugin-transform-runtime": "^7.10.0",
    "@babel/preset-env": "^7.10.0",
    "@babel/preset-react": "^7.10.0",
    "@babel/runtime": "^7.10.0",
    "@commitlint/cli": "^8.3.5"
  }
}`;

// `code` isn't one of CodeSnippet's args: it's the text yielded into the
// snippet's block. `render` is annotated so the story-only arg is part of
// the inferred args.
type StoryArgs = CodeSnippetSignature['Args'] & { code: string };

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/CodeSnippet',
  component: CodeSnippet,
  parameters: {
    docs: {
      description: {
        component:
          'Code snippets are strings or small blocks of reusable code that can be copied and inserted in a code file.\n\nPass the code as the block. `@type` picks the variant: `default` (a single line), `multiline` (collapsed to 240px with a "Show more" toggle) or `inline` (a copy button that shows the code inline in running text).',
      },
    },
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['default', 'multiline', 'inline'],
    },
  },
  args: {
    type: 'default',
    code: singlelineCode,
  },
  render: (args: StoryArgs) => <template>
    <CodeSnippet @type={{args.type}}>{{args.code}}</CodeSnippet>
  </template>,
});

export const Inline = meta.story({
  args: {
    type: 'inline',
    code: 'node -v',
  },
});

Inline.test(
  'copies the code and shows feedback',
  async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Copy to clipboard' });
    await expect(button).toHaveTextContent('node -v');
    await userEvent.click(button);
    await expect(button).toHaveAccessibleName('Copied!');
  },
);

export const Multiline = meta.story({
  args: {
    type: 'multiline',
    code: multilineCode,
  },
});

Multiline.test('expands with Show more', async ({ canvas, userEvent }) => {
  const toggle = canvas.getByRole('button', { name: /show more/i });
  const snippet = toggle.closest('.cds--snippet')!;
  await expect(snippet).not.toHaveClass('cds--snippet--expand');
  await userEvent.click(toggle);
  await expect(snippet).toHaveClass('cds--snippet--expand');
});

export const Singleline = meta.story({
  args: {
    type: 'default',
    code: singlelineCode,
  },
});

Singleline.test(
  'the scrolling code is a focusable read-only textbox',
  async ({ canvas }) => {
    const textbox = canvas.getByRole('textbox', { name: 'Code Snippet Text' });
    await expect(textbox).toHaveAttribute('tabindex', '0');
    await expect(textbox).toHaveAttribute('aria-readonly', 'true');
  },
);

Singleline.test('copies the snippet', async ({ canvas, userEvent }) => {
  const button = canvas.getByRole('button', { name: 'Copy to clipboard' });
  await userEvent.click(button);
  await expect(button).toHaveAccessibleName('Copied!');
});

export const InlineWithLayer = Inline.extend({
  decorators: [withLayer],
});

export const MultilineWithLayer = Multiline.extend({
  decorators: [withLayer],
});

export const SinglelineWithLayer = Singleline.extend({
  decorators: [withLayer],
});

export const InlineInText = meta.story({
  args: {
    type: 'inline',
    code: 'inline code',
  },
  parameters: {
    docs: {
      description: {
        story: 'An inline snippet flows within a sentence.',
      },
    },
  },
  render: (args: StoryArgs) => <template>
    <p>
      Some text about this code
      <CodeSnippet @type={{args.type}}>{{args.code}}</CodeSnippet>
      here
    </p>
  </template>,
});

export const Skeleton = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`CodeSnippetSkeleton` stands in for the component while its content loads. Its own page has controls for its arguments.',
      },
    },
  },
  render: () => <template><CodeSnippetSkeleton /></template>,
});

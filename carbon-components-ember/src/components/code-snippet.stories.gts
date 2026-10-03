import type { Decorator } from 'ember-storybook';
import { RenderStory } from 'ember-storybook';
import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import CodeSnippet from './code-snippet.gts';
import Layer from './layer.gts';

import type { Args as CodeSnippetArgs } from './code-snippet.gts';

// Carbon React parity gaps (Components/CodeSnippet):
// - `Skeleton`: there is no CodeSnippetSkeleton.
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

// Renders the story on the background and on two nested layers, like
// Carbon React's `WithLayer` story template.
const withLayer: Decorator = (Story, context) => <template>
  <div style="padding: 1rem">
    <RenderStory @story={{Story}} @args={{context.args}} />
  </div>
  <Layer @withBackground={{true}} style="padding: 1rem" as |NextLayer|>
    <RenderStory @story={{Story}} @args={{context.args}} />
    <NextLayer @withBackground={{true}} style="padding: 1rem; margin-top: 1rem">
      <RenderStory @story={{Story}} @args={{context.args}} />
    </NextLayer>
  </Layer>
</template>;

// `code` isn't one of CodeSnippet's args: it's the text yielded into the
// snippet's block. `render` is annotated so the story-only arg is part of
// the inferred args.
type StoryArgs = CodeSnippetArgs & { code: string };

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
  // Known violation in CodeSnippet itself: its overflowing code container
  // isn't keyboard-focusable (axe: scrollable-region-focusable). React makes
  // it focusable (tabIndex 0, role textbox) when it overflows.
  parameters: {
    a11y: { test: 'todo' },
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
  // Known violation in CodeSnippet itself: its overflowing code container
  // isn't keyboard-focusable (axe: scrollable-region-focusable). React makes
  // it focusable (tabIndex 0, role textbox) when it overflows.
  parameters: {
    a11y: { test: 'todo' },
  },
});

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

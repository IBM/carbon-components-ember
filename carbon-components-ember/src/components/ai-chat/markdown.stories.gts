import { trackedObject } from '@ember/reactive/collections';
import { modifier } from 'ember-modifier';
import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import Markdown from './markdown.gts';

// Mirrors `@carbon/ai-chat-components`' `markdown.stories.js`
// (`Components/Markdown`): Default, Streaming, WithHTMLSanitization,
// WithHTMLRemoval.
//
// docs-app's demo (CommonMark + highlight, task list, table, fenced code and
// sanitized raw HTML) is the `Overview` story.
//
// Parity gaps (not faked):
// - `WithMarkdownItPlugin`, `WithTableOverride`, `WithLinkOverride`: the
//   Ember port has no `markdownItPlugins`/`customRenderers` extension points.
// - Fenced code and tables render as plain `<pre><code>`/`<table>`, not
//   upstream's `cds-aichat-code-snippet`/`cds-aichat-table` widgets, so the
//   `codeSnippet*`/`table*` label args (and `codeSnippetHighlight`) don't
//   exist here.
// - DOMPurify (which always runs) strips the `target` attribute, so
//   `{{target=_blank}}`/`{{target=_self}}` link attributes in the source have
//   no effect and links don't open in a new window as they do upstream.
// - `@sanitizeHTML` is accepted but a no-op: this port *always* sanitizes
//   with DOMPurify (upstream renders raw HTML unsanitized by default).
// - Upstream's `carbonTheme` arg isn't ported: the Storybook toolbar's
//   theme switcher applies Carbon's theme classes instead.

const comprehensiveMarkdown = `# Markdown Rendering Demo

This component supports ==comprehensive markdown rendering== with extended features. Visit the [Carbon Design System](https://carbondesignsystem.com){{target=_blank rel=noopener}} for more information.

## Text Formatting

The component supports **bold text**, *italic text*, \`inline code\`, ~~strikethrough~~, and ==highlighted text==.

You can combine formatting: ==**bold highlight**== and ==*italic highlight*==.

> This is a blockquote with **bold text** and *emphasis*.
> It can span multiple lines and include other formatting.

## Links
URL like structures will be auto-linked like https://ibm.com or ibm.com.

Also, Markdown links are supported like [Carbon Design System](https://carbondesignsystem.com).

By default links open in a new window, you can make them open in the same window by adding \`{{target=_self}}\` to the URL [Carbon Design System](https://carbondesignsystem.com){{target=_self}}.

## Lists

Unordered lists:
- Item one
- Item two
  - Nested item
  - Another nested item
- Item three

Ordered lists:
1. First item
2. Second item
3. Third item
---

## Code Examples

### JavaScript

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // Output: 55
\`\`\`

### Python

\`\`\`python
class DataProcessor:
    """A comprehensive data processing class with multiple methods."""

    def __init__(self, data):
        self.data = data
        self.processed = False

    def clean_data(self):
        """Remove None values and duplicates from data."""
        cleaned = [x for x in self.data if x is not None]
        return list(set(cleaned))

# Example usage
processor = DataProcessor([3, 6, 8, 10, 1, 2, 1, None, 5])
print(f"Processed data: {processor.clean_data()}")
\`\`\`

### Inline Code

Use \`npm install\` to install dependencies and \`npm run build\` to build the project.

## Data Tables

### Sales Report 2024

| Month | Revenue | Units Sold | Growth |
|-------|---------|------------|--------|
| January | $127,000 | 4,832 | +12% |
| February | $143,000 | 5,123 | +15% |
| March | $156,000 | 5,477 | +18% |
| April | $168,000 | 5,892 | +21% |
| **Total** | **$594,000** | **21,324** | **+16%** |


## Custom attributes

Attributes supported: (\`target\`, \`rel\`, \`class\`, \`id\`)

### Header with custom id{{id=extended-links}}

[Open in current tab](https://carbondesignsystem.com){{target=_self}}`;

const htmlSanitizationMarkdown = `# HTML Content Handling

This component can handle HTML content in different ways:

## With Sanitization

When \`sanitize-html\` is enabled, potentially dangerous HTML is removed:

<p style="color: blue;">This paragraph has inline styles (safe).</p>

<script>alert('This would be removed')</script>

Without sanitization, this link runs javascript via onclick to show an alert window.

<a href="https://example.com" onclick="alert('dangerous')">This link is safe, but onclick is removed</a>

## Emphasis with HTML

You can use <strong>strong tags</strong> and <em>emphasis tags</em> alongside **markdown bold** and *markdown italic*.

## Mixed Content

Regular markdown works fine:
- List item with <code>HTML code tag</code>
- List item with \`markdown code\`

<blockquote>HTML blockquote</blockquote>

> Markdown blockquote`;

// docs-app's demo source.
const docsSample = `# Markdown demo

Renders **CommonMark** with a few extensions: ==highlighted text==, GFM
task lists, and tables.

- [x] Parses markdown-it syntax
- [ ] Renders an interactive checklist (read-only in this port)

| Feature | Status |
| --- | --- |
| Tables | ✅ |
| Task lists | ✅ |
| Fenced code | ✅ |

\`\`\`js
const greet = (name) => \`Hello, \${name}!\`;
\`\`\`

Raw HTML in the source (e.g. \`<script>alert(1)</script>\`) is always
sanitized before rendering, even without \`@sanitizeHTML\`.
`;

const meta = preview.meta({
  title: 'AI Chat/Markdown',
  component: Markdown,
  parameters: {
    docs: {
      description: {
        component: `\`Markdown\` parses \`@markdown\` with \`markdown-it\` (CommonMark, plus tables, strikethrough, autolinking, GFM task lists, and \`==highlight==\` extended syntax) and renders it as sanitized, Carbon-styled HTML.

Unlike upstream's \`cds-aichat-markdown\`, rendered HTML is **always** run through DOMPurify before being injected, regardless of \`@sanitizeHTML\` — see the component's class doc for the full reasoning. Set \`@removeHTML={{true}}\` to strip raw HTML from the source entirely instead of just sanitizing it.`,
      },
    },
  },
  args: {
    markdown: comprehensiveMarkdown,
    streaming: false,
    sanitizeHTML: false,
    removeHTML: false,
  },
});

export const Default = meta.story();

Default.test('renders extended markdown syntax', async ({ canvas }) => {
  await expect(
    canvas.getByRole('heading', { level: 1, name: 'Markdown Rendering Demo' }),
  ).toBeVisible();
  const [firstHighlight] = canvas.getAllByText(
    'comprehensive markdown rendering',
  );
  await expect(firstHighlight?.tagName).toBe('MARK');
  await expect(canvas.getByText('strikethrough').tagName).toBe('S');
  const [carbonLink] = canvas.getAllByRole('link', {
    name: 'Carbon Design System',
  });
  await expect(carbonLink).toHaveAttribute(
    'href',
    'https://carbondesignsystem.com',
  );
  await expect(
    canvas.getByRole('link', { name: 'https://ibm.com' }),
  ).toHaveAttribute('href', 'https://ibm.com');
  await expect(canvas.getByRole('table')).toBeVisible();
  await expect(
    canvas.getByRole('heading', { name: 'Header with custom id' }),
  ).toHaveAttribute('id', 'extended-links');
});

// Upstream's `StreamingDemo`: appends the source three words at a time every
// 50ms, with a restart button, while `@streaming` throttles re-renders.
export const Streaming = meta.story({
  args: {
    markdown: '',
    streaming: true,
  },
  render: (args) => {
    const chunks = comprehensiveMarkdown.match(/(?:\S*\s+){1,3}|\S+$/g) ?? [];
    const state = trackedObject({ content: '', restarts: 0 });
    const restart = () => {
      state.content = '';
      state.restarts++;
    };
    const stream = modifier<{
      Element: HTMLElement;
      Args: { Positional: [number] };
    }>(() => {
      let index = 0;
      const interval = setInterval(() => {
        const chunk = chunks[index++];
        if (chunk === undefined) {
          clearInterval(interval);
          return;
        }
        state.content += chunk;
      }, 50);
      return () => clearInterval(interval);
    });

    return <template>
      <div {{stream state.restarts}}>
        <div style="margin-bottom: 1rem;">
          <Button @size="sm" @tertiary={{true}} @onClick={{restart}}>
            Restart Streaming
          </Button>
        </div>
        <Markdown
          @streaming={{args.streaming}}
          @markdown={{state.content}}
          @removeHTML={{args.removeHTML}}
        />
      </div>
    </template>;
  },
});

Streaming.test('progressively renders streamed content', async ({ canvas }) => {
  await expect(
    await canvas.findByRole('heading', { name: 'Markdown Rendering Demo' }),
  ).toBeVisible();
  await expect(
    await canvas.findByRole('heading', { name: 'Text Formatting' }),
  ).toBeVisible();
});

export const WithHTMLSanitization = meta.story({
  args: {
    markdown: htmlSanitizationMarkdown,
    sanitizeHTML: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dangerous HTML like `<script>` tags and `onclick` attributes is removed while safe HTML is preserved. In this port that happens whether or not `@sanitizeHTML` is set.',
      },
    },
  },
});

WithHTMLSanitization.test(
  'strips dangerous HTML but keeps safe HTML',
  async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('.cds-aichat-markdown');
    await expect(root?.querySelector('script')).toBeNull();
    const link = canvas.getByRole('link', {
      name: 'This link is safe, but onclick is removed',
    });
    await expect(link).toHaveAttribute('href', 'https://example.com');
    await expect(link).not.toHaveAttribute('onclick');
    await expect(canvas.getByText('strong tags').tagName).toBe('STRONG');
    await expect(canvas.getByText('HTML blockquote').tagName).toBe(
      'BLOCKQUOTE',
    );
  },
);

// Sanitization is unconditional in this port, so the same unsafe source is
// sanitized even with `@sanitizeHTML={{false}}`.
export const UnsafeHTMLWithoutSanitizeFlag = meta.story({
  args: {
    markdown:
      '<img src="x" onerror="alert(1)" alt="Broken image">\n\n[Click me](javascript:alert(1))\n\n<script>alert(1)</script>',
    sanitizeHTML: false,
  },
});

UnsafeHTMLWithoutSanitizeFlag.test(
  'sanitizes even when @sanitizeHTML is false',
  async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.cds-aichat-markdown');
    await expect(root?.querySelector('script')).toBeNull();
    await expect(root?.querySelector('[onerror]')).toBeNull();
    await expect(root?.querySelector('a[href^="javascript:"]')).toBeNull();
  },
);

export const WithHTMLRemoval = meta.story({
  args: {
    markdown: htmlSanitizationMarkdown,
    removeHTML: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `@removeHTML` all raw HTML is left unparsed (shown as text), leaving only markdown.',
      },
    },
  },
});

WithHTMLRemoval.test(
  'does not parse raw HTML',
  async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('.cds-aichat-markdown');
    await expect(root?.querySelector('script')).toBeNull();
    await expect(
      canvas.queryByRole('link', {
        name: 'This link is safe, but onclick is removed',
      }),
    ).toBeNull();
    await expect(root?.querySelector('strong')).toHaveTextContent(
      'markdown bold',
    );
    await expect(root).toHaveTextContent('<strong>strong tags</strong>');
  },
);

// docs-app's demo.
export const Overview = meta.story({
  args: {
    markdown: docsSample,
  },
  parameters: {
    // Known violation in Markdown itself: GFM task-list checkboxes render as
    // bare <input type="checkbox"> without an associated label (label).
    // Reported as warnings until the component is fixed.
    a11y: { test: 'todo' },
  },
});

Overview.test(
  'renders task lists, tables and fenced code',
  async ({ canvas, canvasElement }) => {
    const checkboxes = canvas.getAllByRole('checkbox');
    await expect(checkboxes).toHaveLength(2);
    await expect(checkboxes[0]).toBeChecked();
    await expect(checkboxes[0]).toBeDisabled();
    await expect(checkboxes[1]).not.toBeChecked();
    await expect(canvas.getByRole('table')).toBeVisible();
    await expect(canvasElement.querySelector('pre code')).toHaveTextContent(
      'const greet',
    );
    await expect(canvasElement.querySelector('script')).toBeNull();
  },
);

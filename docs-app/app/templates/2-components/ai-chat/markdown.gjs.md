<ThemeSwitcher />

# Markdown

`Markdown` parses `@markdown` with `markdown-it` (CommonMark, plus tables,
strikethrough, autolinking, GFM task lists, and `==highlight==` extended
syntax) and renders it as sanitized, Carbon-styled HTML. Unlike upstream's
`cds-aichat-markdown`, rendered HTML is **always** run through DOMPurify
before being injected, regardless of `@sanitizeHTML` — see the component's
class doc (`declarations/components/ai-chat/markdown`) for the full
reasoning. Set `@removeHTML={{true}}` to strip raw HTML from the source
entirely instead of just sanitizing it.

```gjs live preview
import { Markdown } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const sample = `# Markdown demo

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

<template>
  <ThemeSupport />
  <Markdown @markdown={{sample}} />
</template>
```

## API Reference

<details>
<summary><h3>Markdown</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/markdown'
    @name='default'
  />
</template>
```
</details>

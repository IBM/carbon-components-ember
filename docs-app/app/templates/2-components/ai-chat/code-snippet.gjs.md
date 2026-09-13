<ThemeSwitcher />

# AiChatCodeSnippet

`AiChatCodeSnippet` is a CodeMirror 6 powered code display/editor: syntax
highlighting, line folding, and a collapse/expand affordance for long
snippets. Exported as `AiChatCodeSnippet` (an existing Carbon React
`CodeSnippet` already occupies the plain name). `@code` is the sole content
source — pass a plain string (update it however you like, e.g. token by
token while streaming a response) and the editor stays in sync via a
throttled diff, not a full reset, so scroll position and selection survive.

CodeMirror itself, and each individual language grammar, is dynamically
imported the first time a snippet actually renders — a page with no
`AiChatCodeSnippet` on it never downloads any of this.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { AiChatCodeSnippet } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const sample = `function greet(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}
`;

class Demo extends Component {
  @tracked code = sample;

  <template>
    <ThemeSupport />
    <AiChatCodeSnippet @code={{this.code}} @language='javascript' @highlight={{true}} @detectLanguage={{true}} />
  </template>
}

<template><Demo /></template>
```

## Editable

Setting `@editable={{true}}` turns the snippet into a live editor.
`@onChange` fires with the new content on every edit, and language
detection re-runs as you type when no explicit `@language` is set.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { AiChatCodeSnippet } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class Demo extends Component {
  @tracked code = 'def greet(name):\n    print(f"Hello, {name}!")\n';

  onChange = (value) => {
    this.code = value;
  };

  <template>
    <ThemeSupport />
    <AiChatCodeSnippet
      @code={{this.code}}
      @editable={{true}}
      @highlight={{true}}
      @detectLanguage={{true}}
      @onChange={{this.onChange}}
    />
  </template>
}

<template><Demo /></template>
```

## Collapsing long snippets

`@maxCollapsedNumberOfRows` (default `15`) caps the collapsed height; once
content exceeds it a "Show more"/"Show less" control appears.
`@maxCollapsedNumberOfRows={{0}}` together with `@maxExpandedNumberOfRows={{0}}`
switches to fill-container mode instead, where the snippet fills its host's
height with its own scrollbar and no expand affordance.

```gjs live preview
import { AiChatCodeSnippet } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const manyLines = Array.from({ length: 40 }, (_, i) => `line ${i + 1} = ${i};`).join('\n');

<template>
  <ThemeSupport />
  <AiChatCodeSnippet @code={{manyLines}} @language='javascript' @highlight={{true}} @maxCollapsedNumberOfRows={{6}} />
</template>
```

## Diff language

The `diff` language additionally colors inserted/deleted lines.

```gjs live preview
import { AiChatCodeSnippet } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const diff = `--- a/greet.js
+++ b/greet.js
@@ -1,3 +1,3 @@
 function greet(name) {
-  console.log('Hi ' + name);
+  console.log(\`Hello, \${name}!\`);
 }
`;

<template>
  <ThemeSupport />
  <AiChatCodeSnippet @code={{diff}} @language='diff' @highlight={{true}} @detectLanguage={{true}} />
</template>
```

## API Reference

<details>
<summary><h3>AiChatCodeSnippet</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/code-snippet'
    @name='default'
  />
</template>
```
</details>

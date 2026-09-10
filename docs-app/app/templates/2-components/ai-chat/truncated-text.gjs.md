<ThemeSwitcher />

# AiChatTruncatedText

`AiChatTruncatedText` clamps text (or arbitrary block content) to a maximum
number of `@lines`, revealing the rest via a tooltip (`@type='tooltip'`, the
default) or an inline expand/collapse toggle (`@type='expand'`). Pass
`@value` for plain text, or a block for rich content — the tooltip variant's
label always uses `@value`, matching upstream.

```gjs live preview
import { AiChatTruncatedText } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.';

<template>
  <ThemeSupport />
  <div style='max-inline-size: 20rem;'>
    <p>Tooltip mode (default), 2 lines:</p>
    <AiChatTruncatedText @lines={{2}} @value={{longText}} />
    <br />
    <br />
    <p>Expand mode, 2 lines:</p>
    <AiChatTruncatedText
      @type='expand'
      @lines={{2}}
      @value={{longText}}
      @expandLabel='Show more'
      @collapseLabel='Show less'
    />
  </div>
</template>
```

## API Reference

<details>
<summary><h3>AiChatTruncatedText</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/truncated-text'
    @name='default'
  />
</template>
```
</details>

<ThemeSwitcher />

# AiChatCard

`AiChatCard` is a card container for
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat),
typically rendered inside a message in `ChatShell`'s `<:messages>` block.
Content is supplied through `<:header>`, `<:media>`, `<:body>`, `<:footer>`
(commonly an [`AiChatCardFooter`](./card-footer.md)), and `<:decorator>`
named blocks.

```gjs live preview
import { AiChatCard } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

<template>
  <ThemeSupport />
  <div style='display: flex; gap: 1rem; flex-wrap: wrap;'>
    <AiChatCard style='max-inline-size: 18rem;'>
      <:header><h5>Default card</h5></:header>
      <:body>Card content goes here.</:body>
    </AiChatCard>
    <AiChatCard @isLayered={{true}} style='max-inline-size: 18rem;'>
      <:header><h5>Layered card</h5></:header>
      <:body>Uses Carbon's layered-tile styling instead of the chat shell's default background.</:body>
    </AiChatCard>
    <AiChatCard @isFlush={{true}} style='max-inline-size: 18rem;'>
      <:header><h5>Flush card</h5></:header>
      <:body>Removes the default padding, useful when the body needs to reach the card's edges.</:body>
    </AiChatCard>
  </div>
</template>
```

## API Reference

<details>
<summary><h3>AiChatCard</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/card'
    @name='default'
  />
</template>
```
</details>

<ThemeSwitcher />

# AiChatChatButton

`AiChatChatButton` is a button styled for AI Chat surfaces: a taller pill
radius than this addon's plain `Button`, plus an `@isQuickAction` variant (a
small, outlined chip used for quick-reply-style options) that can be marked
`@isSelected` once chosen.

Exported as `AiChatChatButton` because Carbon React has its own (not yet
implemented) `ChatButton`.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import { array, fn } from '@ember/helper';
import { eq } from 'ember-truth-helpers';
import Component from '@glimmer/component';
import { AiChatChatButton } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class Demo extends Component {
  @tracked selected = 'red';

  select = (value) => {
    this.selected = value;
  };

  <template>
    <ThemeSupport />
    <div style='display: flex; gap: 1rem; margin-block-end: 1rem;'>
      <AiChatChatButton @onClick={{fn this.select 'primary'}}>Primary action</AiChatChatButton>
      <AiChatChatButton @kind='secondary' @onClick={{fn this.select 'secondary'}}>Secondary action</AiChatChatButton>
    </div>
    <div style='display: flex; gap: 0.5rem;'>
      {{#each (array 'red' 'green' 'blue') as |color|}}
        <AiChatChatButton
          @isQuickAction={{true}}
          @isSelected={{eq this.selected color}}
          @onClick={{fn this.select color}}
        >{{color}}</AiChatChatButton>
      {{/each}}
    </div>
  </template>
}

<template><Demo /></template>
```

## API Reference

<details>
<summary><h3>AiChatChatButton</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/chat-button'
    @name='default'
  />
</template>
```
</details>

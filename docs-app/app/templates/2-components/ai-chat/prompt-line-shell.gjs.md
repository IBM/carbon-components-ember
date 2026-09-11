<ThemeSwitcher />

# PromptLineShell

Layout-only composer chrome for the chat input: `PromptLineShell` defines
six named blocks (`<:editor>`, `<:messageActions>`, `<:fileUploads>`,
`<:autocompleteContent>`, `<:fieldMessaging>`, `<:sendControl>`) and the
spacing/border treatment around them. It carries no chat-domain logic and
forwards no editor methods — compose a `PromptLine` (or your own editing
surface) into `<:editor>`.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { Button, PromptLine, PromptLineShell, Tooltip } from 'carbon-components-ember/components';
import { Send } from 'carbon-components-ember/icons';
import { ThemeSupport } from 'docs-support';

class Demo extends Component {
  @tracked content = '';
  @tracked messages = [];

  onChange = (value) => {
    this.content = value;
  };

  send = () => {
    if (!this.content) {
      return;
    }
    this.messages = [...this.messages, this.content];
    this.content = '';
  };

  <template>
    <ThemeSupport />
    <ul>
      {{#each this.messages as |message|}}
        <li>{{message}}</li>
      {{/each}}
    </ul>
    <PromptLineShell @rounded={{true}}>
      <:editor>
        <PromptLine
          @content={{this.content}}
          @placeholder='Type a message...'
          @onChange={{this.onChange}}
          @onSendIntent={{this.send}}
        />
      </:editor>
      <:sendControl>
        <Tooltip @label='Send' @autoAlign={{true}}>
          <Button @type={{undefined}} @ghost={{true}} @size='sm' @iconOnly={{true}} @onClick={{this.send}} aria-label='Send'>
            <Send @size='16' />
          </Button>
        </Tooltip>
      </:sendControl>
    </PromptLineShell>
  </template>
}

<template><Demo /></template>
```

## API Reference

<details>
<summary><h3>PromptLineShell</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/prompt-line-shell'
    @name='default'
  />
</template>
```
</details>

<ThemeSwitcher />

# PromptLine

`PromptLine` is the editing surface of the chat input stack, typically
composed inside a `PromptLineShell`'s `<:editor>` block. This port covers
upstream's default (Tiptap-free) `<textarea>` editing surface only — the
rich Tiptap mode is a separate runtime-dependency decision left for a
follow-up.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { PromptLine } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class Demo extends Component {
  @tracked content = '';
  @tracked lastSent = 'none yet';

  onChange = (value) => {
    this.content = value;
  };

  onSendIntent = () => {
    this.lastSent = this.content;
    this.content = '';
  };

  <template>
    <ThemeSupport />
    <p>Last sent: {{this.lastSent}}</p>
    <PromptLine
      @content={{this.content}}
      @placeholder='Type a message...'
      @onChange={{this.onChange}}
      @onSendIntent={{this.onSendIntent}}
    />
  </template>
}

<template><Demo /></template>
```

Press Enter to send (Shift+Enter inserts a newline instead).

## API Reference

<details>
<summary><h3>PromptLine</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/prompt-line'
    @name='default'
  />
</template>
```
</details>

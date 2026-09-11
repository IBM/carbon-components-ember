<ThemeSwitcher />

# PromptLine

`PromptLine` is the editing surface of the chat input stack, typically
composed inside a `PromptLineShell`'s `<:editor>` block. It renders a plain
`<textarea>` by default and never statically imports `@tiptap/*` — setting
`@rich` (or calling `ensureEditor()` off the handle `@onReady` provides)
dynamically loads a small Tiptap runtime chunk and upgrades the surface in
place, carrying the text, caret, and focus over losslessly. Both modes
share the same `@content`/`@onChange`/`@onSendIntent` contract.

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

## Rich (Tiptap) editing mode

Setting `@rich={{true}}` upgrades the textarea to a Tiptap-backed
contenteditable surface — useful when a host wants to compose its own
`@extensions` (e.g. formatting marks) on top of the same Enter-to-send
keymap. `@onReady` hands back an imperative API (`getEditor`,
`ensureEditor`, `undo`/`redo`, `insertContent`, …) that works the same in
either mode.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { PromptLine } from 'carbon-components-ember/components';
import { ThemeSupport } from 'docs-support';

class Demo extends Component {
  @tracked content = '';
  @tracked rich = false;
  api;

  onChange = (value) => {
    this.content = value;
  };

  onReady = (api) => {
    this.api = api;
  };

  enableRich = () => {
    this.rich = true;
  };

  undo = () => {
    this.api?.undo();
  };

  <template>
    <ThemeSupport />
    <button type='button' {{on 'click' this.enableRich}} disabled={{this.rich}}>
      Switch to rich editing
    </button>
    <button type='button' {{on 'click' this.undo}}>Undo</button>
    <PromptLine
      @content={{this.content}}
      @placeholder='Type a message...'
      @onChange={{this.onChange}}
      @rich={{this.rich}}
      @onReady={{this.onReady}}
    />
  </template>
}

<template><Demo /></template>
```

`@extensions` accepts plain Tiptap `Extension`s appended to the base Carbon
bundle (schema, undo/redo, placeholder, plain-text paste, the
Enter/Mod-Enter/Escape keymap) — memoize the array you pass, since a fresh
one every render rebuilds the live editor (content, selection, and focus
survive; undo history doesn't). Mention/autocomplete extensions aren't
ported yet, so `@extensions` is for plain formatting-style Tiptap
extensions only.

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

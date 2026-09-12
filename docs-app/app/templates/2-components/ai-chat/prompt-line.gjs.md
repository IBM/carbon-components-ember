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
survive; undo history doesn't).

## Mention, command, autocomplete, and starter triggers

`buildCarbonExtensions` (and the individual `carbonMention`/`carbonCommand`/
`carbonAutocomplete`/`carbonStarterTrigger` factories it wraps, all under
`carbon-components-ember/components/ai-chat/-prompt-line/tiptap/`) build
Tiptap extensions you pass through `@extensions` like any other — `PromptLine`
itself has no dedicated mention/command/autocomplete/starter args, matching
upstream's own `<cds-aichat-prompt-line>`. The extensions only dispatch a
bubbling `cds-aichat-trigger-change` DOM event with `{ type, query,
triggerOffset }`; **the actual popup is `PromptLineAutocomplete`** (its own
doc page has the full reference and more examples) — pair it with a
`PromptLine` via the imperative handle from `@onReady`.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { PromptLine, PromptLineAutocomplete } from 'carbon-components-ember/components';
import { buildCarbonExtensions } from 'carbon-components-ember/components/ai-chat/-prompt-line/tiptap/build-extensions';
import { ThemeSupport } from 'docs-support';

const PEOPLE = [
  { id: '1', label: 'Alice' },
  { id: '2', label: 'Bob' },
  { id: '3', label: 'Priya' },
];
const COMMANDS = [
  { id: 'c1', label: 'summarize' },
  { id: 'c2', label: 'translate' },
];
const STARTERS = [
  { id: 's1', label: 'Summarize this thread' },
  { id: 's2', label: 'Draft a reply' },
];

const mention = { trigger: '@', items: PEOPLE };
const command = { trigger: '/', items: COMMANDS };
const starters = { items: STARTERS };

class Demo extends Component {
  @tracked content = '';
  @tracked api;

  extensions = buildCarbonExtensions({ mention, command, starters });

  onChange = (value) => {
    this.content = value;
  };

  onReady = (api) => {
    this.api = api;
  };

  <template>
    <ThemeSupport />
    <PromptLine
      @content={{this.content}}
      @placeholder='Type @ to mention someone, / for a command, or focus while empty for starters...'
      @rich={{true}}
      @extensions={{this.extensions}}
      @onChange={{this.onChange}}
      @onReady={{this.onReady}}
    />
    <PromptLineAutocomplete @promptLine={{this.api}} @mention={{mention}} @command={{command}} @starters={{starters}} />
  </template>
}

<template><Demo /></template>
```

A command chip (`/summarize`) is prefixed with its trigger character by
default; a mention chip (`Alice`) isn't — either default can be overridden
per-config or per-item via `showTriggerInChip`. Focus the field while empty
to see the starter prompts, then start typing `@`/`/` to switch to mention/
command — all three trigger types share one editor here, which is the live
proof of the fix described next.

Mention, command, autocomplete, and starter extensions each react to the
*same* document changes and dispatch `cds-aichat-trigger-change`
independently (see `trigger-utils.ts`'s "concurrent transitions" doc
comment) — combined on one editor, typing `@` after focusing an empty field
can dispatch the starter list's own exit event (`null`) *after* the mention
trigger's own opening event, since each extension's lifecycle hook runs on
its own schedule. A naive "last event wins" listener can momentarily see a
stale `null` in that case and hide its popup even though a trigger is
genuinely open. `PromptLineAutocomplete` reconciles this for real (batches
same-tick events by microtask, resolves to the last non-null one) — see its
own doc page and AGENTS.md's "Porting Carbon AI Chat" section for the full
write-up.

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

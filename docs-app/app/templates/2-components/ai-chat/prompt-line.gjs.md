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

## Mention, command, and autocomplete triggers

`buildCarbonExtensions` (and the individual `carbonMention`/`carbonCommand`/
`carbonAutocomplete`/`carbonStarterTrigger` factories it wraps, all under
`carbon-components-ember/components/ai-chat/-prompt-line/tiptap/`) build
Tiptap extensions you pass through `@extensions` like any other. This port
ships **no suggestion popup UI** — a host listens for the real, bubbling
`cds-aichat-trigger-change` DOM event (the same way it already can for
`keydown`), renders its own popup from the event's `{ type, query,
triggerOffset }` detail plus its own copy of the same `items`, and completes
or cancels the trigger via `api.selectSuggestion()`/`api.dismissSuggestion()`.
This demo's popup is intentionally minimal (a plain filtered `<ul>`) to keep
the focus on the extension/event contract rather than a full picker UI.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { PromptLine } from 'carbon-components-ember/components';
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

class Demo extends Component {
  @tracked content = '';
  @tracked trigger = null;
  @tracked items = [];
  api;

  extensions = buildCarbonExtensions({
    mention: { trigger: '@', items: PEOPLE },
    command: { trigger: '/', items: COMMANDS },
  });

  onChange = (value) => {
    this.content = value;
  };

  onReady = (api) => {
    this.api = api;
  };

  onTriggerChange = (event) => {
    const detail = event.detail;
    this.trigger = detail;
    if (!detail) {
      this.items = [];
      return;
    }
    const query = detail.query.toLowerCase();
    const source = detail.type === 'command' ? COMMANDS : PEOPLE;
    this.items = source.filter((item) => item.label.toLowerCase().includes(query));
  };

  select = (item) => {
    this.api?.selectSuggestion(item);
  };

  <template>
    <ThemeSupport />
    <PromptLine
      @content={{this.content}}
      @placeholder='Type @ to mention someone, or / for a command...'
      @rich={{true}}
      @extensions={{this.extensions}}
      @onChange={{this.onChange}}
      @onReady={{this.onReady}}
      {{on 'cds-aichat-trigger-change' this.onTriggerChange}}
    />
    {{#if this.trigger}}
      <ul class='mention-demo-popup'>
        {{#each this.items as |item|}}
          <li>
            <button type='button' {{on 'click' (fn this.select item)}}>{{item.label}}</button>
          </li>
        {{else}}
          <li>No matches</li>
        {{/each}}
      </ul>
    {{/if}}
  </template>
}

<template><Demo /></template>
```

A command chip (`/summarize`) is prefixed with its trigger character by
default; a mention chip (`Alice`) isn't — either default can be overridden
per-config or per-item via `showTriggerInChip`.

## Starter prompts

`carbonStarterTrigger` fires `type: 'starter'` whenever the field is empty
and focused, and `null` as soon as you start typing.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { PromptLine } from 'carbon-components-ember/components';
import { buildCarbonExtensions } from 'carbon-components-ember/components/ai-chat/-prompt-line/tiptap/build-extensions';
import { ThemeSupport } from 'docs-support';

const STARTERS = [
  { id: 's1', label: 'Summarize this thread' },
  { id: 's2', label: 'Draft a reply' },
];

class Demo extends Component {
  @tracked content = '';
  @tracked active = false;
  api;

  extensions = buildCarbonExtensions({ starters: { items: STARTERS } });

  onChange = (value) => {
    this.content = value;
  };

  onReady = (api) => {
    this.api = api;
  };

  onTriggerChange = (event) => {
    this.active = event.detail?.type === 'starter';
  };

  send = (item) => {
    this.api?.insertContent(item.label);
    this.api?.getEditor()?.commands.focus();
  };

  <template>
    <ThemeSupport />
    <PromptLine
      @content={{this.content}}
      @placeholder='Click the field...'
      @rich={{true}}
      @extensions={{this.extensions}}
      @onChange={{this.onChange}}
      @onReady={{this.onReady}}
      {{on 'cds-aichat-trigger-change' this.onTriggerChange}}
    />
    {{#if this.active}}
      <ul class='mention-demo-popup'>
        {{#each STARTERS as |item|}}
          <li>
            <button type='button' {{on 'click' (fn this.send item)}}>{{item.label}}</button>
          </li>
        {{/each}}
      </ul>
    {{/if}}
  </template>
}

<template><Demo /></template>
```

Starters are shown as their own demo, not layered onto the mention/command
one above: `carbonMention`/`carbonCommand`/`carbonAutocomplete` and
`carbonStarterTrigger` are independent Tiptap extensions that each react to
the same document changes and dispatch `cds-aichat-trigger-change`
separately (see `trigger-utils.ts`'s "concurrent transitions" doc comment)
— combined on one editor, typing `@` after focusing an empty field can
observe the starter list's own exit event (`null`) fire *after* the mention
trigger's own opening event, since each extension's lifecycle hook runs
independently. A naive "last event wins" listener (like both of these
demos') can momentarily see a stale `null` in that case. Reconciling that
into one authoritative, coalesced state — matching several trigger types
active on the same editor — is exactly the job of upstream's own
(not-yet-ported) `autocomplete-controller.ts`.

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

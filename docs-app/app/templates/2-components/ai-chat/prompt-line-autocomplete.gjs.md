<ThemeSwitcher />

# PromptLineAutocomplete

The suggestion overlay for `PromptLine`'s mention (`@`), command (`/`),
autocomplete, and starter-prompt Tiptap extensions (see the
[PromptLine](./prompt-line) doc page for building those). Pair one
`PromptLineAutocomplete` with exactly one `PromptLine` via the imperative
handle from its `@onReady` — typically composed inside a `PromptLineShell`'s
`<:autocompleteContent>` block, as below.

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { Button, PromptLine, PromptLineAutocomplete, PromptLineShell, Tooltip } from 'carbon-components-ember/components';
import { Send } from 'carbon-components-ember/icons';
import { buildCarbonExtensions } from 'carbon-components-ember/components/ai-chat/-prompt-line/tiptap/build-extensions';
import { ThemeSupport } from 'docs-support';

const PEOPLE = [
  { id: '1', label: 'Alice', description: 'Design' },
  { id: '2', label: 'Bob', description: 'Engineering' },
  { id: '3', label: 'Priya', description: 'Engineering' },
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
  @tracked messages = [];

  extensions = buildCarbonExtensions({ mention, command, starters });

  onChange = (value) => {
    this.content = value;
  };

  onReady = (api) => {
    this.api = api;
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
      <:autocompleteContent>
        <PromptLineAutocomplete @promptLine={{this.api}} @mention={{mention}} @command={{command}} @starters={{starters}} />
      </:autocompleteContent>
      <:editor>
        <PromptLine
          @content={{this.content}}
          @placeholder='Type @ to mention someone, / for a command, or focus while empty for starters...'
          @rich={{true}}
          @extensions={{this.extensions}}
          @onChange={{this.onChange}}
          @onReady={{this.onReady}}
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

Mention and command items always insert into the editor as a chip (a
`data-token-type="mention"`/`"command"` node — `disableDirectSend` is
forced `true` for these two regardless of config). Autocomplete and starter
items default to **sending directly**: clicking one fires `@onItemSend`
with its `value ?? label` and never touches the editor at all — the host
owns actually sending it (this component carries no chat-domain logic,
matching `PromptLineShell`). Set `disableDirectSend: true` on an
autocomplete/starters config to switch that trigger's items to the
"insert into the editor" path instead, firing `@onItemSelected` (and, for
starters specifically, `@onStarterSelected` with the editor's full text)
rather than `@onItemSend`.

## Groups and avatars

`SuggestionItem.groupId`/`groupTitle` render items under group headings
(ungrouped items first, groups in first-occurrence order); `avatar` takes a
plain image URL string or an icon component
(`ComponentLike<{ Args: { size?, svgClass?, fill? } }>` — the same
icon-as-value pattern `AiChatCardFooter`'s `CardFooterAction.icon` uses).

```gjs live preview
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { PromptLine, PromptLineAutocomplete } from 'carbon-components-ember/components';
import { UserAvatar, Tools } from 'carbon-components-ember/icons';
import { buildCarbonExtensions } from 'carbon-components-ember/components/ai-chat/-prompt-line/tiptap/build-extensions';
import { ThemeSupport } from 'docs-support';

const ITEMS = [
  { id: '1', label: 'Alice', avatar: UserAvatar, groupId: 'people', groupTitle: 'People' },
  { id: '2', label: 'Bob', avatar: UserAvatar, groupId: 'people', groupTitle: 'People' },
  { id: 't1', label: 'deploy-bot', avatar: Tools, groupId: 'tools', groupTitle: 'Tools' },
];
const mention = { trigger: '@', items: ITEMS };

class Demo extends Component {
  @tracked content = '';
  @tracked api;

  extensions = buildCarbonExtensions({ mention });

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
      @placeholder='Type @ ...'
      @rich={{true}}
      @extensions={{this.extensions}}
      @onChange={{this.onChange}}
      @onReady={{this.onReady}}
    />
    <PromptLineAutocomplete @promptLine={{this.api}} @mention={{mention}} />
  </template>
}

<template><Demo /></template>
```

## API Reference

<details>
<summary><h3>PromptLineAutocomplete</h3></summary>

```gjs live no-shadow
import { ComponentSignature } from 'kolay';

<template>
  <ComponentSignature
    @package="carbon-components-ember"
    @module='declarations/components/ai-chat/prompt-line-autocomplete'
    @name='default'
  />
</template>
```
</details>

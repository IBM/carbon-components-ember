import { tracked } from '@glimmer/tracking';
import { expect, fn as spy, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import Tooltip from '../tooltip.gts';
import AddLarge from '../icons/add-large.ts';
import Book from '../icons/book.ts';
import ChartLine from '../icons/chart-line.ts';
import Chat from '../icons/chat.ts';
import ChatOff from '../icons/chat-off.ts';
import Code from '../icons/code.ts';
import DataBase from '../icons/data-base.ts';
import Document from '../icons/document.ts';
import Edit from '../icons/edit.ts';
import Help from '../icons/help.ts';
import Idea from '../icons/idea.ts';
import Image from '../icons/image.ts';
import Language from '../icons/language.ts';
import MagicWand from '../icons/magic-wand.ts';
import Microphone from '../icons/microphone.ts';
import Person from '../icons/person.ts';
import Search from '../icons/search.ts';
import Send from '../icons/send.ts';
import FileUploadsList from './file-uploads.gts';
import PromptLine from './prompt-line.gts';
import PromptLineAutocomplete from './prompt-line-autocomplete.gts';
import PromptLineShell from './prompt-line-shell.gts';
import { FileStatusValue } from './-file-uploads/types.ts';
import { buildCarbonExtensions } from './-prompt-line/tiptap/build-extensions.ts';

import type { TOC } from '@ember/component/template-only';
import type { ComponentLike } from '@glint/template';
import type { userEvent as UserEventApi } from 'storybook/test';
import type { Editor, Extension } from '@tiptap/core';
import type { PromptLineSignature, PromptLineApi } from './prompt-line.gts';
import type {
  FileRemoveEventDetail,
  FileUpload,
} from './-file-uploads/types.ts';
import type {
  AutocompleteConfig,
  StartersConfig,
  SuggestionItem,
  TriggerSuggestionConfig,
} from './-prompt-line/tiptap/types.ts';

// Mirrors `@carbon/ai-chat-components`' `prompt-line.stories.js` (upstream
// title `Preview/Prompt line`), which composes the shell, the prompt line
// and a send control: `Default`, `Expanded`, `CommandsAndMentions`,
// `ConversationStarters`, `FileUploads` and `Typeahead`. The docs-app demos
// are kept as `Standalone`, `RichMode` and `AllTriggers`.
//
// Parity gaps (not faked here):
// - `cds-aichat-input-send-control` isn't ported, so the stories compose a
//   plain icon-only `Button` as the send control. Its `isStopStreamingButton
//   Visible`/`isStopStreamingButtonDisabled`/`stopResponseLabel` args have
//   no Ember equivalent; `disableSend`/`buttonLabel` are kept as story args.
// - `cds-aichat-error-message` isn't ported: `hasError` styles the shell and
//   `errorTitle`/`errorDescription` render as plain caller-supplied
//   `<:fieldMessaging>` content (`errorCollapsible`/`errorFullscreen` have
//   no equivalent).
// - The inline message actions are plain icon buttons: upstream's story-only
//   responsive overflow (`createOverflowHandler` + `cds-menu`) isn't
//   reproduced, so the non-expanded stories show the first three actions.
// - `PromptLineAutocomplete` has no `attached` arg (corner rounding), and
//   upstream's `renderCustomList` (used by its Conversation starters story
//   to add a header) is dropped; `@headerConfig` covers the header instead.
// - Upstream's `carbonTheme` arg isn't ported: the Storybook toolbar's theme
//   switcher applies Carbon's theme classes instead.

type StoryArgs = PromptLineSignature['Args'] & {
  /** Shell: rounded corners. */
  rounded?: boolean;
  /** Shell: full-width editor row with the inline actions beneath it. */
  expanded?: boolean;
  /** Shell: error state. */
  hasError?: boolean;
  /** Error title shown in `<:fieldMessaging>` (requires `hasError`). */
  errorTitle?: string;
  /** Optional longer description shown below the error title. */
  errorDescription?: string;
  /** Disables only the send button. */
  disableSend?: boolean;
  /** Tooltip/accessible label of the send button. */
  buttonLabel?: string;
  /** Autocomplete/starter items insert into the editor instead of sending directly. */
  disableDirectSend?: boolean;
  /** The host sent a message (send button, or Enter via `onSendIntent`). */
  onSend: (text: string) => void;
  /** An inline message action was clicked. */
  onAction: (text: string) => void;
  /** A suggestion was inserted into the editor (`PromptLineAutocomplete`'s `@onItemSelected`). */
  onItemSelected: (item: SuggestionItem) => void;
  /** A suggestion was sent directly (`PromptLineAutocomplete`'s `@onItemSend`). */
  onItemSend: (text: string) => void;
  /** A mention/command chip was removed by a user edit (the trigger config's `onRemove`). */
  onTokenRemove: (item: SuggestionItem) => void;
  /** A file chip was removed (`FileUploads`' `@onRemove`). */
  onFileRemove: (detail: FileRemoveEventDetail) => void;
};

type IconComponent = ComponentLike<{
  Args: { size?: number; svgClass?: string; fill?: string };
}>;

const MENTION_ITEMS: SuggestionItem[] = [
  {
    id: 'u1',
    label: 'Jane Smith',
    description: 'Design Lead',
    avatar: Person,
  },
  {
    id: 'u2',
    label: 'Bob Chen',
    description: 'Frontend Engineer',
    avatar: Book,
  },
  {
    id: 'u3',
    label: 'Alice Park',
    description: 'Product Manager',
    avatar: ChartLine,
  },
  {
    id: 'u4',
    label: 'Carlos Rivera',
    description: 'Backend Engineer',
    avatar: DataBase,
  },
  {
    id: 'u5',
    label: 'Dana Williams',
    description: 'QA Engineer',
    avatar: Help,
  },
];

const COMMAND_ITEMS: SuggestionItem[] = [
  {
    id: 'summarize',
    label: 'summarize',
    description: 'Summarize the conversation',
    avatar: Book,
  },
  {
    id: 'translate',
    label: 'translate',
    description: 'Translate to another language',
    avatar: Language,
  },
  {
    id: 'clear',
    label: 'clear',
    description: 'Clear the conversation',
    avatar: DataBase,
  },
  {
    id: 'help',
    label: 'help',
    description: 'Show available commands',
    avatar: Help,
  },
];

const STARTER_ITEMS: SuggestionItem[] = [
  { id: 'starter-1', label: 'Generate a chart for key metrics' },
  { id: 'starter-2', label: 'Convert my question into an SQL query' },
  { id: 'starter-3', label: 'Summarize recent High and Critical incidents' },
  { id: 'starter-4', label: 'Generate test data with similar schema' },
];

const TYPEAHEAD_ITEMS: SuggestionItem[] = [
  { id: 'ta-1', label: 'When is the best time to eat?' },
  { id: 'ta-2', label: 'When is the sun rising today?' },
  { id: 'ta-3', label: 'When is the sun setting today?' },
  { id: 'ta-4', label: 'When is the start of Spring?' },
  { id: 'ta-5', label: 'When is the next full moon?' },
  { id: 'ta-6', label: 'When is the next lunar eclipse?' },
  { id: 'ta-7', label: 'When is the next solar eclipse?' },
];

const ACTIONS: { text: string; icon: IconComponent }[] = [
  { text: 'Summarize conversation', icon: Document },
  { text: 'Translate last message', icon: Language },
  { text: 'Brainstorm ideas', icon: Idea },
  { text: 'Refine my writing', icon: Edit },
  { text: 'Suggest a follow-up', icon: MagicWand },
  { text: 'Explain this code', icon: Code },
  { text: 'Describe an image', icon: Image },
  { text: 'Search the web', icon: Search },
  { text: 'Dictate a message', icon: Microphone },
  { text: 'Start a new chat', icon: Chat },
];
const FEW_ACTIONS = ACTIONS.slice(0, 3);

function filterItems(items: SuggestionItem[], query: string) {
  if (!query) {
    return items;
  }
  const lower = query.toLowerCase();
  return items.filter((item) => item.label.toLowerCase().includes(lower));
}

/**
 * Story-local host state. `PromptLine` is always-controlled: the host keeps
 * the text, clears it on send and hands it back through `@content`.
 */
class Composer {
  @tracked content = '';
  @tracked api: PromptLineApi | undefined;
  @tracked sent: string[] = [];
  args: StoryArgs;

  constructor(args: StoryArgs) {
    this.args = args;
  }

  get canSend() {
    return (
      this.content.trim().length > 0 &&
      !this.args.disabled &&
      !this.args.disableSend
    );
  }

  get sendDisabled() {
    return !this.canSend;
  }

  get lastSent() {
    return this.sent[this.sent.length - 1] ?? 'none yet';
  }

  onChange = (value: string) => {
    this.content = value;
    this.args.onChange?.(value);
  };

  onReady = (api: PromptLineApi) => {
    this.api = api;
    this.args.onReady?.(api);
  };

  onSendIntent = () => {
    this.args.onSendIntent?.();
    this.send();
  };

  send = () => {
    if (!this.canSend) {
      return;
    }
    const text = this.content.trim();
    this.sent = [...this.sent, text];
    this.content = '';
    this.args.onSend(text);
  };
}

/** Host state for the Conversation starters story: a toggle that turns the starter list on/off. */
class StartersComposer extends Composer {
  @tracked startersOn = true;
  @tracked starters: StartersConfig;
  @tracked extensions: Extension[];

  constructor(args: StoryArgs) {
    super(args);
    this.starters = this.buildStarters();
    this.extensions = buildCarbonExtensions({ starters: this.starters });
  }

  buildStarters(): StartersConfig {
    return {
      items: STARTER_ITEMS,
      isOn: this.startersOn,
      disableDirectSend: this.args.disableDirectSend,
    };
  }

  get toggleLabel() {
    return this.startersOn
      ? 'Hide conversation starters'
      : 'Show conversation starters';
  }

  get toggleDisabled() {
    return Boolean(this.args.disabled) || this.content.length > 0;
  }

  // Extensions are compared by reference, so they're rebuilt (and memoized)
  // only when the toggle actually flips.
  toggleStarters = () => {
    this.startersOn = !this.startersOn;
    this.starters = this.buildStarters();
    this.extensions = buildCarbonExtensions({ starters: this.starters });
  };
}

/** Host state for the File uploads story. */
class UploadsComposer extends Composer {
  @tracked uploads: FileUpload[] = [];
  private nextId = 0;

  get hasUploads() {
    return this.uploads.length > 0;
  }

  override get canSend() {
    const hasUploads =
      this.uploads.length > 0 && !this.uploads.every((u) => u.isError);
    return (
      (this.content.trim().length > 0 || hasUploads) &&
      !this.args.disabled &&
      !this.args.disableSend
    );
  }

  attach = (event: MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    button
      .closest('.prompt-line-story__attach')
      ?.querySelector<HTMLInputElement>('input[type="file"]')
      ?.click();
  };

  filesSelected = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    // Reset early so re-selecting the same file fires `change` again.
    input.value = '';
    this.uploads = [
      ...this.uploads,
      ...files.map((file) => ({
        id: `file-${this.nextId++}`,
        file,
        status: FileStatusValue.EDIT,
      })),
    ];
  };

  removeFile = (detail: FileRemoveEventDetail) => {
    this.uploads = this.uploads.filter((u) => u.id !== detail.fileId);
    this.args.onFileRemove(detail);
  };
}

function mentionConfig(args: StoryArgs): TriggerSuggestionConfig {
  return {
    trigger: '@',
    items: (query: string) => filterItems(MENTION_ITEMS, query),
    onRemove: args.onTokenRemove,
  };
}

function commandConfig(args: StoryArgs): TriggerSuggestionConfig {
  return {
    trigger: '/',
    triggerPosition: 'start',
    items: COMMAND_ITEMS,
    onRemove: args.onTokenRemove,
  };
}

const SendControl: TOC<{
  Args: { label?: string; disabled: boolean; onSend: () => void };
}> = <template>
  <Tooltip @label={{@label}} @autoAlign={{true}}>
    <Button
      @type={{undefined}}
      @ghost={{true}}
      @size="sm"
      @iconOnly={{true}}
      @disabled={{@disabled}}
      @onClick={{@onSend}}
      aria-label={{@label}}
    >
      <Send @size="16" />
    </Button>
  </Tooltip>
</template>;

const InlineActions: TOC<{
  Args: {
    actions: { text: string; icon: IconComponent }[];
    disabled?: boolean;
    onAction: (text: string) => void;
  };
}> = <template>
  <div class="prompt-line-story__actions" style="display: flex;">
    {{#each @actions as |action|}}
      <Tooltip @label={{action.text}} @autoAlign={{true}}>
        <Button
          @type={{undefined}}
          @ghost={{true}}
          @size="sm"
          @iconOnly={{true}}
          @disabled={{@disabled}}
          @onClick={{fn @onAction action.text}}
          aria-label={{action.text}}
        >
          <action.icon @size={{16}} />
        </Button>
      </Tooltip>
    {{/each}}
  </div>
</template>;

const ErrorMessage: TOC<{
  Args: { title?: string; description?: string };
}> = <template>
  {{#if @title}}
    <div role="alert" style="padding: 0.5rem 1rem;">
      <p style="color: var(--cds-text-error, #da1e28);">{{@title}}</p>
      {{#if @description}}
        <p>{{@description}}</p>
      {{/if}}
    </div>
  {{/if}}
</template>;

const SentMessages: TOC<{ Args: { messages: string[] } }> = <template>
  <ul aria-label="Sent messages" style="margin-block-end: 1rem;">
    {{#each @messages as |message|}}
      <li>{{message}}</li>
    {{/each}}
  </ul>
</template>;

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Prompt line',
  component: PromptLine,
  parameters: {
    docs: {
      description: {
        component: `\`PromptLine\` is the editing surface of the chat input stack, typically composed inside a \`PromptLineShell\`'s \`<:editor>\` block. It renders a plain \`<textarea>\` by default and never statically imports \`@tiptap/*\` — setting \`@rich\` (or calling \`ensureEditor()\` off the handle \`@onReady\` provides) dynamically loads a small Tiptap runtime chunk and upgrades the surface in place, carrying the text, caret, and focus over losslessly. Both modes share the same \`@content\`/\`@onChange\`/\`@onSendIntent\` contract.

\`@content\` is always-controlled: typing only fires \`@onChange\`, so the host keeps the text and hands it back. Press Enter to send (Shift+Enter inserts a newline instead).

\`@extensions\` accepts plain Tiptap \`Extension\`s appended to the base Carbon bundle (schema, undo/redo, placeholder, plain-text paste, the Enter/Mod-Enter/Escape keymap) — memoize the array you pass, since a fresh one every render rebuilds the live editor (content, selection, and focus survive; undo history doesn't).

### Mention, command, autocomplete, and starter triggers

\`buildCarbonExtensions\` (and the individual \`carbonMention\`/\`carbonCommand\`/\`carbonAutocomplete\`/\`carbonStarterTrigger\` factories it wraps, all under \`carbon-components-ember/components/ai-chat/-prompt-line/tiptap/\`) build Tiptap extensions you pass through \`@extensions\` like any other — \`PromptLine\` itself has no dedicated mention/command/autocomplete/starter args, matching upstream's own \`<cds-aichat-prompt-line>\`. The extensions only dispatch a bubbling \`cds-aichat-trigger-change\` DOM event with \`{ type, query, triggerOffset }\`; **the actual popup is \`PromptLineAutocomplete\`** — pair it with a \`PromptLine\` via the imperative handle from \`@onReady\`.

A command chip (\`/summarize\`) is prefixed with its trigger character by default; a mention chip (\`Jane Smith\`) isn't — either default can be overridden per-config or per-item via \`showTriggerInChip\`.

Mention, command, autocomplete, and starter extensions each react to the *same* document changes and dispatch \`cds-aichat-trigger-change\` independently — combined on one editor, typing \`@\` after focusing an empty field can dispatch the starter list's own exit event (\`null\`) *after* the mention trigger's own opening event. A naive "last event wins" listener can momentarily see a stale \`null\` and hide its popup even though a trigger is genuinely open. \`PromptLineAutocomplete\` reconciles this (batches same-tick events by microtask, resolves to the last non-null one) — see the **All triggers** story.`,
      },
    },
  },
  argTypes: {
    rounded: { table: { category: 'Shell' } },
    expanded: { table: { category: 'Shell' } },
    hasError: { table: { category: 'Shell' } },
    errorTitle: { control: 'text', table: { category: 'Shell' } },
    errorDescription: { control: 'text', table: { category: 'Shell' } },
    disableSend: { table: { category: 'Send control' } },
    buttonLabel: { control: 'text', table: { category: 'Send control' } },
    disableDirectSend: { table: { category: 'Autocomplete' } },
  },
  args: {
    placeholder: 'Type something...',
    disabled: false,
    rounded: true,
    expanded: false,
    hasError: false,
    errorTitle: 'Something went wrong.',
    errorDescription: '',
    disableSend: false,
    buttonLabel: 'Send',
    disableDirectSend: false,
    onChange: spy(),
    onSendIntent: spy(),
    onSend: spy(),
    onAction: spy(),
    onItemSelected: spy(),
    onItemSend: spy(),
    onTokenRemove: spy(),
    onFileRemove: spy(),
  },
});

type UserEvent = ReturnType<typeof UserEventApi.setup>;

/**
 * `PromptLineAutocomplete` re-creates its option elements whenever the
 * active option changes (a keyless `{{#each}}` over freshly-built entries),
 * including on `mouseenter`. A real pointer then clicks the new element
 * under it, but user-event keeps dispatching to the element it was given —
 * now detached. Clicking without the hover step sidesteps that.
 */
function clickOption(userEvent: UserEvent, option: HTMLElement) {
  return userEvent.setup({ skipHover: true }).click(option);
}

async function findRichEditor(canvasElement: HTMLElement) {
  return waitFor(
    () => {
      const editor = canvasElement.querySelector<HTMLElement>(
        '[role="textbox"][contenteditable="true"]',
      );
      if (!editor) {
        throw new Error('The rich (Tiptap) editor has not mounted yet');
      }
      return editor;
    },
    { timeout: 10_000 },
  );
}

function tiptapEditor(element: HTMLElement): Editor {
  const editor = (element as HTMLElement & { editor?: Editor }).editor;
  if (!editor) {
    throw new Error('No Tiptap editor on this element');
  }
  return editor;
}

// Default: simple textarea in the shell, inline actions only when expanded.
export const Default = meta.story({
  render: (args) => {
    const state = new Composer(args);

    return <template>
      <SentMessages @messages={{state.sent}} />
      <PromptLineShell
        @rounded={{args.rounded}}
        @disabled={{args.disabled}}
        @hasError={{args.hasError}}
        @expanded={{args.expanded}}
      >
        <:fieldMessaging>
          {{#if args.hasError}}
            <ErrorMessage
              @title={{args.errorTitle}}
              @description={{args.errorDescription}}
            />
          {{/if}}
        </:fieldMessaging>
        <:editor>
          <PromptLine
            @content={{state.content}}
            @placeholder={{args.placeholder}}
            @disabled={{args.disabled}}
            @onChange={{state.onChange}}
            @onSendIntent={{state.onSendIntent}}
            @onReady={{state.onReady}}
          />
        </:editor>
        <:messageActions>
          {{#if args.expanded}}
            <InlineActions
              @actions={{ACTIONS}}
              @disabled={{args.disabled}}
              @onAction={{args.onAction}}
            />
          {{/if}}
        </:messageActions>
        <:sendControl>
          <SendControl
            @label={{args.buttonLabel}}
            @disabled={{state.sendDisabled}}
            @onSend={{state.send}}
          />
        </:sendControl>
      </PromptLineShell>
    </template>;
  },
});

Default.test(
  'sends the typed text with the send button',
  async ({ canvas, userEvent, args }) => {
    const textbox = canvas.getByRole('textbox', { name: 'Message' });
    const send = canvas.getByRole('button', { name: 'Send' });
    await expect(send).toBeDisabled();

    await userEvent.type(textbox, 'Hello there');
    await expect(args.onChange).toHaveBeenLastCalledWith('Hello there');
    await expect(send).toBeEnabled();

    await userEvent.click(send);
    await expect(args.onSend).toHaveBeenCalledWith('Hello there');
    await expect(textbox).toHaveValue('');
    await expect(
      canvas.getByRole('list', { name: 'Sent messages' }),
    ).toHaveTextContent('Hello there');
  },
);

Default.test(
  'Enter sends, Shift+Enter inserts a newline',
  async ({ canvas, userEvent, args }) => {
    const textbox = canvas.getByRole('textbox', { name: 'Message' });

    await userEvent.type(textbox, 'line one{Shift>}{Enter}{/Shift}line two');
    await expect(args.onSendIntent).not.toHaveBeenCalled();
    await expect(textbox).toHaveValue('line one\nline two');

    await userEvent.keyboard('{Enter}');
    await expect(args.onSendIntent).toHaveBeenCalledTimes(1);
    await expect(args.onSend).toHaveBeenCalledWith('line one\nline two');
    await expect(textbox).toHaveValue('');
  },
);

export const Expanded = Default.extend({
  args: {
    expanded: true,
  },
});

Expanded.test(
  'renders the inline actions beneath the editor',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Brainstorm ideas' }),
    );
    await expect(args.onAction).toHaveBeenCalledWith('Brainstorm ideas');
  },
);

export const CommandsAndMentions = meta.story({
  name: 'Commands and mentions',
  render: (args) => {
    const state = new Composer(args);
    const mention = mentionConfig(args);
    const command = commandConfig(args);
    const extensions = buildCarbonExtensions({ mention, command });

    return <template>
      <p style="margin-block-end: 1rem;">
        Type
        <code>@</code>
        anywhere to mention a team member. Type
        <code>/</code>
        at the start of the line to run a command.
      </p>
      <SentMessages @messages={{state.sent}} />
      <PromptLineShell
        @rounded={{args.rounded}}
        @disabled={{args.disabled}}
        @hasError={{args.hasError}}
        @expanded={{true}}
      >
        <:fieldMessaging>
          {{#if args.hasError}}
            <ErrorMessage
              @title={{args.errorTitle}}
              @description={{args.errorDescription}}
            />
          {{/if}}
        </:fieldMessaging>
        <:autocompleteContent>
          <PromptLineAutocomplete
            @promptLine={{state.api}}
            @mention={{mention}}
            @command={{command}}
            @onItemSelected={{args.onItemSelected}}
          />
        </:autocompleteContent>
        <:editor>
          <PromptLine
            @content={{state.content}}
            @placeholder={{args.placeholder}}
            @disabled={{args.disabled}}
            @rich={{true}}
            @extensions={{extensions}}
            @onChange={{state.onChange}}
            @onSendIntent={{state.onSendIntent}}
            @onReady={{state.onReady}}
          />
        </:editor>
        <:messageActions>
          <InlineActions
            @actions={{ACTIONS}}
            @disabled={{args.disabled}}
            @onAction={{args.onAction}}
          />
        </:messageActions>
        <:sendControl>
          <SendControl
            @label={{args.buttonLabel}}
            @disabled={{state.sendDisabled}}
            @onSend={{state.send}}
          />
        </:sendControl>
      </PromptLineShell>
    </template>;
  },
});

CommandsAndMentions.test(
  'typing @ opens the mention list and picking one inserts a chip',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const editor = await findRichEditor(canvasElement);
    await userEvent.click(editor);
    await userEvent.keyboard('@ali');

    const option = await canvas.findByRole('option', { name: /Alice Park/ });
    await expect(canvas.queryByRole('option', { name: /Jane Smith/ })).toBe(
      null,
    );
    await clickOption(userEvent, option);

    await expect(args.onItemSelected).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'u3', label: 'Alice Park' }),
    );
    await waitFor(() =>
      expect(
        editor.querySelector('[data-token-type="mention"]'),
      ).toHaveTextContent('Alice Park'),
    );
    await expect(canvas.queryByRole('listbox')).toBe(null);
  },
);

CommandsAndMentions.test(
  'a command picked with the keyboard renders with its trigger',
  async ({ canvas, canvasElement, userEvent }) => {
    const editor = await findRichEditor(canvasElement);
    await userEvent.click(editor);
    await userEvent.keyboard('/tr');

    await canvas.findByRole('option', { name: /translate/ });
    await userEvent.keyboard('{Enter}');

    await waitFor(() =>
      expect(
        editor.querySelector('[data-token-type="command"]'),
      ).toHaveTextContent('/translate'),
    );
  },
);

export const ConversationStarters = meta.story({
  name: 'Conversation starters',
  render: (args) => {
    const state = new StartersComposer(args);
    const header = { showHeader: true, title: 'Prompt suggestions' };

    return <template>
      <SentMessages @messages={{state.sent}} />
      <PromptLineShell
        @rounded={{args.rounded}}
        @disabled={{args.disabled}}
        @hasError={{args.hasError}}
        @expanded={{true}}
      >
        <:fieldMessaging>
          {{#if args.hasError}}
            <ErrorMessage
              @title={{args.errorTitle}}
              @description={{args.errorDescription}}
            />
          {{/if}}
        </:fieldMessaging>
        <:autocompleteContent>
          <PromptLineAutocomplete
            @promptLine={{state.api}}
            @starters={{state.starters}}
            @headerConfig={{header}}
            @onItemSelected={{args.onItemSelected}}
            @onItemSend={{args.onItemSend}}
          />
        </:autocompleteContent>
        <:editor>
          <PromptLine
            @content={{state.content}}
            @placeholder={{args.placeholder}}
            @disabled={{args.disabled}}
            @rich={{true}}
            @extensions={{state.extensions}}
            @onChange={{state.onChange}}
            @onSendIntent={{state.onSendIntent}}
            @onReady={{state.onReady}}
          />
        </:editor>
        <:messageActions>
          <Tooltip @label={{state.toggleLabel}} @autoAlign={{true}}>
            <Button
              @type={{undefined}}
              @ghost={{true}}
              @size="sm"
              @iconOnly={{true}}
              @disabled={{state.toggleDisabled}}
              @onClick={{state.toggleStarters}}
              aria-label={{state.toggleLabel}}
            >
              {{#if state.startersOn}}
                <ChatOff @size="16" />
              {{else}}
                <Chat @size="16" />
              {{/if}}
            </Button>
          </Tooltip>
        </:messageActions>
        <:sendControl>
          <SendControl
            @label={{args.buttonLabel}}
            @disabled={{state.sendDisabled}}
            @onSend={{state.send}}
          />
        </:sendControl>
      </PromptLineShell>
    </template>;
  },
});

ConversationStarters.test(
  'focusing the empty field shows starters; clicking one sends it',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const editor = await findRichEditor(canvasElement);
    await userEvent.click(editor);

    await expect(await canvas.findByText('Prompt suggestions')).toBeVisible();
    await clickOption(
      userEvent,
      await canvas.findByRole('option', {
        name: /Convert my question into an SQL query/,
      }),
    );
    await expect(args.onItemSend).toHaveBeenCalledWith(
      'Convert my question into an SQL query',
    );
  },
);

ConversationStarters.test(
  'the toggle turns the starter list off',
  async ({ canvas, canvasElement, userEvent }) => {
    await findRichEditor(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Hide conversation starters' }),
    );
    // The toggle rebuilds the editor's extensions; wait for the new one.
    const editor = await findRichEditor(canvasElement);
    await userEvent.click(editor);
    await expect(
      canvas.getByRole('button', { name: 'Show conversation starters' }),
    ).toBeInTheDocument();
    // Give a (wrongly) still-enabled starter trigger a chance to open.
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await expect(canvas.queryByRole('listbox')).toBe(null);
  },
);

export const FileUploads = meta.story({
  name: 'File uploads',
  render: (args) => {
    const state = new UploadsComposer(args);

    return <template>
      <SentMessages @messages={{state.sent}} />
      <PromptLineShell
        @rounded={{args.rounded}}
        @disabled={{args.disabled}}
        @hasError={{args.hasError}}
        @expanded={{true}}
        @hasFileUploads={{state.hasUploads}}
      >
        <:fieldMessaging>
          {{#if args.hasError}}
            <ErrorMessage
              @title={{args.errorTitle}}
              @description={{args.errorDescription}}
            />
          {{/if}}
        </:fieldMessaging>
        <:fileUploads>
          {{! Always mounted so its live regions persist after the last file is removed. }}
          <FileUploadsList
            @uploads={{state.uploads}}
            @onRemove={{state.removeFile}}
          />
        </:fileUploads>
        <:editor>
          <PromptLine
            @content={{state.content}}
            @placeholder={{args.placeholder}}
            @disabled={{args.disabled}}
            @onChange={{state.onChange}}
            @onSendIntent={{state.onSendIntent}}
            @onReady={{state.onReady}}
          />
        </:editor>
        <:messageActions>
          <div class="prompt-line-story__attach">
            <input
              type="file"
              multiple
              tabindex="-1"
              hidden
              aria-label="Attach file"
              {{on "change" state.filesSelected}}
            />
            <Tooltip @label="Attach file" @autoAlign={{true}}>
              <Button
                @type={{undefined}}
                @ghost={{true}}
                @size="sm"
                @iconOnly={{true}}
                @disabled={{args.disabled}}
                aria-label="Attach file"
                {{on "click" state.attach}}
              >
                <AddLarge @size="16" />
              </Button>
            </Tooltip>
          </div>
        </:messageActions>
        <:sendControl>
          <SendControl
            @label={{args.buttonLabel}}
            @disabled={{state.sendDisabled}}
            @onSend={{state.send}}
          />
        </:sendControl>
      </PromptLineShell>
    </template>;
  },
});

FileUploads.test(
  'attached files show as chips and can be removed',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const input =
      canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;
    await userEvent.upload(
      input,
      new File(['quarterly numbers'], 'report.txt', { type: 'text/plain' }),
    );

    await expect(await canvas.findByText('report.txt')).toBeVisible();
    // A file alone is valid input.
    await expect(canvas.getByRole('button', { name: 'Send' })).toBeEnabled();

    await userEvent.click(canvas.getByRole('button', { name: /Remove file/ }));
    await expect(args.onFileRemove).toHaveBeenCalledWith({
      fileId: 'file-0',
    });
    await waitFor(() =>
      expect(canvas.queryByText('report.txt')).not.toBeInTheDocument(),
    );
  },
);

export const Typeahead = meta.story({
  render: (args) => {
    const state = new Composer(args);
    const autocomplete: AutocompleteConfig = {
      items: (query: string) => filterItems(TYPEAHEAD_ITEMS, query),
      disableDirectSend: args.disableDirectSend,
    };
    const extensions = buildCarbonExtensions({ autocomplete });

    return <template>
      <SentMessages @messages={{state.sent}} />
      <PromptLineShell
        @rounded={{args.rounded}}
        @disabled={{args.disabled}}
        @hasError={{args.hasError}}
        @expanded={{true}}
      >
        <:fieldMessaging>
          {{#if args.hasError}}
            <ErrorMessage
              @title={{args.errorTitle}}
              @description={{args.errorDescription}}
            />
          {{/if}}
        </:fieldMessaging>
        <:autocompleteContent>
          <PromptLineAutocomplete
            @promptLine={{state.api}}
            @autocomplete={{autocomplete}}
            @onItemSelected={{args.onItemSelected}}
            @onItemSend={{args.onItemSend}}
          />
        </:autocompleteContent>
        <:editor>
          <PromptLine
            @content={{state.content}}
            @placeholder={{args.placeholder}}
            @disabled={{args.disabled}}
            @rich={{true}}
            @extensions={{extensions}}
            @onChange={{state.onChange}}
            @onSendIntent={{state.onSendIntent}}
            @onReady={{state.onReady}}
          />
        </:editor>
        <:messageActions>
          <InlineActions
            @actions={{FEW_ACTIONS}}
            @disabled={{args.disabled}}
            @onAction={{args.onAction}}
          />
        </:messageActions>
        <:sendControl>
          <SendControl
            @label={{args.buttonLabel}}
            @disabled={{state.sendDisabled}}
            @onSend={{state.send}}
          />
        </:sendControl>
      </PromptLineShell>
    </template>;
  },
});

Typeahead.test(
  'suggestions filter as you type and clicking one sends it directly',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const editor = await findRichEditor(canvasElement);
    await userEvent.click(editor);
    await userEvent.keyboard('eclipse');

    await waitFor(() => expect(canvas.getAllByRole('option')).toHaveLength(2));
    await clickOption(
      userEvent,
      canvas.getByRole('option', { name: /next solar eclipse/ }),
    );
    await expect(args.onItemSend).toHaveBeenCalledWith(
      'When is the next solar eclipse?',
    );
    await expect(args.onItemSelected).not.toHaveBeenCalled();
  },
);

export const TypeaheadInsert = Typeahead.extend({
  name: 'Typeahead (insert into editor)',
  args: {
    disableDirectSend: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `disableDirectSend: true` on the autocomplete config, picking a suggestion inserts it into the editor (`@onItemSelected`) instead of sending it (`@onItemSend`).',
      },
    },
  },
});

TypeaheadInsert.test(
  'picking a suggestion inserts it into the editor',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const editor = await findRichEditor(canvasElement);
    await userEvent.click(editor);
    await userEvent.keyboard('spring');

    await clickOption(
      userEvent,
      await canvas.findByRole('option', { name: /start of Spring/ }),
    );
    await expect(args.onItemSelected).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'ta-4' }),
    );
    await expect(args.onItemSend).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(tiptapEditor(editor).getText()).toContain(
        'When is the start of Spring?',
      ),
    );
  },
);

// docs-app's first demo: a bare PromptLine (no shell).
export const Standalone = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'A bare `PromptLine`, outside any shell. Press Enter to send (Shift+Enter inserts a newline instead).',
      },
    },
  },
  render: (args) => {
    const state = new Composer(args);

    return <template>
      <p style="margin-block-end: 1rem;">Last sent: {{state.lastSent}}</p>
      <PromptLine
        @content={{state.content}}
        @placeholder={{args.placeholder}}
        @disabled={{args.disabled}}
        @onChange={{state.onChange}}
        @onSendIntent={{state.onSendIntent}}
      />
    </template>;
  },
});

Standalone.test(
  'Enter reports a send intent',
  async ({ canvas, userEvent, args }) => {
    const textbox = canvas.getByRole('textbox', { name: 'Message' });
    await userEvent.type(textbox, 'Ping{Enter}');

    await expect(args.onSendIntent).toHaveBeenCalledTimes(1);
    await expect(canvas.getByText('Last sent: Ping')).toBeVisible();
    await expect(textbox).toHaveValue('');
  },
);

/** Host state for the Rich mode story. */
class RichComposer extends Composer {
  @tracked rich = false;

  enableRich = () => {
    this.rich = true;
  };

  undo = () => {
    this.api?.undo();
  };
}

// docs-app's "Rich (Tiptap) editing mode" demo.
export const RichMode = meta.story({
  name: 'Rich mode',
  parameters: {
    docs: {
      description: {
        story:
          'Setting `@rich={{true}}` upgrades the textarea to a Tiptap-backed contenteditable surface — useful when a host wants to compose its own `@extensions` (e.g. formatting marks) on top of the same Enter-to-send keymap. The upgrade is sticky and lossless (text, caret and focus carry over). `@onReady` hands back an imperative API (`getEditor`, `ensureEditor`, `undo`/`redo`, `insertContent`, …) that works the same in either mode.',
      },
    },
  },
  render: (args) => {
    const state = new RichComposer(args);

    return <template>
      <div style="display: flex; gap: 1rem; margin-block-end: 1rem;">
        <Button
          @type="secondary"
          @size="sm"
          @disabled={{state.rich}}
          @onClick={{state.enableRich}}
        >
          Switch to rich editing
        </Button>
        <Button @type="secondary" @size="sm" @onClick={{state.undo}}>
          Undo
        </Button>
      </div>
      <PromptLine
        @content={{state.content}}
        @placeholder={{args.placeholder}}
        @disabled={{args.disabled}}
        @rich={{state.rich}}
        @onChange={{state.onChange}}
        @onSendIntent={{state.onSendIntent}}
        @onReady={{state.onReady}}
      />
    </template>;
  },
});

RichMode.test(
  'upgrades to the rich editor in place and undo works through the API',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Message' });
    await userEvent.type(textarea, 'kept');

    await userEvent.click(
      canvas.getByRole('button', { name: 'Switch to rich editing' }),
    );
    const editor = await findRichEditor(canvasElement);
    await expect(textarea).not.toBeInTheDocument();
    // The text typed into the textarea carried over.
    await expect(editor).toHaveTextContent('kept');

    await userEvent.click(editor);
    await userEvent.keyboard(' more');
    await waitFor(() =>
      expect(args.onChange).toHaveBeenLastCalledWith('kept more'),
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Undo' }));
    await waitFor(() => expect(editor).toHaveTextContent(/^kept$/));
  },
);

// docs-app's "Mention, command, autocomplete, and starter triggers" demo:
// all three trigger types on one editor.
export const AllTriggers = meta.story({
  name: 'All triggers',
  parameters: {
    docs: {
      description: {
        story:
          'Mention, command and starter extensions on one editor. Focus the field while empty to see the starter prompts, then start typing `@`/`/` to switch to mention/command — the live proof that `PromptLineAutocomplete` reconciles the extensions\u2019 concurrent trigger events.',
      },
    },
  },
  render: (args) => {
    const state = new Composer(args);
    const mention = mentionConfig(args);
    const command = commandConfig(args);
    const starters: StartersConfig = { items: STARTER_ITEMS };
    const extensions = buildCarbonExtensions({ mention, command, starters });

    return <template>
      <div>
        <PromptLine
          @content={{state.content}}
          @placeholder="Type @ to mention someone, / for a command, or focus while empty for starters..."
          @disabled={{args.disabled}}
          @rich={{true}}
          @extensions={{extensions}}
          @onChange={{state.onChange}}
          @onSendIntent={{state.onSendIntent}}
          @onReady={{state.onReady}}
        />
        <PromptLineAutocomplete
          @promptLine={{state.api}}
          @mention={{mention}}
          @command={{command}}
          @starters={{starters}}
          @onItemSelected={{args.onItemSelected}}
          @onItemSend={{args.onItemSend}}
        />
      </div>
    </template>;
  },
});

AllTriggers.test(
  'starters on focus switch to the mention list after typing @',
  async ({ canvas, canvasElement, userEvent }) => {
    const editor = await findRichEditor(canvasElement);
    await userEvent.click(editor);
    await canvas.findByRole('option', {
      name: /Generate a chart for key metrics/,
    });

    await userEvent.keyboard('@');
    await canvas.findByRole('option', { name: /Jane Smith/ });
    await expect(
      canvas.queryByRole('option', { name: /Generate a chart/ }),
    ).toBe(null);
  },
);

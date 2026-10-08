import { tracked } from '@glimmer/tracking';
import { expect, fn, waitFor, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import Tooltip from '../tooltip.gts';
import Book from '../icons/book.ts';
import ChartLine from '../icons/chart-line.ts';
import DataBase from '../icons/data-base.ts';
import Help from '../icons/help.ts';
import Send from '../icons/send.ts';
import Tools from '../icons/tools.ts';
import UserAvatar from '../icons/user-avatar.ts';
import PromptLine from './prompt-line.gts';
import PromptLineAutocomplete from './prompt-line-autocomplete.gts';
import PromptLineShell from './prompt-line-shell.gts';
import { buildCarbonExtensions } from './-prompt-line/tiptap/build-extensions.ts';

import type { userEvent as UserEventApi } from 'storybook/test';
import type { PromptLineApi } from './prompt-line.gts';
import type { PromptLineAutocompleteSignature } from './prompt-line-autocomplete.gts';
import type {
  AutocompleteConfig,
  StartersConfig,
  SuggestionItem,
  TriggerSuggestionConfig,
} from './-prompt-line/tiptap/types.ts';

// Mirrors `@carbon/ai-chat-components`' `autocomplete.stories.js` (upstream
// title `Preview/Prompt line/Autocomplete`): `Default`, `WithHeader`,
// `WithCategories` and `WithDisabledItems`. The docs-app demos are kept as
// `InShell` and `GroupsAndAvatars`.
//
// Parity gaps (not faked here):
// - Upstream's stories render the bare `<cds-aichat-autocomplete>` list with
//   `items`/`groups`/`inputText` props. This port merges upstream's list and
//   its controller into one component that is driven by the paired
//   `PromptLine`'s trigger events, so it has no `items`/`groups`/`inputText`
//   args: each story pairs it with a rich `PromptLine` and a live-typeahead
//   (`autocomplete`) config, and the text you type replaces `inputText`
//   (upstream's typed/remainder label highlight is dead code there and is
//   dropped here). Groups come from each item's `groupId`/`groupTitle`.
// - No `attached` arg (bottom-corner rounding), so upstream's `Detached`
//   story has no equivalent.
// - Upstream's `carbonTheme` arg isn't ported: the Storybook toolbar's theme
//   switcher applies Carbon's theme classes instead.

type StoryArgs = PromptLineAutocompleteSignature['Args'] & {
  /** Story-only: the live-typeahead suggestions (filtered by the word being typed). */
  suggestions: SuggestionItem[];
  /** Story-only: clicking an item inserts it into the editor (`@onItemSelected`) instead of sending it (`@onItemSend`). */
  disableDirectSend?: boolean;
  /** Story-only: hint shown above the composer. */
  hint?: string;
};

type UserEvent = ReturnType<typeof UserEventApi.setup>;

const FLAT_SUGGESTIONS: SuggestionItem[] = [
  { id: 'suggestion-1', label: 'When is the best time to eat?' },
  { id: 'suggestion-2', label: 'When is the sun rising today?' },
  { id: 'suggestion-3', label: 'When is the sun setting today?' },
  { id: 'suggestion-4', label: 'When is the start of Spring?' },
  { id: 'suggestion-5', label: 'When is the next full moon?' },
  { id: 'suggestion-6', label: 'When is the next lunar eclipse?' },
];

const GROUPED_SUGGESTIONS: SuggestionItem[] = [
  {
    id: 'suggestion-1',
    label: 'Summarize',
    description: 'Describe selected data',
    avatar: Book,
    groupId: 'group-1',
    groupTitle: 'Domain A',
  },
  {
    id: 'suggestion-2',
    label: 'Visualization',
    description: 'Generate quick chart',
    avatar: ChartLine,
    groupId: 'group-1',
    groupTitle: 'Domain A',
  },
  {
    id: 'suggestion-3',
    label: 'Train',
    description: 'Use dataset to train model',
    avatar: DataBase,
    groupId: 'group-2',
    groupTitle: 'Domain B',
  },
  {
    id: 'suggestion-4',
    label: 'Summarize',
    description: 'Describe selected data',
    avatar: Book,
    groupId: 'group-2',
    groupTitle: 'Domain B',
  },
  {
    id: 'suggestion-5',
    label: 'Validate',
    description: 'Check quality of data',
    avatar: DataBase,
    groupId: 'group-3',
    groupTitle: 'Domain C',
  },
  {
    id: 'suggestion-6',
    label: 'Document',
    description: 'Show available commands',
    avatar: Help,
    groupId: 'group-3',
    groupTitle: 'Domain C',
  },
];

const MIXED_SUGGESTIONS: SuggestionItem[] = [
  { id: 'suggestion-1', label: 'When is the best time to eat?' },
  {
    id: 'suggestion-2',
    label: 'When is the sun rising today?',
    disabled: true,
  },
  { id: 'suggestion-3', label: 'When is the sun setting today?' },
  {
    id: 'suggestion-4',
    label: 'When is the start of Spring?',
    disabled: true,
  },
  { id: 'suggestion-5', label: 'When is the next full moon?' },
];

class Host {
  @tracked content = '';
  @tracked api: PromptLineApi | undefined;
  @tracked messages: string[] = [];

  onChange = (value: string) => {
    this.content = value;
  };

  onReady = (api: PromptLineApi) => {
    this.api = api;
  };

  send = () => {
    const text = this.content.trim();
    if (!text) {
      return;
    }
    this.messages = [...this.messages, text];
    this.content = '';
  };

  get sendDisabled() {
    return this.content.trim().length === 0;
  }
}

/**
 * The component re-creates its option elements whenever the active option
 * changes (a keyless `{{#each}}` over freshly-built entries), including on
 * `mouseenter`. A real pointer then clicks the new element under it, but
 * user-event keeps dispatching to the element it was given — now detached.
 * Clicking without the hover step sidesteps that.
 */
function clickOption(userEvent: UserEvent, option: HTMLElement) {
  return userEvent.setup({ skipHover: true }).click(option);
}

async function focusRichEditor(canvasElement: HTMLElement, user: UserEvent) {
  // The rich (Tiptap) editor is loaded lazily, after a dynamic import.
  const editor = await waitFor(
    () => {
      const element = canvasElement.querySelector<HTMLElement>(
        '[role="textbox"][contenteditable="true"]',
      );
      if (!element) {
        throw new Error('The rich (Tiptap) editor has not mounted yet');
      }
      return element;
    },
    { timeout: 10_000 },
  );
  await user.click(editor);
  return editor;
}

function activeOption(canvasElement: HTMLElement) {
  return within(canvasElement).getByRole('option', { selected: true });
}

// Upstream's stories all render the same list with different data.
function renderTypeahead(args: StoryArgs) {
  const host = new Host();
  const autocomplete: AutocompleteConfig = {
    items: args.suggestions,
    disableDirectSend: args.disableDirectSend,
  };
  const extensions = buildCarbonExtensions({ autocomplete });

  return <template>
    <p style="margin-block-end: 1rem;">{{args.hint}}</p>
    <div style="width: 320px;">
      <PromptLineShell @rounded={{true}}>
        <:autocompleteContent>
          <PromptLineAutocomplete
            @promptLine={{host.api}}
            @autocomplete={{autocomplete}}
            @headerConfig={{args.headerConfig}}
            @isSendDisabled={{args.isSendDisabled}}
            @onItemSelected={{args.onItemSelected}}
            @onItemSend={{args.onItemSend}}
          />
        </:autocompleteContent>
        <:editor>
          <PromptLine
            @content={{host.content}}
            @placeholder="Type something..."
            @rich={{true}}
            @extensions={{extensions}}
            @onChange={{host.onChange}}
            @onReady={{host.onReady}}
          />
        </:editor>
      </PromptLineShell>
    </div>
  </template>;
}

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Prompt line/Autocomplete',
  component: PromptLineAutocomplete,
  parameters: {
    docs: {
      description: {
        component: `The suggestion overlay for \`PromptLine\`'s mention (\`@\`), command (\`/\`), autocomplete, and starter-prompt Tiptap extensions (see **AI Chat/Prompt line** for building those). Pair one \`PromptLineAutocomplete\` with exactly one \`PromptLine\` via the imperative handle from its \`@onReady\` — typically composed inside a \`PromptLineShell\`'s \`<:autocompleteContent>\` block.

Mention and command items always insert into the editor as a chip (a \`data-token-type="mention"\`/\`"command"\` node — \`disableDirectSend\` is forced \`true\` for these two regardless of config). Autocomplete and starter items default to **sending directly**: clicking one fires \`@onItemSend\` with its \`value ?? label\` and never touches the editor at all — the host owns actually sending it (this component carries no chat-domain logic, matching \`PromptLineShell\`). Set \`disableDirectSend: true\` on an autocomplete/starters config to switch that trigger's items to the "insert into the editor" path instead, firing \`@onItemSelected\` (and, for starters specifically, \`@onStarterSelected\` with the editor's full text) rather than \`@onItemSend\`.

Use the arrow keys, Home/End, Enter and Escape from the editor; disabled items are skipped.`,
      },
    },
  },
  argTypes: {
    suggestions: { control: false },
    promptLine: { control: false },
    mention: { control: false },
    command: { control: false },
    autocomplete: { control: false },
    starters: { control: false },
    target: { control: false },
    i18n: { control: false },
  },
  args: {
    suggestions: FLAT_SUGGESTIONS,
    disableDirectSend: false,
    isSendDisabled: false,
    hint: 'Type "when" or "sun" to see suggestions.',
    onItemSelected: fn(),
    onItemSend: fn(),
    onStarterSelected: fn(),
  },
});

export const Default = meta.story({ render: renderTypeahead });

Default.test(
  'filters by the typed word; arrows move and Enter sends the item',
  async ({ canvas, canvasElement, userEvent, args }) => {
    await focusRichEditor(canvasElement, userEvent);
    await userEvent.keyboard('sun');

    await waitFor(() => expect(canvas.getAllByRole('option')).toHaveLength(2));
    await expect(activeOption(canvasElement)).toHaveTextContent(
      'When is the sun rising today?',
    );

    await userEvent.keyboard('{ArrowDown}');
    await expect(activeOption(canvasElement)).toHaveTextContent(
      'When is the sun setting today?',
    );
    await userEvent.keyboard('{Enter}');

    await expect(args.onItemSend).toHaveBeenCalledWith(
      'When is the sun setting today?',
    );
    await expect(canvas.queryByRole('listbox')).toBe(null);
  },
);

Default.test(
  'Escape closes the list without picking anything',
  async ({ canvas, canvasElement, userEvent, args }) => {
    await focusRichEditor(canvasElement, userEvent);
    await userEvent.keyboard('when');
    await canvas.findByRole('listbox', { name: 'Autocomplete options' });

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('listbox')).toBe(null));
    await expect(args.onItemSend).not.toHaveBeenCalled();
    await expect(args.onItemSelected).not.toHaveBeenCalled();
  },
);

export const WithHeader = meta.story({
  render: renderTypeahead,
  args: {
    headerConfig: { showHeader: true, title: 'Prompt suggestions' },
  },
});

WithHeader.test(
  'shows the header above the list',
  async ({ canvas, canvasElement, userEvent }) => {
    await focusRichEditor(canvasElement, userEvent);
    await userEvent.keyboard('when');
    await expect(await canvas.findByText('Prompt suggestions')).toBeVisible();
    await expect(canvas.getAllByRole('option')).toHaveLength(6);
  },
);

export const WithCategories = meta.story({
  render: renderTypeahead,
  args: {
    suggestions: GROUPED_SUGGESTIONS,
    hint: 'Type "summ", "data" or "t" to see grouped suggestions.',
  },
});

WithCategories.test(
  'renders matches under their group headings and inserts on click',
  async ({ canvas, canvasElement, userEvent, args }) => {
    await focusRichEditor(canvasElement, userEvent);
    await userEvent.keyboard('summ');

    const domainA = await canvas.findByRole('group', { name: 'Domain A' });
    const domainB = canvas.getByRole('group', { name: 'Domain B' });
    await expect(canvas.queryByRole('group', { name: 'Domain C' })).toBe(null);
    await expect(within(domainA).getAllByRole('option')).toHaveLength(1);

    await clickOption(userEvent, within(domainB).getByRole('option'));
    await expect(args.onItemSend).toHaveBeenCalledWith('Summarize');
  },
);

export const WithDisabledItems = meta.story({
  render: renderTypeahead,
  args: {
    suggestions: MIXED_SUGGESTIONS,
  },
});

WithDisabledItems.test(
  'disabled items are inert and keyboard navigation skips them',
  async ({ canvas, canvasElement, userEvent }) => {
    await focusRichEditor(canvasElement, userEvent);
    await userEvent.keyboard('when');
    await waitFor(() => expect(canvas.getAllByRole('option')).toHaveLength(5));

    const disabled = canvas.getByRole('option', { name: /sun rising/ });
    await expect(disabled).toHaveAttribute('aria-disabled', 'true');
    // Disabled items can't be clicked at all.
    await expect(getComputedStyle(disabled).pointerEvents).toBe('none');

    await expect(activeOption(canvasElement)).toHaveTextContent(
      'When is the best time to eat?',
    );
    await userEvent.keyboard('{ArrowDown}');
    await expect(activeOption(canvasElement)).toHaveTextContent(
      'When is the sun setting today?',
    );
    await userEvent.keyboard('{ArrowDown}');
    await expect(activeOption(canvasElement)).toHaveTextContent(
      'When is the next full moon?',
    );
  },
);

const PEOPLE: SuggestionItem[] = [
  { id: '1', label: 'Alice', description: 'Design' },
  { id: '2', label: 'Bob', description: 'Engineering' },
  { id: '3', label: 'Priya', description: 'Engineering' },
];
const COMMANDS: SuggestionItem[] = [
  { id: 'c1', label: 'summarize' },
  { id: 'c2', label: 'translate' },
];
const STARTERS: SuggestionItem[] = [
  { id: 's1', label: 'Summarize this thread' },
  { id: 's2', label: 'Draft a reply' },
];

// docs-app's first demo: the popup composed in a PromptLineShell with
// mention, command and starter triggers, plus a send control.
export const InShell = meta.story({
  name: 'In a shell',
  parameters: {
    docs: {
      description: {
        story:
          'Composed inside a `PromptLineShell`\u2019s `<:autocompleteContent>` block, with mention (`@`), command (`/`) and starter triggers on one editor. Focus the empty field for the starters.',
      },
    },
  },
  render: (args) => {
    const host = new Host();
    const mention: TriggerSuggestionConfig = { trigger: '@', items: PEOPLE };
    const command: TriggerSuggestionConfig = { trigger: '/', items: COMMANDS };
    const starters: StartersConfig = { items: STARTERS };
    const extensions = buildCarbonExtensions({ mention, command, starters });

    return <template>
      <ul aria-label="Sent messages" style="margin-block-end: 1rem;">
        {{#each host.messages as |message|}}
          <li>{{message}}</li>
        {{/each}}
      </ul>
      <PromptLineShell @rounded={{true}}>
        <:autocompleteContent>
          <PromptLineAutocomplete
            @promptLine={{host.api}}
            @mention={{mention}}
            @command={{command}}
            @starters={{starters}}
            @onItemSelected={{args.onItemSelected}}
            @onItemSend={{args.onItemSend}}
          />
        </:autocompleteContent>
        <:editor>
          <PromptLine
            @content={{host.content}}
            @placeholder="Type @ to mention someone, / for a command, or focus while empty for starters..."
            @rich={{true}}
            @extensions={{extensions}}
            @onChange={{host.onChange}}
            @onReady={{host.onReady}}
            @onSendIntent={{host.send}}
          />
        </:editor>
        <:sendControl>
          <Tooltip @label="Send" @autoAlign={{true}}>
            <Button
              @type={{undefined}}
              @ghost={{true}}
              @size="sm"
              @iconOnly={{true}}
              @disabled={{host.sendDisabled}}
              @onClick={{host.send}}
              aria-label="Send"
            >
              <Send @size="16" />
            </Button>
          </Tooltip>
        </:sendControl>
      </PromptLineShell>
    </template>;
  },
});

InShell.test(
  'a command picked from the list becomes a chip; Enter then sends',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const editor = await focusRichEditor(canvasElement, userEvent);
    // Starters show while the field is empty and focused.
    await canvas.findByRole('option', { name: /Draft a reply/ });

    await userEvent.keyboard('/');
    await clickOption(
      userEvent,
      await canvas.findByRole('option', { name: /translate/ }),
    );
    await expect(args.onItemSelected).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'c2' }),
    );
    await waitFor(() =>
      expect(
        editor.querySelector('[data-token-type="command"]'),
      ).toHaveTextContent('/translate'),
    );

    await userEvent.keyboard(' hello{Enter}');
    await expect(
      await canvas.findByRole('list', { name: 'Sent messages' }),
    ).toHaveTextContent(/translate hello/);
  },
);

const GROUPED_PEOPLE: SuggestionItem[] = [
  {
    id: '1',
    label: 'Alice',
    avatar: UserAvatar,
    groupId: 'people',
    groupTitle: 'People',
  },
  {
    id: '2',
    label: 'Bob',
    avatar: UserAvatar,
    groupId: 'people',
    groupTitle: 'People',
  },
  {
    id: 't1',
    label: 'deploy-bot',
    avatar: Tools,
    groupId: 'tools',
    groupTitle: 'Tools',
  },
];

// docs-app's "Groups and avatars" demo.
export const GroupsAndAvatars = meta.story({
  name: 'Groups and avatars',
  parameters: {
    docs: {
      description: {
        story:
          '`SuggestionItem.groupId`/`groupTitle` render items under group headings (ungrouped items first, groups in first-occurrence order); `avatar` takes a plain image URL string or an icon component (`ComponentLike<{ Args: { size?, svgClass?, fill? } }>` — the same icon-as-value pattern `AiChatCardFooter`\u2019s `CardFooterAction.icon` uses). Type `@`.',
      },
    },
  },
  render: (args) => {
    const host = new Host();
    const mention: TriggerSuggestionConfig = {
      trigger: '@',
      items: GROUPED_PEOPLE,
    };
    const extensions = buildCarbonExtensions({ mention });

    return <template>
      <div>
        <PromptLine
          @content={{host.content}}
          @placeholder="Type @ ..."
          @rich={{true}}
          @extensions={{extensions}}
          @onChange={{host.onChange}}
          @onReady={{host.onReady}}
        />
        <PromptLineAutocomplete
          @promptLine={{host.api}}
          @mention={{mention}}
          @onItemSelected={{args.onItemSelected}}
        />
      </div>
    </template>;
  },
});

GroupsAndAvatars.test(
  'groups mentions with their avatars',
  async ({ canvas, canvasElement, userEvent }) => {
    await focusRichEditor(canvasElement, userEvent);
    await userEvent.keyboard('@');

    const people = await canvas.findByRole('group', { name: 'People' });
    await expect(within(people).getAllByRole('option')).toHaveLength(2);
    await expect(
      within(canvas.getByRole('group', { name: 'Tools' }))
        .getByRole('option', { name: /deploy-bot/ })
        .querySelector('.cds-aichat-autocomplete-item__avatar'),
    ).not.toBe(null);
  },
);

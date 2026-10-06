import { fn as curry } from '@ember/helper';
import { on } from '@ember/modifier';
import { htmlSafe } from '@ember/template';
import { trackedArray, trackedObject } from '@ember/reactive/collections';
import { RenderStory } from 'ember-storybook';
import { expect, fn, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import Tooltip from '../tooltip.gts';
import Document from '../icons/document.ts';
import Idea from '../icons/idea.ts';
import Language from '../icons/language.ts';
import Send from '../icons/send.ts';
import ChatShell from './chat-shell.gts';
import PromptLine from './prompt-line.gts';
import PromptLineShell from './prompt-line-shell.gts';

import type { Args as ChatShellArgs } from './chat-shell.gts';

// Mirrors `@carbon/ai-chat-components`' `Preview/Chat shell` stories
// (chat-shell/__stories__/shell.stories.js) and, as `Input`/
// `InputExpanded`, its `Preview/Chat shell/Input` stories (input.stories.js).
//
// Parity gaps:
// - `Preview/Chat shell/Header` (`cds-aichat-chat-header`) and
//   `Preview/Chat shell/Panels` (`cds-aichat-panel`) document components
//   that aren't ported; ChatShell's `panels` block takes caller markup.
// - Upstream's `cds-aichat-input-send-control` isn't ported; the input
//   stories use a `Button` in PromptLineShell's `sendControl` block, as the
//   docs-app demo did.
// - Upstream's `SidebarWorkspace` also animates the shell's width open
//   through a story stylesheet; here only `@showWorkspace` toggles.

const SLOTS = [
  { name: 'header', label: 'Header', color: 'rgba(255, 255, 0, 0.5)' },
  {
    name: 'headerAfter',
    label: 'Header after',
    color: 'rgba(255, 255, 0, 0.5)',
  },
  { name: 'messages', label: 'Messages', color: 'rgba(255, 0, 0, 0.5)' },
  { name: 'inputBefore', label: 'Input before', color: 'rgba(0, 255, 0, 0.5)' },
  { name: 'input', label: 'Input', color: 'rgba(0, 255, 0, 0.5)' },
  { name: 'inputAfter', label: 'Input after', color: 'rgba(0, 255, 0, 0.5)' },
  { name: 'footer', label: 'Footer', color: 'rgba(255, 255, 0, 0.5)' },
] as const;

type SlotName = (typeof SLOTS)[number]['name'];

type StoryArgs = ChatShellArgs & {
  /** Story-only: `--cds-aichat-messages-max-width`. */
  messagesMaxWidth?: string;
  /** Story-only: `--cds-aichat-messages-min-width`. */
  messagesMinWidth?: string;
  /** Story-only: `--cds-aichat-workspace-min-width`. */
  workspaceMinWidth?: string;
  /** Story-only: `--cds-aichat-history-width`. */
  historyWidth?: string;
  /** Story-only: called when a message is sent from the input. */
  onSend?: (message: string) => void;
};

const sample = (color: string, fill = false) =>
  htmlSafe(
    `padding: 0.5rem; text-align: center; color: #161616; background-color: ${color};${
      fill ? ' block-size: 100%; inline-size: 100%;' : ''
    }`,
  );

const shellStyle = (args: StoryArgs) =>
  htmlSafe(
    [
      'display: block; block-size: 512px; inline-size: 100%;',
      args.messagesMaxWidth &&
        `--cds-aichat-messages-max-width: ${args.messagesMaxWidth};`,
      args.messagesMinWidth &&
        `--cds-aichat-messages-min-width: ${args.messagesMinWidth};`,
      args.workspaceMinWidth &&
        `--cds-aichat-workspace-min-width: ${args.workspaceMinWidth};`,
      args.historyWidth && `--cds-aichat-history-width: ${args.historyWidth};`,
    ]
      .filter(Boolean)
      .join(' '),
  );

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Chat shell',
  component: ChatShell,
  parameters: {
    docs: {
      description: {
        component: `\`ChatShell\` is the layout shell for a
[Carbon AI Chat](https://github.com/carbon-design-system/carbon-ai-chat)
window — header, message history, input, and optional history/workspace side
panels. Content is supplied entirely through named blocks; \`ChatShell\` itself
owns no conversation state.

\`@showHistory\`/\`@showWorkspace\` are always-controlled booleans — there is no
uncontrolled/default-open variant, matching upstream's own API.

The \`input\` block is entirely caller-supplied too — \`ChatShell\` doesn't own a
text field or send button. The **With prompt line** story composes
\`PromptLineShell\` + \`PromptLine\` (upstream's own separate \`prompt-line\`
component) into it.`,
      },
    },
  },
  argTypes: {
    cornerAll: { control: 'radio', options: ['round', 'square'] },
    cornerStartStart: { control: 'radio', options: ['round', 'square'] },
    cornerStartEnd: { control: 'radio', options: ['round', 'square'] },
    cornerEndStart: { control: 'radio', options: ['round', 'square'] },
    cornerEndEnd: { control: 'radio', options: ['round', 'square'] },
    workspaceLocation: { control: 'radio', options: ['start', 'end'] },
    historyLocation: { control: 'radio', options: ['start', 'end'] },
    messagesMaxWidth: {
      control: 'select',
      options: ['480px', '560px', '672px', '800px', '960px'],
    },
    messagesMinWidth: {
      control: 'select',
      options: ['280px', '320px', '400px', '480px'],
    },
    workspaceMinWidth: {
      control: 'select',
      options: ['480px', '560px', '640px', '800px', '960px'],
    },
    historyWidth: {
      control: 'select',
      options: ['256px', '320px', '400px', '480px'],
    },
  },
  args: {
    aiEnabled: false,
    showFrame: true,
    cornerAll: 'round',
    showHistory: false,
    showWorkspace: false,
    workspaceLocation: 'start',
    historyLocation: 'start',
    contentMaxWidth: true,
  },
  render: (args: StoryArgs) => {
    const visible = trackedObject<Record<SlotName, boolean>>(
      Object.fromEntries(SLOTS.map((slot) => [slot.name, true])) as Record<
        SlotName,
        boolean
      >,
    );
    const toggle = (name: SlotName) => {
      visible[name] = !visible[name];
    };
    const isVisible = (name: SlotName) => visible[name];
    const colorOf = (name: SlotName) =>
      SLOTS.find((slot) => slot.name === name)!.color;

    return <template>
      <fieldset style="margin-block-end: 1rem; border: 0; padding: 0;">
        <legend><strong>Slot Visibility</strong></legend>
        {{#each SLOTS as |slot|}}
          <label style="margin-inline-end: 1rem;">
            <input
              type="checkbox"
              checked={{isVisible slot.name}}
              {{on "change" (curry toggle slot.name)}}
            />
            {{slot.label}}
          </label>
        {{/each}}
      </fieldset>
      <ChatShell
        style={{shellStyle args}}
        @aiEnabled={{args.aiEnabled}}
        @showFrame={{args.showFrame}}
        @cornerAll={{args.cornerAll}}
        @cornerStartStart={{args.cornerStartStart}}
        @cornerStartEnd={{args.cornerStartEnd}}
        @cornerEndStart={{args.cornerEndStart}}
        @cornerEndEnd={{args.cornerEndEnd}}
        @showHistory={{args.showHistory}}
        @showWorkspace={{args.showWorkspace}}
        @workspaceLocation={{args.workspaceLocation}}
        @historyLocation={{args.historyLocation}}
        @contentMaxWidth={{args.contentMaxWidth}}
      >
        <:header>
          {{#if visible.header}}
            <div style={{sample (colorOf "header")}}>Header</div>
          {{/if}}
        </:header>
        <:headerAfter>
          {{#if visible.headerAfter}}
            <div style={{sample (colorOf "headerAfter")}}>Header after</div>
          {{/if}}
        </:headerAfter>
        <:messages>
          {{#if visible.messages}}
            <div style={{sample (colorOf "messages") true}}>Messages</div>
          {{/if}}
        </:messages>
        <:inputBefore>
          {{#if visible.inputBefore}}
            <div style={{sample (colorOf "inputBefore")}}>Input before</div>
          {{/if}}
        </:inputBefore>
        <:input>
          {{#if visible.input}}
            <div style={{sample (colorOf "input")}}>Input</div>
          {{/if}}
        </:input>
        <:inputAfter>
          {{#if visible.inputAfter}}
            <div style={{sample (colorOf "inputAfter")}}>Input after</div>
          {{/if}}
        </:inputAfter>
        <:footer>
          {{#if visible.footer}}
            <div style={{sample (colorOf "footer")}}>Footer</div>
          {{/if}}
        </:footer>
        <:history>
          <div style={{sample "rgba(255, 213, 145, 0.5)" true}}>History</div>
        </:history>
        <:workspace>
          <div style={{sample "rgba(0, 0, 255, 0.5)" true}}>Workspace</div>
        </:workspace>
      </ChatShell>
    </template>;
  },
});

export const Default = meta.story({
  args: {
    messagesMaxWidth: '672px',
    messagesMinWidth: '320px',
    workspaceMinWidth: '640px',
    historyWidth: '320px',
  },
});

Default.test('slots can be toggled off', async ({ canvas, userEvent }) => {
  await expect(
    canvas.getByText('Header after', { selector: 'div' }),
  ).toBeVisible();
  await userEvent.click(canvas.getByRole('checkbox', { name: 'Header after' }));
  await expect(
    canvas.queryByText('Header after', { selector: 'div' }),
  ).toBeNull();
});

export const SidebarWorkspace = meta.story({
  render: (args: StoryArgs) => {
    const state = trackedObject({ open: false });
    const toggle = () => {
      state.open = !state.open;
    };

    return <template>
      <ChatShell
        style="display: block; block-size: 512px; inline-size: 100%;"
        @aiEnabled={{args.aiEnabled}}
        @showFrame={{args.showFrame}}
        @cornerAll={{args.cornerAll}}
        @cornerStartStart={{args.cornerStartStart}}
        @cornerStartEnd={{args.cornerStartEnd}}
        @cornerEndStart={{args.cornerEndStart}}
        @cornerEndEnd={{args.cornerEndEnd}}
        @contentMaxWidth={{args.contentMaxWidth}}
        @workspaceLocation={{args.workspaceLocation}}
        @showWorkspace={{state.open}}
        @workspaceAriaLabel="Workspace"
      >
        <:header>
          <div style={{sample "rgba(255, 255, 0, 0.5)"}}>Chat Header</div>
        </:header>
        <:messages>
          <div style={{sample "rgba(255, 0, 0, 0.5)" true}}>
            <p>Messages area</p>
            <Button @size="sm" @onClick={{toggle}}>Open workspace</Button>
          </div>
        </:messages>
        <:workspace>
          <div style={{sample "rgba(0, 0, 255, 0.5)" true}}>
            <h3>Workspace</h3>
            <Button @size="sm" @onClick={{toggle}}>Close</Button>
            <p>Workspace content goes here</p>
            <p>This area can contain any additional tools or information.</p>
          </div>
        </:workspace>
        <:input>
          <div style={{sample "rgba(0, 255, 0, 0.5)"}}>Input area</div>
        </:input>
      </ChatShell>
    </template>;
  },
});

SidebarWorkspace.test(
  'opens and closes the workspace',
  async ({ canvas, userEvent }) => {
    await expect(
      canvas.queryByRole('region', { name: 'Workspace' }),
    ).toBeNull();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Open workspace' }),
    );
    const workspace = await canvas.findByRole('region', { name: 'Workspace' });
    await userEvent.click(
      within(workspace).getByRole('button', { name: 'Close' }),
    );
    await expect(
      canvas.queryByRole('region', { name: 'Workspace' }),
    ).toBeNull();
  },
);

const DUMMY_ACTIONS = [
  { text: 'Summarize conversation', icon: Document },
  { text: 'Translate last message', icon: Language },
  { text: 'Brainstorm ideas', icon: Idea },
];

export const Input = meta.story({
  parameters: {
    controls: { disable: true },
    // Known violation in the shared `Tooltip` around the send button:
    // `aria-prohibited-attr` (aria-labelledby on its role-less trigger span).
    a11y: { test: 'todo' },
  },
  args: { onSend: fn() },
  decorators: [
    (Story, context) => <template>
      <ChatShell
        style="display: block; block-size: 512px; inline-size: 100%;"
        @showFrame={{true}}
        @cornerAll="round"
        @contentMaxWidth={{true}}
      >
        <:header>
          <div style={{sample "rgba(255, 255, 0, 0.5)"}}>Header</div>
        </:header>
        <:messages>
          <div style={{sample "rgba(255, 0, 0, 0.5)" true}}>Messages</div>
        </:messages>
        <:input>
          <RenderStory @story={{Story}} @args={{context.args}} />
        </:input>
      </ChatShell>
    </template>,
  ],
  render: (args: StoryArgs) => {
    const state = trackedObject({ draft: '' });
    const update = (value: string) => {
      state.draft = value;
    };
    const send = () => {
      args.onSend?.(state.draft);
      state.draft = '';
    };

    return <template>
      <PromptLineShell @rounded={{true}}>
        <:editor>
          <PromptLine
            @content={{state.draft}}
            @placeholder="Ask a question"
            @onChange={{update}}
            @onSendIntent={{send}}
          />
        </:editor>
        <:sendControl>
          <Tooltip @label="Send" @autoAlign={{true}}>
            <Button
              @ghost={{true}}
              @size="sm"
              @iconOnly={{true}}
              @onClick={{send}}
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

export const InputExpanded = Input.extend({
  render: (args: StoryArgs) => {
    const state = trackedObject({ draft: '' });
    const update = (value: string) => {
      state.draft = value;
    };
    const send = () => {
      args.onSend?.(state.draft);
      state.draft = '';
    };

    return <template>
      <PromptLineShell @rounded={{true}} @expanded={{true}}>
        <:editor>
          <PromptLine
            @content={{state.draft}}
            @placeholder="Ask a question"
            @onChange={{update}}
            @onSendIntent={{send}}
          />
        </:editor>
        <:messageActions>
          {{#each DUMMY_ACTIONS as |action|}}
            <Tooltip @label={{action.text}} @align="top-start">
              <Button
                @ghost={{true}}
                @size="sm"
                @iconOnly={{true}}
                aria-label={{action.text}}
              >
                <action.icon @size="16" />
              </Button>
            </Tooltip>
          {{/each}}
        </:messageActions>
        <:sendControl>
          <Tooltip @label="Send" @autoAlign={{true}}>
            <Button
              @ghost={{true}}
              @size="sm"
              @iconOnly={{true}}
              @onClick={{send}}
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

export const WithPromptLine = meta.story({
  parameters: {
    // Known violation in the shared `Tooltip` around the send button:
    // `aria-prohibited-attr` (aria-labelledby on its role-less trigger span).
    a11y: { test: 'todo' },
    docs: {
      description: {
        story:
          'The docs-app demo: history/workspace panels toggled from outside, a message list and a `PromptLineShell` + `PromptLine` input that appends sent messages. `ChatShell` itself owns none of this state.',
      },
    },
  },
  args: {
    messagesAriaLabel: 'Chat messages',
    historyAriaLabel: 'Conversation history',
    workspaceAriaLabel: 'Workspace panel',
    onSend: fn(),
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({
      showHistory: false,
      showWorkspace: false,
      draft: '',
    });
    const messages = trackedArray(['Hello! How can I help?']);
    const toggleHistory = () => {
      state.showHistory = !state.showHistory;
    };
    const toggleWorkspace = () => {
      state.showWorkspace = !state.showWorkspace;
    };
    const updateDraft = (value: string) => {
      state.draft = value;
    };
    const send = () => {
      if (!state.draft.trim()) return;
      messages.push(state.draft);
      args.onSend?.(state.draft);
      state.draft = '';
    };

    return <template>
      <Button @size="sm" @onClick={{toggleHistory}}>Toggle history</Button>
      <Button @size="sm" @onClick={{toggleWorkspace}}>Toggle workspace</Button>
      <div
        style="block-size: 28rem; max-inline-size: 480px; margin-block-start: 1rem;"
      >
        <ChatShell
          @showHistory={{state.showHistory}}
          @showWorkspace={{state.showWorkspace}}
          @messagesAriaLabel={{args.messagesAriaLabel}}
          @historyAriaLabel={{args.historyAriaLabel}}
          @workspaceAriaLabel={{args.workspaceAriaLabel}}
        >
          <:header><strong
              style="padding-inline-start: 1rem;"
            >Assistant</strong></:header>
          <:history>
            <p style="padding: 1rem;">Conversation history goes here.</p>
          </:history>
          <:workspace>
            <p style="padding: 1rem;">Workspace content goes here.</p>
          </:workspace>
          <:messages>
            {{#each messages as |message|}}
              <p style="padding: 0.5rem 1rem;">{{message}}</p>
            {{/each}}
          </:messages>
          <:input>
            <div style="padding: 1rem;">
              <PromptLineShell @rounded={{true}}>
                <:editor>
                  <PromptLine
                    @content={{state.draft}}
                    @placeholder="Type a message…"
                    @onChange={{updateDraft}}
                    @onSendIntent={{send}}
                  />
                </:editor>
                <:sendControl>
                  <Tooltip @label="Send" @autoAlign={{true}}>
                    <Button
                      @ghost={{true}}
                      @size="sm"
                      @iconOnly={{true}}
                      @onClick={{send}}
                      aria-label="Send"
                    >
                      <Send @size="16" />
                    </Button>
                  </Tooltip>
                </:sendControl>
              </PromptLineShell>
            </div>
          </:input>
        </ChatShell>
      </div>
    </template>;
  },
});

WithPromptLine.test(
  'sends messages and toggles the side panels',
  async ({ canvas, userEvent, args }) => {
    await userEvent.type(canvas.getByRole('textbox'), 'Hi there{Enter}');
    await expect(args.onSend).toHaveBeenCalledWith('Hi there');
    const messages = canvas.getByRole('region', { name: 'Chat messages' });
    await expect(within(messages).getByText('Hi there')).toBeVisible();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Toggle history' }),
    );
    await expect(
      await canvas.findByRole('region', { name: 'Conversation history' }),
    ).toBeInTheDocument();
  },
);

export const RoundedAndFraming = meta.story({
  parameters: {
    docs: {
      description: {
        story: `\`@cornerAll\` (and the individual \`@cornerStartStart\`/\`@cornerStartEnd\`/
\`@cornerEndStart\`/\`@cornerEndEnd\` overrides) control the shell's corner
style, and \`@showFrame={{false}}\` drops the outer border/shadow entirely —
useful when the shell is embedded inside a page that already provides its
own frame.`,
      },
    },
  },
  render: () => <template>
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <div style="block-size: 12rem; inline-size: 16rem;">
        <ChatShell
          @cornerAll="round"
          @aiEnabled={{true}}
          @messagesAriaLabel="Rounded chat messages"
        >
          <:header>Rounded, AI-themed</:header>
          <:messages>Content</:messages>
        </ChatShell>
      </div>
      <div style="block-size: 12rem; inline-size: 16rem;">
        <ChatShell
          @showFrame={{false}}
          @messagesAriaLabel="Frameless chat messages"
        >
          <:header>Frameless</:header>
          <:messages>Content</:messages>
        </ChatShell>
      </div>
    </div>
  </template>,
});

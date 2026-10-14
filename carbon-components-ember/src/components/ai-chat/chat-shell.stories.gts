import { trackedArray, trackedObject } from '@ember/reactive/collections';
import { RenderStory } from 'ember-storybook';
import { expect, fn as spy, within } from 'storybook/test';

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

import type { ChatShellSignature } from './chat-shell.gts';
import style from 'ember-style-modifier';
import '#storybook/styles/ai-chat/chat-shell.css';

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
  { name: 'header', label: 'Header' },
  {
    name: 'headerAfter',
    label: 'Header after',
  },
  { name: 'messages', label: 'Messages' },
  { name: 'inputBefore', label: 'Input before' },
  { name: 'input', label: 'Input' },
  { name: 'inputAfter', label: 'Input after' },
  { name: 'footer', label: 'Footer' },
] as const;

type SlotName = (typeof SLOTS)[number]['name'];

type StoryArgs = ChatShellSignature['Args'] & {
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

// The custom properties whose args are set.
const shellVars = (args: StoryArgs) =>
  Object.fromEntries(
    Object.entries({
      '--cds-aichat-messages-max-width': args.messagesMaxWidth,
      '--cds-aichat-messages-min-width': args.messagesMinWidth,
      '--cds-aichat-workspace-min-width': args.workspaceMinWidth,
      '--cds-aichat-history-width': args.historyWidth,
    }).filter(([, value]) => value),
  ) as Record<`--${string}`, string>;

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

    return <template>
      <fieldset class="ai-chat-chat-shell-story__fieldset">
        <legend><strong>Slot Visibility</strong></legend>
        {{#each SLOTS as |slot|}}
          <label class="ai-chat-chat-shell-story__label">
            <input
              type="checkbox"
              checked={{isVisible slot.name}}
              {{on "change" (fn toggle slot.name)}}
            />
            {{slot.label}}
          </label>
        {{/each}}
      </fieldset>
      <ChatShell
        class="ai-chat-chat-shell-story__shell"
        {{style (shellVars args)}}
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
            <div
              class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--yellow"
            >Header</div>
          {{/if}}
        </:header>
        <:headerAfter>
          {{#if visible.headerAfter}}
            <div
              class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--yellow"
            >Header after</div>
          {{/if}}
        </:headerAfter>
        <:messages>
          {{#if visible.messages}}
            <div
              class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--red ai-chat-chat-shell-story__sample--fill"
            >Messages</div>
          {{/if}}
        </:messages>
        <:inputBefore>
          {{#if visible.inputBefore}}
            <div
              class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--green"
            >Input before</div>
          {{/if}}
        </:inputBefore>
        <:input>
          {{#if visible.input}}
            <div
              class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--green"
            >Input</div>
          {{/if}}
        </:input>
        <:inputAfter>
          {{#if visible.inputAfter}}
            <div
              class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--green"
            >Input after</div>
          {{/if}}
        </:inputAfter>
        <:footer>
          {{#if visible.footer}}
            <div
              class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--yellow"
            >Footer</div>
          {{/if}}
        </:footer>
        <:history>
          <div
            class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--peach ai-chat-chat-shell-story__sample--fill"
          >History</div>
        </:history>
        <:workspace>
          <div
            class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--blue ai-chat-chat-shell-story__sample--fill"
          >Workspace</div>
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
        class="ai-chat-chat-shell-story__shell"
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
          <div
            class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--yellow"
          >Chat Header</div>
        </:header>
        <:messages>
          <div
            class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--red ai-chat-chat-shell-story__sample--fill"
          >
            <p>Messages area</p>
            <Button @size="sm" @onClick={{toggle}}>Open workspace</Button>
          </div>
        </:messages>
        <:workspace>
          <div
            class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--blue ai-chat-chat-shell-story__sample--fill"
          >
            <h3>Workspace</h3>
            <Button @size="sm" @onClick={{toggle}}>Close</Button>
            <p>Workspace content goes here</p>
            <p>This area can contain any additional tools or information.</p>
          </div>
        </:workspace>
        <:input>
          <div
            class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--green"
          >Input area</div>
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
  },
  args: { onSend: spy() },
  decorators: [
    (Story, context) => <template>
      <ChatShell
        class="ai-chat-chat-shell-story__shell"
        @showFrame={{true}}
        @cornerAll="round"
        @contentMaxWidth={{true}}
      >
        <:header>
          <div
            class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--yellow"
          >Header</div>
        </:header>
        <:messages>
          <div
            class="ai-chat-chat-shell-story__sample ai-chat-chat-shell-story__sample--red ai-chat-chat-shell-story__sample--fill"
          >Messages</div>
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
    onSend: spy(),
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
      <div class="ai-chat-chat-shell-story__frame">
        <ChatShell
          @showHistory={{state.showHistory}}
          @showWorkspace={{state.showWorkspace}}
          @messagesAriaLabel={{args.messagesAriaLabel}}
          @historyAriaLabel={{args.historyAriaLabel}}
          @workspaceAriaLabel={{args.workspaceAriaLabel}}
        >
          <:header><strong
              class="ai-chat-chat-shell-story__header-title"
            >Assistant</strong></:header>
          <:history>
            <p class="ai-chat-chat-shell-story__padded">Conversation history
              goes here.</p>
          </:history>
          <:workspace>
            <p class="ai-chat-chat-shell-story__padded">Workspace content goes
              here.</p>
          </:workspace>
          <:messages>
            {{#each messages as |message|}}
              <p class="ai-chat-chat-shell-story__message">{{message}}</p>
            {{/each}}
          </:messages>
          <:input>
            <div class="ai-chat-chat-shell-story__padded">
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
    <div class="ai-chat-chat-shell-story__row">
      <div class="ai-chat-chat-shell-story__shell-frame">
        <ChatShell
          @cornerAll="round"
          @aiEnabled={{true}}
          @messagesAriaLabel="Rounded chat messages"
        >
          <:header>Rounded, AI-themed</:header>
          <:messages>Content</:messages>
        </ChatShell>
      </div>
      <div class="ai-chat-chat-shell-story__shell-frame">
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

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';
import { runTask } from 'ember-lifeline';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import SessionShell from './session-shell.gts';

import type Owner from '@ember/owner';
import type ChatSessionService from '../../services/ai-chat-session.ts';
import type {
  ChatMessage,
  ChatSession,
} from '../../services/ai-chat-session.ts';
import type {
  SessionShellHistoryItem,
  SessionShellSignature,
} from './session-shell.gts';

// `@carbon/ai-chat-components` has no `SessionShell`: it is this addon's
// Ember-native equivalent of `@carbon/ai-chat`'s React `AppShell`, so these
// stories are based on the docs-app page, titled like upstream's other AI
// Chat components (`AI Chat/Session shell`). Upstream's `carbonTheme`-style
// theming isn't ported anywhere in these AI Chat stories: the Storybook
// toolbar's theme switcher applies Carbon's theme classes instead.
//
// Isolation: `carbon.ai-chat-session` is an app-wide registry, and
// ember-storybook can reuse one app across story renders, so every render
// here drives its own `ChatSession` through a fresh, unique `@instanceId`
// (the base render and each `Story.test` render never share messages, draft
// or open state). Each host component unregisters its `'send'` listener and
// stops any in-flight simulated reply on teardown (`registerDestructor`), as
// `on()`/`off()` are manual by design.
//
// Persistence: only `WithPersistence` calls `enablePersistence()`, writing to
// `sessionStorage` under its own dedicated key (`PERSISTENCE_KEY` below),
// so it can't leak into any other story. It has no interaction test because
// a restored session can legitimately start open or closed.

const REPLY = 'This is a simulated streamed reply from the host application.';
const PERSISTENCE_KEY = 'storybook:ai-chat/session-shell/with-persistence';

let renderCount = 0;
const uniqueId = (prefix: string) => `${prefix}-${++renderCount}`;

interface HostArgs {
  instanceId: string;
  persistenceKey?: string;
  welcome?: string;
  withHistory?: boolean;
  aiEnabled?: boolean;
  closedLabel?: string;
  messagesAriaLabel?: string;
  onSend?: (message: ChatMessage) => void;
}

/**
 * Plays the host application's part: listens for the session's `'send'`
 * event and streams a simulated reply back through `receive()`/
 * `appendChunk()`/`finalizeStreaming()`, checking `getAbortSignal()` between
 * chunks so "Stop generating" (`cancelStreaming()`) breaks the loop. Also
 * owns the history panel's item list, which is host data.
 */
class SessionShellHost extends Component<{ Args: HostArgs }> {
  @service('carbon.ai-chat-session') declare sessions: ChatSessionService;

  @tracked historyItems: SessionShellHistoryItem[] = [
    { id: 'trip', name: 'Trip planning' },
    { id: 'recipe', name: 'Recipe ideas' },
  ];
  @tracked selectedHistoryItemId?: string;

  session: ChatSession;

  constructor(owner: Owner, args: HostArgs) {
    super(owner, args);
    this.session = this.sessions.for(args.instanceId);

    // Restoring/seeding reads and then writes the session's tracked state,
    // which mustn't happen inside the render that constructs this component
    // (Ember's backtracking-rerender assertion), so it's deferred to the next
    // runloop; `runTask` is cancelled if this component is torn down first.
    runTask(this, () => {
      const restored = args.persistenceKey
        ? this.session.enablePersistence(
            window.sessionStorage,
            args.persistenceKey,
          )
        : false;
      if (!restored && args.welcome) {
        this.session.receive(args.welcome);
      }
    });

    this.session.on('send', this.reply);
    registerDestructor(this, () => {
      this.session.off('send', this.reply);
      this.session.cancelStreaming();
      if (args.persistenceKey) {
        this.session.disablePersistence();
      }
    });
  }

  reply = (message: ChatMessage) => {
    this.args.onSend?.(message);
    void this.streamReply();
  };

  async streamReply() {
    const response = this.session.receive('', { streaming: true });
    const signal = this.session.getAbortSignal(response.id);
    const words = REPLY.split(' ');
    for (const [index, word] of words.entries()) {
      await new Promise((resolve) => setTimeout(resolve, 60));
      if (signal?.aborted || this.isDestroying) {
        return;
      }
      this.session.appendChunk(response.id, (index > 0 ? ' ' : '') + word);
    }
    this.session.finalizeStreaming(response.id);
  }

  @action
  selectHistoryItem(id: string) {
    this.selectedHistoryItemId = id;
  }

  @action
  renameHistoryItem(id: string, name: string) {
    this.historyItems = this.historyItems.map((item) =>
      item.id === id ? { ...item, name } : item,
    );
  }

  @action
  deleteHistoryItem(id: string) {
    this.historyItems = this.historyItems.filter((item) => item.id !== id);
  }

  <template>
    {{#if @withHistory}}
      <SessionShell
        @instanceId={{@instanceId}}
        @aiEnabled={{@aiEnabled}}
        @closedLabel={{@closedLabel}}
        @messagesAriaLabel={{@messagesAriaLabel}}
        @historyItems={{this.historyItems}}
        @selectedHistoryItemId={{this.selectedHistoryItemId}}
        @onHistoryItemSelect={{this.selectHistoryItem}}
        @onHistoryItemRename={{this.renameHistoryItem}}
        @onHistoryItemDelete={{this.deleteHistoryItem}}
      />
    {{else}}
      <SessionShell
        @instanceId={{@instanceId}}
        @aiEnabled={{@aiEnabled}}
        @closedLabel={{@closedLabel}}
        @messagesAriaLabel={{@messagesAriaLabel}}
      />
    {{/if}}
  </template>
}

type StoryArgs = SessionShellSignature['Args'] & {
  onSend: (message: ChatMessage) => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Session shell',
  component: SessionShell,
  parameters: {
    docs: {
      description: {
        component: [
          "`SessionShell` is this addon's Ember-native equivalent of `@carbon/ai-chat`'s React `AppShell` - the orchestration container that wires the `carbon.ai-chat-session` service into the already-ported presentational `Launcher`/`ChatShell`/`PromptLineShell`/`PromptLine`/`Processing` components. Those components stay exactly as ported (stateless, always-controlled); `SessionShell` is the one place that injects `@service('carbon.ai-chat-session')` and passes session state down as plain args.",
          '',
          "Producing an assistant reply is left to the host application, matching upstream's own `customSendMessage` boundary - these stories listen for the session's `'send'` event and call `receive()`/`appendChunk()`/`finalizeStreaming()` themselves, simulating a streamed response. They also check `getAbortSignal()` between chunks, so the \"Stop generating\" button that appears while streaming (wired to `cancelStreaming()`) actually breaks the host's own reply loop, not just the service's internal bookkeeping.",
          '',
          '### Design notes',
          '',
          '- **One injection point.** `SessionShell` is the only component in this family that injects `carbon.ai-chat-session` - everything it renders receives session state as ordinary `@arg`s.',
          '- **`<:workspace>` is yielded outward**, left entirely for the caller to fill in. A filler that needs the same session this shell drives resolves it with the same `@instanceId`.',
          '- **`<:history>` has a built-in default**: passing `@historyItems` (plus the optional `@selectedHistoryItemId`/`@onHistoryItem*` callbacks) renders a real `ChatHistory` assembly with no extra wiring; passing a `<:history>` block instead overrides it completely. The item *list* is always host-owned (matching upstream\'s own `customLoadHistory` boundary - this service tracks one live conversation, not a list of past ones); only the panel\'s open/close chrome and "new chat" action are session-owned.',
          "- **Cancellation.** `cancelStreaming()` aborts the response's `AbortSignal` (`getAbortSignal()`), marks the message no longer streaming/`cancelled`, and permanently drops any further `appendChunk()` call for that response id. `response_id`/`item_id` aliasing (upstream's `StreamingTracker`) is deliberately not ported.",
          "- **`@instanceId` resolves which `ChatSession` this shell drives** - the Ember equivalent of upstream's `NamespaceService`. Omit it for a single-widget page.",
          "- **`enablePersistence()`** opts a session into storage-backed rehydration (`window.sessionStorage` by default, matching upstream's own `UserSessionStorageService` choice). Off by default.",
          "- **Scope cuts**: human-agent handoff, custom panels, and most of upstream's ~50 Redux action types are not ported - only message send/receive, streaming chunk append + cancellation, panel open state, multi-instance isolation, persistence, and a minimal `on()`/`off()`/`emit()` event bus.",
        ].join('\n'),
      },
    },
  },
  args: {
    closedLabel: 'Open chat',
    messagesAriaLabel: 'Chat messages',
    aiEnabled: false,
    onSend: fn(),
  },
  argTypes: {
    instanceId: { control: false },
    historyItems: { control: false },
    selectedHistoryItemId: { control: false },
  },
});

export const Default = meta.story({
  render: (args: StoryArgs) => {
    const instanceId = uniqueId('storybook-session-shell-default');

    return <template>
      <div
        style="block-size: 32rem; max-inline-size: 400px; position: relative;"
      >
        <SessionShellHost
          @instanceId={{instanceId}}
          @welcome="Hello! How can I help?"
          @withHistory={{true}}
          @aiEnabled={{args.aiEnabled}}
          @closedLabel={{args.closedLabel}}
          @messagesAriaLabel={{args.messagesAriaLabel}}
          @onSend={{args.onSend}}
        />
      </div>
    </template>;
  },
});

Default.test(
  'sends a typed message and streams the host reply',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open chat' }));

    const input = await canvas.findByPlaceholderText('Type a message…');
    await userEvent.type(input, 'Plan a trip to Lisbon{Enter}');

    await expect(
      await canvas.findByText('Plan a trip to Lisbon'),
    ).toBeInTheDocument();
    await expect(args.onSend).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'user', text: 'Plan a trip to Lisbon' }),
    );
    await waitFor(() => expect(canvas.getByText(REPLY)).toBeInTheDocument(), {
      timeout: 5000,
    });
  },
);

// docs-app's demo also enabled persistence; it's split out here so only this
// story touches `sessionStorage` (under `PERSISTENCE_KEY`).
export const WithPersistence = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "Calls `enablePersistence()`, so the conversation survives a real page reload (send a message, then reload this story). The history panel's item list is host-owned demo data, not something persistence restores on its own.",
      },
    },
  },
  render: (args: StoryArgs) => {
    const instanceId = uniqueId('storybook-session-shell-persistence');

    return <template>
      <div
        style="block-size: 32rem; max-inline-size: 400px; position: relative;"
      >
        <SessionShellHost
          @instanceId={{instanceId}}
          @persistenceKey={{PERSISTENCE_KEY}}
          @welcome="Hello! How can I help?"
          @withHistory={{true}}
          @aiEnabled={{args.aiEnabled}}
          @closedLabel={{args.closedLabel}}
          @messagesAriaLabel={{args.messagesAriaLabel}}
          @onSend={{args.onSend}}
        />
      </div>
    </template>;
  },
});

export const MultipleInstances = meta.story({
  parameters: {
    controls: { include: ['onSend'] },
    docs: {
      description: {
        story:
          "`@service('carbon.ai-chat-session')` is a registry keyed by id (see `ChatSessionService#for()`), not a single flat bag of state - passing a distinct `@instanceId` to each `SessionShell` isolates its messages, draft, panel state, and event-bus listeners from every other instance on the page. Sending in one never touches the other.",
      },
    },
  },
  // Each open shell renders a messages landmark, so each needs its own
  // `@messagesAriaLabel` (landmark-unique) - that label is the consumer's to
  // supply.
  render: (args: StoryArgs) => {
    const supportId = uniqueId('storybook-session-shell-support');
    const salesId = uniqueId('storybook-session-shell-sales');

    return <template>
      <div style="display: flex; gap: 1rem;">
        <div style="block-size: 24rem; inline-size: 320px; position: relative;">
          <SessionShellHost
            @instanceId={{supportId}}
            @welcome="Hi, I'm the support widget."
            @closedLabel="Open support chat"
            @messagesAriaLabel="Support chat messages"
            @onSend={{args.onSend}}
          />
        </div>
        <div style="block-size: 24rem; inline-size: 320px; position: relative;">
          <SessionShellHost
            @instanceId={{salesId}}
            @welcome="Hi, I'm the sales widget."
            @closedLabel="Open sales chat"
            @messagesAriaLabel="Sales chat messages"
            @onSend={{args.onSend}}
          />
        </div>
      </div>
    </template>;
  },
});

MultipleInstances.test(
  'keeps each instance isolated',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Open support chat' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Open sales chat' }),
    );

    await expect(
      canvas.getByText("Hi, I'm the support widget."),
    ).toBeInTheDocument();
    await expect(
      canvas.getByText("Hi, I'm the sales widget."),
    ).toBeInTheDocument();

    const [supportInput] =
      await canvas.findAllByPlaceholderText('Type a message…');
    await userEvent.type(supportInput!, 'Support question{Enter}');

    await expect(
      await canvas.findByText('Support question'),
    ).toBeInTheDocument();
    await expect(args.onSend).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(canvas.getAllByText(REPLY)).toHaveLength(1), {
      timeout: 5000,
    });
  },
);

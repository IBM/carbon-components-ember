/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import { service } from '@ember/service';

import {
  Button,
  ChatShell,
  Markdown,
  Processing,
  PromptLine,
  PromptLineShell,
  Tooltip,
} from 'carbon-components-ember/components/index';
import { Restart, Send, SidePanelOpen } from 'carbon-components-ember/icons';

import RichResponseWidget, { type RichResponse } from './rich-response.gts';
import { suggestedPrompts } from './sample-data.ts';
import DemoWorkspacePanel from './workspace-panel.gts';

import type Owner from '@ember/owner';
import type ChatSessionService from 'carbon-components-ember/services/ai-chat-session';
import type { ChatSession } from 'carbon-components-ember/services/ai-chat-session';

const INSTANCE_ID = 'demo-full-window';
const STORAGE_KEY = 'docs-ai-chat-demo-full-window';

/**
 * Hand-assembles `ChatShell` directly (rather than the one-line
 * `<SessionShell />` container - see `floating.gts` for that version)
 * to demonstrate the "writeable elements" concept (host content injected
 * into `<:headerAfter>`/`<:inputBefore>`/`<:footer>`, upstream's
 * `WriteableElementName` slots - this addon's equivalent is simply passing
 * a named block, no separate registry API needed) and "custom response
 * types" (rendering something other than plain text for a given assistant
 * message - see `rich-response.ts`'s class doc for why that's kept as
 * demo-local, id-keyed state rather than a `ChatSession` API addition).
 */
export default class AiChatDemoFullWindow extends Component {
  @service('carbon.ai-chat-session') sessions!: ChatSessionService;

  get session(): ChatSession {
    return this.sessions.for(INSTANCE_ID);
  }

  /** Demo-local "custom response type" state - see `rich-response.ts`. */
  @tracked richResponses = new Map<string, RichResponse>();

  suggestedPrompts = suggestedPrompts;

  constructor(owner: Owner, args: object) {
    super(owner, args);

    const restored = this.session.enablePersistence(window.sessionStorage, STORAGE_KEY);

    if (!restored) {
      this.session.receive(
        'Hi! This is the full-window layout. Try one of the suggestions below, or ask me anything.'
      );
    }

    this.session.open = true;
    this.session.on('send', this.handleSend);
    registerDestructor(this, () => this.session.off('send', this.handleSend));
  }

  handleSend = (message: { text: string }): void => {
    void this.reply(message);
  };

  reply = async (message: { text: string }): Promise<void> => {
    const text = message.text.toLowerCase();
    const kind = text.includes('card')
      ? 'card'
      : text.includes('table')
        ? 'table'
        : text.includes('code')
          ? 'code'
          : text.includes('audio')
            ? 'audio'
            : text.includes('video')
              ? 'video'
              : undefined;

    const intro = kind
      ? `Sure, here's an example **${kind}** response:`
      : "Here's a simulated **streamed** reply, rendered as markdown.";
    const reply = this.session.receive('', { streaming: true });
    const signal = this.session.getAbortSignal(reply.id);

    for (const [index, word] of intro.split(' ').entries()) {
      await new Promise((resolve) => setTimeout(resolve, 40));
      if (signal?.aborted) return;
      this.session.appendChunk(reply.id, (index > 0 ? ' ' : '') + word);
    }

    this.session.finalizeStreaming(reply.id);

    if (kind) {
      this.richResponses = new Map(this.richResponses).set(reply.id, { kind });
    }
  };

  stopStreaming = (): void => {
    this.session.cancelStreaming();
  };

  sendMessage = (): void => {
    this.session.send();
  };

  @action
  sendSuggestion(prompt: string): void {
    this.session.send(prompt);
  }

  <template>
    <div class="cds-aichat-demo__full-window">
      <ChatShell
        @messagesAriaLabel="Full-window demo chat"
        @showWorkspace={{this.session.showWorkspace}}
        @contentMaxWidth={{true}}
      >
        <:header>
          Carbon AI Chat — full-window demo
          <Tooltip @label="Workspace panel" @autoAlign={{true}}>
            <Button
              @type={{undefined}}
              @ghost={{true}}
              @size="sm"
              @iconOnly={{true}}
              @onClick={{this.session.toggleWorkspace}}
              aria-label="Toggle workspace panel"
            >
              <SidePanelOpen @size="16" />
            </Button>
          </Tooltip>
          <Tooltip @label="Restart conversation" @autoAlign={{true}}>
            <Button
              @type={{undefined}}
              @ghost={{true}}
              @size="sm"
              @iconOnly={{true}}
              @onClick={{this.session.restart}}
              aria-label="Restart conversation"
            >
              <Restart @size="16" />
            </Button>
          </Tooltip>
        </:header>
        <:headerAfter>
          {{! A "writeable element" example - upstream's HEADER_BOTTOM equivalent. }}
          <p class="cds-aichat-demo__banner">
            This layout fills its container instead of a launcher-driven corner widget - compare
            with the floating demo below.
          </p>
        </:headerAfter>
        <:workspace>
          <DemoWorkspacePanel @session={{this.session}} @onClose={{this.session.toggleWorkspace}} />
        </:workspace>
        <:messages>
          {{#each this.session.messages key="id" as |message|}}
            <div class="cds-aichat-demo__message cds-aichat-demo__message--{{message.role}}">
              <Markdown @markdown={{message.text}} @streaming={{message.streaming}} />
              {{#let (getResponse this.richResponses message.id) as |response|}}
                {{#if response}}
                  <RichResponseWidget @response={{response}} />
                {{/if}}
              {{/let}}
              {{#if message.cancelled}}
                <span class="cds-aichat-demo__stopped-label">(stopped)</span>
              {{/if}}
            </div>
          {{/each}}
          {{#if this.session.isStreaming}}
            <div class="cds-aichat-demo__streaming-actions">
              <Processing />
              <Button
                @type={{undefined}}
                @ghost={{true}}
                @size="sm"
                @onClick={{this.stopStreaming}}
              >
                Stop generating
              </Button>
            </div>
          {{/if}}
        </:messages>
        <:inputBefore>
          {{! Another "writeable element" example - quick-reply suggestion chips. }}
          <div class="cds-aichat-demo__suggestions">
            {{#each this.suggestedPrompts as |prompt|}}
              <Button
                @type={{undefined}}
                @tertiary={{true}}
                @size="sm"
                @onClick={{fn this.sendSuggestion prompt}}
              >
                {{prompt}}
              </Button>
            {{/each}}
          </div>
        </:inputBefore>
        <:input>
          <div class="cds-aichat-demo__input">
            <PromptLineShell @rounded={{true}} @disabled={{this.session.isReadonly}}>
              <:editor>
                <PromptLine
                  @content={{this.session.draft}}
                  @placeholder="Type a message…"
                  @disabled={{this.session.isReadonly}}
                  @onChange={{this.session.setDraft}}
                  @onSendIntent={{this.session.send}}
                />
              </:editor>
              <:sendControl>
                <Tooltip @label="Send" @autoAlign={{true}}>
                  <Button
                    @type={{undefined}}
                    @ghost={{true}}
                    @size="sm"
                    @iconOnly={{true}}
                    @disabled={{this.session.isReadonly}}
                    @onClick={{this.sendMessage}}
                    aria-label="Send"
                  >
                    <Send @size="16" />
                  </Button>
                </Tooltip>
              </:sendControl>
            </PromptLineShell>
          </div>
        </:input>
        <:footer>
          {{! A third "writeable element" example. }}
          <p class="cds-aichat-demo__disclaimer">Responses in this demo are simulated locally -
            nothing is sent to a real backend.</p>
        </:footer>
      </ChatShell>
    </div>
  </template>
}

function getResponse(map: Map<string, RichResponse>, id: string): RichResponse | undefined {
  return map.get(id);
}

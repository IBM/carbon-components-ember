/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { service } from '@ember/service';
import Button from '../button.gts';
import Tooltip from '../tooltip.gts';
import Launcher from './launcher.gts';
import ChatShell from './chat-shell.gts';
import Processing from './processing.gts';
import PromptLine from './prompt-line.gts';
import PromptLineShell from './prompt-line-shell.gts';
import Send from '../icons/send.ts';
import Close from '../icons/close.ts';
import type ChatSessionService from '../../services/ai-chat-session.ts';

export interface SessionShellSignature {
  Element: HTMLDivElement;
  Args: {
    /** Enables AI-specific theming on the launcher and shell. */
    aiEnabled?: boolean;
    /** Aria label for the closed launcher button. */
    closedLabel?: string;
    /** Aria label for the messages region. */
    messagesAriaLabel?: string;
  };
  Blocks: {
    /** Shell header content, shown only while open. */
    header: [];
    /**
     * History panel content. Left entirely to the caller (e.g. the
     * `ai-chat/chat-history` family, PR #870) - this component only owns
     * `@service('carbon.ai-chat-session').showHistory`/`toggleHistory`,
     * the same "inject the service, pass args down, don't prop-drill"
     * boundary `ChatShell` itself already draws for every other slot.
     */
    history: [];
    /** Workspace panel content. See `<:history>`. */
    workspace: [];
  };
}

/**
 * Top-level container that wires the `carbon.ai-chat-session` service (this
 * addon's Ember-native equivalent of `@carbon/ai-chat`'s React `AppShell` +
 * `services/`/`store/` orchestration layer) into the already-ported
 * presentational `ai-chat/*` components - `Launcher` while closed,
 * `ChatShell` + `PromptLineShell`/`PromptLine` + `Processing` while open.
 *
 * This is the intended injection point for `Launcher`/`ChatShell`/
 * `PromptLine`, which themselves stay exactly as ported (stateless/always-
 * controlled, per their own class docs) and receive session state purely
 * as args from here, matching AGENTS.md's "React context -> a service, or
 * the parent component instance yielded down to children" convention
 * rather than threading the service through every descendant individually.
 * The `<:history>`/`<:workspace>` blocks are the one deliberate exception -
 * a filler for those slots (e.g. the eventual `ai-chat/chat-history`
 * integration) that needs its own `carbon.ai-chat-session` affordance
 * (e.g. a close button) injects the service itself, same as any other
 * consumer would.
 *
 * See AGENTS.md's "Porting Carbon AI Chat" -> "Orchestration layer" section
 * for the full React -> Ember mapping and the scope this first pass cuts.
 */
export default class SessionShell extends Component<SessionShellSignature> {
  @service('carbon.ai-chat-session') declare session: ChatSessionService;

  sendMessage = (): void => {
    this.session.send();
  };

  stopStreaming = (): void => {
    this.session.cancelStreaming();
  };

  get closedLabel(): string {
    return this.args.closedLabel ?? 'Open chat';
  }

  get messagesAriaLabel(): string {
    return this.args.messagesAriaLabel ?? 'Chat messages';
  }

  <template>
    <div ...attributes>
      {{#if this.session.open}}
        <ChatShell
          @aiEnabled={{@aiEnabled}}
          @showHistory={{this.session.showHistory}}
          @showWorkspace={{this.session.showWorkspace}}
          @messagesAriaLabel={{this.messagesAriaLabel}}
        >
          <:header>
            {{yield to='header'}}
            <Tooltip @label='Close' @autoAlign={{true}}>
              <Button
                @type={{undefined}}
                @ghost={{true}}
                @size='sm'
                @iconOnly={{true}}
                @onClick={{this.session.toggleOpen}}
                aria-label='Close chat'
              >
                <Close @size='16' />
              </Button>
            </Tooltip>
          </:header>
          <:history>{{yield to='history'}}</:history>
          <:workspace>{{yield to='workspace'}}</:workspace>
          <:messages>
            {{#each this.session.messages key='id' as |message|}}
              <div
                class='cds-aichat-session-shell__message
                  cds-aichat-session-shell__message--{{message.role}}'
              >
                {{message.text}}
                {{#if message.cancelled}}
                  <span class='cds-aichat-session-shell__stopped-label'>(stopped)</span>
                {{/if}}
              </div>
            {{/each}}
            {{#if this.session.isStreaming}}
              <div class='cds-aichat-session-shell__streaming-actions'>
                <Processing />
                <Button
                  @type={{undefined}}
                  @ghost={{true}}
                  @size='sm'
                  @onClick={{this.stopStreaming}}
                >
                  Stop generating
                </Button>
              </div>
            {{/if}}
          </:messages>
          <:input>
            <div class='cds-aichat-session-shell__input'>
              <PromptLineShell @rounded={{true}} @disabled={{this.session.isReadonly}}>
                <:editor>
                  <PromptLine
                    @content={{this.session.draft}}
                    @placeholder='Type a message…'
                    @disabled={{this.session.isReadonly}}
                    @onChange={{this.session.setDraft}}
                    @onSendIntent={{this.session.send}}
                  />
                </:editor>
                <:sendControl>
                  <Tooltip @label='Send' @autoAlign={{true}}>
                    <Button
                      @type={{undefined}}
                      @ghost={{true}}
                      @size='sm'
                      @iconOnly={{true}}
                      @disabled={{this.session.isReadonly}}
                      @onClick={{this.sendMessage}}
                      aria-label='Send'
                    >
                      <Send @size='16' />
                    </Button>
                  </Tooltip>
                </:sendControl>
              </PromptLineShell>
            </div>
          </:input>
        </ChatShell>
      {{else}}
        <Launcher
          @aiEnabled={{@aiEnabled}}
          @closedLabel={{this.closedLabel}}
          @onToggle={{this.session.toggleOpen}}
        />
      {{/if}}
    </div>
  </template>
}

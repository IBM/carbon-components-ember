/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';
import { service } from '@ember/service';

import { Button, SessionShell, Tooltip } from 'carbon-components-ember/components/index';
import { SidePanelOpen } from 'carbon-components-ember/icons';

import DemoWorkspacePanel from './workspace-panel.gts';

import type Owner from '@ember/owner';
import type ChatSessionService from 'carbon-components-ember/services/ai-chat-session';
import type { ChatSession } from 'carbon-components-ember/services/ai-chat-session';

const INSTANCE_ID = 'demo-floating';
const STORAGE_KEY = 'docs-ai-chat-demo-floating';
const REPLY =
  'This is the floating launcher layout, using the one-line <SessionShell /> container instead of hand-assembling ChatShell.';

/**
 * The "drop-in container" half of this demo - `<SessionShell />` is the
 * pre-assembled equivalent of `full-window.gts`'s hand-wired `ChatShell`,
 * the right choice for a host that doesn't need custom message rendering.
 * Positioned as a small corner widget behind a launcher button, matching
 * how most real embeds actually use it.
 */
export default class AiChatDemoFloating extends Component {
  @service('carbon.ai-chat-session') sessions!: ChatSessionService;

  instanceId = INSTANCE_ID;

  get session(): ChatSession {
    return this.sessions.for(INSTANCE_ID);
  }

  constructor(owner: Owner, args: object) {
    super(owner, args);

    const restored = this.session.enablePersistence(window.sessionStorage, STORAGE_KEY);

    if (!restored) {
      this.session.receive('Hi! Ask me anything, or open the workspace panel via the header.');
    }

    this.session.on('send', this.handleSend);
    registerDestructor(this, () => this.session.off('send', this.handleSend));
  }

  handleSend = (): void => {
    void this.reply();
  };

  reply = async (): Promise<void> => {
    const message = this.session.receive('', { streaming: true });
    const signal = this.session.getAbortSignal(message.id);

    for (const [index, word] of REPLY.split(' ').entries()) {
      await new Promise((resolve) => setTimeout(resolve, 40));
      if (signal?.aborted) return;
      this.session.appendChunk(message.id, (index > 0 ? ' ' : '') + word);
    }

    this.session.finalizeStreaming(message.id);
  };

  <template>
    <div class="cds-aichat-demo__floating">
      <SessionShell @instanceId={{this.instanceId}} @closedLabel="Open chat" @aiEnabled={{true}}>
        <:header>
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
        </:header>
        <:workspace>
          <DemoWorkspacePanel @session={{this.session}} @onClose={{this.session.toggleWorkspace}} />
        </:workspace>
      </SessionShell>
    </div>
  </template>
}

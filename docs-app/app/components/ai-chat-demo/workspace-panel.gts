/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { array, hash } from '@ember/helper';

import {
  WorkspaceShell,
  WorkspaceShellBody,
  WorkspaceShellFooter,
} from 'carbon-components-ember/components/index';

import type { TOC } from '@ember/component/template-only';
import type { WorkspaceShellFooterAction } from 'carbon-components-ember/components/ai-chat/workspace-shell-footer';
import type { ChatSession } from 'carbon-components-ember/services/ai-chat-session';

/**
 * Example "custom panel" - `SessionShell`/`ChatShell` leave `<:workspace>`
 * entirely to the caller (see `session-shell.gjs.md`'s design notes), so
 * this is ordinary host-application content, not a new addon API. Built
 * from the already-ported `WorkspaceShell` family to show what a real
 * workspace panel (e.g. search results, a settings surface, session
 * details) looks like assembled from those pieces.
 */
export const DemoWorkspacePanel: TOC<{ Args: { session: ChatSession; onClose: () => void } }> =
  <template>
    <WorkspaceShell>
      <:header as |Header|>
        <Header @titleText="Session details" @subTitleText="Custom workspace panel" />
      </:header>
      <:body>
        <WorkspaceShellBody>
          <p>Instance id: <code>{{@session.id}}</code></p>
          <p>Messages so far: <code>{{@session.messages.length}}</code></p>
          <p>
            This panel is ordinary host content passed to
            <code>&lt;:workspace&gt;</code>
            - nothing here is part of the
            <code>carbon.ai-chat-session</code>
            service itself.
          </p>
        </WorkspaceShellBody>
      </:body>
      <:footer>
        <WorkspaceShellFooter
          @actions={{array (hash id="close" label="Close panel" kind="ghost")}}
          @onClick={{ignoreAction @onClose}}
        />
      </:footer>
    </WorkspaceShell>
  </template>;

function ignoreAction(callback: () => void): (action: WorkspaceShellFooterAction) => void {
  return () => callback();
}

export default DemoWorkspacePanel;

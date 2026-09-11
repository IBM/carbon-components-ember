/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';

export interface WorkspaceShellBodySignature {
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}

/**
 * The main, scrollable content area of a `WorkspaceShell`.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-workspace-shell-body`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/workspace-shell).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed.
 */
export default class WorkspaceShellBody extends Component<WorkspaceShellBodySignature> {
  <template>
    <div class='cds-aichat-workspace-shell__body' ...attributes>
      {{yield}}
    </div>
  </template>
}

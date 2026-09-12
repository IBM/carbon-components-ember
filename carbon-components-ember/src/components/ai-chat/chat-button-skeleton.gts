/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type { ChatButtonSize } from './chat-button.gts';

export type Args = {
  /** Button size. Defaults to `'lg'`. */
  size?: ChatButtonSize;
};

export interface AiChatChatButtonSkeletonSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * Loading placeholder for `AiChatChatButton`.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-button-skeleton`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-button).
 * Upstream extends `@carbon/web-components`' `cds-button-skeleton`; this
 * addon has no `ButtonSkeleton` of its own to wrap (a Carbon React parity
 * gap, out of scope here), so this renders the same shimmering pill shape
 * directly with plain markup + `@carbon/styles`' `cds--skeleton` utility.
 */
export default class AiChatChatButtonSkeleton extends Component<AiChatChatButtonSkeletonSignature> {
  get size() {
    return this.args.size ?? 'lg';
  }

  <template>
    <div class='cds-aichat-button-skeleton cds-aichat-button-skeleton--{{this.size}} cds--skeleton' ...attributes></div>
  </template>
}

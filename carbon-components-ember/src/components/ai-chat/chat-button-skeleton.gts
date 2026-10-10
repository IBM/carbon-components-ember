/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type { ChatButtonSize } from './chat-button.gts';

export interface AiChatChatButtonSkeletonSignature {
  Element: HTMLDivElement;
  Args: {
    /** Button size. Defaults to `'lg'`. */
    size?: ChatButtonSize;
  };
}

/**
 * Loading placeholder for `AiChatChatButton`.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-button-skeleton`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-button).
 * Upstream extends `@carbon/web-components`' `cds-button-skeleton`; this
 * renders the same shimmering pill shape directly with plain markup rather
 * than wrapping this addon's `ButtonSkeleton`, styled via `@carbon/styles`' `skeleton`
 * Sass mixin (not the `cds--skeleton` class - that has no standalone CSS
 * rule of its own, it only exists as a compound modifier paired with a
 * specific component's own class like `cds--btn`/`cds--text-input`).
 */
export default class AiChatChatButtonSkeleton extends Component<AiChatChatButtonSkeletonSignature> {
  get size() {
    return this.args.size ?? 'lg';
  }

  <template>
    <div
      class="cds-aichat-button-skeleton cds-aichat-button-skeleton--{{this.size}}"
      ...attributes
    ></div>
  </template>
}

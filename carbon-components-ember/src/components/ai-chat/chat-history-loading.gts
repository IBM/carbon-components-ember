/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import SkeletonText from '../skeleton-text.gts';
import type { TOC } from '@ember/component/template-only';

export interface ChatHistoryLoadingSignature {
  Element: HTMLDivElement;
}

/**
 * Loading placeholder for a `ChatHistoryContent`: four short skeleton
 * lines (standing in for a results count + a row of items) followed by
 * four two-line skeleton paragraphs.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-history-loading`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-history),
 * which renders the same fixed shape (no configurable count).
 */
const ChatHistoryLoading: TOC<ChatHistoryLoadingSignature> = <template>
  <div class="cds-aichat-history-loading" ...attributes>
    <div class="cds-aichat-history-loading__results">
      <SkeletonText @width="60%" />
      <SkeletonText @width="60%" />
      <SkeletonText @width="60%" />
      <SkeletonText @width="60%" />
    </div>
    <SkeletonText @paragraph={{true}} @lineCount={{2}} />
    <SkeletonText @paragraph={{true}} @lineCount={{2}} />
    <SkeletonText @paragraph={{true}} @lineCount={{2}} />
    <SkeletonText @paragraph={{true}} @lineCount={{2}} />
  </div>
</template>;

export default ChatHistoryLoading;

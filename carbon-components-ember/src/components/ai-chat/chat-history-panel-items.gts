/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import ChatHistoryPanelItem from './chat-history-panel-item.gts';
import ChatHistoryPanelMenu from './chat-history-panel-menu.gts';

export type Args = {
  /** Propagated down to every yielded `ChatHistoryPanelItem`/`ChatHistoryPanelMenu`. */
  showActions?: boolean;
};

export interface ChatHistoryPanelItemsSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    default: [
      WithBoundArgs<typeof ChatHistoryPanelItem, 'showActions'>,
      WithBoundArgs<typeof ChatHistoryPanelMenu, 'showActions'>,
    ];
  };
}

/**
 * Plain list wrapper (`role='list'`) for a `ChatHistoryPanel`'s items -
 * yields both `ChatHistoryPanelItem` and `ChatHistoryPanelMenu` pre-bound
 * with `@showActions`, so a consumer can mix top-level items and
 * collapsible groups directly in the default block.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-history-panel-items`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-history),
 * which itself extends `@carbon/web-components`' `CDSSideNavItems` (a bare
 * `<slot>` with `role='list'` - no `cds--side-nav__items` class exists in
 * `@carbon/styles`' compiled CSS at all; that's a Carbon-React-only class
 * name). Upstream also sets a `data-floating-menu-container` attribute here
 * as a portal target for its `cds-overflow-menu`; not needed here, since
 * this addon's `OverflowMenu` already wormholes its content to
 * `document.body` via `ember-basic-dropdown`.
 */
export default class ChatHistoryPanelItems extends Component<ChatHistoryPanelItemsSignature> {
  <template>
    <div role='list' class='cds-aichat-history-panel-items' ...attributes>
      {{yield
        (component ChatHistoryPanelItem showActions=@showActions)
        (component ChatHistoryPanelMenu showActions=@showActions)
      }}
    </div>
  </template>
}

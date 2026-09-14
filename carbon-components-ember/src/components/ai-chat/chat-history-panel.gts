/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import ChatHistoryPanelItems from './chat-history-panel-items.gts';

export type Args = {
  /**
   * Defaults to `true`. Upstream's `history-panel` always forces its
   * underlying `CDSSideNav`'s `collapse-mode` to `'fixed'` (see its
   * `connectedCallback`) - this port always renders in that fixed mode
   * too, so `@expanded` only toggles between the "expanded"/"collapsed"
   * CSS classes, never the hover/rail/responsive behavior a plain
   * `CDSSideNav` would otherwise have. Those responsive modes aren't part
   * of what `history-panel` itself exposes, so they aren't ported.
   */
  expanded?: boolean;
  /**
   * `true` to always show every descendant `ChatHistoryPanelItem`'s
   * overflow-actions menu, instead of only on hover/focus/selection.
   * Propagated down to every yielded item.
   */
  showActions?: boolean;
};

export interface ChatHistoryPanelSignature {
  Element: HTMLElement;
  Args: Args;
  Blocks: {
    default: [WithBoundArgs<typeof ChatHistoryPanelItems, 'showActions'>];
  };
}

/**
 * A `cds--side-nav`-styled panel listing chat history items, typically
 * rendered inside a `ChatHistoryShell`'s `content` block (wrapped in a
 * `ChatHistoryContent`).
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-history-panel`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-history),
 * which itself extends `@carbon/web-components`' `CDSSideNav`. This addon's
 * own `UIShell`/`Sidenav` (`src/components/ui-shell/-sidenav.gts`) is a
 * different, Carbon-React-parity component built around a fixed
 * `menuItems`/`submenus` config for page-level navigation - it has no
 * concept of a dynamic, renamable/deletable item list, so it isn't reused
 * here; this renders the plain `cds--side-nav__*` markup directly instead.
 *
 * `@showActions` propagates down to every `ChatHistoryPanelItem` by
 * yielding a pre-bound `ChatHistoryPanelItems` (the `Layer`/`ChainOfThought`
 * `WithBoundArgs` pattern), rather than porting upstream's own
 * `MutationObserver`-on-a-DOM-attribute mechanism (`history-panel-item.ts`'s
 * `connectedCallback`) - Ember has no need for a live DOM watcher when the
 * value can just be threaded through args.
 */
export default class ChatHistoryPanel extends Component<ChatHistoryPanelSignature> {
  get expanded() {
    return this.args.expanded ?? true;
  }

  <template>
    <nav
      class='cds-aichat-history-panel cds--side-nav__navigation cds--side-nav
        {{if this.expanded "cds--side-nav--expanded" "cds--side-nav--collapsed"}}'
      ...attributes
    >
      {{yield (component ChatHistoryPanelItems showActions=@showActions)}}
    </nav>
  </template>
}

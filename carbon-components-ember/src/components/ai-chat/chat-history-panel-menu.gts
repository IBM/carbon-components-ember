/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { guidFor } from '@ember/object/internals';
import type { WithBoundArgs } from '@glint/template';
import ChatHistoryPanelItem from './chat-history-panel-item.gts';
import { ChevronDown } from '../../icons.ts';

export type Args = {
  title?: string;
  /**
   * Whether this group's items are expanded. Case B: seeded from `@expanded`
   * (defaulting to `true`, matching upstream's own default), and owned
   * internally unless `@onToggle` is passed - see `ChainOfThoughtToggle`
   * for the same convention.
   */
  expanded?: boolean;
  /** Called with the new expanded state whenever the header is clicked. */
  onToggle?: (expanded: boolean) => void;
  /** Propagated down to every yielded `ChatHistoryPanelItem`. */
  showActions?: boolean;
};

export interface ChatHistoryPanelMenuSignature {
  Element: HTMLElement;
  Args: Args;
  Blocks: {
    default: [WithBoundArgs<typeof ChatHistoryPanelItem, 'showActions' | 'parentMenuExpanded'>];
  };
}

/**
 * A collapsible group of `ChatHistoryPanelItem`s (e.g. "Today",
 * "Yesterday"), rendered inside a `ChatHistoryPanelItems`.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-history-panel-menu`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-history),
 * which itself extends `@carbon/web-components`' `CDSSideNavMenu` -
 * ported as a real `<button>`+`<ul>` pair (`aria-expanded`/`aria-controls`,
 * plus the adjacent-sibling `[aria-expanded=true] + .cds--side-nav__menu`
 * CSS rule) matching that base class's own render() shape, since
 * `@carbon/styles`' compiled CSS already ships untagged rules for
 * `.cds--side-nav__submenu`/`.cds--side-nav__menu` that apply directly to
 * plain elements with those classes (verified before relying on it - see
 * the class doc on `ChatHistoryPanel` for why that verification mattered
 * here). Yields its own live expanded state down to every child item as
 * `@parentMenuExpanded`, replacing upstream's `cds-side-nav-menu-toggled`
 * event listener (`history-panel-item.ts`'s `connectedCallback`) with a
 * plain bound arg.
 */
export default class ChatHistoryPanelMenu extends Component<ChatHistoryPanelMenuSignature> {
  @tracked internalExpanded = this.args.expanded ?? true;

  guid = guidFor(this);
  menuId = `cds-aichat-history-panel-menu-${this.guid}`;

  get expanded() {
    if (this.args.onToggle) {
      return this.args.expanded ?? true;
    }
    return this.internalExpanded;
  }

  @action
  toggle() {
    const next = !this.expanded;
    this.internalExpanded = next;
    this.args.onToggle?.(next);
  }

  <template>
    <div role='listitem' class='cds-aichat-history-panel-menu' ...attributes>
      <button
        type='button'
        aria-haspopup='true'
        aria-expanded={{if this.expanded 'true' 'false'}}
        aria-controls={{this.menuId}}
        class='cds--side-nav__submenu'
        {{on 'click' this.toggle}}
      >
        <span class='cds--side-nav__submenu-title'>{{@title}}</span>
        <div class='cds--side-nav__icon cds--side-nav__icon--small cds--side-nav__submenu-chevron'>
          <ChevronDown @size='20' />
        </div>
      </button>
      <ul id={{this.menuId}} class='cds--side-nav__menu'>
        {{yield (component ChatHistoryPanelItem showActions=@showActions parentMenuExpanded=this.expanded)}}
      </ul>
    </div>
  </template>
}

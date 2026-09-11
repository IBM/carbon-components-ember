/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import type { WithBoundArgs } from '@glint/template';
import WorkspaceShellHeader from './workspace-shell-header.gts';

export type Args = {
  /**
   * Enables automatic header collapsible behavior: the header yielded to
   * the `header` block becomes collapsible whenever the body would
   * otherwise have less room than the header itself takes up.
   */
  autoCollapsibleHeader?: boolean;
};

export interface WorkspaceShellSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    toolbar: [];
    notification: [];
    /**
     * Yields a `WorkspaceShellHeader` pre-bound with `@collapsible` driven
     * by `@autoCollapsibleHeader` - use this instead of importing
     * `WorkspaceShellHeader` directly to get the automatic behavior (same
     * `WithBoundArgs` pattern `Layer` uses for its own ambient context).
     */
    header: [WithBoundArgs<typeof WorkspaceShellHeader, 'collapsible'>];
    body: [];
    footer: [];
  };
}

/**
 * Ported, simplified version of upstream's `HeaderCollapsibleManager`: sums
 * the current heights of the toolbar/notification/header/footer areas
 * against the shell's own total height, and reports whether the header
 * should collapse to leave the body enough room. The expanded header
 * height is captured once (the first time it's seen un-collapsed) and
 * reused for all later calculations, so collapsing the header doesn't
 * itself change the measurement it's based on and cause it to flip back
 * open every other frame.
 */
class CollapseTracker {
  private expandedHeaderHeight?: number;

  measure(root: HTMLElement): boolean {
    const height = (selector: string) => (root.querySelector<HTMLElement>(selector)?.offsetHeight ?? 0);
    const toolbarHeight = height('.cds-aichat-workspace-shell__toolbar');
    const notificationHeight = height('.cds-aichat-workspace-shell__notification');
    const footerHeight = height('.cds-aichat-workspace-shell__footer');
    const currentHeaderHeight = height('.cds-aichat-workspace-shell__header, .cds-aichat-workspace-shell__header-details');

    const isCurrentlyCollapsed = Boolean(root.querySelector('.cds-aichat-workspace-shell__header-details'));
    if (!this.expandedHeaderHeight && !isCurrentlyCollapsed && currentHeaderHeight > 0) {
      this.expandedHeaderHeight = currentHeaderHeight;
    }

    const headerHeight = this.expandedHeaderHeight || currentHeaderHeight;
    const availableBodyHeight = root.offsetHeight - toolbarHeight - notificationHeight - headerHeight - footerHeight;
    return availableBodyHeight < headerHeight;
  }

  reset() {
    this.expandedHeaderHeight = undefined;
  }
}

/**
 * The outer AI Chat "workspace" surface: a vertical stack of an optional
 * toolbar, notification area, header, scrollable body and footer.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-workspace-shell`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/workspace-shell).
 * Doesn't collide with any Carbon React component name, so it stays
 * unprefixed.
 */
export default class WorkspaceShell extends Component<WorkspaceShellSignature> {
  @tracked shouldCollapseHeader = false;
  private tracker = new CollapseTracker();

  observeCollapse = modifier((element: HTMLElement) => {
    if (!this.args.autoCollapsibleHeader) return undefined;
    const recompute = () => {
      this.shouldCollapseHeader = this.tracker.measure(element);
    };
    const observer = new ResizeObserver(recompute);
    observer.observe(element);
    return () => observer.disconnect();
  });

  <template>
    <div class='cds-aichat-workspace-shell' ...attributes {{this.observeCollapse}}>
      <div class='cds-aichat-workspace-shell__toolbar'>
        {{yield to='toolbar'}}
      </div>
      <div class='cds-aichat-workspace-shell__notification'>
        {{yield to='notification'}}
      </div>
      {{yield (component WorkspaceShellHeader collapsible=(if @autoCollapsibleHeader this.shouldCollapseHeader)) to='header'}}
      <div class='cds-aichat-workspace-shell__body-wrapper'>
        {{yield to='body'}}
      </div>
      {{yield to='footer'}}
    </div>
  </template>
}

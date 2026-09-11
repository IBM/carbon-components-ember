/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { or } from 'ember-truth-helpers';
import type { ComponentLike } from '@glint/template';
import OverflowMenu from '../overflow-menu.gts';
import OverflowMenuItem from '../overflow-menu/item.gts';
import { OverflowMenuVertical } from '../../icons.ts';
import AiChatTruncatedText from './truncated-text.gts';
import ToolbarActionButton from './-toolbar-action.gts';

export type ToolbarAction = {
  /** Display text - also used as the tooltip label / overflow menu item text. */
  text: string;
  /** Icon component rendered for the action. */
  icon: ComponentLike<{ Args: { size?: number } }>;
  onClick?: () => void;
  /** Renders the action as a link instead of a button. */
  href?: string;
  target?: string;
  disabled?: boolean;
  /** Renders the action as a destructive option in the overflow menu (no effect on a visible icon button). */
  danger?: boolean;
  dangerDescription?: string;
  /** Renders a divider above this item in the overflow menu. */
  divider?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Forces this action to stay out of the overflow menu. */
  fixed?: boolean;
  testId?: string;
};

export type Args = {
  actions?: ToolbarAction[];
  /**
   * Enables responsive overflow: actions that don't fit the available
   * width collapse into an overflow menu. When `false` (the default), all
   * actions render inline in their given order, with no measurement and no
   * overflow menu.
   */
  overflow?: boolean;
  titleText?: string;
  nameText?: string;
};

export interface ToolbarSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    /** The toolbar's leading navigation area. */
    navigation: [];
    /** Overrides the default title (built from `@titleText`/`@nameText`). */
    title: [];
    /** Actions that always stay visible, rendered after the overflow menu. */
    fixedActions: [];
    /**
     * Upstream's own JSDoc calls this slot `toolbar-ai-label`, but its
     * actual template renders `<slot name="decorator">` - this port
     * matches the real behavior, not the stale doc comment.
     */
    decorator: [];
  };
}

const OVERFLOW_MENU_ICON_WIDTH = 40;

function sortByFixed(actions: ToolbarAction[]) {
  return [...actions].sort((a, b) => {
    if (a.fixed && !b.fixed) return -1;
    if (!a.fixed && b.fixed) return 1;
    return 0;
  });
}

/**
 * A horizontal action bar: a navigation area, a title, and a row of
 * icon-button actions that optionally collapse into an overflow menu when
 * they don't fit the available width.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-toolbar`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/toolbar).
 * Doesn't collide with any Carbon React component name (React's own
 * `DataTable` has a private, unexported `-toolbar.gts`), so it stays
 * unprefixed. Reuses this addon's own `Button`/`Tooltip`/`OverflowMenu`
 * instead of `@carbon/web-components`, following the same "reuse this
 * addon's own components" precedent `AiChatTable` set for `Search`/
 * `Pagination` in batch 1.
 *
 * **Overflow measurement is a deliberate simplification, not a 1:1 port.**
 * Upstream's `getActions()` measures whatever is *currently rendered* (the
 * previous render's visible subset) to decide the next one - which means an
 * action that's already collapsed into the overflow menu has no width
 * recorded anywhere, so it can never come back out even once space reopens,
 * until the container transiently hits zero width and a "show everything
 * raw" fallback resets it. That's very likely an unintentional upstream
 * quirk, not documented/deliberate behavior worth reproducing faithfully
 * (see this doc's own "match behavior over intent" principle, which is
 * about *stated* behavior). This port instead keeps a permanently offscreen
 * (`position: absolute; visibility: hidden`, zero layout impact) row
 * rendering every action at full size purely to measure natural widths, so
 * the visible/overflow split is recomputed from complete information on
 * every resize and correctly grows back.
 */
export default class Toolbar extends Component<ToolbarSignature> {
  @tracked visibleActions: ToolbarAction[] = [];
  @tracked hiddenActions: ToolbarAction[] = [];
  @tracked measured = false;

  get sortedActions() {
    return sortByFixed(this.args.actions ?? []);
  }

  get showOverflowMenu() {
    return Boolean(this.args.overflow && this.measured && this.hiddenActions.length > 1);
  }

  get displayedVisibleActions() {
    if (!this.args.overflow) return this.args.actions ?? [];
    if (!this.measured) return this.sortedActions;
    return this.showOverflowMenu ? this.visibleActions : [...this.visibleActions, ...this.hiddenActions];
  }

  get displayedHiddenActions() {
    return this.showOverflowMenu ? this.hiddenActions : [];
  }

  // Not @tracked: purely a guard to skip reassigning `visibleActions`/
  // `hiddenActions` (and so triggering a re-render) when a resize produces
  // the same split as before. Without this, a real DOM change from *any*
  // reassignment (even to a new array with identical content) can nudge
  // `.cds-aichat-toolbar__end`'s own layout enough to refire the
  // ResizeObserver observing it, which recomputes the same idx and
  // reassigns again - an infinite loop the browser eventually reports as
  // "ResizeObserver loop completed with undelivered notifications".
  private lastIdx: number | undefined;

  @action
  recomputeOverflow(endContainer: HTMLElement) {
    const actionsContainer = endContainer.querySelector<HTMLElement>('.cds-aichat-toolbar__actions-container');
    const measureRow = endContainer.querySelector<HTMLElement>('.cds-aichat-toolbar__measure');
    const fixedActions = endContainer.querySelector<HTMLElement>('.cds-aichat-toolbar__fixed-actions');
    const decorator = endContainer.querySelector<HTMLElement>('.cds-aichat-toolbar__decorator-container');
    if (!actionsContainer || !measureRow) return;

    const actionsContainerWidth = actionsContainer.getBoundingClientRect().width;
    if (actionsContainerWidth === 0) return;

    const fixedActionsWidth = fixedActions?.getBoundingClientRect().width || 0;
    const decoratorWidth = decorator?.getBoundingClientRect().width || 0;
    const availableWidth = actionsContainerWidth - (OVERFLOW_MENU_ICON_WIDTH + fixedActionsWidth + decoratorWidth);

    const sorted = this.sortedActions;
    const measureChildren = Array.from(measureRow.children) as HTMLElement[];

    let currentWidth = 0;
    let idx = 0;
    for (const el of measureChildren) {
      const newWidth = currentWidth + el.getBoundingClientRect().width;
      if (newWidth >= availableWidth) break;
      currentWidth = newWidth;
      idx += 1;
    }

    // Fixed actions are sorted first (see `sortByFixed`) and documented to
    // never land in the overflow menu - clamp the cutoff so the width-fit
    // loop above can never push one of them past it, even when there isn't
    // enough room for them either.
    const fixedCount = sorted.filter((a) => a.fixed).length;
    if (idx < fixedCount) idx = fixedCount;

    this.measured = true;
    if (idx === this.lastIdx) return;
    this.lastIdx = idx;
    this.visibleActions = sorted.slice(0, idx);
    this.hiddenActions = sorted.slice(idx);
  }

  // Only observes the container's own width. A consumer changing the size
  // of the `fixedActions`/`decorator` blocks' *content* without the
  // container itself resizing (rare - both are typically fixed-size icon
  // slots) won't trigger a recompute; not observing them also sidesteps a
  // feedback loop `recomputeOverflow` would otherwise create by rewriting
  // `visibleActions`/`hiddenActions`, which live inside this same subtree.
  observeOverflow = modifier((element: HTMLElement) => {
    if (!this.args.overflow) return undefined;
    let raf: number | undefined;
    // Deferring the actual measurement/write to the next animation frame
    // (matching `WorkspaceShellFooter`'s own `watchStacked` modifier, and
    // upstream's own `workspace-shell-footer.ts` comment for the same
    // reason) keeps this callback from doing synchronous, layout-affecting
    // work inside the ResizeObserver's own notification cycle, which is
    // what the browser's "ResizeObserver loop completed with undelivered
    // notifications" error guards against.
    const observer = new ResizeObserver(() => {
      if (raf !== undefined) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => this.recomputeOverflow(element));
    });
    observer.observe(element);
    return () => {
      if (raf !== undefined) cancelAnimationFrame(raf);
      observer.disconnect();
    };
  });

  <template>
    <div data-rounded='top' class='cds-aichat-toolbar' ...attributes>
      <div data-fixed class='cds-aichat-toolbar__start'>
        <div data-fixed class='cds-aichat-toolbar__navigation'>
          {{yield to='navigation'}}
        </div>

        <div data-fixed class='cds-aichat-toolbar__title'>
          {{#if (has-block 'title')}}
            {{yield to='title'}}
          {{else if (or @titleText @nameText)}}
            <AiChatTruncatedText
              @lines={{1}}
              @type='tooltip'
              @align='bottom-start'
              @value='{{@titleText}} {{@nameText}}'
            >
              {{#if @titleText}}<span>{{@titleText}}</span>{{/if}}
              {{#if @nameText}}<span class='cds-aichat-toolbar__name'>{{@nameText}}</span>{{/if}}
            </AiChatTruncatedText>
          {{/if}}
        </div>
      </div>

      <div class='cds-aichat-toolbar__end' data-rounded='top-right' {{this.observeOverflow}}>
        <div class='cds-aichat-toolbar__actions-container'>
          <div class='cds-aichat-toolbar__decorator-container'>
            {{yield to='decorator'}}
          </div>

          {{#each this.displayedVisibleActions as |toolbarAction|}}
            <ToolbarActionButton @action={{toolbarAction}} />
          {{/each}}

          {{#if this.showOverflowMenu}}
            <OverflowMenu @direction='bottom' @tooltip='Options' @icon={{OverflowMenuVertical}}>
              {{#each this.displayedHiddenActions as |toolbarAction|}}
                <OverflowMenuItem
                  @itemText={{toolbarAction.text}}
                  @href={{toolbarAction.href}}
                  @disabled={{toolbarAction.disabled}}
                  @isDelete={{toolbarAction.danger}}
                  @dangerDescription={{toolbarAction.dangerDescription}}
                  @hasDivider={{toolbarAction.divider}}
                  @onClick={{toolbarAction.onClick}}
                />
              {{/each}}
            </OverflowMenu>
          {{/if}}

          <div data-fixed class='cds-aichat-toolbar__fixed-actions'>
            {{yield to='fixedActions'}}
          </div>
        </div>

        {{#if @overflow}}
          <div class='cds-aichat-toolbar__measure' aria-hidden='true'>
            {{#each this.sortedActions as |toolbarAction|}}
              <ToolbarActionButton @action={{toolbarAction}} />
            {{/each}}
          </div>
        {{/if}}
      </div>
    </div>
  </template>
}

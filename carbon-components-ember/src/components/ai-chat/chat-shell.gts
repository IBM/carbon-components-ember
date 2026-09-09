/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { concat } from '@ember/helper';

export type CornerStyle = 'round' | 'square';
export type StartOrEnd = 'start' | 'end';

export type Args = {
  /** Enables AI-specific theming for the chat shell. */
  aiEnabled?: boolean;
  /** Shows a frame border around the chat shell. */
  showFrame?: boolean;
  /**
   * Sets the corner style for all corners. Individual `@cornerStartStart` /
   * `@cornerStartEnd` / `@cornerEndStart` / `@cornerEndEnd` args override
   * this value. Defaults to `'square'`.
   *
   * Upstream renders each corner independently via a per-instance dynamic
   * stylesheet (`CornerManager`). This port only distinguishes "at least one
   * corner is round" vs. "all square" (a single `.rounded` modifier class) —
   * genuinely mixed round/square corners on one shell aren't yet supported.
   */
  cornerAll?: CornerStyle;
  /** Controls the start-start corner (top-left in LTR). Overrides `@cornerAll` if set. */
  cornerStartStart?: CornerStyle;
  /** Controls the start-end corner (top-right in LTR). Overrides `@cornerAll` if set. */
  cornerStartEnd?: CornerStyle;
  /** Controls the end-start corner (bottom-left in LTR). Overrides `@cornerAll` if set. */
  cornerEndStart?: CornerStyle;
  /** Controls the end-end corner (bottom-right in LTR). Overrides `@cornerAll` if set. */
  cornerEndEnd?: CornerStyle;
  /**
   * Shows the history panel. Always-controlled boolean — matches upstream's
   * `show-history` attribute, which has no `default-show-history`
   * counterpart and no change event, so there's no uncontrolled path to
   * offer (see AGENTS.md §3).
   */
  showHistory?: boolean;
  /** Shows the workspace panel. Always-controlled, same shape as `@showHistory`. */
  showWorkspace?: boolean;
  /** Location of the workspace panel. Defaults to `'start'`. */
  workspaceLocation?: StartOrEnd;
  /** Location of the history panel. Defaults to `'start'`. */
  historyLocation?: StartOrEnd;
  /** Aria label for the workspace region. */
  workspaceAriaLabel?: string;
  /** Aria label for the history region. */
  historyAriaLabel?: string;
  /** Aria label for the messages region. */
  messagesAriaLabel?: string;
  /**
   * Announcement text for when a (non-workspace) panel opens. Accepted for
   * API parity; nothing in this port dispatches the panel open/close events
   * upstream keys this announcement off, since the `panels` block's content
   * is entirely up to the caller here (see class doc).
   */
  panelOpenedAnnouncement?: string;
  /** Announcement text for when a (non-workspace) panel closes. See `@panelOpenedAnnouncement`. */
  panelClosedAnnouncement?: string;
  /**
   * Announcement text for when the workspace opens. Accepted for API
   * parity; not yet wired to an actual screen-reader announcement in this
   * port (see class doc).
   */
  workspaceOpenedAnnouncement?: string;
  /** Announcement text for when the workspace closes. See `@workspaceOpenedAnnouncement`. */
  workspaceClosedAnnouncement?: string;
  /** Announcement text for when history becomes visible. See `@workspaceOpenedAnnouncement`. */
  historyShownAnnouncement?: string;
  /** Announcement text for when history becomes hidden. See `@workspaceOpenedAnnouncement`. */
  historyHiddenAnnouncement?: string;
  /**
   * Constrains the input/messages column to a maximum width. When `false`,
   * those slots extend to the full container width.
   */
  contentMaxWidth?: boolean;
};

export interface ChatShellSignature {
  Element: HTMLDivElement;
  Args: Args;
  Blocks: {
    /** Upstream `header` slot. */
    header: [];
    /** Upstream `header-after` slot. */
    headerAfter: [];
    /** Upstream `footer` slot. */
    footer: [];
    /** Upstream `input-before` slot. */
    inputBefore: [];
    /** Upstream `input` slot. */
    input: [];
    /** Upstream `input-after` slot. */
    inputAfter: [];
    /** Upstream `messages` slot — the conversation itself. */
    messages: [];
    /** Upstream `history` slot. Only rendered when `@showHistory` is true. */
    history: [];
    /** Upstream `workspace` slot. Only rendered when `@showWorkspace` is true. */
    workspace: [];
    /** Upstream `panels` slot, for arbitrary caller-managed overlay panels. */
    panels: [];
  };
}

/**
 * Layout shell for Carbon AI Chat — header, message history, input, and
 * optional history/workspace side panels.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-shell`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/chat-shell).
 * Slot names carry over as camelCase named blocks (`header-after` →
 * `<:headerAfter>`), since this codebase has no existing precedent for
 * hyphenated block names and camelCase is the safe, idiomatic Ember choice.
 *
 * This port deliberately does not replicate upstream's internal managers,
 * only its public prop/slot surface and resulting DOM/class structure:
 *
 * - No `ResizeObserverManager` / responsive workspace inline-vs-panel
 *   switching. The `workspace` block always renders inline when
 *   `@showWorkspace` is true; upstream additionally slides it into a bottom
 *   panel below a container-width breakpoint.
 * - No `CornerManager` per-instance dynamic stylesheet — corners are either
 *   all-square or (if any `@corner*` arg is `'round'`) uniformly rounded via
 *   a single CSS class, not individually shaped per corner.
 * - No `PanelManager` / `InitializationManager` / RAF-scheduled open
 *   animation. The `panels` block is yielded as plain content; upstream
 *   additionally manages an internal sliding panel element and open/close
 *   announcements for it.
 * - No `AriaAnnouncerManager`. The two `aria-live="polite"` regions upstream
 *   uses for announcements are present in the DOM for structural parity, but
 *   nothing writes to them yet — the `@*Announcement` args are accepted and
 *   typed but currently inert.
 *
 * These are tracked as follow-up work once the remaining ai-chat-components
 * widgets that actually populate these slots (e.g. `workspace-shell`,
 * `chat-history`) have landed and can inform the design, rather than
 * building the machinery ahead of any real content to drive it.
 *
 * ```gjs
 * import { ChatShell } from 'carbon-components-ember/components';
 *
 * <template>
 *   <ChatShell @messagesAriaLabel='Chat messages'>
 *     <:header>My assistant</:header>
 *     <:messages>...</:messages>
 *     <:input>...</:input>
 *   </ChatShell>
 * </template>
 * ```
 */
export default class ChatShell extends Component<ChatShellSignature> {
  get showHistory() {
    return Boolean(this.args.showHistory);
  }

  get showWorkspace() {
    return Boolean(this.args.showWorkspace);
  }

  get workspaceLocation() {
    return this.args.workspaceLocation ?? 'start';
  }

  get historyLocation() {
    return this.args.historyLocation ?? 'start';
  }

  get hasAnyRoundedCorner() {
    return (
      this.args.cornerAll === 'round' ||
      this.args.cornerStartStart === 'round' ||
      this.args.cornerStartEnd === 'round' ||
      this.args.cornerEndStart === 'round' ||
      this.args.cornerEndEnd === 'round'
    );
  }

  get workspaceAriaLabel() {
    return this.args.workspaceAriaLabel ?? 'Workspace panel';
  }

  get historyAriaLabel() {
    return this.args.historyAriaLabel ?? 'Conversation history';
  }

  get messagesAriaLabel() {
    return this.args.messagesAriaLabel ?? 'Chat messages';
  }

  get shellClasses() {
    return [
      'cds-aichat-shell',
      this.args.aiEnabled ? 'ai-theme' : '',
      this.args.showFrame ? '' : 'frameless',
      this.hasAnyRoundedCorner ? 'rounded' : '',
      this.showHistory ? 'show-history' : '',
      this.showWorkspace ? 'show-workspace' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  get inputAndMessagesClasses() {
    return [
      'cds-aichat-shell__input-and-messages',
      this.args.contentMaxWidth ? 'at-max-width' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  <template>
    <div
      class={{this.shellClasses}}
      workspace-location={{this.workspaceLocation}}
      history-location={{this.historyLocation}}
      ...attributes
    >
      {{! Screen-reader announcement regions -- structural parity only, see class doc. }}
      <div class='cds-aichat-shell__visually-hidden' aria-live='polite' aria-atomic='true'></div>
      <div class='cds-aichat-shell__visually-hidden' aria-live='polite' aria-atomic='true'></div>

      <div class='cds-aichat-shell__main-chat'>
        <div class='cds-aichat-shell__header-with-header-after'>
          {{#if (has-block 'header')}}
            <div class='cds-aichat-shell__header has-content' data-panel-slot='header'>
              {{yield to='header'}}
            </div>
          {{/if}}
          {{#if (has-block 'headerAfter')}}
            <div class='cds-aichat-shell__header-after has-content' data-panel-slot='header-after'>
              {{yield to='headerAfter'}}
            </div>
          {{/if}}
        </div>

        <div class='cds-aichat-shell__main-content'>
          <div class='cds-aichat-shell__main-content-body'>
            {{#if this.showHistory}}
              <div
                class='cds-aichat-shell__history'
                role='region'
                aria-label={{this.historyAriaLabel}}
              >
                <div data-panel-slot='history'>{{yield to='history'}}</div>
              </div>
            {{/if}}

            {{#if this.showWorkspace}}
              <div
                class='cds-aichat-shell__workspace'
                role='region'
                aria-label={{this.workspaceAriaLabel}}
              >
                <div class='cds-aichat-shell__workspace-content'>
                  {{yield to='workspace'}}
                </div>
              </div>
            {{/if}}

            <div
              class={{this.inputAndMessagesClasses}}
              role='region'
              aria-label={{this.messagesAriaLabel}}
            >
              <div class='cds-aichat-shell__messages has-content' data-panel-slot='messages'>
                {{yield to='messages'}}
              </div>
              {{#if (has-block 'inputBefore')}}
                <div
                  class={{concat
                    'cds-aichat-shell__input-before has-content'
                    (if @contentMaxWidth ' messages-max-width' '')
                  }}
                  data-panel-slot='input-before'
                >
                  {{yield to='inputBefore'}}
                </div>
              {{/if}}
              {{#if (has-block 'input')}}
                <div
                  class={{concat
                    'cds-aichat-shell__input has-content'
                    (if @contentMaxWidth ' messages-max-width' '')
                  }}
                  data-panel-slot='input'
                >
                  {{yield to='input'}}
                </div>
              {{/if}}
              {{#if (has-block 'inputAfter')}}
                <div
                  class={{concat
                    'cds-aichat-shell__input-after has-content'
                    (if @contentMaxWidth ' messages-max-width' '')
                  }}
                  data-panel-slot='input-after'
                >
                  {{yield to='inputAfter'}}
                </div>
              {{/if}}
            </div>
          </div>

          {{#if (has-block 'footer')}}
            <div class='cds-aichat-shell__footer has-content' data-panel-slot='footer'>
              {{yield to='footer'}}
            </div>
          {{/if}}
        </div>
      </div>

      <div class='cds-aichat-shell__panels' data-panel-slot='panels'>
        {{yield to='panels'}}
      </div>
    </div>
  </template>
}

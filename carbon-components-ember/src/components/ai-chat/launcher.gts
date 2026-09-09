/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import Tooltip from '../tooltip.gts';
import AiLaunch from '../icons/ai-launch.ts';
import ChatLaunch from '../icons/chat-launch.ts';

export type Args = {
  /**
   * Shows the unread indicator dot when `true` and `@unreadMessageCount` is
   * 0.
   */
  showUnreadIndicator?: boolean;
  /**
   * Number of unread messages. Displays a count badge when greater than 0.
   */
  unreadMessageCount?: number;
  /**
   * Aria label shown when the chat window is closed (launcher is in its
   * "open chat" state).
   */
  closedLabel?: string;
  /**
   * Aria label for the launcher's "close chat" state. Declared for parity
   * with upstream's `cds-aichat-launcher` (it takes an `open-label`
   * attribute), but upstream's own computed aria-label never actually reads
   * it — only `closedLabel`/`unreadLabel` feed it, in every released
   * version through 1.9.0. This port matches that behaviour rather than
   * "fixing" it, since the launcher itself has no open/closed state to key
   * off (see the class doc below).
   */
  openLabel?: string;
  /**
   * When `true`, renders the AI launch icon. When `false`, renders the
   * standard chat launch icon.
   */
  aiEnabled?: boolean;
  /**
   * Optional URL for a custom avatar image. When provided, the avatar
   * replaces the default icon.
   */
  launcherAvatarUrl?: string;
  /**
   * Pre-formatted screen-reader label suffix for the unread message count
   * (e.g. "3 unread messages"). Appended to the button's aria-label when
   * set.
   */
  unreadLabel?: string;
  /** Tooltip position when hovering over the launcher. Defaults to `'top'`. */
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
  /** Called when the user clicks the launcher button. */
  onToggle?: () => void;
};

export interface LauncherSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * Launcher button for Carbon AI Chat — opens the chat window.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-launcher`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/launcher).
 * The upstream element is stateless (no `open`/`closed` property of its
 * own) — it always renders its "open chat" appearance and fires
 * `@onToggle` on click. The host application owns whether the chat window
 * is open and decides whether to render this button at all (or swap it for
 * a close button); this component doesn't model that state itself.
 *
 * ```gjs
 * import { Launcher } from 'carbon-components-ember/components';
 *
 * <template>
 *   <Launcher @closedLabel='Open chat' @onToggle={{this.openChat}} />
 * </template>
 * ```
 */
export default class Launcher extends Component<LauncherSignature> {
  get unreadMessageCount() {
    return this.args.unreadMessageCount ?? 0;
  }

  get showBadge() {
    return this.unreadMessageCount > 0 || Boolean(this.args.showUnreadIndicator);
  }

  get badgeText() {
    return this.unreadMessageCount > 0 ? this.unreadMessageCount : '';
  }

  get ariaLabel() {
    return [this.args.closedLabel, this.args.unreadLabel].filter(Boolean).join('. ');
  }

  get icon() {
    return this.args.aiEnabled ? AiLaunch : ChatLaunch;
  }

  handleClick = () => {
    this.args.onToggle?.();
  };

  <template>
    <div class='cds-aichat-launcher' ...attributes>
      <Tooltip @label={{this.ariaLabel}} @align={{@tooltipPosition}}>
        <button
          type='button'
          class='cds--btn cds--btn--primary cds-aichat-launcher__button'
          aria-label={{this.ariaLabel}}
          {{on 'click' this.handleClick}}
        >
          <span class='cds-aichat-launcher__wrapper'>
            <span class='cds-aichat-launcher__icon-holder'>
              {{#if @launcherAvatarUrl}}
                <img
                  class='cds-aichat-launcher__avatar'
                  src={{@launcherAvatarUrl}}
                  aria-hidden='true'
                  alt=''
                />
              {{else}}
                <this.icon
                  @size={{24}}
                  @svgClass='cds-aichat-launcher__svg'
                  @fill='currentColor'
                />
              {{/if}}
            </span>
          </span>
          {{#if this.showBadge}}
            <div class='cds-aichat-launcher__count-indicator'>
              {{this.badgeText}}
            </div>
          {{/if}}
        </button>
      </Tooltip>
    </div>
  </template>
}

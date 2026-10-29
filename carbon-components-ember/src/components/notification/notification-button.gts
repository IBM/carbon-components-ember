/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import type { IconComponent } from '../icon.gts';
import Close from '../icons/close.ts';

export interface NotificationButtonSignature {
  Element: HTMLButtonElement;
  Args: {
    /**
     * Specify a label to be read by screen readers on the button, also shown
     * as its tooltip. Carbon React's `aria-label`. Defaults to
     * `'close notification'`.
     */
    ariaLabel?: string;
    /**
     * Specify the notification type: `'toast'` (default), `'inline'` or
     * `'actionable'`.
     */
    notificationType?: 'toast' | 'inline' | 'actionable';
    /**
     * A component used to render an icon, if something other than the
     * regular "close" icon is desirable. Drawn at 16px.
     */
    renderIcon?: IconComponent;
  };
}

/**
 * The close button of the notification components. Use it to build a custom
 * notification.
 */
const NotificationButton: TOC<NotificationButtonSignature> = <template>
  {{#let
    (or @notificationType "toast") (or @ariaLabel "close notification")
    as |type label|
  }}
    <button
      type="button"
      aria-label={{label}}
      title={{label}}
      class="cds--{{type}}-notification__close-button"
      ...attributes
    >
      {{#if @renderIcon}}
        <@renderIcon
          @size={{16}}
          @svgClass="cds--{{type}}-notification__close-icon"
        />
      {{else}}
        <Close
          @size={{16}}
          @svgClass="cds--{{type}}-notification__close-icon"
        />
      {{/if}}
    </button>
  {{/let}}
</template>;

export default NotificationButton;

/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Text from '../text.gts';
import NotificationButton from './notification-button.gts';
import NotificationIcon from './-notification-icon.gts';
import type { NotificationKind } from './-notification-icon.gts';

export interface InlineNotificationSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * Provide a description for the "close" icon button that can be read by
     * screen readers. Carbon React's `aria-label`; an `aria-label` attribute
     * would label the notification instead.
     */
    ariaLabel?: string;
    /**
     * Specify whether the close button should be hidden.
     */
    hideCloseButton?: boolean;
    /**
     * Specify what state the notification represents. Defaults to `'error'`.
     */
    kind?: NotificationKind;
    /**
     * Specify whether you are using the low contrast variant of the
     * InlineNotification.
     */
    lowContrast?: boolean;
    /**
     * Provide a function that is called when the close button closes the
     * notification. Return `false` to keep it open.
     */
    onClose?: (event: MouseEvent) => boolean | void;
    /**
     * Provide a function that is called when the close button is clicked.
     */
    onCloseButtonClick?: (event: MouseEvent) => void;
    /**
     * Provide a description for the "status" icon that can be read by screen
     * readers. Defaults to `'<kind> icon'`.
     */
    statusIconDescription?: string;
    /**
     * Specify the subtitle.
     */
    subtitle?: string;
    /**
     * Specify the title.
     */
    title?: string;
  };
  Blocks: {
    /** More content, after the subtitle. Don't put interactive elements here; use an `ActionableNotification` for those. */
    default: [];
  };
}

/**
 * A notification in a task flow, close to where the action happened. It
 * persists until the user closes it.
 */
export default class InlineNotification extends Component<InlineNotificationSignature> {
  @tracked isOpen = true;

  get kind(): NotificationKind {
    return this.args.kind ?? 'error';
  }

  get statusIconDescription() {
    return this.args.statusIconDescription || `${this.kind} icon`;
  }

  onCloseButtonClick = (event: MouseEvent) => {
    this.args.onCloseButtonClick?.(event);
    if (this.args.onClose?.(event) !== false) this.isOpen = false;
  };

  <template>
    {{#if this.isOpen}}
      <div
        role="status"
        class="cds--inline-notification cds--inline-notification--{{this.kind}}
          {{if @lowContrast 'cds--inline-notification--low-contrast'}}
          {{if @hideCloseButton 'cds--inline-notification--hide-close-button'}}"
        ...attributes
      >
        <div class="cds--inline-notification__details">
          <NotificationIcon
            @notificationType="inline"
            @kind={{this.kind}}
            @iconDescription={{this.statusIconDescription}}
          />
          <div class="cds--inline-notification__text-wrapper">
            {{#if @title}}
              <Text @as="div" class="cds--inline-notification__title">
                {{@title}}
              </Text>
            {{/if}}
            {{#if @subtitle}}
              <Text @as="div" class="cds--inline-notification__subtitle">
                {{@subtitle}}
              </Text>
            {{/if}}
            {{yield}}
          </div>
        </div>
        {{#unless @hideCloseButton}}
          <NotificationButton
            @notificationType="inline"
            @ariaLabel={{@ariaLabel}}
            {{on "click" this.onCloseButtonClick}}
          />
        {{/unless}}
      </div>
    {{/if}}
  </template>
}

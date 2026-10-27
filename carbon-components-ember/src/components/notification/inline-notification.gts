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
import type {
  NotificationArgs,
  NotificationCloseHandler,
} from './-notification-args.ts';
import type { NotificationKind } from './-notification-icon.gts';

export interface InlineNotificationSignature {
  Element: HTMLDivElement;
  Args: NotificationArgs & {
    /**
     * Provide a function that is called when the close button closes the
     * notification. Return `false` to keep it open.
     */
    onClose?: NotificationCloseHandler;
    /**
     * Provide a function that is called when the close button is clicked.
     */
    onCloseButtonClick?: (event: MouseEvent) => void;
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
            @iconDescription={{@statusIconDescription}}
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

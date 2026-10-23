/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { modifier } from 'ember-modifier';
import Text from '../text.gts';
import NotificationActionButton from './notification-action-button.gts';
import NotificationButton from './notification-button.gts';
import NotificationIcon from './-notification-icon.gts';
import type { NotificationKind } from './-notification-icon.gts';

const TABBABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

const tabbables = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLElement>(TABBABLE)].filter(
    (element) => element.tabIndex >= 0 && element.getClientRects().length > 0,
  );

export interface ActionableNotificationSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * Pass in the action button label that will be rendered within the
     * ActionableNotification. Without it, there's no action button.
     */
    actionButtonLabel?: string;
    /**
     * Provide a description for the "close" icon button that can be read by
     * screen readers. Carbon React's `aria-label`; an `aria-label` attribute
     * would label the notification instead.
     */
    ariaLabel?: string;
    /**
     * Specify the caption.
     */
    caption?: string;
    /**
     * Specify if pressing the escape key should close the notification.
     * Defaults to `true`.
     */
    closeOnEscape?: boolean;
    /**
     * Specify whether the close button should be hidden.
     */
    hideCloseButton?: boolean;
    /**
     * Style the notification like an `InlineNotification` instead of a toast.
     */
    inline?: boolean;
    /**
     * Specify what state the notification represents. Defaults to `'error'`.
     */
    kind?: NotificationKind;
    /**
     * Specify whether you are using the low contrast variant of the
     * ActionableNotification.
     */
    lowContrast?: boolean;
    /**
     * Provide a function that is called when the action is clicked.
     */
    onActionButtonClick?: (event: MouseEvent) => void;
    /**
     * Provide a function that is called when the close button or the escape
     * key closes the notification. Return `false` to keep it open.
     */
    onClose?: (event: MouseEvent | KeyboardEvent) => boolean | void;
    /**
     * Provide a function that is called when the close button is clicked, or
     * the escape key is pressed.
     */
    onCloseButtonClick?: (event: MouseEvent | KeyboardEvent) => void;
    /**
     * Provide an accessible role. Defaults to `'alertdialog'`, which moves
     * focus to the action button and keeps it inside the notification. Any
     * other role does neither, so make the notification reachable another
     * way, or use a `Callout`.
     */
    role?: string;
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
    /** More content, after the caption: links, other interactive elements or rich text. */
    default: [];
  };
}

/**
 * A notification that needs the user to act. It can hold an action, other
 * interactive elements or rich text, and keeps focus until the user acts on
 * it or closes it.
 */
export default class ActionableNotification extends Component<ActionableNotificationSignature> {
  @tracked isOpen = true;

  guid = guidFor(this);
  titleId = `${this.guid}-title`;
  subtitleId = `${this.guid}-subtitle`;

  get kind(): NotificationKind {
    return this.args.kind ?? 'error';
  }

  get role() {
    return this.args.role ?? 'alertdialog';
  }

  get isAlertDialog() {
    return this.role === 'alertdialog';
  }

  get statusIconDescription() {
    return this.args.statusIconDescription || `${this.kind} icon`;
  }

  close = (event: MouseEvent | KeyboardEvent) => {
    this.args.onCloseButtonClick?.(event);
    if (this.args.onClose?.(event) !== false) this.isOpen = false;
  };

  onActionButtonClick = (event: MouseEvent) => {
    this.args.onActionButtonClick?.(event);
  };

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.args.closeOnEscape !== false) {
      this.close(event);
      // Once it closes, stopped, so a Modal the toast is in stays open.
      if (!this.isOpen) event.stopPropagation();
    } else if (event.key === 'Tab' && this.isAlertDialog) {
      const container = event.currentTarget as HTMLElement;
      const elements = tabbables(container);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!event.shiftKey && event.target === last) {
        event.preventDefault();
        first?.focus();
      } else if (event.shiftKey && event.target === first) {
        event.preventDefault();
        last?.focus();
      }
    }
  };

  focusOnInsert = modifier((element: HTMLElement, [focus]: [boolean]) => {
    if (focus) element.focus();
  });

  <template>
    {{#if this.isOpen}}
      {{! Keys pressed on its controls bubble here: Escape and the focus wrap. }}
      {{! eslint-disable-next-line ember/template-no-invalid-interactive }}
      <div
        role={{this.role}}
        class="cds--actionable-notification cds--actionable-notification--{{this.kind}}
          {{unless @inline 'cds--actionable-notification--toast'}}
          {{if @lowContrast 'cds--actionable-notification--low-contrast'}}
          {{if
            @hideCloseButton
            'cds--actionable-notification--hide-close-button'
          }}"
        aria-labelledby={{if @title this.titleId this.subtitleId}}
        {{on "keydown" this.onKeyDown}}
        ...attributes
      >
        <div class="cds--actionable-notification__focus-wrapper">
          <div class="cds--actionable-notification__details">
            <NotificationIcon
              @notificationType={{if @inline "inline" "toast"}}
              @kind={{this.kind}}
              @iconDescription={{this.statusIconDescription}}
            />
            <div class="cds--actionable-notification__text-wrapper">
              <div class="cds--actionable-notification__content">
                {{#if @title}}
                  <Text
                    @as="div"
                    class="cds--actionable-notification__title"
                    id={{this.titleId}}
                  >
                    {{@title}}
                  </Text>
                {{/if}}
                {{#if @subtitle}}
                  <Text
                    @as="div"
                    class="cds--actionable-notification__subtitle"
                    id={{this.subtitleId}}
                  >
                    {{@subtitle}}
                  </Text>
                {{/if}}
                {{#if @caption}}
                  <Text @as="div" class="cds--actionable-notification__caption">
                    {{@caption}}
                  </Text>
                {{/if}}
                {{yield}}
              </div>
            </div>
          </div>
          <div class="cds--actionable-notification__button-wrapper">
            {{#if @actionButtonLabel}}
              <NotificationActionButton
                @inline={{@inline}}
                {{on "click" this.onActionButtonClick}}
                {{this.focusOnInsert this.isAlertDialog}}
              >
                {{@actionButtonLabel}}
              </NotificationActionButton>
            {{/if}}
            {{#unless @hideCloseButton}}
              <NotificationButton
                @notificationType="actionable"
                @ariaLabel={{@ariaLabel}}
                {{on "click" this.close}}
              />
            {{/unless}}
          </div>
        </div>
      </div>
    {{/if}}
  </template>
}

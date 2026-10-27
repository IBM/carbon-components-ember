/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TOC } from '@ember/component/template-only';
import Text from '../text.gts';
import NotificationActionButton from './notification-action-button.gts';
import NotificationIcon from './-notification-icon.gts';

export interface CalloutSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * Pass in the action button label that will be rendered within the
     * Callout. Without it, there's no action button.
     */
    actionButtonLabel?: string;
    /**
     * Specify what state the notification represents: `'info'` (default) or
     * `'warning'`.
     */
    kind?: 'info' | 'warning';
    /**
     * Specify whether you are using the low contrast variant of the Callout.
     */
    lowContrast?: boolean;
    /**
     * Provide a function that is called when the action is clicked.
     */
    onActionButtonClick?: (event: MouseEvent) => void;
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
    /**
     * Specify the id for the element containing the title. Give interactive
     * elements in the block an `aria-describedby` with this id.
     */
    titleId?: string;
  };
  Blocks: {
    /** More content, after the subtitle, such as a link. */
    default: [];
  };
}

const noop = () => {};

/**
 * A passive notification that loads with the page's content, next to what it
 * relates to. Screen readers don't announce it, and it can't be closed.
 */
const Callout: TOC<CalloutSignature> = <template>
  {{#let (or @kind "info") as |kind|}}
    <div
      class="cds--actionable-notification cds--actionable-notification--callout cds--actionable-notification--{{kind}}
        cds--actionable-notification--hide-close-button
        {{if @lowContrast 'cds--actionable-notification--low-contrast'}}"
      ...attributes
    >
      <div class="cds--actionable-notification__details">
        <NotificationIcon
          @notificationType="inline"
          @kind={{kind}}
          @iconDescription={{@statusIconDescription}}
        />
        <div class="cds--actionable-notification__text-wrapper">
          {{#if @title}}
            <Text
              @as="div"
              class="cds--actionable-notification__title"
              id={{@titleId}}
            >
              {{@title}}
            </Text>
          {{/if}}
          {{#if @subtitle}}
            <Text @as="div" class="cds--actionable-notification__subtitle">
              {{@subtitle}}
            </Text>
          {{/if}}
          {{yield}}
        </div>
      </div>
      <div class="cds--actionable-notification__button-wrapper">
        {{#if @actionButtonLabel}}
          <NotificationActionButton
            @inline={{true}}
            aria-describedby={{@titleId}}
            {{on "click" (or @onActionButtonClick noop)}}
          >
            {{@actionButtonLabel}}
          </NotificationActionButton>
        {{/if}}
      </div>
    </div>
  {{/let}}
</template>;

export default Callout;

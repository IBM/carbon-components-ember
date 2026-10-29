/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import Button from '../button.gts';
import type { IconComponent } from '../icon.gts';
import './card.scss';

/**
 * Subset of Carbon's `BUTTON_KIND` this addon's own `Button` component can
 * actually render (it has no `danger--ghost`/`danger--tertiary` etc.
 * equivalents).
 */
export type CardFooterActionKind =
  'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';

export type CardFooterAction = {
  label: string;
  id: string;
  kind?: CardFooterActionKind;
  disabled?: boolean;
  icon?: IconComponent;
  onClick?: () => void;
  tooltipText?: string;
  /**
   * When `true`, the action is disabled and rendered in a visually reversed
   * (icon-leading) order — matches upstream's "viewing" state for an
   * action the user has already triggered.
   */
  isViewing?: boolean;
};

export interface CardFooterSignature {
  Element: HTMLDivElement;
  Args: {
    actions?: CardFooterAction[];
    onAction?: (action: CardFooterAction) => void;
  };
}

/**
 * Footer action bar for `Card`.
 *
 * Ember port of `@carbon/ai-chat-components`'
 * [`cds-aichat-card-footer`](https://github.com/carbon-design-system/carbon-ai-chat/tree/main/packages/ai-chat-components/src/components/card).
 * Upstream dispatches a `cds-aichat-card-footer-action` custom event with
 * the clicked action as its detail; this port calls `@onAction` with the
 * same action object instead, matching this addon's callback-arg
 * convention elsewhere (e.g. `Launcher`'s `@onToggle`).
 *
 * Renders nothing when `@actions` is empty, matching upstream. When every
 * action lacks a `label`, switches to a row of icon-only buttons (each
 * wrapped in a `Tooltip` using `tooltipText`) — upstream derives this the
 * same way, from the actions list itself rather than a separate arg.
 */
export default class CardFooter extends Component<CardFooterSignature> {
  get actions() {
    return this.args.actions ?? [];
  }

  get isIconButton() {
    return this.actions.length > 0 && this.actions.every((a) => !a.label);
  }

  get isStacked() {
    return this.actions.length > 2;
  }

  handleAction = (action: CardFooterAction) => {
    action.onClick?.();
    this.args.onAction?.(action);
  };

  <template>
    {{#if this.actions.length}}
      {{#if this.isIconButton}}
        <div
          class="cds-aichat-card-footer__icon-actions"
          data-rounded="bottom-right"
          data-stacked={{this.isStacked}}
          ...attributes
        >
          {{#each this.actions as |cardAction|}}
            <Button
              @kind={{or cardAction.kind "ghost"}}
              @hasIconOnly={{true}}
              @iconDescription={{cardAction.tooltipText}}
              @disabled={{cardAction.disabled}}
              {{on "click" (fn this.handleAction cardAction)}}
            >
              {{#if cardAction.icon}}
                <cardAction.icon
                  @size={{16}}
                  @fill="currentColor"
                  @svgClass="cds-aichat-card-footer__action-icon"
                />
              {{/if}}
            </Button>
          {{/each}}
        </div>
      {{else}}
        <div
          class="cds-aichat-card-footer__actions
            {{if this.isStacked 'cds-aichat-card-footer__actions--stacked'}}"
          data-rounded="bottom"
          data-stacked={{this.isStacked}}
          ...attributes
        >
          {{#each this.actions as |cardAction|}}
            <Button
              @kind={{or cardAction.kind "secondary"}}
              @disabled={{or cardAction.disabled cardAction.isViewing}}
              class={{if
                cardAction.isViewing
                "cds-aichat-card-footer__action-viewing"
              }}
              {{on "click" (fn this.handleAction cardAction)}}
            >
              {{#if cardAction.isViewing}}
                {{#if cardAction.icon}}<cardAction.icon
                    @size={{16}}
                    @fill="currentColor"
                    @svgClass="cds-aichat-card-footer__action-icon"
                  />{{/if}}
                {{cardAction.label}}
              {{else}}
                {{cardAction.label}}
                {{#if cardAction.icon}}<cardAction.icon
                    @size={{16}}
                    @fill="currentColor"
                    @svgClass="cds-aichat-card-footer__action-icon"
                  />{{/if}}
              {{/if}}
            </Button>
          {{/each}}
        </div>
      {{/if}}
    {{/if}}
  </template>
}

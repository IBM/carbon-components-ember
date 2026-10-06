/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import Button from '../button.gts';
import Tooltip from '../tooltip.gts';
import type { ComponentLike } from '@glint/template';

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
  icon?: ComponentLike<{
    Args: { size?: number; svgClass?: string; fill?: string };
  }>;
  onClick?: () => void;
  tooltipText?: string;
  /**
   * When `true`, the action is disabled and rendered in a visually reversed
   * (icon-leading) order — matches upstream's "viewing" state for an
   * action the user has already triggered.
   */
  isViewing?: boolean;
};

export type Args = {
  actions?: CardFooterAction[];
  onAction?: (action: CardFooterAction) => void;
};

export interface AiChatCardFooterSignature {
  Element: HTMLDivElement;
  Args: Args;
}

/**
 * Footer action bar for `AiChatCard`.
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
export default class AiChatCardFooter extends Component<AiChatCardFooterSignature> {
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

  /**
   * Resolves `action.kind` (defaulting per upstream, `'secondary'` for
   * labeled actions and `'ghost'` for icon-only ones) to `Button`'s own
   * `@type`/`@tertiary`/`@ghost` args. `Button` treats those three as
   * independently-truthy flags rather than a single mutually-exclusive
   * variant, so exactly one of them must be set per resolved kind:
   * `@type` for `'primary'`/`'secondary'`, and `undefined` (with
   * `@tertiary`/`@ghost` instead) for `'tertiary'`/`'ghost'`.
   *
   * `'danger'` is styled with the `cds--btn--danger` class rather than
   * `Button`'s `@type='danger'`, which also makes `Button` ask for
   * confirmation before calling `@onClick` (upstream's danger kind is
   * styling only) - the same approach as `AiChatChatButton`.
   */
  buttonType = (
    kind: CardFooterActionKind | undefined,
    fallback: CardFooterActionKind,
  ) => {
    const resolved = kind ?? fallback;
    return resolved === 'tertiary' ||
      resolved === 'ghost' ||
      resolved === 'danger'
      ? undefined
      : resolved;
  };

  buttonDanger = (
    kind: CardFooterActionKind | undefined,
    fallback: CardFooterActionKind,
  ) => (kind ?? fallback) === 'danger';

  buttonTertiary = (
    kind: CardFooterActionKind | undefined,
    fallback: CardFooterActionKind,
  ) => (kind ?? fallback) === 'tertiary';

  buttonGhost = (
    kind: CardFooterActionKind | undefined,
    fallback: CardFooterActionKind,
  ) => (kind ?? fallback) === 'ghost';

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
            <Tooltip @label={{cardAction.tooltipText}}>
              <Button
                class={{if
                  (this.buttonDanger cardAction.kind "ghost")
                  "cds--btn--danger"
                }}
                @type={{this.buttonType cardAction.kind "ghost"}}
                @tertiary={{this.buttonTertiary cardAction.kind "ghost"}}
                @ghost={{this.buttonGhost cardAction.kind "ghost"}}
                @iconOnly={{true}}
                @disabled={{cardAction.disabled}}
                @onClick={{fn this.handleAction cardAction}}
              >
                {{#if cardAction.icon}}
                  <cardAction.icon
                    @size={{16}}
                    @fill="currentColor"
                    @svgClass="cds-aichat-card-footer__action-icon"
                  />
                {{/if}}
              </Button>
            </Tooltip>
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
              class="{{if
                  (this.buttonDanger cardAction.kind 'secondary')
                  'cds--btn--danger'
                }}
                {{if
                  cardAction.isViewing
                  'cds-aichat-card-footer__action-viewing'
                }}"
              @type={{this.buttonType cardAction.kind "secondary"}}
              @tertiary={{this.buttonTertiary cardAction.kind "secondary"}}
              @ghost={{this.buttonGhost cardAction.kind "secondary"}}
              @disabled={{or cardAction.disabled cardAction.isViewing}}
              @onClick={{fn this.handleAction cardAction}}
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
